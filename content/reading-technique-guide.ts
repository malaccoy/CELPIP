// Reading Technique Guide — CELPIP Coach
// Structured from teaching material (Tasks 1-4 strategies)

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TaskTechnique {
  id: string;
  taskNumber: number;
  title: string;
  time: string;
  questions: number;
  description: string;
  detailsMatter: boolean; // whether small details matter for this task
  parts: TaskPart[];
  keyInsights: string[];
  commonMistakes: string[];
}

export interface TaskPart {
  partNumber: number;
  title: string;
  technique: string;
  steps: string[];
  tips: string[];
}

export interface TruthTrio {
  reasons: TruthReason[];
}

export interface TruthReason {
  number: number;
  title: string;
  description: string;
  solution: string;
}

export interface ScoreStrategy {
  targetScore: number;
  label: string;
  totalQuestions: number;
  correctNeeded: number;
  mistakesAllowed: number;
  focus: string;
  tip: string;
}

export interface GoldenRule {
  text: string;
  emphasis: boolean;
}

export interface ReadingOverview {
  totalTasks: number;
  totalQuestions: number;
  totalTime: string;
  goldenRules: GoldenRule[];
  scoreTable: ScoreEntry[];
}

export interface ScoreEntry {
  score: number;
  correctMin: number;
  correctMax: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const readingOverview: ReadingOverview = {
  totalTasks: 4,
  totalQuestions: 38,
  totalTime: '~38 minutes',
  goldenRules: [
    { text: 'Never select what you did not read', emphasis: true },
    { text: 'Only select what you actually found in the text', emphasis: true },
    { text: 'Small details (exact dates, numbers, statistics) are rarely the answer', emphasis: false },
    { text: 'Focus on main ideas, not complicated vocabulary', emphasis: false },
    { text: 'Tasks 1-2 are easier — perfect them first for maximum score impact', emphasis: true },
    { text: 'Never click "Next" early — use all your time, especially before Speaking', emphasis: false },
    { text: 'If stuck, eliminate wrong answers first — there is always one easy to remove', emphasis: false },
    { text: 'Statistics are a guide, but trust your reading ability over patterns', emphasis: false },
  ],
  scoreTable: [
    { score: 7, correctMin: 23, correctMax: 26 },
    { score: 8, correctMin: 27, correctMax: 30 },
    { score: 9, correctMin: 31, correctMax: 33 },
    { score: 10, correctMin: 34, correctMax: 35 },
    { score: 11, correctMin: 36, correctMax: 37 },
    { score: 12, correctMin: 38, correctMax: 38 },
  ],
};

export const taskTechniques: TaskTechnique[] = [
  // ─── Task 1: Reading Correspondence ───────────────────────────
  {
    id: 'task-1',
    taskNumber: 1,
    title: 'Reading Correspondence',
    time: '11 minutes',
    questions: 11,
    description: 'Read an email or letter, then answer 6 interpretation questions (Part 1) and 5 questions about the reply (Part 2).',
    detailsMatter: false,
    parts: [
      {
        partNumber: 1,
        title: 'Interpretation (6 questions)',
        technique: 'Paragraph-by-Paragraph + Yes/No',
        steps: [
          'Step 1: Identify WHO is writing and TO WHOM (check beginning and end for names).',
          'Step 2: Read Paragraph 1 completely. Understand the main idea.',
          'Step 3: Open Question 1. Ask yourself: "Can I answer this from Paragraph 1?" — YES or NO.',
          'Step 4: If YES → select the answer. If NO → check Question 2 quickly.',
          'Step 5: If Questions 1 and 2 are both NO → move to Paragraph 2. Try Q1 again, then Q2, then Q3.',
          'Step 6: Continue this zigzag pattern: Paragraph → Questions → next Paragraph → Questions.',
          'Step 7: Multiple questions often share the same paragraph — always check the next question before moving on.',
        ],
        tips: [
          'Questions generally follow paragraph order, but NOT always',
          'If you cannot find Q1 and Q2 in Paragraph 1, Q3 is definitely not there either — move to Paragraph 2',
          'Never panic if a question is not where you expected — keep the paragraph flow going',
          'Focus on MAIN IDEAS, not small details like exact numbers or statistics',
        ],
      },
      {
        partNumber: 2,
        title: 'Reply Letter (5 questions)',
        technique: 'Open and Read',
        steps: [
          'Step 1: You have already read the original text — you know the context.',
          'Step 2: For each question, read the last line/sentence before the blank.',
          'Step 3: Most of the time, the last line gives you enough to answer.',
          'Step 4: If not enough, read a bit more backwards/forwards from that point.',
          'Step 5: Focus on understanding the MAIN IDEAS of the reply, not small details.',
        ],
        tips: [
          'Part 2 is the reply/answer to the original letter — understanding the first text helps enormously',
          'These questions tend to be easier than Part 1',
          'Start by reading as LITTLE as possible — only expand if needed',
          'Understanding context from Part 1 is your biggest advantage here',
        ],
      },
    ],
    keyInsights: [
      'The test WILL ask about names — always identify them first',
      'CELPIP does not ask about tiny details like "2-person tent" vs "3-person tent" — they ask "What was the gift?"',
      'Questions follow a rough order but can jump — the paragraph technique handles this',
      'You should finish Part 1 in about 5-6 minutes, leaving 5-6 for Part 2',
    ],
    commonMistakes: [
      'Skimming the entire text before answering — wastes time and you forget early paragraphs',
      'Opening questions first and hunting for answers — causes panic when Q1 is not in Paragraph 1',
      'Trying to use keywords to search the entire text — inefficient and error-prone',
      'Worrying about words you do not understand — focus on the idea, not every word',
    ],
  },

  // ─── Task 2: Reading to Apply a Diagram ───────────────────────
  {
    id: 'task-2',
    taskNumber: 2,
    title: 'Reading to Apply a Diagram',
    time: '9 minutes',
    questions: 8,
    description: 'Match information from a picture/diagram to an email. Part 1: complete the email. Part 2: comprehension questions.',
    detailsMatter: false,
    parts: [
      {
        partNumber: 1,
        title: 'Complete the Email (5 questions)',
        technique: 'Find the Pattern → Read and Match',
        steps: [
          'Step 1: Look at the picture/diagram FIRST. Identify the PATTERN — what repeats?',
          'Step 2: Common patterns: Title/Name → Information → Contact. Find what is consistent vs. what differs.',
          'Step 3: Notice what is NOT a pattern too (e.g., one item has a phone number, another only a website).',
          'Step 4: Read the email subject, TO, and FROM lines.',
          'Step 5: Start reading the email. The text will TELL you where to look in the diagram.',
          'Step 6: Match what the email says to the right section of the diagram. Select the answer.',
        ],
        tips: [
          'You do NOT need to memorize the entire diagram — just know the pattern',
          'The email guides you TO the diagram, not the other way around',
          'Check the email domain (@company.ca) — same domain = coworkers/same organization',
          'Many questions can be answered instantly once you understand the pattern',
        ],
      },
      {
        partNumber: 2,
        title: 'Comprehension (3 questions)',
        technique: 'Understanding Context',
        steps: [
          'Step 1: By now you have read the entire email — you already know the context.',
          'Step 2: These 3 questions are about the EMAIL, not the diagram.',
          'Step 3: Common question types: Relationship ("How do they know each other?"), Feeling ("How does the writer feel?").',
          'Step 4: For relationship questions — check the email addresses and how they address each other.',
          'Step 5: For feeling questions — identify if the person is POSITIVE or NEGATIVE. Then eliminate.',
        ],
        tips: [
          'Relationship and feeling questions are the most common in Part 2',
          'Identify positive vs. negative tone — this eliminates 2-3 options instantly',
          'These questions do not require going back to the diagram',
          'Read the full email during Part 1 so you are ready for Part 2 comprehension',
        ],
      },
    ],
    keyInsights: [
      'Pattern recognition is the #1 skill — once you see the pattern, answers come fast',
      'The examiners want to see if you can READ the email and FIND info in the diagram — not memorize the diagram',
      'Many students waste time reading the diagram in detail — just understand the structure',
      'This task can be completed in as little as 2-3 minutes with the right technique',
    ],
    commonMistakes: [
      'Reading the entire diagram in detail before the email — wastes time',
      'Trying to memorize every detail in the picture — unnecessary',
      'Not checking the Part 2 comprehension questions carefully (relationship/feeling traps)',
      'Ignoring the email addresses — they often reveal relationships',
    ],
  },

  // ─── Task 3: Reading for Information ──────────────────────────
  {
    id: 'task-3',
    taskNumber: 3,
    title: 'Reading for Information',
    time: '10 minutes',
    questions: 9,
    description: 'Read a longer informational text (like National Geographic) and match statements to paragraphs A-D, or select "Not Given" (E).',
    detailsMatter: false,
    parts: [
      {
        partNumber: 1,
        title: 'Paragraph Matching (9 questions)',
        technique: 'Paragraph-by-Paragraph + Yes/No/Red Flag',
        steps: [
          'Step 1: Read Paragraph A. Focus on MAIN IDEAS only — ignore dates, statistics, technical names.',
          'Step 2: Go through ALL 9 questions. For each, decide: YES (80%+ sure), NO (definitely not here), or RED FLAG (maybe — 50-60% sure).',
          'Step 3: Select YES answers immediately. Skip NO answers. Mark RED FLAG answers mentally.',
          'Step 4: Move to Paragraph B. Repeat the Yes/No/Red Flag process for remaining unanswered questions.',
          'Step 5: Continue through Paragraphs C and D.',
          'Step 6: After all paragraphs, any remaining unanswered questions → select E (Not Given).',
          'Step 7: For RED FLAG items you are unsure about — go back and re-read the relevant paragraph to confirm.',
        ],
        tips: [
          'RED FLAG = "I think it MIGHT be here" — go back to confirm only if you have time',
          'Not Given (E) also means FALSE — if a statement contradicts what you read, it is E',
          'There are usually NOT four of the same letter — use this statistic as a guide',
          'The text style is like National Geographic — historical/geographical, NOT scientific',
          'Always 4 paragraphs and 5 options (A, B, C, D, E)',
        ],
      },
    ],
    keyInsights: [
      'The test uses SYNONYMS — "brain functions" in the question might be "cognitive performance" in the text',
      'Dates are rarely the answer, but the IDEA of time matters (e.g., "5000 years ago" = "a very long time")',
      'Complex vocabulary is a distraction — always simplify to the main idea',
      '"Mid 20th century" = 1950s. Know how centuries work (20th century = 1901-2000)',
      'The word "entirely" or "always" or "never" in a question is a red flag — check if the text really says that',
    ],
    commonMistakes: [
      'Starting with the questions and trying to find answers — almost impossible due to synonyms',
      'Reading all paragraphs first — you will forget early paragraphs by the time you reach the questions',
      'Worrying about words like "moribund" or "antiseptic" — just understand the idea behind them',
      'Selecting an answer based on real-world knowledge instead of what the text says',
      'Not considering E (Not Given) — it is always one of the answers',
    ],
  },

  // ─── Task 4: Reading for Viewpoints ───────────────────────────
  {
    id: 'task-4',
    taskNumber: 4,
    title: 'Reading for Viewpoints',
    time: '10 minutes',
    questions: 10,
    description: 'Read an article with multiple opinions (like Facebook posts), then answer interpretation questions and complete a comment.',
    detailsMatter: true,
    parts: [
      {
        partNumber: 1,
        title: 'Interpretation (7 questions)',
        technique: 'Paragraph-by-Paragraph + Identify Feelings',
        steps: [
          'Step 1: Read Paragraph 1. Identify the person\'s NAME and their OPINION (positive, negative, or neutral).',
          'Step 2: Open Question 1. Can you answer it from Paragraph 1? YES → select. NO → move on.',
          'Step 3: Questions generally follow paragraph order — Q1 is usually in early paragraphs, Q5+ in later ones.',
          'Step 4: For each person, remember their FEELING: Are they positive, negative, or mixed?',
          'Step 5: Use feelings to quickly eliminate wrong answers (e.g., if someone is negative, they would not "support" something).',
          'Step 6: Multiple questions can be answered from one paragraph — always check the next question.',
          'Step 7: The "Best Title" question (if present) — SKIP it and do it last. It requires understanding the whole article.',
        ],
        tips: [
          'Names are your best friend — they instantly tell you if a question applies to the current paragraph',
          'Positive/Negative identification eliminates 2-3 options immediately',
          'The technique is essentially the same as Task 1 Part 1 — paragraph by paragraph',
          'Common question types: "Who would agree with...", "Compared to X, Y is more...", "What is the best title?"',
        ],
      },
      {
        partNumber: 2,
        title: 'Complete the Comment (3 questions)',
        technique: 'Context-Based Selection',
        steps: [
          'Step 1: You have already read the entire article — you know each person\'s viewpoint.',
          'Step 2: Read the comment. It is someone responding to the article.',
          'Step 3: Use what you know about each person to eliminate options that contradict the text.',
          'Step 4: For each blank, eliminate options you DID NOT read about. If it was not in the text, it is wrong.',
          'Step 5: If two options seem possible, pick the one most directly supported by the text.',
        ],
        tips: [
          'You should NOT need to go back and re-read — just remember each person\'s stance',
          'Eliminate by asking: "Did I read this?" — if not, it is wrong',
          'Feeling questions are common: "How does X feel?" → remember positive/negative',
          'Pay attention to qualifiers: "Ottawa\'s ban" — was there actually a ban? If not, eliminate.',
        ],
      },
    ],
    keyInsights: [
      'Think of it like people giving opinions on Facebook — each person has a clear stance',
      'Identifying POSITIVE vs NEGATIVE for each person is the single most important skill',
      'Names help you navigate instantly — "Is Nick Lorimer in this paragraph?"',
      'The "Best Title" question is usually harder — save it for last and use elimination',
      'Once you finish Part 1, you rarely need to re-read for Part 2 — the context is in your memory',
    ],
    commonMistakes: [
      'Looking for names in all paragraphs before reading — inefficient',
      'Not tracking who is positive and who is negative — leads to wrong answers',
      'Selecting "on the money" or "well-founded" without confirming the text supports it',
      'Forgetting that you can only select what you READ, not what you know from life',
      'Rushing the "Best Title" question without understanding the overall theme',
    ],
  },
];

// ─── Truth Trio ───────────────────────────────────────────────────────────────

export const truthTrio: TruthTrio = {
  reasons: [
    {
      number: 1,
      title: 'You do not understand the text',
      description: 'The vocabulary is too difficult and you cannot grasp what the paragraph is saying.',
      solution: 'Improve by gaining vocabulary. Read more English content daily (news, articles, emails). Even if you understand the main ideas, more vocabulary helps with tricky questions.',
    },
    {
      number: 2,
      title: 'You understand the text but not the question',
      description: 'You read the paragraph fine, but the question wording confuses you.',
      solution: 'Same solution: vocabulary. The questions use formal/academic language. Practice reading CELPIP-style questions specifically. Exposure to more English solves this.',
    },
    {
      number: 3,
      title: 'You understand both, but you misinterpret',
      description: 'You read the paragraph, understand the question, but select the wrong answer. This is the most common mistake — even native speakers fall here.',
      solution: 'Practice more interpretation. Do more practice tests and review your mistakes. The technique (paragraph-by-paragraph, elimination, main ideas) reduces misinterpretation dramatically.',
    },
  ],
};

// ─── Score Strategies ─────────────────────────────────────────────────────────

export const scoreStrategies: ScoreStrategy[] = [
  {
    targetScore: 7,
    label: 'Score 5-7',
    totalQuestions: 38,
    correctNeeded: 26,
    mistakesAllowed: 12,
    focus: 'Tasks 1 & 2 (19 questions)',
    tip: 'Focus 90% of your energy on Tasks 1 and 2. If you get 17/19 correct on Tasks 1-2, you only need 9 more from Tasks 3-4 (less than half). You can even afford 10 mistakes in the harder tasks.',
  },
  {
    targetScore: 9,
    label: 'Score 9+',
    totalQuestions: 38,
    correctNeeded: 32,
    mistakesAllowed: 6,
    focus: 'Perfect Tasks 1 & 2, then Tasks 3 & 4',
    tip: 'Aim for near-perfect on Tasks 1-2 (18-19/19). Keep all 6 allowed mistakes for Tasks 3-4. If you are stuck at 7-8, check your score tracker — many students think their problem is Task 3 when they are actually losing points in Tasks 1-2.',
  },
  {
    targetScore: 12,
    label: 'Score 10-12',
    totalQuestions: 38,
    correctNeeded: 36,
    mistakesAllowed: 2,
    focus: 'All tasks near-perfect',
    tip: 'For 10+, you need strong vocabulary and interpretation skills. Most questions are solvable with technique — only 4-5 per test are genuinely tricky. Solve the easy ones fast to save time for the hard ones.',
  },
];

// ─── Three Core Principles ────────────────────────────────────────────────────

export const corePrinciples = [
  {
    number: 1,
    title: 'Never Select What You Did Not Read',
    description: 'If you did not read information that supports an answer, do not select it. If you cannot find evidence, choose E (Not Given) or skip and move on. Never guess based on feelings.',
    icon: '🚫',
  },
  {
    number: 2,
    title: 'Only Select What You Actually Read',
    description: 'Watch for qualifiers like "entirely", "always", "never". If the text says "mostly natural", do not select "entirely natural". Your real-world knowledge does not count — only what the text says.',
    icon: '📖',
  },
  {
    number: 3,
    title: 'Trust Your Ability Over Statistics',
    description: 'There are usually not 4 of the same letter in a row — but if you truly believe the answer is correct, trust yourself over patterns. Statistics are a guide, not a rule.',
    icon: '🧠',
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

export function getTaskTechnique(taskNumber: number): TaskTechnique | undefined {
  return taskTechniques.find((t) => t.taskNumber === taskNumber);
}

export function getEasierTasks(): TaskTechnique[] {
  return taskTechniques.filter((t) => t.taskNumber <= 2);
}

export function getHarderTasks(): TaskTechnique[] {
  return taskTechniques.filter((t) => t.taskNumber >= 3);
}
