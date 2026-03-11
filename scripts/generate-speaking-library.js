#!/usr/bin/env node
/**
 * Generate beginner + advanced speaking library prompts
 */
const fs = require('fs');
const path = require('path');

const OPENAI_KEY = fs.readFileSync('/var/www/CELPIP/.env.local', 'utf-8').match(/OPENAI_API_KEY=(.+)/)?.[1];

const TASKS = [
  { file: 'task1', name: 'Task 1 (Giving Advice)', prep: 30, speak: 90 },
  { file: 'task2', name: 'Task 2 (Talking about Personal Experience)', prep: 30, speak: 60 },
  { file: 'task3', name: 'Task 3 (Describing a Scene)', prep: 30, speak: 60 },
  { file: 'task4', name: 'Task 4 (Making Predictions)', prep: 30, speak: 60 },
  { file: 'task5', name: 'Task 5 (Comparing and Persuading)', prep: 30, speak: 60 },
  { file: 'task6', name: 'Task 6 (Dealing with a Difficult Situation)', prep: 30, speak: 60 },
  { file: 'task7', name: 'Task 7 (Expressing Opinions)', prep: 30, speak: 90 },
  { file: 'task8', name: 'Task 8 (Describing an Unusual Situation)', prep: 30, speak: 60 },
];

const EXERCISES_PER_DIFF = 15;

const diffDesc = {
  beginner: `DIFFICULTY: beginner (CLB 5-6)
- Familiar, concrete topic (favorite food, weekend plan, lost item).
- Simple scenario with clear instructions. One straightforward perspective.
- Easy to organize with basic "First... Then... Finally..."`,
  advanced: `DIFFICULTY: advanced (CLB 9-12)
- Abstract, nuanced situation with competing priorities and ethical dimensions.
- Requires sophisticated argumentation — counterarguments, concessions, layered reasoning.
- Scenario involves ambiguity with no clearly "right" answer.
- Topics: policy trade-offs, ethical dilemmas, cultural tensions, hypothetical scenarios with multiple stakeholders.`
};

async function generate(task, difficulty, index) {
  const prompt = `You are a CELPIP Speaking test prompt designer. Generate a speaking prompt for ${task.name}.

${diffDesc[difficulty]}

Set in Canada. Clear situation/scenario.
${task.name.includes('Task 3') || task.name.includes('Task 4') ? 'Include "imagePrompt" field — a detailed visual description (60-100 words) of the scene.' : ''}

Respond in JSON:
{
  "title": "short title",
  "scenario": "short title",
  "prompt": "full prompt the candidate sees",
  "difficulty": "${difficulty}",
  ${task.name.includes('Task 3') || task.name.includes('Task 4') ? '"imagePrompt": "detailed visual scene description",' : ''}
  "prepTimeSeconds": ${task.prep},
  "speakTimeSeconds": ${task.speak},
  "tips": ["tip 1", "tip 2"]
}`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.95, max_tokens: 2000,
      response_format: { type: 'json_object' },
    }),
  });

  const data = await res.json();
  if (!data.choices?.[0]?.message?.content) { console.error(`Failed:`, data.error); return null; }
  try {
    const ex = JSON.parse(data.choices[0].message.content);
    ex.difficulty = difficulty;
    return ex;
  } catch { return null; }
}

async function main() {
  for (const task of TASKS) {
    const libPath = path.join('/var/www/CELPIP/public/data/speaking-library', `${task.file}.json`);
    const existing = JSON.parse(fs.readFileSync(libPath, 'utf-8'));
    console.log(`\n${task.file}: ${existing.length} existing`);

    for (const diff of ['beginner', 'advanced']) {
      const have = existing.filter(e => e.difficulty === diff).length;
      const needed = EXERCISES_PER_DIFF - have;
      if (needed <= 0) { console.log(`  ${diff}: have ${have}, skip`); continue; }
      
      console.log(`  ${diff}: generating ${needed}...`);
      let retries = 0;
      for (let i = 0; i < needed; i++) {
        const ex = await generate(task, diff, i + 1);
        if (ex) {
          existing.push(ex);
          fs.writeFileSync(libPath, JSON.stringify(existing, null, 2));
          console.log(`    ✅ ${diff} #${i + 1}/${needed}`);
          retries = 0;
        } else {
          retries++;
          if (retries > 3) { console.log(`    ❌ skipping after 3 retries`); retries = 0; continue; }
          i--;
        }
        await new Promise(r => setTimeout(r, 400));
      }
    }
    console.log(`${task.file}: now ${existing.length} total`);
  }
  console.log('\n🎉 Speaking library complete!');
}

main().catch(console.error);
