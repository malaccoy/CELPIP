const fs = require('fs');
const path = require('path');

const OPENAI_KEY = process.env.OPENAI_API_KEY || fs.readFileSync('/var/www/CELPIP/.env.local', 'utf8').match(/OPENAI_API_KEY=(.+)/)?.[1];

async function callGPT(prompt) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

function isBadExercise(ex) {
  for (const q of ex.questions || []) {
    for (const opt of q.options || []) {
      if (typeof opt === 'string' && opt.length <= 2) return true;
    }
  }
  return false;
}

const PART_CONFIGS = {
  part1: { name: 'Reading Correspondence', numQ: 11, desc: 'an email or letter exchange in a Canadian workplace/community context' },
  part2: { name: 'Reading to Apply a Diagram', numQ: 8, desc: 'a passage with a diagram, chart, or table about Canadian life/services' },
  part3: { name: 'Reading for Information', numQ: 9, desc: 'an informational passage about Canadian policies, services, or community topics' },
  part4: { name: 'Reading for Viewpoints', numQ: 10, desc: 'a passage presenting multiple viewpoints on a Canadian social/workplace issue' },
};

async function fixExercise(ex, partKey) {
  const cfg = PART_CONFIGS[partKey];
  const prompt = `Generate ${cfg.numQ} multiple-choice questions for a CELPIP ${cfg.name} exercise.

The passage is about: "${ex.title}"

Here is the passage text (first 500 chars): "${(ex.passage || '').substring(0, 500)}..."

Generate exactly ${cfg.numQ} questions. Each question must have 4 options (full sentences, not just letters).
Return ONLY a JSON array like:
[{"question": "...", "options": ["option A text", "option B text", "option C text", "option D text"], "correct": 0}]

The "correct" field is the 0-based index of the right answer.
Make questions that test comprehension of the passage. Options should be plausible and detailed (5-15 words each).`;

  const raw = await callGPT(prompt);
  try {
    const json = raw.match(/\[[\s\S]*\]/)?.[0];
    const questions = JSON.parse(json);
    if (!Array.isArray(questions) || questions.length < 3) throw new Error('Too few questions');
    
    // Validate all options are real strings
    for (const q of questions) {
      if (!q.options || q.options.length !== 4) throw new Error('Bad options count');
      for (const opt of q.options) {
        if (typeof opt !== 'string' || opt.length <= 2) throw new Error('Short option: ' + opt);
      }
    }
    
    return questions.map((q, i) => ({ id: i + 1, question: q.question, options: q.options, correct: q.correct }));
  } catch (e) {
    console.error('  Parse error:', e.message);
    return null;
  }
}

async function main() {
  let totalFixed = 0;
  let totalFailed = 0;

  for (const partKey of ['part1', 'part2', 'part3', 'part4']) {
    const filePath = path.join('/var/www/CELPIP/public/data/reading-library', `${partKey}.json`);
    const exercises = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    const badExercises = exercises.filter(isBadExercise);
    if (badExercises.length === 0) {
      console.log(`${partKey}: 0 bad, skipping`);
      continue;
    }
    
    console.log(`${partKey}: ${badExercises.length} bad exercises to fix`);
    
    for (const ex of badExercises) {
      process.stdout.write(`  Fixing ${ex.id}...`);
      const newQuestions = await fixExercise(ex, partKey);
      if (newQuestions) {
        ex.questions = newQuestions;
        totalFixed++;
        console.log(' ✅');
      } else {
        totalFailed++;
        console.log(' ❌ (retry)');
        // Retry once
        const retry = await fixExercise(ex, partKey);
        if (retry) {
          ex.questions = retry;
          totalFixed++;
          totalFailed--;
          console.log('  Retry ✅');
        }
      }
      // Rate limit
      await new Promise(r => setTimeout(r, 500));
    }
    
    fs.writeFileSync(filePath, JSON.stringify(exercises, null, 2));
    console.log(`${partKey}: saved`);
  }

  console.log(`\nDone! Fixed: ${totalFixed}, Failed: ${totalFailed}`);
}

main().catch(console.error);
