#!/usr/bin/env node
/**
 * Generate beginner + advanced listening library exercises (JSON only, no audio yet)
 * Audio generation is a separate step
 */
const fs = require('fs');
const path = require('path');

const OPENAI_KEY = fs.readFileSync('/var/www/CELPIP/.env.local', 'utf-8').match(/OPENAI_API_KEY=(.+)/)?.[1];

const PARTS = [
  { file: 'part1', name: 'Part 1 (Problem Solving)', desc: 'Two people discussing a problem and solutions. MUST be split into 3 CLIPS (~80-100 words each). 8 questions total distributed across clips (3+3+2).', qCount: 8, clips: true, wordMin: 200 },
  { file: 'part2', name: 'Part 2 (Daily Life Conversation)', desc: 'Conversation about daily activities, plans, or arrangements (200-250 words). 5 MC questions.', qCount: 5, clips: false, wordMin: 200 },
  { file: 'part3', name: 'Part 3 (Information)', desc: 'Informational passage — announcement, instructions, or explanation (200-250 words). 6 MC questions.', qCount: 6, clips: false, wordMin: 200 },
  { file: 'part4', name: 'Part 4 (News Item)', desc: 'News report or broadcast (250-350 words). 5 MC questions. Single speaker (narrator).', qCount: 5, clips: false, wordMin: 250 },
  { file: 'part5', name: 'Part 5 (Discussion)', desc: 'Discussion between 2-3 people about a topic (300-400 words). 8 MC questions. Use speaker labels Man:, Woman:, Man 2:.', qCount: 8, clips: false, wordMin: 300 },
  { file: 'part6', name: 'Part 6 (Viewpoints)', desc: 'Extended discussion with strong opinions from 2-3 speakers (400-500 words). 6 MC questions. Use speaker labels.', qCount: 6, clips: false, wordMin: 400 },
];

const EXERCISES_PER_DIFF = 15;

const diffDesc = {
  beginner: `DIFFICULTY: beginner (CLB 5-6)
- Clear, slow speech patterns. Simple everyday vocabulary.
- Information stated explicitly — answers are directly in the text.
- Distractors obviously wrong. No inference required.
- Topics: shopping, weather, basic appointments, simple directions.
- Speakers speak clearly with no overlapping or interruptions.`,
  advanced: `DIFFICULTY: advanced (CLB 9-12)
- Fast-paced speech with natural interruptions and overlaps.
- Sarcasm, hedging, understatement ("not entirely convinced" = disagrees).
- Key info requires inference — speakers change their minds mid-conversation.
- Professional jargon, idiomatic expressions, phrasal verbs.
- Distractors very close to correct — differ by one subtle detail.
- Topics: policy debates, professional planning, complex scheduling, academic discussions.
- ALL questions require inference or synthesis across multiple statements.`
};

async function generateExercise(part, difficulty, index) {
  const clipInstructions = part.clips ? `
CRITICAL: Split the passage into exactly 3 clips.
Format as JSON with "clips" array:
{
  "title": "string",
  "difficulty": "${difficulty}",
  "passage": "full combined text",
  "clips": [
    { "text": "clip 1 text (~80-100 words)", "questions": [{ "id": 1, "question": "...", "options": ["A","B","C","D"], "correct": 0-3 }] },
    { "text": "clip 2 text (~80-100 words)", "questions": [{ "id": 4, "question": "...", ... }] },
    { "text": "clip 3 text (~80-100 words)", "questions": [{ "id": 7, "question": "...", ... }] }
  ]
}
Questions per clip: 3 + 3 + 2 = 8 total. Use sequential IDs starting from 1.` : `
Format as JSON:
{
  "title": "string",
  "difficulty": "${difficulty}",
  "passage": "full text with speaker labels if dialogue (Man:, Woman:, etc.)",
  "questions": [
    { "id": 1, "question": "string", "options": ["A","B","C","D"], "correct": 0-3 }
  ]
}`;

  const prompt = `You are a CELPIP Listening test item writer. Generate a listening passage and questions for ${part.name}.

${diffDesc[difficulty]}

${part.desc}

REQUIREMENTS:
- Set in Canada (Canadian cities, institutions, culture)
- Minimum ${part.wordMin} words for the passage
- Each question has exactly 4 options (A-D)
- Generate exactly ${part.qCount} questions
- For dialogue parts, use speaker labels: Man:, Woman:, Man 2:, Woman 2:

${clipInstructions}

Respond in valid JSON only.`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.95,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    }),
  });

  const data = await res.json();
  if (!data.choices?.[0]?.message?.content) {
    console.error(`Failed ${part.file} ${difficulty} #${index}:`, data.error || 'no content');
    return null;
  }

  try {
    const exercise = JSON.parse(data.choices[0].message.content);
    exercise.difficulty = difficulty;
    // Validate word count
    const text = exercise.passage || (exercise.clips || []).map(c => c.text).join(' ');
    const wc = text.split(/\s+/).length;
    if (wc < part.wordMin * 0.7) {
      console.log(`    ⚠️ Too short (${wc} words, need ${part.wordMin}), retrying...`);
      return null;
    }
    return exercise;
  } catch (e) {
    console.error(`Parse error ${part.file} ${difficulty} #${index}`);
    return null;
  }
}

async function main() {
  for (const part of PARTS) {
    const libPath = path.join('/var/www/CELPIP/public/data/listening-library', `${part.file}.json`);
    const existing = JSON.parse(fs.readFileSync(libPath, 'utf-8'));
    console.log(`\n${part.file}: ${existing.length} existing exercises`);

    for (const diff of ['beginner', 'advanced']) {
      const alreadyHave = existing.filter(e => e.difficulty === diff).length;
      const needed = EXERCISES_PER_DIFF - alreadyHave;
      if (needed <= 0) { console.log(`  ${diff}: already have ${alreadyHave}, skip`); continue; }
      
      console.log(`  ${diff}: generating ${needed} exercises...`);
      let retries = 0;
      for (let i = 0; i < needed; i++) {
        const exercise = await generateExercise(part, diff, i + 1);
        if (exercise) {
          existing.push(exercise);
          fs.writeFileSync(libPath, JSON.stringify(existing, null, 2));
          console.log(`    ✅ ${diff} #${i + 1}/${needed} — ${exercise.title}`);
          retries = 0;
        } else {
          retries++;
          if (retries > 3) { console.log(`    ❌ skip after 3 retries`); retries = 0; continue; }
          i--;
        }
        await new Promise(r => setTimeout(r, 500));
      }
    }
    console.log(`${part.file}: now ${existing.length} total exercises`);
  }
  console.log('\n🎉 Listening library JSON generation complete!');
  console.log('Next step: run generate-listening-audio.js to create audio files');
}

main().catch(console.error);
