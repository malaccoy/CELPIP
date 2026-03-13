const fs = require('fs');
const OPENAI_KEY = fs.readFileSync('/var/www/CELPIP/.env.local', 'utf8').match(/OPENAI_API_KEY=(.+)/)[1].trim();

const taskDescriptions = {
  1: 'Giving Advice — A friend/family member asks for advice about a situation. Student must give advice with reasons.',
  2: 'Talking about a Personal Experience — Describe a past experience related to the topic.',
  3: 'Describing a Scene — Describe what is happening in an image/scene (student imagines the scene from the description).',
  4: 'Making Predictions — Look at a scene and predict what will happen next, with reasons.',
  5: 'Comparing and Persuading — Compare two options and persuade the listener to choose one.',
  6: 'Dealing with a Difficult Situation — Handle a challenging social or work situation diplomatically.',
  7: 'Expressing Opinions — Give your opinion on a topic with reasons and examples.',
  8: 'Describing an Unusual Situation — Describe an unusual or unexpected event and explain its significance.',
};

const difficulties = ['beginner', 'intermediate', 'advanced'];
const diffDesc = {
  beginner: 'CLB 5-6: Simple everyday topics, basic vocabulary, straightforward situations',
  intermediate: 'CLB 7-8: Moderately complex topics, some nuance required, workplace/social contexts',
  advanced: 'CLB 9-12: Complex topics, sophisticated reasoning, abstract concepts, professional contexts'
};

async function callGPT(prompt) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.95,
      max_tokens: 8000,
    }),
  });
  const data = await res.json();
  const text = data.choices[0].message.content;
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error('No JSON found');
  return JSON.parse(match[0]);
}

async function main() {
  for (let task = 1; task <= 8; task++) {
    const filePath = `/var/www/CELPIP/public/data/speaking-library/task${task}.json`;
    const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const existingTopics = existing.map(e => e.topic || e.prompt?.slice(0, 40) || '').filter(Boolean).join(', ');
    
    console.log(`\nTask ${task}: ${existing.length} existing — ${taskDescriptions[task]}`);
    
    let newItems = [];
    for (const diff of difficulties) {
      console.log(`  ${diff}...`);
      const items = await callGPT(`Generate 20 unique CELPIP Speaking Task ${task} prompts.

Task ${task}: ${taskDescriptions[task]}
Difficulty: ${diff} (${diffDesc[diff]})

EXISTING topics (DO NOT REPEAT): ${existingTopics}

Each prompt should be a realistic CELPIP speaking scenario with Canadian context.

Return JSON array: [{"prompt": "full prompt text the student sees", "topic": "short label", "task": ${task}, "difficulty": "${diff}"}]

Return ONLY the JSON array.`);
      
      items.forEach(item => {
        item.task = task;
        item.difficulty = diff;
      });
      newItems = newItems.concat(items);
      await new Promise(r => setTimeout(r, 2000));
    }
    
    // Fix IDs
    let nextId = existing.length + 1;
    newItems.forEach(item => {
      item.id = `task${task}-${String(nextId++).padStart(3, '0')}`;
    });
    
    const merged = [...existing, ...newItems];
    fs.writeFileSync(filePath, JSON.stringify(merged, null, 2));
    console.log(`✅ Task ${task}: ${existing.length} → ${merged.length}`);
  }
  console.log('\n🎉 Done!');
}

main().catch(console.error);
