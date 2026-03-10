import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { checkIpRateLimit } from '@/lib/ip-rate-limit';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Free assessment evaluation — no paywall
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
            content: `You are a strict CELPIP Writing evaluator conducting an initial diagnostic assessment. Your goal is to give an HONEST, ACCURATE score — this is the user's first impression and it must reflect their real level so they trust the platform.

SCORING CRITERIA (CELPIP scale 1-12):

**Content & Coherence (25%)**
- Does the response fully address ALL parts of the prompt?
- Is there a clear purpose and logical flow?
- Are ideas developed with specific details/examples?

**Vocabulary (25%)**
- Range and precision of word choice
- Appropriate register (formal vs informal)
- Avoidance of repetition

**Grammar & Accuracy (25%)**
- Sentence structure variety (simple, compound, complex)
- Subject-verb agreement, tense consistency
- Articles, prepositions, spelling

**Task Completion (25%)**
- Email format (greeting, body, closing, sign-off)
- Appropriate tone for the situation
- Word count adequacy (too short = major penalty)

STRICT SCORING GUIDELINES:
- 1-3: Cannot communicate basic ideas. Major errors in every sentence.
- 4-5: Very basic English. Frequent grammar/spelling errors. Incomplete task.
- 6-7: Functional but limited. Some errors that occasionally impede understanding. Task partially addressed.
- 8-9: Good control. Minor errors that don't impede understanding. Task well addressed.
- 10-11: Very strong. Rare errors. Sophisticated vocabulary and structure.
- 12: Near-native. Virtually error-free with nuanced expression.

IMPORTANT:
- A 3-5 sentence response to a task asking for a full email should score MAX 6 (insufficient development).
- Generic responses without specific details: MAX 7.
- Any greeting/closing errors in a formal email: deduct 1 point.
- Multiple spelling errors: deduct 1-2 points.
- DO NOT be generous. Students need honest feedback to improve.

Respond in JSON only:
{
  "score": <1-12>,
  "clb": <4-12>,
  "feedback": "<2-3 sentences: what was done well + the #1 thing to improve>",
  "strengths": ["<strength1>", "<strength2>"],
  "weaknesses": ["<weakness1>", "<weakness2>", "<weakness3>"]
}`
          },
          {
            role: 'user',
            content: `Task prompt: ${prompt || 'Write an email'}\n\nStudent's response:\n${safeText}\n\nWord count: ${safeText.split(/\s+/).filter(Boolean).length}`
          }
        ],
        temperature: 0.2,
        max_tokens: 300,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');
      return NextResponse.json({
        score: result.score || 5,
        clb: result.clb || Math.min(12, Math.max(4, Math.round((result.score || 5) * 0.9 + 1))),
        feedback: result.feedback || 'Assessment complete.',
        strengths: result.strengths || [],
        weaknesses: result.weaknesses || [],
        source: 'ai'
      });
    }

    if (type === 'speaking') {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a strict CELPIP Speaking evaluator conducting an initial diagnostic assessment. Score this spoken response transcript HONESTLY.

SCORING CRITERIA (CELPIP scale 1-12):

**Content & Coherence (30%)**
- Is the advice/response relevant and complete?
- Are ideas organized logically?
- Are there specific details or examples?

**Vocabulary & Expression (25%)**
- Range of vocabulary used
- Appropriate word choice
- Use of idiomatic expressions

**Fluency & Clarity (25%)**
- Sentence length and complexity (from transcript)
- Natural flow of ideas
- Filler words / repetitions / false starts

**Task Completion (20%)**
- Did they fully address the prompt?
- Was the response long enough?
- Was the tone appropriate?

STRICT SCORING:
- Very short responses (under 30 words): MAX 5
- Repetitive/circular responses: MAX 6
- Only 1 point addressed when 2-3 expected: MAX 7
- Note: You CANNOT assess pronunciation from text. Adjust accordingly.

Respond in JSON only:
{
  "score": <1-12>,
  "clb": <4-12>,
  "feedback": "<2-3 sentences: what was done well + the #1 thing to improve>",
  "strengths": ["<strength1>", "<strength2>"],
  "weaknesses": ["<weakness1>", "<weakness2>"]
}`
          },
          {
            role: 'user',
            content: `Task prompt: ${prompt || 'Give advice'}\n\nTranscript:\n${safeText}\n\nWord count: ${safeText.split(/\s+/).filter(Boolean).length}`
          }
        ],
        temperature: 0.2,
        max_tokens: 300,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');
      return NextResponse.json({
        score: result.score || 5,
        clb: result.clb || Math.min(12, Math.max(4, Math.round((result.score || 5) * 0.9 + 1))),
        feedback: result.feedback || 'Assessment complete.',
        strengths: result.strengths || [],
        weaknesses: result.weaknesses || [],
        source: 'ai'
      });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

  } catch (error) {
    console.error('Assessment evaluate error:', error);
    return NextResponse.json({ error: 'Evaluation failed' }, { status: 500 });
  }
}
