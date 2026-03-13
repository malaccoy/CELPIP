#!/usr/bin/env node
/**
 * Fix Listening Part 1 — regenerate 30 exercises with wrong/missing questions.
 * Official: 8 questions, 3 clips format.
 */
const fs = require('fs');
const path = require('path');

const OPENAI_KEY = fs.readFileSync('/var/www/CELPIP/.env.local', 'utf-8').match(/OPENAI_API_KEY=(.+)/)?.[1]?.trim();
const FILE = path.join(__dirname, '../public/data/listening-library/part1.json');

const diffDesc = {
  beginner: 'CLB 5-6: Simple vocabulary, slow speech, explicit answers. Topics: appointments, shopping, basic workplace.',
  intermediate: 'CLB 7-8: Mix of common/academic vocabulary. Some inference needed. Topics: workplace, education, health.',
  advanced: 'CLB 9-12: Complex vocabulary, fast speech, heavy inference. Topics: legal, financial, professional services.'
};

async function generateExercise(difficulty, avoidTopics) {
  const prompt = `You are a CELPIP Listening Part 1 (Problem Solving) item writer.

SCENARIO: Two people discussing a problem and possible solutions. Conversation split into 3 CLIPS.
${diffDesc[difficulty]}

REQUIREMENTS:
- Set in Canada
- Generate a dialogue between two speakers (Man and Woman)
- Split into EXACTLY 3 clips (~80-100 words each, ~240-300 words total)
- EXACTLY 8 multiple-choice questions distributed across clips (3+3+2)
- Each question has 4 options (A-D), "correct" is 0-3
- Each clip has a "passage" field with the dialogue text (use "Man:" and "Woman:" labels)
- Avoid topics: ${avoidTopics.slice(-10).join(', ')}

Respond ONLY with valid JSON:
{
  "title": "string",
  "difficulty": "${difficulty}",
  "clips": [
    {
      "clipIndex": 0,
      "passage": "Man: ... Woman: ...",
      "questions": [
        { "id": 1, "question": "string", "options": ["A","B","C","D"], "correct": 0 }
      ]
    },
    { "clipIndex": 1, "passage": "...", "questions": [...] },
    { "clipIndex": 2, "passage": "...", "questions": [...] }
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
          temperature: 0.9, max_tokens: 4000,
          response_format: { type: 'json_object' },
        }),
      });
      const data = await res.json();
      const ex = JSON.parse(data.choices?.[0]?.message?.content || '{}');
      if (!ex.clips || ex.clips.length !== 3) { console.log(`    ⚠️ ${ex.clips?.length} clips, retry`); continue; }
      const totalQ = ex.clips.reduce((s, c) => s + (c.questions || []).length, 0);
      if (totalQ !== 8) { console.log(`    ⚠️ ${totalQ}q, need 8, retry`); continue; }
      ex.difficulty = difficulty;
      return ex;
    } catch (e) {
      console.log(`    ❌ Attempt ${attempt + 1}: ${e.message}`);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  return null;
}

async function main() {
  const exercises = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const titles = exercises.map(e => e.title || '');
  let fixed = 0;

  console.log(`🎧 Listening Part 1: ${exercises.length} exercises`);

  for (let i = 0; i < exercises.length; i++) {
    const ex = exercises[i];
    let totalQ = 0;
    if (ex.clips) totalQ = ex.clips.reduce((s, c) => s + (c.questions || []).length, 0);
    else totalQ = (ex.questions || []).length;

    if (totalQ === 8 && ex.clips && ex.clips.length === 3) continue;

    console.log(`  [${i + 1}] "${ex.title}" — ${totalQ}q, ${ex.clips?.length || 0} clips → fixing...`);
    const newEx = await generateExercise(ex.difficulty || 'intermediate', titles);
    if (newEx) {
      newEx.id = ex.id || `part1-${String(i + 1).padStart(3, '0')}`;
      exercises[i] = newEx;
      titles.push(newEx.title);
      fixed++;
      console.log(`    ✅ "${newEx.title}"`);
    } else {
      console.log(`    ❌ Failed`);
    }
    await new Promise(r => setTimeout(r, 500));
  }

  fs.writeFileSync(FILE, JSON.stringify(exercises, null, 2));
  console.log(`\n🎉 Fixed ${fixed} exercises`);

  // Verify
  const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const broken = data.filter(e => {
    if (!e.clips || e.clips.length !== 3) return true;
    return e.clips.reduce((s, c) => s + (c.questions || []).length, 0) !== 8;
  });
  console.log(`Remaining broken: ${broken.length}`);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
