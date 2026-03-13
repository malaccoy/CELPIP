#!/usr/bin/env node
/**
 * Expand reading library — add ~50 exercises per part with correct question counts.
 * Part 1: 11q, Part 2: 8q, Part 3: 9q, Part 4: 10q
 */
const fs = require('fs');
const path = require('path');

const OPENAI_KEY = fs.readFileSync('/var/www/CELPIP/.env.local', 'utf-8').match(/OPENAI_API_KEY=(.+)/)?.[1]?.trim();
const DATA_DIR = path.join(__dirname, '../public/data/reading-library');

const PARTS = [
  { file: 'part1', name: 'Part 1 (Reading Correspondence)', desc: 'An email, letter, or written correspondence (300-400 words). The reader must understand the purpose, tone, and details of formal/informal written communication.', qCount: 11 },
  { file: 'part2', name: 'Part 2 (Reading to Apply a Diagram)', desc: 'A passage with a diagram, chart, schedule, or table (250-350 words). Questions test ability to match information between text and visual element.', qCount: 8 },
  { file: 'part3', name: 'Part 3 (Reading for Information)', desc: 'An informational passage — article, report, notice, or policy document (350-450 words). Questions test comprehension of main ideas, supporting details, and inferences.', qCount: 9 },
  { file: 'part4', name: 'Part 4 (Reading for Viewpoints)', desc: 'Two short opinion texts on the same topic by different authors (400-500 words total). Questions test ability to compare, contrast viewpoints, identify agreement/disagreement, and infer attitude.', qCount: 10 },
];

const EXPAND = { beginner: 15, intermediate: 20, advanced: 15 }; // 50 per part

const diffDesc = {
  beginner: 'DIFFICULTY: beginner (CLB 5-6) — Simple vocabulary, explicit information, obviously wrong distractors. Topics: shopping, appointments, community notices, basic workplace.',
  intermediate: 'DIFFICULTY: intermediate (CLB 7-8) — Mix of common and academic vocabulary. Some inference required. Plausible distractors. Topics: workplace, education, health, municipal affairs.',
  advanced: 'DIFFICULTY: advanced (CLB 9-12) — Dense academic/professional text, heavy inference, very close distractors. Topics: policy debates, legal notices, scientific reports, economic analysis.'
};

async function generateExercise(part, difficulty, avoidTopics) {
  const avoidStr = avoidTopics.slice(-20).join(', ');
  const prompt = `You are a CELPIP Reading test item writer. Generate a reading passage and questions for ${part.name}.

${diffDesc[difficulty]}

${part.desc}

REQUIREMENTS:
- Set in Canada (Canadian cities, institutions, culture)
- Generate EXACTLY ${part.qCount} multiple-choice questions
- Each question has exactly 4 options (A-D)
- "correct" field is 0-3 (index of correct option)
- Avoid these topics: ${avoidStr}

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
          temperature: 0.95,
          max_tokens: 4000,
          response_format: { type: 'json_object' },
        }),
      });
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error('No content');
      
      const exercise = JSON.parse(content);
      if (!exercise.questions || exercise.questions.length !== part.qCount) {
        console.log(`    ⚠️ Got ${exercise.questions?.length}q, need ${part.qCount} — retry`);
        continue;
      }
      exercise.difficulty = difficulty;
      return exercise;
    } catch (e) {
      console.log(`    ❌ Attempt ${attempt + 1}: ${e.message}`);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  return null;
}

async function main() {
  let totalAdded = 0;

  for (const part of PARTS) {
    const filePath = path.join(DATA_DIR, `${part.file}.json`);
    const exercises = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const existingTitles = exercises.map(e => e.title || '');
    const startIdx = exercises.length;

    console.log(`\n📖 ${part.name}: ${exercises.length} existing`);

    for (const [diff, count] of Object.entries(EXPAND)) {
      console.log(`  ${diff} (${count})...`);
      for (let i = 0; i < count; i++) {
        const ex = await generateExercise(part, diff, existingTitles);
        if (ex) {
          ex.id = `${part.file}-${String(startIdx + totalAdded + 1).padStart(3, '0')}`;
          exercises.push(ex);
          existingTitles.push(ex.title);
          totalAdded++;
          console.log(`    ✅ [${i + 1}/${count}] "${ex.title}" (${ex.questions.length}q)`);
        } else {
          console.log(`    ❌ [${i + 1}/${count}] Failed`);
        }
        await new Promise(r => setTimeout(r, 300));
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(exercises, null, 2));
    console.log(`  💾 Saved: ${exercises.length} total`);
  }

  console.log(`\n🎉 Done! Added ${totalAdded} exercises`);

  // Summary
  for (const part of PARTS) {
    const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, `${part.file}.json`), 'utf8'));
    const counts = { beginner: 0, intermediate: 0, advanced: 0 };
    data.forEach(e => counts[e.difficulty] = (counts[e.difficulty] || 0) + 1);
    console.log(`${part.file}: ${data.length} total — B:${counts.beginner} I:${counts.intermediate} A:${counts.advanced}`);
  }

  // Build + deploy
  console.log('\n🔨 Building...');
  require('child_process').execSync('cd /var/www/CELPIP && npm run build', { stdio: 'inherit', timeout: 300000 });
  console.log('🚀 Deploying...');
  require('child_process').execSync('pm2 restart celpip', { timeout: 30000 });
  console.log('✅ Deployed!');
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
