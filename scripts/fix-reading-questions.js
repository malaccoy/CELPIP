#!/usr/bin/env node
/**
 * Fix reading library exercises with wrong question counts.
 * Official CELPIP format:
 *   Part 1: 11 questions
 *   Part 2: 8 questions
 *   Part 3: 9 questions
 *   Part 4: 10 questions
 */
const fs = require('fs');
const path = require('path');

const OPENAI_KEY = fs.readFileSync('/var/www/CELPIP/.env.local', 'utf-8').match(/OPENAI_API_KEY=(.+)/)?.[1]?.trim();
const DATA_DIR = path.join(__dirname, '../public/data/reading-library');

const PARTS = [
  { file: 'part1', name: 'Part 1 (Reading Correspondence)', desc: 'An email, letter, or written correspondence (300-400 words). The reader must understand the purpose, tone, and details.', qCount: 11 },
  { file: 'part2', name: 'Part 2 (Reading to Apply a Diagram)', desc: 'A passage with a diagram, chart, schedule, or table (250-350 words). Questions test ability to match information between text and visual.', qCount: 8 },
  { file: 'part3', name: 'Part 3 (Reading for Information)', desc: 'An informational passage — article, report, or policy document (350-450 words). Questions test comprehension of main ideas and details.', qCount: 9 },
  { file: 'part4', name: 'Part 4 (Reading for Viewpoints)', desc: 'Two short opinion texts on the same topic by different authors (400-500 words total). Questions test ability to compare viewpoints, identify agreement/disagreement.', qCount: 10 },
];

const diffDesc = {
  beginner: 'DIFFICULTY: beginner (CLB 5-6) — Simple vocabulary, explicit information, obviously wrong distractors. Topics: shopping, appointments, community notices.',
  intermediate: 'DIFFICULTY: intermediate (CLB 7-8) — Mix of common and academic vocabulary. Some inference required. Plausible distractors. Topics: workplace, education, health.',
  advanced: 'DIFFICULTY: advanced (CLB 9-12) — Dense academic text, heavy inference, very close distractors differing by subtle details. Topics: policy, legal, scientific.'
};

async function generateExercise(part, difficulty, existingTitle) {
  const prompt = `You are a CELPIP Reading test item writer. Generate a reading passage and questions for ${part.name}.

${diffDesc[difficulty]}

${part.desc}

REQUIREMENTS:
- Set in Canada (Canadian cities, institutions, culture)
- Generate EXACTLY ${part.qCount} multiple-choice questions
- Each question has exactly 4 options (A-D)
- "correct" field is 0-3 (index of correct option)
- Do NOT reuse this topic: "${existingTitle}"

Respond ONLY with valid JSON:
{
  "title": "string",
  "difficulty": "${difficulty}",
  "passage": "full text",
  "questions": [
    { "id": 1, "question": "string", "options": ["A","B","C","D"], "correct": 0 }
  ]
}`;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.9,
          max_tokens: 4000,
          response_format: { type: 'json_object' },
        }),
      });
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error('No content');
      
      const exercise = JSON.parse(content);
      if (!exercise.questions || exercise.questions.length !== part.qCount) {
        console.log(`    ⚠️ Got ${exercise.questions?.length} questions, need ${part.qCount} — retrying...`);
        continue;
      }
      exercise.difficulty = difficulty;
      return exercise;
    } catch (e) {
      console.log(`    ❌ Attempt ${attempt + 1} failed: ${e.message}`);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  return null;
}

async function main() {
  let totalFixed = 0;
  let totalFailed = 0;

  for (const part of PARTS) {
    const filePath = path.join(DATA_DIR, `${part.file}.json`);
    const exercises = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    const wrong = exercises.filter(e => (e.questions || []).length !== part.qCount);
    console.log(`\n📖 ${part.name}: ${exercises.length} exercises, ${wrong.length} need fixing (should have ${part.qCount} questions)`);
    
    if (wrong.length === 0) continue;

    for (let i = 0; i < exercises.length; i++) {
      const ex = exercises[i];
      const qLen = (ex.questions || []).length;
      if (qLen === part.qCount) continue;

      console.log(`  [${i + 1}/${exercises.length}] "${ex.title}" — has ${qLen}q, fixing...`);
      
      const newEx = await generateExercise(part, ex.difficulty || 'intermediate', ex.title || '');
      if (newEx) {
        // Preserve id if exists
        newEx.id = ex.id || `${part.file}-${String(i + 1).padStart(3, '0')}`;
        exercises[i] = newEx;
        totalFixed++;
        console.log(`    ✅ Fixed: "${newEx.title}" (${newEx.questions.length}q)`);
      } else {
        totalFailed++;
        console.log(`    ❌ Failed to regenerate`);
      }

      // Rate limit: 500ms between calls
      await new Promise(r => setTimeout(r, 500));
    }

    // Ensure all have IDs
    exercises.forEach((e, i) => {
      if (!e.id) e.id = `${part.file}-${String(i + 1).padStart(3, '0')}`;
    });

    // Save
    fs.writeFileSync(filePath, JSON.stringify(exercises, null, 2));
    console.log(`  💾 Saved ${part.file}.json`);
  }

  console.log(`\n🎉 Done! Fixed: ${totalFixed}, Failed: ${totalFailed}`);

  // Verify
  for (const part of PARTS) {
    const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, `${part.file}.json`), 'utf8'));
    const wrong = data.filter(e => (e.questions || []).length !== part.qCount);
    console.log(`${part.file}: ${data.length} total, ${wrong.length} still wrong`);
  }
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
