// Writing Drills — Email Structure Triplets
// 10 scenarios × 3 exercises (Opening → Body → Closing) = 30 exercises
// Based on CELPIP Writing Task 1 — 4-Part Email Formula
// Closing formula: [ACTION REQUEST] + [GRATITUDE] + [SIGN-OFF] (1-2 sentences max)
module.exports = [
  // ─── 1. Complaint: Noisy neighbor ───
  [
    { type: 'choose', question: '📧 Email to: Building Manager\n📝 Situation: Your neighbor plays loud music every night until 2 AM.\n\nWhich is the BEST opening?', options: [
      'Dear Mr. Wilson,\n\nI am writing to bring to your attention a recurring noise disturbance that has been affecting my sleep for the past three weeks.',
      'Hey,\n\nMy neighbor is so annoying with their loud music.',
      'To Whom It May Concern,\n\nI have a problem.',
      'Dear Mr. Wilson,\n\nHow are you? I hope you are doing well. I wanted to talk about something.'
    ], correct: 0, explanation: 'Formal greeting + clear purpose + timeframe. Gets straight to the point.' },
    { type: 'fillGap', sentence: 'The tenant in unit 407 consistently plays loud music past midnight. This has significantly ________ my sleep schedule and is affecting my work.', options: ['disrupted', 'changed', 'moved', 'broken'], correct: 0, explanation: '"Disrupted" precisely describes interference with a routine — formal and strong.' },
    { type: 'choose', question: 'Which is the BEST closing?', options: [
      'Could you please look into this matter? Thank you for your time.\n\nSincerely,\nAlex Chen',
      'Fix this or I\'m calling the police.\n\nBye',
      'Thanks.\n\nAlex',
      'I hope something can be done about this problem soon.\n\nAlex Chen'
    ], correct: 0, explanation: 'Action request ("look into this") + gratitude + sign-off. Short and professional.' },
  ],

  // ─── 2. Request: Schedule change at work ───
  [
    { type: 'choose', question: '📧 Email to: Your Supervisor\n📝 Situation: You need to switch from morning to afternoon shifts for a month due to a family commitment.\n\nBest opening?', options: [
      'Dear Ms. Rivera,\n\nI am writing to request a temporary schedule change for April due to a family obligation during morning hours.',
      'Hi boss,\n\nI need to switch to afternoon shifts. Can you make that happen?',
      'Dear Ms. Rivera,\n\nI\'m sorry to bother you but I have a small favor to ask.',
      'To My Supervisor,\n\nThis email is about my schedule.'
    ], correct: 0, explanation: 'Names the request, timeframe (April), and reason. Respectful without over-apologizing.' },
    { type: 'fillGap', sentence: 'My mother requires daily assistance with her therapy appointments from 8 to 10 AM. I have already ________ with my colleague James, who can cover my morning tasks.', options: ['arranged', 'talked', 'spoken', 'discussed'], correct: 0, explanation: '"Arranged" shows initiative — you already solved the problem. Much stronger than "talked."' },
    { type: 'choose', question: 'Best closing?', options: [
      'I am happy to discuss this further at your convenience. Thank you for considering my request.\n\nBest regards,\nDavid Park',
      'Let me know ASAP.\n\nThanks,\nDavid',
      'I really hope you say yes.\n\nDavid Park',
      'Please approve this. Thank you.\n\nDavid Park'
    ], correct: 0, explanation: 'Offers to discuss + thanks. Shows flexibility and professionalism in two short sentences.' },
  ],

  // ─── 3. Complaint: Wrong order at online store ───
  [
    { type: 'choose', question: '📧 Email to: Customer Service\n📝 Situation: You ordered a blue wool sweater but received a red polyester one.\n\nBest opening?', options: [
      'Dear Customer Service Team,\n\nI am writing regarding Order #58294, placed on March 5th, which arrived with an incorrect item.',
      'Hey,\n\nYou sent me the wrong sweater!',
      'Dear Sir/Madam,\n\nI am very disappointed and angry about my recent experience.',
      'Dear Customer Service Team,\n\nI am a loyal customer and I wanted to tell you about a problem.'
    ], correct: 0, explanation: 'Order number + date + specific issue. Customer service can look it up immediately.' },
    { type: 'reorder', question: 'Put these body sentences in the correct order:', words: [
      'I ordered a blue wool sweater in size medium (Item #WS-442).',
      'However, the package contained a red polyester sweater in size large.',
      'I have verified the packing slip, which confirms the error.',
      'I would like to receive the correct item or a full refund of $89.99.'
    ], correct: [0, 1, 2, 3], explanation: 'Flow: What you ordered → What you got → Proof → What you want.' },
    { type: 'fillGap', sentence: 'Please let me know how to ________ the incorrect item. Thank you for your help.\n\nSincerely,\nSarah Mitchell', options: ['return', 'send', 'give', 'ship'], correct: 0, explanation: '"Return" is the standard business term for sending back a wrong product.' },
  ],

  // ─── 4. Invitation: Community event ───
  [
    { type: 'fillGap', sentence: 'Dear Neighbors,\n\nI am excited to ________ you to our annual Spring Community BBQ on Saturday, April 12th, from 2 to 6 PM at Riverside Park.', options: ['invite', 'call', 'ask', 'tell'], correct: 0, explanation: '"Invite" is the proper word for extending an invitation.' },
    { type: 'choose', question: '📧 Community BBQ invitation — which body paragraph has the BEST details?', options: [
      'Please bring a dish to share that serves 6-8 people. We\'ll provide the grill, drinks, and plates. There will be face painting and a treasure hunt for children.',
      'There will be food and drinks and things to do. Bring something if you want.',
      'The BBQ will be fun. Everyone should come and bring food.',
      'We are planning many things. Please come and enjoy yourself.'
    ], correct: 0, explanation: 'Specific details: what to bring, what\'s provided, kids\' activities. People can actually plan.' },
    { type: 'choose', question: 'Best closing for this invitation?', options: [
      'Please RSVP by April 5th by replying to this email. Feel free to bring lawn chairs!\n\nWarm regards,\nLisa and Tom Chen, Unit 302',
      'Come if you want.\n\nLisa',
      'Let me know if you\'re coming.\n\nThanks',
      'We look forward to your attendance.\n\nSincerely,\nLisa Chen'
    ], correct: 0, explanation: 'RSVP deadline + practical tip + warm tone + identifies who they are.' },
  ],

  // ─── 5. Apology: Missing a meeting ───
  [
    { type: 'choose', question: '📧 Email to: Your Team Leader\n📝 Situation: You missed an important project meeting due to a family emergency.\n\nBest opening?', options: [
      'Dear Mr. Nakamura,\n\nI sincerely apologize for missing yesterday\'s project meeting. An unexpected family emergency required my immediate attention.',
      'Hi,\n\nSorry I missed the meeting. Something came up.',
      'Dear Mr. Nakamura,\n\nI am writing to tell you about what happened yesterday.',
      'Dear Mr. Nakamura,\n\nI\'m so sorry. Please don\'t be mad.'
    ], correct: 0, explanation: 'Direct apology + specific meeting + reason. Professional and honest.' },
    { type: 'fillGap', sentence: 'I have already reviewed the meeting notes Sarah shared. I am fully ________ on the new timeline and will complete my tasks by Friday.', options: ['caught up', 'aware', 'informed', 'updated'], correct: 0, explanation: '"Caught up" shows you took initiative to learn what you missed.' },
    { type: 'choose', question: 'Best closing?', options: [
      'Please let me know if I missed anything else. Thank you for your understanding.\n\nBest regards,\nEmma Rodriguez',
      'Sorry again. Won\'t happen again.\n\nEmma',
      'I hope this doesn\'t affect my review.\n\nEmma Rodriguez',
      'Thank you for not being upset.\n\nRegards,\nEmma Rodriguez'
    ], correct: 0, explanation: 'Offers to catch up on anything missed + thanks. Brief and accountable.' },
  ],

  // ─── 6. Recommendation: Restaurant to a friend ───
  [
    { type: 'choose', question: '📧 Email to: Your Friend\n📝 Situation: Your friend asked for a restaurant recommendation for their anniversary.\n\nBest opening for this INFORMAL email?', options: [
      'Hey Michelle!\n\nI\'ve got the perfect place for your anniversary — Bella Vista on Commercial Drive!',
      'Dear Michelle,\n\nI am writing to recommend a restaurant for your upcoming anniversary.',
      'Hi,\n\nThere\'s a good restaurant you should try.',
      'Hey!\n\nSo about restaurants... let me think...'
    ], correct: 0, explanation: 'Informal but enthusiastic — matches a friend relationship. Names the place right away.' },
    { type: 'fillGap', sentence: 'We went there last year and the atmosphere was incredibly ________. They have candlelit tables by the window overlooking the garden.', options: ['romantic', 'nice', 'good', 'beautiful'], correct: 0, explanation: '"Romantic" is the most relevant word for an anniversary dinner. "Nice" is too vague.' },
    { type: 'choose', question: 'Best closing?', options: [
      'I\'d book for 7 PM Saturday — that\'s when the live jazz starts. It\'s about $50-60 per person. Let me know how it goes!\n\nXo,\nJen',
      'Anyway, that\'s my recommendation.\n\nJen',
      'I hope this information helps.\n\nRegards,\nJen',
      'You should definitely go. Bye!\n\nJen'
    ], correct: 0, explanation: 'Practical tips (time, price) + wants to hear back. Helpful and personal.' },
  ],

  // ─── 7. Request: Refund for gym membership ───
  [
    { type: 'fillGap', sentence: 'Dear Fitness First Management,\n\nI am writing to request a refund for my annual membership (Account #GF-29384), purchased on January 15th for $_________.', options: ['599.99', 'some money', 'a lot', 'the annual fee'], correct: 0, explanation: 'Always include the exact amount — specific and verifiable.' },
    { type: 'choose', question: 'Which body paragraph makes the STRONGEST case?', options: [
      'My doctor, Dr. Lee at Vancouver General, has advised me to avoid exercise for six months after my knee surgery on February 28th. I have attached the medical certificate. Per your agreement (Section 4.2), medical cases qualify for a refund.',
      'I got hurt and can\'t use the gym. I think I should get my money back.',
      'I have a medical issue and my doctor said no exercise. Please refund me.',
      'I haven\'t used the gym in a month due to health reasons. I would like a refund.'
    ], correct: 0, explanation: 'Doctor name + date + proof + references THEIR policy. Nearly impossible to refuse.' },
    { type: 'choose', question: 'Best closing?', options: [
      'Please let me know the next steps for processing a pro-rated refund. Thank you for your assistance.\n\nSincerely,\nRobert Kim',
      'Refund me ASAP.\n\nRobert',
      'I hope you will consider my request.\n\nRobert Kim',
      'Give me my money back or I\'ll post a bad review.\n\nRobert Kim'
    ], correct: 0, explanation: 'Asks for next steps + thanks. Professional, cooperative, and brief.' },
  ],

  // ─── 8. Thank you: After job interview ───
  [
    { type: 'choose', question: '📧 Email to: Interviewer\n📝 Situation: You had a job interview yesterday for a Marketing Manager position.\n\nBest opening?', options: [
      'Dear Ms. Blackwell,\n\nThank you for meeting with me yesterday about the Marketing Manager role. I enjoyed learning about Apex Media\'s plans for the Canadian market.',
      'Hi,\n\nThanks for the interview. I think it went well.',
      'Dear Ms. Blackwell,\n\nI am writing to follow up on my interview.',
      'Dear Ms. Blackwell,\n\nThank you so much! I loved everything about your company!'
    ], correct: 0, explanation: 'Thanks + position + company + specific topic discussed. Shows you were listening.' },
    { type: 'fillGap', sentence: 'Our discussion about using social media analytics to find market trends particularly ________ with me, as it aligns with my previous campaign work.', options: ['resonated', 'connected', 'matched', 'agreed'], correct: 0, explanation: '"Resonated with me" — sophisticated vocabulary showing deep connection to the topic.' },
    { type: 'fillGap', sentence: 'I am confident I can make a meaningful ________ to your team. Please feel free to reach out if you need anything else.\n\nWarm regards,\nMichael Torres', options: ['contribution', 'difference', 'impact', 'addition'], correct: 0, explanation: '"Make a meaningful contribution" — the standard professional phrase for adding value.' },
  ],

  // ─── 9. Complaint: Poor service at restaurant ───
  [
    { type: 'choose', question: '📧 Email to: Restaurant Manager\n📝 Situation: Terrible experience during your wife\'s birthday dinner.\n\nBest opening?', options: [
      'Dear Manager,\n\nI am writing about a disappointing dining experience at La Maison on Saturday, March 8th, during my wife\'s birthday celebration.',
      'Hey Manager,\n\nWorst restaurant experience ever.',
      'Dear Manager,\n\nI want to complain. The food and service were terrible.',
      'To the Manager,\n\nMy wife and I went to your restaurant and we were very upset.'
    ], correct: 0, explanation: 'Restaurant name + date + occasion. Factual and measured tone.' },
    { type: 'reorder', question: 'Order these body sentences logically:', words: [
      'Despite our 7:30 PM reservation, we waited 25 minutes without acknowledgment.',
      'Our appetizers took 40 minutes and arrived cold.',
      'My wife\'s salmon was undercooked and had to be sent back twice.',
      'Throughout the evening, our server rarely checked on us.'
    ], correct: [0, 1, 2, 3], explanation: 'Chronological: arrival → appetizers → main course → service. Bad to worse builds impact.' },
    { type: 'choose', question: 'Best closing?', options: [
      'I would appreciate a gesture of goodwill, such as a complimentary meal. Thank you for looking into this.\n\nSincerely,\nJames Wright',
      'I want a full refund immediately.\n\nJames Wright',
      'I\'ll be posting this on Google and Yelp.\n\nJames Wright',
      'I hope things improve. Good luck.\n\nJames'
    ], correct: 0, explanation: 'Specific request + polite tone. Diplomatic approach gets better results.' },
  ],

  // ─── 10. Request: Letter of recommendation ───
  [
    { type: 'choose', question: '📧 Email to: Former Professor\n📝 Situation: You need a recommendation letter for a Master\'s program.\n\nBest opening?', options: [
      'Dear Professor Anderson,\n\nI hope this finds you well. Would you be willing to write a recommendation for my application to the Master of Data Science at U of T?',
      'Hi Professor,\n\nCan you write me a recommendation letter?',
      'Dear Professor Anderson,\n\nI need a favor for grad school.',
      'Dear Professor Anderson,\n\nRemember me? I need your help.'
    ], correct: 0, explanation: 'Polite + specific ask + exact program + university. Helps professors say yes.' },
    { type: 'fillGap', sentence: 'I completed your Advanced Statistics course in Fall 2024 with an A+ and led the group project you described as "________."', options: ['exceptional', 'very good', 'impressive', 'great'], correct: 0, explanation: '"Exceptional" — strongest academic compliment. Quoting them gives material for the letter.' },
    { type: 'choose', question: 'Best closing?', options: [
      'The deadline is April 30th. I\'ve attached my CV and program details for reference. Thank you for considering this.\n\nRespectfully,\nPreia Sharma',
      'Please let me know. Thanks!\n\nPreia',
      'I need it by next month. Here\'s my CV.\n\nPreia Sharma',
      'It would mean the world to me. I really need this.\n\nPreia Sharma'
    ], correct: 0, explanation: 'Clear deadline + helpful attachments + thanks. Makes it easy for the professor.' },
  ],
];
