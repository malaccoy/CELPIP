#!/usr/bin/env node
/**
 * Regenerate listening-library audio with multi-voice TTS.
 * Parses "Man:", "Woman:", etc. from passage text → Andrew/Ava/Guy voices.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const AUDIO_DIR = path.join(__dirname, '../public/audio/listening-library');
const LIB_DIR = path.join(__dirname, '../public/data/listening-library');

// Male names → male voice, Female names → female voice
const MALE_NAMES = ['tom','david','james','michael','kevin','ryan','chris','brian','mark','steven',
  'andrew','daniel','jason','matt','patrick','adam','tyler','nathan','brandon','scott',
  'man','speaker 1','interviewer','interviewee','agent','teacher','manager','customer'];
const FEMALE_NAMES = ['sarah','lisa','emily','jessica','amanda','nicole','rachel','laura','karen',
  'michelle','stephanie','rebecca','ashley','jennifer','natalie','megan','samantha','heather',
  'christina','angela','woman','speaker 2','caller','student','employee','receptionist'];

const VOICE_MAP = {};
MALE_NAMES.forEach(n => VOICE_MAP[n] = 'en-US-AndrewNeural');
FEMALE_NAMES.forEach(n => VOICE_MAP[n] = 'en-US-AvaNeural');
// Special roles
Object.assign(VOICE_MAP, {
  'host': 'en-US-GuyNeural',
  'narrator': 'en-US-GuyNeural',
  'man 2': 'en-US-GuyNeural',
  'woman 2': 'en-US-AriaNeural',
  'speaker 3': 'en-US-GuyNeural',
  'colleague': 'en-US-GuyNeural',
});

function getVoice(speaker) {
  const key = (speaker || '').toLowerCase().trim();
  return VOICE_MAP[key] || 'en-US-GuyNeural';
}

function generateSegment(text, outFile, voice) {
  const tmpText = `/tmp/tts-${Date.now()}-${Math.random().toString(36).slice(2)}.txt`;
  fs.writeFileSync(tmpText, text.substring(0, 4000));
  try {
    execSync(`edge-tts --voice "${voice}" --rate=-5% -f "${tmpText}" --write-media "${outFile}" 2>/dev/null`, { timeout: 60000 });
    fs.unlinkSync(tmpText);
    return true;
  } catch (e) {
    try { fs.unlinkSync(tmpText); } catch(_) {}
    return false;
  }
}

function concatenateAudio(segFiles, outFile) {
  const listFile = `/tmp/ffconcat-${Date.now()}.txt`;
  fs.writeFileSync(listFile, segFiles.map(f => `file '${f}'`).join('\n'));
  try {
    execSync(`ffmpeg -y -f concat -safe 0 -i "${listFile}" -c copy "${outFile}" 2>/dev/null`, { timeout: 120000 });
    fs.unlinkSync(listFile);
    segFiles.forEach(f => { try { fs.unlinkSync(f); } catch(_) {} });
    return true;
  } catch (e) {
    try { fs.unlinkSync(listFile); } catch(_) {}
    return false;
  }
}

function parsePassage(passage) {
  const lines = passage.split(/\\n|\n/).filter(l => l.trim());
  const segments = [];
  const speakerRegex = /^([A-Za-z\s]+?\d?):\s*(.+)$/;
  
  for (const line of lines) {
    const match = line.match(speakerRegex);
    if (match) {
      segments.push({ speaker: match[1].trim(), text: match[2].trim() });
    } else if (line.trim()) {
      // Narration or continuation
      if (segments.length > 0) {
        segments[segments.length - 1].text += ' ' + line.trim();
      } else {
        segments.push({ speaker: 'narrator', text: line.trim() });
      }
    }
  }
  return segments;
}

function processAudioFile(passage, audioFile) {
  const outFile = path.join(AUDIO_DIR, audioFile);
  const segments = parsePassage(passage);
  
  if (segments.length === 0) return false;
  
  // Check if multi-speaker
  const speakers = new Set(segments.map(s => s.speaker.toLowerCase()));
  
  if (speakers.size >= 2) {
    // Multi-voice
    const segFiles = [];
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const voice = getVoice(seg.speaker);
      const segFile = `/tmp/tts-seg-${Date.now()}-${i}.mp3`;
      if (generateSegment(seg.text, segFile, voice)) {
        segFiles.push(segFile);
      }
    }
    if (segFiles.length === 0) return false;
    if (segFiles.length === 1) {
      fs.copyFileSync(segFiles[0], outFile);
      fs.unlinkSync(segFiles[0]);
      return true;
    }
    return concatenateAudio(segFiles, outFile);
  } else {
    // Single voice — use narrator voice for monologues, or detected speaker
    const voice = speakers.size === 1 ? getVoice([...speakers][0]) : 'en-US-GuyNeural';
    const fullText = segments.map(s => s.text).join(' ');
    return generateSegment(fullText, outFile, voice);
  }
}

// Main
const parts = ['part1', 'part2', 'part3', 'part4', 'part5', 'part6'];
let total = 0, done = 0, failed = 0;

for (const partName of parts) {
  const filePath = path.join(LIB_DIR, `${partName}.json`);
  if (!fs.existsSync(filePath)) continue;
  
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const exercises = Array.isArray(raw) ? raw : Object.values(raw);
  console.log(`\n📂 ${partName}: ${exercises.length} exercises`);
  
  for (const ex of exercises) {
    if (ex.clips && Array.isArray(ex.clips)) {
      for (const clip of ex.clips) {
        if (clip.audioFile && (clip.passage || clip.text)) {
          total++;
          process.stdout.write(`  🔊 ${clip.audioFile}...`);
          if (processAudioFile(clip.passage || clip.text, clip.audioFile)) {
            done++;
            console.log(' ✅');
          } else {
            failed++;
            console.log(' ❌');
          }
        }
      }
    } else if (ex.audioFile && (ex.passage || ex.text)) {
      total++;
      process.stdout.write(`  🔊 ${ex.audioFile}...`);
      if (processAudioFile(ex.passage || ex.text, ex.audioFile)) {
        done++;
        console.log(' ✅');
      } else {
        failed++;
        console.log(' ❌');
      }
    }
  }
}

console.log(`\n✅ Complete! ${done}/${total} regenerated, ${failed} failed.`);
