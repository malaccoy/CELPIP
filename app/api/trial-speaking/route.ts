import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Simple in-memory rate limit per IP (max 3 per hour)
const ipCounts = new Map<string, { count: number; reset: number }>();

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const now = Date.now();
    const entry = ipCounts.get(ip);
    if (entry && now < entry.reset) {
      if (entry.count >= 3) {
        return NextResponse.json({ error: 'Rate limit — create a free account for more!' }, { status: 429 });
      }
      entry.count++;
    } else {
      ipCounts.set(ip, { count: 1, reset: now + 3600000 });
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const prompt = formData.get('prompt') as string || '';

    if (!audioFile || audioFile.size < 1000) {
      return NextResponse.json({ error: 'No audio' }, { status: 400 });
    }
    if (audioFile.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large' }, { status: 413 });
    }

    // Save temp file
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = audioFile.type || 'audio/mp4';
    const ext = mimeType.includes('mp4') || mimeType.includes('m4a') ? 'm4a'
      : mimeType.includes('webm') ? 'webm' : 'm4a';
    const tempPath = join('/tmp', `trial-${randomUUID()}.${ext}`);
    await writeFile(tempPath, buffer);

    // Transcribe
    const { createReadStream } = await import('fs');
    let transcript = '';
    try {
      const result = await openai.audio.transcriptions.create({
        file: createReadStream(tempPath) as any,
        model: 'whisper-1',
        language: 'en',
      });
      transcript = result.text || '';
    } catch (e) {
      console.error('[Trial Speaking] Whisper error:', e);
    }

    await unlink(tempPath).catch(() => {});

    if (!transcript || transcript.trim().length < 5) {
      return NextResponse.json({
        score: 3,
        transcript: transcript || '',
        feedback: 'We could not detect clear speech. Make sure your microphone is working and speak clearly.',
      });
    }

    // Evaluate with strict prompt
    const wordCount = transcript.split(/\s+/).length;
    const analysis = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.1,
      max_tokens: 500,
      messages: [{
        role: 'system',
        content: `You are a STRICT CELPIP Speaking evaluator. Score 1-12 using these bands:
- 1-3: No response / gibberish / completely off-topic / under 10 words
- 4-5: Very basic, limited vocabulary, many grammar errors, barely addresses prompt
- 6-7: Average. Addresses the prompt but with noticeable errors, limited vocabulary, simple sentences
- 8-9: Good. Clear response, varied vocabulary, mostly correct grammar, addresses prompt fully
- 10-12: Excellent. Rich vocabulary, complex sentences, natural fluency, fully developed response

BE STRICT. Most learners score 5-7. Score 8+ ONLY for genuinely strong English.
If under 20 words, max score 5. If under 30 words, max score 6.

Respond ONLY in JSON: {"score": <1-12>, "feedback": "<2-3 sentences: what was good + specific improvement tip>", "transcript": "<cleaned transcript>"}`
      }, {
        role: 'user',
        content: `Prompt: "${prompt}"\nTranscript (${wordCount} words): "${transcript}"\n\nEvaluate strictly.`
      }],
    });

    const raw = analysis.choices[0]?.message?.content || '';
    let result;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      result = JSON.parse(jsonMatch?.[0] || raw);
    } catch {
      result = { score: 5, feedback: 'Your response was received. Practice speaking in complete sentences with varied vocabulary.', transcript };
    }

    return NextResponse.json({
      score: Math.min(12, Math.max(1, result.score || 5)),
      feedback: result.feedback || 'Keep practicing!',
      transcript: result.transcript || transcript,
    });

  } catch (e: any) {
    console.error('[Trial Speaking] Error:', e);
    return NextResponse.json({ error: 'Evaluation failed' }, { status: 500 });
  }
}
