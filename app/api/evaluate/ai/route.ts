import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { requireProWithLimit } from '@/lib/plan';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AIEvaluateRequestBody {
  task: 'task1' | 'task2';
  text: string;
  prompt?: string; // The original task prompt/scenario
  context?: {
    formality?: 'formal' | 'semi-formal';
    recipient?: string;
    situation?: string;
  };
}

interface GrammarError {
  original: string;
  correction: string;
  explanation: string;
  type: 'grammar' | 'spelling' | 'punctuation' | 'style' | 'vocabulary' | 'content';
}

interface AIEvaluationResult {
  overallScore: number;
  scores: {
    content: number;
    vocabulary: number;
    grammar: number;
    structure: number;
  };
  grammarErrors: GrammarError[];
  strengths: string[];
  improvements: string[];
  correctedText: string;
  feedback: string;
}

const TASK1_SYSTEM_PROMPT = `You are a STRICT CELPIP Writing Task 1 evaluator. Task 1 = formal/semi-formal email, 150-200 words.

SCORING RULES (be harsh but fair):
1. Content (0-12): Does it address ALL points from the prompt? Incomplete = max 5. Placeholders like [reason], [Name], ... = max 3.
2. Vocabulary (0-12): Varied, context-appropriate? Repetitive/basic = max 6. Non-English words = -2 per occurrence.
3. Grammar (0-12): Accurate structures? Each error = -0.5. Fragments/incomplete sentences = max 4.
4. Structure (0-12): Proper email format with 5 elements? Missing elements = -2 each.

THE 5 MANDATORY ELEMENTS: Opening greeting, Purpose statement, Body paragraphs, CTA, Closing + sign-off.

CRITICAL — FLAG ALL OF THESE AS ERRORS:
- Placeholders: [reason], [Name], [Point], ..., etc. → type "content" (these are NOT real writing)
- Non-English text (any language) → type "vocabulary"  
- Incomplete sentences ("Secondly, ...") → type "content"
- Template text not filled in → type "content"
- Missing contractions fix (don't → do not in formal) → type "style"
- Word count issues: <100 words = max score 4, <150 = max score 7
- Gibberish or random text = max score 2

ERROR TYPES to use: "grammar", "spelling", "punctuation", "style", "vocabulary", "content"

Be thorough — find EVERY error, not just 2-3. A text with placeholders and incomplete paragraphs should have 5-10+ errors flagged.

You must respond in valid JSON format only.`;

const TASK2_SYSTEM_PROMPT = `You are a STRICT CELPIP Writing Task 2 evaluator. Task 2 = survey/opinion response, 150-200 words.

SCORING RULES (be harsh but fair):
1. Content (0-12): Clear opinion? Developed arguments? Vague/incomplete = max 5. Placeholders = max 3.
2. Vocabulary (0-12): Varied, appropriate? Basic/repetitive = max 6. Non-English = -2 per occurrence.
3. Grammar (0-12): Accurate? Each error = -0.5. Fragments = max 4.
4. Structure (0-12): PRE structure (Point-Reason-Example) for each argument? Missing PRE parts = -2 each.

PRE STRUCTURE per argument:
- P: Clear point with connector (First, Second, Finally)
- R: Reason ("This is because...")
- E: Specific example ("For example,...")

CRITICAL — FLAG ALL OF THESE:
- Placeholders: [Point], [Reason], [Example], ... → type "content"
- Non-English text → type "vocabulary"
- Incomplete sentences → type "content"
- Template text not filled in → type "content"
- "Option A"/"Option B" instead of actual topic → type "style"
- Word count: <100 = max 4, <150 = max 7
- Gibberish = max 2

ERROR TYPES: "grammar", "spelling", "punctuation", "style", "vocabulary", "content"

Be thorough — flag EVERY issue. Respond in valid JSON only.`;

const EVALUATION_USER_PROMPT = `Evaluate this CELPIP {TASK} writing submission. Be a STRICT teacher.

{PROMPT_CONTEXT}

STUDENT'S TEXT:
"""
{TEXT}
"""

Word count: {WORD_COUNT}

MANDATORY SCORING RULES — YOU MUST FOLLOW THESE:
1. Count placeholders: [reason], [Name], [My Name], "..." incomplete sentences, template fragments. Each placeholder/incomplete sentence = content error.
2. Count non-English words/phrases. Each = vocabulary error.
3. If text has ANY placeholders or "[...]" brackets: ALL four scores MUST be ≤ 5. No exceptions.
4. If text has incomplete sentences (ending in "..."): content and structure scores MUST be ≤ 4.
5. If word count < 80: ALL scores MUST be ≤ 4. If < 50: ALL scores MUST be ≤ 3.
6. If text mixes languages: vocabulary score MUST be ≤ 4.
7. Vocabulary score measures ACTUAL vocabulary used — template words like "I am writing to [reason]" show ZERO real vocabulary. Score what the student ACTUALLY wrote, not the template.
8. overallScore = floor(average of 4 scores).

EXAMPLE: A text like "Dear Sir, I am writing to [reason]. My name is [Name]... Secondly, ... Regards, [My Name]" should score: content 2, vocabulary 2, grammar 3, structure 3, overall 2. It has 5+ placeholders, 3+ incomplete sentences, <80 real words, and shows almost no actual writing ability.

Find EVERY error (expect 5-20 for imperfect texts). Types: grammar, spelling, punctuation, style, vocabulary, content.

JSON response:
{
  "overallScore": <1-12>,
  "scores": { "content": <1-12>, "vocabulary": <1-12>, "grammar": <1-12>, "structure": <1-12> },
  "grammarErrors": [{ "original": "<exact text>", "correction": "<fix>", "explanation": "<why>", "type": "<type>" }],
  "strengths": ["..."],
  "improvements": ["..."],
  "correctedText": "<full corrected text with placeholders replaced and incomplete parts expanded into proper sentences>",
  "feedback": "<2-3 paragraphs honest English feedback>"
}`;

export async function POST(request: NextRequest) {
  try {
    const denied = await requireProWithLimit('evaluate-ai');
    if (denied) return denied;

    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const body: AIEvaluateRequestBody = await request.json();
    
    // Validate required fields
    if (!body.task || !body.text) {
      return NextResponse.json(
        { error: 'Missing required fields: task and text are required' },
        { status: 400 }
      );
    }

    // Validate task type
    if (body.task !== 'task1' && body.task !== 'task2') {
      return NextResponse.json(
        { error: 'Invalid task type. Must be "task1" or "task2"' },
        { status: 400 }
      );
    }

    // Validate text length
    if (body.text.trim().length < 50) {
      return NextResponse.json(
        { error: 'Text is too short for evaluation. Write at least 50 characters.' },
        { status: 400 }
      );
    }

    // Build prompt context
    let promptContext = '';
    if (body.prompt) {
      promptContext = `ORIGINAL TASK PROMPT:\n"""${body.prompt}"""\n`;
    }
    if (body.context?.formality) {
      promptContext += `\nFORMALITY: ${body.context.formality}`;
    }
    if (body.context?.recipient) {
      promptContext += `\nRECIPIENT: ${body.context.recipient}`;
    }
    if (body.context?.situation) {
      promptContext += `\nSITUATION: ${body.context.situation}`;
    }

    // Select system prompt based on task
    const systemPrompt = body.task === 'task1' ? TASK1_SYSTEM_PROMPT : TASK2_SYSTEM_PROMPT;
    
    // Build user prompt
    const wordCount = body.text.trim().split(/\s+/).filter(Boolean).length;
    const userPrompt = EVALUATION_USER_PROMPT
      .replace('{TASK}', body.task === 'task1' ? 'Task 1 (Email)' : 'Task 2 (Survey Response)')
      .replace('{PROMPT_CONTEXT}', promptContext || '(No original prompt provided)')
      .replace('{TEXT}', body.text)
      .replace('{WORD_COUNT}', String(wordCount));

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.1,
      max_tokens: 3000,
      response_format: { type: 'json_object' }
    });

    const responseText = completion.choices[0]?.message?.content;
    
    if (!responseText) {
      throw new Error('Empty response from OpenAI');
    }

    // Parse JSON response
    let result: AIEvaluationResult;
    try {
      result = JSON.parse(responseText);
    } catch {
      console.error('Failed to parse OpenAI response:', responseText);
      throw new Error('Invalid JSON response from OpenAI');
    }

    // Validate and sanitize the response
    const sanitizedResult: AIEvaluationResult = {
      overallScore: Math.min(12, Math.max(4, result.overallScore || 6)),
      scores: {
        content: Math.min(12, Math.max(4, result.scores?.content || 6)),
        vocabulary: Math.min(12, Math.max(4, result.scores?.vocabulary || 6)),
        grammar: Math.min(12, Math.max(4, result.scores?.grammar || 6)),
        structure: Math.min(12, Math.max(4, result.scores?.structure || 6)),
      },
      grammarErrors: Array.isArray(result.grammarErrors) ? result.grammarErrors : [],
      strengths: Array.isArray(result.strengths) ? result.strengths : [],
      improvements: Array.isArray(result.improvements) ? result.improvements : [],
      correctedText: result.correctedText || body.text,
      feedback: result.feedback || 'Avaliação concluída.',
    };

    return NextResponse.json({
      success: true,
      evaluation: sanitizedResult,
      usage: {
        promptTokens: completion.usage?.prompt_tokens,
        completionTokens: completion.usage?.completion_tokens,
        totalTokens: completion.usage?.total_tokens,
      }
    });

  } catch (error) {
    console.error('AI Evaluation error:', error);
    
    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        return NextResponse.json(
          { error: 'Invalid OpenAI API key' },
          { status: 500 }
        );
      }
      if (error.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again in a moment.' },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: `OpenAI API error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to evaluate text. Please try again.' },
      { status: 500 }
    );
  }
}
