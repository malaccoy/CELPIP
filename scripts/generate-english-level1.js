#!/usr/bin/env node
/**
 * Generate Level 1 English lessons content
 * Outputs to /var/www/CELPIP/public/data/english/level1.json
 */
const fs = require('fs');

const OPENAI_KEY = fs.readFileSync('/var/www/CELPIP/.env.local', 'utf-8').match(/OPENAI_API_KEY=(.+)/)?.[1];

const LESSONS = [
  { n: 1, title: "Hello, Canada!", situation: "Meeting your landlord", grammar: 'Verb "to be", greetings', phrases: ["Hi, I'm...", "Nice to meet you"] },
  { n: 2, title: "What's your name?", situation: "Immigration office", grammar: 'Questions with "be"', phrases: ["My name is...", "I'm from..."] },
  { n: 3, title: "Numbers matter", situation: "Phone number exchange", grammar: "Numbers 0-100", phrases: ["My number is..."] },
  { n: 4, title: "Morning coffee", situation: "Ordering at Tim Hortons", grammar: '"I\'d like...", "Can I have..."', phrases: ["A medium double-double, please"] },
  { n: 5, title: "Getting around", situation: "Taking the bus/SkyTrain", grammar: "Prepositions of place", phrases: ["Where is the...?", "Turn left"] },
  { n: 6, title: "At the grocery store", situation: "Shopping at No Frills", grammar: "Countable/uncountable", phrases: ["How much...?", "How many...?"] },
  { n: 7, title: "My new home", situation: "Describing your apartment", grammar: "Adjectives, there is/are", phrases: ["There's a kitchen", "It's small but nice"] },
  { n: 8, title: "What time is it?", situation: "Daily schedule", grammar: "Telling time", phrases: ["It's half past...", "At 9 o'clock"] },
  { n: 9, title: "My daily routine", situation: "Describing your day", grammar: "Present simple", phrases: ["I wake up at 7", "I take the bus"] },
  { n: 10, title: "Weekend plans", situation: "Talking to a neighbor", grammar: "Days of the week", phrases: ["On Saturday I...", "Every Monday"] },
  { n: 11, title: "Feeling sick", situation: "At the walk-in clinic", grammar: "Body parts, symptoms", phrases: ["I have a headache", "My back hurts"] },
  { n: 12, title: "The weather", situation: "Small talk with coworkers", grammar: "It's + adjective", phrases: ["It's freezing!", "It's raining"] },
  { n: 13, title: "At the bank", situation: "Opening an account", grammar: '"I want to...", "I need to..."', phrases: ["I'd like to open an account"] },
  { n: 14, title: "Phone call", situation: "Calling your phone company", grammar: "Phone English", phrases: ["Can I speak to...?", "Hold on"] },
  { n: 15, title: "Emergency!", situation: "Calling 911", grammar: "Imperatives", phrases: ["Help!", "Send an ambulance"] },
  { n: 16, title: "Job hunting", situation: "Reading job postings", grammar: "Can/can't", phrases: ["I can cook", "I have experience"] },
  { n: 17, title: "The interview", situation: "Basic job interview", grammar: "Past simple (intro)", phrases: ["I worked at...", "I was a..."] },
  { n: 18, title: "My family", situation: "Talking about family", grammar: "Possessives", phrases: ["My wife's name is...", "He's my son"] },
  { n: 19, title: "At the restaurant", situation: "Ordering food", grammar: '"Would like"', phrases: ["I'd like the chicken", "The bill, please"] },
  { n: 20, title: "Making friends", situation: "Casual conversation", grammar: "Like + gerund", phrases: ["I like playing soccer", "Do you like...?"] },
  { n: 21, title: "Shopping for clothes", situation: "At the mall", grammar: "Comparatives (intro)", phrases: ["This one is cheaper", "Too big"] },
  { n: 22, title: "Asking for help", situation: "Lost in the city", grammar: "Can/Could you...?", phrases: ["Excuse me, could you help me?"] },
  { n: 23, title: "At the pharmacy", situation: "Buying medicine", grammar: "Some/any", phrases: ["Do you have any...?", "I need some..."] },
  { n: 24, title: "Saying goodbye", situation: "Moving to a new place", grammar: "Future (intro)", phrases: ["I'm going to miss you"] },
  { n: 25, title: "🏆 CHECKPOINT", situation: "Review all Level 1", grammar: "Mixed", phrases: [] },
];

async function generateLesson(lesson) {
  if (lesson.n === 25) {
    // Checkpoint — generate review exercises only
    return {
      ...lesson,
      dialogue: [],
      vocabulary: [],
      exercises: [
        { type: 'checkpoint', order: 1, question: { text: 'This is the Level 1 checkpoint — review quiz coming soon!' }, correct: {}, points: 50 }
      ]
    };
  }

  const prompt = `You are creating an English learning lesson for Brazilian immigrants in Canada. This is Level 1 (Survival English, CEFR A1).

LESSON ${lesson.n}: "${lesson.title}"
SITUATION: ${lesson.situation}
GRAMMAR FOCUS: ${lesson.grammar}
KEY PHRASES: ${lesson.phrases.join(', ')}

Generate a complete lesson in JSON format:

{
  "dialogue": [
    { "speaker": "Name/Role", "text": "English sentence", "translation": "Portuguese translation" }
  ],
  "vocabulary": [
    { "word": "English word", "translation": "Portuguese", "example": "Example sentence using the word", "category": "noun/verb/adjective/phrase" }
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
      "question": { "text": "I ___ like a coffee, please.", "context": "At Tim Hortons" },
      "options": ["would", "am", "do", "have"],
      "correct": 0,
      "points": 10
    },
    {
      "type": "choose_response",
      "order": 3,
      "question": { "text": "The cashier asks: 'What can I get you?'", "context": "At a café" },
      "options": ["I would like a coffee, please", "I am coffee", "Coffee is good weather", "Yes, I can"],
      "correct": 0,
      "points": 10
    },
    {
      "type": "word_order",
      "order": 4,
      "question": { "text": "Put the words in order", "words": ["I", "would", "like", "a", "coffee"] },
      "correct": ["I", "would", "like", "a", "coffee"],
      "points": 15
    },
    {
      "type": "listen_comprehension",
      "order": 5,
      "question": { "text": "What did the person order?", "dialogueIndex": 0 },
      "options": ["Coffee", "Tea", "Juice", "Water"],
      "correct": 0,
      "points": 10
    }
  ]
}

REQUIREMENTS:
- Dialogue: 4-6 lines, natural Canadian English, set in a real Canadian place
- Vocabulary: 6-8 words/phrases from the dialogue, with Portuguese (BR) translations
- Exercises: 5-7 exercises mixing ALL types (translation, fill_gap, choose_response, word_order, listen_comprehension)
- word_order: provide shuffled words array, correct is the ordered array
- All exercises relate to THIS lesson's situation and grammar
- Translations must be Brazilian Portuguese (not European)
- Use Canadian context (Tim Hortons, SkyTrain, etc.)
- Keep it A1 level — simple sentences, basic vocabulary
- Make distractors plausible but clearly wrong for a beginner

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
  let lessons = [];
  if (fs.existsSync(outPath)) {
    lessons = JSON.parse(fs.readFileSync(outPath, 'utf-8'));
    console.log(`Resuming: ${lessons.length} lessons already generated`);
  }

  const done = new Set(lessons.map(l => l.number));

  for (const lesson of LESSONS) {
    if (done.has(lesson.n)) { console.log(`Lesson ${lesson.n}: already done, skip`); continue; }
    
    console.log(`Generating lesson ${lesson.n}: "${lesson.title}"...`);
    let retries = 0;
    let result = null;
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
  console.log(`Saved to: ${outPath}`);
}

main().catch(console.error);
