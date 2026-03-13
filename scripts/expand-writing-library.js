const fs = require('fs');
const path = require('path');

const OPENAI_KEY = fs.readFileSync('/var/www/CELPIP/.env.local', 'utf8').match(/OPENAI_API_KEY=(.+)/)[1].trim();
const OUTPUT_DIR = '/var/www/CELPIP/public/data/writing-library';

const difficulties = ['beginner', 'intermediate', 'advanced'];
const diffDesc = {
  beginner: 'CLB 5-6: Simple everyday topics, clear instructions, short response expected (150-200 words). Topics like asking a friend for help, writing to a neighbour, responding to a simple workplace email.',
  intermediate: 'CLB 7-8: Moderately complex topics requiring some nuance. Professional or semi-formal contexts (200-250 words). Topics like workplace complaints, community issues, formal requests.',
  advanced: 'CLB 9-12: Complex topics requiring sophisticated argumentation, multiple perspectives, formal register (250-300 words). Topics like policy proposals, ethical dilemmas, persuasive arguments on controversial issues.'
};

const task1Prompt = (diff, existing) => `Generate 20 unique CELPIP Writing Task 1 (Email Writing) prompts at ${diff} level (${diffDesc[diff]}).

Task 1 format: You receive a situation and must write an email. Include:
- A clear situation/context
- Who you're writing to
- 3 bullet points of what to include in the email
- The tone (formal/semi-formal/informal)

IMPORTANT: These topics must be DIFFERENT from existing ones: ${existing.join(', ')}

Return a JSON array of 20 objects with this structure:
[{
  "id": "task1-XYZ",
  "task": 1,
  "difficulty": "${diff}",
  "situation": "...",
  "recipient": "...",
  "bulletPoints": ["point1", "point2", "point3"],
  "tone": "formal|semi-formal|informal",
  "topic": "short topic label"
}]

Use Canadian contexts (Canadian cities, Canadian workplace, Canadian services). Return ONLY valid JSON array.`;

const task2Prompt = (diff, existing) => `Generate 20 unique CELPIP Writing Task 2 (Survey Response) prompts at ${diff} level (${diffDesc[diff]}).

Task 2 format: You read a survey question and must write a response giving your opinion with reasons/examples. Include:
- A survey context (who's conducting it)
- The question/topic
- A brief description of what the response should address

IMPORTANT: These topics must be DIFFERENT from existing ones: ${existing.join(', ')}

Return a JSON array of 20 objects with this structure:
[{
  "id": "task2-XYZ",
  "task": 2,
  "difficulty": "${diff}",
  "surveyContext": "...",
  "question": "...",
  "description": "...",
  "topic": "short topic label"
}]

Use Canadian contexts. Return ONLY valid JSON array.`;

async function generate(prompt, label) {
  console.log(`  Generating ${label}...`);
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
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error(`No JSON array found for ${label}`);
  const items = JSON.parse(jsonMatch[0]);
  console.log(`  ✅ ${label}: ${items.length} items`);
  return items;
}

async function main() {
  for (const taskNum of [1, 2]) {
    const filePath = path.join(OUTPUT_DIR, `task${taskNum}.json`);
    const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const existingTopics = existing.map(e => e.topic || e.situation?.slice(0, 50) || '').filter(Boolean);
    
    console.log(`\nTask ${taskNum}: ${existing.length} existing`);
    
    let newItems = [];
    for (const diff of difficulties) {
      const prompt = taskNum === 1 
        ? task1Prompt(diff, existingTopics)
        : task2Prompt(diff, existingTopics);
      const items = await generate(prompt, `task${taskNum}-${diff}`);
      // Fix IDs to be unique
      items.forEach((item, i) => {
        const startIdx = existing.length + newItems.length + i + 1;
        item.id = `task${taskNum}-${String(startIdx).padStart(3, '0')}`;
        item.task = taskNum;
        item.difficulty = diff;
      });
      newItems = newItems.concat(items);
      await new Promise(r => setTimeout(r, 2000)); // rate limit
    }
    
    const merged = [...existing, ...newItems];
    fs.writeFileSync(filePath, JSON.stringify(merged, null, 2));
    console.log(`✅ Task ${taskNum}: ${existing.length} → ${merged.length} prompts`);
  }
  
  console.log('\n🎉 Done! Writing library expanded.');
}

main().catch(console.error);
