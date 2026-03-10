import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { execFile } from 'child_process';
import { tmpdir } from 'os';
import { promises as fs } from 'fs';
import { requireProWithLimit } from '@/lib/plan';

// Cache directory for audio files
const AUDIO_CACHE_DIR = '/var/www/CELPIP/public/audio/listening';

// ─── Edge TTS multi-voice system ─────────────────────

const VOICE_MAP: Record<string, string> = {
  'man': 'en-US-GuyNeural',
  'woman': 'en-US-JennyNeural',
  'host': 'en-US-AriaNeural',
  'narrator': 'en-US-AriaNeural',
  'speaker 1': 'en-US-GuyNeural',
  'speaker 2': 'en-US-JennyNeural',
  'speaker 3': 'en-CA-LiamNeural',
  'interviewer': 'en-US-AriaNeural',
  'interviewee': 'en-US-GuyNeural',
  'caller': 'en-US-JennyNeural',
  'agent': 'en-US-GuyNeural',
  'student': 'en-US-JennyNeural',
  'teacher': 'en-US-GuyNeural',
  'manager': 'en-US-GuyNeural',
  'employee': 'en-US-JennyNeural',
  'colleague': 'en-CA-LiamNeural',
  'mark': 'en-US-GuyNeural',
  'jake': 'en-US-GuyNeural',
  'david': 'en-US-GuyNeural',
  'sarah': 'en-US-JennyNeural',
  'priya': 'en-CA-LiamNeural',
  'angela': 'en-US-JennyNeural',
};

const DEFAULT_VOICES = ['en-US-GuyNeural', 'en-US-JennyNeural', 'en-CA-LiamNeural'];

function generateSingleTTS(text: string, voice: string, outPath: string): Promise<boolean> {
  return new Promise((resolve) => {
    execFile('edge-tts', [
      '--voice', voice,
      '--rate=-5%',
      '--text', text.substring(0, 4000),
      '--write-media', outPath,
    ], { timeout: 30000 }, (error) => {
      if (error) { console.error('Edge TTS error:', error.message); resolve(false); return; }
      resolve(true);
    });
  });
}

// Generate a short silence file
function generateSilence(outPath: string, durationMs: number = 400): Promise<boolean> {
  return new Promise((resolve) => {
    execFile('ffmpeg', [
      '-f', 'lavfi', '-i', `anullsrc=r=24000:cl=mono`,
      '-t', (durationMs / 1000).toString(),
      '-c:a', 'libmp3lame', '-q:a', '9',
      '-y', outPath,
    ], { timeout: 10000 }, (error) => {
      resolve(!error);
    });
  });
}

async function generateMultiVoiceTTS(text: string, tmpBase: string): Promise<Buffer | null> {
  // Parse speaker labels
  const lines = text.split('\n');
  const segments: { speaker: string; text: string }[] = [];
  const lineRegex = /^([A-Za-z\s]+\d?):\s*(.*)$/;
  let currentSpeaker = '';
  let currentText = '';

  for (const line of lines) {
    const lineMatch = line.match(lineRegex);
    if (lineMatch) {
      if (currentText.trim()) {
        segments.push({ speaker: currentSpeaker, text: currentText.trim() });
      }
      currentSpeaker = lineMatch[1].trim().toLowerCase();
      currentText = lineMatch[2];
    } else if (line.trim()) {
      currentText += ' ' + line.trim();
    }
  }
  if (currentText.trim()) {
    segments.push({ speaker: currentSpeaker, text: currentText.trim() });
  }

  if (segments.length < 2) {
    // Single voice fallback
    const outPath = tmpBase + '.mp3';
    const ok = await generateSingleTTS(text, 'en-US-GuyNeural', outPath);
    if (!ok) return null;
    const buf = await fs.readFile(outPath);
    await fs.unlink(outPath).catch(() => {});
    return buf;
  }

  // Assign voices to speakers
  const speakers = new Set(segments.map(s => s.speaker));
  const speakerVoices: Record<string, string> = {};
  let voiceIdx = 0;
  for (const sp of speakers) {
    speakerVoices[sp] = VOICE_MAP[sp] || DEFAULT_VOICES[voiceIdx % DEFAULT_VOICES.length];
    voiceIdx++;
  }

  // Generate each segment + silence between speakers
  const silencePath = `${tmpBase}-silence.mp3`;
  await generateSilence(silencePath, 500);

  const allPaths: string[] = [];
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const segPath = `${tmpBase}-seg${i}.mp3`;
    const voice = speakerVoices[seg.speaker] || DEFAULT_VOICES[0];
    const ok = await generateSingleTTS(seg.text, voice, segPath);
    if (ok) {
      // Add silence before each segment (except first)
      if (i > 0 && existsSync(silencePath)) {
        allPaths.push(silencePath);
      }
      allPaths.push(segPath);
    }
  }

  if (allPaths.length === 0) return null;

  // Concatenate with ffmpeg
  const outPath = tmpBase + '-final.mp3';
  const listPath = tmpBase + '-list.txt';
  const listContent = allPaths.map(p => `file '${p}'`).join('\n');
  await fs.writeFile(listPath, listContent);

  const concatOk = await new Promise<boolean>((resolve) => {
    execFile('ffmpeg', [
      '-f', 'concat', '-safe', '0', '-i', listPath,
      '-c', 'copy', '-y', outPath
    ], { timeout: 60000 }, (err) => {
      resolve(!err);
    });
  });

  // Cleanup temp files
  const segPaths = segments.map((_, i) => `${tmpBase}-seg${i}.mp3`);
  for (const p of [...segPaths, silencePath, listPath]) {
    await fs.unlink(p).catch(() => {});
  }

  if (concatOk && existsSync(outPath)) {
    const buf = await fs.readFile(outPath);
    await fs.unlink(outPath).catch(() => {});
    return buf;
  }

  return null;
}

// ─── Handler ─────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const { text, passageId } = await request.json();

    if (!text || !passageId) {
      return NextResponse.json(
        { error: 'Missing text or passageId' },
        { status: 400 }
      );
    }

    // Check if audio already exists in cache — serve to ALL users
    const audioFileName = `${passageId}.mp3`;
    const audioFilePath = join(AUDIO_CACHE_DIR, audioFileName);
    const publicUrl = `/audio/listening/${audioFileName}`;

    if (existsSync(audioFilePath)) {
      return NextResponse.json({ audioUrl: publicUrl });
    }

    // Audio not cached — require Pro to generate new audio
    const denied = await requireProWithLimit('listening-audio');
    if (denied) return denied;

    // Ensure cache directory exists
    await mkdir(AUDIO_CACHE_DIR, { recursive: true });

    const tmpBase = join(tmpdir(), `celpip-listen-${Date.now()}`);

    // Generate multi-voice TTS with Edge TTS (free)
    const audioBuffer = await generateMultiVoiceTTS(text, tmpBase);

    if (!audioBuffer) {
      return NextResponse.json(
        { error: 'Failed to generate audio' },
        { status: 500 }
      );
    }

    // Save to cache
    await writeFile(audioFilePath, audioBuffer);

    return NextResponse.json({ audioUrl: publicUrl });

  } catch (error) {
    console.error('Listening audio generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    );
  }
}
