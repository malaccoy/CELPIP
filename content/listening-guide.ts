// Listening Module Content - CELPIP Listening Test Structure

export interface ListeningPart {
  id: string;
  part: number;
  title: string;
  questions: number;
  duration: string;
  icon: string;
  description: string;
  format: string;
  skills: string[];
  tips: string[];
}

export interface ListeningQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  timestamp?: string; // When in the audio the answer appears
}

export interface ListeningPassage {
  id: string;
  part: number;
  partName: string;
  title: string;
  context: string;
  audioScript: string; // Text for TTS generation
  questions: ListeningQuestion[];
}

export const listeningParts: ListeningPart[] = [
  {
    id: 'problem-solving',
    part: 1,
    title: 'Listening to Problem Solving',
    questions: 8,
    duration: '~8 min',
    icon: '🔧',
    description: 'Listen to a conversation about solving a problem',
    format: 'A conversation between two people discussing a problem and possible solutions',
    skills: [
      'Identify the main problem',
      'Understand proposed solutions',
      'Recognize opinions and preferences',
      'Follow the conversation flow'
    ],
    tips: [
      'Listen for signal words like "the problem is...", "we could...", "I suggest..."',
      'Pay attention to who suggests what solution',
      'Note any disagreements or concerns raised',
      'The conversation plays ONCE - stay focused'
    ]
  },
  {
    id: 'daily-life',
    part: 2,
    title: 'Listening to a Daily Life Conversation',
    questions: 5,
    duration: '~5 min',
    icon: '🏠',
    description: 'Listen to a casual conversation about everyday topics',
    format: 'An informal conversation between friends, family, or colleagues',
    skills: [
      'Understand casual, everyday language',
      'Pick up on implied meanings',
      'Recognize attitudes and feelings',
      'Follow topic changes'
    ],
    tips: [
      'Listen for tone of voice clues (happy, frustrated, excited)',
      'Pay attention to informal expressions and idioms',
      'Note what each speaker thinks or feels',
      'Questions often ask about attitudes, not just facts'
    ]
  },
  {
    id: 'information',
    part: 3,
    title: 'Listening for Information',
    questions: 6,
    duration: '~6 min',
    icon: '📢',
    description: 'Listen to an announcement, news report, or informational message',
    format: 'A monologue providing factual information (news, instructions, announcements)',
    skills: [
      'Extract specific details (dates, times, numbers)',
      'Understand sequence of events',
      'Identify main points vs supporting details',
      'Recognize purpose of the message'
    ],
    tips: [
      'Write down numbers, dates, and names as you hear them',
      'Listen for organizational cues ("first", "next", "finally")',
      'Pay attention to emphasis - important info is often stressed',
      'The audio plays ONCE - take quick notes'
    ]
  },
  {
    id: 'viewpoints',
    part: 4,
    title: 'Listening to a News Item',
    questions: 5,
    duration: '~5 min',
    icon: '📰',
    description: 'Listen to a news report with different viewpoints',
    format: 'A news story featuring multiple speakers with different opinions',
    skills: [
      'Distinguish between different speakers',
      'Identify each person\'s viewpoint',
      'Understand agreement and disagreement',
      'Recognize supporting arguments'
    ],
    tips: [
      'Note which person says what',
      'Listen for opinion phrases: "I believe", "In my view", "I disagree"',
      'Pay attention to the reporter\'s summary',
      'Track who supports or opposes the main issue'
    ]
  },
  {
    id: 'discussion',
    part: 5,
    title: 'Listening to a Discussion',
    questions: 8,
    duration: '~8 min',
    icon: '💬',
    description: 'Listen to a discussion between multiple people',
    format: 'A group discussion or meeting with 3+ participants',
    skills: [
      'Track multiple speakers',
      'Understand different perspectives',
      'Follow the flow of discussion',
      'Identify conclusions or decisions'
    ],
    tips: [
      'Focus on understanding each person\'s main point',
      'Listen for agreements ("I agree", "That\'s right") and disagreements',
      'Note any decisions or action items mentioned',
      'Don\'t panic if you miss something - keep listening'
    ]
  },
  {
    id: 'viewpoints-extended',
    part: 6,
    title: 'Listening to Viewpoints',
    questions: 6,
    duration: '~6 min',
    icon: '🎙️',
    description: 'Listen to extended opinions on a topic',
    format: 'Multiple people expressing their views on a social or community issue',
    skills: [
      'Compare and contrast viewpoints',
      'Identify reasons for opinions',
      'Recognize emotional attitudes',
      'Understand implicit meanings'
    ],
    tips: [
      'Create a mental map of who thinks what',
      'Listen for reasons behind each opinion',
      'Pay attention to how strongly people feel',
      'Questions may ask you to compare viewpoints'
    ]
  }
];

export const listeningStrategies = {
  before: {
    title: 'Before Listening',
    icon: '🎯',
    tips: [
      'Read ALL questions before the audio starts',
      'Underline key words in each question',
      'Predict what the audio might be about',
      'Note the question types (who, what, why, how)'
    ]
  },
  during: {
    title: 'While Listening',
    icon: '👂',
    tips: [
      'Stay calm - you only hear it once',
      'Take brief notes (keywords, numbers, names)',
      'Don\'t get stuck on one missed word',
      'Listen for signal words and transitions'
    ]
  },
  after: {
    title: 'Answering Questions',
    icon: '✅',
    tips: [
      'Answer based on what you heard, not what you think',
      'If unsure, use process of elimination',
      'Don\'t leave any question blank',
      'Trust your first instinct - don\'t overthink'
    ]
  }
};

export const listeningPassages: ListeningPassage[] = [
  // PART 1: Problem Solving
  {
    id: 'problem-1',
    part: 1,
    partName: 'Listening to Problem Solving',
    title: 'Office Parking Problem',
    context: 'Listen to two colleagues discussing a problem at their workplace.',
    audioScript: `
Woman: Hey Mark, did you hear about the parking situation? The building management just announced they're reducing the number of employee parking spots by half.

Man: What? That's terrible news. I drive to work every day - there's no way I can give up my parking spot.

Woman: I know, it's frustrating. Apparently they need the space for a new tenant moving into the building. So we need to figure out some alternatives.

Man: Well, what options do we have? I can't take public transit - I live too far from any bus routes.

Woman: Have you considered carpooling? I know Sarah from accounting lives near you. Maybe you two could share rides.

Man: That's actually not a bad idea. But what about days when we have different schedules?

Woman: Good point. Another option is the park-and-ride lot on Highway 7. You could drive there and take the express bus downtown. It's only 20 minutes.

Man: Hmm, that might work. What about you? What are you going to do?

Woman: I'm thinking about biking, actually. The new bike lanes on Main Street go right past our building. It would take me about 25 minutes, and I could use the exercise.

Man: That sounds healthy, but what about winter? It gets pretty cold here.

Woman: Yeah, I've thought about that. For winter, I might use the park-and-ride like you. Or maybe work from home a couple days a week - the company just expanded remote work options.

Man: That's true. I should ask my manager about that too. Working from home two days a week would help a lot.

Woman: Exactly. So I think we have some good options. Shall we talk to Sarah about the carpool idea?

Man: Yes, let's do that today.
`,
    questions: [
      {
        id: 1,
        question: 'What is the main problem being discussed?',
        options: [
          'The office is moving to a new building',
          'Parking spots are being reduced',
          'Public transit is too expensive',
          'The building is being renovated'
        ],
        correct: 1
      },
      {
        id: 2,
        question: 'Why is Mark concerned about public transit?',
        options: [
          'It is too expensive',
          'He lives far from bus routes',
          'The buses are always late',
          'He doesn\'t like crowded buses'
        ],
        correct: 1
      },
      {
        id: 3,
        question: 'Who does the woman suggest Mark could carpool with?',
        options: [
          'The woman herself',
          'His manager',
          'Sarah from accounting',
          'A neighbor'
        ],
        correct: 2
      },
      {
        id: 4,
        question: 'How long would the express bus take from the park-and-ride?',
        options: [
          '15 minutes',
          '20 minutes',
          '25 minutes',
          '30 minutes'
        ],
        correct: 1
      },
      {
        id: 5,
        question: 'What solution is the woman considering for summer?',
        options: [
          'Taking the bus',
          'Working from home',
          'Carpooling with Mark',
          'Biking to work'
        ],
        correct: 3
      },
      {
        id: 6,
        question: 'What is mentioned as a winter alternative?',
        options: [
          'Buying a warmer car',
          'Using park-and-ride or working from home',
          'Moving closer to work',
          'Taking vacation during cold months'
        ],
        correct: 1
      }
    ]
  },

  // PART 2: Daily Life Conversation
  {
    id: 'daily-life-1',
    part: 2,
    partName: 'Listening to a Daily Life Conversation',
    title: 'Weekend Plans',
    context: 'Listen to two friends talking about their weekend.',
    audioScript: `
Woman: So, any exciting plans for the weekend, Tom?

Man: Actually, yes! My brother's coming to visit from Vancouver. I haven't seen him in almost a year, so I'm really looking forward to it.

Woman: Oh, that's wonderful! What are you guys planning to do?

Man: Well, he's really into hiking, so I thought we'd go to Grouse Mountain on Saturday. The weather's supposed to be perfect.

Woman: Nice choice! The views from up there are amazing. Are you hiking up or taking the gondola?

Man: We're definitely hiking up - my brother wouldn't have it any other way. He's way more athletic than me, so I've been trying to get in shape for the past few weeks. I don't want to embarrass myself!

Woman: Ha! I'm sure you'll be fine. What about Sunday?

Man: Sunday we're planning something more relaxed. There's this new brunch place on Commercial Drive that everyone's been talking about. Have you heard of it? It's called "Morning Glory."

Woman: Yes! I went there last month. The eggs benedict is incredible, but be prepared to wait - it gets really crowded on weekends.

Man: Good to know. Maybe we'll go early then, around 9. After brunch, we might just walk around the neighborhood, check out some shops. My brother wants to find some local art for his new apartment.

Woman: Sounds like a perfect weekend. I'm a bit jealous - I have to work on Saturday.

Man: Oh no, that's rough. Well, maybe we can all grab dinner together Sunday evening? I'd love for you to meet him.

Woman: I'd like that! Just text me the details.
`,
    questions: [
      {
        id: 1,
        question: 'How does Tom feel about his brother\'s visit?',
        options: [
          'Nervous',
          'Excited',
          'Indifferent',
          'Worried'
        ],
        correct: 1
      },
      {
        id: 2,
        question: 'How are they planning to get up Grouse Mountain?',
        options: [
          'By gondola',
          'By car',
          'By hiking',
          'By bus'
        ],
        correct: 2
      },
      {
        id: 3,
        question: 'Why has Tom been exercising recently?',
        options: [
          'For a competition',
          'Doctor\'s orders',
          'To prepare for the hike',
          'To lose weight'
        ],
        correct: 2
      },
      {
        id: 4,
        question: 'What does the woman say about Morning Glory restaurant?',
        options: [
          'It\'s too expensive',
          'The food is terrible',
          'It gets very crowded',
          'It\'s hard to find'
        ],
        correct: 2
      },
      {
        id: 5,
        question: 'What does Tom\'s brother want to buy?',
        options: [
          'Hiking gear',
          'Clothes',
          'Local art',
          'Books'
        ],
        correct: 2
      }
    ]
  },

  // PART 3: Listening for Information
  {
    id: 'information-1',
    part: 3,
    partName: 'Listening for Information',
    title: 'Community Center Announcement',
    context: 'Listen to an announcement about changes at a community center.',
    audioScript: `
Attention all members of the Riverside Community Center. We have several important announcements regarding upcoming changes and events.

First, our annual maintenance closure will take place from March 15th to March 22nd. During this time, all facilities including the pool, gym, and fitness studios will be closed for deep cleaning and equipment upgrades. We apologize for any inconvenience and thank you for your patience.

Second, we're excited to announce our new extended hours starting April 1st. The center will now open at 5:30 AM instead of 6 AM on weekdays, and close at 11 PM instead of 10 PM. Weekend hours will remain unchanged.

Third, registration for spring swimming lessons begins next Monday, March 3rd, at 8 AM. Classes fill up quickly, so we encourage early registration. You can sign up online through our website or in person at the front desk. Children's classes are $85 for the 8-week session, and adult classes are $95.

Finally, don't forget about our community fitness challenge starting March 10th. Participants who complete 20 workout sessions by April 30th will receive a free month of membership. Sign-up sheets are available at the front desk.

For more information about any of these announcements, please speak to our staff or visit our website at riverside community dot org. Thank you for being valued members of our community.
`,
    questions: [
      {
        id: 1,
        question: 'When will the maintenance closure end?',
        options: [
          'March 15th',
          'March 20th',
          'March 22nd',
          'March 25th'
        ],
        correct: 2
      },
      {
        id: 2,
        question: 'What will the new weekday opening time be?',
        options: [
          '5:00 AM',
          '5:30 AM',
          '6:00 AM',
          '6:30 AM'
        ],
        correct: 1
      },
      {
        id: 3,
        question: 'When does swimming lesson registration begin?',
        options: [
          'March 1st',
          'March 3rd',
          'March 10th',
          'April 1st'
        ],
        correct: 1
      },
      {
        id: 4,
        question: 'How much do adult swimming classes cost?',
        options: [
          '$75',
          '$85',
          '$95',
          '$105'
        ],
        correct: 2
      },
      {
        id: 5,
        question: 'How many workout sessions are needed for the free month?',
        options: [
          '15 sessions',
          '20 sessions',
          '25 sessions',
          '30 sessions'
        ],
        correct: 1
      },
      {
        id: 6,
        question: 'Which hours will remain unchanged?',
        options: [
          'Weekday mornings',
          'Weekday evenings',
          'Weekend hours',
          'Holiday hours'
        ],
        correct: 2
      }
    ]
  },

  // PART 4: News Item
  {
    id: 'news-1',
    part: 4,
    partName: 'Listening to a News Item',
    title: 'New Bike Lane Proposal',
    context: 'Listen to a news report about a proposed bike lane in a city.',
    audioScript: `
Reporter: The city council is considering a controversial proposal to add protected bike lanes along Main Street, one of the busiest roads in downtown. The plan has divided residents and business owners. We spoke with several people about their views.

Business Owner (Margaret Chen): I'm strongly opposed to this plan. Main Street is already congested, and removing a lane of traffic for bikes will make it worse. My customers need to be able to drive here and park. If traffic becomes unbearable, they'll just shop online or go to the mall instead. This could seriously hurt local businesses.

Cyclist (David Park): I think this is exactly what our city needs. Right now, biking on Main Street is dangerous - I've had several close calls with cars. Protected bike lanes would encourage more people to cycle, reduce traffic congestion in the long run, and help the environment. Cities like Vancouver and Montreal have done this successfully.

Resident (Susan Williams): I'm somewhere in the middle on this. I understand the benefits of cycling infrastructure, but I'm worried about the construction period. They say it will take six months to build. That's six months of disruption for everyone. I wish they would start with a smaller street first as a pilot project.

City Councillor (James Morrison): We've studied this carefully. Yes, there will be short-term disruption, but the long-term benefits are clear. Studies show that bike lanes actually increase foot traffic to local businesses because cyclists are more likely to stop and shop than drivers passing through. We're also planning to add more street parking on side streets to offset any lost spots.

Reporter: The council is expected to vote on the proposal next month. If approved, construction could begin as early as next spring.
`,
    questions: [
      {
        id: 1,
        question: 'What is Margaret Chen most worried about?',
        options: [
          'Noise from construction',
          'Safety for pedestrians',
          'Impact on local businesses',
          'Environmental concerns'
        ],
        correct: 2
      },
      {
        id: 2,
        question: 'According to David Park, what is the current problem?',
        options: [
          'There are too many cyclists',
          'Biking on Main Street is dangerous',
          'Public transit is unreliable',
          'Parking is too expensive'
        ],
        correct: 1
      },
      {
        id: 3,
        question: 'What is Susan Williams\' main concern?',
        options: [
          'The cost of the project',
          'Environmental impact',
          'The six-month construction period',
          'Loss of parking spaces'
        ],
        correct: 2
      },
      {
        id: 4,
        question: 'What does the councillor say about cyclists and shopping?',
        options: [
          'Cyclists rarely stop at shops',
          'Cyclists are more likely to stop and shop',
          'Cyclists prefer online shopping',
          'Cyclists only shop on weekends'
        ],
        correct: 1
      },
      {
        id: 5,
        question: 'When might construction begin if approved?',
        options: [
          'Next month',
          'This winter',
          'Next spring',
          'Next summer'
        ],
        correct: 2
      }
    ]
  }
];

export const getPassagesByPart = (part: number): ListeningPassage[] => {
  return listeningPassages.filter(p => p.part === part);
};

export const getPassageById = (id: string): ListeningPassage | undefined => {
  return listeningPassages.find(p => p.id === id);
};
