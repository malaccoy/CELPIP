const fs = require('fs');
const OPENAI_KEY = fs.readFileSync('/var/www/CELPIP/.env.local', 'utf8').match(/OPENAI_API_KEY=(.+)/)[1].trim();

const partDescriptions = {
  1: { name: 'Reading Correspondence', questions: 6, desc: 'Read an email/letter exchange and answer 6 multiple-choice questions. Include sender, recipient, context.' },
  2: { name: 'Reading to Apply a Diagram', questions: 8, desc: 'Read a passage with a diagram/chart/table and answer 8 questions. Topics: schedules, comparisons, policies.' },
  3: { name: 'Reading for Information', questions: 9, desc: 'Read a longer informational text (article, report) and answer 9 questions. Requires inference and detail.' },
  4: { name: 'Reading for Viewpoints', questions: 7, desc: 'Read 2-3 short opinion texts on the same topic and answer 7 questions about each writer\'s viewpoint.' },
};

const difficulties = ['beginner', 'intermediate', 'advanced'];
const diffDesc = {
  beginner: 'CLB 5-6: Simple vocabulary, clear structure, literal comprehension',
  intermediate: 'CLB 7-8: Moderate complexity, some inference required',
  advanced: 'CLB 9-12: Complex vocabulary, subtle inference, distractors differ by 1 detail'
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
  for (let part = 1; part <= 4; part++) {
    const filePath = `/var/www/CELPIP/public/data/reading-library/part${part}.json`;
    const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const info = partDescriptions[part];
    
    console.log(`\nPart ${part} (${info.name}): ${existing.length} existing`);
    
    let newItems = [];
    for (const diff of difficulties) {
      const count = diff === 'intermediate' ? 12 : 8;
      console.log(`  ${diff} (${count})...`);
      
      const items = await callGPT(`Generate ${count} CELPIP Reading Part ${part} exercises.

Part ${part}: ${info.name} — ${info.desc}
Each exercise has ${info.questions} multiple-choice questions with 4 options (A,B,C,D).
Difficulty: ${diff} (${diffDesc[diff]})

Canadian context required. Each exercise must have:
- "passage": the reading text (200-400 words)
- "title": short topic label
- "difficulty": "${diff}"
- "questions": array of ${info.questions} objects, each with:
  - "question": the question text
  - "options": ["A) ...", "B) ...", "C) ...", "D) ..."]
  - "correct": 0-3 (index of correct answer)

Return ONLY a valid JSON array of ${count} exercise objects.`);

      items.forEach(item => {
        item.part = part;
        item.difficulty = diff;
      });
      newItems = newItems.concat(items);
      await new Promise(r => setTimeout(r, 3000));
    }
    
    let nextId = existing.length + 1;
    newItems.forEach(item => {
      item.id = `part${part}-${String(nextId++).padStart(3, '0')}`;
    });
    
    const merged = [...existing, ...newItems];
    fs.writeFileSync(filePath, JSON.stringify(merged, null, 2));
    console.log(`✅ Part ${part}: ${existing.length} → ${merged.length}`);
  }
  console.log('\n🎉 Done!');
}

main().catch(console.error);
