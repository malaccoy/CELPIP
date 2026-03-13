const fs = require('fs');
const OPENAI_KEY = fs.readFileSync('/var/www/CELPIP/.env.local', 'utf8').match(/OPENAI_API_KEY=(.+)/)[1].trim();
const CONTEXTS_PATH = '/var/www/CELPIP/public/content/contexts.json';
const contexts = JSON.parse(fs.readFileSync(CONTEXTS_PATH, 'utf8'));

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
  if (!match) throw new Error('No JSON array found');
  return JSON.parse(match[0]);
}

async function expandTask1() {
  const existing = contexts.task1;
  const existingTitles = existing.map(e => e.title).join(', ');
  
  const categories = {
    complaint: 12,
    request: 12,
    thanks: 8,
    apology: 8,
    information: 8,
    suggestion: 8,
    invitation: 6,
    congratulations: 6,
    recommendation: 6,
    negotiation: 6,
  };

  let allNew = [];
  for (const [cat, count] of Object.entries(categories)) {
    console.log(`  Task 1 - ${cat} (${count})...`);
    const items = await callGPT(`Generate ${count} CELPIP Writing Task 1 email themes for category "${cat}".

EXISTING themes (DO NOT REPEAT): ${existingTitles}

Each theme needs:
- title: short name (e.g. "Noise Complaint to Landlord")
- prompt: the full scenario the student sees (2-4 sentences describing the situation, who to write to, and what to include). MUST have 3 bullet points of what to address.
- tips: array of 3-4 short writing tips for this specific theme
- category: "${cat}"
- difficulty: "intermediate"

Canadian context. Realistic everyday situations.

Return JSON array only: [{"title":"...","prompt":"...","tips":["..."],"category":"${cat}","difficulty":"intermediate"}]`);
    allNew = allNew.concat(items.map(item => ({ ...item, category: cat })));
    await new Promise(r => setTimeout(r, 2000));
  }

  // Add IDs
  let nextId = existing.length + 1;
  allNew.forEach(item => {
    item.id = `task1-theme-${nextId++}`;
  });

  contexts.task1 = [...existing, ...allNew];
  console.log(`✅ Task 1: ${existing.length} → ${contexts.task1.length} temas`);
}

async function expandTask2() {
  const existing = contexts.task2;
  const existingTitles = existing.map(e => e.title).join(', ');

  const categories = {
    community: 8,
    education: 8,
    work: 8,
    lifestyle: 8,
    technology: 6,
    environment: 6,
    health: 6,
    government: 6,
    culture: 6,
    transportation: 6,
  };

  let allNew = [];
  for (const [cat, count] of Object.entries(categories)) {
    console.log(`  Task 2 - ${cat} (${count})...`);
    const items = await callGPT(`Generate ${count} CELPIP Writing Task 2 survey response themes for category "${cat}".

EXISTING themes (DO NOT REPEAT): ${existingTitles}

Each theme needs:
- title: short name (e.g. "Remote Work Policy")
- prompt: the full survey scenario (who is conducting the survey, what's the question, what should the response address). 2-4 sentences.
- tips: array of 3-4 short writing tips for this specific theme
- category: "${cat}"
- difficulty: "intermediate"

Canadian context. Realistic topics relevant to life in Canada.

Return JSON array only: [{"title":"...","prompt":"...","tips":["..."],"category":"${cat}","difficulty":"intermediate"}]`);
    allNew = allNew.concat(items.map(item => ({ ...item, category: cat })));
    await new Promise(r => setTimeout(r, 2000));
  }

  let nextId = existing.length + 1;
  allNew.forEach(item => {
    item.id = `task2-theme-${nextId++}`;
  });

  contexts.task2 = [...existing, ...allNew];
  console.log(`✅ Task 2: ${existing.length} → ${contexts.task2.length} temas`);
}

async function main() {
  console.log('Expanding writing themes...\n');
  
  // Backup
  fs.writeFileSync(CONTEXTS_PATH + '.bak', JSON.stringify(contexts, null, 2));
  
  await expandTask1();
  console.log('');
  await expandTask2();
  
  fs.writeFileSync(CONTEXTS_PATH, JSON.stringify(contexts, null, 2));
  console.log('\n🎉 Done! Saved to contexts.json');
}

main().catch(console.error);
