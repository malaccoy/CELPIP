import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { requirePro } from '@/lib/plan';
import { execFile } from 'child_process';
import { promises as fs } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ─── Edge TTS helpers (free, replaces OpenAI TTS) ────────────

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
      if (error) { console.error('Edge TTS error:', error); resolve(false); return; }
      resolve(true);
    });
  });
}

async function generateTTS(text: string): Promise<Buffer | null> {
  const tmpBase = join(tmpdir(), `celpip-tts-${Date.now()}`);

  // Check if text has speaker labels (e.g., "Man:", "Woman:", "Host:")
  const speakerRegex = /^([A-Za-z\s]+\d?):\s*/gm;
  const speakers = new Set<string>();
  let match;
  while ((match = speakerRegex.exec(text)) !== null) {
    speakers.add(match[1].trim().toLowerCase());
  }

  // If multiple speakers detected, generate multi-voice audio
  if (speakers.size >= 2) {
    try {
      // Split text into segments by speaker
      const segments: { speaker: string; text: string }[] = [];
      const lines = text.split('\n');
      let currentSpeaker = '';
      let currentText = '';
      const lineRegex = /^([A-Za-z\s]+\d?):\s*(.*)$/;

      for (const line of lines) {
        const lineMatch = line.match(lineRegex);
        if (lineMatch) {
          if (currentText.trim()) {
            segments.push({ speaker: currentSpeaker, text: currentText.trim() });
          }
          currentSpeaker = lineMatch[1].trim().toLowerCase();
          currentText = lineMatch[2];
        } else {
          // Narration or continuation
          if (line.trim()) currentText += ' ' + line.trim();
        }
      }
      if (currentText.trim()) {
        segments.push({ speaker: currentSpeaker, text: currentText.trim() });
      }

      if (segments.length < 2) {
        // Fallback to single voice
        const outPath = tmpBase + '.mp3';
        const ok = await generateSingleTTS(text, 'en-US-GuyNeural', outPath);
        if (!ok) return null;
        const buf = await fs.readFile(outPath);
        await fs.unlink(outPath).catch(() => {});
        return buf;
      }

      // Assign voices to speakers
      const speakerVoices: Record<string, string> = {};
      let voiceIdx = 0;
      for (const sp of speakers) {
        speakerVoices[sp] = VOICE_MAP[sp] || DEFAULT_VOICES[voiceIdx % DEFAULT_VOICES.length];
        voiceIdx++;
      }

      // Generate each segment
      const segmentPaths: string[] = [];
      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        const segPath = `${tmpBase}-seg${i}.mp3`;
        const voice = speakerVoices[seg.speaker] || DEFAULT_VOICES[0];
        const ok = await generateSingleTTS(seg.text, voice, segPath);
        if (ok) segmentPaths.push(segPath);
      }

      if (segmentPaths.length === 0) return null;

      // Concatenate with ffmpeg
      const outPath = tmpBase + '-final.mp3';
      const listPath = tmpBase + '-list.txt';
      const listContent = segmentPaths.map(p => `file '${p}'`).join('\n');
      await fs.writeFile(listPath, listContent);

      const concatOk = await new Promise<boolean>((resolve) => {
        execFile('ffmpeg', [
          '-f', 'concat', '-safe', '0', '-i', listPath,
          '-c', 'copy', '-y', outPath
        ], { timeout: 30000 }, (err) => {
          resolve(!err);
        });
      });

      // Cleanup segments
      for (const p of segmentPaths) { await fs.unlink(p).catch(() => {}); }
      await fs.unlink(listPath).catch(() => {});

      if (concatOk) {
        const buf = await fs.readFile(outPath);
        await fs.unlink(outPath).catch(() => {});
        return buf;
      }

      // If concat fails, return first segment
      return null;
    } catch (e) {
      console.error('Multi-voice TTS error:', e);
    }
  }

  // Single voice fallback (monologues)
  const outPath = tmpBase + '.mp3';
  const ok = await generateSingleTTS(text, 'en-US-GuyNeural', outPath);
  if (!ok) return null;
  try {
    const buf = await fs.readFile(outPath);
    await fs.unlink(outPath).catch(() => {});
    return buf;
  } catch { return null; }
}

// ─── Types ───────────────────────────────────────────────────
type Section = 'reading' | 'writing' | 'listening' | 'speaking';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';

interface GenerateRequest {
  section: Section;
  partOrTask: string;      // e.g. "part1", "task2", "task5"
  difficulty: Difficulty;
  previousTopics?: string[]; // avoid repeats
}

// ─── Prompts ─────────────────────────────────────────────────
const READING_PROMPT = (part: string, diff: Difficulty, avoid: string) => `You are a CELPIP Reading test item writer. Generate a reading passage and questions for ${part}.

DIFFICULTY: ${diff}
- beginner: Simple vocabulary, shorter sentences, clear main ideas
- intermediate: Mixed vocabulary, some complex sentences, implicit details
- advanced: Academic/professional vocabulary, complex structures, inference required

PARTS:
- Part 1 (Reading Correspondence): An email or letter (150-200 words). 5-6 multiple choice questions.
- Part 2 (Reading to Apply a Diagram): A practical document (schedule, chart description, instructions). 5-6 MC questions.
- Part 3 (Reading for Information): An informational article (200-250 words). 5-6 MC questions.
- Part 4 (Reading for Viewpoints): An opinion piece or editorial (200-250 words). 5-6 MC questions about author's viewpoints.

REQUIREMENTS:
- Set in Canada (Canadian cities, institutions, culture)
- Realistic, natural English
- Questions test comprehension, not just word-matching
- Include 1-2 inference questions
- Each question has exactly 4 options (A-D)
${avoid ? `- AVOID these topics (already used): ${avoid}` : ''}

Respond in JSON:
{
  "title": "string",
  "passage": "string (the full passage text)",
  "questions": [
    {
      "id": 1,
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correct": 0-3,
      "explanation": "brief explanation of correct answer"
    }
  ]
}`;

const WRITING_PROMPT = (task: string, diff: Difficulty, avoid: string) => `You are a CELPIP Writing test prompt designer. Generate a writing prompt for ${task}.

DIFFICULTY: ${diff}
- beginner: Common everyday scenario, clear instructions
- intermediate: Workplace or community scenario, some nuance
- advanced: Complex situation with multiple stakeholders, requires diplomacy

TASKS:
- Task 1: Write an email (formal or semi-formal). Provide scenario + 3 bullet points to address.
- Task 2: Opinion survey response. Provide a statement + two viewpoints. Candidate must pick one side and argue.

REQUIREMENTS:
- Set in Canada (Canadian context)
- Realistic workplace, community, or daily-life scenario
- Clear what the candidate needs to do
${avoid ? `- AVOID these topics (already used): ${avoid}` : ''}

Respond in JSON:
{
  "title": "string (short title)",
  "scenario": "string (the full scenario description)",
  "bullets": ["point 1", "point 2", "point 3"],
  "sampleTopic": "string (what the email/essay is about in 5 words)",
  "wordCountTarget": { "min": 150, "max": 200 },
  "timeMinutes": ${task === 'task1' ? 27 : 26}
}`;

const LISTENING_PROMPT = (part: string, diff: Difficulty, avoid: string) => `You are a CELPIP Listening test item writer. Generate a listening passage (dialogue or monologue) and questions for ${part}.

DIFFICULTY: ${diff}
- beginner: Clear speech patterns, simple vocab, explicit information
- intermediate: Natural conversation pace, some idioms, mix of explicit/implicit
- advanced: Fast-paced, multiple speakers, inference required, professional jargon

PARTS:
- Part 1 (Problem Solving): Two people discussing a problem and finding solutions. ~300-400 words.
- Part 2 (Daily Life Conversation): Casual conversation about everyday topics. ~300-400 words.
- Part 3 (Information): A monologue (announcement, instructions, orientation). ~250-350 words.
- Part 4 (News Item): A news report or bulletin. ~250-350 words.
- Part 5 (Discussion): 2-3 people discussing a workplace/community topic. ~350-450 words.
- Part 6 (Viewpoints): 2-3 people giving different opinions on a topic. ~350-450 words.

REQUIREMENTS:
- Set in Canada (Canadian cities, culture, institutions)
- Natural, realistic dialogue (include "um", "well", "right" occasionally for Parts 1-2)
- Label speakers clearly (Man:, Woman:, Host:, etc.)
- 5-6 multiple choice questions with 4 options each
- Questions test: main idea, specific details, inference, speaker attitude
${avoid ? `- AVOID these topics (already used): ${avoid}` : ''}

Respond in JSON:
{
  "title": "string",
  "passage": "string (full dialogue/monologue with speaker labels)",
  "questions": [
    {
      "id": 1,
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correct": 0-3,
      "explanation": "brief explanation"
    }
  ]
}`;

const SPEAKING_PROMPT = (task: string, diff: Difficulty, avoid: string) => `You are a CELPIP Speaking test prompt designer. Generate a speaking prompt for ${task}.

DIFFICULTY: ${diff}
- beginner: Familiar topic, simple scenario, clear instructions
- intermediate: Workplace or social scenario, some complexity
- advanced: Abstract topic, multiple considerations, nuanced situation

TASKS:
- Task 1 (Giving Advice): Someone has a problem, give advice. Prep: 30s, Speak: 90s
- Task 2 (Talking about Personal Experience): Describe a personal experience. Prep: 30s, Speak: 60s
- Task 3 (Describing a Scene): Describe an image/scene in detail. Prep: 30s, Speak: 60s
- Task 4 (Making Predictions): Look at a scene and predict what will happen. Prep: 30s, Speak: 60s
- Task 5 (Comparing and Persuading): Compare two options and persuade someone. Prep: 30s, Speak: 60s
- Task 6 (Dealing with a Difficult Situation): Handle a tricky social/work situation. Prep: 30s, Speak: 60s
- Task 7 (Expressing Opinions): Give your opinion on a topic with reasons. Prep: 30s, Speak: 90s
- Task 8 (Describing an Unusual Situation): Describe something unexpected and explain. Prep: 30s, Speak: 60s

REQUIREMENTS:
- Set in Canada
- Clear situation/scenario
- Specific enough to guide the response but open enough for creativity
${avoid ? `- AVOID these topics: ${avoid}` : ''}

${task.includes('Task 3') || task.includes('Task 4') ? `IMPORTANT: For Task 3 and Task 4, include an "imagePrompt" field — a detailed visual description (60-100 words) of the scene to generate an image. Describe: setting, people (ages, clothing, actions), objects, lighting, mood. No text/words in the image. Style: realistic photograph.` : ''}

Respond in JSON:
{
  "title": "string (short title)",
  "prompt": "string (the full prompt the candidate sees)",
  ${task.includes('Task 3') || task.includes('Task 4') ? '"imagePrompt": "string (detailed visual scene description for image generation)",' : ''}
  "prepTimeSeconds": 30,
  "speakTimeSeconds": 60 or 90,
  "tips": ["tip 1 for this task type", "tip 2"]
}`;

// ─── Handler ─────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const denied = await requirePro();
    if (denied) return denied;

    const body: GenerateRequest = await request.json();
    const { section, partOrTask, difficulty, previousTopics } = body;

    if (!section || !partOrTask || !difficulty) {
      return NextResponse.json(
        { error: 'Missing required fields: section, partOrTask, difficulty' },
        { status: 400 }
      );
    }

    const avoid = (previousTopics || []).join(', ');
    let systemPrompt: string;
    let userMsg: string;

    switch (section) {
      case 'reading':
        systemPrompt = 'You are an expert CELPIP Reading item writer. Respond in JSON only.';
        userMsg = READING_PROMPT(partOrTask, difficulty, avoid);
        break;
      case 'writing':
        systemPrompt = 'You are an expert CELPIP Writing prompt designer. Respond in JSON only.';
        userMsg = WRITING_PROMPT(partOrTask, difficulty, avoid);
        break;
      case 'listening':
        systemPrompt = 'You are an expert CELPIP Listening item writer. Respond in JSON only.';
        userMsg = LISTENING_PROMPT(partOrTask, difficulty, avoid);
        break;
      case 'speaking':
        systemPrompt = 'You are an expert CELPIP Speaking prompt designer. Respond in JSON only.';
        userMsg = SPEAKING_PROMPT(partOrTask, difficulty, avoid);
        break;
      default:
        return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMsg },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
      max_tokens: section === 'speaking' ? 500 : 2000,
    });

    const content = completion.choices[0].message.content || '{}';
    const exercise = JSON.parse(content);

    // For listening, generate TTS audio (free Edge TTS)
    let audioBase64: string | null = null;
    if (section === 'listening' && exercise.passage) {
      try {
        const audioBuffer = await generateTTS(exercise.passage);
        if (audioBuffer) {
          audioBase64 = audioBuffer.toString('base64');
        }
      } catch (ttsErr) {
        console.error('TTS generation failed:', ttsErr);
      }
    }

    // For speaking Task 3/4, generate scene image with DALL-E
    const isVisualTask = section === 'speaking' && (partOrTask.includes('Task 3') || partOrTask.includes('Task 4'));
    let imageBase64: string | null = null;
    if (isVisualTask) {
      try {
        // Use AI-generated imagePrompt if available, otherwise build one from the exercise
        const imgPrompt = exercise.imagePrompt
          || `A realistic scene in Canada: ${exercise.title}. ${exercise.prompt?.substring(0, 200) || ''}`;
        
        const imageResponse = await openai.images.generate({
          model: 'dall-e-3',
          prompt: imgPrompt + ' Photorealistic style, no text, letters, or words anywhere in the image. No UI elements.',
          n: 1,
          size: '1024x1024',
          quality: 'standard',
        });
        const imageUrl = imageResponse.data?.[0]?.url;
        if (imageUrl) {
          const imgRes = await fetch(imageUrl);
          const imgBuf = Buffer.from(await imgRes.arrayBuffer());
          imageBase64 = imgBuf.toString('base64');
        }
      } catch (imgErr) {
        console.error('DALL-E image generation failed:', imgErr);
      }
    }

    return NextResponse.json({
      section,
      partOrTask,
      difficulty,
      exercise,
      ...(audioBase64 ? { audio: audioBase64 } : {}),
      ...(imageBase64 ? { image: imageBase64 } : {}),
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AI Practice Generator error:', error);
    return NextResponse.json(
      { error: 'Failed to generate exercise. Please try again.' },
      { status: 500 }
    );
  }
}
