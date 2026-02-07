// Reading Module Content

export const readingParts = [
  {
    id: 'correspondence',
    part: 1,
    title: 'Reading Correspondence',
    questions: 11,
    time: '11 minutes',
    icon: '📧',
    description: 'Read and understand emails, letters, and messages',
    skills: [
      'Identify main ideas and supporting details',
      'Understand tone and purpose',
      'Make inferences from context',
      'Recognize formal vs informal language'
    ],
    tips: [
      'Read the questions first to know what to look for',
      'Pay attention to who is writing and why',
      'Look for keywords that match the questions',
      'Watch for signal words (however, therefore, in addition)'
    ]
  },
  {
    id: 'diagram',
    part: 2,
    title: 'Reading to Apply a Diagram',
    questions: 8,
    time: '8 minutes',
    icon: '📊',
    description: 'Match information between text and visual diagrams',
    skills: [
      'Connect written information to visual elements',
      'Understand spatial relationships',
      'Follow step-by-step instructions',
      'Interpret maps, charts, and diagrams'
    ],
    tips: [
      'Study the diagram carefully before reading',
      'Note labels, arrows, and numbered sections',
      'Match specific details between text and image',
      'Eliminate obviously wrong answers first'
    ]
  },
  {
    id: 'information',
    part: 3,
    title: 'Reading for Information',
    questions: 9,
    time: '9 minutes',
    icon: '📰',
    description: 'Extract specific information from longer texts',
    skills: [
      'Scan for specific information quickly',
      'Distinguish facts from opinions',
      'Understand complex sentence structures',
      'Identify cause and effect relationships'
    ],
    tips: [
      'Skim headings and first sentences of paragraphs',
      'Use keywords from questions to locate answers',
      'Be careful with "NOT" or "EXCEPT" questions',
      'Check if the answer is explicitly stated or implied'
    ]
  },
  {
    id: 'viewpoints',
    part: 4,
    title: 'Reading for Viewpoints',
    questions: 10,
    time: '10 minutes',
    icon: '💭',
    description: 'Compare and contrast different opinions and perspectives',
    skills: [
      'Identify different viewpoints on a topic',
      'Recognize agreement and disagreement',
      'Understand attitudes and opinions',
      'Compare multiple perspectives'
    ],
    tips: [
      'Note which person says what',
      'Look for opinion words (I think, I believe, in my view)',
      'Pay attention to contrasting connectors (but, however, on the other hand)',
      'Track who agrees with whom on each point'
    ]
  }
];

export const readingStrategies = {
  before: {
    title: 'Before Reading',
    icon: '🎯',
    strategies: [
      {
        name: 'Preview Questions First',
        description: 'Read all questions before the passage to know what information to look for.',
        example: 'If a question asks about "the main reason for the delay," you\'ll focus on finding causes.'
      },
      {
        name: 'Scan Structure',
        description: 'Quickly look at headings, paragraphs, and any visual elements.',
        example: 'Notice if the text has sections, bullet points, or a specific format.'
      },
      {
        name: 'Predict Content',
        description: 'Based on the title and format, predict what the text might discuss.',
        example: 'An email with "Re: Meeting Tomorrow" will likely discuss scheduling.'
      }
    ]
  },
  during: {
    title: 'While Reading',
    icon: '📖',
    strategies: [
      {
        name: 'Active Reading',
        description: 'Mentally note key information as you read. Don\'t just passively scan.',
        example: 'When you see a date, number, or name, pause and register it.'
      },
      {
        name: 'Context Clues',
        description: 'Use surrounding words to understand unfamiliar vocabulary.',
        example: '"The fastidious editor checked every comma" — context suggests careful/detailed.'
      },
      {
        name: 'Signal Words',
        description: 'Watch for words that show relationships between ideas.',
        example: 'However = contrast, Therefore = result, Furthermore = addition'
      }
    ]
  },
  after: {
    title: 'Answering Questions',
    icon: '✅',
    strategies: [
      {
        name: 'Eliminate Wrong Answers',
        description: 'Cross out answers that are clearly incorrect to improve your odds.',
        example: 'If a choice contradicts the text directly, eliminate it.'
      },
      {
        name: 'Find Text Evidence',
        description: 'Locate the exact part of the text that supports your answer.',
        example: 'The answer should be based on the text, not your own knowledge.'
      },
      {
        name: 'Beware of Traps',
        description: 'Watch for answers that are partially true or use exact words out of context.',
        example: 'An answer might use words from the text but change the meaning.'
      }
    ]
  }
};

export const vocabularyCategories = [
  {
    id: 'academic',
    title: 'Academic Words',
    icon: '🎓',
    description: 'Common words in formal and academic texts',
    words: [
      { word: 'analyze', definition: 'examine in detail', example: 'We need to analyze the data carefully.' },
      { word: 'conclude', definition: 'reach a decision or opinion', example: 'The study concluded that exercise improves memory.' },
      { word: 'significant', definition: 'important, meaningful', example: 'There was a significant increase in sales.' },
      { word: 'evidence', definition: 'proof, facts that support a claim', example: 'The evidence suggests a different conclusion.' },
      { word: 'factor', definition: 'element that contributes to a result', example: 'Cost was a major factor in the decision.' },
      { word: 'maintain', definition: 'continue, keep up', example: 'She maintains that the policy is unfair.' },
      { word: 'obtain', definition: 'get, acquire', example: 'You can obtain a permit at city hall.' },
      { word: 'indicate', definition: 'show, point to', example: 'The results indicate a positive trend.' }
    ]
  },
  {
    id: 'workplace',
    title: 'Workplace Words',
    icon: '💼',
    description: 'Vocabulary for professional correspondence',
    words: [
      { word: 'deadline', definition: 'final date for completing something', example: 'The deadline for submissions is Friday.' },
      { word: 'agenda', definition: 'list of items to be discussed', example: 'The meeting agenda includes budget review.' },
      { word: 'implement', definition: 'put into action', example: 'We will implement the new system next month.' },
      { word: 'postpone', definition: 'delay to a later time', example: 'They decided to postpone the event.' },
      { word: 'collaborate', definition: 'work together', example: 'The teams will collaborate on this project.' },
      { word: 'mandatory', definition: 'required, compulsory', example: 'Attendance at the training is mandatory.' },
      { word: 'prior', definition: 'before, earlier', example: 'Prior experience is preferred but not required.' },
      { word: 'regarding', definition: 'about, concerning', example: 'I\'m writing regarding your application.' }
    ]
  },
  {
    id: 'connectors',
    title: 'Connecting Words',
    icon: '🔗',
    description: 'Words that show relationships between ideas',
    words: [
      { word: 'however', definition: 'but, in contrast', example: 'The plan is good; however, it\'s expensive.' },
      { word: 'therefore', definition: 'as a result, consequently', example: 'The bridge is closed; therefore, we took another route.' },
      { word: 'furthermore', definition: 'in addition, also', example: 'The hotel is affordable. Furthermore, it\'s centrally located.' },
      { word: 'nevertheless', definition: 'despite that, still', example: 'It was raining; nevertheless, they continued the game.' },
      { word: 'whereas', definition: 'in contrast to', example: 'She prefers tea, whereas he drinks coffee.' },
      { word: 'consequently', definition: 'as a result', example: 'He missed the train and consequently arrived late.' },
      { word: 'meanwhile', definition: 'at the same time', example: 'She cooked dinner; meanwhile, he set the table.' },
      { word: 'otherwise', definition: 'if not, or else', example: 'Hurry up; otherwise, we\'ll miss the bus.' }
    ]
  },
  {
    id: 'opinion',
    title: 'Opinion & Viewpoint Words',
    icon: '💬',
    description: 'Words that express opinions and perspectives',
    words: [
      { word: 'believe', definition: 'think, have the opinion', example: 'I believe this is the right decision.' },
      { word: 'argue', definition: 'present reasons for or against', example: 'Some argue that remote work is more productive.' },
      { word: 'claim', definition: 'state as true', example: 'The company claims the product is safe.' },
      { word: 'suggest', definition: 'propose, recommend', example: 'The report suggests making changes.' },
      { word: 'oppose', definition: 'disagree with, be against', example: 'Many residents oppose the new development.' },
      { word: 'support', definition: 'agree with, back up', example: 'I fully support your proposal.' },
      { word: 'acknowledge', definition: 'recognize, admit', example: 'She acknowledged that mistakes were made.' },
      { word: 'prefer', definition: 'like better, choose', example: 'Most employees prefer flexible hours.' }
    ]
  }
];

export const readingTips = {
  timeManagement: {
    title: 'Time Management',
    icon: '⏱️',
    tips: [
      'Total reading section: ~55-60 minutes',
      'Don\'t spend more than 1 minute per question',
      'If stuck, mark and move on — come back later',
      'Leave 2-3 minutes to review flagged questions'
    ]
  },
  commonMistakes: {
    title: 'Common Mistakes to Avoid',
    icon: '⚠️',
    tips: [
      'Choosing an answer just because it uses words from the text',
      'Not reading all answer options before choosing',
      'Making assumptions not supported by the text',
      'Rushing through "easy" questions and missing details'
    ]
  },
  practiceHabits: {
    title: 'Building Reading Skills',
    icon: '📚',
    tips: [
      'Read English news articles daily (CBC, BBC, The Globe and Mail)',
      'Practice reading emails and workplace documents',
      'Time yourself when doing practice tests',
      'Keep a vocabulary notebook for new words'
    ]
  }
};
