import { NextRequest, NextResponse } from 'next/server';
import { execFile } from 'child_process';
import { promises as fs } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { randomUUID } from 'crypto';

const VOICES: Record<string, string> = {
  female: 'en-US-AvaNeural',       // Expressive, caring
  male: 'en-US-AndrewNeural',      // Warm, confident
  narrator: 'en-US-GuyNeural',     // News, passion
  female2: 'en-US-EmmaNeural',     // Cheerful, clear
  male2: 'en-US-BrianNeural',      // Approachable, casual
};

const DEFAULT_VOICE = 'en-US-AvaNeural';

function generateTTS(text: string, rate: string, voice: string, outPath: string): Promise<boolean> {
  return new Promise(resolve => {
    execFile('edge-tts', [
      '--voice', voice,
      '--rate', rate,
      '--text', text,
      '--write-media', outPath,
    ], { timeout: 15000 }, (error) => {
      if (error) { console.error('Edge TTS error:', error.message); resolve(false); return; }
      resolve(true);
    });
  });
}

export async function GET(req: NextRequest) {
  const text = req.nextUrl.searchParams.get('text');
  const slow = req.nextUrl.searchParams.get('slow') === '1';
  const voiceParam = req.nextUrl.searchParams.get('voice') || '';
  
  if (!text || text.length > 1000) {
    return NextResponse.json({ error: 'Invalid text' }, { status: 400 });
  }

  const voice = VOICES[voiceParam] || DEFAULT_VOICE;
  const rate = slow ? '-30%' : '+0%';
  const outPath = join(tmpdir(), `tts-${randomUUID()}.mp3`);
  
  try {
    const ok = await generateTTS(text, rate, voice, outPath);
    if (!ok) {
      return NextResponse.json({ error: 'TTS generation failed' }, { status: 500 });
    }
    
    const buffer = await fs.readFile(outPath);
    await fs.unlink(outPath).catch(() => {});
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (e) {
    await fs.unlink(outPath).catch(() => {});
    return NextResponse.json({ error: 'TTS error' }, { status: 500 });
  }
}
