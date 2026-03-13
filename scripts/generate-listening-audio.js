#!/usr/bin/env node
/**
 * Generate TTS audio for listening exercises that don't have audio yet.
 * Uses Edge TTS (free). For dialogues, generates per-speaker segments and concatenates with ffmpeg.
 * Part 1 = 3 clips per exercise. Parts 2-6 = single audio per exercise.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const AUDIO_DIR = path.join(__dirname, '../public/audio/listening-library');
const DATA_DIR = path.join(__dirname, '../public/data/listening-library');

const VOICE_MAP = {
  'man': 'en-US-GuyNeural',
  'woman': 'en-US-JennyNeural',
  'man 2': 'en-CA-LiamNeural',
  'woman 2': 'en-AU-NatashaNeural',
  'host': 'en-US-AriaNeural',
  'narrator': 'en-US-AriaNeural',
};

function getVoice(label) {
  const key = (label || '').toLowerCase().replace(/:$/, '').trim();
  return VOICE_MAP[key] || 'en-US-AriaNeural';
}

function escapeText(text) {
  return text.replace(/'/g, "'\\''").replace(/\n/g, ' ');
}

function generateSingleVoice(text, outFile, voice = 'en-US-AriaNeural') {
  const escaped = escapeText(text);
  const cmd = `edge-tts --voice "${voice}" --text '${escaped}' --write-media "${outFile}" 2>/dev/null`;
  try {
    execSync(cmd, { timeout: 60000 });
    return true;
  } catch (e) {
    console.error(`  ❌ TTS failed for ${outFile}: ${e.message}`);
    return false;
  }
}

function parseDialogueSegments(passage) {
  const lines = passage.split('\n').filter(l => l.trim());
  const segments = [];
  const speakerRegex = /^(Man|Woman|Man 2|Woman 2|Host|Narrator):\s*(.*)$/i;
  
  for (const line of lines) {
    const match = line.match(speakerRegex);
    if (match) {
      segments.push({ speaker: match[1], text: match[2] });
    } else if (segments.length > 0) {
      // Continuation of previous speaker
      segments[segments.length - 1].text += ' ' + line.trim();
    } else {
      // No speaker label — narrator
      segments.push({ speaker: 'Narrator', text: line.trim() });
    }
  }
  return segments;
}

function generateDialogueAudio(passage, outFile) {
  const segments = parseDialogueSegments(passage);
  if (segments.length === 0) {
    // Fallback: single voice
    return generateSingleVoice(passage, outFile);
  }

  const tmpDir = '/tmp/listening-tts-' + Date.now();
  fs.mkdirSync(tmpDir, { recursive: true });

  const segFiles = [];
  const silenceFile = tmpDir + '/silence.mp3';
  
  // Generate 250ms silence
  try {
    execSync(`ffmpeg -y -f lavfi -i anullsrc=r=24000:cl=mono -t 0.25 -c:a libmp3lame "${silenceFile}" 2>/dev/null`, { timeout: 10000 });
  } catch (e) {
    // Fallback without silence
  }

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const voice = getVoice(seg.speaker);
    const segFile = `${tmpDir}/seg_${String(i).padStart(3, '0')}.mp3`;
    
    if (!generateSingleVoice(seg.text, segFile, voice)) continue;
    
    segFiles.push(segFile);
    if (fs.existsSync(silenceFile) && i < segments.length - 1) {
      segFiles.push(silenceFile);
    }
  }

  if (segFiles.length === 0) return false;

  // Concatenate
  const listFile = tmpDir + '/list.txt';
  fs.writeFileSync(listFile, segFiles.map(f => `file '${f}'`).join('\n'));
  
  try {
    execSync(`ffmpeg -y -f concat -safe 0 -i "${listFile}" -c:a libmp3lame -q:a 4 "${outFile}" 2>/dev/null`, { timeout: 120000 });
    // Cleanup
    execSync(`rm -rf "${tmpDir}"`);
    return true;
  } catch (e) {
    console.error(`  ❌ Concat failed for ${outFile}`);
    execSync(`rm -rf "${tmpDir}"`);
    return false;
  }
}

function hasDialogue(passage) {
  return /^(Man|Woman|Man 2|Woman 2|Host|Narrator):/im.test(passage);
}

async function main() {
  let totalGenerated = 0;
  let totalFailed = 0;

  for (let p = 1; p <= 6; p++) {
    const dataFile = path.join(DATA_DIR, `part${p}.json`);
    const exercises = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    
    console.log(`\n📻 Part ${p}: ${exercises.length} exercises`);
    
    for (let i = 0; i < exercises.length; i++) {
      const idx = String(i + 1).padStart(2, '0');
      const ex = exercises[i];
      
      if (p === 1) {
        // Part 1: 3 clips
        const clips = ex.clips || [];
        if (clips.length === 0) {
          // If no clips array, generate single audio from passage
          const outFile = path.join(AUDIO_DIR, `part1-${idx}-clip1.mp3`);
          if (fs.existsSync(outFile)) continue;
          console.log(`  Part1 ex${idx}: generating single (no clips)...`);
          const passage = ex.passage || '';
          const ok = hasDialogue(passage) ? generateDialogueAudio(passage, outFile) : generateSingleVoice(passage, outFile);
          if (ok) totalGenerated++; else totalFailed++;
          continue;
        }
        
        let allExist = true;
        for (let c = 0; c < clips.length; c++) {
          const clipFile = path.join(AUDIO_DIR, `part1-${idx}-clip${c + 1}.mp3`);
          if (!fs.existsSync(clipFile)) { allExist = false; break; }
        }
        if (allExist) continue;
        
        console.log(`  Part1 ex${idx}: generating ${clips.length} clips...`);
        for (let c = 0; c < clips.length; c++) {
          const clipFile = path.join(AUDIO_DIR, `part1-${idx}-clip${c + 1}.mp3`);
          if (fs.existsSync(clipFile)) continue;
          const text = clips[c].text || '';
          const ok = hasDialogue(text) ? generateDialogueAudio(text, clipFile) : generateSingleVoice(text, clipFile);
          if (ok) totalGenerated++; else totalFailed++;
        }
      } else {
        // Parts 2-6: single audio
        const outFile = path.join(AUDIO_DIR, `part${p}-${idx}.mp3`);
        if (fs.existsSync(outFile)) continue;
        
        const passage = ex.passage || '';
        if (!passage.trim()) { console.log(`  Part${p} ex${idx}: SKIP (no passage)`); continue; }
        
        console.log(`  Part${p} ex${idx}: generating...`);
        const ok = hasDialogue(passage) ? generateDialogueAudio(passage, outFile) : generateSingleVoice(passage, outFile);
        if (ok) totalGenerated++; else totalFailed++;
      }
    }
  }

  console.log(`\n🎉 Done! Generated: ${totalGenerated}, Failed: ${totalFailed}`);
  
  // Build + deploy
  if (totalGenerated > 0) {
    console.log('\n🔨 Building...');
    execSync('cd /var/www/CELPIP && npm run build', { stdio: 'inherit', timeout: 300000 });
    console.log('🚀 Deploying...');
    execSync('pm2 restart celpip', { timeout: 30000 });
    console.log('✅ Deployed!');
  }
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
