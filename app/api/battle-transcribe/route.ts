import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { execSync } from 'child_process';
import { randomUUID } from 'crypto';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audio = formData.get('audio') as Blob | null;
    const prompt = (formData.get('prompt') as string) || '';

    if (!audio) return NextResponse.json({ accuracy: 0, error: 'No audio' }, { status: 400 });

    // Save to temp file
    const id = randomUUID();
    const tmpPath = `/tmp/battle-${id}.webm`;
    const wavPath = `/tmp/battle-${id}.wav`;
    const buffer = Buffer.from(await audio.arrayBuffer());
    await writeFile(tmpPath, buffer);

    // Convert to wav for whisper
    try {
      execSync(`ffmpeg -y -i ${tmpPath} -ar 16000 -ac 1 ${wavPath} 2>/dev/null`, { timeout: 10000 });
    } catch {
      await unlink(tmpPath).catch(() => {});
      return NextResponse.json({ accuracy: 0, error: 'Audio conversion failed' });
    }

    // Transcribe with Whisper
    let transcript = '';
    try {
      const out = execSync(`whisper ${wavPath} --model base --language en --output_format txt --output_dir /tmp 2>/dev/null`, { timeout: 30000 });
      const txtPath = wavPath.replace('.wav', '.txt');
      const { readFile } = await import('fs/promises');
      transcript = (await readFile(txtPath, 'utf-8')).trim();
      await unlink(txtPath).catch(() => {});
    } catch {
      transcript = '';
    }

    // Cleanup
    await unlink(tmpPath).catch(() => {});
    await unlink(wavPath).catch(() => {});

    // Calculate accuracy (word match %)
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
    const expected = normalize(prompt);
    const spoken = normalize(transcript);

    if (expected.length === 0) return NextResponse.json({ accuracy: 0, transcript });

    let matches = 0;
    for (const word of expected) {
      if (spoken.includes(word)) matches++;
    }
    const accuracy = Math.round((matches / expected.length) * 100);

    return NextResponse.json({ accuracy, transcript });
  } catch (err: any) {
    return NextResponse.json({ accuracy: 0, error: err.message || 'Unknown error' }, { status: 500 });
  }
}
