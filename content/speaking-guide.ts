// Speaking Module Content - CELPIP Speaking Test Structure

export interface SpeakingTask {
  id: string;
  part: number;
  title: string;
  prepTime: number; // seconds
  speakTime: number; // seconds
  icon: string;
  description: string;
  skills: string[];
  tips: string[];
  samplePrompts: SpeakingPrompt[];
}

export interface SpeakingPrompt {
  id: string;
  scenario: string;
  prompt: string;
  image?: string; // URL for image-based tasks
  bulletPoints?: string[];
  context?: string;
}

export const speakingTasks: SpeakingTask[] = [
  {
    id: 'giving-advice',
    part: 1,
    title: 'Giving Advice',
    prepTime: 90,
    speakTime: 60,
    icon: '💡',
    description: 'Give advice to a friend or family member about a situation',
    skills: [
      'Offer clear, practical suggestions',
      'Use appropriate language for giving advice',
      'Organize ideas logically',
      'Show empathy and understanding'
    ],
    tips: [
      'Start by acknowledging the situation',
      'Give 2-3 specific pieces of advice',
      'Use phrases like "I would suggest...", "Have you considered...", "You might want to..."',
      'End with encouragement or support'
    ],
    samplePrompts: [
      {
        id: 'advice-1',
        scenario: 'Your friend Sarah just got a new job offer in another city. She is unsure whether to accept it because it means leaving her family and friends behind.',
        prompt: 'Give Sarah advice about whether she should take the job.',
        bulletPoints: [
          'Consider the career opportunity',
          'Think about the distance from family',
          'Suggest ways to stay connected'
        ]
      },
      {
        id: 'advice-2',
        scenario: 'Your cousin Michael is thinking about going back to school to get a Master\'s degree, but he\'s worried about the cost and time commitment.',
        prompt: 'Advise Michael on whether he should pursue his Master\'s degree.',
        bulletPoints: [
          'Think about long-term career benefits',
          'Consider part-time study options',
          'Look into scholarships or employer support'
        ]
      },
      {
        id: 'advice-3',
        scenario: 'Your neighbor wants to adopt a pet but can\'t decide between getting a dog or a cat. They work full-time and live in a small apartment.',
        prompt: 'Help your neighbor decide which pet would be better for their situation.',
        bulletPoints: [
          'Consider their work schedule',
          'Think about the apartment size',
          'Discuss the care requirements of each pet'
        ]
      }
    ]
  },
  {
    id: 'personal-experience',
    part: 2,
    title: 'Talking About Personal Experience',
    prepTime: 60,
    speakTime: 60,
    icon: '📖',
    description: 'Talk about a personal experience related to a given topic',
    skills: [
      'Share a relevant personal story',
      'Describe events in chronological order',
      'Express feelings and reactions',
      'Connect the experience to the topic'
    ],
    tips: [
      'Choose a specific, memorable experience',
      'Include details: when, where, who, what happened',
      'Describe how you felt and what you learned',
      'Keep it focused and relevant to the prompt'
    ],
    samplePrompts: [
      {
        id: 'experience-1',
        scenario: 'Think about a time when you helped someone.',
        prompt: 'Describe a time when you helped someone and how it made you feel.',
        context: 'It could be helping a stranger, a friend, a family member, or a colleague.'
      },
      {
        id: 'experience-2',
        scenario: 'Think about a challenging situation you faced.',
        prompt: 'Tell me about a difficult situation you encountered and how you dealt with it.',
        context: 'This could be at work, school, or in your personal life.'
      },
      {
        id: 'experience-3',
        scenario: 'Think about a memorable trip or vacation.',
        prompt: 'Describe a trip that was special to you and explain why it was memorable.',
        context: 'It could be a recent trip or one from years ago.'
      }
    ]
  },
  {
    id: 'describing-scene',
    part: 3,
    title: 'Describing a Scene',
    prepTime: 30,
    speakTime: 60,
    icon: '🖼️',
    description: 'Describe what you see in a picture as clearly as possible',
    skills: [
      'Describe people, objects, and actions',
      'Use spatial vocabulary (in the foreground, on the left)',
      'Provide details about colors, sizes, expressions',
      'Organize description logically'
    ],
    tips: [
      'Start with the overall scene/setting',
      'Move systematically (left to right, or foreground to background)',
      'Describe people: appearance, clothing, actions, expressions',
      'Mention smaller details to fill time'
    ],
    samplePrompts: [
      {
        id: 'scene-1',
        scenario: 'You see a picture of a busy coffee shop.',
        prompt: 'Describe everything you see in this coffee shop scene.',
        context: 'Imagine a modern coffee shop with several customers, baristas working, and various items on display.'
      },
      {
        id: 'scene-2',
        scenario: 'You see a picture of a family having dinner together.',
        prompt: 'Describe the scene showing a family at dinner.',
        context: 'Imagine a dining room with family members of different ages sitting around a table with food.'
      },
      {
        id: 'scene-3',
        scenario: 'You see a picture of a farmers market.',
        prompt: 'Describe what is happening at this farmers market.',
        context: 'Imagine an outdoor market with vendors, fresh produce, and shoppers.'
      }
    ]
  },
  {
    id: 'making-predictions',
    part: 4,
    title: 'Making Predictions',
    prepTime: 30,
    speakTime: 60,
    icon: '🔮',
    description: 'Predict what will happen next based on a picture',
    skills: [
      'Analyze visual clues in the image',
      'Make logical predictions',
      'Use future tense appropriately',
      'Explain reasoning for predictions'
    ],
    tips: [
      'First, briefly describe what you see',
      'Make 2-3 predictions about what will happen',
      'Use phrases like "I think...", "It looks like...", "Probably..."',
      'Explain WHY you think this will happen'
    ],
    samplePrompts: [
      {
        id: 'predict-1',
        scenario: 'A student is looking stressed while studying with books and papers everywhere. An exam schedule is visible on the wall.',
        prompt: 'What do you think will happen to this student? What will they do next?',
        context: 'Consider their stress level, the upcoming exam, and possible outcomes.'
      },
      {
        id: 'predict-2',
        scenario: 'A couple is looking at a house with a "For Sale" sign. They are smiling and pointing at different features.',
        prompt: 'What do you think this couple will do? What might happen next?',
        context: 'Consider their expressions and body language.'
      },
      {
        id: 'predict-3',
        scenario: 'Dark clouds are gathering over a park where families are having picnics.',
        prompt: 'What do you predict will happen in this scene?',
        context: 'Consider the weather and how the people might react.'
      }
    ]
  },
  {
    id: 'comparing-persuading',
    part: 5,
    title: 'Comparing and Persuading',
    prepTime: 60,
    speakTime: 60,
    icon: '⚖️',
    description: 'Compare options and persuade someone to choose one',
    skills: [
      'Compare advantages and disadvantages',
      'Make a clear recommendation',
      'Use persuasive language',
      'Support opinion with reasons'
    ],
    tips: [
      'Briefly mention both options',
      'State your recommendation clearly',
      'Give 2-3 strong reasons for your choice',
      'Address potential concerns about your recommendation'
    ],
    samplePrompts: [
      {
        id: 'compare-1',
        scenario: 'Your friend wants to get fit and is deciding between joining a gym or exercising at home.',
        prompt: 'Compare the two options and persuade your friend to choose one.',
        bulletPoints: [
          'Cost differences',
          'Convenience and time',
          'Motivation and equipment'
        ]
      },
      {
        id: 'compare-2',
        scenario: 'Your colleague is choosing between taking a vacation at the beach or in the mountains.',
        prompt: 'Compare both vacation options and convince your colleague which one is better.',
        bulletPoints: [
          'Activities available',
          'Relaxation vs adventure',
          'Weather and timing'
        ]
      },
      {
        id: 'compare-3',
        scenario: 'Your neighbor is deciding between buying an electric car or a traditional gasoline car.',
        prompt: 'Compare the two types of vehicles and persuade your neighbor to choose one.',
        bulletPoints: [
          'Environmental impact',
          'Cost of ownership',
          'Convenience and infrastructure'
        ]
      }
    ]
  },
  {
    id: 'difficult-situation',
    part: 6,
    title: 'Dealing with a Difficult Situation',
    prepTime: 60,
    speakTime: 60,
    icon: '🔧',
    description: 'Handle a problem or make a complaint appropriately',
    skills: [
      'Explain the problem clearly',
      'Express frustration politely',
      'Request a specific solution',
      'Remain professional and firm'
    ],
    tips: [
      'Start by explaining the situation calmly',
      'Describe the problem and how it affects you',
      'State what you want to happen',
      'Be polite but assertive'
    ],
    samplePrompts: [
      {
        id: 'difficult-1',
        scenario: 'You ordered furniture online two weeks ago. The delivery was supposed to arrive last week, but you haven\'t received it. When you call customer service, no one can tell you where your order is.',
        prompt: 'Call the furniture company and deal with this situation.',
        context: 'You need the furniture for an event this weekend.'
      },
      {
        id: 'difficult-2',
        scenario: 'You booked a hotel room online with a view of the ocean. When you arrive, the hotel gives you a room facing the parking lot and says no ocean-view rooms are available.',
        prompt: 'Speak to the hotel manager about this problem.',
        context: 'You specifically paid extra for the ocean view.'
      },
      {
        id: 'difficult-3',
        scenario: 'Your neighbor plays loud music every night until 2 AM. You have talked to them twice, but nothing has changed. You need to wake up early for work.',
        prompt: 'Speak to your neighbor about this problem again.',
        context: 'You want to maintain a good relationship but need them to stop.'
      }
    ]
  },
  {
    id: 'expressing-opinions',
    part: 7,
    title: 'Expressing Opinions',
    prepTime: 30,
    speakTime: 90,
    icon: '💬',
    description: 'Give your opinion on a topic and support it with reasons',
    skills: [
      'State opinion clearly',
      'Provide supporting arguments',
      'Give examples or evidence',
      'Consider counterarguments'
    ],
    tips: [
      'State your position in the first sentence',
      'Give 2-3 reasons to support your opinion',
      'Use examples from personal experience or general knowledge',
      'You have 90 seconds - more time to develop your ideas'
    ],
    samplePrompts: [
      {
        id: 'opinion-1',
        scenario: 'Some people believe that children should have limited screen time, while others think technology is essential for learning.',
        prompt: 'Do you think parents should limit their children\'s screen time? Explain your opinion.',
        context: 'Consider both educational benefits and potential drawbacks.'
      },
      {
        id: 'opinion-2',
        scenario: 'Many cities are considering banning cars from downtown areas to reduce pollution and make streets safer for pedestrians.',
        prompt: 'Do you agree that cars should be banned from city centers? Give your opinion.',
        context: 'Think about environmental, economic, and practical considerations.'
      },
      {
        id: 'opinion-3',
        scenario: 'Some employers now allow employees to work from home permanently, while others require everyone to return to the office.',
        prompt: 'Do you think working from home is better than working in an office? Share your opinion.',
        context: 'Consider productivity, work-life balance, and collaboration.'
      }
    ]
  },
  {
    id: 'unusual-situation',
    part: 8,
    title: 'Describing an Unusual Situation',
    prepTime: 30,
    speakTime: 60,
    icon: '🎭',
    description: 'Describe an unusual or unexpected scene from a picture',
    skills: [
      'Identify what is unusual or unexpected',
      'Describe the scene vividly',
      'Explain why the situation is strange',
      'Speculate about what might have happened'
    ],
    tips: [
      'Start by describing the overall scene',
      'Point out what is unusual or doesn\'t fit',
      'Use expressive language to convey surprise',
      'Suggest possible explanations for the situation'
    ],
    samplePrompts: [
      {
        id: 'unusual-1',
        scenario: 'A business meeting room where everyone is dressed formally, but one person is wearing a superhero costume.',
        prompt: 'Describe this unusual scene and explain what you think might be happening.',
        context: 'Consider why someone might be in costume at a business meeting.'
      },
      {
        id: 'unusual-2',
        scenario: 'A library where all the books are floating in the air and the librarian seems completely unconcerned.',
        prompt: 'Describe this strange scene and what might be happening.',
        context: 'Use your imagination to explain this unusual situation.'
      },
      {
        id: 'unusual-3',
        scenario: 'A regular kitchen where a dog is cooking at the stove while a person is sitting in a dog bed.',
        prompt: 'Describe what you see and explain what might have led to this situation.',
        context: 'Be creative in your explanation.'
      }
    ]
  }
];

export const speakingStrategies = {
  general: {
    title: 'General Speaking Tips',
    icon: '🎯',
    tips: [
      'Use ALL the time given - silence hurts your score',
      'Speak clearly and at a natural pace - not too fast',
      'Use transition words: "First," "Also," "However," "Finally"',
      'If you make a mistake, correct yourself and continue',
      'Practice thinking and organizing ideas quickly'
    ]
  },
  structure: {
    title: 'Structuring Your Response',
    icon: '📝',
    tips: [
      'Introduction: State your main point immediately',
      'Body: Give 2-3 supporting ideas with details',
      'Conclusion: Briefly summarize or end clearly',
      'Use the bullet points/questions as a guide'
    ]
  },
  vocabulary: {
    title: 'Vocabulary & Phrases',
    icon: '💬',
    categories: [
      {
        name: 'Giving Advice',
        phrases: ['I would suggest...', 'Have you considered...', 'You might want to...', 'In my opinion, you should...']
      },
      {
        name: 'Expressing Opinions',
        phrases: ['I strongly believe...', 'From my perspective...', 'I\'m convinced that...', 'In my view...']
      },
      {
        name: 'Comparing',
        phrases: ['On one hand... on the other hand...', 'While X is good, Y is better because...', 'Compared to X, Y offers...']
      },
      {
        name: 'Describing',
        phrases: ['In the foreground/background...', 'On the left/right side...', 'It appears that...', 'I can see...']
      }
    ]
  },
  scoring: {
    title: 'What Evaluators Look For',
    icon: '⭐',
    criteria: [
      { name: 'Content/Coherence', description: 'Ideas are relevant, organized, and fully developed' },
      { name: 'Vocabulary', description: 'Range and accuracy of word choice' },
      { name: 'Listenability', description: 'Clear pronunciation, natural pace, appropriate pauses' },
      { name: 'Task Fulfillment', description: 'Addresses all parts of the prompt' }
    ]
  }
};

export const getTaskByPart = (part: number): SpeakingTask | undefined => {
  return speakingTasks.find(t => t.part === part);
};

export const getRandomPrompt = (taskId: string): SpeakingPrompt | undefined => {
  const task = speakingTasks.find(t => t.id === taskId);
  if (!task || task.samplePrompts.length === 0) return undefined;
  const randomIndex = Math.floor(Math.random() * task.samplePrompts.length);
  return task.samplePrompts[randomIndex];
};

// Useful phrases for speaking
export const speakingPhrases = [
  {
    category: 'Giving Advice',
    phrases: ['I would suggest...', 'Have you considered...', 'You might want to...', 'In my opinion, you should...']
  },
  {
    category: 'Expressing Opinions',
    phrases: ['I strongly believe...', 'From my perspective...', 'I\'m convinced that...', 'In my view...']
  },
  {
    category: 'Comparing',
    phrases: ['On one hand... on the other hand...', 'While X is good, Y is better because...', 'Compared to X, Y offers...']
  },
  {
    category: 'Describing Scenes',
    phrases: ['In the foreground/background...', 'On the left/right side...', 'It appears that...', 'I can see...']
  },
  {
    category: 'Making Predictions',
    phrases: ['I predict that...', 'It\'s likely that...', 'I expect...', 'In the future, I believe...']
  },
  {
    category: 'Persuading',
    phrases: ['I strongly recommend...', 'Consider the benefits of...', 'It would be in your best interest to...']
  }
];
