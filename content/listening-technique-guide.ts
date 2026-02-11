// Listening Technique Guide — "Seven Secret Steps" Framework
// Structured for CELPIP Coach platform

// ─── High Score Requirements ──────────────────────────────────────────────────

export const highScoreRequirements = [
  'KNOW what to expect in each part — no surprises on test day.',
  'HAVE A STRATEGY on how to write notes and what to write (hint: not everything).',
  'UNDERSTAND all questions and patterns of questions.',
  'Repeatedly PRACTICE — use your score tracker.',
];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SecretStep {
  step: number;
  title: string;
  description: string;
  isUniversal: boolean; // Steps 1-3 are task-specific, 4-7 are universal
  tips: string[];
  examples?: string[];
}

export interface TaskTechnique {
  taskNumber: number;
  title: string;
  icon: string;
  format: string;
  description: string;
  questionType: 'listen-and-answer' | 'read-and-answer';
  questionCount: number;
  difficulty: 'easier' | 'moderate' | 'harder';
  hasVideo: boolean;
  hasPicture: boolean;
  noteStrategy: 'no-notes' | 'optional-notes' | 'table-notes';
  detailsImportant: boolean; // Tasks 1-3: false, Tasks 4-6: true
  steps: SecretStep[];
  keyInsights: string[];
  practiceExample?: TaskExample;
}

export interface TaskExample {
  title: string;
  context: string;
  walkthrough: WalkthroughMoment[];
}

export interface WalkthroughMoment {
  label: string;
  audioSnippet: string;
  stepApplied: number;
  insight: string;
}

export interface NoteTakingGuide {
  title: string;
  description: string;
  tableSetup: string;
  identifyPeople: string[];
  symbols: NoteSymbol[];
  rules: string[];
}

export interface NoteSymbol {
  symbol: string;
  meaning: string;
}

export interface ScoringStrategy {
  title: string;
  description: string;
  tips: string[];
}

// ─── Universal Steps (4–7) ────────────────────────────────────────────────────

export const universalSteps: SecretStep[] = [
  {
    step: 4,
    title: 'Feelings & Questions',
    description:
      'Pay attention to how people feel and questions they ask or answer. CELPIP loves to ask about emotions and attitudes.',
    isUniversal: true,
    tips: [
      'Identify emotions: worried, annoyed, frustrated, excited, disappointed, surprised',
      'Notice tone shifts — someone going from happy to upset is significant',
      'When someone asks a question and gets an answer, both parts matter',
      'In news items (Task 4), look for quotes — if they quote someone, there WILL be a question about it',
      'Use precise emotion words: "annoyed" is better than "sad", "apprehensive" beats "worried"',
    ],
    examples: [
      'Pet owner is worried/anxious about his cat → feeling question',
      'Wife is surprised she donated the wrong shirt → feeling question',
      'Claudia is frustrated she couldn\'t go to the conference → feeling question',
      'Claudia volunteers because it makes her happy → feeling question',
    ],
  },
  {
    step: 5,
    title: 'Times & Dates (Time Frame)',
    description:
      'Understand the general time frame, never specific dates. CELPIP never asks "what exact date?" — they ask whether something is recent, old, or future.',
    isUniversal: true,
    tips: [
      'Never memorize specific dates like "September 1976" or "Friday at 3pm"',
      'Understand the TIME FRAME: Is this recent? Old? In the future? Happening now?',
      'When someone says "last summer" or "three months ago", understand the general idea',
      '"She played tennis three times last summer" → question: "What is true about the woman?" → "She actually played tennis"',
    ],
    examples: [
      '"I just bought it recently" → it\'s new/recent',
      '"Last fall you sold my rackets" → happened in the past',
      '"We\'ll start next month" → future plan',
    ],
  },
  {
    step: 6,
    title: 'Details & Descriptions',
    description:
      'Pay attention to details ONLY when CELPIP gives them emphasis. If they spend 10+ seconds describing something, expect a question about it.',
    isUniversal: true,
    tips: [
      'Small, specific details that get NO emphasis = not important',
      'If CELPIP spends time explaining HOW something works = expect a question',
      'You don\'t need to know specific vocabulary — understand the IDEA',
      'Example: You don\'t need to know "fleas" — just understand "insect bites / skin problem"',
      'Example: You don\'t need to know "amber" — just understand "valuable stone"',
      'In Tasks 1-3, names of people/animals are NOT important for questions',
      'In Tasks 4-6, names START becoming important — know who said what',
    ],
    examples: [
      'Cat scratching itself → elimination tells you "insect bites" even without knowing "fleas"',
      'Amber test: rub on fabric, attracts dust → emphasized detail = will be a question',
      'Striped shirt vs. gray shirt → visual detail, likely a picture question',
    ],
  },
  {
    step: 7,
    title: 'Future Outcomes & Possibilities',
    description:
      'There is ALWAYS a future question. 100% of the time. Usually near the end of the listening.',
    isUniversal: true,
    tips: [
      'Listen for: "I\'m going to...", "We should...", "I\'ll probably...", "I think I\'ll..."',
      'The future action doesn\'t need to be stated explicitly — CELPIP gives you the DIRECTION',
      'Common question: "What is the man/woman probably going to do next?"',
      'The answer may use different words than what was said — paraphrased',
      'Example: Someone says "I\'ll see if I can figure that out tomorrow" about buying a car → answer could be "go to a dealership"',
      'Circle or mark future actions in your notes — they are almost guaranteed questions',
    ],
    examples: [
      '"I\'ll just wear my old blue one" → future question about which shirt he\'ll wear',
      '"Shauna decided to use the proceeds to finance a trip to Peru" → answer: "sell the rings and travel abroad"',
      '"We\'re going to focus our energy outside the workplace" → future outcome',
      '"I can show you the apartment at 3pm" → future action (viewing the apartment)',
    ],
  },
];

// ─── Task-Specific Techniques ─────────────────────────────────────────────────

export const taskTechniques: TaskTechnique[] = [
  // ── Task 1: Listening to Problem Solving ──────────────────────────────────
  {
    taskNumber: 1,
    title: 'Listening to Problem Solving',
    icon: '🔧',
    format: 'Conversation between two people about a problem and its solution',
    description:
      'Two people discuss a problem. Your job: identify the problem, spot fake vs. real solutions, and predict the future outcome.',
    questionType: 'listen-and-answer',
    questionCount: 8,
    difficulty: 'easier',
    hasVideo: false,
    hasPicture: true,
    noteStrategy: 'no-notes',
    detailsImportant: false,
    steps: [
      {
        step: 1,
        title: 'Identify the Problem',
        description:
          'The FIRST thing you must do. What is wrong? Why are they talking? This is almost always Question 1.',
        isUniversal: false,
        tips: [
          'Listen for the reason they are having the conversation',
          'The problem is usually stated in the first 30 seconds',
          'Example: "She\'s been scratching herself" → the cat has a skin/health issue',
          'The problem might seem simple — don\'t overcomplicate it',
        ],
      },
      {
        step: 2,
        title: 'Identify the Solution (Real vs. Fake)',
        description:
          'CELPIP loves to give a FAKE solution first, then the REAL solution later. Don\'t fall for the first one!',
        isUniversal: false,
        tips: [
          'The first suggestion might be rejected: "I tried that and it didn\'t work"',
          'Wait for the REAL solution — it usually comes after the fake one',
          'If there\'s no clear solution, understand the POSSIBLE solution',
          'Listen for agreement: "Yes, that\'s a good idea" = real solution',
          'Listen for rejection: "But that didn\'t work" = fake solution',
        ],
      },
      {
        step: 3,
        title: 'Follow the Conversation Flow',
        description:
          'Track who suggests what solution and how the conversation develops toward a resolution.',
        isUniversal: false,
        tips: [
          'Note who proposes each solution (but names aren\'t critical in Tasks 1-3)',
          'The listening is split into 3 segments with questions after each',
          '8 questions total: ~2 after first segment, ~3 after second, ~3 after third',
          'Watch for picture questions — they test visual details (e.g., upper back pain → which body part)',
        ],
      },
      ...universalSteps,
    ],
    keyInsights: [
      'Tasks 1-3 are EASIER — focus here to build your score foundation',
      'Names are NOT important in Tasks 1-3 (Tiger the cat\'s name won\'t trick you)',
      'The listening plays ONCE — no replay, no pause on test day',
      'You DON\'T need notes for Tasks 1-3 — just follow the 7 steps',
      'If you don\'t know a word (like "fleas"), use elimination to find the answer',
      'There may be picture questions — pay attention to physical descriptions',
    ],
    practiceExample: {
      title: 'The Vet Clinic',
      context: 'A woman (veterinarian) and a man (pet owner) at a veterinary clinic',
      walkthrough: [
        {
          label: 'Context Screen',
          audioSnippet:
            'You will hear a conversation between a woman and a man at a veterinary clinic. The woman is a veterinarian and the man is a pet owner.',
          stepApplied: 1,
          insight:
            'Before listening: predict the topic — pet health, immunizations, pet issues. Don\'t worry about the specific animal in the picture.',
        },
        {
          label: 'Problem Identified',
          audioSnippet:
            '"I\'m really worried about her. She\'s usually so playful, but this past week, all she\'s been doing is scratching herself."',
          stepApplied: 1,
          insight:
            'Problem = cat is scratching, not playful. This WILL be a question. The answer is about scratching, not about being "not playful".',
        },
        {
          label: 'Details & Description',
          audioSnippet: '"Is Tiger an indoor or an outdoor cat?" "Mostly outdoors."',
          stepApplied: 6,
          insight:
            'Background detail — understand the general idea (outdoor cat), don\'t memorize every word.',
        },
        {
          label: 'Solution Given',
          audioSnippet:
            '"These marks look like flea bites... I\'ll give you some medication to apply once a month."',
          stepApplied: 2,
          insight:
            'Solution = medication for fleas. You don\'t need to know "fleas" — just "insect bites / skin medication".',
        },
        {
          label: 'Elimination in Action',
          audioSnippet: 'Question: "What is the main problem with Tiger?"',
          stepApplied: 1,
          insight:
            'Even without knowing "fleas", eliminate wrong answers. "Claws too sharp"? No. "Not playful"? Symptom, not cause. "Insect bites"? Makes sense with scratching. Elimination saves you.',
        },
      ],
    },
  },

  // ── Task 2: Listening to a Daily Life Conversation ────────────────────────
  {
    taskNumber: 2,
    title: 'Listening to a Daily Life Conversation',
    icon: '🏠',
    format: 'Casual conversation about everyday topics',
    description:
      'An informal conversation about daily life. Find the WHY behind the conversation, then track the main topic as it may SHIFT.',
    questionType: 'listen-and-answer',
    questionCount: 5,
    difficulty: 'easier',
    hasVideo: false,
    hasPicture: true,
    noteStrategy: 'no-notes',
    detailsImportant: false,
    steps: [
      {
        step: 1,
        title: 'Find the WHY (or Problem)',
        description:
          'Why are they having this conversation? There may or may not be a problem — but there\'s always a REASON.',
        isUniversal: false,
        tips: [
          'Unlike Task 1, there may NOT be a clear problem — it could just be a situation',
          '"I want to buy a new car" is NOT a problem — it\'s a reason for the conversation',
          'The WHY is always a question — 100% of the time',
          'Example: They\'re having the conversation because they\'re LATE to a party (the real why), not because of the missing shirt',
        ],
      },
      {
        step: 2,
        title: 'Find the Main Topic (It May Shift!)',
        description:
          'The conversation might START about one thing but SHIFT to another. Follow the shift — the main topic is where it lands.',
        isUniversal: false,
        tips: [
          'They might start talking about glasses but shift to making money — the main topic is making money',
          'They start talking about being late, shift to a missing shirt, shift to donating items → main topic = donating/giving things away',
          'Don\'t confuse the TRIGGER with the MAIN TOPIC',
          'Once you find the main topic, track the explanations around it',
        ],
      },
      {
        step: 3,
        title: 'Track Explanations & Descriptions',
        description:
          'Around the main topic, people will explain things, describe items, share opinions. Track these — they become questions.',
        isUniversal: false,
        tips: [
          'Visual descriptions (striped shirt vs. gray shirt) → likely a picture question',
          'Who did what? (She donated HIS shirt, he sold HER rackets) → relationship/action questions',
          'Agreements or decisions made during conversation → key answers',
          'The tone of conversation matters — are they fighting, joking, planning?',
        ],
      },
      ...universalSteps,
    ],
    keyInsights: [
      'Task 2 is more casual — topics are from everyday life',
      'The WHY they\'re talking might differ from the MAIN TOPIC',
      'Picture questions are common — pay attention to physical descriptions',
      'Feelings are critical: annoyed ≠ sad, surprised ≠ scared — use precise words',
      'Future questions: "What shirt will he wear?" → the LAST one mentioned, not his favorite',
      'You DON\'T need notes — follow the 7 steps and stay focused',
    ],
    practiceExample: {
      title: 'The Thrift Store Donation',
      context: 'A couple discussing donating items to a thrift store',
      walkthrough: [
        {
          label: 'The Real WHY',
          audioSnippet:
            '"Julie, is that you? We\'re going to be late to Susan and Anthony\'s housewarming party!"',
          stepApplied: 1,
          insight:
            'The REAL reason for the conversation = they\'re late to a party. This could be a question even though the topic shifts.',
        },
        {
          label: 'Topic Shift',
          audioSnippet: '"I think I donated that one to the thrift store last week."',
          stepApplied: 2,
          insight:
            'Topic shifts from being late → missing favorite shirt → donating items. Main topic = giving things away.',
        },
        {
          label: 'Description Detail',
          audioSnippet:
            '"No, that was the solid gray one with the stained collar... the one with the stripes I just bought recently."',
          stepApplied: 6,
          insight:
            'Two shirts: gray (stained collar, old) vs. striped (new, favorite). High chance of a picture question.',
        },
        {
          label: 'Feelings',
          audioSnippet: '"How is the man feeling at the start of the conversation?"',
          stepApplied: 4,
          insight:
            'He\'s annoyed/upset, NOT sad. CELPIP uses precise feelings. "Afraid" and "annoyed" were options — annoyed is correct.',
        },
        {
          label: 'Future Outcome',
          audioSnippet: '"I\'ll just wear my old blue one."',
          stepApplied: 7,
          insight:
            'TRAP: You might select the striped shirt because it\'s his favorite. But the FUTURE answer is the blue one — that\'s what he\'ll actually wear.',
        },
      ],
    },
  },

  // ── Task 3: Listening for Information ──────────────────────────────────────
  {
    taskNumber: 3,
    title: 'Listening for Information',
    icon: '📢',
    format: 'Conversation where one person provides information and the other asks/needs it',
    description:
      'One person needs information, the other provides it. Track questions, answers, and especially CHOICES the person makes.',
    questionType: 'listen-and-answer',
    questionCount: 6,
    difficulty: 'easier',
    hasVideo: false,
    hasPicture: false,
    noteStrategy: 'no-notes',
    detailsImportant: false,
    steps: [
      {
        step: 1,
        title: 'Why Are They Talking?',
        description:
          'One person is there for a reason — renting an apartment, joining a gym, getting a service. Identify the reason immediately.',
        isUniversal: false,
        tips: [
          'Usually one person PROVIDES info and the other NEEDS info',
          'Example: "I saw a sign about apartments available" → she wants to rent',
          'The WHY is usually clear from the context screen AND the first few seconds',
          'This is always a question — probably Question 1 or 2',
        ],
      },
      {
        step: 2,
        title: 'Track Questions & Answers',
        description:
          'Every time one person asks a question and gets an answer, that\'s a potential test question. Follow each Q&A pair.',
        isUniversal: false,
        tips: [
          '"When is it available?" → "Next month" — this is a testable detail',
          '"How much does it cost?" → price comparison is common',
          '"Is there a deposit?" → specific info that matters',
          'Don\'t memorize all details — understand the IDEAS behind the answers',
          'If CELPIP gives EMPHASIS to a detail (spends time on it), expect a question',
        ],
      },
      {
        step: 3,
        title: 'Identify Choices & Decisions',
        description:
          'In Task 3, the person needing info will make a CHOICE. This is ALWAYS a question.',
        isUniversal: false,
        tips: [
          '"What did the person select/decide/choose?" → guaranteed question',
          'Example: Two apartments — open vs. closed floor plan → she chooses open (ground floor)',
          'Listen for: "I think I\'d prefer...", "I\'ll go with...", "That sounds better"',
          'The choice often involves weighing options — track what\'s compared',
          'Sometimes the choice isn\'t explicit — inferred from preferences stated',
        ],
      },
      ...universalSteps,
    ],
    keyInsights: [
      'Task 3 = one person provides info, the other receives it',
      'CHOICES are always questions — "What did the person decide?"',
      'When details get emphasis (10+ seconds of explanation), expect a question',
      'Details WITHOUT emphasis are usually not important',
      'Elimination is your best friend — remove obviously wrong answers first',
      'If you\'re not sure, you went from 4 options to 2 — much better odds',
      'Task 3 might NOT have a future question — that\'s okay, it\'s the exception',
    ],
    practiceExample: {
      title: 'The Apartment Rental',
      context: 'A woman visits a building to ask about available apartments',
      walkthrough: [
        {
          label: 'The WHY',
          audioSnippet:
            '"I saw a sign on the front door about apartments available... I thought I\'d just come in and ask."',
          stepApplied: 1,
          insight:
            'She\'s there because she saw a sign. This IS the "why" — it\'s a detail question about how the conversation started.',
        },
        {
          label: 'Information Exchange',
          audioSnippet:
            '"Apartment two has two separate bedrooms... Apartment one is what we call an open floor plan."',
          stepApplied: 2,
          insight:
            'Two options compared: open vs. closed floor plan, same size (850 sq ft). Track the differences.',
        },
        {
          label: 'The Choice',
          audioSnippet:
            '"I think I\'d prefer to be on the ground floor..."',
          stepApplied: 3,
          insight:
            'She chose Apartment 1 (ground floor, open plan). This will be a question. She likes open spaces and flexibility.',
        },
        {
          label: 'Feeling of the Manager',
          audioSnippet: '"Well, you\'re talking to the right person." (said dismissively)',
          stepApplied: 4,
          insight:
            'The property manager sounds bored, indifferent, dismissive. CELPIP could ask about his attitude/tone.',
        },
        {
          label: 'Future Action',
          audioSnippet:
            '"I can show you apartment one around 3pm if you like." "I\'ll go for coffee and come back."',
          stepApplied: 7,
          insight:
            'Future = they\'ll view the apartment later. You don\'t need to remember "3pm" — just that they\'ll meet again to see it.',
        },
      ],
    },
  },

  // ── Task 4: Listening to a News Item ──────────────────────────────────────
  {
    taskNumber: 4,
    title: 'Listening to a News Item',
    icon: '📰',
    format: 'One speaker telling a news story (like a radio/TV news report)',
    description:
      'A single speaker narrates a news story. Identify the story, the people involved, and the plot — who did what, when, and why.',
    questionType: 'read-and-answer',
    questionCount: 5,
    difficulty: 'moderate',
    hasVideo: false,
    hasPicture: false,
    noteStrategy: 'optional-notes',
    detailsImportant: true,
    steps: [
      {
        step: 1,
        title: 'What Is the Story About?',
        description:
          'Immediately understand the topic of the news item. This is always Question 1 or 2.',
        isUniversal: false,
        tips: [
          'The story is usually summarized in the first sentence',
          'Example: "17-year-old Shauna Bergman made over $1,000 this weekend because of her love of thrift store shopping"',
          'Get the gist: WHO did WHAT and WHY',
          'This is always an easy question if you pay attention to the opening',
        ],
      },
      {
        step: 2,
        title: 'Names Are Important Now!',
        description:
          'Unlike Tasks 1-3, names matter starting from Task 4. Know WHO is part of the story and their role.',
        isUniversal: false,
        tips: [
          'You don\'t need to SPELL names — just recognize them when you hear them again',
          'Track each person\'s ROLE: Shauna (girl who found rings), her mother (suggested value), the jeweler (confirmed)',
          'Questions will reference people by name: "What did Shauna\'s mother suggest?"',
          'Usually 2-3 characters in the story',
        ],
      },
      {
        step: 3,
        title: 'Understand the Plot',
        description:
          'Follow the sequence: What happened → What was the result → What happened next. The plot is the backbone of all questions.',
        isUniversal: false,
        tips: [
          'Think of it as a mini-movie: beginning → middle → end',
          'Each plot point can be a question',
          'Example: Found rings → mother said they might be valuable → tested them → jeweler confirmed → decided to travel',
          'Look for QUOTES — if the news item quotes someone, there WILL be a question about that quote',
          'The speaker is just narrating — they don\'t have a personal opinion (usually)',
        ],
      },
      ...universalSteps,
    ],
    keyInsights: [
      'Task 4 is a NEWS ITEM — one person speaking, like radio/TV news',
      'No video, no picture — just audio narration',
      'Names become important starting here — know who said/did what',
      'You read the questions (they\'re not spoken) — "read and answer"',
      'Emphasized details = guaranteed questions (e.g., how to test amber = 10+ seconds of explanation)',
      'Future outcomes use DIFFERENT words in the answer: "trip to Peru" becomes "travel abroad"',
      'Don\'t panic about hard vocabulary — CELPIP doesn\'t require you to know specific words',
      'If they say "amber" and you don\'t know it, that\'s fine — understand it\'s a "valuable stone"',
    ],
    practiceExample: {
      title: 'The Amber Rings',
      context: 'A news story about a teenager who found valuable rings at a thrift store',
      walkthrough: [
        {
          label: 'Story Summary',
          audioSnippet:
            '"17-year-old Shauna Bergman made over $1,000 this weekend because of her love of thrift store shopping."',
          stepApplied: 1,
          insight:
            'Opening sentence = story summary. She made money from thrift store shopping. Easy question.',
        },
        {
          label: 'Key Character',
          audioSnippet:
            '"Her mother suggested the stones might not actually be glass, but amber."',
          stepApplied: 2,
          insight:
            'Mother is a key character — she suggested the rings could be valuable. Question: "How did she learn the rings could be valuable?" → mother.',
        },
        {
          label: 'Emphasized Detail',
          audioSnippet:
            '"If real amber is rubbed vigorously on fabric, it becomes electrostatically charged and will visibly attract dust particles."',
          stepApplied: 6,
          insight:
            'CELPIP spent 10+ seconds on this detail = guaranteed question. You just need to understand: rub it → attracts dust = real amber.',
        },
        {
          label: 'New Character',
          audioSnippet: '"A local jeweler confirmed her conclusion."',
          stepApplied: 2,
          insight:
            'Third character: the jeweler. His role = confirmed the rings are real amber. Expect a question about him.',
        },
        {
          label: 'Future Outcome',
          audioSnippet:
            '"Shauna decided to use the proceeds to finance a trip to Peru."',
          stepApplied: 7,
          insight:
            'Future question! But the answer won\'t say "trip to Peru" — it says "sell the rings and travel abroad." Same idea, different words.',
        },
      ],
    },
  },

  // ── Task 5: Listening to a Discussion ─────────────────────────────────────
  {
    taskNumber: 5,
    title: 'Listening to a Discussion',
    icon: '💬',
    format: 'Video of 3 people discussing a workplace situation',
    description:
      'Three people discuss a workplace issue. You WATCH a video and TAKE NOTES using a table. Track who says what, their opinions, and the group\'s decision.',
    questionType: 'read-and-answer',
    questionCount: 8,
    difficulty: 'harder',
    hasVideo: true,
    hasPicture: false,
    noteStrategy: 'table-notes',
    detailsImportant: true,
    steps: [
      {
        step: 1,
        title: 'Identify the Problem/Situation',
        description:
          'There is ALWAYS a problem or situation being discussed. Usually Question 1.',
        isUniversal: false,
        tips: [
          '99.9% of the time it\'s about a workplace situation',
          'The problem might not be obvious at first — give it 30-60 seconds',
          '"I wanted to run something by you" → the real topic is coming',
          'Example: Favoritism in the workplace was the core issue, not raises or conferences',
          'Question 1 is almost always: "Why are they having this discussion?"',
        ],
      },
      {
        step: 2,
        title: 'Names or Characteristics',
        description:
          'Immediately determine if they give you NAMES or if you need to identify people by CHARACTERISTICS.',
        isUniversal: false,
        tips: [
          'Two modes: NAMES given (Nick, Ron, Claudia) or NO NAMES (use visual characteristics)',
          'If names are given, write them immediately in your table: Left | Middle | Right',
          'If no names, use characteristics: "red sweater", "bald", "the woman" (if only one)',
          'Find the unique person first (e.g., the only woman among two men)',
          'People stay in the SAME position in the video — left is always left',
        ],
      },
      {
        step: 3,
        title: 'Track Opinions & Decisions',
        description:
          'Each person will have an opinion. Track them in your table. When they make a decision, CIRCLE it.',
        isUniversal: false,
        tips: [
          'Use your table: write each person\'s opinion under their column',
          'Use symbols: 😊 (agrees), 😐 (neutral), 😞 (disagrees) for quick tracking',
          'When someone doesn\'t comment on a topic, leave their cell blank',
          'DECISIONS are key — "So we\'ll just accept it" → circle this',
          'Follow the conversation as topics shift — new row in your table for each topic',
          'Example: Nick wants a union, Claudia disagrees, Ron already talked to HR → three different stances',
        ],
      },
      ...universalSteps,
    ],
    keyInsights: [
      'This is a VIDEO — you see the three people on screen',
      'TAKE NOTES using a table — this is the first task where notes are strongly recommended',
      'The conversation usually follows: Problem → Discussion → Proposed solutions → Decision',
      'Track who AGREES and who DISAGREES with each proposal',
      'Feeling questions are common: "Why does Claudia volunteer?" → because it makes her happy',
      'Future questions: "What will they do after this meeting?" → they\'ll accept the situation',
      'Don\'t try to write everything — use SHORT symbols and abbreviations',
      'If you miss something, keep going — don\'t dwell on missed info',
    ],
    practiceExample: {
      title: 'Workplace Favoritism',
      context: 'Three employees (Nick, Ron, Claudia) discuss favoritism at work',
      walkthrough: [
        {
          label: 'Names Given',
          audioSnippet: '"This is Nick, Ron, and Claudia."',
          stepApplied: 2,
          insight:
            'Names are given → write them in your table immediately: Nick | Ron | Claudia. Map to their screen positions.',
        },
        {
          label: 'Problem Revealed',
          audioSnippet:
            '"I have been noticing a lot of favoritism lately."',
          stepApplied: 1,
          insight:
            'Nick reveals the problem: favoritism in the workplace. Write "favoritism" in Nick\'s column. Question 1 = this.',
        },
        {
          label: 'Opinions Emerge',
          audioSnippet:
            '"According to company policy, it\'s perfectly legal. Managers can select anyone they want."',
          stepApplied: 3,
          insight:
            'Ron is NEUTRAL — he acknowledges favoritism but says it\'s legal. Write 😐 or "legal/OK" in Ron\'s column.',
        },
        {
          label: 'Claudia\'s Frustration',
          audioSnippet:
            '"I\'m more qualified. I even asked if I could pay my own conference fees... She still refused."',
          stepApplied: 4,
          insight:
            'Claudia is frustrated/disappointed. She agrees with Nick. Write 😞 + "no conference" in her column.',
        },
        {
          label: 'Decision & Future',
          audioSnippet:
            '"I guess we just have to deal with favoritism then... focus our passion outside the workplace."',
          stepApplied: 7,
          insight:
            'Future outcome: they accept it and focus energy outside work. CIRCLE this in your notes. Guaranteed question.',
        },
      ],
    },
  },

  // ── Task 6: Listening to Viewpoints ───────────────────────────────────────
  {
    taskNumber: 6,
    title: 'Listening to Viewpoints',
    icon: '🎙️',
    format: 'One speaker presenting different viewpoints on a topic',
    description:
      'The HARDEST task. A single speaker presents multiple viewpoints on an issue. Track who thinks what — names or groups (students, employers, etc.).',
    questionType: 'read-and-answer',
    questionCount: 6,
    difficulty: 'harder',
    hasVideo: false,
    hasPicture: false,
    noteStrategy: 'table-notes',
    detailsImportant: true,
    steps: [
      {
        step: 1,
        title: 'What Is the Main Topic?',
        description:
          'Identify the central issue being discussed. This is always an early question.',
        isUniversal: false,
        tips: [
          'Usually stated clearly in the first 1-2 sentences',
          'Example: "The humanities are a group of academic disciplines..." → topic = value of humanities degrees',
          'The topic might be framed as a question: "Does this mean students shouldn\'t study humanities?"',
          'Easy question if you catch the opening — don\'t miss it',
        ],
      },
      {
        step: 2,
        title: 'Names or Groups — Who Says What?',
        description:
          'Determine if the speaker uses individual NAMES or GROUP labels (students, employers, teachers). Track each viewpoint.',
        isUniversal: false,
        tips: [
          'Two modes: NAMES (Lucas, Irina) → usually 3 named people with opinions',
          'Or GROUPS (students, employers, workers) → track group opinions',
          'If you hear names early → expect named viewpoints, speaker has NO opinion',
          'If NO names after 30 seconds → expect groups, speaker HAS an opinion',
          'Use a table just like Task 5: write each person/group and their stance',
          'Example: Students want return on investment | Employers want critical thinking but compliance',
        ],
      },
      {
        step: 3,
        title: 'Understand the Speaker\'s Position',
        description:
          'When no names are used, the SPEAKER has an opinion. Determine if they\'re for or against the main issue.',
        isUniversal: false,
        tips: [
          'Listen for bias: "Perhaps it is the employers who need the humanities courses" → speaker favors humanities',
          'The speaker\'s opinion is often revealed at the END of the listening',
          'Question: "What does the speaker think?" → identify their lean',
          'If names ARE used, the speaker is just narrating — no personal opinion',
          'This is a common question — get it right by tracking the speaker\'s tone throughout',
        ],
      },
      ...universalSteps,
    ],
    keyInsights: [
      'This is the HARDEST task — expect difficult vocabulary and complex ideas',
      'Don\'t panic! The questions are often simpler than the content',
      'Vocabulary you don\'t know → don\'t worry! Understand the IDEAS',
      '"Amber", "fossilized resin", "electrostatically charged" — you don\'t need to know these words',
      'CELPIP uses hard vocabulary to SCARE you — the answers use simpler language',
      'Take notes in a table format — track each person/group\'s viewpoint',
      'Strategy: Get Tasks 1-3 nearly perfect → you can afford mistakes here',
      'If going for 7-8: focus ALL energy on Tasks 1-3, accept some Task 6 losses',
      'If going for 9-10: still prioritize Tasks 1-3, but practice Task 6 technique',
    ],
    practiceExample: {
      title: 'Humanities Degrees',
      context: 'A presentation about whether humanities degrees are valuable in Canada',
      walkthrough: [
        {
          label: 'Topic Identified',
          audioSnippet:
            '"30% of university graduates with a humanities degree are overqualified for the jobs they hold."',
          stepApplied: 1,
          insight:
            'Topic = the value of humanities degrees. Are they worth studying? Easy Question 1.',
        },
        {
          label: 'No Names → Groups',
          audioSnippet:
            '"Students, along with their tuition-fee-paying parents, expect to receive a reasonable return on their investment."',
          stepApplied: 2,
          insight:
            'No individual names → tracking GROUPS. Students expect financial return. Write "students: want $$" in your table.',
        },
        {
          label: 'Employers\' Contradiction',
          audioSnippet:
            '"Employers say they want critical thinking skills... but workers say employers want them to think critically only about certain things."',
          stepApplied: 2,
          insight:
            'Employers want critical thinking BUT also compliance. This contradiction = guaranteed question. Track both sides.',
        },
        {
          label: 'Speaker\'s Bias',
          audioSnippet:
            '"Perhaps, in the end, it is the employers who need the humanities courses."',
          stepApplied: 3,
          insight:
            'The speaker clearly favors humanities. Question: "What does the speaker think?" → supports critical thinking/humanities.',
        },
        {
          label: 'Emphasis on Critical Thinking',
          audioSnippet:
            '"Critical thinking" is mentioned 5+ times throughout the listening.',
          stepApplied: 6,
          insight:
            'CELPIP gave heavy emphasis to "critical thinking" — this concept will definitely appear in questions. Track who wants it and how.',
        },
      ],
    },
  },
];

// ─── Note-Taking Guide (Tasks 5 & 6) ─────────────────────────────────────────

export const noteTakingGuide: NoteTakingGuide = {
  title: 'How to Take Notes (Tasks 5 & 6)',
  description:
    'For Tasks 5 and 6, taking notes is strongly recommended. Use a simple table on your scratch paper to track who says what.',
  tableSetup:
    'Draw a 3-column table matching the screen positions: Left | Middle | Right. Write names or characteristics at the top.',
  identifyPeople: [
    'If names are given → write them immediately (Nick | Ron | Claudia)',
    'If no names → find the unique person first (the only woman, or distinctive clothing)',
    'Write characteristics: "red sweater", "bald", "glasses"',
    'People NEVER change position on screen — left stays left',
  ],
  symbols: [
    { symbol: '😊 or +', meaning: 'Agrees / positive about something' },
    { symbol: '😐', meaning: 'Neutral / doesn\'t have strong opinion' },
    { symbol: '😞 or -', meaning: 'Disagrees / negative about something' },
    { symbol: '$ or $$', meaning: 'Expensive' },
    { symbol: '¢', meaning: 'Cheap / affordable' },
    { symbol: '>', meaning: 'Bigger / more / better' },
    { symbol: '<', meaning: 'Smaller / less / worse' },
    { symbol: '=', meaning: 'Equal / same' },
    { symbol: '⭕', meaning: 'Circle = final decision (very important!)' },
    { symbol: '→', meaning: 'Future action / what they\'ll do next' },
  ],
  rules: [
    'Use SHORT abbreviations — "maint" for maintenance, "exp" for expensive',
    'Create your own shorthand — whatever helps YOU remember',
    'Don\'t write complete sentences — just keywords',
    'One new row per new topic discussed',
    'CIRCLE any final decisions — these are guaranteed questions',
    'Write "→" for future actions — also guaranteed questions',
    'If someone says nothing about a topic, leave their cell blank',
    'Don\'t try to capture everything — focus on opinions and decisions',
  ],
};

// ─── Scoring Strategy ─────────────────────────────────────────────────────────

export const scoringStrategy: ScoringStrategy = {
  title: 'Scoring Strategy — Where to Focus Your Energy',
  description:
    'The test gets harder as you advance. Tasks 1-3 are easier — master them first. Your strategy depends on your target score.',
  tips: [
    'Tasks 1-3 are EASIER and have more questions (8+5+6 = 19 questions)',
    'Tasks 4-6 are HARDER and have fewer questions (5+8+6 = 19 questions)',
    'Getting 33/38 correct = score of 8-9. Getting 34+ = guaranteed 9+',
    'Even experts make 1-2 mistakes — perfection isn\'t the goal',
    'The TRICK: know where you CAN make mistakes and where you CANNOT',

    '📎 For score 7-8: Focus ALL energy on Tasks 1-3. Accept mistakes in Tasks 4-6.',
    '📎 For score 9-10: Master Tasks 1-3 first, then improve Tasks 4-6.',
    '📎 For score 10+: Need near-perfect Tasks 1-3 AND good Tasks 4-6.',

    'Question types: Tasks 1-3 = listen to question + answer | Tasks 4-6 = read question + answer',
    'All questions are ALWAYS multiple choice — use elimination when unsure',
    'If stuck between 2 options, that\'s a 50/50 — much better than 25%',
    'Trust your first instinct — don\'t overthink after eliminating wrong answers',
  ],
};

// ─── Test Overview ────────────────────────────────────────────────────────────

export const testOverview = {
  totalParts: 6,
  totalQuestions: 38,
  duration: '~47-55 minutes',
  questionTypes: 2, // listen-and-answer (Tasks 1-3) & read-and-answer (Tasks 4-6)
  allMultipleChoice: true,
  noReplay: true,
  noPause: true,
  scoreTable: [
    { score: 7, correctMin: 23, correctMax: 26 },
    { score: 8, correctMin: 27, correctMax: 30 },
    { score: 9, correctMin: 31, correctMax: 33 },
    { score: 10, correctMin: 34, correctMax: 35 },
    { score: 11, correctMin: 36, correctMax: 37 },
    { score: 12, correctMin: 38, correctMax: 38 },
  ],
  keyScreens: [
    {
      name: 'Context Screen',
      description:
        'Shows a picture and tells you what you\'ll listen to. READ IT — it lets you predict the topic before the audio starts.',
      importance: 'critical',
    },
    {
      name: 'Listening Screen',
      description:
        'The audio plays here. No replay, no pause on test day. Practice mode has these controls, real test does NOT.',
      importance: 'critical',
    },
  ],
  goldenRules: [
    'The audio plays ONCE — no replay, no pause on test day',
    'Use the context screen to PREDICT the topic before listening',
    'You DON\'T need to remember every detail — just follow the 7 steps',
    'Understanding > memorizing — grasp the idea, not the exact words',
    'Elimination is your best tool — remove wrong answers to improve odds',
    'Tasks 1-3: Names and specific details are NOT important',
    'Tasks 4-6: Specific details ARE important — pay attention!',
    'Tasks 1-3: DON\'T take notes — just follow the framework',
    'Tasks 5-6: TAKE notes using a table — it\'s essential',
    'Follow the 7 Secret Steps every single time — they ALWAYS work',
  ],
};

// ─── Helper Functions ─────────────────────────────────────────────────────────

export function getTaskTechnique(taskNumber: number): TaskTechnique | undefined {
  return taskTechniques.find((t) => t.taskNumber === taskNumber);
}

export function getStepsForTask(taskNumber: number): SecretStep[] {
  const task = getTaskTechnique(taskNumber);
  return task?.steps ?? [];
}

export function getUniversalSteps(): SecretStep[] {
  return universalSteps;
}

export function getTaskSpecificSteps(taskNumber: number): SecretStep[] {
  const task = getTaskTechnique(taskNumber);
  if (!task) return [];
  return task.steps.filter((s) => !s.isUniversal);
}
