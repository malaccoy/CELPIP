// Speaking Technique Guide — CELPIP Coach
// Structured from teaching material (Tasks 1-8 + CSF framework)

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CSFFramework {
  title: string;
  description: string;
  components: CSFComponent[];
  whyItWorks: string;
}

export interface CSFComponent {
  letter: string;
  name: string;
  question: string;
  description: string;
  icon: string;
}

export interface SpeakingTask {
  id: string;
  taskNumber: number;
  title: string;
  prepTime: string;
  speakTime: string;
  description: string;
  context: TaskContext;
  skill: TaskSkill;
  formula: FormulaStep[];
  keyInsights: string[];
  commonMistakes: string[];
  proTips: string[];
}

export interface TaskContext {
  whatToRead: string[];
  whatToSkip: string[];
  identifyItems: string[];
}

export interface TaskSkill {
  mainSkill: string;
  grammar: string;
  vocabularyFocus: string[];
  examinersWant: string;
}

export interface FormulaStep {
  order: number;
  label: string;
  description: string;
  example?: string;
}

export interface CreativityGuide {
  title: string;
  principles: CreativityPrinciple[];
}

export interface CreativityPrinciple {
  number: number;
  title: string;
  description: string;
  keyTakeaway: string;
}

export interface SpeakingOverview {
  totalTasks: number;
  totalTime: string;
  prepTimeRange: string;
  speakTimeRange: string;
  examOrder: string;
  scoreBands: { score: string; descriptor: string }[];
  goldenRules: string[];
}

export interface AdviceExpression {
  expression: string;
  example: string;
}

export interface LocationWord {
  word: string;
  usage: string;
}

export interface VocabularyTip {
  title: string;
  description: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const speakingOverview: SpeakingOverview = {
  totalTasks: 8,
  totalTime: '~20 minutes',
  prepTimeRange: '30-60 seconds',
  speakTimeRange: '60-90 seconds',
  examOrder: 'Listening → Reading → Writing → Speaking',
  scoreBands: [
    { score: '5-6', descriptor: 'Limited — basic ideas with frequent errors, gaps in speech' },
    { score: '7', descriptor: 'Adequate — covers the topic, some errors, lacks detail' },
    { score: '8', descriptor: 'Good — clear ideas, minor errors, reasonable vocabulary' },
    { score: '9', descriptor: 'Very Good — well-organized, varied vocabulary, few errors' },
    { score: '10', descriptor: 'Excellent — coherent, precise vocabulary, natural flow' },
    { score: '11-12', descriptor: 'Expert — native-like fluency, sophisticated language, perfect structure' },
  ],
  goldenRules: [
    'CELPIP is the most structured English test — every task is always the same format',
    'You have 30-60 seconds to prepare — more than any other English test',
    'The examiners judge HOW you say it, not WHAT you say — your argument can be anything',
    'Use contractions in speaking (here\'s, I\'ve, don\'t) — they make you sound natural',
    'Speak at a normal, conversational volume — not too loud, not too soft',
    'If you make a mistake, just correct it naturally and keep going — never apologize',
    'Practice silence instead of "uh" — pause naturally instead of filling gaps',
    'Your CELPIP score should never be a surprise — practice enough to know your score before test day',
    'Never click "Next" early — use all your preparation and speaking time',
    'Casual but professional tone — even when talking to a "boss" in the scenario',
  ],
};

// ─── CSF Framework ────────────────────────────────────────────────────────────

export const csfFramework: CSFFramework = {
  title: 'The CSF Technique',
  description: 'Because CELPIP is such a structured test (Tasks 1-8 are always the same format), understanding Context, Skill, and Formula for each task lets you know the right answer before you even start.',
  components: [
    {
      letter: 'C',
      name: 'Context',
      question: 'What do I need to know for this task?',
      description: 'Each task has specific things you MUST read and things you can SKIP. Knowing what to focus on saves time and reduces stress. You learn this before the test — on test day, you already know exactly what to pay attention to.',
      icon: '🎯',
    },
    {
      letter: 'S',
      name: 'Skill',
      question: 'What does the examiner want from me?',
      description: 'This is NOT about your skill — it\'s about what the EXAMINER is looking for. Each task requires a specific ability. Even native English speakers fail (8 out of 10 don\'t get a 9) because they don\'t know what examiners want.',
      icon: '🔍',
    },
    {
      letter: 'F',
      name: 'Formula',
      question: 'What is my step-by-step?',
      description: 'Not a template — a structure you customize for each question. Templates fail because examiners recognize them. A formula gives you the skeleton, but you fill it with realistic, personal content every time.',
      icon: '📋',
    },
  ],
  whyItWorks: '8 out of 10 native English speakers don\'t score 9 on CELPIP — not because their English is bad, but because they don\'t know what examiners are looking for. CSF solves that.',
};

// ─── Creativity Guide ─────────────────────────────────────────────────────────

export const creativityGuide: CreativityGuide = {
  title: 'How to Be More Creative',
  principles: [
    {
      number: 1,
      title: 'Practice More',
      description: 'If you think you\'re not creative enough, the answer is almost always: you haven\'t practiced enough. "I\'ve done 5 tests" — multiply that by 5, then we can talk about improving. Repetition builds the vocabulary and speed you need.',
      keyTakeaway: 'Creativity is not talent — it\'s volume. More practice = more creative responses.',
    },
    {
      number: 2,
      title: 'Judge Yourself Less',
      description: 'Like a guitar player improvising — if you think too much before the next note, it sounds robotic. Your advice, your story, your opinion can be ANYTHING. They\'re not judging WHAT you say — they\'re judging HOW you say it. "Drink coffee to sleep better" is a valid answer if you explain it well.',
      keyTakeaway: 'Stop worrying about giving the "perfect" answer. Say the first thing that comes to mind and explain it well.',
    },
    {
      number: 3,
      title: 'The Golden Rule: Break It Into 3',
      description: 'For everything you say, break it down into 3 small ideas. "Why get a Tesla?" → 1) Save money on gas, 2) They\'re quiet, 3) They\'re stylish. This works for advice, opinions, descriptions — everything. 3 is the magic number for CELPIP.',
      keyTakeaway: 'Every argument, every piece of advice, every description — aim for 3 ideas.',
    },
  ],
};

// ─── Advice Expressions (Task 1) ──────────────────────────────────────────────

export const adviceExpressions: AdviceExpression[] = [
  { expression: 'Why don\'t you...', example: 'Why don\'t you watch the daily news before work?' },
  { expression: 'I suggest...', example: 'I suggest you divide the work into smaller tasks.' },
  { expression: 'I recommend...', example: 'I recommend that you talk to the teacher about this.' },
  { expression: 'I\'d also suggest...', example: 'I\'d also suggest trying a different approach.' },
  { expression: 'Perhaps you could...', example: 'Perhaps you could join a study group.' },
  { expression: 'A good idea is...', example: 'A good idea is to start with the easier tasks first.' },
  { expression: 'One thing you can do is...', example: 'One thing you can do is practice every morning.' },
  { expression: 'My recommendation is...', example: 'My recommendation is to set small goals.' },
];

// ─── Location Words (Task 3 & 8) ──────────────────────────────────────────────

export const locationWords: LocationWord[] = [
  { word: 'In the center of the picture', usage: 'Best starting point when something is in the middle' },
  { word: 'In the foreground', usage: 'Use "on" — on the foreground of the picture' },
  { word: 'In the background', usage: 'Things behind the main subject' },
  { word: 'On the right/left side', usage: 'Always "of the picture" — the right side of the picture' },
  { word: 'At the top/bottom', usage: 'For elements near the edges' },
  { word: 'At the top right corner', usage: 'Combine top/bottom + right/left for corners' },
  { word: 'At the bottom left corner', usage: 'Precise positioning in corners' },
  { word: 'Right beside...', usage: 'Transition from one element to the next' },
  { word: 'Right in front of...', usage: 'For elements in front of others' },
  { word: 'Closer to the center', usage: 'Relative positioning' },
];

// ─── Vocabulary Tips ──────────────────────────────────────────────────────────

export const vocabularyTips: VocabularyTip[] = [
  { title: 'Do more tests', description: 'CELPIP reuses similar topics — practice tests expose you to the vocabulary they like to test.' },
  { title: 'Use a thesaurus', description: 'Google synonyms for words you want to paraphrase. Essential for Task 7 (opinion opening vs. closing).' },
  { title: 'Read and listen simultaneously', description: 'Podcasts with transcripts help you absorb vocabulary naturally — you see and hear new words at the same time.' },
  { title: 'Take notes daily', description: 'Write down new words every day and USE them. If you\'re not taking notes, you\'re forgetting words.' },
  { title: 'Learn household vocabulary', description: 'CELPIP loves home/kitchen/living room scenarios (Task 8). Know: sink, stove, cupboard, shelf, drawer.' },
];

// ─── Speaking Tasks ───────────────────────────────────────────────────────────

export const speakingTasks: SpeakingTask[] = [
  // ─── Task 1: Giving Advice ──────────────────────────
  {
    id: 'task-1',
    taskNumber: 1,
    title: 'Giving Advice',
    prepTime: '30 seconds',
    speakTime: '90 seconds',
    description: 'Read a situation about someone with a problem, then give them advice with organized, realistic suggestions.',
    context: {
      whatToRead: [
        'WHO are you talking to? (friend, coworker, neighbor)',
        'Is the person MALE or FEMALE? (check for he/she pronouns)',
        'What is the PROBLEM? (the situation they\'re facing)',
        'What is the ADVICE? (what you\'re asked to recommend — different from the problem!)',
      ],
      whatToSkip: [
        'Long explanations in the middle of the prompt',
        'Background details that don\'t affect your advice',
      ],
      identifyItems: [
        'The problem and the advice are DIFFERENT things',
        'Example: Problem = "always late" → Advice = "which car to buy"',
        'Recent tests use gender-neutral language more often, but still watch for he/she',
      ],
    },
    skill: {
      mainSkill: 'Using advice expressions',
      grammar: 'Present tense (we give advice in the present, not the past)',
      vocabularyFocus: ['Should', 'I suggest', 'I recommend', 'Why don\'t you', 'A good idea is'],
      examinersWant: 'Organized advice with realistic, personal connections. NOT generic answers.',
    },
    formula: [
      { order: 1, label: 'Greeting + Problem', description: 'Hey [Name], I\'ve heard that you [PROBLEM]. So here are some ideas / here is some advice for you.', example: 'Hey John, I\'ve heard that you\'re trying to talk about the news at work. So here is some advice for you.' },
      { order: 2, label: 'First advice', description: 'First of all, [EXPRESSION] [ADVICE]. [EXPLANATION]. [CONNECTION — "I know you..."]', example: 'First of all, why don\'t you watch the daily news before work? You\'ll have fresh information. I know you like having breakfast watching TV, so just switch to the news instead!' },
      { order: 3, label: 'Second advice', description: 'Second, [EXPRESSION] [ADVICE]. [EXPLANATION]. [CONNECTION].', example: 'Second, I suggest you follow a news podcast. You can listen on your commute.' },
      { order: 4, label: 'Third advice', description: 'Finally, [EXPRESSION] [ADVICE]. [EXPLANATION]. [CONNECTION].', example: 'Finally, I recommend joining the office chat group about current events.' },
      { order: 5, label: 'Closing', description: 'So I hope this helps you! Let me know if you need anything else. (Make it real: reference the situation)', example: 'So I hope this helps you! Let me know how the conversations go at work.' },
    ],
    keyInsights: [
      'Pick only 3 advice expressions and always use the same ones — don\'t try to memorize all of them',
      'The CONNECTION ("I know you...") is what takes your score from 8 to 10 — it makes the answer realistic',
      'The word "advice" is SINGULAR — "here is some advice" (not "here are some advices")',
      'The speaking is NEVER formal — even if talking to a boss, use casual/professional tone',
      'The biggest mistake is speaking too much in the introduction — keep it to 2 sentences max',
      'PAUSE after the introduction before saying "First of all" — organize your speaking',
      'When the prompt says "before, during, and after" → those become your First, Second, Finally',
    ],
    commonMistakes: [
      'Saying too much in the introduction — it\'s just 2 sentences, then move to advice',
      'Giving advice without explaining WHY it\'s good — always explain your reasoning',
      'Using generic closings — make it specific to the person and situation',
      'Forgetting to pause and organize — rushing leads to messy, scattered advice',
      'Not using advice expressions — the examiner is specifically looking for these',
    ],
    proTips: [
      'Use "I know you..." to connect advice with the person — it sounds like a real conversation',
      'Change your advice expression for each piece of advice (why don\'t you → I suggest → I recommend)',
      'If stuck, think: what would I actually tell a friend in this situation?',
    ],
  },

  // ─── Task 2: Personal Experience ────────────────────
  {
    id: 'task-2',
    taskNumber: 2,
    title: 'Talking About a Personal Experience',
    prepTime: '30 seconds',
    speakTime: '60 seconds',
    description: 'Tell a story about a personal experience. The examiners want to see if you can tell an organized story in the past tense.',
    context: {
      whatToRead: [
        'The FIRST LINE — it tells you what you need to talk about (your "what")',
        'The QUESTIONS at the end — you must answer all of them inside your story',
        'The LAST QUESTION — it\'s almost always a feeling question',
      ],
      whatToSkip: [
        'The middle section with examples ("Maybe you can talk about going on a trip, attending a party...")',
        'You don\'t need to follow their suggestions — talk about anything that fits the topic',
      ],
      identifyItems: [
        'You are NOT talking to anyone — you\'re talking to the examiner',
        'The last question is a FEELING question (How did you feel? Why was it important?)',
        'If it says "talk about a time when..." — most common format',
        'If it says "talk about a person/place" — same structure, just change the opening',
      ],
    },
    skill: {
      mainSkill: 'Storytelling ability',
      grammar: 'Past tense (Simple Past is essential; Past Progressive and Past Perfect help but are not mandatory)',
      vocabularyFocus: ['Feeling words (emotional, excited, grateful, worried)', 'Time expressions (years ago, back in, at the time)'],
      examinersWant: 'An organized story with clear past tense, answering all questions naturally (not repeating the question).',
    },
    formula: [
      { order: 1, label: 'Opening + Answer', description: 'I\'m going to talk about a time when [ANSWER]. Give the answer immediately.', example: 'I\'m going to talk about a time when my best friend and I went looking for UFOs.' },
      { order: 2, label: 'Setting (Where + When)', description: 'Every good story starts with WHERE and WHEN. Like "Once upon a time in a far away land."', example: 'This was about 8 years ago, back in my hometown in Brazil.' },
      { order: 3, label: 'Characters', description: 'Introduce anyone you were with. Keep it brief.', example: 'I was with my two best friends from work, and they had been doing this for weeks.' },
      { order: 4, label: 'Answer Q1 and Q2 inside the story', description: 'Answer the questions naturally — do NOT repeat the question. The answers flow inside the story.', example: 'We decided to drive out to the countryside because they told me the sky was clearer there...' },
      { order: 5, label: 'Feeling question (Q3)', description: 'Repeat the KEY WORD from the question to show the examiner you\'re answering it. This is the "shoulder check."', example: 'The reason why I really wanted to participate was because I felt like I needed a change in my routine.' },
    ],
    keyInsights: [
      'The answers MUST be inside the story — never repeat the question then answer it separately',
      'The "shoulder check": repeat the key word from the last question so the examiner knows you\'re answering it',
      'If the question is about a PERSON (not a time): "I\'m going to talk about my friend [Name]" — then use where/when you met them',
      'Answer questions in sequence — it helps you organize your story better',
      'It\'s always 3 questions — follow the formula naturally',
      'You can lie — it doesn\'t matter if the story is true. What matters is telling it well.',
    ],
    commonMistakes: [
      'Starting the story without setting the scene (where and when)',
      'Repeating the questions: "What did I do? I went to..." — just tell the story naturally',
      'Forgetting the feeling question at the end — it\'s the most important for your score',
      'Not using past tense consistently throughout the story',
      'Trying to tell too complex a story — keep it simple and organized',
    ],
    proTips: [
      'Practice the shoulder check: always repeat the key word from the last question',
      'Use "back in my hometown" as a universal setting that always works',
      'The story can be about anything — even things you hate (like running) — creativity is key',
    ],
  },

  // ─── Task 3: Describing a Scene ────────────────────
  {
    id: 'task-3',
    taskNumber: 3,
    title: 'Describing a Scene',
    prepTime: '30 seconds',
    speakTime: '60 seconds',
    description: 'Describe a picture to someone who CANNOT see it. Use present progressive (ING) and go from macro to micro.',
    context: {
      whatToRead: [
        'You DON\'T need to read the prompt — it\'s always the same: describe what you see',
        'The person you\'re describing to CANNOT see the picture',
      ],
      whatToSkip: [
        'The entire prompt text — Task 3 is always "describe what you see"',
        'You don\'t need to describe EVERYTHING — 4-5 elements is enough',
      ],
      identifyItems: [
        'The picture is always busy with lots of things happening',
        'You need to describe what is HAPPENING, not what EXISTS',
        'The listener cannot see the picture — this changes how you describe',
      ],
    },
    skill: {
      mainSkill: 'Present progressive (ING) descriptions',
      grammar: 'Present progressive — "She IS DOING", "They ARE RUNNING" — essential for this task',
      vocabularyFocus: ['Location words (foreground, background, center, corners)', 'It looks like / It appears / We can see / It seems'],
      examinersWant: 'Organized description using progressive tense, showing you can describe what is happening to someone who can\'t see it.',
    },
    formula: [
      { order: 1, label: 'Location (Macro)', description: 'This is a picture of [PRECISE LOCATION]. Be specific — not "a hotel" but "a hotel lobby."', example: 'This is a picture of a sports day event at a school field.' },
      { order: 2, label: 'General description', description: 'Describe the overall scene in one sentence. Use words like "many", "several", "some."', example: 'There are many people playing different sports, and some referees controlling the points.' },
      { order: 3, label: 'Center/Main element', description: 'Start with whatever is in the center or most prominent. Describe what is HAPPENING there.', example: 'Right in the center of the picture, there is a check-in counter where two guests are checking in.' },
      { order: 4, label: 'Move outward', description: 'Use the first element to transition: "Right beside them..." / "To the right side..." Describe 3-4 more elements.', example: 'Right beside them, at the bottom right corner, there\'s a racing game where people have their legs tied together.' },
      { order: 5, label: 'Closing (General)', description: 'End with a general feeling: "It looks like everybody is [POSITIVE ING]."', example: 'It looks like everybody is having a great time at this sports event.' },
    ],
    keyInsights: [
      'Macro to Micro: Location → General → Center → Outward → Closing',
      'You do NOT need to describe everything — 4-5 elements with good description beats 8 with bad description',
      'If you don\'t know a word, DESCRIBE IT: "a thing that holds paper towels" is better than silence',
      'Start with what you know best — describe elements you have vocabulary for first',
      '"It looks like" / "It appears" / "It seems" — these phrases show you\'re interpreting, not just listing',
      'Colors are NOT important — focus on what is HAPPENING',
      'CELPIP uses busy pictures on purpose — they know you won\'t describe everything',
    ],
    commonMistakes: [
      'Listing what EXISTS instead of what is HAPPENING: "There is a table" vs. "A family is eating at a table"',
      'Not using ING — this is the #1 grammar requirement for this task',
      'Starting with a random detail instead of the overall location',
      'Trying to describe every single thing in the picture — impossible and unnecessary',
      'Using "there is/there are" for everything without progressive tense',
    ],
    proTips: [
      'Use corners for precision: "At the top right corner of the picture..."',
      'If you don\'t know a sport/item name, describe it: "A game where two teams pull a rope"',
      'Practice describing photos around you — this builds speed and vocabulary',
    ],
  },

  // ─── Task 4: Making Predictions ─────────────────────
  {
    id: 'task-4',
    taskNumber: 4,
    title: 'Making Predictions',
    prepTime: '30 seconds',
    speakTime: '60 seconds',
    description: 'Same picture as Task 3, but now predict what will happen next. Use future tense.',
    context: {
      whatToRead: [
        'This is the SAME picture as Task 3 — you already know it',
        'Focus on what MIGHT happen next based on what you see',
      ],
      whatToSkip: [
        'You don\'t need to re-read the picture — you already described it',
      ],
      identifyItems: [
        'You need to predict the FUTURE based on the picture',
        'Use future tense and speculation language',
      ],
    },
    skill: {
      mainSkill: 'Future predictions and speculation',
      grammar: 'Future tense — "will", "is going to", "might", "probably"',
      vocabularyFocus: ['I think... will...', 'It looks like... is going to...', 'Probably / Maybe / Most likely'],
      examinersWant: 'Logical predictions about the future based on visual evidence, using future tense correctly.',
    },
    formula: [
      { order: 1, label: 'Reference the scene', description: 'Briefly reference the picture you already described.', example: 'Looking at this sports event...' },
      { order: 2, label: 'Prediction 1', description: 'Make a prediction about one element. Use future tense + reasoning.', example: 'I think the green team is going to win the tug of war because they look much stronger.' },
      { order: 3, label: 'Prediction 2', description: 'Predict something about another element.', example: 'The red team will probably win the relay race since they\'re already ahead.' },
      { order: 4, label: 'Prediction 3', description: 'Make a broader prediction about the overall scene.', example: 'After the competition, everyone is probably going to celebrate together.' },
      { order: 5, label: 'Closing', description: 'End with a general future statement.', example: 'Overall, it looks like this is going to be a very exciting and memorable event for everyone.' },
    ],
    keyInsights: [
      'You already know the picture from Task 3 — use that knowledge',
      'Your predictions don\'t need to be "correct" — just logical and well-explained',
      'Mix future forms: "will", "is going to", "might", "probably" — variety shows skill',
      'Connect predictions to what you SEE in the picture',
    ],
    commonMistakes: [
      'Re-describing the picture instead of predicting the future',
      'Using present tense instead of future tense',
      'Making random predictions without connecting them to the picture',
      'Not explaining WHY you think something will happen',
    ],
    proTips: [
      'Use "Based on what I can see..." to connect your prediction to the image',
      'Predict consequences: if X is happening now, then Y will happen next',
      'End with a general positive prediction about the whole scene',
    ],
  },

  // ─── Task 5: Comparing and Persuading ──────────────
  {
    id: 'task-5',
    taskNumber: 5,
    title: 'Comparing and Persuading',
    prepTime: '60 seconds',
    speakTime: '60 seconds',
    description: 'Compare two options, select one, and persuade why your choice is better with organized arguments.',
    context: {
      whatToRead: [
        'The TWO OPTIONS you need to compare',
        'You must SELECT one and explain why it\'s better',
        'After selecting, you click Next and start comparing',
      ],
      whatToSkip: [
        'Don\'t overthink the choice — there\'s no wrong answer',
      ],
      identifyItems: [
        'You need to COMPARE (how are they different?)',
        'You need to PERSUADE (why is yours better?)',
        'Both skills must be demonstrated',
      ],
    },
    skill: {
      mainSkill: 'Comparison and persuasion',
      grammar: 'Comparative forms — better, more, less, whereas, while, on the other hand',
      vocabularyFocus: ['Comparative adjectives', 'Contrast words (whereas, while, however)', 'Persuasion language'],
      examinersWant: 'Clear comparisons between the two options with persuasive arguments for your choice.',
    },
    formula: [
      { order: 1, label: 'State your choice', description: 'Clearly state which option you chose and why briefly.', example: 'I would choose Option A because I believe it offers much more value.' },
      { order: 2, label: 'Comparison 1', description: 'Compare the first aspect. Show how your choice is better.', example: 'While Option B is cheaper, Option A provides much better quality in the long run.' },
      { order: 3, label: 'Comparison 2', description: 'Compare a second aspect.', example: 'Also, whereas Option B only covers basic features, Option A includes everything you need.' },
      { order: 4, label: 'Comparison 3', description: 'Compare a third aspect if time allows.', example: 'Finally, Option A has much better reviews and is recommended by more people.' },
      { order: 5, label: 'Closing persuasion', description: 'Summarize why your choice is the best. Paraphrase your opening.', example: 'That\'s why I strongly believe Option A is the best choice overall.' },
    ],
    keyInsights: [
      'There is no wrong answer — pick whichever option you can argue for best',
      'You need BOTH comparison AND persuasion — don\'t just list pros of your choice',
      'Three comparisons is the magic number — aim for 3',
      'If you can only do 2 with good detail, that\'s acceptable, but practice for 3',
    ],
    commonMistakes: [
      'Only talking about your choice without comparing to the other option',
      'Not using comparative language (whereas, while, however, on the other hand)',
      'Picking an option you can\'t argue for — choose the one you have more to say about',
      'Rushing through comparisons without explaining your reasoning',
    ],
    proTips: [
      'Use contrast words to show the examiner you\'re comparing: "whereas", "while", "on the other hand"',
      'Acknowledge something good about the other option, then explain why yours is still better',
      'Practice with everyday decisions: which restaurant? which phone? which vacation?',
    ],
  },

  // ─── Task 6: Dealing with a Difficult Situation ────
  {
    id: 'task-6',
    taskNumber: 6,
    title: 'Dealing with a Difficult Situation',
    prepTime: '60 seconds',
    speakTime: '60 seconds',
    description: 'You have two choices for handling a situation. Pick one and explain your reasoning with details.',
    context: {
      whatToRead: [
        'The SITUATION you\'re dealing with',
        'The TWO CHOICES available to you',
        'WHO you\'re talking to and WHY',
      ],
      whatToSkip: [
        'Extra background details that don\'t affect your decision',
      ],
      identifyItems: [
        'You must make a DECISION and stick with it',
        'You need to give INFORMATION about your choice',
        'Explain your reasoning clearly',
      ],
    },
    skill: {
      mainSkill: 'Decision-making and explanation',
      grammar: 'Present and future tense — explaining your decision and its consequences',
      vocabularyFocus: ['Decision language (I\'ve decided, I believe, The reason is)', 'Explanation language (because, since, this way)'],
      examinersWant: 'A clear decision with well-organized reasoning and practical explanations.',
    },
    formula: [
      { order: 1, label: 'State the situation', description: 'Briefly acknowledge the situation and state your decision.', example: 'I understand the situation, and I\'ve decided to go with the first option.' },
      { order: 2, label: 'Reason 1', description: 'Give your first reason with explanation.', example: 'The main reason is that this option is much more practical for everyone involved.' },
      { order: 3, label: 'Reason 2', description: 'Give your second reason.', example: 'Also, this will save us a lot of time and avoid potential problems in the future.' },
      { order: 4, label: 'Reason 3', description: 'Give your third reason if time allows.', example: 'Finally, I think this is the fairest option for everyone.' },
      { order: 5, label: 'Closing', description: 'Summarize your decision and offer to discuss further.', example: 'So that\'s why I believe this is the best decision. Let me know what you think.' },
    ],
    keyInsights: [
      'Pick the option you can talk about most — there\'s no wrong choice',
      'Your decision needs REASONS — never just state a preference without explanation',
      'Think about consequences: "If we do X, then Y will happen"',
      'Be confident in your choice — don\'t waver or seem unsure',
    ],
    commonMistakes: [
      'Not clearly stating which option you chose',
      'Giving reasons without explanation — always say WHY',
      'Changing your mind mid-answer — commit to your choice',
      'Not addressing the person you\'re talking to',
    ],
    proTips: [
      'Use "I\'ve decided" — it sounds confident and clear',
      'Acknowledge the other option briefly: "While Option B has some benefits, I believe..."',
      'End with a question or invitation: "What do you think?" / "Let me know if you agree"',
    ],
  },

  // ─── Task 7: Expressing Opinions ────────────────────
  {
    id: 'task-7',
    taskNumber: 7,
    title: 'Expressing Opinions',
    prepTime: '30 seconds',
    speakTime: '90 seconds',
    description: 'Express your opinion on a yes/no question with 3 points, each with a reason and example. The "Backstreet Boys" technique.',
    context: {
      whatToRead: [
        'The YES or NO question — simple, straightforward',
        'You need to pick a side and defend it',
      ],
      whatToSkip: [
        'Don\'t overthink the question — just pick the side you can argue best',
      ],
      identifyItems: [
        'This is a 90-second task — the longest speaking task',
        'You need 3 points with reasons and examples',
        'You must PARAPHRASE your opinion in the closing (different words, same meaning)',
      ],
    },
    skill: {
      mainSkill: 'Structured opinion with supporting arguments',
      grammar: 'Mix of tenses — present for opinions, past for examples',
      vocabularyFocus: ['Opinion expressions (In my opinion, I believe, I strongly feel)', 'Supporting language (because, the reason is, for example)'],
      examinersWant: 'A clear opinion with 3 organized points, each supported by a reason and example. The closing must paraphrase the opening.',
    },
    formula: [
      { order: 1, label: 'Opinion statement', description: 'In my opinion, [YOUR STANCE ON THE QUESTION].', example: 'In my opinion, all high school students should participate in physical education classes.' },
      { order: 2, label: 'Point 1 + Reason + Example', description: 'First of all, [POINT]. [REASON]. [EXAMPLE from life].', example: 'First of all, because it\'s important for their health. Nowadays many kids are addicted to social media. My cousin is overweight and spends all day on his computer.' },
      { order: 3, label: 'Point 2 + Reason + Example', description: 'Second, [POINT]. [REASON]. [EXAMPLE].', example: 'Second, because of teamwork. Children who practice teamwork become better colleagues. When I was in school, working with friends helped me become a better manager.' },
      { order: 4, label: 'Point 3 + Reason + Example', description: 'Lastly, [POINT]. [REASON]. [EXAMPLE if time allows].', example: 'Lastly, it improves their thinking. It is proven that children who exercise more think better and have better grades.' },
      { order: 5, label: 'Closing (PARAPHRASE)', description: 'So that\'s why [SAME OPINION IN DIFFERENT WORDS]. You MUST change the words.', example: 'So that\'s why physical education classes should be mandatory in high school. (Changed "required" → "mandatory", "students should participate" → "classes should be mandatory")' },
    ],
    keyInsights: [
      'Called "Backstreet Boys technique" — Point, Reason, Example for each argument',
      'P.R.E. × 3 is ideal — if time is tight, have at least 1 full example and do P.R. for the others',
      'The CLOSING must paraphrase the opening — same idea, different words. This shows vocabulary.',
      'Make points SPECIFIC, not broad. "Health" is too big — "lose weight" or "reduce stress" is better.',
      'This is 90 seconds — the longest task. You have time for 3 full P.R.E. blocks.',
      '3 is the magic number — always aim for 3 arguments',
    ],
    commonMistakes: [
      'Using the exact same words in opening and closing — you MUST paraphrase',
      'Giving points without reasons — always explain WHY',
      'Making points too broad (e.g., "health") — be specific (e.g., "reduce childhood obesity")',
      'Only giving 1 or 2 arguments — always try for 3',
      'Forgetting to use a real example — examples make your argument concrete',
    ],
    proTips: [
      'Practice paraphrasing: write a sentence, then rewrite it with different words',
      'Use personal examples — "I remember when...", "My cousin...", "In my experience..."',
      'If stuck between Yes and No, pick the one you have 3 points for, not the one you believe in',
    ],
  },

  // ─── Task 8: Describing an Unusual Situation ───────
  {
    id: 'task-8',
    taskNumber: 8,
    title: 'Describing an Unusual Situation',
    prepTime: '30 seconds',
    speakTime: '60 seconds',
    description: 'Describe an unusual/weird picture to a friend and end with a call to action (question or recommendation).',
    context: {
      whatToRead: [
        'WHO are you talking to? (a friend, usually by name)',
        'WHY are you calling/describing this? (the reason)',
        'The CALL TO ACTION at the end — what question or recommendation to make',
      ],
      whatToSkip: [
        'Don\'t spend too much time on the prompt details — focus on the picture',
      ],
      identifyItems: [
        'This picture is intentionally WEIRD — that\'s the point',
        'You are usually CALLING someone to describe what you see',
        'There is ALWAYS a question/call to action at the end',
        'CELPIP knows you won\'t know all the vocabulary — describing things you don\'t know the word for IS the test',
      ],
    },
    skill: {
      mainSkill: 'Descriptive vocabulary + creative descriptions',
      grammar: 'Present tense and progressive — describing what you see right now',
      vocabularyFocus: ['Household items (sink, stove, cupboard, shelf)', 'Describing unknown items ("a thing that holds...")', 'Feelings and recommendations'],
      examinersWant: 'The ability to describe unusual things even when you don\'t know the exact words. Plus a clear call to action at the end.',
    },
    formula: [
      { order: 1, label: 'Hey [Name] + Why calling', description: 'Greet the person and explain why you\'re calling them.', example: 'Hey Seda! I\'m here at Mary\'s house and her kitchen is something you would love.' },
      { order: 2, label: 'Describe the scene', description: 'Describe the unusual picture — focus on what makes it interesting or weird. Use the vocabulary you know.', example: 'So the kitchen has a really modern style with white cupboards and a beautiful marble countertop...' },
      { order: 3, label: 'Highlight unusual elements', description: 'Point out the weird/unusual parts — this shows the examiner you can describe unexpected things.', example: 'But the weirdest part is that there\'s a fish tank built right into the sink!' },
      { order: 4, label: 'Call to action', description: 'End with the question or recommendation the prompt asks for. This is CRITICAL — many students forget it.', example: 'So what do you think? Would you want a similar style for your kitchen?' },
    ],
    keyInsights: [
      'The picture is WEIRD on purpose — they want to see if you can describe things you don\'t have exact words for',
      'If you don\'t know a word, DESCRIBE IT: "a thing that holds paper towels" > saying nothing',
      'The call to action at the end is CRITICAL — many students forget it and lose points',
      'Learn household vocabulary: sink, stove, cupboard, shelf, drawer, countertop, cabinet',
      'You can use feelings to enhance descriptions: "It gives me a feeling of a summer vacation"',
      'Tasks 3, 4, and 8 all involve pictures but with DIFFERENT techniques',
    ],
    commonMistakes: [
      'Forgetting the call to action at the end — this is the most common mistake',
      'Trying to describe everything in the picture — focus on 3-4 key elements',
      'Not addressing the person by name or explaining why you\'re calling',
      'Going silent when you don\'t know a word — describe it instead',
      'Starting with the call to action ("Do you want this kitchen?") — you must describe FIRST',
    ],
    proTips: [
      'Practice describing random objects around your house without using their name',
      '"It looks like a..." and "It reminds me of..." are great phrases for unusual items',
      'End with energy: "So what do you think? Would you love this?" — make it enthusiastic',
    ],
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

export function getSpeakingTask(taskNumber: number): SpeakingTask | undefined {
  return speakingTasks.find((t) => t.taskNumber === taskNumber);
}

export function getImageTasks(): SpeakingTask[] {
  return speakingTasks.filter((t) => [3, 4, 8].includes(t.taskNumber));
}

export function getLongerTasks(): SpeakingTask[] {
  return speakingTasks.filter((t) => t.speakTime === '90 seconds');
}
