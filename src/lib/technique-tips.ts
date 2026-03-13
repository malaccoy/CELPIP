/**
 * Technique tips extracted from the professor's guides.
 * Used in Weakness Report for specific, actionable recommendations.
 */

export interface PartTip {
  partId: string;
  label: string;
  guideLink: string;
  technique: string;
  keyInsights: string[];
  commonMistakes: string[];
  quickTip: string;
}

export const readingTips: PartTip[] = [
  {
    partId: 'Part 1',
    label: 'Reading Correspondence',
    guideLink: '/guides',
    technique: 'Paragraph-by-Paragraph + Yes/No',
    keyInsights: [
      'Read paragraph by paragraph, then check if you can answer the current question',
      'Always identify WHO is writing and TO WHOM first',
      'CELPIP doesn\'t ask about tiny details — they ask about main ideas',
    ],
    commonMistakes: [
      'Skimming the entire text before answering — wastes time',
      'Opening questions first and hunting for answers',
      'Worrying about words you don\'t understand — focus on ideas',
    ],
    quickTip: 'Finish Part 1 in 5-6 minutes. Read paragraph → answer question → repeat.',
  },
  {
    partId: 'Part 2',
    label: 'Reading to Apply a Diagram',
    guideLink: '/guides',
    technique: 'Find the Pattern → Read and Match',
    keyInsights: [
      'Look at the diagram FIRST — identify what repeats (the pattern)',
      'Don\'t memorize the diagram — just understand the structure',
      'Last 3 questions are about the EMAIL, not the diagram',
    ],
    commonMistakes: [
      'Reading the diagram in detail — just understand the structure',
      'Confusing email questions with diagram questions',
    ],
    quickTip: 'Pattern recognition is key. Once you see the pattern, answers come fast. Can be done in 2-3 min.',
  },
  {
    partId: 'Part 3',
    label: 'Reading for Information',
    guideLink: '/guides',
    technique: 'Heading Focus + Elimination',
    keyInsights: [
      'Longer text but questions follow document structure',
      'Use headings/sections to locate relevant info quickly',
      'Eliminate obviously wrong answers first',
    ],
    commonMistakes: [
      'Reading the entire passage before looking at questions',
      'Spending too much time on difficult vocabulary',
    ],
    quickTip: 'Scan headings first. Match questions to sections. Eliminate wrong answers.',
  },
  {
    partId: 'Part 4',
    label: 'Reading for Viewpoints',
    guideLink: '/guides',
    technique: 'Compare & Contrast Authors',
    keyInsights: [
      'Two authors, same topic, different opinions',
      'Track who says what — don\'t mix up the authors',
      'Questions ask about agreement, disagreement, and attitude',
    ],
    commonMistakes: [
      'Confusing Author 1\'s opinion with Author 2\'s',
      'Not identifying the main argument of each author',
    ],
    quickTip: 'Label each author\'s position clearly. "Author 1 = FOR, Author 2 = AGAINST" — then answer.',
  },
];

export const listeningTips: PartTip[] = [
  {
    partId: 'Part 1',
    label: 'Problem Solving',
    guideLink: '/guides',
    technique: 'Problem → Options → Decision tracking',
    keyInsights: [
      'Two people discussing a problem with possible solutions',
      'Track the problem, each option mentioned, and what they decide',
      'Questions ask about the problem, suggestions, and final decision',
    ],
    commonMistakes: [
      'Not tracking which speaker suggests what',
      'Missing the final decision because it comes at the end',
    ],
    quickTip: 'Mental note: Problem = ?, Option A = ?, Option B = ?, Decision = ?',
  },
  {
    partId: 'Part 2',
    label: 'Daily Life Conversation',
    guideLink: '/guides',
    technique: 'Who-What-Where-When-Why',
    keyInsights: [
      'Casual conversation between two people',
      'Focus on concrete details: plans, times, places',
      'Tone and feelings matter — listen for how they feel',
    ],
    commonMistakes: [
      'Missing details because conversation sounds casual',
      'Not noting specific times or places mentioned',
    ],
    quickTip: 'Listen for specifics: dates, places, names. Casual tone doesn\'t mean easy questions.',
  },
  {
    partId: 'Part 3',
    label: 'Listening for Information',
    guideLink: '/guides',
    technique: 'Note-Taking on Key Facts',
    keyInsights: [
      'One speaker giving information (announcement, instructions)',
      'Key facts: who, what, when, where, how much',
      'Details matter — numbers, dates, conditions',
    ],
    commonMistakes: [
      'Trying to remember everything instead of key facts',
      'Missing conditional information ("only if...", "except...")',
    ],
    quickTip: 'Focus on facts, not opinions. Write mental notes: numbers, dates, exceptions.',
  },
  {
    partId: 'Part 4',
    label: 'News Item',
    guideLink: '/guides',
    technique: 'Headline → 5W1H',
    keyInsights: [
      'News report format: what happened, who, where, when, why',
      'Listen for the main event first, then supporting details',
      'Expert quotes or statistics are common question targets',
    ],
    commonMistakes: [
      'Getting lost in background context and missing the main event',
      'Not paying attention to quoted sources',
    ],
    quickTip: 'Catch the headline first (what happened?), then fill in details.',
  },
  {
    partId: 'Part 5',
    label: 'Discussion',
    guideLink: '/guides',
    technique: 'Speaker Position Tracking',
    keyInsights: [
      'Multiple speakers with different viewpoints',
      'Track each speaker\'s position clearly',
      'Questions ask who said what, who agrees/disagrees',
    ],
    commonMistakes: [
      'Mixing up which speaker holds which opinion',
      'Not tracking when a speaker changes their mind',
    ],
    quickTip: 'Label speakers: "Speaker A = for, Speaker B = against." Update if they shift.',
  },
  {
    partId: 'Part 6',
    label: 'Viewpoints',
    guideLink: '/guides',
    technique: 'Opinion vs. Fact Separation',
    keyInsights: [
      'Similar to Part 5 but more nuanced opinions',
      'Distinguish between facts stated and personal opinions',
      'Questions test understanding of attitude and reasoning',
    ],
    commonMistakes: [
      'Treating an opinion as a fact or vice versa',
      'Not catching subtle language: "I think", "perhaps", "might"',
    ],
    quickTip: 'Listen for opinion markers: "I believe", "It seems to me", "In my view".',
  },
];

export const speakingTips: PartTip[] = [
  {
    partId: 'Task 1',
    label: 'Giving Advice',
    guideLink: '/guides',
    technique: 'Situation → 3 Suggestions → Closing',
    keyInsights: [
      'Acknowledge the situation, give 3 clear pieces of advice',
      'Use "I would suggest...", "You might want to...", "Have you considered..."',
      'End with encouragement: "I\'m sure things will work out"',
    ],
    commonMistakes: [
      'Giving only 1-2 suggestions instead of 3',
      'Not using the full 90 seconds',
    ],
    quickTip: 'Structure: "I understand your situation. First, I suggest... Second... Third... I\'m confident..." Use ALL 90s.',
  },
  {
    partId: 'Task 5',
    label: 'Comparing and Persuading',
    guideLink: '/guides',
    technique: 'Choose → Compare → Persuade',
    keyInsights: [
      'Pick one option immediately — don\'t waste time deciding',
      'Give 2 reasons for your choice, 1 reason against the other',
      'End with a persuasive closing: "That\'s why I strongly recommend..."',
    ],
    commonMistakes: [
      'Spending too much prep time deciding which option',
      'Giving balanced arguments instead of clearly persuading',
    ],
    quickTip: 'Pick fast, persuade hard. "Option A is clearly better because..." — commit and sell it.',
  },
  {
    partId: 'Task 7',
    label: 'Expressing Opinions',
    guideLink: '/guides',
    technique: 'State → 3 Reasons → Restate',
    keyInsights: [
      'State your opinion clearly in the first sentence',
      'Give 3 distinct reasons with examples',
      'Restate your opinion at the end for emphasis',
    ],
    commonMistakes: [
      'Being vague about your position',
      'Repeating the same reason in different words',
    ],
    quickTip: '"I strongly agree/disagree because: First... Second... Third... In conclusion, I firmly believe..."',
  },
];

export const writingTips: PartTip[] = [
  {
    partId: 'Task 1',
    label: 'Writing an Email',
    guideLink: '/writing/guide',
    technique: 'CSF Framework (Context-Structure-Finish)',
    keyInsights: [
      'Always start with "Dear [Name]" — never skip the greeting',
      'First sentence = who you are + why you\'re writing',
      'Use connectors: First, Second, Third, Finally',
      'End with a clear request + "Regards, [Name]"',
    ],
    commonMistakes: [
      'Forgetting the greeting or sign-off (automatic score penalty)',
      'Writing less than 150 words',
      'Using contractions in formal emails',
    ],
    quickTip: 'Template: Dear X → Purpose → Point 1 → Point 2 → Point 3 → Request → Regards. Hit 150-200 words.',
  },
  {
    partId: 'Task 2',
    label: 'Survey Response',
    guideLink: '/writing/guide',
    technique: 'PRE Structure (Point-Reason-Example)',
    keyInsights: [
      'State your opinion in the first sentence — don\'t be vague',
      'Use PRE for each argument: Point → Reason → Example',
      'Never say "Option A" — refer to the topic directly',
      '2 well-developed arguments beat 3 weak ones',
    ],
    commonMistakes: [
      'Saying "Option A" or "Option B" instead of the actual topic',
      'No conclusion paragraph',
      'Rhetorical questions as arguments',
    ],
    quickTip: '"I believe [X] is better. First, [reason + example]. Second, [reason + example]. In conclusion..."',
  },
];

/** Get tips for a specific skill and part */
export function getTipsForPart(skill: string, partId?: string): PartTip | null {
  const map: Record<string, PartTip[]> = {
    reading: readingTips,
    listening: listeningTips,
    speaking: speakingTips,
    writing: writingTips,
  };
  const tips = map[skill];
  if (!tips) return null;
  if (partId) return tips.find(t => t.partId === partId) || tips[0];
  return tips[0];
}

/** Get all tips for a skill */
export function getAllTipsForSkill(skill: string): PartTip[] {
  const map: Record<string, PartTip[]> = {
    reading: readingTips,
    listening: listeningTips,
    speaking: speakingTips,
    writing: writingTips,
  };
  return map[skill] || [];
}
