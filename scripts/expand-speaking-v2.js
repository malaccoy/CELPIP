const fs = require('fs');
const path = require('path');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || fs.readFileSync('/var/www/CELPIP/.env.local', 'utf8').match(/OPENAI_API_KEY=(.+)/)?.[1];
const LIB_DIR = path.join(__dirname, '..', 'public', 'data', 'speaking-library');
const TARGET_PER_TASK = 200;

const TASK_CONFIGS = {
  1: { name: 'Giving Advice', prep: 30, speak: 90, desc: 'A friend/family asks for advice on a personal situation. Give 3 suggestions.', fields: '' },
  2: { name: 'Personal Experience', prep: 30, speak: 60, desc: 'Talk about a personal experience related to a topic.', fields: '' },
  3: { name: 'Describing a Scene', prep: 30, speak: 60, desc: 'Describe a scene/image in detail — people, actions, setting, mood.', fields: '' },
  4: { name: 'Making Predictions', prep: 30, speak: 60, desc: 'Look at a scene and predict what will happen next.', fields: '' },
  5: { name: 'Comparing and Persuading', prep: 60, speak: 60, desc: 'Compare two options and persuade someone to choose one.', fields: ', "optionA": "string", "optionB": "string"' },
  6: { name: 'Dealing with a Difficult Situation', prep: 60, speak: 60, desc: 'Handle a difficult situation — explain your approach.', fields: ', "choiceA": "string", "choiceB": "string"' },
  7: { name: 'Expressing Opinions', prep: 30, speak: 90, desc: 'Express and defend your opinion on a statement.', fields: ', "statement": "string (the opinion statement to agree/disagree with)"' },
  8: { name: 'Describing an Experience', prep: 30, speak: 60, desc: 'Describe an unusual or memorable experience.', fields: '' },
};

const DIFFICULTIES = {
  beginner: { clb: '5-6', desc: 'Simple everyday Canadian scenarios. Basic vocabulary. Short, clear prompts.' },
  intermediate: { clb: '7-8', desc: 'Workplace, community, social scenarios. Moderate complexity. Some nuance required.' },
  advanced: { clb: '9-12', desc: 'Complex professional, ethical, abstract scenarios. Sophisticated vocabulary and reasoning.' },
};

async function callGPT(prompt, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.95,
          max_tokens: 4000,
        }),
      });
      const data = await res.json();
      return data.choices?.[0]?.message?.content || '';
    } catch (e) {
      console.error(`  Retry ${i + 1}:`, e.message);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  return '';
}

function parseJSON(text) {
  try {
    const match = text.match(/\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]);
  } catch {}
  return null;
}

async function expandTask(taskNum) {
  const config = TASK_CONFIGS[taskNum];
  const filePath = path.join(LIB_DIR, `task${taskNum}.json`);
  const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const currentCount = existing.length;
  const needed = TARGET_PER_TASK - currentCount;
  
  if (needed <= 0) {
    console.log(`Task ${taskNum}: already ${currentCount} (>= ${TARGET_PER_TASK}), skipping`);
    return;
  }

  console.log(`\n🎤 Task ${taskNum} (${config.name}): ${currentCount} → ${TARGET_PER_TASK} (need ${needed})`);

  // Get existing titles to avoid duplicates
  const existingTitles = new Set(existing.map(p => (p.title || p.scenario || '').toLowerCase().slice(0, 40)));
  const nextId = existing.length + 1;

  // Distribute: ~30% beginner, ~40% intermediate, ~30% advanced
  const batchPlan = [
    { diff: 'beginner', count: Math.round(needed * 0.3) },
    { diff: 'intermediate', count: Math.round(needed * 0.4) },
    { diff: 'advanced', count: needed - Math.round(needed * 0.3) - Math.round(needed * 0.4) },
  ];

  let added = 0;
  let idCounter = nextId;

  for (const batch of batchPlan) {
    const { diff, count } = batch;
    if (count <= 0) continue;
    
    // Generate in chunks of 10
    for (let offset = 0; offset < count; offset += 10) {
      const batchSize = Math.min(10, count - offset);
      const diffInfo = DIFFICULTIES[diff];
      
      const prompt = `Generate ${batchSize} UNIQUE CELPIP Speaking ${config.name} prompts.

Task: ${config.desc}
Difficulty: ${diff} (CLB ${diffInfo.clb}) — ${diffInfo.desc}
Prep time: ${config.prep}s, Speak time: ${config.speak}s

CONTEXT: Canadian daily life, workplace, community. All scenarios must be realistic for someone living in Canada.

AVOID these topics (already exist): ${[...existingTitles].slice(-30).join(', ')}

Return a JSON array of ${batchSize} objects:
[{
  "id": "task${taskNum}-XXX",
  "scenario": "string (2-3 sentence scene description)",
  "prompt": "string (the actual speaking prompt/instruction)",
  "tips": ["tip1", "tip2", "tip3"],
  "bulletPoints": ["point1", "point2", "point3"],
  "context": "string (brief context)",
  "difficulty": "${diff}",
  "prepTimeSeconds": ${config.prep},
  "speakTimeSeconds": ${config.speak}${config.fields}
}]

Return ONLY the JSON array, no markdown.`;

      const response = await callGPT(prompt);
      const prompts = parseJSON(response);
      
      if (!prompts || !Array.isArray(prompts)) {
        console.error(`  ❌ Failed to parse batch (${diff} ${offset})`);
        continue;
      }

      for (const p of prompts) {
        if (!p.prompt || !p.scenario) continue;
        const title = (p.scenario || '').toLowerCase().slice(0, 40);
        if (existingTitles.has(title)) continue;
        
        p.id = `task${taskNum}-${String(idCounter).padStart(3, '0')}`;
        p.prepTimeSeconds = config.prep;
        p.speakTimeSeconds = config.speak;
        p.difficulty = diff;
        
        existing.push(p);
        existingTitles.add(title);
        idCounter++;
        added++;
      }
      
      process.stdout.write(`  [${diff}] +${prompts.length} (total ${existing.length})\n`);
      
      // Rate limit
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
  console.log(`  💾 Saved: ${existing.length} total (+${added} new)`);
}

async function main() {
  console.log('🎤 Expanding Speaking Library to ~200 per task\n');
  
  for (let t = 1; t <= 8; t++) {
    await expandTask(t);
  }
  
  console.log('\n🎉 Done!');
  
  // Summary
  for (let t = 1; t <= 8; t++) {
    const data = JSON.parse(fs.readFileSync(path.join(LIB_DIR, `task${t}.json`), 'utf8'));
    const counts = { beginner: 0, intermediate: 0, advanced: 0 };
    data.forEach(p => counts[p.difficulty]++);
    console.log(`Task ${t}: ${data.length} (B:${counts.beginner} I:${counts.intermediate} A:${counts.advanced})`);
  }
}

main().catch(console.error);
