#!/usr/bin/env node
/**
 * Generate beginner + advanced writing library prompts
 */
const fs = require('fs');
const path = require('path');

const OPENAI_KEY = fs.readFileSync('/var/www/CELPIP/.env.local', 'utf-8').match(/OPENAI_API_KEY=(.+)/)?.[1];

const TASKS = [
  { file: 'task1', name: 'Task 1 (Writing an Email)', desc: 'Write an email (formal, semi-formal, or informal). 150-200 words. Include 3-4 bullet points the candidate must address.' },
  { file: 'task2', name: 'Task 2 (Responding to Survey Questions)', desc: 'Respond to a survey with two options. Choose one and explain why. 150-200 words.' },
];

const EXERCISES_PER_DIFF = 15;

const diffDesc = {
  beginner: `DIFFICULTY: beginner (CLB 5-6)
- Common everyday scenario (email to friend, complaint about product).
- Clear, simple instructions with obvious bullet points.
- Straightforward tone, one clear audience.`,
  advanced: `DIFFICULTY: advanced (CLB 9-12)
- Complex situation with multiple stakeholders, competing interests.
- Bullet points require sophisticated argumentation — weighing trade-offs, anticipating objections.
- Formal register with hedging language needed.
- Topics: policy recommendations, mediating conflicts, professional negotiations.`
};

async function generate(task, difficulty) {
  const prompt = `You are a CELPIP Writing test prompt designer. Generate a writing prompt for ${task.name}.

${diffDesc[difficulty]}

${task.desc}

Set in Canada.

Respond in JSON:
{
  "title": "short title",
  "scenario": "short scenario description",
  "prompt": "full prompt",
  "difficulty": "${difficulty}",
  "bulletPoints": ["point 1", "point 2", "point 3"],
  "context": "brief context",
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
  if (!data.choices?.[0]?.message?.content) return null;
  try {
    const ex = JSON.parse(data.choices[0].message.content);
    ex.difficulty = difficulty;
    return ex;
  } catch { return null; }
}

async function main() {
  for (const task of TASKS) {
    const libPath = path.join('/var/www/CELPIP/public/data/writing-library', `${task.file}.json`);
    const existing = JSON.parse(fs.readFileSync(libPath, 'utf-8'));
    console.log(`\n${task.file}: ${existing.length} existing`);

    for (const diff of ['beginner', 'advanced']) {
      const have = existing.filter(e => e.difficulty === diff).length;
      const needed = EXERCISES_PER_DIFF - have;
      if (needed <= 0) { console.log(`  ${diff}: have ${have}, skip`); continue; }
      
      console.log(`  ${diff}: generating ${needed}...`);
      let retries = 0;
      for (let i = 0; i < needed; i++) {
        const ex = await generate(task, diff);
        if (ex) {
          existing.push(ex);
          fs.writeFileSync(libPath, JSON.stringify(existing, null, 2));
          console.log(`    ✅ ${diff} #${i + 1}/${needed}`);
          retries = 0;
        } else {
          retries++;
          if (retries > 3) { console.log(`    ❌ skip`); retries = 0; continue; }
          i--;
        }
        await new Promise(r => setTimeout(r, 400));
      }
    }
    console.log(`${task.file}: now ${existing.length} total`);
  }
  console.log('\n🎉 Writing library complete!');
}

main().catch(console.error);
