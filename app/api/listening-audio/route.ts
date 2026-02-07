import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Cache directory for audio files
const AUDIO_CACHE_DIR = '/var/www/CELPIP/public/audio/listening';

export async function POST(request: NextRequest) {
  try {
    const { text, passageId } = await request.json();

    if (!text || !passageId) {
      return NextResponse.json(
        { error: 'Missing text or passageId' },
        { status: 400 }
      );
    }

    // Check if audio already exists in cache
    const audioFileName = `${passageId}.mp3`;
    const audioFilePath = join(AUDIO_CACHE_DIR, audioFileName);
    const publicUrl = `/audio/listening/${audioFileName}`;

    if (existsSync(audioFilePath)) {
      // Return cached audio
      return NextResponse.json({ audioUrl: publicUrl });
    }

    // Ensure cache directory exists
    await mkdir(AUDIO_CACHE_DIR, { recursive: true });

    // Clean up the script text
    const cleanText = text
      .trim()
      .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
      .substring(0, 4000); // TTS has limits

    // Generate audio with OpenAI TTS
    const mp3Response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy', // Neutral voice
      input: cleanText,
      speed: 0.95, // Slightly slower for clarity
    });

    // Save audio file
    const buffer = Buffer.from(await mp3Response.arrayBuffer());
    await writeFile(audioFilePath, buffer);

    return NextResponse.json({ audioUrl: publicUrl });

  } catch (error) {
    console.error('Listening audio generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    );
  }
}
