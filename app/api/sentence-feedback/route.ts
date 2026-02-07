import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface SentenceAnalysisRequest {
  task: 'task1' | 'task2';
  text: string;
}

interface SentenceFeedback {
  sentence: string;
  status: 'good' | 'improve' | 'warning';
  feedback: string;
  category?: 'structure' | 'vocabulary' | 'grammar' | 'content' | 'style';
}

interface SentenceAnalysisResponse {
  sentences: SentenceFeedback[];
  summary: {
    good: number;
    improve: number;
    warning: number;
  };
}

const SYSTEM_PROMPT = `You are a CELPIP Writing examiner giving sentence-by-sentence feedback.

For each sentence in the text, provide:
1. status: "good" (no issues), "improve" (could be better), or "warning" (problem that hurts score)
2. feedback: A SHORT comment (max 12 words). Be specific and actionable.
3. category: structure, vocabulary, grammar, content, or style

FEEDBACK STYLE:
- Be encouraging but honest
- Focus on what matters for CELPIP score
- Keep feedback SHORT (max 12 words)
- Use simple language

EXAMPLES OF GOOD FEEDBACK:
✅ "Good opening - clear who you are"
✅ "Add a specific example here"
✅ "Avoid contractions in formal writing"
✅ "Strong use of organization word"
✅ "Consider a more specific detail"
✅ "Missing 'Please let me know if...'"

Respond in JSON format:
{
  "sentences": [
    {
      "sentence": "<exact sentence from text>",
      "status": "good|improve|warning",
      "feedback": "<short feedback max 12 words>",
      "category": "structure|vocabulary|grammar|content|style"
    }
  ]
}

Rules:
- Analyze EVERY sentence (split by periods, exclamation marks, question marks)
- Keep "good" feedback short: just "Good" or "Clear structure" is enough
- Focus "improve" and "warning" on actionable advice
- Mark contractions as "warning" (CELPIP rule)
- Mark missing organization words as "improve"
- Be encouraging when sentences are good`;

export async function POST(request: NextRequest) {
  try {
    const body: SentenceAnalysisRequest = await request.json();

    // Validate
    if (!body.task || !body.text) {
      return NextResponse.json(
        { error: 'Missing required fields: task and text are required' },
        { status: 400 }
      );
    }

    if (body.text.trim().length < 30) {
      return NextResponse.json(
        { error: 'Text too short for analysis. Write at least a few sentences.' },
        { status: 400 }
      );
    }

    const taskContext = body.task === 'task1'
      ? 'This is a CELPIP Task 1 (Formal Email). Check for: proper greeting, introduction (who + why), organized body with First/Second/Finally, closing with "Please let me know if...", and sign-off.'
      : 'This is a CELPIP Task 2 (Opinion Survey). Check for: clear opinion statement, PRE technique (Point, Reason, Example) in each paragraph, organization words, and strong conclusion.';

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `${taskContext}\n\nAnalyze each sentence:\n\n${body.text}` }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 1500,
    });

    const data = JSON.parse(completion.choices[0].message.content || '{}');
    
    const sentences: SentenceFeedback[] = data.sentences || [];
    
    // Calculate summary
    const summary = {
      good: sentences.filter(s => s.status === 'good').length,
      improve: sentences.filter(s => s.status === 'improve').length,
      warning: sentences.filter(s => s.status === 'warning').length,
    };

    const response: SentenceAnalysisResponse = {
      sentences,
      summary,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Sentence analysis error:', error);
    
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status: 500 }
    );
  }
}
