const fs = require('fs');
const OPENAI_KEY = fs.readFileSync('/var/www/CELPIP/.env.local', 'utf8').match(/OPENAI_API_KEY=(.+)/)[1].trim();

const partDescriptions = {
  1: { name: 'Problem Solving', questions: 5, clips: 3, desc: '3 audio clips of a conversation solving a problem. 5 MC questions.' },
  2: { name: 'Daily Life Conversation', questions: 5, clips: 1, desc: 'A conversation about daily life. 5 MC questions.' },
  3: { name: 'Listening for Information', questions: 6, clips: 1, desc: 'An informational monologue/announcement. 6 MC questions.' },
  4: { name: 'Listening to a News Item', questions: 5, clips: 1, desc: 'A news report. 5 MC questions.' },
  5: { name: 'Listening to a Discussion', questions: 8, clips: 1, desc: 'A longer discussion between 2+ people. 8 MC questions.' },
  6: { name: 'Listening for Viewpoints', questions: 6, clips: 1, desc: '2-3 people expressing different viewpoints. 6 MC questions.' },
};

const difficulties = ['beginner', 'intermediate', 'advanced'];

async function callGPT(prompt) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.95, max_tokens: 8000 }),
  });
  const data = await res.json();
  const match = data.choices[0].message.content.match(/\[[\s\S]*\]/);
  if (!match) throw new Error('No JSON found');
  return JSON.parse(match[0]);
}

async function main() {
  for (let part = 1; part <= 6; part++) {
    const filePath = `/var/www/CELPIP/public/data/listening-library/part${part}.json`;
    const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const info = partDescriptions[part];
    console.log(`\nPart ${part} (${info.name}): ${existing.length} existing`);

    let newItems = [];
    for (const diff of difficulties) {
      const count = 7;
      console.log(`  ${diff} (${count})...`);
      const passageField = info.clips === 3
        ? '"clips": [{"speaker":"Man/Woman","text":"clip 1 dialogue"},{"speaker":"Man/Woman","text":"clip 2 dialogue"},{"speaker":"Man/Woman","text":"clip 3 dialogue"}]'
        : '"passage": "full transcript with speaker labels (Man: ..., Woman: ...)"';

      const items = await callGPT(`Generate ${count} CELPIP Listening Part ${part} exercises (JSON only, no audio).

Part ${part}: ${info.name} — ${info.desc}
Difficulty: ${diff}
Canadian context. Each exercise must have:
- "title": short topic
- "difficulty": "${diff}"
- ${passageField}
- "questions": array of ${info.questions} objects with "question", "options" (4 choices), "correct" (0-3 index)

Speaker labels format: "Man:", "Woman:", "Man 2:", "Woman 2:", "Host:", "Narrator:"
Return ONLY a valid JSON array.`);

      items.forEach(item => { item.part = part; item.difficulty = diff; });
      newItems = newItems.concat(items);
      await new Promise(r => setTimeout(r, 3000));
    }

    let nextId = existing.length + 1;
    newItems.forEach(item => { item.id = `part${part}-${String(nextId++).padStart(3, '0')}`; });

    const merged = [...existing, ...newItems];
    fs.writeFileSync(filePath, JSON.stringify(merged, null, 2));
    console.log(`✅ Part ${part}: ${existing.length} → ${merged.length}`);
  }
  console.log('\n🎉 Done!');
}

main().catch(console.error);
