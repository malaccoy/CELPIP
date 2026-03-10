import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/../auth';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface SectionResult {
  section: string;
  label: string;
  score: number;
  total: number;
  writingText?: string;
  writingPrompt?: string;
  timeTaken: number;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sections, totalTime } = await req.json() as {
      sections: SectionResult[];
      totalTime: number;
    };

    if (!sections?.length) {
      return NextResponse.json({ error: 'No sections provided' }, { status: 400 });
    }

    // Build the evaluation prompt
    const sectionSummaries = sections.map(s => {
      let detail = `**${s.label}** — `;
      if (s.section === 'writing') {
        const wc = s.writingText?.trim().split(/\s+/).filter(w => w.length > 0).length || 0;
        detail += `${wc} words written in ${Math.round(s.timeTaken / 60)} min\n`;
        detail += `Prompt: ${s.writingPrompt || 'N/A'}\n`;
        detail += `Student's text:\n"""${s.writingText || '(empty)'}"""`;
      } else if (s.section === 'speaking') {
        detail += `(practice only, no recording)`;
      } else {
        detail += `${s.score}/${s.total} correct (${Math.round(s.total > 0 ? s.score / s.total * 100 : 0)}%) in ${Math.round(s.timeTaken / 60)} min`;
      }
      return detail;
    }).join('\n\n');

    const writingSection = sections.find(s => s.section === 'writing' && s.writingText?.trim());
    const listeningResults = sections.filter(s => s.section === 'listening');
    const readingResults = sections.filter(s => s.section === 'reading');

    const listeningTotal = listeningResults.reduce((a, s) => a + s.total, 0);
    const listeningCorrect = listeningResults.reduce((a, s) => a + s.score, 0);
    const readingTotal = readingResults.reduce((a, s) => a + s.total, 0);
    const readingCorrect = readingResults.reduce((a, s) => a + s.score, 0);

    const systemPrompt = `You are a STRICT CELPIP exam evaluator. The student just completed a mock CELPIP exam.
Evaluate their performance HONESTLY — do not inflate scores.

CELPIP CLB Level Scale (apply strictly):
- CLB 3-4: <40% on Listening/Reading, Writing is incoherent or mostly off-topic
- CLB 5: 40-49%, basic writing with many errors, barely addresses the prompt
- CLB 6: 50-59%, developing writing, frequent errors but communicates basic ideas
- CLB 7: 60-69%, adequate writing, noticeable errors, limited vocabulary
- CLB 8: 70-79%, competent writing, some errors that don't impede understanding
- CLB 9: 80-89%, strong writing with minor errors, good vocabulary range
- CLB 10+: 90%+, sophisticated grammar/vocabulary, clear organization

CRITICAL RULES:
- If writing is <50 words or gibberish → Writing CLB 3-4 max
- If writing doesn't address the prompt → Writing CLB 3-4 max
- If Listening/Reading scores are below 50% → that skill is CLB 6 or below
- Overall CLB should be the LOWEST of the individual skills (weakest link)
- Most test-takers score CLB 6-8. CLB 9+ is genuinely excellent.

For WRITING evaluation, assess:
1. Content & Coherence (does it address all bullet points? logical flow?)
2. Vocabulary (range, accuracy, appropriateness)
3. Grammar (sentence structure, tense accuracy, articles, prepositions)
4. Task Fulfillment (word count, tone, format)
Give specific examples from their text when pointing out errors or strengths.

Respond in JSON format:
{
  "overallCLB": "7",
  "listeningCLB": "8",
  "readingCLB": "7",
  "writingCLB": "7",
  "speakingNote": "Not evaluated (no recording)",
  "overallFeedback": "2-3 sentence overall assessment",
  "listeningFeedback": { "strengths": ["..."], "improvements": ["..."], "tips": ["..."] },
  "readingFeedback": { "strengths": ["..."], "improvements": ["..."], "tips": ["..."] },
  "writingFeedback": {
    "score": "7",
    "strengths": ["..."],
    "errors": [{ "original": "exact text", "correction": "corrected version", "explanation": "why" }],
    "improvements": ["..."],
    "modelResponse": "A sample well-written response to the same prompt (150-200 words)"
  },
  "studyPlan": ["Priority 1: ...", "Priority 2: ...", "Priority 3: ..."],
  "encouragement": "A motivating closing message"
}`;

    const userPrompt = `MOCK EXAM RESULTS (Total time: ${Math.round(totalTime / 60)} minutes):

${sectionSummaries}

SUMMARY:
- Listening: ${listeningCorrect}/${listeningTotal} (${listeningTotal > 0 ? Math.round(listeningCorrect / listeningTotal * 100) : 0}%)
- Reading: ${readingCorrect}/${readingTotal} (${readingTotal > 0 ? Math.round(readingCorrect / readingTotal * 100) : 0}%)
- Writing: ${writingSection ? 'Submitted' : 'Not submitted'}
- Speaking: Practice only

Please evaluate this student's performance and provide detailed feedback with CLB level estimates.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
      max_tokens: 3000,
    });

    const feedback = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('Mock exam evaluation error:', error);
    return NextResponse.json({ error: 'Evaluation failed' }, { status: 500 });
  }
}
