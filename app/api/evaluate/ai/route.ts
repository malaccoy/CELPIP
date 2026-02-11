import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { requirePro } from '@/lib/plan';

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
  type: 'grammar' | 'spelling' | 'punctuation' | 'style' | 'vocabulary';
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

const TASK1_SYSTEM_PROMPT = `You are an expert CELPIP Writing Task 1 evaluator. Task 1 requires writing a formal or semi-formal email (150-200 words).

EVALUATION CRITERIA (CELPIP Official):
1. Content/Coherence (0-12): Does the email address all required points? Is it logical and well-organized?
2. Vocabulary (0-12): Is vocabulary varied and appropriate for the context?
3. Grammar (0-12): Are grammar and sentence structures accurate and varied?
4. Structure (0-12): Does it follow proper email format with all 5 mandatory elements?

THE 5 MANDATORY ELEMENTS:
1. Opening: "Dear [Name/Title],"
2. Purpose: "I am writing to..." (first or second sentence)
3. Body: Address all points with connectors (First, Second, Third, Finally)
4. CTA (Call-to-Action): A request or suggestion
5. Closing: Polite line + "Regards," + Name

IMPORTANT RULES:
- NO contractions in formal emails (don't → do not)
- Consistent formal tone throughout
- 150-200 words is ideal
- Each point from the prompt must be addressed

You must respond in valid JSON format only.`;

const TASK2_SYSTEM_PROMPT = `You are an expert CELPIP Writing Task 2 evaluator. Task 2 requires responding to a survey/opinion question (150-200 words).

EVALUATION CRITERIA (CELPIP Official):
1. Content/Coherence (0-12): Is the opinion clear? Are arguments logical and well-developed?
2. Vocabulary (0-12): Is vocabulary varied and appropriate?
3. Grammar (0-12): Are grammar and sentence structures accurate and varied?
4. Structure (0-12): Does it follow the PRE structure for arguments?

THE PRE STRUCTURE (for each argument):
- P (Point): State your argument clearly with a connector (First, Second, Finally)
- R (Reason): Explain WHY this point is valid ("This is because...")
- E (Example): Give a specific example ("For example,...")

REQUIRED STRUCTURE:
1. Introduction: Clear opinion statement ("In my opinion, I believe...")
2. Body: 2-3 PRE paragraphs
3. Conclusion: Restate opinion + summarize points ("In conclusion,...")

CRITICAL RULES:
- NEVER use "Option A" or "Option B" - refer to the actual topic
- Take a CLEAR position - no fence-sitting
- Avoid rhetorical questions
- NO contractions
- Can invent facts/statistics - CELPIP doesn't verify

You must respond in valid JSON format only.`;

const EVALUATION_USER_PROMPT = `Evaluate this CELPIP {TASK} writing submission:

{PROMPT_CONTEXT}

STUDENT'S TEXT:
"""
{TEXT}
"""

Provide your evaluation as a JSON object with this exact structure:
{
  "overallScore": <number 4-12>,
  "scores": {
    "content": <number 4-12>,
    "vocabulary": <number 4-12>,
    "grammar": <number 4-12>,
    "structure": <number 4-12>
  },
  "grammarErrors": [
    {
      "original": "<exact text with error>",
      "correction": "<corrected text>",
      "explanation": "<brief explanation in Portuguese>",
      "type": "<grammar|spelling|punctuation|style|vocabulary>"
    }
  ],
  "strengths": ["<strength 1 in Portuguese>", "<strength 2>", ...],
  "improvements": ["<specific improvement suggestion 1 in Portuguese>", ...],
  "correctedText": "<full text with all corrections applied>",
  "feedback": "<2-3 paragraph personalized feedback in Portuguese, like a teacher would give>"
}

Be encouraging but honest. Focus on actionable improvements. All text feedback should be in Brazilian Portuguese.`;

export async function POST(request: NextRequest) {
  try {
    const denied = await requirePro();
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
    const userPrompt = EVALUATION_USER_PROMPT
      .replace('{TASK}', body.task === 'task1' ? 'Task 1 (Email)' : 'Task 2 (Survey Response)')
      .replace('{PROMPT_CONTEXT}', promptContext || '(No original prompt provided)')
      .replace('{TEXT}', body.text);

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 2000,
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
