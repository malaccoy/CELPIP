#!/usr/bin/env python3
"""Regenerate listening audio files with multi-voice Edge TTS"""
import json, os, re, subprocess, tempfile, asyncio

AUDIO_DIR = '/var/www/CELPIP/public/audio/listening-library'
REGEN_FILE = '/tmp/listening-regen.json'

# Voice assignments
VOICES = {
    'Man': 'en-CA-LiamNeural',
    'Woman': 'en-CA-ClaraNeural', 
    'Man 2': 'en-AU-WilliamNeural',
    'Woman 2': 'en-GB-SoniaNeural',
    'Narrator': 'en-CA-LiamNeural',
}

SILENCE_MS = 300  # pause between speakers

async def generate_segment(text, voice, outfile):
    """Generate a single TTS segment"""
    import edge_tts
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(outfile)

def parse_speakers(passage):
    """Parse passage into (speaker, text) segments"""
    segments = []
    lines = passage.strip().split('\n')
    for line in lines:
        line = line.strip()
        if not line: continue
        match = re.match(r'^(Man|Woman|Man 2|Woman 2|Narrator):\s*(.+)', line, re.IGNORECASE)
        if match:
            speaker = match.group(1).title()
            # Normalize
            if speaker == 'Man 2': speaker = 'Man 2'
            elif speaker == 'Woman 2': speaker = 'Woman 2'
            segments.append((speaker, match.group(2).strip()))
        else:
            # Continuation or narrator
            if segments:
                prev_speaker = segments[-1][0]
                segments.append((prev_speaker, line))
            else:
                segments.append(('Narrator', line))
    return segments

async def generate_multi_voice(passage, outfile):
    """Generate multi-voice audio from passage with speaker labels"""
    segments = parse_speakers(passage)
    if not segments:
        return False
    
    tmpdir = tempfile.mkdtemp()
    segment_files = []
    
    try:
        for i, (speaker, text) in enumerate(segments):
            voice = VOICES.get(speaker, VOICES['Man'])
            seg_file = os.path.join(tmpdir, f'seg_{i:03d}.mp3')
            await generate_segment(text, voice, seg_file)
            segment_files.append(seg_file)
        
        # Generate silence
        silence_file = os.path.join(tmpdir, 'silence.mp3')
        subprocess.run([
            'ffmpeg', '-y', '-f', 'lavfi', '-i', 
            f'anullsrc=r=24000:cl=mono', '-t', f'{SILENCE_MS/1000}',
            '-c:a', 'libmp3lame', '-b:a', '48k', silence_file
        ], capture_output=True)
        
        # Build concat list with silence between segments
        concat_file = os.path.join(tmpdir, 'concat.txt')
        with open(concat_file, 'w') as f:
            for i, seg in enumerate(segment_files):
                f.write(f"file '{seg}'\n")
                if i < len(segment_files) - 1:
                    f.write(f"file '{silence_file}'\n")
        
        # Concatenate
        subprocess.run([
            'ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', concat_file,
            '-c:a', 'libmp3lame', '-b:a', '128k', '-ar', '24000', outfile
        ], capture_output=True)
        
        return os.path.exists(outfile) and os.path.getsize(outfile) > 1000
    finally:
        # Cleanup
        for f in os.listdir(tmpdir):
            os.remove(os.path.join(tmpdir, f))
        os.rmdir(tmpdir)

async def main():
    with open(REGEN_FILE) as f:
        items = json.load(f)
    
    total = len(items)
    success = 0
    failed = 0
    
    print(f"Regenerating {total} audio files with multi-voice Edge TTS...")
    
    for i, item in enumerate(items):
        outfile = os.path.join(AUDIO_DIR, item['file'])
        passage = item['passage']
        
        # Backup original
        if os.path.exists(outfile):
            backup = outfile + '.bak'
            if not os.path.exists(backup):
                os.rename(outfile, backup)
        
        try:
            ok = await generate_multi_voice(passage, outfile)
            if ok:
                success += 1
                # Remove backup on success
                backup = outfile + '.bak'
                if os.path.exists(backup):
                    os.remove(backup)
            else:
                failed += 1
                # Restore backup
                backup = outfile + '.bak'
                if os.path.exists(backup):
                    os.rename(backup, outfile)
                print(f"  FAIL: {item['file']}")
        except Exception as e:
            failed += 1
            backup = outfile + '.bak'
            if os.path.exists(backup):
                os.rename(backup, outfile)
            print(f"  ERROR: {item['file']}: {e}")
        
        if (i+1) % 10 == 0:
            print(f"  Progress: {i+1}/{total} (✅ {success} ❌ {failed})")
    
    print(f"\n=== DONE ===")
    print(f"Total: {total} | Success: {success} | Failed: {failed}")

if __name__ == '__main__':
    asyncio.run(main())
