#!/usr/bin/env node
/**
 * Patch speaking library — add correct timer fields + regenerate task-specific fields for Tasks 5,6,7.
 * 
 * Official timers:
 * T1: prep 30, speak 90  |  T2: prep 30, speak 60  |  T3: prep 30, speak 60
 * T4: prep 30, speak 60  |  T5: prep 60, speak 60  |  T6: prep 60, speak 60
 * T7: prep 30, speak 90  |  T8: prep 30, speak 60
 *
 * Task-specific fields:
 * T5: optionA, optionB (Comparing and Persuading)
 * T6: choiceA, choiceB (Dealing with a Difficult Situation)
 * T7: statement (Expressing Opinions)
 */
const fs = require('fs');
const path = require('path');

const OPENAI_KEY = fs.readFileSync('/var/www/CELPIP/.env.local', 'utf-8').match(/OPENAI_API_KEY=(.+)/)?.[1]?.trim();
const DATA_DIR = path.join(__dirname, '../public/data/speaking-library');

const TIMERS = {
  task1: { prep: 30, speak: 90 },
  task2: { prep: 30, speak: 60 },
  task3: { prep: 30, speak: 60 },
  task4: { prep: 30, speak: 60 },
  task5: { prep: 60, speak: 60 },
  task6: { prep: 60, speak: 60 },
  task7: { prep: 30, speak: 90 },
  task8: { prep: 30, speak: 60 },
};

const TASK_FIELDS = {
  task5: { field: 'optionA', also: 'optionB', desc: 'Task 5 — Comparing and Persuading. The speaker must choose between two options and persuade the listener.' },
  task6: { field: 'choiceA', also: 'choiceB', desc: 'Task 6 — Dealing with a Difficult Situation. The speaker must choose how to handle a difficult situation.' },
  task7: { field: 'statement', also: null, desc: 'Task 7 — Expressing Opinions. The speaker must agree/disagree with a statement and explain why.' },
};

const diffDesc = {
  beginner: 'CLB 5-6: Simple everyday scenarios.',
  intermediate: 'CLB 7-8: Workplace/community scenarios.',
  advanced: 'CLB 9-12: Complex professional/policy scenarios.'
};

async function regeneratePrompt(taskId, exercise) {
  const tf = TASK_FIELDS[taskId];
  if (!tf) return null;

  const extraFields = taskId === 'task5' ?
    '"optionA": "First option description", "optionB": "Second option description"' :
    taskId === 'task6' ?
    '"choiceA": "First choice description", "choiceB": "Second choice description"' :
    '"statement": "A clear opinion statement the speaker must agree or disagree with"';

  const prompt = `You are a CELPIP Speaking ${tf.desc}

${diffDesc[exercise.difficulty || 'intermediate']}

Generate a speaking prompt set in Canada. Keep the scenario from this seed but add the missing fields:
Scenario: ${exercise.scenario || exercise.prompt}

Respond ONLY with valid JSON:
{
  "scenario": "brief scenario description",
  "prompt": "full prompt text with instructions",
  "bulletPoints": ["point 1", "point 2", "point 3"],
  "context": "additional context",
  "tips": ["tip 1", "tip 2"],
  ${extraFields}
}`;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7, max_tokens: 2000,
        response_format: { type: 'json_object' },
      }),
    });
    const data = await res.json();
    return JSON.parse(data.choices?.[0]?.message?.content || '{}');
  } catch (e) {
    console.log(`    ❌ ${e.message}`);
    return null;
  }
}

async function main() {
  let timerPatched = 0;
  let fieldsRegenerated = 0;
  let failedRegen = 0;

  for (let t = 1; t <= 8; t++) {
    const taskId = `task${t}`;
    const filePath = path.join(DATA_DIR, `${taskId}.json`);
    const exercises = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const timer = TIMERS[taskId];
    const needsFields = TASK_FIELDS[taskId];

    console.log(`\n🎤 ${taskId}: ${exercises.length} prompts`);

    for (let i = 0; i < exercises.length; i++) {
      const ex = exercises[i];

      // 1. Patch timers
      if (ex.prepTimeSeconds !== timer.prep || ex.speakTimeSeconds !== timer.speak) {
        ex.prepTimeSeconds = timer.prep;
        ex.speakTimeSeconds = timer.speak;
        timerPatched++;
      }

      // 2. Regenerate missing task-specific fields
      if (needsFields) {
        const missing = !ex[needsFields.field];
        if (missing) {
          process.stdout.write(`  [${i + 1}] regenerating fields...`);
          const newData = await regeneratePrompt(taskId, ex);
          if (newData) {
            // Merge fields but keep id, difficulty
            if (newData.scenario) ex.scenario = newData.scenario;
            if (newData.prompt) ex.prompt = newData.prompt;
            if (newData.bulletPoints) ex.bulletPoints = newData.bulletPoints;
            if (newData.context) ex.context = newData.context;
            if (newData.tips) ex.tips = newData.tips;
            if (taskId === 'task5') { ex.optionA = newData.optionA; ex.optionB = newData.optionB; }
            if (taskId === 'task6') { ex.choiceA = newData.choiceA; ex.choiceB = newData.choiceB; }
            if (taskId === 'task7') { ex.statement = newData.statement; }
            fieldsRegenerated++;
            console.log(` ✅`);
          } else {
            failedRegen++;
            console.log(` ❌`);
          }
          await new Promise(r => setTimeout(r, 300));
        }
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(exercises, null, 2));
    console.log(`  💾 Saved`);
  }

  console.log(`\n🎉 Done! Timers patched: ${timerPatched}, Fields regenerated: ${fieldsRegenerated}, Failed: ${failedRegen}`);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
