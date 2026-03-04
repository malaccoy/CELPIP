import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { checkIpRateLimit } from '@/lib/ip-rate-limit';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Free assessment evaluation — no paywall
// Uses GPT-4o-mini for cost efficiency (~$0.001 per evaluation)
export async function POST(request: NextRequest) {
  try {
    if (!checkIpRateLimit(request, 'assessment-evaluate', 10)) {
      return NextResponse.json({ error: 'Please try again later.' }, { status: 429 });
    }

    const { text, type, prompt } = await request.json();

    if (!text || !type) {
      return NextResponse.json({ error: 'Missing text or type' }, { status: 400 });
    }

    // Input size limit — prevent token abuse
    const maxLen = type === 'writing' ? 2000 : 500;
    const safeText = typeof text === 'string' ? text.slice(0, maxLen) : '';

    if (type === 'writing') {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a CELPIP writing evaluator. Score this email response on a scale of 1-12 based on CELPIP criteria: content, grammar, vocabulary, organization, and task completion. Be honest and accurate — don't inflate scores. A text full of spelling/grammar errors should score 4-6, not 8+.

Respond in JSON only:
{
  "score": <1-12>,
  "feedback": "<one sentence with the most important improvement needed>"
}`
          },
          {
            role: 'user',
            content: `Task: ${prompt || 'Write an email'}\n\nStudent response:\n${safeText}`
          }
        ],
        temperature: 0.3,
        max_tokens: 100,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');
      return NextResponse.json({
        score: result.score || 5,
        feedback: result.feedback || 'Assessment complete.',
        source: 'ai'
      });
    }

    if (type === 'speaking') {
      // For speaking, we receive a transcript (from Whisper or browser)
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a CELPIP speaking evaluator. Score this spoken response transcript on a scale of 1-12 based on: content/coherence, vocabulary range, task completion, and organization. Note: you cannot assess pronunciation from text alone.

Respond in JSON only:
{
  "score": <1-12>,
  "feedback": "<one sentence with the most important improvement needed>"
}`
          },
          {
            role: 'user',
            content: `Task: ${prompt || 'Give advice'}\n\nTranscript:\n${safeText}`
          }
        ],
        temperature: 0.3,
        max_tokens: 100,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');
      return NextResponse.json({
        score: result.score || 5,
        feedback: result.feedback || 'Assessment complete.',
        source: 'ai'
      });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

  } catch (error) {
    console.error('Assessment evaluate error:', error);
    return NextResponse.json({ error: 'Evaluation failed' }, { status: 500 });
  }
}
