import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const taskType = formData.get('taskType') as string;
    const taskPart = formData.get('taskPart') as string;
    const prompt = formData.get('prompt') as string;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Save audio temporarily
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempPath = join('/tmp', `speaking-${randomUUID()}.webm`);
    await writeFile(tempPath, buffer);

    // Transcribe with Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: await import('fs').then(fs => fs.createReadStream(tempPath)),
      model: 'whisper-1',
      language: 'en',
    });

    // Clean up temp file
    await unlink(tempPath).catch(() => {});

    const transcript = transcription.text;

    // If no speech detected
    if (!transcript || transcript.trim().length < 10) {
      return NextResponse.json({
        score: 3,
        transcript: transcript || '(No speech detected)',
        strengths: ['Attempted the task'],
        improvements: [
          'Speak clearly into the microphone',
          'Make sure your microphone is working',
          'Try to speak for the full time allowed'
        ],
        detailedFeedback: {
          content: { score: 3, comment: 'Unable to evaluate - no clear speech detected' },
          vocabulary: { score: 3, comment: 'Unable to evaluate' },
          fluency: { score: 3, comment: 'Unable to evaluate' },
          structure: { score: 3, comment: 'Unable to evaluate' }
        },
        overallComment: 'We could not detect clear speech in your recording. Please check your microphone and try again.'
      });
    }

    // Analyze with GPT
    const analysisPrompt = `You are a CELPIP Speaking test evaluator. Analyze this speaking response and provide detailed feedback.

TASK: Part ${taskPart} - ${taskType}
PROMPT: ${prompt}
CANDIDATE'S RESPONSE (transcript):
"${transcript}"

Evaluate based on CELPIP criteria:
1. Content/Coherence (0-12): Ideas are relevant, organized, and fully developed
2. Vocabulary (0-12): Range and accuracy of word choice
3. Fluency/Listenability (0-12): Natural pace, flow (based on transcript coherence)
4. Structure (0-12): Clear organization, use of transitions

Respond in this exact JSON format:
{
  "score": <overall score 1-12>,
  "detailedFeedback": {
    "content": { "score": <1-12>, "comment": "<specific feedback about content>" },
    "vocabulary": { "score": <1-12>, "comment": "<specific feedback about vocabulary>" },
    "fluency": { "score": <1-12>, "comment": "<feedback about flow and coherence>" },
    "structure": { "score": <1-12>, "comment": "<feedback about organization>" }
  },
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "overallComment": "<2-3 sentence overall assessment>"
}

Be encouraging but honest. Focus on actionable feedback.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert CELPIP Speaking evaluator. Provide JSON feedback only.'
        },
        { role: 'user', content: analysisPrompt }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const analysisText = completion.choices[0]?.message?.content || '';
    const analysis = JSON.parse(analysisText);

    return NextResponse.json({
      ...analysis,
      transcript
    });

  } catch (error) {
    console.error('Speaking feedback error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze recording' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
