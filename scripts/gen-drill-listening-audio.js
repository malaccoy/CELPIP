#!/usr/bin/env node
/**
 * Generate pre-baked MP3 audio for Listening Drill exercises.
 * Uses Edge TTS (multi-voice) — same as AI Practice library.
 * 
 * Output: /public/audio/drills/listening/unit-{unitIdx}-ex-{exIdx}.mp3
 * Updates: listening.json with audioFile field per exercise
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../public/data/courses/listening.json');
const AUDIO_DIR = path.join(__dirname, '../public/audio/drills/listening');
const VOICE_MAP = {
  male: 'en-US-AndrewNeural',
  female: 'en-US-AvaNeural',
  narrator: 'en-US-GuyNeural',
};

// Ensure output dir
fs.mkdirSync(AUDIO_DIR, { recursive: true });

const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

let generated = 0;
let skipped = 0;
let errors = 0;

async function generateAudio(lines, outFile) {
  // Generate each line as a separate temp file, then concatenate
  const tmpFiles = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const voice = VOICE_MAP[line.voice] || VOICE_MAP.narrator;
    const text = line.text.replace(/"/g, '\\"').replace(/\n/g, ' ');
    const tmpFile = outFile.replace('.mp3', `-part${i}.mp3`);
    tmpFiles.push(tmpFile);
    
    try {
      execSync(
        `edge-tts --voice "${voice}" --text "${text}" --write-media "${tmpFile}"`,
        { timeout: 30000, stdio: 'pipe' }
      );
    } catch (e) {
      console.error(`  ❌ TTS failed for line ${i}: ${e.message}`);
      throw e;
    }
  }
  
  if (tmpFiles.length === 1) {
    fs.renameSync(tmpFiles[0], outFile);
  } else {
    // Concatenate with ffmpeg — add 400ms silence between parts
    const filterParts = [];
    const inputs = tmpFiles.map(f => `-i "${f}"`).join(' ');
    
    // Build filter: each input + 400ms silence, then concat all
    const silenceFile = outFile.replace('.mp3', '-silence.mp3');
    execSync(
      `ffmpeg -y -f lavfi -i anullsrc=r=24000:cl=mono -t 0.4 -q:a 9 "${silenceFile}"`,
      { timeout: 10000, stdio: 'pipe' }
    );
    
    // Build concat list
    const listFile = outFile.replace('.mp3', '-list.txt');
    const listContent = tmpFiles.map((f, i) => {
      let s = `file '${f}'\n`;
      if (i < tmpFiles.length - 1) s += `file '${silenceFile}'\n`;
      return s;
    }).join('');
    fs.writeFileSync(listFile, listContent);
    
    execSync(
      `ffmpeg -y -f concat -safe 0 -i "${listFile}" -c:a libmp3lame -q:a 4 "${outFile}"`,
      { timeout: 30000, stdio: 'pipe' }
    );
    
    // Cleanup temp files
    tmpFiles.forEach(f => { try { fs.unlinkSync(f); } catch {} });
    try { fs.unlinkSync(silenceFile); } catch {}
    try { fs.unlinkSync(listFile); } catch {}
  }
}

(async () => {
  const total = data.reduce((sum, u) => sum + u.exercises.length, 0);
  console.log(`🎧 Generating audio for ${total} listening drill exercises...`);
  console.log(`📁 Output: ${AUDIO_DIR}\n`);

  for (let ui = 0; ui < data.length; ui++) {
    const unit = data[ui];
    console.log(`\n📦 Unit ${ui + 1}/${data.length}: ${unit.title}`);
    
    for (let ei = 0; ei < unit.exercises.length; ei++) {
      const ex = unit.exercises[ei];
      const filename = `unit-${ui + 1}-ex-${ei + 1}.mp3`;
      const outFile = path.join(AUDIO_DIR, filename);
      const relPath = `/audio/drills/listening/${filename}`;
      
      // Skip if already generated
      if (fs.existsSync(outFile) && ex.audioFile === relPath) {
        skipped++;
        process.stdout.write('.');
        continue;
      }
      
      if (!ex.audioLines || ex.audioLines.length === 0) {
        console.log(`  ⚠️  Ex ${ei + 1}: no audioLines, skipping`);
        skipped++;
        continue;
      }
      
      try {
        await generateAudio(ex.audioLines, outFile);
        ex.audioFile = relPath;
        generated++;
        process.stdout.write('✓');
      } catch (e) {
        errors++;
        process.stdout.write('✗');
      }
    }
  }

  // Save updated JSON
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  
  console.log(`\n\n✅ Done! Generated: ${generated}, Skipped: ${skipped}, Errors: ${errors}`);
  console.log(`📝 Updated ${DATA_FILE} with audioFile paths`);
})();
