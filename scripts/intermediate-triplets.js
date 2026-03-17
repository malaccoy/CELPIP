// Speaking Drills Intermediate Triplets — CLB 7-8
// 50 triplets = 150 exercises
// FOCUSED on CELPIP Speaking 8 tasks — more complex vocabulary & longer responses than Beginner
// T1=Giving Advice, T2=Personal Experience, T3=Describe Scene, T4=Predictions
// T5=Compare & Persuade, T6=Difficult Situation, T7=Opinion, T8=Unusual Situation
module.exports = [
  // ─── T1: GIVING ADVICE (1-7) ───
  // 1. T1 - Friend considering career change
  [
    { type: 'choose', question: '[Task 1 — Giving Advice] Your friend is thinking about quitting their stable job to start a business. What advice would you give?', options: ['Just follow your dream.', 'I\'d recommend keeping your job for now while you develop your business plan on the side. That way, you\'ll have a safety net in case things take longer than expected. Once you have some clients, you can make the transition.', 'Don\'t take the risk.', 'Ask your parents what to do.'], correct: 1, explanation: 'This advice acknowledges the goal, offers a practical strategy, and explains the reasoning — exactly what Task 1 expects.' },
    { type: 'fillGap', sentence: 'I\'d recommend keeping your job for now while you develop your business plan on the ________.', options: ['side', 'way', 'go', 'run'], correct: 0, explanation: '"On the side" means doing something in addition to your main activity.' },
    'I\'d recommend keeping your job while you develop your business plan on the side. That way, you\'ll have a safety net until you have some clients.',
    'In Task 1, acknowledge what the person wants, then give practical steps. Use "that way" to connect your advice to its benefit.'
  ],
  // 2. T1 - Neighbor having trouble with teenager
  [
    { type: 'choose', question: '[Task 1 — Giving Advice] Your neighbor tells you their teenager has been skipping school. What do you suggest?', options: ['Ground them immediately.', 'I think the first step would be to sit down and have an open conversation without getting angry. Try to understand why they\'re skipping — maybe they\'re being bullied or struggling with a subject. Then you can work on a solution together.', 'Call the school.', 'Kids will be kids.'], correct: 1, explanation: 'Step-by-step advice: first action → possible reasons → collaborative solution. Shows empathy and structure.' },
    { type: 'reorder', question: 'Order this advice:', words: ['First, have an open conversation', 'without getting angry.', 'Try to understand why', 'they\'re skipping school.', 'Then work on a solution together.'], correct: [0, 1, 2, 3, 4], explanation: 'Advice flows: First step → understand → collaborate. Sequential structure.' },
    'I think the first step would be to sit down and have an open conversation. Try to understand why they\'re skipping, then work on a solution together.',
    'Use sequence markers: "The first step," "Then," "After that." They organize your advice clearly.'
  ],
  // 3. T1 - Friend struggling with work-life balance
  [
    { type: 'choose', question: '[Task 1 — Giving Advice] Your friend works 60 hours a week and feels burned out. What would you recommend?', options: ['Find a new job.', 'If I were you, I\'d start by setting clear boundaries with your employer about working hours. It\'s also important to schedule time for activities you enjoy — even 30 minutes a day can make a big difference for your mental health.', 'Just work harder so you finish faster.', 'Take a long vacation.'], correct: 1, explanation: '"If I were you" + professional boundary + self-care suggestion + specific detail. Well-rounded advice.' },
    { type: 'match', question: 'Match the advanced advice phrase:', pairs: [{ left: 'If I were you, I\'d...', right: 'Empathetic suggestion' }, { left: 'It\'s also important to...', right: 'Adding a second point' }, { left: 'That can make a big difference for...', right: 'Explaining the benefit' }], explanation: 'These CLB 7-8 phrases show sophistication in giving advice.' },
    'If I were you, I\'d start by setting clear boundaries about working hours. It\'s also important to schedule time for activities you enjoy.',
    '"If I were you" is more empathetic than "you should." It shows you\'re putting yourself in their position.'
  ],
  // 4. T1 - Friend wants to improve their CELPIP score
  [
    { type: 'choose', question: '[Task 1 — Giving Advice] Your friend took the CELPIP test and didn\'t get the score they needed. What do you advise?', options: ['Study harder.', 'I\'d suggest focusing on your weakest sections first rather than trying to improve everything at once. For speaking, practice recording yourself and listening back — it really helps you notice pronunciation issues you might not catch otherwise.', 'Take the test again immediately.', 'Maybe this test isn\'t for you.'], correct: 1, explanation: 'Prioritization strategy + specific technique + explanation of why it works.' },
    { type: 'fillGap', sentence: 'Practice recording yourself and listening back — it really helps you notice pronunciation issues you might not ________ otherwise.', options: ['catch', 'find', 'see', 'hear'], correct: 0, explanation: '"Catch" means to notice something that\'s easy to miss — very natural usage.' },
    'I\'d suggest focusing on your weakest sections first. For speaking, practice recording yourself and listening back to notice pronunciation issues.',
    'Give targeted advice, not general. "Focus on weakest sections" is more helpful than "study more."'
  ],
  // 5. T1 - Friend dealing with noisy roommate
  [
    { type: 'choose', question: '[Task 1 — Giving Advice] Your friend\'s roommate stays up late playing video games loudly. What do you suggest?', options: ['Move out.', 'I think you should approach them in a friendly way and explain how it\'s affecting your sleep. You could suggest setting quiet hours after 10 PM, and maybe offer a compromise like using headphones. If that doesn\'t work, you might want to involve the landlord.', 'Tell them to stop.', 'Buy earplugs.'], correct: 1, explanation: 'Escalating approach: friendly talk → specific solution → compromise → backup plan. Shows maturity.' },
    { type: 'fillGap', sentence: 'You could suggest setting quiet hours after 10 PM, and maybe offer a ________ like using headphones.', options: ['compromise', 'deal', 'trade', 'solution'], correct: 0, explanation: '"Offer a compromise" means suggesting something that works for both sides.' },
    'Approach them in a friendly way and suggest setting quiet hours. You could offer a compromise like headphones. If that doesn\'t work, involve the landlord.',
    'Show escalation: try the nice approach first, then have a backup plan. CELPIP loves structured thinking.'
  ],
  // 6. T1 - Friend anxious about driving test
  [
    { type: 'choose', question: '[Task 1 — Giving Advice] Your friend failed their driving test twice and is very anxious about trying again. What do you say?', options: ['Maybe driving isn\'t for you.', 'It\'s completely normal to feel anxious after failing, but don\'t let that stop you. I\'d recommend booking a few extra lessons with a professional instructor to build your confidence. Also, try to practice in the area where the test takes place so it feels familiar.', 'Just relax and try again.', 'You should have studied more.'], correct: 1, explanation: 'Validates feelings → encouragement → practical step 1 → practical step 2. Empathetic and action-oriented.' },
    { type: 'reorder', question: 'Order this supportive advice:', words: ['It\'s normal to feel anxious.', 'Don\'t let that stop you.', 'Book extra lessons with a professional.', 'Also, practice in the test area', 'so it feels familiar.'], correct: [0, 1, 2, 3, 4], explanation: 'Validate → encourage → action 1 → action 2 → reason.' },
    'It\'s normal to feel anxious, but don\'t let that stop you. Book extra lessons to build confidence, and practice in the test area so it feels familiar.',
    'Always validate feelings before giving advice: "It\'s normal to feel..." Then offer solutions.'
  ],
  // 7. T1 - Friend considering adopting a pet
  [
    { type: 'choose', question: '[Task 1 — Giving Advice] Your friend wants to adopt a dog but works full-time. What advice do you give?', options: ['Don\'t get a dog then.', 'I think adopting a dog is a wonderful idea, but you need to plan carefully. You might want to look into doggy daycare or ask a neighbor to walk the dog midday. I\'d also suggest adopting an older dog since they\'re usually calmer and need less attention than puppies.', 'Get a cat instead.', 'Dogs are too much work.'], correct: 1, explanation: 'Supports the goal → acknowledges concern → offers solutions → specific recommendation with reason.' },
    { type: 'fillGap', sentence: 'I\'d suggest adopting an older dog since they\'re usually calmer and need less ________ than puppies.', options: ['attention', 'care', 'work', 'time'], correct: 0, explanation: '"Need less attention" is the most natural way to describe lower maintenance pets.' },
    'I think adopting a dog is wonderful, but plan carefully. Look into doggy daycare, and consider an older dog since they\'re calmer than puppies.',
    'Support their idea first, then give practical considerations. Don\'t just say no — help them make it work.'
  ],

  // ─── T2: PERSONAL EXPERIENCE (8-13) ───
  // 8. T2 - A time you had to adapt to change
  [
    { type: 'choose', question: '[Task 2 — Personal Experience] Describe a time when you had to adapt to a major change in your life. Which response is best?', options: ['I\'ve had many changes in my life.', 'When my company restructured last year, I was moved to a completely different department. At first, I was overwhelmed because I had to learn new software and work with unfamiliar colleagues. However, I decided to stay positive, asked lots of questions, and within two months, I became one of the top performers in the new team.', 'Change happens to everyone.', 'I moved to Canada and it was hard.'], correct: 1, explanation: 'Specific event → feelings → challenge → attitude → action → outcome with timeline.' },
    { type: 'match', question: 'Match the story connector:', pairs: [{ left: 'At first', right: 'Initial reaction' }, { left: 'However', right: 'Turning point' }, { left: 'Within two months', right: 'Timeline of progress' }], explanation: 'Connectors guide the listener through your story: beginning → shift → result.' },
    'When my company restructured, I was moved to a different department. At first I was overwhelmed, but I stayed positive and asked questions. Within two months, I became a top performer.',
    'Use time markers and transition words: "At first... However... Within [time]..." They show progression.'
  ],
  // 9. T2 - A goal you achieved
  [
    { type: 'choose', question: '[Task 2 — Personal Experience] Talk about a goal you set for yourself and achieved. Best response?', options: ['I achieve goals all the time.', 'Two years ago, I decided to run a half marathon even though I could barely jog for five minutes. I created a training schedule, ran four times a week, and gradually increased my distance. On race day, I finished in under two hours. It taught me that consistency is more important than talent.', 'I graduated from university.', 'I wanted to lose weight and I did.'], correct: 1, explanation: 'Starting point → plan → process → result → lesson. Complete achievement narrative.' },
    { type: 'fillGap', sentence: 'I created a training schedule, ran four times a week, and ________ increased my distance.', options: ['gradually', 'slowly', 'quickly', 'finally'], correct: 0, explanation: '"Gradually" means step by step over time — perfect for describing steady improvement.' },
    'I decided to run a half marathon even though I could barely jog. I created a schedule and gradually increased my distance. It taught me that consistency matters more than talent.',
    'Start with a contrast: where you were vs. where you wanted to be. Then show the journey.'
  ],
  // 10. T2 - A time you helped a stranger
  [
    { type: 'choose', question: '[Task 2 — Personal Experience] Tell about a time you helped someone you didn\'t know. Which is best?', options: ['I help people whenever I can.', 'Last winter, I noticed an elderly woman struggling to carry heavy grocery bags on an icy sidewalk. I offered to carry them to her car, and we ended up chatting the whole way. She told me she had recently lost her husband and rarely had anyone to talk to. That experience reminded me how small acts of kindness can mean so much to someone.', 'I gave money to a homeless person once.', 'I always try to be helpful.'], correct: 1, explanation: 'Setting + observation + action + unexpected depth + personal reflection. Rich storytelling.' },
    { type: 'reorder', question: 'Order this experience:', words: ['I noticed an elderly woman', 'struggling with grocery bags.', 'I offered to carry them to her car.', 'She told me she rarely had company.', 'That reminded me how kindness matters.'], correct: [0, 1, 2, 3, 4], explanation: 'Notice → action → deeper connection → reflection.' },
    'Last winter, I noticed an elderly woman struggling with grocery bags on an icy sidewalk. I offered to help, and she told me she rarely had anyone to talk to. Small acts of kindness can mean so much.',
    'The best stories have an unexpected layer. Don\'t just tell what happened — share what you discovered.'
  ],
  // 11. T2 - A cultural difference you experienced
  [
    { type: 'choose', question: '[Task 2 — Personal Experience] Describe a cultural difference you experienced in Canada. Best answer?', options: ['Canada is very different from my country.', 'When I first arrived in Canada, I was surprised that people apologize so often — even if someone bumps into you, they say sorry. In my culture, that would seem unusual. Over time, I came to appreciate it because it creates a respectful atmosphere in public spaces. Now I catch myself doing it too.', 'The food is different here.', 'People here speak English.'], correct: 1, explanation: 'Specific observation + cultural comparison + gradual understanding + humor at the end.' },
    { type: 'fillGap', sentence: 'Over time, I came to ________ it because it creates a respectful atmosphere in public spaces.', options: ['appreciate', 'understand', 'like', 'accept'], correct: 0, explanation: '"Came to appreciate" shows gradual positive change in perspective — more nuanced than "liked."' },
    'When I first arrived, I was surprised that Canadians apologize so often. Over time, I came to appreciate it because it creates a respectful atmosphere. Now I catch myself doing it too!',
    'Cultural observations + personal evolution = great Task 2 content. Show how you changed.'
  ],
  // 12. T2 - A mistake that taught you something
  [
    { type: 'choose', question: '[Task 2 — Personal Experience] Talk about a mistake you made and what you learned from it.', options: ['Everyone makes mistakes.', 'During my first month at a new job, I accidentally sent a confidential email to the wrong client. I immediately told my manager, and together we contacted the client to apologize and resolve the issue. I learned that being transparent about mistakes earns more respect than trying to hide them.', 'I made a mistake at school once.', 'I try not to make mistakes.'], correct: 1, explanation: 'Specific mistake + immediate action + resolution + lesson learned. Shows accountability.' },
    { type: 'fillGap', sentence: 'I learned that being ________ about mistakes earns more respect than trying to hide them.', options: ['transparent', 'honest', 'open', 'clear'], correct: 0, explanation: '"Transparent" means being completely honest and open — slightly more formal than just "honest."' },
    'I accidentally sent a confidential email to the wrong client. I immediately told my manager and we resolved it together. Being transparent about mistakes earns more respect than hiding them.',
    'Mistakes are powerful stories. Show: what went wrong → what you did immediately → what you learned.'
  ],
  // 13. T2 - An event that changed your perspective
  [
    { type: 'choose', question: '[Task 2 — Personal Experience] Talk about an event that changed how you think about something.', options: ['Many things have changed my mind.', 'I used to think volunteering was a waste of time until a friend convinced me to help at a food bank. Seeing families who couldn\'t afford groceries completely changed my perspective. Now I volunteer twice a month and I\'ve realized that giving your time is just as valuable as giving money.', 'I changed my mind about something once.', 'Reading books changes your perspective.'], correct: 1, explanation: 'Before belief → catalyst → eye-opening moment → new behavior → new understanding.' },
    { type: 'match', question: 'Match the narrative technique:', pairs: [{ left: 'I used to think...', right: 'Old perspective' }, { left: 'Seeing families... changed my...', right: 'Turning point' }, { left: 'Now I volunteer and I\'ve realized...', right: 'New behavior & insight' }], explanation: '"Before → turning point → after" is the most powerful story structure.' },
    'I used to think volunteering was a waste of time. Seeing families who couldn\'t afford groceries at a food bank completely changed my perspective. Now I volunteer twice a month.',
    '"I used to think X until Y happened" is a powerful opening for stories about change.'
  ],

  // ─── T3: DESCRIBE A SCENE (14-19) ───
  // 14. T3 - Beach scene with activity
  [
    { type: 'choose', question: '[Task 3 — Describe a Scene] You see a picture of a crowded beach on a hot day. Which description covers the most ground?', options: ['People are at the beach.', 'This picture shows a crowded beach on what appears to be a hot summer day. In the foreground, a group of children are building an elaborate sandcastle near the water. To the right, several adults are playing beach volleyball, and in the background, I can see sailboats on the horizon. Everyone seems to be thoroughly enjoying themselves.', 'There\'s sand, water, and people.', 'The beach looks nice and sunny.'], correct: 1, explanation: 'Overview → foreground detail → right side → background → mood/inference. Covers multiple areas systematically.' },
    { type: 'fillGap', sentence: 'This picture shows a crowded beach on what ________ to be a hot summer day.', options: ['appears', 'looks', 'seems', 'feels'], correct: 0, explanation: '"Appears to be" is a more formal way of making an inference about what you see — good for CLB 7-8.' },
    'This picture shows a crowded beach on what appears to be a hot summer day. Children are building sandcastles in the foreground, adults are playing volleyball to the right, and sailboats are visible on the horizon.',
    'Use "what appears to be" for inferences — it sounds more sophisticated than "it looks like."'
  ],
  // 15. T3 - Hospital waiting room
  [
    { type: 'choose', question: '[Task 3 — Describe a Scene] You see a picture of a hospital waiting room. How do you describe the atmosphere?', options: ['It\'s a hospital.', 'The waiting room has a tense atmosphere. In the center, an anxious-looking man is pacing back and forth while checking his phone. To the left, a mother is comforting her young child who appears to be crying. A nurse at the reception desk seems overwhelmed with paperwork. The fluorescent lighting adds to the sterile, uncomfortable feeling of the space.', 'People are waiting for the doctor.', 'It looks like a hospital waiting room.'], correct: 1, explanation: 'Atmosphere + three people with emotions/actions + environmental detail that reinforces the mood.' },
    { type: 'reorder', question: 'Order this scene description:', words: ['The waiting room has a tense atmosphere.', 'An anxious man is pacing back and forth.', 'A mother is comforting her crying child.', 'A nurse seems overwhelmed with paperwork.', 'The fluorescent lighting adds to the sterile feeling.'], correct: [0, 1, 2, 3, 4], explanation: 'Overall mood → person 1 → person 2 → person 3 → environmental detail reinforcing mood.' },
    'The waiting room has a tense atmosphere. A man is pacing anxiously, a mother is comforting her crying child, and a nurse seems overwhelmed. The fluorescent lighting adds to the uncomfortable feeling.',
    'Describe the ATMOSPHERE first, then show how each person and detail supports that atmosphere.'
  ],
  // 16. T3 - Farmers market
  [
    { type: 'choose', question: '[Task 3 — Describe a Scene] You see a picture of a busy farmers market. What inference could you make?', options: ['People are buying food.', 'Based on the colorful displays of fresh produce and the long lines at each stall, this seems to be a very popular farmers market — probably on a weekend morning. The customers appear to be a mix of families and elderly couples, which suggests this market caters to the whole community rather than just one demographic.', 'The market has vegetables.', 'It looks busy.'], correct: 1, explanation: 'Observations (displays, lines) → inference (popular, weekend) → demographic analysis → conclusion. Deep thinking.' },
    { type: 'fillGap', sentence: 'The customers appear to be a mix of families and elderly couples, which ________ this market caters to the whole community.', options: ['suggests', 'shows', 'means', 'proves'], correct: 0, explanation: '"Suggests" is the best word for making an inference — it\'s not a fact, it\'s your interpretation.' },
    'Based on the colorful displays and long lines, this seems to be a popular farmers market on a weekend morning. The mix of families and elderly couples suggests it caters to the whole community.',
    'Use "which suggests" or "based on" to connect observations to inferences. Shows analytical thinking.'
  ],
  // 17. T3 - Construction site
  [
    { type: 'choose', question: '[Task 3 — Describe a Scene] You see a picture of a construction site with workers. What specific detail should you add?', options: ['Workers are building something.', 'In the center of the image, a worker wearing an orange safety vest is operating a crane to lift steel beams. His facial expression suggests he\'s concentrating intensely on the task, which makes sense given how dangerous this type of work can be.', 'There are buildings being built.', 'I see a construction site.'], correct: 1, explanation: 'Specific worker + clothing + action + equipment + facial expression + reason for expression. Rich detail.' },
    { type: 'fillGap', sentence: 'His facial expression suggests he\'s concentrating ________ on the task.', options: ['intensely', 'carefully', 'deeply', 'heavily'], correct: 0, explanation: '"Concentrating intensely" is more vivid and descriptive than "carefully" — CLB 7-8 vocabulary.' },
    'A worker wearing an orange safety vest is operating a crane to lift steel beams. His expression suggests he\'s concentrating intensely, which makes sense given how dangerous the work is.',
    'Describe what people WEAR and their EXPRESSIONS — it makes your description vivid and specific.'
  ],
  // 18. T3 - Library scene
  [
    { type: 'choose', question: '[Task 3 — Describe a Scene] You see a picture of a modern library. How do you describe the contrast in activities?', options: ['People are reading and studying.', 'This modern library presents an interesting contrast. On one side, students are hunched over textbooks in complete silence, clearly preparing for exams. On the other side, a group of children are sitting cross-legged on a colorful carpet, listening enthusiastically to a librarian reading a story. It demonstrates how libraries serve different needs simultaneously.', 'The library is quiet.', 'I can see books and computers.'], correct: 1, explanation: 'Identifies a contrast → describes both sides → observation about what this means. Analytical description.' },
    { type: 'match', question: 'Match the descriptive technique:', pairs: [{ left: 'This presents an interesting contrast', right: 'Identifying a pattern' }, { left: 'On one side... on the other', right: 'Spatial comparison' }, { left: 'It demonstrates how...', right: 'Drawing a conclusion' }], explanation: 'Contrast + comparison + conclusion shows sophisticated analysis of a scene.' },
    'This library presents an interesting contrast. Students are studying in silence on one side, while children listen to a story on the other. Libraries serve different needs simultaneously.',
    'Look for CONTRASTS in pictures — quiet vs. loud, old vs. young, busy vs. relaxed. They make great observations.'
  ],
  // 19. T3 - Traffic scene
  [
    { type: 'choose', question: '[Task 3 — Describe a Scene] You see a picture of a traffic jam during rush hour with frustrated drivers. What inference adds depth?', options: ['Cars are stuck in traffic.', 'The bumper-to-bumper traffic and frustrated expressions on drivers\' faces suggest this is a regular rush hour commute rather than an accident. Some drivers appear to be talking on their phones, while others are sipping coffee, which indicates they\'re used to this routine. This scene highlights why many cities are investing in public transit.', 'Traffic is bad.', 'People should take the bus.'], correct: 1, explanation: 'Identifies type of traffic (routine vs. accident) → evidence → behavioral details → broader social commentary.' },
    { type: 'fillGap', sentence: 'Some drivers appear to be talking on phones while others are sipping coffee, which ________ they\'re used to this routine.', options: ['indicates', 'shows', 'means', 'tells'], correct: 0, explanation: '"Indicates" is a formal inference word — excellent for CLB 7-8 level descriptions.' },
    'The bumper-to-bumper traffic and frustrated expressions suggest this is a regular commute. Some drivers are talking on phones or sipping coffee, which indicates they\'re used to this routine.',
    'Look for behavioral clues: what people do habitually tells you about the situation.'
  ],

  // ─── T4: MAKING PREDICTIONS (20-25) ───
  // 20. T4 - Student studying late at night
  [
    { type: 'choose', question: '[Task 4 — Making Predictions] You see a picture of a student surrounded by books and empty coffee cups at 2 AM. What do you predict?', options: ['They\'re studying hard.', 'This student is clearly cramming for an exam tomorrow. I predict they\'ll probably stay up all night and feel exhausted during the test. Based on the number of empty coffee cups, they might even crash and oversleep if they\'re not careful. In the long run, this habit of last-minute studying will likely affect their health and grades.', 'They should go to sleep.', 'They\'re drinking too much coffee.'], correct: 1, explanation: 'Short-term prediction → risk → long-term prediction. Multiple timeframes show depth.' },
    { type: 'fillGap', sentence: 'Based on the number of empty coffee cups, they might even crash and ________ if they\'re not careful.', options: ['oversleep', 'collapse', 'faint', 'fail'], correct: 0, explanation: '"Crash and oversleep" — "crash" informally means to suddenly fall asleep from exhaustion.' },
    'This student is clearly cramming for an exam. They\'ll probably stay up all night and feel exhausted during the test. This habit will likely affect their health and grades.',
    'Make predictions at different timeframes: immediate, near future, and long-term. Shows deeper thinking.'
  ],
  // 21. T4 - Couple arguing at restaurant
  [
    { type: 'choose', question: '[Task 4 — Making Predictions] You see a picture of a couple at a restaurant looking upset, not talking to each other. What might happen next?', options: ['They\'re having dinner.', 'It seems like this couple is having a disagreement. I predict one of them might suggest leaving the restaurant early since neither appears to be enjoying the meal. They\'ll likely have a serious conversation when they get home, and hopefully they\'ll be able to resolve whatever issue is causing the tension.', 'They should talk about it.', 'The food is probably bad.'], correct: 1, explanation: 'Identifies situation → immediate prediction → follow-up prediction → hopeful outcome. Sensitivity + range.' },
    { type: 'reorder', question: 'Order these predictions:', words: ['This couple seems to be having a disagreement.', 'One of them might suggest leaving early.', 'They\'ll likely have a serious conversation at home.', 'Hopefully they\'ll resolve the issue.'], correct: [0, 1, 2, 3], explanation: 'Observation → immediate → later → hopeful outcome. Shows prediction range.' },
    'This couple seems to be having a disagreement. One might suggest leaving early. They\'ll likely have a serious conversation at home and hopefully resolve the issue.',
    'It\'s okay to end predictions with a hopeful outcome — "hopefully they\'ll..." adds a human touch.'
  ],
  // 22. T4 - New business opening
  [
    { type: 'choose', question: '[Task 4 — Making Predictions] You see a picture of a new café opening in a neighborhood with many other cafés. What do you predict about this business?', options: ['It will be successful.', 'Given the number of competing cafés in the area, this new business will need to offer something unique to survive. I predict they\'ll initially attract curious customers, but they\'ll probably struggle to maintain steady business unless they differentiate themselves with specialty products or better prices.', 'Another café? It will fail.', 'People love coffee, so it\'ll be fine.'], correct: 1, explanation: 'Analyzes context → initial phase → challenge → condition for success. Business-minded prediction.' },
    { type: 'fillGap', sentence: 'They\'ll probably struggle to maintain steady business unless they ________ themselves with specialty products.', options: ['differentiate', 'separate', 'distinguish', 'change'], correct: 0, explanation: '"Differentiate themselves" means making yourself stand out from competitors — business vocabulary.' },
    'Given the competing cafés, this business will need something unique. They\'ll attract curious customers initially but may struggle unless they differentiate with specialty products or better prices.',
    'Use "unless" and "given that" to make conditional predictions — they show critical thinking.'
  ],
  // 23. T4 - Snow starting to fall
  [
    { type: 'choose', question: '[Task 4 — Making Predictions] You see heavy snow starting to fall in a picture of a busy highway. What predictions can you make?', options: ['It\'s snowing.', 'With heavy snow falling on a busy highway, I predict traffic will slow down significantly within the next hour. There will probably be several accidents due to slippery conditions, and some drivers might decide to pull over and wait it out. The city will likely need to deploy snowplows and salt trucks to keep the roads safe.', 'People should drive carefully.', 'The snow will stop eventually.'], correct: 1, explanation: 'Immediate prediction → consequence → individual reaction → city response. Multiple actors involved.' },
    { type: 'match', question: 'Match the prediction connector:', pairs: [{ left: 'With heavy snow falling...', right: 'Setting the context' }, { left: 'Within the next hour', right: 'Timeframe' }, { left: 'The city will likely need to', right: 'Institutional response' }], explanation: 'Good predictions consider multiple actors: drivers, individuals, and authorities.' },
    'With heavy snow on a busy highway, traffic will slow significantly. There will probably be accidents, and the city will likely need to deploy snowplows and salt trucks.',
    'Think about who\'s affected: drivers, pedestrians, emergency services, the city. Multiple actors = better predictions.'
  ],
  // 24. T4 - Employee receiving an award
  [
    { type: 'choose', question: '[Task 4 — Making Predictions] You see a picture of an employee receiving an award at a company ceremony. What do you predict for their future?', options: ['They did a good job.', 'This recognition will likely boost their confidence and motivation at work. I predict they\'ll probably take on more challenging projects in the coming months, and their colleagues might view them as a leader. In the long term, this could lead to a promotion or even an opportunity to manage their own team.', 'They\'ll get a raise.', 'Good for them.'], correct: 1, explanation: 'Emotional impact → behavioral change → peer perception → career trajectory. Layered prediction.' },
    { type: 'fillGap', sentence: 'This recognition will likely ________ their confidence and motivation at work.', options: ['boost', 'increase', 'raise', 'lift'], correct: 0, explanation: '"Boost confidence" is the most natural and impactful phrase — commonly used in professional contexts.' },
    'This recognition will likely boost their confidence. They\'ll probably take on more challenging projects, and in the long term, this could lead to a promotion.',
    'Predict emotional → behavioral → long-term career effects. Layer your predictions for depth.'
  ],
  // 25. T4 - Child getting a puppy
  [
    { type: 'choose', question: '[Task 4 — Making Predictions] You see a picture of a child receiving a puppy as a birthday present. What do you predict?', options: ['The child is happy.', 'The child will obviously be thrilled at first, but the real challenge will come in the following weeks when the novelty wears off. I predict the parents will end up doing most of the feeding and walking. However, growing up with a pet will probably teach the child valuable lessons about responsibility and empathy.', 'They\'ll take great care of it.', 'The puppy is cute.'], correct: 1, explanation: 'Initial reaction → reality check → who bears the burden → long-term benefit. Realistic and insightful.' },
    { type: 'reorder', question: 'Order these predictions:', words: ['The child will be thrilled at first.', 'The novelty will wear off in weeks.', 'The parents will end up doing most of the care.', 'However, growing up with a pet', 'will teach valuable lessons about responsibility.'], correct: [0, 1, 2, 3, 4], explanation: 'Excitement → reality → consequence → long-term benefit. Realistic prediction arc.' },
    'The child will be thrilled at first, but the novelty will wear off. The parents will likely do most of the care. However, growing up with a pet teaches responsibility and empathy.',
    'Show realistic thinking: excitement fades → reality hits → but there\'s a deeper benefit. Very mature.'
  ],

  // ─── T5: COMPARE & PERSUADE (26-31) ───
  // 26. T5 - City vs Small town for raising children
  [
    { type: 'choose', question: '[Task 5 — Compare & Persuade] For raising children: living in a city or a small town? Choose one and persuade.', options: ['Both have advantages.', 'While cities have their appeal, I\'d strongly recommend raising children in a small town. The primary advantage is safety — children can play outside without parents constantly worrying. Additionally, small communities foster stronger relationships between families, which creates a supportive environment for kids. The lower cost of living also means parents can work less and spend more quality time with their children.', 'Cities have better schools.', 'It depends on the family.'], correct: 1, explanation: 'Acknowledges other side → clear choice → safety reason → community reason → financial reason. Three strong arguments.' },
    { type: 'fillGap', sentence: 'Small communities ________ stronger relationships between families, which creates a supportive environment.', options: ['foster', 'build', 'create', 'make'], correct: 0, explanation: '"Foster" means to encourage the development of something — more sophisticated than "build."' },
    'I\'d strongly recommend a small town. Children can play outside safely, communities foster stronger family relationships, and the lower cost of living means more quality time with kids.',
    'Give THREE reasons when persuading. Each from a different angle: safety, community, finances.'
  ],
  // 27. T5 - Online shopping vs In-store
  [
    { type: 'choose', question: '[Task 5 — Compare & Persuade] Online shopping or going to physical stores? Choose one and make your case.', options: ['I like both.', 'Although online shopping is convenient, I believe going to physical stores is the better option. First, you can actually see and touch products before buying, which significantly reduces the chance of disappointment. Second, shopping in person provides an experience — you discover items you didn\'t know you wanted, interact with knowledgeable staff, and avoid shipping delays. The return process is also much simpler when you can walk back into the store.', 'Online shopping is obviously better.', 'Stores are outdated.'], correct: 1, explanation: 'Acknowledges competitor → clear choice → tangible benefit → experience benefit → practical benefit. Multi-layered persuasion.' },
    { type: 'match', question: 'Match the persuasion technique:', pairs: [{ left: 'Although X is convenient, I believe...', right: 'Acknowledge then counter' }, { left: 'which significantly reduces...', right: 'Quantify the benefit' }, { left: 'The return process is also...', right: 'Practical advantage' }], explanation: 'Strong persuasion: acknowledge → counter → evidence → practical bonus.' },
    'Although online shopping is convenient, physical stores are better. You can see products before buying, discover unexpected items, get expert help, and return things easily.',
    'Acknowledge the other option\'s strength BEFORE arguing against it. Shows fairness and confidence.'
  ],
  // 28. T5 - Renting vs Buying a home
  [
    { type: 'choose', question: '[Task 5 — Compare & Persuade] Should young professionals rent or buy their first home? Pick one side.', options: ['Buying is always better.', 'For young professionals, I\'d argue that renting is the smarter choice initially. The most compelling reason is flexibility — you can relocate for career opportunities without being tied to a mortgage. Furthermore, the money you save on maintenance, property taxes, and insurance can be invested elsewhere, potentially earning better returns than real estate. Once your career and finances are more established, buying makes more sense.', 'Renting is just throwing money away.', 'It depends on the market.'], correct: 1, explanation: 'Targets the audience (young professionals) → flexibility argument → financial argument → concedes when buying makes sense.' },
    { type: 'fillGap', sentence: 'The most ________ reason is flexibility — you can relocate for career opportunities without being tied to a mortgage.', options: ['compelling', 'important', 'strong', 'main'], correct: 0, explanation: '"Compelling" means convincing and hard to argue against — stronger than just "important."' },
    'For young professionals, renting is smarter initially. The flexibility to relocate for career opportunities and the savings on maintenance and taxes can be invested elsewhere.',
    '"The most compelling reason" is a powerful phrase for your strongest argument in Task 5.'
  ],
  // 29. T5 - Electric car vs Gas car
  [
    { type: 'choose', question: '[Task 5 — Compare & Persuade] For a daily commuter: an electric car or a gas car? Recommend one.', options: ['Gas cars are reliable.', 'I\'d recommend an electric car for a daily commuter. The upfront cost is higher, but you\'ll save thousands on fuel over the years since electricity is much cheaper than gasoline. On top of that, maintenance costs are significantly lower because electric cars have fewer moving parts. And of course, you\'d be contributing to a cleaner environment, which benefits everyone.', 'Electric cars are the future.', 'Both are fine for commuting.'], correct: 1, explanation: 'Acknowledges downside (cost) → financial benefit → maintenance benefit → environmental benefit. Honest and persuasive.' },
    { type: 'fillGap', sentence: 'The upfront cost is higher, but you\'ll save thousands on fuel over the years ________ electricity is much cheaper than gasoline.', options: ['since', 'because', 'as', 'when'], correct: 0, explanation: '"Since" works like "because" but sounds slightly more sophisticated — great for CLB 7-8.' },
    'I\'d recommend an electric car. The upfront cost is higher, but you\'ll save thousands on fuel. Maintenance costs are lower, and you\'d be contributing to a cleaner environment.',
    'Admitting a weakness ("cost is higher, but...") actually makes your argument MORE credible.'
  ],
  // 30. T5 - Freelancing vs Full-time employment
  [
    { type: 'choose', question: '[Task 5 — Compare & Persuade] Freelancing or full-time employment? Recommend one for someone starting their career.', options: ['Freelancing gives more freedom.', 'For someone starting their career, I\'d definitely recommend full-time employment. The structure and mentorship you receive from experienced colleagues is invaluable when you\'re still developing your professional skills. Furthermore, having a steady paycheck and benefits like health insurance provides the financial stability needed to build your foundation. You can always transition to freelancing later once you\'ve built expertise and a network.', 'Full-time is boring but necessary.', 'It depends on the person.'], correct: 1, explanation: 'Targets audience → mentorship benefit → stability benefit → future-proofs the advice by leaving freelancing as an option.' },
    { type: 'reorder', question: 'Order this persuasion:', words: ['For someone starting their career,', 'I\'d recommend full-time employment.', 'The mentorship from colleagues is invaluable.', 'A steady paycheck provides financial stability.', 'You can transition to freelancing later.'], correct: [0, 1, 2, 3, 4], explanation: 'Audience → recommendation → benefit 1 → benefit 2 → concession.' },
    'For someone starting out, I\'d recommend full-time employment. The mentorship is invaluable, and the steady paycheck provides stability. You can always freelance later once you\'ve built expertise.',
    'End with a concession: "You can always... later." Shows you\'re not dismissing the other option entirely.'
  ],
  // 31. T5 - Traditional classroom vs Self-study
  [
    { type: 'choose', question: '[Task 5 — Compare & Persuade] For learning a new language: traditional classroom or self-study apps? Recommend one.', options: ['Apps are more modern.', 'I would argue that a traditional classroom setting is more effective for language learning. The biggest advantage is real-time interaction with a teacher who can correct your pronunciation and grammar on the spot. In addition, practicing conversations with classmates simulates real-world communication in a way that apps simply cannot replicate. The accountability of attending scheduled classes also helps maintain consistency.', 'Use both.', 'It depends on the language.'], correct: 1, explanation: 'Clear position → teacher benefit with specific detail → peer practice benefit → accountability benefit. Three distinct angles.' },
    { type: 'fillGap', sentence: 'Practicing conversations with classmates simulates real-world communication in a way that apps simply cannot ________.', options: ['replicate', 'copy', 'match', 'do'], correct: 0, explanation: '"Cannot replicate" means cannot reproduce or recreate — powerful vocabulary for comparing options.' },
    'A traditional classroom is more effective. Real-time teacher correction, conversation practice with classmates, and the accountability of scheduled classes help maintain consistency.',
    'Use "in a way that X cannot replicate" — it\'s a powerful phrase for explaining why one option is superior.'
  ],

  // ─── T6: DIFFICULT SITUATION (32-37) ───
  // 32. T6 - Hotel room not as advertised
  [
    { type: 'choose', question: '[Task 6 — Difficult Situation] You arrive at a hotel and the room is much smaller than what was shown on the website. What do you say at reception?', options: ['This room is terrible.', 'Good evening. I just checked into room 412, and I\'m afraid the room doesn\'t match what was advertised on your website. The photos showed a spacious room with a balcony, but the actual room is quite different. I was wondering if it would be possible to either upgrade me to the room I originally booked or offer some form of compensation.', 'I want a refund.', 'The website lied.'], correct: 1, explanation: 'Polite greeting → room number → specific discrepancy → evidence → two possible solutions. Professional complaint.' },
    { type: 'fillGap', sentence: 'I was wondering if it would be possible to either upgrade me or offer some form of ________.', options: ['compensation', 'refund', 'discount', 'payment'], correct: 0, explanation: '"Compensation" covers various forms of making up for a problem — refund, upgrade, voucher, etc.' },
    'The room doesn\'t match what was advertised. The photos showed a spacious room with a balcony. Could you either upgrade me or offer some compensation?',
    'Offer two possible solutions — it gives the other person options and increases your chances of a good outcome.'
  ],
  // 33. T6 - Coworker taking credit for your work
  [
    { type: 'choose', question: '[Task 6 — Difficult Situation] You discover that a coworker presented your research as their own to upper management. How do you handle this?', options: ['Confront them in front of everyone.', 'I\'d first gather evidence — my original files with timestamps and any emails showing my contributions. Then I\'d approach the coworker privately and say something like: "I noticed that the presentation you gave used research that I conducted. I\'m sure it wasn\'t intentional, but I think it\'s important that we clarify the contributions so credit is properly assigned."', 'Tell the boss immediately.', 'Let it go this time.'], correct: 1, explanation: 'Prepare evidence → private approach → assumption of good faith → clear request. Strategic and professional.' },
    { type: 'reorder', question: 'Order this conflict resolution:', words: ['First, gather evidence with timestamps.', 'Then approach the coworker privately.', '"I noticed the presentation used my research."', '"I\'m sure it wasn\'t intentional."', '"Let\'s clarify the contributions."'], correct: [0, 1, 2, 3, 4], explanation: 'Prepare → private meeting → observation → assume good faith → solution.' },
    'I\'d gather evidence first, then approach them privately: "I noticed the presentation used my research. I\'m sure it wasn\'t intentional, but let\'s clarify the contributions."',
    'Assume good faith first: "I\'m sure it wasn\'t intentional." It keeps the door open for resolution.'
  ],
  // 34. T6 - Doctor gave wrong medication
  [
    { type: 'choose', question: '[Task 6 — Difficult Situation] You realize your pharmacy gave you the wrong medication. You call them. What do you say?', options: ['You gave me the wrong pills!', 'Hello, I\'m calling about a prescription I picked up earlier today. My name is Sarah Chen and my prescription number is 47829. I believe there may be an error because the pills I received look different from what I usually take. I haven\'t taken any of them. Could you please verify this as soon as possible? I\'m quite concerned about the safety implications.', 'I\'m going to sue.', 'Someone made a mistake with my medicine.'], correct: 1, explanation: 'ID info → observation → safety precaution → urgency → concern. Organized and responsible.' },
    { type: 'fillGap', sentence: 'I believe there may be an error because the pills look different from what I ________ take.', options: ['usually', 'normally', 'always', 'often'], correct: 0, explanation: '"Usually take" indicates your regular medication — gives the pharmacist a reference point.' },
    'I believe there may be an error with my prescription. The pills look different from what I usually take. I haven\'t taken any. Could you verify this as soon as possible?',
    'In medical situations: give your info, describe the problem, mention safety steps you\'ve taken, and request urgent action.'
  ],
  // 35. T6 - Flight cancelled with no notice
  [
    { type: 'choose', question: '[Task 6 — Difficult Situation] Your flight has been cancelled and you need to be at an important event tomorrow. You approach the airline desk. What do you say?', options: ['This is unacceptable!', 'I understand cancellations happen, but I need to reach Vancouver by tomorrow morning for a conference where I\'m the keynote speaker. I\'d appreciate it if you could look into alternative flights this evening, even with a layover. If that\'s not possible, could you arrange accommodation for tonight and put me on the first flight tomorrow? I\'m also wondering whether I\'m entitled to any compensation.', 'Put me on another flight now.', 'I want to speak to your manager.'], correct: 1, explanation: 'Shows understanding → explains urgency + why → preferred solution → backup plan → asks about rights. Comprehensive.' },
    { type: 'match', question: 'Match the escalation strategy:', pairs: [{ left: 'I understand cancellations happen', right: 'Show empathy first' }, { left: 'Even with a layover', right: 'Show flexibility' }, { left: 'If that\'s not possible', right: 'Offer a backup plan' }], explanation: 'Empathy → flexibility → alternatives = professional problem-solving.' },
    'I understand cancellations happen, but I need to reach Vancouver by tomorrow for a conference. Could you find alternative flights tonight? If not, please arrange accommodation and the first flight tomorrow.',
    'Show flexibility ("even with a layover"), have a backup plan, and know your rights. Stay calm but firm.'
  ],
  // 36. T6 - Neighbor\'s tree damaging your property
  [
    { type: 'choose', question: '[Task 6 — Difficult Situation] Your neighbor\'s large tree has roots growing into your yard, cracking your driveway. How do you address this?', options: ['Cut the tree down yourself.', 'Hi, I hope you don\'t mind me bringing this up, but I\'ve noticed that the roots from your oak tree have started to extend into my property and are causing cracks in my driveway. I\'ve taken some photos to show you what I mean. I\'d like to work out a solution together — perhaps a root barrier, or consulting an arborist who could advise us on the best approach without harming the tree.', 'I\'m calling a lawyer.', 'Your tree is ruining my driveway.'], correct: 1, explanation: 'Soft opening → specific problem with evidence → collaborative approach → specific solutions → preserves relationship.' },
    { type: 'fillGap', sentence: 'Perhaps a root barrier, or consulting an ________ who could advise us on the best approach.', options: ['arborist', 'gardener', 'expert', 'specialist'], correct: 0, explanation: 'An "arborist" is a tree specialist — knowing this specific vocabulary shows language proficiency.' },
    'I\'ve noticed roots from your tree are cracking my driveway — I have photos. I\'d like to work out a solution together, perhaps a root barrier or consulting an arborist.',
    'Bring evidence (photos), suggest collaborative solutions, and use specific vocabulary like "arborist."'
  ],
  // 37. T6 - Unfair performance review
  [
    { type: 'choose', question: '[Task 6 — Difficult Situation] Your performance review contains feedback you believe is inaccurate. How do you respond to your manager?', options: ['This review is wrong.', 'Thank you for taking the time to discuss my performance. However, there are a couple of points I\'d like to address. Regarding the comment about missed deadlines, I have documentation showing that all my projects were delivered on time. I believe there may be some confusion with another team member\'s work. Could we review the specific instances together?', 'I deserve a better review.', 'I disagree with everything.'], correct: 1, explanation: 'Positive opening → diplomatic transition → specific evidence → possible explanation → request to review together.' },
    { type: 'fillGap', sentence: 'I have documentation showing that all my projects were delivered on time. I believe there may be some ________ with another team member\'s work.', options: ['confusion', 'mistake', 'error', 'problem'], correct: 0, explanation: '"Confusion" is diplomatic — it suggests a mix-up rather than accusing anyone of lying.' },
    'Thank you for the review. However, regarding missed deadlines, I have documentation showing my projects were on time. There may be confusion with another team member. Could we review together?',
    'Start with thanks, then diplomatically correct with evidence. "There may be confusion" is softer than "you\'re wrong."'
  ],

  // ─── T7: EXPRESSING OPINIONS (38-44) ───
  // 38. T7 - Should companies mandate remote work?
  [
    { type: 'choose', question: '[Task 7 — Expressing Opinions] Should companies require employees to work from the office or allow remote work? Share your opinion.', options: ['Remote work is better for everyone.', 'I believe companies should adopt a hybrid model that gives employees flexibility while maintaining in-person collaboration. The reason is that remote work increases productivity for individual tasks, but innovation and team building require face-to-face interaction. A three-day office, two-day home schedule would balance both needs without forcing an all-or-nothing approach.', 'Everyone should work from the office.', 'It depends on the job.'], correct: 1, explanation: 'Nuanced position (hybrid) → reasoning → both sides addressed → specific implementation. Sophisticated opinion.' },
    { type: 'fillGap', sentence: 'Innovation and team building require face-to-face ________, which remote work cannot fully provide.', options: ['interaction', 'communication', 'connection', 'contact'], correct: 0, explanation: '"Face-to-face interaction" is the most complete phrase for in-person communication and collaboration.' },
    'Companies should adopt a hybrid model. Remote work boosts individual productivity, but innovation requires face-to-face interaction. A 3-2 schedule balances both needs.',
    'A nuanced opinion with a specific proposal (3-2 schedule) is stronger than just picking a side.'
  ],
  // 39. T7 - Should university be free?
  [
    { type: 'choose', question: '[Task 7 — Expressing Opinions] Should university education be free for all students?', options: ['Yes, definitely.', 'While I support making education more accessible, I don\'t think university should be completely free. The main issue is funding — someone has to pay, and it would require significant tax increases. Instead, I believe in a merit-based system where high-performing students receive full scholarships regardless of income, while others pay on a sliding scale based on their family\'s financial situation.', 'Education should always be free.', 'No, people should pay for their own education.'], correct: 1, explanation: 'Position → funding concern → alternative solution → specific mechanism. Shows policy-level thinking.' },
    { type: 'match', question: 'Match the opinion structure:', pairs: [{ left: 'While I support making education accessible...', right: 'Partial agreement' }, { left: 'The main issue is funding', right: 'Core concern' }, { left: 'Instead, I believe in...', right: 'Alternative proposal' }], explanation: '"While I support X, I think Y" is a sophisticated way to express a nuanced opinion.' },
    'While I support accessible education, university shouldn\'t be completely free due to funding issues. Instead, merit-based scholarships with income-based sliding scale fees would work better.',
    '"While I support X..." + alternative proposal shows you can think beyond simple yes/no answers.'
  ],
  // 40. T7 - Should voting be mandatory?
  [
    { type: 'choose', question: '[Task 7 — Expressing Opinions] Should voting in elections be mandatory?', options: ['Yes, everyone should vote.', 'I firmly believe that voting should be mandatory, as it is in countries like Australia. When everyone votes, the elected government truly represents the will of the people, not just the most motivated voters. Critics argue it restricts freedom, but I think the minor inconvenience of casting a ballot is a small price to pay for a healthier democracy. Uninformed voting can be addressed through better civic education rather than voluntary participation.', 'No, it\'s a free country.', 'People who don\'t vote don\'t care.'], correct: 1, explanation: 'Clear position with example → main argument → addresses counterargument → responds to objection → alternative solution.' },
    { type: 'fillGap', sentence: 'The minor inconvenience of casting a ballot is a small price to ________ for a healthier democracy.', options: ['pay', 'give', 'make', 'have'], correct: 0, explanation: '"A small price to pay" is an idiom meaning the sacrifice is worth the benefit.' },
    'Voting should be mandatory. When everyone votes, the government truly represents the people. The minor inconvenience is a small price to pay for healthier democracy.',
    'Address the strongest counterargument and respond to it. This makes your opinion much more convincing.'
  ],
  // 41. T7 - Should there be a limit on screen time for children?
  [
    { type: 'choose', question: '[Task 7 — Expressing Opinions] Should parents limit their children\'s screen time?', options: ['Kids need to play outside.', 'I strongly believe parents should set reasonable screen time limits, particularly for young children. Research consistently shows that excessive screen time negatively impacts children\'s attention span, sleep quality, and social development. However, it\'s important to distinguish between passive consumption like watching videos and active learning through educational apps. A balanced approach of around one to two hours daily, focused on quality content, would be most beneficial.', 'Technology is the future, let them learn.', 'Ban screens entirely.'], correct: 1, explanation: 'Clear position → research backing → important distinction → specific recommendation with detail.' },
    { type: 'reorder', question: 'Order this nuanced opinion:', words: ['Parents should set reasonable screen time limits.', 'Excessive screen time impacts attention and sleep.', 'However, passive and active screen time differ.', 'A balanced approach of 1-2 hours daily', 'focused on quality content would be best.'], correct: [0, 1, 2, 3, 4], explanation: 'Position → evidence → nuance/distinction → specific recommendation.' },
    'Parents should set reasonable screen time limits. Excessive time impacts attention and sleep. However, distinguish between passive watching and active learning. One to two hours of quality content is best.',
    'Making a distinction within your topic ("passive vs. active") shows sophisticated thinking in Task 7.'
  ],
  // 42. T7 - Is social media killing real friendships?
  [
    { type: 'choose', question: '[Task 7 — Expressing Opinions] Do you think social media is replacing genuine friendships?', options: ['Social media is great for staying connected.', 'I believe social media has fundamentally changed how we maintain friendships, though not entirely for the worse. On one hand, it allows us to stay connected with people across the world, which was nearly impossible before. On the other hand, many people now prioritize online interactions over meaningful face-to-face conversations. The key is using social media as a supplement to, rather than a replacement for, real human connection.', 'Social media ruins everything.', 'I don\'t use social media.'], correct: 1, explanation: 'Balanced thesis → positive aspect → negative aspect → key insight with specific phrasing.' },
    { type: 'fillGap', sentence: 'The key is using social media as a ________ to, rather than a replacement for, real human connection.', options: ['supplement', 'addition', 'complement', 'bonus'], correct: 0, explanation: '"Supplement to, rather than replacement for" is a powerful contrast structure for balanced opinions.' },
    'Social media has changed friendships, not entirely for the worse. It helps us stay connected globally, but many prioritize online over face-to-face. The key is using it as a supplement, not a replacement.',
    '"The key is..." followed by your main insight is a great way to conclude your opinion.'
  ],
  // 43. T7 - Should tipping be abolished?
  [
    { type: 'choose', question: '[Task 7 — Expressing Opinions] Should the tipping system in restaurants be replaced with higher wages?', options: ['Tipping is tradition.', 'I\'m strongly in favor of replacing tips with fair wages. The current system puts the burden of paying workers on customers rather than employers, and it creates unpredictable income for servers. Some argue that tips motivate better service, but countries like Japan provide exceptional service without any tipping culture whatsoever. Including service costs in menu prices would create a more transparent and equitable system for everyone involved.', 'Everyone should just tip 15%.', 'Tipping should be optional.'], correct: 1, explanation: 'Clear position → structural criticism → addresses counterargument with international example → proposed solution with benefits.' },
    { type: 'fillGap', sentence: 'Countries like Japan provide exceptional service without any tipping culture ________.', options: ['whatsoever', 'at all', 'ever', 'anyway'], correct: 0, explanation: '"Whatsoever" is a strong emphasis word meaning "at all, in any way." More formal than "at all."' },
    'Tips should be replaced with fair wages. The current system creates unpredictable income for servers. Japan provides exceptional service without tipping. Including service in prices is more transparent.',
    'International examples are powerful evidence. "Countries like X do Y successfully" is hard to argue against.'
  ],
  // 44. T7 - Should immigration requirements be easier?
  [
    { type: 'choose', question: '[Task 7 — Expressing Opinions] Should Canada make immigration requirements less strict?', options: ['Open borders for everyone.', 'I believe Canada should streamline its immigration process without necessarily lowering standards. The current system is too slow and bureaucratic, which discourages skilled professionals from choosing Canada over other countries. Rather than reducing requirements, we should invest in faster processing, clearer pathways, and better support for newcomers once they arrive. This way, we maintain quality while being more welcoming and competitive globally.', 'Keep the strict requirements.', 'It depends on the economy.'], correct: 1, explanation: 'Refined position (streamline, not lower) → problem identified → comparison → specific solutions → dual benefit.' },
    { type: 'reorder', question: 'Order this policy opinion:', words: ['Canada should streamline immigration', 'without lowering standards.', 'The current system is too slow,', 'discouraging skilled professionals.', 'Faster processing and better support would help.'], correct: [0, 1, 2, 3, 4], explanation: 'Nuanced position → qualifier → problem → consequence → solution.' },
    'Canada should streamline immigration without lowering standards. The process is too slow, discouraging skilled professionals. Faster processing and better newcomer support would maintain quality while being more welcoming.',
    'Refine the question: not "easier" but "streamlined." Reframing shows independent thinking.'
  ],

  // ─── T8: UNUSUAL SITUATION (45-50) ───
  // 45. T8 - Found wallet with large amount of cash
  [
    { type: 'choose', question: '[Task 8 — Unusual Situation] You find a wallet with $500 cash and an ID card on the street. You call the person. What do you say?', options: ['I found your wallet.', 'Hi, my name is David and I found a wallet on Bloor Street that I believe belongs to you based on the ID inside. I wanted to let you know that everything appears to be intact, including the cash. I\'m currently at the Tim Hortons on the corner of Bloor and Yonge. Would you be able to meet me here, or would you prefer I drop it off at the nearest police station?', 'There\'s $500 in here, just so you know.', 'Come get your wallet.'], correct: 1, explanation: 'Your name → where found → identification → reassurance about contents → current location → two meeting options.' },
    { type: 'fillGap', sentence: 'I wanted to let you know that everything appears to be ________, including the cash.', options: ['intact', 'there', 'safe', 'complete'], correct: 0, explanation: '"Intact" means everything is whole, untouched, and in its original state.' },
    'I found a wallet on Bloor Street that I believe belongs to you. Everything appears to be intact. I\'m at Tim Hortons on Bloor and Yonge. Would you like to meet here or should I take it to a police station?',
    'Give your name, location, and options for meeting. Reassure them nothing is missing.'
  ],
  // 46. T8 - Car accident witness
  [
    { type: 'choose', question: '[Task 8 — Unusual Situation] You witness a minor car accident where no one is hurt but both drivers are arguing. You call 911. What do you say?', options: ['Two people are fighting about a car accident.', 'I\'d like to report a traffic accident at the intersection of King and Bay Street. It appears to be a minor collision with no injuries, but the two drivers are becoming increasingly aggressive and I\'m concerned the situation could escalate. Both vehicles are blocking the intersection, which is causing traffic to back up significantly. Could you send an officer to help resolve the situation?', 'There\'s been a crash.', 'Two drivers are arguing on the road.'], correct: 1, explanation: 'Location → severity → current behavior → concern → traffic impact → specific request. Complete 911 report.' },
    { type: 'match', question: 'Match the emergency report element:', pairs: [{ left: 'Intersection of King and Bay', right: 'Exact location' }, { left: 'Minor collision, no injuries', right: 'Severity assessment' }, { left: 'Drivers are becoming aggressive', right: 'Escalation concern' }, { left: 'Vehicles blocking intersection', right: 'Additional impact' }], explanation: 'Good emergency reports cover: location, severity, risk, and impact.' },
    'I\'d like to report a traffic accident at King and Bay Street. Minor collision, no injuries, but the drivers are becoming aggressive. Vehicles are blocking the intersection. Could you send an officer?',
    'For 911 calls: location first, then severity, then what concerns you, then what you need.'
  ],
  // 47. T8 - Pipe burst in office
  [
    { type: 'choose', question: '[Task 8 — Unusual Situation] A water pipe bursts in your office, flooding the workspace. You call building maintenance. What do you say?', options: ['There\'s water everywhere.', 'This is urgent — a water pipe has burst on the fourth floor near the server room. Water is spreading rapidly and I\'m concerned about damage to the computer equipment. We\'ve already moved the most critical electronics to higher ground, but we need someone to shut off the water supply to this section immediately. Several employees have already evacuated the area as a precaution.', 'Come fix the pipe.', 'Our office is flooding.'], correct: 1, explanation: 'Urgency → location with important detail (server room) → risk assessment → actions taken → immediate need → status of people.' },
    { type: 'fillGap', sentence: 'We\'ve already moved the most critical electronics to higher ground, but we need someone to shut off the water ________ immediately.', options: ['supply', 'flow', 'pipe', 'system'], correct: 0, explanation: '"Shut off the water supply" is the standard phrase for stopping water flow to an area.' },
    'A water pipe has burst on the fourth floor near the server room. We\'ve moved critical electronics, but we need someone to shut off the water supply immediately. Employees have evacuated.',
    'Report what\'s at risk (server room), what you\'ve already done, and what you need — shows you\'re in control.'
  ],
  // 48. T8 - Suspicious person near school
  [
    { type: 'choose', question: '[Task 8 — Unusual Situation] You notice someone acting suspiciously near your child\'s school — taking photos of children through the fence. You call the school. What do you say?', options: ['Someone is taking pictures of kids.', 'Hello, I\'m a parent of a student at Lakeside Elementary and I\'m calling because I\'ve noticed an unfamiliar man standing near the north fence taking photographs of children in the playground. He\'s been there for about twenty minutes and doesn\'t appear to be a parent. I want to bring this to your attention so you can assess the situation. He\'s wearing a grey jacket and appears to be in his forties.', 'Call the police right now.', 'There\'s a stranger outside the school.'], correct: 1, explanation: 'Your relationship to school → specific behavior → location → duration → detail → request → physical description.' },
    { type: 'reorder', question: 'Order this safety report:', words: ['I\'m a parent at Lakeside Elementary.', 'An unfamiliar man is near the north fence', 'taking photos of children.', 'He\'s been there about twenty minutes.', 'He\'s wearing a grey jacket, about forties.'], correct: [0, 1, 2, 3, 4], explanation: 'Your identity → who → where → what → how long → description.' },
    'I\'m a parent at Lakeside Elementary. An unfamiliar man near the north fence has been taking photos of children for about twenty minutes. Grey jacket, about forties. Please assess the situation.',
    'Physical descriptions help: clothing, approximate age, location near the building. Be specific but factual.'
  ],
  // 49. T8 - Lost child in a store
  [
    { type: 'choose', question: '[Task 8 — Unusual Situation] You find a crying child alone in a department store. You go to the customer service desk. What do you say?', options: ['I found a lost child.', 'I found this little girl crying near the toy section on the second floor. She says her name is Sophie and she can\'t find her mom. She looks about five or six years old and she\'s wearing a pink jacket with a unicorn on it. I\'ve been staying with her to keep her calm, but could you make an announcement over the PA system? Her mom must be frantic looking for her.', 'Make an announcement about a lost child.', 'This girl is lost.'], correct: 1, explanation: 'Where found → child\'s name → problem → description → what you did → specific request → empathy for parent.' },
    { type: 'fillGap', sentence: 'Could you make an announcement over the ________ system? Her mom must be frantic looking for her.', options: ['PA', 'speaker', 'sound', 'store'], correct: 0, explanation: '"PA system" (public address) is the intercom/speaker system in stores and public buildings.' },
    'I found this girl crying near the toy section. She says her name is Sophie, about five years old, pink jacket with a unicorn. Could you make a PA announcement? Her mom must be looking for her.',
    'Include the child\'s name, age estimate, and clothing description. These are essential for the announcement.'
  ],
  // 50. T8 - Strange smell of gas in building
  [
    { type: 'choose', question: '[Task 8 — Unusual Situation] You smell gas when you enter your apartment building lobby. You call the gas company emergency line. What do you say?', options: ['I smell gas.', 'I\'m calling from 245 Queen Street West, apartment building. There\'s a strong smell of natural gas in the lobby — it wasn\'t here when I left this morning. I\'ve opened the main entrance doors to ventilate the area and I\'m advising other residents not to use the elevators or any electrical switches. Could you send an emergency crew immediately? I\'m not sure whether the smell is coming from the basement or one of the ground-floor units.', 'Send someone to check the gas.', 'My building smells like gas, please help.'], correct: 1, explanation: 'Address → what you notice → change from normal → safety actions taken → instructions to others → request → helpful detail about source.' },
    { type: 'match', question: 'Match the emergency action:', pairs: [{ left: 'Opened doors to ventilate', right: 'Immediate safety action' }, { left: 'Don\'t use elevators or switches', right: 'Spark prevention' }, { left: 'Not sure if from basement or ground floor', right: 'Narrowing the source' }], explanation: 'Gas emergencies: ventilate, avoid sparks, and help locate the source.' },
    'I\'m at 245 Queen Street West. There\'s a strong gas smell in the lobby. I\'ve opened doors to ventilate and told residents to avoid elevators. Could you send an emergency crew immediately?',
    'In gas emergencies: address, ventilate, avoid sparks (no switches!), and stay calm. These details could save lives.'
  ],
];
