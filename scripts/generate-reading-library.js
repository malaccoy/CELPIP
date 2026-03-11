#!/usr/bin/env node
/**
 * Generate beginner + advanced reading library exercises
 * Uses GPT-4o-mini to create exercises tagged with difficulty
 * Run: node scripts/generate-reading-library.js
 */
const fs = require('fs');
const path = require('path');

const OPENAI_KEY = process.env.OPENAI_API_KEY || fs.readFileSync('/var/www/CELPIP/.env.local', 'utf-8').match(/OPENAI_API_KEY=(.+)/)?.[1];

const PARTS = [
  { file: 'part1', name: 'Part 1 (Reading Correspondence)', desc: 'An email or letter (150-200 words). 11 multiple choice questions (sections A and B).', qCount: 11 },
  { file: 'part2', name: 'Part 2 (Reading to Apply a Diagram)', desc: 'A practical document with a diagram, chart, or schedule (200-250 words). 8 MC questions.', qCount: 8 },
  { file: 'part3', name: 'Part 3 (Reading for Information)', desc: 'An informational article with 3-4 paragraphs (200-300 words). 9 MC questions.', qCount: 9 },
  { file: 'part4', name: 'Part 4 (Reading for Viewpoints)', desc: 'An opinion piece or editorial (200-300 words). 10 MC questions about viewpoints.', qCount: 10 },
];

const DIFFICULTIES = ['beginner', 'advanced'];
const EXERCISES_PER_DIFF = 15;

const diffDescriptions = {
  beginner: `DIFFICULTY: beginner (CLB 5-6)
- Simple, everyday vocabulary. Short clear sentences.
- Main ideas stated explicitly. Answer options clearly distinct — one obviously correct.
- Distractors are obviously wrong.
- Topics: daily life, shopping, school, weather, simple announcements.
- Questions ask "What did X say?" or "What is the main topic?"`,
  advanced: `DIFFICULTY: advanced (CLB 9-12)
- Academic/professional vocabulary (notwithstanding, exacerbate, juxtapose).
- Complex sentence structures: multiple clauses, passive voice, nominalization.
- Key info heavily implied or requires synthesis across paragraphs.
- Distractors VERY close to correct — differ by one subtle detail.
- ALL questions require inference, synthesis, or understanding author's tone/intent.
- Topics: policy debates, scientific reports, legal notices, economic analysis.
- Passage should be dense and require careful re-reading.`
};

async function generateExercise(part, difficulty, index) {
  const prompt = `You are a CELPIP Reading test item writer. Generate a reading passage and questions for ${part.name}.

${diffDescriptions[difficulty]}

${part.desc}

REQUIREMENTS:
- Set in Canada (Canadian cities, institutions, culture)
- Realistic, natural English
- Each question has exactly 4 options (A-D)
- Generate exactly ${part.qCount} questions

Respond in JSON:
{
  "title": "string",
  "passage": "string (the full passage text)",
  "difficulty": "${difficulty}",
  "questions": [
    { "id": 1, "question": "string", "options": ["A","B","C","D"], "correct": 0-3, "explanation": "brief" }
  ]
}`;

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
    return exercise;
  } catch (e) {
    console.error(`Parse error ${part.file} ${difficulty} #${index}`);
    return null;
  }
}

async function main() {
  for (const part of PARTS) {
    const libPath = path.join('/var/www/CELPIP/public/data/reading-library', `${part.file}.json`);
    const existing = JSON.parse(fs.readFileSync(libPath, 'utf-8'));
    console.log(`\n${part.file}: ${existing.length} existing exercises`);

    for (const diff of DIFFICULTIES) {
      const alreadyHave = existing.filter(e => e.difficulty === diff).length;
      const needed = EXERCISES_PER_DIFF - alreadyHave;
      if (needed <= 0) { console.log(`  ${diff}: already have ${alreadyHave}, skip`); continue; }
      
      console.log(`  ${diff}: generating ${needed} exercises...`);
      for (let i = 0; i < needed; i++) {
        const exercise = await generateExercise(part, diff, i + 1);
        if (exercise) {
          existing.push(exercise);
          console.log(`    ✅ ${diff} #${i + 1}/${needed} — ${exercise.title}`);
          // Save after each to not lose progress
          fs.writeFileSync(libPath, JSON.stringify(existing, null, 2));
        } else {
          console.log(`    ❌ ${diff} #${i + 1}/${needed} — failed, retrying...`);
          i--; // retry
        }
        // Rate limit: 500ms between calls
        await new Promise(r => setTimeout(r, 500));
      }
    }
    console.log(`${part.file}: now ${existing.length} total exercises`);
  }
  console.log('\n🎉 Reading library generation complete!');
}

main().catch(console.error);
