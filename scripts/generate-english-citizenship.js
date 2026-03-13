#!/usr/bin/env node
/**
 * Generate Level 1 English for Citizenship lessons
 * Focus: CELPIP test situations + Canadian Citizenship knowledge
 */
const fs = require('fs');

const OPENAI_KEY = fs.readFileSync('/var/www/CELPIP/.env.local', 'utf-8').match(/OPENAI_API_KEY=(.+)/)?.[1];

const LESSONS = [
  // CELPIP-focused situations (Parts 1-6 listening, reading, speaking, writing scenarios)
  { n: 1, title: "Welcome to Canada", situation: "Arrival at immigration — asking and answering personal questions (CELPIP Speaking Task 1)", grammar: 'Verb "to be", personal info questions', phrases: ["I'm from...", "My address is...", "I arrived on..."] },
  { n: 2, title: "Finding a Home", situation: "Calling about a rental ad — problem solving on the phone (CELPIP Listening Part 1)", grammar: 'Questions with "how much/when/where"', phrases: ["Is the apartment still available?", "How much is the rent?", "When can I move in?"] },
  { n: 3, title: "At the Doctor's Office", situation: "Describing symptoms at a walk-in clinic (CELPIP Speaking Task 2 — personal choices)", grammar: "Body parts, present simple for symptoms", phrases: ["I have a headache", "It started yesterday", "I'm allergic to..."] },
  { n: 4, title: "Opening a Bank Account", situation: "Understanding banking options — reading a comparison chart (CELPIP Reading Part 2)", grammar: "Comparatives: more/less, -er than", phrases: ["Which account has lower fees?", "I'd like to open a chequing account"] },
  { n: 5, title: "Your First Job Interview", situation: "Answering typical interview questions (CELPIP Speaking Task 5 — familiar topics)", grammar: "Past simple: worked, studied, lived", phrases: ["I worked as a...", "I have experience in...", "I'm looking for..."] },
  { n: 6, title: "Writing to Your Landlord", situation: "Email about a problem in your apartment (CELPIP Writing Task 1)", grammar: "Formal email structure: greeting, body, closing", phrases: ["Dear Mr./Ms.", "I am writing to inform you...", "Could you please..."] },
  { n: 7, title: "At the Grocery Store", situation: "Understanding prices and asking for help — daily life conversation (CELPIP Listening Part 2)", grammar: "Countable/uncountable, how much/how many", phrases: ["Where can I find...?", "Is this on sale?", "How much does this cost?"] },
  { n: 8, title: "Understanding the News", situation: "Listening to a Canadian news report (CELPIP Listening Part 4 — news item)", grammar: "Past simple for events, reported speech intro", phrases: ["According to...", "The report says...", "It happened on..."] },
  { n: 9, title: "Giving Directions", situation: "Helping someone find a place — information gathering (CELPIP Listening Part 3)", grammar: "Prepositions of place, imperatives", phrases: ["Turn left at...", "It's across from...", "Go straight for two blocks"] },
  { n: 10, title: "Calling About a Service", situation: "Phone call to cancel/change a service (CELPIP Listening Part 1 — problem solving)", grammar: "Would like to, need to, have to", phrases: ["I'd like to cancel...", "Can I change my plan?", "What are my options?"] },
  { n: 11, title: "Discussing a Problem", situation: "Two people disagree about a workplace issue (CELPIP Listening Part 5 — discussion)", grammar: "Agreeing/disagreeing: I think, I disagree, On the other hand", phrases: ["I think we should...", "That's a good point, but...", "I disagree because..."] },
  { n: 12, title: "Survey Response", situation: "Writing a response to a survey about your community (CELPIP Writing Task 2)", grammar: "Expressing opinions: I believe, In my opinion", phrases: ["In my opinion...", "I strongly believe that...", "One advantage is..."] },
  { n: 13, title: "Reading Viewpoints", situation: "Two people have different opinions about working from home (CELPIP Reading Part 4 — viewpoints)", grammar: "Contrast: while, whereas, however, on the other hand", phrases: ["While some people think...", "On the other hand...", "However..."] },
  { n: 14, title: "Describing a Scene", situation: "Looking at a picture and describing what you see (CELPIP Speaking Task 3)", grammar: "Present continuous, there is/are + -ing", phrases: ["In the picture I can see...", "A man is walking...", "There are people sitting..."] },
  { n: 15, title: "Making Predictions", situation: "What will happen next in a situation (CELPIP Speaking Task 4)", grammar: "Future: will, going to, might, probably", phrases: ["I think he will...", "She's probably going to...", "It might happen because..."] },
  // Citizenship-focused
  { n: 16, title: "What is Canada?", situation: "Understanding Canada's geography and government — Citizenship Test prep", grammar: "Basic facts: is, has, consists of", phrases: ["Canada has 10 provinces", "The capital is Ottawa", "Canada is a constitutional monarchy"] },
  { n: 17, title: "Rights & Responsibilities", situation: "Understanding the Canadian Charter of Rights — Citizenship Test prep", grammar: "Modal verbs: must, can, should", phrases: ["Citizens must obey the law", "Everyone has the right to...", "You should vote in elections"] },
  { n: 18, title: "Canadian History", situation: "Key events in Canadian history — Citizenship Test prep", grammar: "Past simple for historical events, dates", phrases: ["Confederation was in 1867", "Canada became independent...", "The railway was built in..."] },
  { n: 19, title: "Voting & Government", situation: "Understanding how elections work — Citizenship Test prep", grammar: "Present simple for processes, passive voice intro", phrases: ["The Prime Minister is elected...", "Members of Parliament represent...", "Elections are held every..."] },
  { n: 20, title: "Symbols of Canada", situation: "Learning national symbols — Citizenship Test prep", grammar: "Defining with 'is/are called', 'represents'", phrases: ["The maple leaf represents...", "The beaver is a symbol of...", "O Canada is the national anthem"] },
  // Mixed CELPIP + Citizenship
  { n: 21, title: "Persuading Someone", situation: "Convincing a friend to try something (CELPIP Speaking Task 7 — expressing opinions)", grammar: "Persuasive language: should, why don't you, it would be great", phrases: ["You should try...", "I highly recommend...", "The reason I suggest this is..."] },
  { n: 22, title: "Dealing with a Problem", situation: "Complaining about a service and negotiating a solution (CELPIP Speaking Task 8)", grammar: "Complaints and requests: I'm unhappy with, I'd appreciate if", phrases: ["I'm calling about a problem...", "I'd like a refund...", "What can you do about this?"] },
  { n: 23, title: "Reading Correspondence", situation: "Understanding a letter from the government (CELPIP Reading Part 1)", grammar: "Formal language comprehension, must/shall/hereby", phrases: ["You are required to...", "Please be advised that...", "Sincerely,"] },
  { n: 24, title: "Community Participation", situation: "Volunteering and community events — connecting citizenship values to daily life", grammar: "Present perfect: have volunteered, have lived", phrases: ["I have lived in Canada for...", "I have volunteered at...", "I've been a resident since..."] },
  { n: 25, title: "🏆 CHECKPOINT", situation: "Review: CELPIP strategies + Citizenship knowledge", grammar: "Mixed", phrases: [] },
];

async function generateLesson(lesson) {
  if (lesson.n === 25) {
    return {
      number: 25, title: lesson.title, situation: lesson.situation,
      grammarFocus: 'Mixed review', keyPhrases: [],
      dialogue: [], vocabulary: [],
      exercises: [{ type: 'checkpoint', order: 1, question: { text: 'Level 1 Checkpoint — CELPIP + Citizenship review quiz coming soon!' }, correct: {}, points: 50 }],
    };
  }

  const isCitizenship = lesson.n >= 16 && lesson.n <= 20;
  
  const prompt = `You are creating an English lesson for immigrants preparing for the CELPIP test and Canadian Citizenship exam. Level 1 (CEFR A1-A2).

LESSON ${lesson.n}: "${lesson.title}"
SITUATION: ${lesson.situation}
GRAMMAR FOCUS: ${lesson.grammar}
KEY PHRASES: ${lesson.phrases.join(', ')}

${isCitizenship ? `This is a CITIZENSHIP TEST lesson. The dialogue should teach real facts about Canada that appear on the citizenship test. All facts must be ACCURATE. Include questions that test both English comprehension AND Canadian knowledge.` : `This is a CELPIP-focused lesson. The dialogue simulates a real CELPIP test scenario. Exercises should practice the specific skills tested in that CELPIP section.`}

Generate a complete lesson in JSON format:

{
  "dialogue": [
    { "speaker": "Name/Role", "text": "English sentence", "translation": "Portuguese (Brazilian) translation" }
  ],
  "vocabulary": [
    { "word": "English word/phrase", "translation": "Portuguese (BR)", "example": "Example sentence", "category": "noun/verb/adjective/phrase" }
  ],
  "exercises": [
    {
      "type": "translation",
      "order": 1,
      "question": { "text": "Choose the correct translation", "word": "English word" },
      "options": ["correct PT", "wrong 1", "wrong 2", "wrong 3"],
      "correct": 0,
      "points": 10
    },
    {
      "type": "fill_gap",
      "order": 2,
      "question": { "text": "I ___ like to open an account.", "context": "At the bank" },
      "options": ["would", "am", "do", "have"],
      "correct": 0,
      "points": 10
    },
    {
      "type": "choose_response",
      "order": 3,
      "question": { "text": "The interviewer asks: 'Why should we hire you?'", "context": "Job interview" },
      "options": ["I have experience in this area and I'm a hard worker", "I am tired of my old job", "Yes, you should", "Because money"],
      "correct": 0,
      "points": 10
    },
    {
      "type": "word_order",
      "order": 4,
      "question": { "text": "Put the words in correct order", "words": ["I", "would", "like", "to", "apply"] },
      "correct": ["I", "would", "like", "to", "apply"],
      "points": 15
    },
    {
      "type": "listen_comprehension",
      "order": 5,
      "question": { "text": "What is the main topic of the conversation?", "dialogueIndex": 0 },
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "points": 10
    }${isCitizenship ? `,
    {
      "type": "choose_response",
      "order": 6,
      "question": { "text": "Canadian citizenship knowledge question", "context": "Citizenship Test" },
      "options": ["Correct fact", "Wrong 1", "Wrong 2", "Wrong 3"],
      "correct": 0,
      "points": 15
    },
    {
      "type": "choose_response",
      "order": 7,
      "question": { "text": "Another citizenship fact question", "context": "Citizenship Test" },
      "options": ["Correct", "Wrong 1", "Wrong 2", "Wrong 3"],
      "correct": 0,
      "points": 15
    }` : ''}
  ]
}

REQUIREMENTS:
- Dialogue: 5-7 lines, natural Canadian English
- ${isCitizenship ? 'Include REAL, ACCURATE facts about Canada (dates, names, places from Discover Canada guide)' : 'Simulate a realistic CELPIP test scenario'}
- Vocabulary: 6-8 words/phrases relevant to the situation
- Exercises: ${isCitizenship ? '7' : '5-6'} exercises mixing types
- All Portuguese translations must be Brazilian Portuguese
- word_order: provide shuffled words array, correct is the ordered array
- Distractors should be plausible but clearly wrong for A1-A2 level
- For CELPIP lessons: exercises should practice the SPECIFIC skill being tested (listening comprehension, reading interpretation, speaking structure, writing format)

Respond with valid JSON only.`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    }),
  });

  const data = await res.json();
  if (!data.choices?.[0]?.message?.content) {
    console.error(`Failed lesson ${lesson.n}:`, data.error);
    return null;
  }

  try {
    const content = JSON.parse(data.choices[0].message.content);
    return {
      number: lesson.n,
      title: lesson.title,
      situation: lesson.situation,
      grammarFocus: lesson.grammar,
      keyPhrases: lesson.phrases,
      dialogue: content.dialogue || [],
      vocabulary: content.vocabulary || [],
      exercises: (content.exercises || []).map((e, i) => ({ ...e, order: i + 1 })),
    };
  } catch (e) {
    console.error(`Parse error lesson ${lesson.n}:`, e.message);
    return null;
  }
}

async function main() {
  const outDir = '/var/www/CELPIP/public/data/english';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const outPath = `${outDir}/level1.json`;
  // Start fresh for the new content
  let lessons = [];

  for (const lesson of LESSONS) {
    console.log(`Generating lesson ${lesson.n}: "${lesson.title}"...`);
    let retries = 0, result = null;
    while (!result && retries < 3) {
      result = await generateLesson(lesson);
      if (!result) retries++;
    }
    
    if (result) {
      lessons.push(result);
      lessons.sort((a, b) => a.number - b.number);
      fs.writeFileSync(outPath, JSON.stringify(lessons, null, 2));
      console.log(`  ✅ Lesson ${lesson.n} done (${result.exercises.length} exercises, ${result.vocabulary.length} vocab)`);
    } else {
      console.log(`  ❌ Lesson ${lesson.n} FAILED after 3 retries`);
    }
    
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n🎉 Level 1 complete! ${lessons.length} lessons generated`);
}

main().catch(console.error);
