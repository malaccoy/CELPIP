#!/usr/bin/env node
/**
 * Fix Writing Task 2 — add bulletPoints to the 90 exercises missing them.
 */
const fs = require('fs');
const path = require('path');

const OPENAI_KEY = fs.readFileSync('/var/www/CELPIP/.env.local', 'utf-8').match(/OPENAI_API_KEY=(.+)/)?.[1]?.trim();
const FILE = path.join(__dirname, '../public/data/writing-library/task2.json');

async function addBulletPoints(exercise) {
  const prompt = `Given this CELPIP Writing Task 2 (Survey Response) prompt:

Question: ${exercise.question}
Option A: ${exercise.optionA}
Option B: ${exercise.optionB}

Generate 3 bullet points that guide the test-taker on what to cover in their response (like the real CELPIP exam).

Respond ONLY with valid JSON:
{ "bulletPoints": ["point 1", "point 2", "point 3"] }`;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7, max_tokens: 500,
        response_format: { type: 'json_object' },
      }),
    });
    const data = await res.json();
    return JSON.parse(data.choices?.[0]?.message?.content || '{}');
  } catch (e) {
    return null;
  }
}

async function main() {
  const exercises = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const missing = exercises.filter(e => !e.bulletPoints || e.bulletPoints.length === 0);
  console.log(`✍️ Writing Task 2: ${exercises.length} total, ${missing.length} missing bulletPoints`);

  let fixed = 0;
  for (let i = 0; i < exercises.length; i++) {
    const ex = exercises[i];
    if (ex.bulletPoints && ex.bulletPoints.length > 0) continue;

    process.stdout.write(`  [${fixed + 1}/${missing.length}] "${ex.scenario?.slice(0, 50)}..."`)
    const result = await addBulletPoints(ex);
    if (result?.bulletPoints?.length >= 3) {
      ex.bulletPoints = result.bulletPoints;
      fixed++;
      console.log(` ✅`);
    } else {
      console.log(` ❌`);
    }
    await new Promise(r => setTimeout(r, 300));
  }

  fs.writeFileSync(FILE, JSON.stringify(exercises, null, 2));
  console.log(`\n🎉 Done! Fixed ${fixed}/${missing.length}`);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
