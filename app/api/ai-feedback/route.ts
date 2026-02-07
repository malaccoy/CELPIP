import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AIFeedbackRequest {
  task: 'task1' | 'task2';
  text: string;
  action: 'score' | 'make-it-real' | 'full';
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
}

const SCORE_SYSTEM_PROMPT = `You are a CELPIP Writing examiner. Analyze the text and provide a score from 1-12 based on CELPIP criteria:

SCORING CRITERIA:
- Content & Coherence (Is it on topic? Does it flow logically?)
- Vocabulary (Range and accuracy of word choice)
- Readability (Clear structure, organization words like First/Second/Finally)
- Task Fulfillment (Did they answer ALL parts of the prompt?)
- Tone & Formality (Appropriate for the context)

COMMON DEDUCTIONS:
- Using contractions (don't, can't, I'm) = -1 point
- Missing "Please let me know if..." closing = -0.5 point
- No organization words = -1 point
- Too short (<140 words) or too long (>220 words) = -0.5 point
- Generic/vague content without specific details = -1 point
- Wrong greeting format = -0.5 point

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

export async function POST(request: NextRequest) {
  try {
    const body: AIFeedbackRequest = await request.json();

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
    if (body.action === 'score' || body.action === 'full') {
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
