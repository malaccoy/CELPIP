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
  },

  // ============================================
  // PART 1: Additional Problem Solving Passages
  // ============================================
  {
    id: 'problem-2',
    part: 1,
    partName: 'Listening to Problem Solving',
    title: 'Apartment Roommate Conflict',
    context: 'Listen to two roommates discussing a problem in their shared apartment.',
    audioScript: `Woman: Hey Jake, do you have a minute? I need to talk to you about something.

Man: Sure, what's up?

Woman: Well, it's about the electricity bill. It came in yesterday and it's three hundred and twenty dollars. That's almost double what it was last month.

Man: Three twenty? That's insane. What happened?

Woman: I think it's the space heaters. You've been running two of them in your room pretty much all day. I get that your room is cold, but it's really driving up the costs.

Man: I know, I know. But the heating vent in my room barely works. I've told the landlord three times and he hasn't done anything about it. What am I supposed to do, freeze?

Woman: No, of course not. But we need to find a solution because I can't afford to pay a hundred and sixty dollars every month for electricity. That wasn't what we agreed on.

Man: You're right, that's not fair to you. What if I contact the landlord again and give him a deadline? Like, if he doesn't fix the vent by the end of next week, we'll call a repair person ourselves and deduct it from the rent.

Woman: Can we legally do that?

Man: I think so, but let me check. My cousin is a paralegal, I'll ask her. In the meantime, what if I buy one of those energy-efficient oil heaters? They cost way less to run than the space heaters. My friend has one and his bill barely changed.

Woman: That would help a lot. They're like eighty dollars at Canadian Tire. I'd even split the cost with you since it benefits both of us through the electricity bill.

Man: Deal. I'll go pick one up tomorrow. And for this month's bill, how about I pay sixty percent since the heaters were my fault? So I'll pay one ninety-two and you pay one twenty-eight.

Woman: That's really fair, Jake. Thanks for being reasonable about this.

Man: Of course. We're in this together, right? I'll text my cousin tonight about the landlord situation.`,
    questions: [
      { id: 1, question: 'What is the main problem?', options: ['The apartment is too small', 'The electricity bill is much higher than usual', 'The landlord is raising the rent', 'The heating system is too loud'], correct: 1 },
      { id: 2, question: 'Why is Jake using space heaters?', options: ['He prefers them to central heating', 'The apartment has no heating system', 'The heating vent in his room barely works', 'He is trying to dry his clothes'], correct: 2 },
      { id: 3, question: 'What solution does Jake suggest for the landlord?', options: ['Move to a different apartment', 'Sue the landlord', 'Give the landlord a deadline and hire a repair person if needed', 'Stop paying rent until it is fixed'], correct: 2 },
      { id: 4, question: 'What type of heater will Jake buy?', options: ['A larger space heater', 'An energy-efficient oil heater', 'A gas heater', 'A ceramic tower heater'], correct: 1 },
      { id: 5, question: 'How will they split this month\'s electricity bill?', options: ['Equally — fifty-fifty', 'Jake pays 60%, she pays 40%', 'Jake pays the full amount', 'They will ask the landlord to pay'], correct: 1 },
      { id: 6, question: 'Who will Jake ask about the legal question?', options: ['His lawyer', 'The landlord', 'His cousin who is a paralegal', 'A tenant rights organization'], correct: 2 }
    ]
  },
  {
    id: 'problem-3',
    part: 1,
    partName: 'Listening to Problem Solving',
    title: 'Scheduling a Group Project',
    context: 'Listen to two university students trying to organize a group project meeting.',
    audioScript: `Man: Priya, we really need to figure out when we're going to meet for this marketing project. The presentation is in two weeks and we haven't even started the research.

Woman: I know, I've been stressed about it. The problem is everyone's schedule is completely different. You work Monday and Wednesday evenings, I have labs Tuesday and Thursday afternoons, and Chen has class every morning.

Man: Right. And the deadline is March fifteenth. Professor Williams won't accept late submissions — she was very clear about that.

Woman: Okay, let's think about this systematically. Weekday mornings are out because of Chen. My labs go until four on Tuesdays and Thursdays. What about Tuesday or Thursday evenings?

Man: Tuesdays could work for me. I'm free after five. But doesn't Chen work at the restaurant on Tuesday nights?

Woman: Oh right, he does. Okay, what about Thursday evening then?

Man: Thursday works. I'm free all day Thursday actually. What time?

Woman: My lab ends at four, so I could get to the library by four thirty. Could we do four thirty to seven?

Man: That works for me. I'll text Chen right now. Actually, wait — what about Saturday? We might need more than one session per week to get this done in time.

Woman: Saturday morning would be perfect. I'm free until noon, and the campus library opens at nine on weekends.

Man: Let me check... yes, Saturday nine to twelve works for me too. So we'd have Thursday evenings and Saturday mornings. That's five hours per week. If we do that for two weeks, that's ten hours total.

Woman: That should be enough if we divide the work efficiently. I can handle the data analysis section, you're good at presentations, and Chen is great with research.

Man: Perfect. I'll create a shared Google Doc tonight so we can all start adding notes. And I'll set up a group chat so we can communicate between meetings.

Woman: Great idea. Let me also book a study room at the library for Thursdays. Those rooms fill up fast.`,
    questions: [
      { id: 1, question: 'When is the project presentation?', options: ['Next week', 'In two weeks', 'In one month', 'At the end of the semester'], correct: 1 },
      { id: 2, question: 'Why can\'t they meet on weekday mornings?', options: ['The library is closed', 'Priya has labs', 'Chen has class every morning', 'The man works mornings'], correct: 2 },
      { id: 3, question: 'Why is Tuesday evening not possible?', options: ['Priya has a lab', 'The man works', 'Chen works at a restaurant', 'The library is closed'], correct: 2 },
      { id: 4, question: 'What two time slots do they agree on?', options: ['Monday evenings and Sunday mornings', 'Wednesday afternoons and Friday mornings', 'Thursday evenings and Saturday mornings', 'Tuesday evenings and Saturday afternoons'], correct: 2 },
      { id: 5, question: 'How many total hours of meeting time will they have?', options: ['Five hours', 'Eight hours', 'Ten hours', 'Twelve hours'], correct: 2 },
      { id: 6, question: 'What will the man do after the conversation?', options: ['Start the research immediately', 'Create a shared Google Doc and group chat', 'Email Professor Williams', 'Book a study room'], correct: 1 }
    ]
  },

  // PART 2: Additional Daily Life
  {
    id: 'daily-life-2',
    part: 2,
    partName: 'Listening to a Daily Life Conversation',
    title: 'Moving to a New Neighborhood',
    context: 'Listen to two friends talking about one of them moving to a new area.',
    audioScript: `Man: So how's the new place? You moved in last weekend, right?

Woman: Yeah, Saturday. It was exhausting but we're mostly unpacked. The apartment itself is great — two bedrooms, in-suite laundry, and a huge balcony. Way better than our old place.

Man: That sounds amazing. And it's in Kitsilano, right? I love that area.

Woman: Yes! The neighborhood is honestly the best part. There's a farmers' market on Sunday mornings just three blocks away. We went last week and got the most incredible fresh bread and local honey.

Man: Nice. What about your commute though? You used to walk to work in twenty minutes.

Woman: That's the trade-off. Now it's about forty-five minutes by transit — I take the bus to Broadway and then the SkyTrain downtown. But honestly, I use that time to read or listen to podcasts, so it's not wasted time.

Man: Fair enough. What about groceries and stuff?

Woman: There's a Save-On-Foods literally on the corner, and a Shoppers Drug Mart across the street. Plus there are tons of cute little restaurants and coffee shops along Fourth Avenue. We've already found a favorite brunch spot called Fable.

Man: Oh, I've heard of Fable! Their eggs are supposed to be incredible. What about the noise? I heard Kitsilano can be busy.

Woman: Our street is actually really quiet. We're on a side street, not on Broadway or Fourth. The only noise is the occasional seagull. Oh, and the parks! Kits Beach is a ten-minute walk. We took the dog there yesterday and he absolutely loved it.

Man: I'm starting to get jealous. How much more are you paying?

Woman: About four hundred more per month than our old place. But the old place was getting a rent increase anyway, and this one includes parking, which we were paying separately before. So the real difference is only about two hundred.

Man: That's not bad at all for what you're getting. I might need to start looking in that area too.`,
    questions: [
      { id: 1, question: 'When did the woman move?', options: ['Last Friday', 'Last Saturday', 'Last Sunday', 'Two weeks ago'], correct: 1 },
      { id: 2, question: 'What does the woman like most about the new area?', options: ['The apartment itself', 'The short commute', 'The neighborhood', 'The low rent'], correct: 2 },
      { id: 3, question: 'How does the woman commute to work now?', options: ['She drives', 'She walks in 20 minutes', 'She takes the bus and SkyTrain', 'She bikes along the seawall'], correct: 2 },
      { id: 4, question: 'What does the woman do during her commute?', options: ['She sleeps', 'She works on her laptop', 'She reads or listens to podcasts', 'She calls friends'], correct: 2 },
      { id: 5, question: 'How much more is the actual cost difference?', options: ['$100 per month', '$200 per month', '$400 per month', '$600 per month'], correct: 1 },
      { id: 6, question: 'What is near the apartment?', options: ['A shopping mall and cinema', 'A grocery store and pharmacy', 'A hospital and school', 'A gym and pool'], correct: 1 }
    ]
  },
  {
    id: 'daily-life-3',
    part: 2,
    partName: 'Listening to a Daily Life Conversation',
    title: 'Planning a Birthday Surprise',
    context: 'Listen to two co-workers planning a surprise birthday party for a colleague.',
    audioScript: `Woman: Hey David, did you remember that Angela's birthday is this Friday?

Man: Oh shoot, it's this Friday? I thought it was next week! We need to do something — she planned that amazing farewell party for Marcus last month.

Woman: Exactly. I was thinking we could do a surprise lunch in the conference room. Nothing crazy, but meaningful.

Man: I love that. What time? She usually takes lunch at twelve thirty.

Woman: Right, so we could set everything up at noon while she's still at her desk, and then someone lures her to the conference room at twelve thirty. We can say there's a quick team meeting.

Man: Smart. She'll never suspect it because we actually do have random meetings on Fridays sometimes. What about food?

Woman: I was going to order from that Thai place she loves — Chaba Thai on Robson. She always gets the pad thai and green curry. I figure I'll order a few dishes family-style for everyone. It would be about fifteen dollars per person if we split it among the team.

Man: There are eight of us, so that's one twenty total. I can collect money from everyone. How about the cake?

Woman: I already talked to Maria — she's going to bake one. She makes incredible carrot cake, and I know that's Angela's favorite because she mentioned it at the holiday party.

Man: Perfect, that saves us forty or fifty bucks on a bakery cake. Should we do decorations?

Woman: Just simple ones. Some balloons and a banner. I have a birthday banner from my kid's party that's still in good shape. I can grab a pack of balloons from the dollar store.

Man: Great. And for a gift, I was thinking we could get her a gift card to that bookstore she's always talking about — Indigo. Maybe twenty-five dollars each from the group?

Woman: Good idea. So twenty-five divided by eight is about three dollars each on top of the food. That's totally reasonable. I'll pick up the gift card tomorrow.

Man: This is going to be great. She's going to be so surprised. I'll start collecting money today — fifteen for food plus three for the gift card, eighteen per person.

Woman: Perfect. Just make sure to tell everyone to keep it a secret!`,
    questions: [
      { id: 1, question: 'When is Angela\'s birthday?', options: ['This Wednesday', 'This Thursday', 'This Friday', 'Next week'], correct: 2 },
      { id: 2, question: 'How will they get Angela to the conference room?', options: ['Tell her about the party', 'Say there is a quick team meeting', 'Ask her to help move furniture', 'Send her a calendar invite'], correct: 1 },
      { id: 3, question: 'Where will they order food from?', options: ['A pizza place', 'A sushi restaurant', 'A Thai restaurant', 'A sandwich shop'], correct: 2 },
      { id: 4, question: 'Who is making the cake?', options: ['David will buy one from a bakery', 'The woman will make it', 'Maria will bake it', 'Angela\'s family will bring one'], correct: 2 },
      { id: 5, question: 'How much will each person pay in total?', options: ['$15', '$18', '$20', '$25'], correct: 1 },
      { id: 6, question: 'What gift are they getting Angela?', options: ['Flowers', 'A book', 'A gift card to Indigo bookstore', 'A restaurant voucher'], correct: 2 }
    ]
  },

  // PART 3: Additional Information
  {
    id: 'information-2',
    part: 3,
    partName: 'Listening for Information',
    title: 'Airport Security Announcement',
    context: 'Listen to an announcement at a Canadian airport.',
    audioScript: `Attention all passengers. This is an important announcement regarding updated security procedures at Vancouver International Airport, effective immediately.

All passengers departing on international flights must now arrive at the airport at least three hours before their scheduled departure time. For domestic flights, we recommend arriving at least two hours early. These changes are due to enhanced screening procedures being implemented across all Canadian airports.

Please note the following changes to our security process. First, all laptops and tablets must now be removed from carry-on bags and placed in separate bins for screening. This includes devices in protective cases. Second, passengers are reminded that liquids, gels, and aerosols in carry-on luggage must be in containers of one hundred millilitres or less, and all containers must fit in a single clear, resealable plastic bag no larger than one litre.

Third, we have introduced new body scanning technology at gates twelve through twenty-four. These scanners are safe and meet all Health Canada standards. Passengers who prefer not to use the scanner may request a manual pat-down screening instead.

For families traveling with children under twelve, a dedicated family screening lane is now available at checkpoint B. This lane has been designed to accommodate strollers, car seats, and diaper bags more efficiently. Families using this lane should follow the blue signs from the check-in area.

Additionally, please be aware that our food court on the departures level will be undergoing renovations from March first through April fifteenth. During this time, only the Tim Hortons and Subway locations will remain open. A temporary food service area has been set up near gate eight with additional snack and beverage options.

For passengers requiring special assistance, please contact your airline or visit the information desk on the arrivals level. Wheelchair assistance and escort services are available free of charge.

Thank you for your patience with these changes. We are committed to ensuring your safety while making your travel experience as smooth as possible.`,
    questions: [
      { id: 1, question: 'How early should international passengers arrive?', options: ['At least one hour early', 'At least two hours early', 'At least three hours early', 'At least four hours early'], correct: 2 },
      { id: 2, question: 'What must be removed from carry-on bags?', options: ['All electronic devices', 'Laptops and tablets', 'Phones and cameras', 'Shoes and belts'], correct: 1 },
      { id: 3, question: 'What can passengers do if they don\'t want to use the body scanner?', options: ['Skip the screening', 'Use a different gate', 'Request a manual pat-down', 'Show a medical certificate'], correct: 2 },
      { id: 4, question: 'Where is the family screening lane?', options: ['Checkpoint A', 'Checkpoint B', 'Gate twelve', 'The arrivals level'], correct: 1 },
      { id: 5, question: 'Which restaurants will remain open during renovations?', options: ['Starbucks and McDonald\'s', 'Tim Hortons and Subway', 'A&W and Pizza Pizza', 'All restaurants will close'], correct: 1 },
      { id: 6, question: 'Where can passengers get wheelchair assistance?', options: ['At gate eight', 'At checkpoint B', 'At the information desk on the arrivals level', 'At the departures food court'], correct: 2 }
    ]
  },
  {
    id: 'information-3',
    part: 3,
    partName: 'Listening for Information',
    title: 'University Orientation Welcome',
    context: 'Listen to a welcome address at a university orientation for new students.',
    audioScript: `Good morning everyone, and welcome to the University of British Columbia. My name is Dr. Patricia Wong, and I'm the Dean of Student Affairs. On behalf of the entire UBC community, congratulations on your admission and welcome to what I'm sure will be an incredible chapter of your lives.

I'd like to walk you through a few essential things you need to know as you start your first semester.

First, your student ID card. If you haven't picked yours up yet, the card office is in the Koerner Library building, room one-oh-three. You'll need your student number and a piece of government-issued photo ID. The card office is open Monday through Friday, eight thirty to four thirty. Your student card is extremely important — it serves as your library card, your transit pass for the U-Pass, your meal plan access, and your building access after hours.

Second, academic advising. Every new student is assigned an academic advisor based on your faculty. You should book your first meeting within the first two weeks of classes. You can do this through the Student Service Centre online portal or by visiting the advising office in the Brock Hall building. Your advisor will help you confirm your course selections, understand degree requirements, and plan your academic path.

Third, health and wellness services. UBC Student Health Services is located in the University Services Building. You can see a doctor, counsellor, or nurse without an appointment for urgent matters, but we strongly recommend booking appointments online through the student health portal. All services are covered by your student fees. The counselling team offers individual sessions, group workshops on stress management, and a twenty-four-seven crisis line at six-oh-four, eight-two-two, three-eight-one-one.

Finally, getting involved. We have over three hundred and fifty student clubs and organizations. The clubs fair is happening this Saturday from ten AM to three PM in the Student Union Building plaza. I encourage every one of you to explore at least two or three clubs that interest you. Research consistently shows that students who are involved in campus life perform better academically and report higher satisfaction.

Orientation continues this afternoon with campus tours leaving from this building every thirty minutes starting at one PM. Welcome again, and go Thunderbirds!`,
    questions: [
      { id: 1, question: 'Where can students pick up their ID card?', options: ['Student Union Building', 'Brock Hall', 'Koerner Library, room 103', 'University Services Building'], correct: 2 },
      { id: 2, question: 'What does the student ID card NOT function as?', options: ['Library card', 'Transit pass', 'Parking permit', 'Meal plan access'], correct: 2 },
      { id: 3, question: 'When should students meet with their academic advisor?', options: ['Before classes start', 'Within the first two weeks of classes', 'During the first month', 'At the end of the semester'], correct: 1 },
      { id: 4, question: 'Where is Student Health Services located?', options: ['Koerner Library', 'Brock Hall', 'Student Union Building', 'University Services Building'], correct: 3 },
      { id: 5, question: 'How many student clubs does UBC have?', options: ['Over 100', 'Over 200', 'Over 350', 'Over 500'], correct: 2 },
      { id: 6, question: 'When do campus tours start?', options: ['12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM'], correct: 1 }
    ]
  },

  // PART 4: Additional News Items
  {
    id: 'news-2',
    part: 4,
    partName: 'Listening to a News Item',
    title: 'Vancouver Housing Market Report',
    context: 'Listen to a news report about the housing market in Vancouver.',
    audioScript: `This is CBC Vancouver with your real estate update. New data released today by the Greater Vancouver Real Estate Board shows some surprising trends in the local housing market.

The average price of a detached home in Greater Vancouver fell by four point seven percent in January compared to the same month last year, bringing the benchmark price to one point eight million dollars. However, condominiums told a different story, with prices rising by two point three percent to an average of seven hundred and seventy thousand dollars.

Industry analysts say the detached home market is being affected by higher interest rates, which have made monthly mortgage payments significantly more expensive. At current rates, the mortgage payment on a typical Vancouver house is approximately eight thousand dollars per month — more than double what it was just three years ago.

Meanwhile, the condo market remains strong because first-time buyers who can't afford houses are turning to condos as their only entry point into the market. One-bedroom condos in the city centre are now averaging five hundred and sixty thousand dollars, while two-bedroom units average seven hundred and thirty thousand.

In a related development, the provincial government announced today that it will invest two hundred million dollars over the next three years to build affordable rental housing. The plan includes five thousand new rental units across British Columbia, with approximately two thousand of those in the Metro Vancouver area. Units will target households earning between forty and seventy-five thousand dollars annually, with rents set at thirty percent below market rates.

Vancouver Mayor Lisa Chen called the announcement encouraging but insufficient. Quote: We need twenty thousand units, not five thousand. But it's a step in the right direction. End quote.

Reporting for CBC Vancouver, I'm Michael Torres.`,
    questions: [
      { id: 1, question: 'What happened to detached home prices?', options: ['They increased by 4.7%', 'They fell by 4.7%', 'They stayed the same', 'They fell by 2.3%'], correct: 1 },
      { id: 2, question: 'What is the average condo price?', options: ['$560,000', '$730,000', '$770,000', '$1.8 million'], correct: 2 },
      { id: 3, question: 'Why is the detached home market declining?', options: ['People are leaving Vancouver', 'Higher interest rates increased mortgage payments', 'Too many new homes are being built', 'The government banned foreign buyers'], correct: 1 },
      { id: 4, question: 'How much will the provincial government invest in rental housing?', options: ['$100 million', '$150 million', '$200 million', '$500 million'], correct: 2 },
      { id: 5, question: 'How many new units are planned for Metro Vancouver?', options: ['1,000', '2,000', '5,000', '20,000'], correct: 1 },
      { id: 6, question: 'What was the Mayor\'s reaction?', options: ['She was completely satisfied', 'She rejected the plan', 'She said it is encouraging but not enough', 'She had no comment'], correct: 2 }
    ]
  },
  {
    id: 'news-3',
    part: 4,
    partName: 'Listening to a News Item',
    title: 'New Electric Bus Fleet',
    context: 'Listen to a news report about a city\'s new public transit initiative.',
    audioScript: `Good evening. Calgary Transit has officially launched its first fleet of fully electric buses, marking a significant milestone in the city's plan to achieve net-zero carbon emissions by 2050.

Twenty-five new electric buses began service today on three of the city's busiest routes: Route 3, which runs along Centre Street, Route 17 on Fourteenth Street, and Route 305 connecting the university to the downtown core. Transit officials say these routes were chosen because they carry the highest number of daily passengers — approximately forty-five thousand combined.

The buses, manufactured by New Flyer Industries in Winnipeg, cost approximately one point two million dollars each — roughly four hundred thousand more than a traditional diesel bus. However, the city estimates the electric buses will save approximately seventy thousand dollars per year in fuel and maintenance costs. That means each bus pays for itself within six years.

Riders will notice several differences. The electric buses are significantly quieter than diesel models and feature onboard USB charging ports, improved wheelchair accessibility with a lower floor design, and real-time passenger counters that display available seating on the TransitApp.

Environmental advocates are praising the move. The Canadian Urban Transit Association estimates that replacing one diesel bus with an electric model prevents about seventy-five tonnes of carbon dioxide emissions annually. With twenty-five buses, Calgary will prevent nearly nineteen hundred tonnes of emissions per year.

However, not everyone is satisfied. Transit union representative Sandra Okafor raised concerns about charging infrastructure. Quote: We currently have charging stations at only two of our five depots. If a bus runs low on charge mid-route, there's no fast-charging option on the street. We need more infrastructure before we expand the fleet. End quote.

The city has committed to purchasing fifty additional electric buses by 2028, with a long-term goal of converting the entire fleet of nine hundred buses to electric by 2040.`,
    questions: [
      { id: 1, question: 'How many electric buses were launched?', options: ['15', '20', '25', '50'], correct: 2 },
      { id: 2, question: 'Why were these routes chosen?', options: ['They are the shortest routes', 'They have the most daily passengers', 'They pass through residential areas', 'They connect to the airport'], correct: 1 },
      { id: 3, question: 'How much more expensive is an electric bus than a diesel bus?', options: ['$200,000', '$300,000', '$400,000', '$500,000'], correct: 2 },
      { id: 4, question: 'How long does it take for an electric bus to pay for itself?', options: ['Three years', 'Four years', 'Six years', 'Ten years'], correct: 2 },
      { id: 5, question: 'What is Sandra Okafor\'s concern?', options: ['The buses are too expensive', 'The buses are unreliable', 'There are not enough charging stations', 'The buses are too small'], correct: 2 },
      { id: 6, question: 'What is the long-term goal for the fleet?', options: ['Convert all 900 buses to electric by 2030', 'Convert all 900 buses to electric by 2040', 'Replace 500 buses by 2050', 'Add 50 electric buses by 2028'], correct: 1 }
    ]
  },

  // PART 5: Additional Discussion
  {
    id: 'discussion-2',
    part: 5,
    partName: 'Listening to a Discussion',
    title: 'Restaurant Menu Redesign',
    context: 'Listen to a meeting between a restaurant owner and two staff members about updating the menu.',
    audioScript: `Owner: Thanks for staying after the lunch rush, everyone. I want to talk about updating our menu. Sales have been flat for three months, and I think we need a refresh. Luis, you see the kitchen side. What are your thoughts?

Luis: Well, the biggest issue is that our menu has forty-two items. That's way too many. It slows down the kitchen, increases food waste because we have to stock so many ingredients, and confuses customers. I'd recommend cutting it down to about twenty-five items.

Owner: Which items would you cut?

Luis: Anything that sells fewer than five orders per week. I ran the numbers last month. Eight items sold fewer than three times per week. That's food sitting in the fridge going bad. The seafood risotto, for example — we sold it twice last week but we had to throw away over two hundred dollars in ingredients.

Owner: Okay, that makes sense from a cost perspective. Jenny, what about the front of house? What are customers saying?

Jenny: Two things come up a lot. First, people want more vegetarian and vegan options. Right now we only have three, and one is just a garden salad. In this neighborhood, probably thirty percent of our lunch crowd has some kind of dietary preference. Second, customers keep asking if we have a lunch special. A fixed-price meal with an appetizer, main, and drink for like seventeen or eighteen dollars. Every other restaurant on this street has one.

Owner: A lunch special is a great idea. Luis, could we do that without adding complexity to the kitchen?

Luis: Absolutely. We could offer two or three lunch combos that rotate weekly. Use ingredients we're already buying, just combine them differently. It would actually simplify prep because we'd know exactly how much to prepare for the combos.

Jenny: And from a marketing perspective, I can promote the daily special on our social media and the chalkboard outside. That alone would bring in foot traffic.

Owner: I love it. So the plan is: cut the menu to about twenty-five items, add three or four vegetarian options, and launch a lunch special. Luis, can you draft a new menu by next Wednesday? Jenny, can you design the specials board?

Luis: I'll have it ready by Tuesday.

Jenny: I'll mock up a design this weekend. Should I also update our online menu on the website?

Owner: Yes, that's important. Let's aim to launch the new menu on the first of next month. That gives us two weeks to finalize everything and train the staff on the new items.`,
    questions: [
      { id: 1, question: 'Why does the owner want to update the menu?', options: ['Customer complaints about food quality', 'Sales have been flat for three months', 'The restaurant is moving locations', 'A health inspector recommended changes'], correct: 1 },
      { id: 2, question: 'How many items are currently on the menu?', options: ['25', '32', '42', '50'], correct: 2 },
      { id: 3, question: 'What example does Luis give of food waste?', options: ['The chicken pasta', 'The seafood risotto', 'The garden salad', 'The daily soup'], correct: 1 },
      { id: 4, question: 'What percentage of lunch customers have dietary preferences?', options: ['About 10%', 'About 20%', 'About 30%', 'About 50%'], correct: 2 },
      { id: 5, question: 'How much would the lunch special cost?', options: ['$12-13', '$15-16', '$17-18', '$20-22'], correct: 2 },
      { id: 6, question: 'When will the new menu launch?', options: ['Next Wednesday', 'This weekend', 'The first of next month', 'In three months'], correct: 2 }
    ]
  },

  // PART 6: Additional Viewpoints
  {
    id: 'viewpoints-ext-2',
    part: 6,
    partName: 'Listening to Viewpoints',
    title: 'Should Schools Teach Financial Literacy?',
    context: 'Listen to three people sharing their views on whether financial literacy should be a required subject in schools.',
    audioScript: `Host: Our topic today is financial literacy education. Should Canadian schools make it a mandatory subject? Fatima, let's start with you.

Fatima: One hundred percent yes. I'm a high school teacher, and I see the consequences of financial illiteracy every day. My students are about to graduate and most of them don't understand how a credit card works. They don't know what compound interest is. They have no idea how to file a tax return. We spend years teaching them calculus that most will never use, but we don't teach them how to manage money — something everyone needs.

I surveyed my students last semester. Eighty-five percent said they wished school taught them about money management. These kids are about to take on student loans of thirty, forty, fifty thousand dollars, and they don't understand what that really means.

Host: Strong feelings there. Derek, you have a different view?

Derek: I agree that financial literacy is important, but I don't think it belongs in the school curriculum as a mandatory course. Schools are already stretched thin. Teachers are overworked, and every year we add more requirements — coding, mental health awareness, Indigenous studies. Where does it end? At some point, we need to accept that some things should be taught at home by parents.

My parents taught me about money. They gave me an allowance, showed me how to save, explained why we couldn't buy everything we wanted. That's parenting. We can't outsource every aspect of raising children to schools.

Host: And Margaret, you're somewhere in the middle?

Margaret: I'm a financial advisor, and I work with young adults every day who are drowning in debt they don't understand. So I deeply feel the problem Fatima describes. But I also hear Derek's point about overloaded schools.

My solution would be to integrate financial literacy into existing subjects rather than creating a new standalone course. Math class is the obvious one — instead of abstract problems, use real mortgage calculations, investment scenarios, and tax examples. In social studies, discuss economic policy and personal finance decisions. In English, analyze advertising and marketing techniques designed to make us spend money.

This approach doesn't require a new course, doesn't add to teachers' workloads significantly, and makes existing subjects more relevant and engaging. Several provinces in Australia have done exactly this, and student financial literacy scores improved by twenty-two percent within three years.

Host: Interesting approach. Final thoughts?

Fatima: I like Margaret's idea, but I still think you need dedicated time. Integration helps, but it's not deep enough.

Derek: Integration I could support. It doesn't add another course, and it makes subjects like math feel more useful.

Host: Thank you all for your perspectives.`,
    questions: [
      { id: 1, question: 'What is Fatima\'s profession?', options: ['Financial advisor', 'High school teacher', 'University professor', 'Government official'], correct: 1 },
      { id: 2, question: 'What percentage of Fatima\'s students wanted money management education?', options: ['65%', '75%', '85%', '95%'], correct: 2 },
      { id: 3, question: 'What is Derek\'s main argument against mandatory financial literacy courses?', options: ['Financial literacy is not important', 'Students would not be interested', 'Schools are already overloaded and parents should teach it', 'It would be too expensive'], correct: 2 },
      { id: 4, question: 'What solution does Margaret propose?', options: ['Online-only financial courses', 'Mandatory after-school programs', 'Integrate financial literacy into existing subjects', 'Hire financial advisors for every school'], correct: 2 },
      { id: 5, question: 'What evidence does Margaret cite for her approach?', options: ['Canadian schools that tried it saw improvement', 'Australian provinces saw a 22% improvement in scores', 'American studies showed better outcomes', 'UK schools reported higher graduation rates'], correct: 1 },
      { id: 6, question: 'Which proposal does Derek say he could support?', options: ['A mandatory standalone course', 'Integration into existing subjects', 'After-school financial workshops', 'None — he opposes all options'], correct: 1 }
    ]
  },

  // ============================================
  // PART 5: Listening to a Discussion
  // ============================================
  {
    id: 'discussion-1',
    part: 5,
    partName: 'Listening to a Discussion',
    title: 'Office Renovation Planning Meeting',
    context: 'Listen to a meeting between three co-workers discussing plans to renovate their office space.',
    audioScript: `Manager: Alright everyone, thanks for coming. As you know, we've been approved for an office renovation. We have a budget of forty thousand dollars, and we need to decide how to spend it. Sarah, you mentioned some ideas last week?

Sarah: Yes, I think our biggest issue is the open floor plan. There's too much noise, and people can't concentrate. I'd suggest we invest in soundproof dividers between workstations. I looked into it, and quality panels would cost about twelve thousand dollars.

Manager: That's a good point. Noise complaints have gone up thirty percent this year. Tom, what do you think?

Tom: I agree noise is a problem, but honestly, I think the kitchen and break room should be our priority. The microwave is broken, the fridge is too small, and there's nowhere comfortable to eat lunch. People end up eating at their desks, which makes the noise problem even worse. A proper break room renovation would cost about fifteen thousand.

Sarah: I see your point, Tom. If people had a nice break room, they'd leave their desks more, which would actually reduce noise in the work area.

Manager: Good thinking. What about the meeting rooms? We only have two, and they're always booked.

Tom: That's true. Last week I had to hold a client call in the hallway because both rooms were taken. Could we convert that empty storage room on the east side into a third meeting room?

Sarah: Oh, that's a great idea! It would need some work though — proper lighting, a table, maybe a screen for presentations. Probably around eight thousand dollars.

Manager: So let me add this up. Twelve for dividers, fifteen for the break room, and eight for the new meeting room. That's thirty-five thousand, which leaves us five thousand for unexpected expenses. I like it.

Tom: One more thing — can we get standing desks? Even just a few? Studies show they reduce back pain and increase productivity.

Sarah: I love that idea, but it might push us over budget. What if we start with five or six adjustable desks for people who request them? We could get decent ones for about four hundred each.

Manager: So roughly two thousand for six standing desks. That would put us at thirty-seven thousand total, still within budget. Let's go with all four items. Sarah, can you get formal quotes by Friday?

Sarah: Absolutely. I'll have everything ready.

Manager: Perfect. Let's plan to finalize next Monday.`,
    questions: [
      {
        id: 1,
        question: 'What is the total renovation budget?',
        options: [
          '$30,000',
          '$35,000',
          '$40,000',
          '$45,000'
        ],
        correct: 2
      },
      {
        id: 2,
        question: 'What does Sarah think is the biggest problem?',
        options: [
          'The break room is too small',
          'There are not enough meeting rooms',
          'The open floor plan is too noisy',
          'The office furniture is outdated'
        ],
        correct: 2
      },
      {
        id: 3,
        question: 'Why does Tom think the break room is important?',
        options: [
          'Employees complain about the food',
          'People eat at their desks, adding to noise',
          'The break room is a safety hazard',
          'Clients visit the break room'
        ],
        correct: 1
      },
      {
        id: 4,
        question: 'Where would the new meeting room be located?',
        options: [
          'Next to the kitchen',
          'On the second floor',
          'In the empty storage room on the east side',
          'In the hallway'
        ],
        correct: 2
      },
      {
        id: 5,
        question: 'How much would the soundproof dividers cost?',
        options: [
          '$8,000',
          '$10,000',
          '$12,000',
          '$15,000'
        ],
        correct: 2
      },
      {
        id: 6,
        question: 'Why does Tom want standing desks?',
        options: [
          'They are cheaper than regular desks',
          'They look more modern',
          'They reduce back pain and increase productivity',
          'The current desks are broken'
        ],
        correct: 2
      },
      {
        id: 7,
        question: 'How many standing desks will they buy?',
        options: [
          'Three',
          'Four',
          'Five or six',
          'Ten'
        ],
        correct: 2
      },
      {
        id: 8,
        question: 'What will the total estimated cost be?',
        options: [
          '$35,000',
          '$37,000',
          '$39,000',
          '$40,000'
        ],
        correct: 1
      }
    ]
  },

  // ============================================
  // PART 6: Listening to Viewpoints
  // ============================================
  {
    id: 'viewpoints-ext-1',
    part: 6,
    partName: 'Listening to Viewpoints',
    title: 'Should the City Build a New Sports Arena?',
    context: 'Listen to three community members sharing their opinions about a proposed new sports arena.',
    audioScript: `Host: Tonight we're discussing the city council's proposal to build a new sixty-million-dollar sports arena downtown. Let's hear from our panel. Marcus, you're in favor?

Marcus: Absolutely. This arena would be transformative for our city. Right now, we don't have a venue large enough to host professional sports teams or major concerts. People drive two hours to the nearest big city for entertainment. That's money leaving our community. A modern arena with fifteen thousand seats would attract NHL exhibition games, major concert tours, and sporting events that would bring visitors and revenue. Studies show similar projects in comparable cities have generated between eight and twelve million dollars annually in economic activity.

Host: Strong case. Diane, you see it differently?

Diane: I do. Look, I'm not against entertainment or economic development. But sixty million dollars is an enormous amount of money for a city our size. Our roads have potholes everywhere, our community center's roof leaks, and we just cut funding for three school programs. Shouldn't we fix what we have before building something new? And those economic impact studies Marcus mentions — they're almost always inflated. The real returns are typically thirty to fifty percent lower than projected. I'd rather invest that money in infrastructure and education, things that benefit everyone, not just sports fans.

Host: Fair points. And Raj, you have a different perspective?

Raj: I think both Marcus and Diane are partially right, but they're missing the bigger picture. The real question is who pays and who benefits. If the city puts up sixty million in taxpayer money, that's a terrible deal. But if we structure it as a public-private partnership — say, the city contributes twenty million for infrastructure improvements around the site, and a private developer covers the arena construction — that changes everything. The city gets improved roads, transit connections, and public spaces that benefit everyone, while the private sector takes the financial risk on the arena itself. I've seen this model work in three other Canadian cities. It's not either-or. It's about smart deal-making.

Host: Interesting. Marcus, do you think a private partner would be interested?

Marcus: Actually, yes. I know for a fact that two development groups have already expressed interest. The demand is there.

Diane: But even with a partnership, the city is still spending twenty million. That's twenty million that could fix our schools and roads.

Raj: True, but those infrastructure improvements around the arena would benefit the entire downtown, not just the arena. New roads, better transit, public plazas — those serve everyone whether they attend a single game or not.

Host: Thank you all. Lots to consider for our listeners.`,
    questions: [
      {
        id: 1,
        question: 'How much would the proposed arena cost?',
        options: [
          '$20 million',
          '$40 million',
          '$60 million',
          '$80 million'
        ],
        correct: 2
      },
      {
        id: 2,
        question: 'What is Marcus\'s main argument for the arena?',
        options: [
          'It would provide jobs for construction workers',
          'It would attract events and bring revenue to the city',
          'The current arena is too old',
          'Other cities have arenas'
        ],
        correct: 1
      },
      {
        id: 3,
        question: 'What does Diane think the money should be spent on?',
        options: [
          'A smaller arena outside the city',
          'Infrastructure and education',
          'A new shopping center',
          'Environmental projects'
        ],
        correct: 1
      },
      {
        id: 4,
        question: 'What does Diane say about economic impact studies?',
        options: [
          'They are always accurate',
          'They don\'t exist for this project',
          'Real returns are typically 30-50% lower than projected',
          'They only measure short-term effects'
        ],
        correct: 2
      },
      {
        id: 5,
        question: 'What solution does Raj propose?',
        options: [
          'Cancel the project entirely',
          'Build a smaller venue instead',
          'A public-private partnership',
          'Hold a public vote first'
        ],
        correct: 2
      },
      {
        id: 6,
        question: 'Under Raj\'s proposal, how much would the city contribute?',
        options: [
          '$10 million',
          '$20 million',
          '$30 million',
          '$40 million'
        ],
        correct: 1
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
