// Quiz Data — Active recall questions for each technique module
// Organized by section → module

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ModuleQuiz {
  moduleId: string;
  sectionId: string;
  title: string;
  questions: QuizQuestion[];
}

// ─── LISTENING ────────────────────────────────────────────────────────────────

const listeningQuizzes: ModuleQuiz[] = [
  {
    moduleId: 'task-1',
    sectionId: 'listening',
    title: 'Task 1: Listening to Problem Solving',
    questions: [
      {
        id: 'l1-1',
        question: 'In Task 1, do small details (exact dates, numbers) usually matter?',
        options: ['Yes, they are frequently tested', 'No, focus on main ideas and attitudes', 'Only numbers matter, not dates', 'It depends on the conversation'],
        correctIndex: 1,
        explanation: 'Tasks 1-3 focus on main ideas, attitudes, and opinions — not small details like exact dates or numbers.',
      },
      {
        id: 'l1-2',
        question: 'What should you identify FIRST when listening to Task 1?',
        options: ['The exact problem being discussed', 'The names and relationship of the speakers', 'The solution they agree on', 'How many questions there are'],
        correctIndex: 1,
        explanation: 'Always identify WHO is speaking and their relationship first — it helps you understand the context of the conversation.',
      },
      {
        id: 'l1-3',
        question: 'When should you select your answer in Task 1?',
        options: ['As soon as you hear any relevant information', 'Wait until the entire audio finishes', 'When you are 80%+ confident based on what you heard', 'Only after checking all options twice'],
        correctIndex: 2,
        explanation: 'Select when you are confident (80%+). Don\'t rush on the first mention, but don\'t wait until the end either — you might forget.',
      },
    ],
  },
  {
    moduleId: 'task-2',
    sectionId: 'listening',
    title: 'Task 2: Listening to a Daily Life Conversation',
    questions: [
      {
        id: 'l2-1',
        question: 'What is the key difference between Task 1 and Task 2?',
        options: ['Task 2 is longer', 'Task 2 has more speakers', 'Task 2 focuses on daily situations, not problems', 'Task 2 requires note-taking'],
        correctIndex: 2,
        explanation: 'Task 2 is about daily life conversations — understanding context, opinions, and suggestions in everyday scenarios.',
      },
    ],
  },
  {
    moduleId: 'task-4',
    sectionId: 'listening',
    title: 'Task 4: Listening to a News Item',
    questions: [
      {
        id: 'l4-1',
        question: 'Starting from Task 4, what changes about the importance of details?',
        options: ['Nothing changes', 'Details become MORE important', 'Details become LESS important', 'Only opinions matter'],
        correctIndex: 1,
        explanation: 'Tasks 4-6 shift to detail-focused listening. Exact numbers, dates, and specific facts start mattering much more.',
      },
      {
        id: 'l4-2',
        question: 'Why is note-taking especially useful for Tasks 4-6?',
        options: ['Because the audio is longer', 'Because details matter and you might forget them', 'Because you can\'t replay the audio', 'Because there are more questions'],
        correctIndex: 1,
        explanation: 'Since Tasks 4-6 test specific details, writing down key facts prevents you from forgetting important information.',
      },
    ],
  },
];

// ─── WRITING ──────────────────────────────────────────────────────────────────

const writingQuizzes: ModuleQuiz[] = [
  {
    moduleId: 'csf',
    sectionId: 'writing',
    title: 'CSF Framework',
    questions: [
      {
        id: 'w-csf-1',
        question: 'What does CSF stand for?',
        options: ['Content, Structure, Format', 'Context, Skill, Formula', 'Clarity, Style, Flow', 'Comprehension, Speed, Fluency'],
        correctIndex: 1,
        explanation: 'CSF = Context (what to know), Skill (what examiners want), Formula (step-by-step structure).',
      },
      {
        id: 'w-csf-2',
        question: 'Why do YouTube templates often fail on CELPIP?',
        options: ['They are outdated', 'Examiners recognize them and penalize repetitive structures', 'They are too short', 'They use wrong grammar'],
        correctIndex: 1,
        explanation: 'Templates fail because examiners see the same answers repeatedly. CSF gives you a structure you customize each time.',
      },
    ],
  },
  {
    moduleId: 'task-1',
    sectionId: 'writing',
    title: 'Task 1: Writing an Email',
    questions: [
      {
        id: 'w1-1',
        question: 'What is the correct form of "advice" in English?',
        options: ['"Here are some advices"', '"Here is some advice" (singular/uncountable)', '"Here are advices for you"', '"Here is an advice"'],
        correctIndex: 1,
        explanation: '"Advice" is uncountable in English — "Here is some advice." Using it correctly shows the examiner you have good grammar.',
      },
      {
        id: 'w1-2',
        question: 'In Task 1, should you use contractions?',
        options: ['Never — it\'s formal writing', 'Yes — it makes the email sound natural', 'Only in informal emails', 'Only for "don\'t" and "can\'t"'],
        correctIndex: 1,
        explanation: 'CELPIP emails are conversational. Contractions (here\'s, don\'t, I\'ve) make your writing sound natural and fluent.',
      },
    ],
  },
  {
    moduleId: 'task-2',
    sectionId: 'writing',
    title: 'Task 2: Survey Response',
    questions: [
      {
        id: 'w2-1',
        question: 'In Task 2, who should guide your argument choice?',
        options: ['Your personal opinion', 'The survey requester and their goals', 'The most popular opinion', 'It doesn\'t matter'],
        correctIndex: 1,
        explanation: 'Think about WHO is conducting the survey and WHY — this helps you choose arguments that are relevant and targeted.',
      },
      {
        id: 'w2-2',
        question: 'Should you present the "Other Side" argument in Task 2?',
        options: ['No, only present your side', 'Yes, but your argument must win in the end', 'Only if you have extra time', 'Yes, give both sides equal weight'],
        correctIndex: 1,
        explanation: 'Examiners LIKE seeing the other side. Use "On the other hand... However..." — but make sure YOUR argument wins.',
      },
    ],
  },
];

// ─── READING ──────────────────────────────────────────────────────────────────

const readingQuizzes: ModuleQuiz[] = [
  {
    moduleId: 'task-1',
    sectionId: 'reading',
    title: 'Task 1: Reading Correspondence',
    questions: [
      {
        id: 'r1-1',
        question: 'What is the recommended technique for Task 1 Part 1?',
        options: ['Read all questions first, then scan the text', 'Skim the entire text, then answer questions', 'Read paragraph by paragraph, checking questions after each', 'Start with the last paragraph'],
        correctIndex: 2,
        explanation: 'Paragraph-by-paragraph + Yes/No: Read a paragraph, check if you can answer the questions, then move to the next.',
      },
      {
        id: 'r1-2',
        question: 'What should you identify FIRST in the email?',
        options: ['The main topic', 'The sender and receiver names', 'The conclusion', 'The date'],
        correctIndex: 1,
        explanation: 'Always identify WHO is writing and TO WHOM first — the test often asks about names and relationships.',
      },
      {
        id: 'r1-3',
        question: 'What is the biggest time-wasting mistake in Task 1?',
        options: ['Reading too slowly', 'Skimming the entire text before answering', 'Checking questions too often', 'Not using a timer'],
        correctIndex: 1,
        explanation: 'Skimming everything first wastes time and you forget early paragraphs. The paragraph-by-paragraph technique is much more efficient.',
      },
    ],
  },
  {
    moduleId: 'task-2',
    sectionId: 'reading',
    title: 'Task 2: Reading to Apply a Diagram',
    questions: [
      {
        id: 'r2-1',
        question: 'What is the #1 skill for Task 2?',
        options: ['Speed reading', 'Pattern recognition', 'Memorizing the diagram', 'Reading the email first'],
        correctIndex: 1,
        explanation: 'Pattern recognition — identify what repeats in the diagram (Title → Info → Contact) and what differs.',
      },
      {
        id: 'r2-2',
        question: 'In Part 2 comprehension questions, what are the most common question types?',
        options: ['Vocabulary definitions', 'Relationship and feeling questions', 'Math calculations', 'Date and time questions'],
        correctIndex: 1,
        explanation: 'Part 2 usually asks about relationships ("How do they know each other?") and feelings ("How does the writer feel?").',
      },
    ],
  },
  {
    moduleId: 'task-3',
    sectionId: 'reading',
    title: 'Task 3: Reading for Information',
    questions: [
      {
        id: 'r3-1',
        question: 'What technique should you use for Task 3?',
        options: ['Speed reading + guessing', 'Yes/No/Red Flag for each question per paragraph', 'Read questions first, then find answers', 'Read the entire text twice'],
        correctIndex: 1,
        explanation: 'Yes/No/Red Flag: for each question, decide YES (80% sure), NO (not here), or RED FLAG (maybe — come back later).',
      },
      {
        id: 'r3-2',
        question: 'What does Option E mean in Task 3?',
        options: ['All of the above', 'Not Given / False', 'The answer is in multiple paragraphs', 'None of the above'],
        correctIndex: 1,
        explanation: 'E = Not Given. If after reading all paragraphs you can\'t find evidence for a statement, or it contradicts the text, select E.',
      },
      {
        id: 'r3-3',
        question: 'CELPIP Reading often uses synonyms. What does this mean for your technique?',
        options: ['The exact words from the text will appear in questions', 'Questions may rephrase text ideas with different words', 'You should memorize vocabulary lists', 'Synonyms don\'t affect reading'],
        correctIndex: 1,
        explanation: '"Brain functions" in the question might be "cognitive performance" in the text. Reading for MEANING, not exact words, is key.',
      },
    ],
  },
  {
    moduleId: 'task-4',
    sectionId: 'reading',
    title: 'Task 4: Reading for Viewpoints',
    questions: [
      {
        id: 'r4-1',
        question: 'What is the MOST important thing to track for each person in Task 4?',
        options: ['Their exact words', 'Whether they are POSITIVE or NEGATIVE', 'How many paragraphs they appear in', 'Their name\'s spelling'],
        correctIndex: 1,
        explanation: 'Identifying positive vs. negative stance for each person eliminates 2-3 options immediately for most questions.',
      },
      {
        id: 'r4-2',
        question: 'When should you answer the "Best Title" question?',
        options: ['First, before reading the text', 'After reading the first paragraph', 'LAST — after understanding the whole article', 'It doesn\'t matter when'],
        correctIndex: 2,
        explanation: 'The "Best Title" question requires understanding the overall theme — skip it and do it last using elimination.',
      },
    ],
  },
  {
    moduleId: 'truth-trio',
    sectionId: 'reading',
    title: 'The Truth Trio',
    questions: [
      {
        id: 'r-tt-1',
        question: 'What is the MOST common reason students make reading mistakes?',
        options: ['Not understanding the text vocabulary', 'Not understanding the question', 'Understanding both but misinterpreting', 'Running out of time'],
        correctIndex: 2,
        explanation: '99.9% of students fall into Reason 3 — they understand the text and the question but misinterpret. More practice with technique fixes this.',
      },
    ],
  },
];

// ─── SPEAKING ─────────────────────────────────────────────────────────────────

const speakingQuizzes: ModuleQuiz[] = [
  {
    moduleId: 'csf',
    sectionId: 'speaking',
    title: 'CSF Technique',
    questions: [
      {
        id: 's-csf-1',
        question: 'Why do 8 out of 10 native English speakers NOT get a 9 on CELPIP?',
        options: ['Their English isn\'t good enough', 'They don\'t know what the examiners are looking for', 'The test is unfair', 'They don\'t practice enough'],
        correctIndex: 1,
        explanation: 'Even perfect English isn\'t enough — you need to know what examiners want (Skill) and follow the right structure (Formula).',
      },
      {
        id: 's-csf-2',
        question: 'What is the difference between a "template" and a "formula"?',
        options: ['They are the same thing', 'A formula is customized each time; a template repeats the same words', 'A template is better for high scores', 'A formula is only for writing'],
        correctIndex: 1,
        explanation: 'Templates fail because examiners recognize them. A formula gives you the structure, but you fill it with fresh, realistic content.',
      },
    ],
  },
  {
    moduleId: 'task-1',
    sectionId: 'speaking',
    title: 'Task 1: Giving Advice',
    questions: [
      {
        id: 's1-1',
        question: 'How many advice expressions should you memorize?',
        options: ['All of them', 'Just 1', 'Pick 3 and always use those', 'At least 6'],
        correctIndex: 2,
        explanation: 'Pick 3 (e.g., "Why don\'t you", "I suggest", "I recommend") and always use those. Don\'t try to memorize all of them.',
      },
      {
        id: 's1-2',
        question: 'What technique takes your score from 8 to 10?',
        options: ['Using bigger vocabulary', 'The personal connection ("I know you...")', 'Speaking faster', 'Giving 5 pieces of advice'],
        correctIndex: 1,
        explanation: '"I know you like to have breakfast watching TV, so just switch to the news" — this CONNECTION makes the answer realistic and personal.',
      },
      {
        id: 's1-3',
        question: 'The problem and the advice in Task 1 are...',
        options: ['The same thing', 'Different things — the problem is the situation, the advice is what you recommend', 'Not important to distinguish', 'Always about work situations'],
        correctIndex: 1,
        explanation: 'Example: Problem = "always late from work". Advice = "which car to buy". They are DIFFERENT — identify both clearly.',
      },
    ],
  },
  {
    moduleId: 'task-2',
    sectionId: 'speaking',
    title: 'Task 2: Personal Experience',
    questions: [
      {
        id: 's2-1',
        question: 'How should every good story start?',
        options: ['With the conclusion', 'With the setting: WHERE and WHEN', 'With the feelings', 'With the characters'],
        correctIndex: 1,
        explanation: 'Every story starts with WHERE and WHEN — like "Once upon a time in a far away land." Set the scene first.',
      },
      {
        id: 's2-2',
        question: 'What is the "shoulder check" technique?',
        options: ['Looking over your shoulder during the test', 'Repeating the key word from the last question so the examiner knows you\'re answering it', 'Checking your notes before speaking', 'A posture technique for confidence'],
        correctIndex: 1,
        explanation: 'Like exaggerating a shoulder check during a driving test — repeat the key word ("the reason I wanted to participate...") so the examiner SEES you\'re answering.',
      },
      {
        id: 's2-3',
        question: 'Should you repeat the questions while answering?',
        options: ['Yes, always repeat the question first', 'No — answer naturally INSIDE the story', 'Only the last question', 'Only if you have extra time'],
        correctIndex: 1,
        explanation: 'Never say "What did I do? I went to..." — tell the story naturally and the answers flow inside it.',
      },
    ],
  },
  {
    moduleId: 'task-3',
    sectionId: 'speaking',
    title: 'Task 3: Describing a Scene',
    questions: [
      {
        id: 's3-1',
        question: 'What is the "Macro to Micro" formula?',
        options: ['Describe small details first, then the big picture', 'Location → General → Center → Outward → Closing', 'Start with colors, end with shapes', 'Describe people first, objects second'],
        correctIndex: 1,
        explanation: 'Start with the location (macro), give a general description, focus on the center, move outward, then close with a general feeling.',
      },
      {
        id: 's3-2',
        question: 'What grammar is ESSENTIAL for Task 3?',
        options: ['Past tense', 'Future tense', 'Present progressive (ING)', 'Passive voice'],
        correctIndex: 2,
        explanation: 'You must describe what is HAPPENING — "She IS EATING", "They ARE RUNNING". Without ING, you won\'t get a good score.',
      },
      {
        id: 's3-3',
        question: 'If you don\'t know the word for something in the picture, what should you do?',
        options: ['Skip it completely', 'Say "I don\'t know the word"', 'Describe it: "a thing that holds paper towels"', 'Point at the screen'],
        correctIndex: 2,
        explanation: 'Describing the unknown item is BETTER than silence. "A thing that holds paper towels" shows communication skill.',
      },
    ],
  },
  {
    moduleId: 'task-7',
    sectionId: 'speaking',
    title: 'Task 7: Expressing Opinions',
    questions: [
      {
        id: 's7-1',
        question: 'What is the "Backstreet Boys" technique?',
        options: ['Singing during the test', 'Point, Reason, Example × 3 arguments', 'Using pop culture references', 'Speaking with a rhythm'],
        correctIndex: 1,
        explanation: 'P.R.E. × 3: give a Point, explain the Reason, provide an Example — repeat for 3 arguments. That\'s the winning formula.',
      },
      {
        id: 's7-2',
        question: 'What MUST you do in the closing of Task 7?',
        options: ['Add a new argument', 'Paraphrase your opening opinion with DIFFERENT words', 'Repeat your opening exactly', 'Ask the examiner a question'],
        correctIndex: 1,
        explanation: 'You MUST change the words: "students should participate" → "classes should be mandatory". Same idea, different words = vocabulary points.',
      },
      {
        id: 's7-3',
        question: 'What is "the magic number" for CELPIP?',
        options: ['2', '3', '4', '5'],
        correctIndex: 1,
        explanation: '3 is the magic number — 3 pieces of advice, 3 arguments, 3 comparisons. Always aim for 3.',
      },
    ],
  },
  {
    moduleId: 'task-8',
    sectionId: 'speaking',
    title: 'Task 8: Unusual Situation',
    questions: [
      {
        id: 's8-1',
        question: 'What is the most common mistake in Task 8?',
        options: ['Speaking too fast', 'Forgetting the call to action at the end', 'Describing too many things', 'Using past tense'],
        correctIndex: 1,
        explanation: 'Many students forget the call to action: "So what do you think? Would you want this?" — it\'s CRITICAL for your score.',
      },
      {
        id: 's8-2',
        question: 'Why does CELPIP use weird/unusual pictures in Task 8?',
        options: ['To confuse you', 'To test if you can describe things even when you don\'t know the exact words', 'Because they are funnier', 'To test your creativity'],
        correctIndex: 1,
        explanation: 'CELPIP KNOWS you won\'t know all vocabulary. The test is: can you DESCRIBE things you don\'t have exact words for?',
      },
    ],
  },
  {
    moduleId: 'creativity',
    sectionId: 'speaking',
    title: 'How to Be More Creative',
    questions: [
      {
        id: 's-cr-1',
        question: 'If you say "drink coffee to sleep better" on the test, will you lose points?',
        options: ['Yes, it\'s wrong advice', 'No — they judge HOW you say it, not WHAT you say', 'Only if you can\'t explain it', 'Yes, it\'s not realistic'],
        correctIndex: 1,
        explanation: 'The examiners don\'t judge the content of your advice — only how well you express and explain it. You can say ANYTHING.',
      },
      {
        id: 's-cr-2',
        question: 'What is the Golden Rule for creativity?',
        options: ['Always tell the truth', 'Break everything into 3 small ideas', 'Use the most advanced vocabulary possible', 'Practice 10 times per topic'],
        correctIndex: 1,
        explanation: '"Why get a Tesla?" → 1) Save money on gas, 2) They\'re quiet, 3) They\'re stylish. 3 ideas for every argument.',
      },
    ],
  },
];

// ─── Export ───────────────────────────────────────────────────────────────────

export const allQuizzes: ModuleQuiz[] = [
  ...listeningQuizzes,
  ...writingQuizzes,
  ...readingQuizzes,
  ...speakingQuizzes,
];

export function getQuizForModule(sectionId: string, moduleId: string): ModuleQuiz | undefined {
  return allQuizzes.find((q) => q.sectionId === sectionId && q.moduleId === moduleId);
}

export function getQuizzesForSection(sectionId: string): ModuleQuiz[] {
  return allQuizzes.filter((q) => q.sectionId === sectionId);
}
