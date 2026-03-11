import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { requireProWithLimit } from '@/lib/plan';
import { logActivity } from '@/lib/activity';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AIFeedbackRequest {
  task: 'task1' | 'task2';
  text: string;
  action: 'score' | 'make-it-real' | 'corrected' | 'full' | 'full-enhanced';
  context?: {
    scenario?: string;
    questions?: string[];
  };
}

interface ScoreFeedback {
  score: number;
  maxScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  nextLevelTip: string;
}

interface MakeItRealSuggestion {
  category: 'name' | 'place' | 'number' | 'date' | 'detail';
  original: string;
  suggestion: string;
  explanation: string;
}

interface AIFeedbackResponse {
  score?: ScoreFeedback;
  makeItReal?: MakeItRealSuggestion[];
  correctedText?: string;
  grammarErrors?: GrammarError[];
}

interface GrammarError {
  sentence: string;
  error: string;
  correction: string;
  explanation: string;
}

const SCORE_SYSTEM_PROMPT = `You are a STRICT CELPIP Writing examiner. Analyze the text and provide an HONEST score from 1-12.

CELPIP WRITING SCORE BANDS (apply strictly):
- 1-2: Gibberish, off-topic, or near-empty response
- 3: Very limited — barely addresses the prompt, major comprehension issues
- 4: Limited — recognizable attempt but very short, incoherent, or missing most requirements
- 5: Developing — covers the topic partially, many errors, weak structure
- 6: Adequate — addresses the prompt but with noticeable errors, limited vocabulary
- 7: Good — covers all parts, decent structure, some errors that don't impede understanding
- 8: Very Good — well-organized, good vocabulary, minor errors only
- 9: Excellent — sophisticated language, very few errors, strong organization
- 10-12: Expert — near-native writing, nuanced, precise

SCORING CRITERIA:
- Content & Coherence (Is it on topic? Does it flow logically? ALL bullet points addressed?)
- Vocabulary (Range and accuracy of word choice)
- Readability (Clear structure, transitions like First/Second/Finally)
- Task Fulfillment (Did they answer ALL parts of the prompt?)
- Tone & Formality (Appropriate for the context — email vs survey)
- Grammar (Articles, prepositions, verb tenses, subject-verb agreement)

STRICT RULES:
- If text is <50 words → max score 3
- If text doesn't address the prompt at all → score 1-2
- If text has >5 major grammar errors → max score 6
- If text is missing bullet points from the prompt → deduct 1 point per missing bullet
- NEVER give 7+ unless ALL bullet points are addressed AND grammar is mostly correct
- Most learners score 5-7. Scores of 8+ require genuinely strong writing.
- Using contractions (don't, can't, I'm) is fine in emails but deduct in formal writing

Respond in JSON format:
{
  "score": <number 1-12>,
  "summary": "<one sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "nextLevelTip": "<specific actionable tip to gain 1 more point>"
}`;

const MAKE_IT_REAL_SYSTEM_PROMPT = `You are a CELPIP writing coach. Your job is to find GENERIC phrases in the text and suggest SPECIFIC, REALISTIC replacements.

The "Make It Real" technique: CELPIP rewards specific, realistic details. Generic text = low score. Specific text = high score.

Look for opportunities to add:
- NAMES: "the manager" → "Mrs. Patricia Chen"
- PLACES: "the park" → "Stanley Park near the seawall"
- NUMBERS: "expensive" → "$450 more than expected"
- DATES: "recently" → "last Tuesday afternoon"
- DETAILS: "a problem" → "water leaking from the ceiling onto my desk"

Rules:
- Maximum 4 suggestions per text
- Only suggest changes that sound natural
- Explain WHY the change improves the text
- Keep suggestions realistic for a Canadian context

Respond in JSON format:
{
  "suggestions": [
    {
      "category": "<name|place|number|date|detail>",
      "original": "<exact text from the original>",
      "suggestion": "<improved version>",
      "explanation": "<why this is better, max 15 words>"
    }
  ]
}

If the text already has good specific details, return fewer or no suggestions.`;

const CORRECTED_TEXT_PROMPT = `You are a CELPIP Writing expert. Your task is to REWRITE the candidate's text to achieve a score of 11-12/12.

REQUIREMENTS FOR THE CORRECTED VERSION:
1. Keep the SAME topic, context, and main ideas the candidate wrote about
2. Fix all grammar, spelling, and punctuation errors
3. Remove ALL contractions (don't → do not, I'm → I am)
4. Add organization words (First, Second, Furthermore, Finally, etc.)
5. Add specific realistic details (names, places, numbers, dates)
6. Use formal/semi-formal tone appropriate for the task
7. Proper email format (greeting, body paragraphs, professional closing)
8. Include "Please let me know if you have any questions" or similar closing
9. Keep word count between 150-200 words
10. Make it sound natural and professional, not robotic

IMPORTANT: The rewritten text should teach the candidate by example. They should be able to compare their version with yours and understand what a high-scoring response looks like.

Respond with ONLY the corrected text, no explanations or JSON.`;

const GRAMMAR_CHECK_PROMPT = `You are a grammar checker for CELPIP writing. Find SPECIFIC grammar errors in the text.

Focus on:
- Subject-verb agreement
- Verb tense consistency
- Article usage (a/an/the)
- Preposition errors
- Word order problems
- Punctuation mistakes
- Spelling errors
- Run-on sentences
- Sentence fragments

Rules:
- Maximum 5 errors (prioritize the most important ones)
- Quote the EXACT sentence with the error
- Provide the corrected version
- Briefly explain WHY it's wrong

Respond in JSON format:
{
  "errors": [
    {
      "sentence": "<exact sentence from text>",
      "error": "<brief description of the error>",
      "correction": "<corrected sentence>",
      "explanation": "<why this is wrong, max 20 words>"
    }
  ]
}

If the text has no significant grammar errors, return an empty array.`;

export async function POST(request: NextRequest) {
  try {
    const { authenticated, userId, isPro } = await (await import('@/lib/plan')).getUserPlan();
    if (!authenticated || !userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const { checkRateLimit, rateLimitResponse } = await import('@/lib/rate-limit');
    const { allowed } = await checkRateLimit(userId, 'ai-feedback', isPro);
    if (!allowed) return rateLimitResponse() as unknown as NextResponse;

    const body: AIFeedbackRequest = await request.json();

    // Input size limit
    if (body.text && body.text.length > 5000) {
      body.text = body.text.slice(0, 5000);
    }

    // Validate
    if (!body.task || !body.text || !body.action) {
      return NextResponse.json(
        { error: 'Missing required fields: task, text, and action are required' },
        { status: 400 }
      );
    }

    if (body.text.trim().length < 50) {
      return NextResponse.json(
        { error: 'Text too short for analysis. Write at least 50 words.' },
        { status: 400 }
      );
    }

    const response: AIFeedbackResponse = {};

    // Score Predictor
    if (body.action === 'score' || body.action === 'full' || body.action === 'full-enhanced') {
      const taskDescription = body.task === 'task1' 
        ? 'This is a CELPIP Task 1 (Email/Letter writing). The candidate should write a formal or semi-formal email with proper greeting, introduction, body paragraphs, and closing.'
        : 'This is a CELPIP Task 2 (Opinion Survey). The candidate should express their opinion clearly with organized arguments using PRE (Point, Reason, Example) technique.';

      const scoreCompletion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SCORE_SYSTEM_PROMPT },
          { role: 'user', content: `${taskDescription}\n\nCandidate's text:\n\n${body.text}` }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 500,
      });

      const scoreData = JSON.parse(scoreCompletion.choices[0].message.content || '{}');
      response.score = {
        score: scoreData.score || 6,
        maxScore: 12,
        summary: scoreData.summary || 'Analysis complete.',
        strengths: scoreData.strengths || [],
        improvements: scoreData.improvements || [],
        nextLevelTip: scoreData.nextLevelTip || 'Keep practicing!',
      };
    }

    // Make It Real Suggester
    if (body.action === 'make-it-real' || body.action === 'full') {
      const realCompletion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: MAKE_IT_REAL_SYSTEM_PROMPT },
          { role: 'user', content: `Analyze this ${body.task === 'task1' ? 'email' : 'opinion essay'} and suggest specific details to add:\n\n${body.text}` }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.5,
        max_tokens: 600,
      });

      const realData = JSON.parse(realCompletion.choices[0].message.content || '{}');
      response.makeItReal = realData.suggestions || [];
    }

    // Corrected Text Generator
    if (body.action === 'corrected' || body.action === 'full' || body.action === 'full-enhanced') {
      const taskContext = body.task === 'task1' 
        ? 'This is a CELPIP Task 1 email/letter. Rewrite it as a perfect 11-12 score email with proper format.'
        : 'This is a CELPIP Task 2 opinion survey response. Rewrite it as a perfect 11-12 score essay using PRE technique.';

      const correctedCompletion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: CORRECTED_TEXT_PROMPT },
          { role: 'user', content: `${taskContext}\n\nOriginal text to improve:\n\n${body.text}` }
        ],
        temperature: 0.4,
        max_tokens: 800,
      });

      response.correctedText = correctedCompletion.choices[0].message.content || '';
    }

    // Grammar Check (only for full-enhanced)
    if (body.action === 'full-enhanced') {
      const grammarCompletion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: GRAMMAR_CHECK_PROMPT },
          { role: 'user', content: `Check this ${body.task === 'task1' ? 'email' : 'essay'} for grammar errors:\n\n${body.text}` }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
        max_tokens: 800,
      });

      const grammarData = JSON.parse(grammarCompletion.choices[0].message.content || '{}');
      response.grammarErrors = grammarData.errors || [];
    }

    // Log activity for leaderboard
    try {
      const { getUserPlan } = await import('@/lib/plan');
      const plan = await getUserPlan();
      if (plan.userId) {
        await logActivity(plan.userId, 'writing');
      }
    } catch {}

    return NextResponse.json(response);

  } catch (error) {
    console.error('AI Feedback error:', error);
    
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'AI analysis failed. Please try again.' },
      { status: 500 }
    );
  }
}
