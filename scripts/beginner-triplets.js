// Speaking Drills Beginner Triplets — CLB 5-6
// 50 triplets = 150 exercises
// FOCUSED on CELPIP Speaking 8 tasks with simple vocabulary
// T1=Giving Advice, T2=Personal Experience, T3=Describe Scene, T4=Predictions
// T5=Compare & Persuade, T6=Difficult Situation, T7=Opinion, T8=Unusual Situation
module.exports = [
  // ─── T1: GIVING ADVICE (1-7) ───
  // 1. T1 - Friend nervous about presentations
  [
    { type: 'choose', question: '[Task 1 — Giving Advice] Your friend is nervous about giving presentations at work. What is the best advice?', options: ['Don\'t worry about it.', 'I think you should practice in front of a mirror first. It helps you feel more confident.', 'Just read your notes.', 'Tell your boss you can\'t do it.'], correct: 1, explanation: '"Practice in front of a mirror" is a specific, helpful suggestion with a reason — this is what Task 1 wants.' },
    { type: 'fillGap', sentence: 'I think you should practice in front of a ________. It helps you feel more confident.', options: ['mirror', 'window', 'picture', 'screen'], correct: 0, explanation: 'Practicing in front of a mirror is a common tip for improving presentation skills.' },
    'I think you should practice in front of a mirror first. It helps you feel more confident.',
    'In Task 1, give 2-3 suggestions with a short reason for each. Keep it simple and helpful.'
  ],
  // 2. T1 - Friend wants to save money
  [
    { type: 'choose', question: '[Task 1 — Giving Advice] Your friend wants to save money but spends too much eating out. What do you suggest?', options: ['Stop eating.', 'Why don\'t you try cooking at home more often? It\'s much cheaper and healthier too.', 'Just eat less.', 'Get a better job.'], correct: 1, explanation: '"Why don\'t you" + suggestion + reason is a great pattern for giving advice in CELPIP.' },
    { type: 'reorder', question: 'Put this advice in order:', words: ['Why don\'t you', 'try cooking at home?', 'It\'s much cheaper', 'and healthier too.'], correct: [0, 1, 2, 3], explanation: 'Suggestion → reason 1 → reason 2. Simple and clear.' },
    'Why don\'t you try cooking at home more often? It\'s much cheaper and healthier too.',
    'Use "Why don\'t you..." or "I think you should..." to start your advice.'
  ],
  // 3. T1 - Friend can't sleep well
  [
    { type: 'choose', question: '[Task 1 — Giving Advice] Your friend can\'t sleep well at night. Which advice is most helpful?', options: ['Drink more coffee.', 'I suggest you stop using your phone before bed. The light makes it hard to fall asleep.', 'Sleep during the day.', 'Just try harder to sleep.'], correct: 1, explanation: '"I suggest you" + specific action + clear reason is perfect for Task 1.' },
    { type: 'fillGap', sentence: 'I suggest you stop using your phone before bed. The light makes it hard to ________ asleep.', options: ['fall', 'get', 'go', 'be'], correct: 0, explanation: '"Fall asleep" is the most natural way to say "start sleeping."' },
    'I suggest you stop using your phone before bed. The light makes it hard to fall asleep.',
    'Give a specific action, not a general one. "Stop using your phone" is better than "relax more."'
  ],
  // 4. T1 - Friend wants to improve English
  [
    { type: 'choose', question: '[Task 1 — Giving Advice] Your friend wants to improve their English. What do you recommend?', options: ['Read the dictionary.', 'You could watch English TV shows with subtitles. It\'s a fun way to learn new words.', 'Study grammar all day.', 'Move to an English country.'], correct: 1, explanation: '"You could" + activity + benefit. Practical advice that anyone can follow.' },
    { type: 'match', question: 'Match the advice phrase with its use:', pairs: [{ left: 'I think you should...', right: 'Strong suggestion' }, { left: 'Why don\'t you...', right: 'Friendly suggestion' }, { left: 'You could...', right: 'Gentle option' }], explanation: 'These three phrases are the most useful for CELPIP Task 1.' },
    'You could watch English TV shows with subtitles. It\'s a fun way to learn new words.',
    'Use different advice phrases: "I think you should," "Why don\'t you," "You could."'
  ],
  // 5. T1 - Friend is stressed at work
  [
    { type: 'choose', question: '[Task 1 — Giving Advice] Your friend is very stressed at work. What would you suggest?', options: ['Quit your job.', 'Maybe you should take short breaks during the day. Even a 10-minute walk can help you feel better.', 'Work harder so you finish faster.', 'Don\'t think about it.'], correct: 1, explanation: '"Maybe you should" + specific action + time detail + benefit is a complete piece of advice.' },
    { type: 'fillGap', sentence: 'Maybe you should take short ________ during the day. Even a 10-minute walk can help.', options: ['breaks', 'rests', 'stops', 'pauses'], correct: 0, explanation: '"Take a break" is the most common way to say "stop working for a short time."' },
    'Maybe you should take short breaks during the day. Even a 10-minute walk can help you feel better.',
    'Add a small detail like "10-minute walk" — it makes your advice more real and helpful.'
  ],
  // 6. T1 - Friend new to Canada
  [
    { type: 'choose', question: '[Task 1 — Giving Advice] Your friend just moved to Canada and feels lonely. What advice do you give?', options: ['You\'ll get used to it.', 'I recommend joining a community group or sports team. It\'s a great way to meet people and make friends.', 'Stay home and watch TV.', 'Call your family every day.'], correct: 1, explanation: '"I recommend" + activity + benefit. Joining a group is specific and practical.' },
    { type: 'reorder', question: 'Order this advice:', words: ['I recommend', 'joining a community group.', 'It\'s a great way', 'to meet people', 'and make friends.'], correct: [0, 1, 2, 3, 4], explanation: 'Advice phrase → action → benefit 1 → benefit 2.' },
    'I recommend joining a community group or sports team. It\'s a great way to meet people and make friends.',
    '"I recommend" is slightly formal but perfect for CELPIP. Follow with a reason.'
  ],
  // 7. T1 - Friend wants to get fit
  [
    { type: 'choose', question: '[Task 1 — Giving Advice] Your friend wants to get in shape but doesn\'t like going to the gym. What do you suggest?', options: ['You have to go to the gym.', 'How about going for a walk every morning? It\'s free, easy, and you can enjoy the fresh air.', 'Buy expensive equipment.', 'Just eat less food.'], correct: 1, explanation: '"How about" + activity + three simple benefits. Shows there are easy options.' },
    { type: 'fillGap', sentence: 'How about going for a walk every morning? It\'s free, easy, and you can enjoy the ________ air.', options: ['fresh', 'clean', 'good', 'nice'], correct: 0, explanation: '"Fresh air" is a common English phrase for outdoor air.' },
    'How about going for a walk every morning? It\'s free, easy, and you can enjoy the fresh air.',
    '"How about..." is a casual, friendly way to suggest something.'
  ],

  // ─── T2: PERSONAL EXPERIENCE (8-13) ───
  // 8. T2 - Solved a problem at work
  [
    { type: 'choose', question: '[Task 2 — Personal Experience] Tell about a time you solved a problem at work. Which answer follows the best structure?', options: ['I fixed a problem once.', 'Last month, a customer was upset because their order was late. I called them, apologized, and offered free delivery next time. They were happy, and I learned that quick action solves most problems.', 'I solve problems every day at work.', 'My boss asked me to fix something and I did.'], correct: 1, explanation: 'When → what happened → what you did → result → lesson. This is the perfect Task 2 structure.' },
    { type: 'match', question: 'Match the story element:', pairs: [{ left: 'Last month', right: 'When it happened' }, { left: 'A customer was upset', right: 'The problem' }, { left: 'I called and apologized', right: 'What you did' }, { left: 'I learned that...', right: 'The lesson' }], explanation: 'Task 2 needs: When → Problem → Action → Result/Lesson.' },
    'Last month, a customer was upset because their order was late. I called them and apologized. I learned that quick action solves most problems.',
    'Tell a short story: when, what happened, what you did, what you learned.'
  ],
  // 9. T2 - First day in Canada
  [
    { type: 'choose', question: '[Task 2 — Personal Experience] Describe your first day in a new city. Which is the best story?', options: ['It was nice.', 'When I first arrived in Toronto, I got lost on the subway. A friendly stranger helped me find my stop. That day, I realized that Canadians are very kind and helpful.', 'I moved to a new city last year.', 'The city was big and cold.'], correct: 1, explanation: 'Specific place + event + helper + lesson = complete personal story.' },
    { type: 'fillGap', sentence: 'When I first ________ in Toronto, I got lost on the subway.', options: ['arrived', 'came', 'went', 'reached'], correct: 0, explanation: '"Arrived in" + city is the most natural way to describe reaching a destination.' },
    'When I first arrived in Toronto, I got lost on the subway. A friendly stranger helped me. I realized Canadians are very kind.',
    'Start with "When I..." to set the scene. Keep sentences short and clear.'
  ],
  // 10. T2 - Learned something new
  [
    { type: 'choose', question: '[Task 2 — Personal Experience] Talk about a time you learned something new. Best answer?', options: ['I learn things all the time.', 'Two years ago, I took a cooking class. At first, I was terrible — I even burned the rice! But by the end, I could make a full meal. It showed me that practice really does make perfect.', 'I learned to drive.', 'Learning new things is important.'], correct: 1, explanation: 'Time + activity + difficulty + progress + lesson. Great story arc for Task 2.' },
    { type: 'reorder', question: 'Order this personal story:', words: ['Two years ago,', 'I took a cooking class.', 'At first, I was terrible.', 'But by the end,', 'I could make a full meal.'], correct: [0, 1, 2, 3, 4], explanation: 'When → what → struggle → progress → result.' },
    'Two years ago, I took a cooking class. At first I was terrible, but by the end I could make a full meal. Practice makes perfect!',
    'A good story has a beginning, a challenge, and a happy ending.'
  ],
  // 11. T2 - Helped someone
  [
    { type: 'choose', question: '[Task 2 — Personal Experience] Tell about a time you helped someone. Which answer is best?', options: ['I help people a lot.', 'Last winter, my neighbor was sick and couldn\'t go shopping. I bought groceries for her every week for a month. She was so grateful, and it made me feel happy to help.', 'I helped my friend once.', 'Helping people is important.'], correct: 1, explanation: 'When + who + what you did + how long + their reaction + your feeling. Complete story.' },
    { type: 'fillGap', sentence: 'My neighbor was sick and couldn\'t go shopping. I bought groceries for her every week for a ________.', options: ['month', 'time', 'while', 'period'], correct: 0, explanation: '"For a month" gives specific time — CELPIP rewards specific details.' },
    'Last winter, my neighbor was sick and couldn\'t go shopping. I bought groceries for her every week. It made me happy to help.',
    'Include feelings at the end — "I felt happy" or "It was rewarding." CELPIP likes personal reflection.'
  ],
  // 12. T2 - Embarrassing moment
  [
    { type: 'choose', question: '[Task 2 — Personal Experience] Describe a funny or embarrassing moment. Best answer?', options: ['Funny things happen to me.', 'On my first day at work, I walked into the wrong meeting room and sat down. I didn\'t realize my mistake until someone asked who I was! Everyone laughed, and now it\'s a funny story I tell at parties.', 'Once I did something funny.', 'I don\'t remember any funny moments.'], correct: 1, explanation: 'Setting + action + discovery + reaction + reflection. Great storytelling.' },
    { type: 'fillGap', sentence: 'I didn\'t ________ my mistake until someone asked who I was!', options: ['realize', 'know', 'see', 'notice'], correct: 0, explanation: '"Realize" means to suddenly understand something you didn\'t know before.' },
    'On my first day at work, I walked into the wrong meeting room. I didn\'t realize until someone asked who I was! Now it\'s a funny story.',
    'Funny stories are great for Task 2. Keep it light and end with a smile.'
  ],
  // 13. T2 - Overcame a challenge
  [
    { type: 'choose', question: '[Task 2 — Personal Experience] Talk about a challenge you overcame. Which is best?', options: ['Life is full of challenges.', 'When I moved to Canada, I couldn\'t understand people because they spoke too fast. I started watching Canadian news every day, and after three months, I could follow most conversations. I felt so proud of myself.', 'I overcame many challenges.', 'Moving to a new country is hard.'], correct: 1, explanation: 'Challenge + specific action + time frame + result + feeling = excellent Task 2 response.' },
    { type: 'reorder', question: 'Order this challenge story:', words: ['When I moved to Canada,', 'I couldn\'t understand people.', 'I started watching Canadian news.', 'After three months,', 'I could follow conversations.'], correct: [0, 1, 2, 3, 4], explanation: 'When → problem → action → time → result.' },
    'When I moved to Canada, I couldn\'t understand people. I started watching Canadian news every day. After three months, I could follow most conversations.',
    'Show your progress! Before → action → after. CELPIP loves improvement stories.'
  ],

  // ─── T3: DESCRIBE A SCENE (14-19) ───
  // 14. T3 - Park scene
  [
    { type: 'choose', question: '[Task 3 — Describe a Scene] You see a picture of a busy park. What is the best way to start describing it?', options: ['It\'s a park.', 'This picture shows a busy park on a sunny day. In the center, a family is having a picnic on the grass.', 'I see trees and people.', 'Parks are nice places.'], correct: 1, explanation: 'Start with an overview ("busy park, sunny day"), then zoom into a specific detail.' },
    { type: 'fillGap', sentence: 'This picture shows a busy park on a sunny day. In the ________, a family is having a picnic.', options: ['center', 'middle', 'front', 'back'], correct: 0, explanation: '"In the center" helps the listener locate what you\'re describing in the picture.' },
    'This picture shows a busy park on a sunny day. In the center, a family is having a picnic on the grass.',
    'Task 3 tip: Start with the big picture, then describe 3 details. Use location words: center, left, right, background.'
  ],
  // 15. T3 - Kitchen scene
  [
    { type: 'choose', question: '[Task 3 — Describe a Scene] You see a picture of a messy kitchen. How do you describe what you see?', options: ['The kitchen is dirty.', 'I can see a kitchen with dirty dishes in the sink. On the counter, there are open food containers, and on the floor, there\'s a spill that hasn\'t been cleaned up.', 'This is a bad kitchen.', 'Someone should clean this.'], correct: 1, explanation: 'Three specific details with locations: sink, counter, floor. This is exactly what Task 3 needs.' },
    { type: 'match', question: 'Match the description with its location:', pairs: [{ left: 'Dirty dishes', right: 'In the sink' }, { left: 'Open food containers', right: 'On the counter' }, { left: 'A spill', right: 'On the floor' }], explanation: 'Always pair WHAT you see with WHERE you see it.' },
    'I can see a kitchen with dirty dishes in the sink. On the counter there are open food containers. On the floor there\'s a spill.',
    'Describe what + where: "On the left," "In the background," "Next to the..." Use these location phrases.'
  ],
  // 16. T3 - Office scene
  [
    { type: 'choose', question: '[Task 3 — Describe a Scene] You see a picture of an office with people working. What detail should you mention?', options: ['People are working.', 'On the right side, a woman is talking on the phone and writing notes. She looks busy and focused.', 'The office has desks.', 'Everyone is doing their job.'], correct: 1, explanation: 'Specific person + location + action + appearance. This is a strong detail for Task 3.' },
    { type: 'fillGap', sentence: 'On the right side, a woman is talking on the phone and writing notes. She ________ busy and focused.', options: ['looks', 'seems', 'is', 'feels'], correct: 0, explanation: '"Looks" is the best word for describing what you observe about someone\'s appearance.' },
    'On the right side, a woman is talking on the phone and writing notes. She looks busy and focused.',
    'Add a small guess about feelings: "She looks happy," "He seems tired." This shows thinking.'
  ],
  // 17. T3 - Street scene
  [
    { type: 'choose', question: '[Task 3 — Describe a Scene] You see a picture of a city street. How should you organize your description?', options: ['I see a street with cars and buildings.', 'This is a busy city street during rush hour. In the foreground, there are cars stopped at a red light. In the background, I can see tall office buildings. It looks like people are heading home from work.', 'There are many things in this picture.', 'The street is long and has cars.'], correct: 1, explanation: 'Overview → foreground → background → inference. Perfect Task 3 structure.' },
    { type: 'reorder', question: 'Order this scene description:', words: ['This is a busy city street.', 'In the foreground, cars are stopped.', 'In the background, there are tall buildings.', 'It looks like people are heading home.'], correct: [0, 1, 2, 3], explanation: 'Overview → foreground → background → inference.' },
    'This is a busy city street during rush hour. In the foreground, cars are stopped at a red light. In the background, I can see tall buildings.',
    'Use "foreground" and "background" to organize your description. End with a small guess.'
  ],
  // 18. T3 - Restaurant scene
  [
    { type: 'choose', question: '[Task 3 — Describe a Scene] You see a picture of a restaurant. What is a good inference to make?', options: ['It\'s a restaurant.', 'The restaurant is crowded and all the tables are full. The waiters are moving quickly. I think it might be a popular place, maybe during dinner time.', 'People are eating food.', 'The food looks good.'], correct: 1, explanation: 'Observations + inference ("I think it might be..."). Task 3 asks you to make a small guess at the end.' },
    { type: 'fillGap', sentence: 'The restaurant is crowded and all the tables are full. I think it ________ be a popular place.', options: ['might', 'will', 'can', 'should'], correct: 0, explanation: '"Might" is perfect for making a guess — not too strong, not too weak.' },
    'The restaurant is crowded and all the tables are full. I think it might be a popular place, maybe during dinner time.',
    'End with "I think..." or "It might be..." to show you can make inferences from what you see.'
  ],
  // 19. T3 - Classroom scene
  [
    { type: 'choose', question: '[Task 3 — Describe a Scene] You see a picture of a classroom. Which describes a specific detail well?', options: ['Students are in a classroom.', 'On the left, a boy with a red shirt is raising his hand. He probably wants to ask the teacher a question.', 'The teacher is teaching.', 'There are desks and chairs.'], correct: 1, explanation: 'Specific person + appearance + action + guess about why. Great Task 3 detail.' },
    { type: 'fillGap', sentence: 'A boy with a red shirt is ________ his hand. He probably wants to ask a question.', options: ['raising', 'putting', 'lifting', 'holding'], correct: 0, explanation: '"Raising your hand" is the standard phrase for putting your hand up in class.' },
    'On the left, a boy with a red shirt is raising his hand. He probably wants to ask the teacher a question.',
    'Describe people by what they wear or do: "the woman in the blue jacket," "the man carrying bags."'
  ],

  // ─── T4: MAKING PREDICTIONS (20-25) ───
  // 20. T4 - Rain clouds
  [
    { type: 'choose', question: '[Task 4 — Making Predictions] You see dark clouds in a picture and people without umbrellas. What will probably happen?', options: ['Nothing will happen.', 'It will probably start raining soon, and the people will get wet because they don\'t have umbrellas. They might run to find shelter.', 'The clouds will go away.', 'People don\'t need umbrellas.'], correct: 1, explanation: 'Predicts what + explains why + adds another possibility. Strong Task 4 answer.' },
    { type: 'fillGap', sentence: 'It will ________ start raining soon, and the people will get wet.', options: ['probably', 'maybe', 'possibly', 'surely'], correct: 0, explanation: '"Probably" is the best word for a likely prediction — more certain than "maybe."' },
    'It will probably start raining soon, and the people will get wet because they don\'t have umbrellas.',
    'Use "will probably," "might," and "I think... will" for predictions in Task 4.'
  ],
  // 21. T4 - Moving boxes
  [
    { type: 'choose', question: '[Task 4 — Making Predictions] You see a picture of a family putting boxes in a car. What do you predict?', options: ['They have boxes.', 'I think the family is probably moving to a new house. They will likely drive to their new home and spend the day unpacking.', 'They are going shopping.', 'The car is full.'], correct: 1, explanation: 'States what\'s happening → predicts where → predicts what next. Good Task 4 flow.' },
    { type: 'reorder', question: 'Order this prediction:', words: ['I think the family', 'is probably moving.', 'They will likely drive', 'to their new home', 'and spend the day unpacking.'], correct: [0, 1, 2, 3, 4], explanation: 'What you see → your prediction → what happens next.' },
    'I think the family is probably moving to a new house. They will likely drive there and spend the day unpacking.',
    'First say what you see, then predict what will happen next. Use "I think" and "likely."'
  ],
  // 22. T4 - Job interview scene
  [
    { type: 'choose', question: '[Task 4 — Making Predictions] You see a woman in nice clothes sitting in a waiting room with papers. What do you predict?', options: ['She is waiting.', 'She is probably waiting for a job interview. She looks a bit nervous. I think she will try to make a good first impression when they call her name.', 'She is at the doctor.', 'She has papers.'], correct: 1, explanation: 'Identifies the situation, describes feelings, predicts next action.' },
    { type: 'fillGap', sentence: 'She is probably waiting for a job interview. She looks a bit ________.', options: ['nervous', 'scared', 'worried', 'stressed'], correct: 0, explanation: '"Nervous" is the most natural word for someone before an interview.' },
    'She is probably waiting for a job interview. She looks nervous. I think she will try to make a good first impression.',
    'Describe feelings and predict actions. "She looks nervous" → "She will probably..." '
  ],
  // 23. T4 - Broken-down car
  [
    { type: 'choose', question: '[Task 4 — Making Predictions] You see a car stopped on the side of the road with smoke coming from it. What will happen next?', options: ['The car is broken.', 'The driver will probably call for help or a tow truck. They might have to wait a long time, especially if they\'re far from the city.', 'Someone will fix it.', 'The car will start again.'], correct: 1, explanation: 'Predicts two possible actions + adds a condition. Good range of prediction.' },
    { type: 'fillGap', sentence: 'The driver will probably call for help or a ________ truck.', options: ['tow', 'fix', 'repair', 'help'], correct: 0, explanation: 'A "tow truck" pulls broken cars to a repair shop. Very common in Canada.' },
    'The driver will probably call for help or a tow truck. They might have to wait a long time if they\'re far from the city.',
    'Give two predictions: one certain ("will probably") and one possible ("might"). Shows range.'
  ],
  // 24. T4 - Grocery store lineup
  [
    { type: 'choose', question: '[Task 4 — Making Predictions] You see a very long line at the grocery store checkout. What do you predict?', options: ['People are buying food.', 'The customers will probably have to wait at least 15 or 20 minutes. Some people might leave their carts and come back later when it\'s less busy.', 'The store is open.', 'They should open more lines.'], correct: 1, explanation: 'Predicts wait time + alternate possibility. Shows you can think of different outcomes.' },
    { type: 'match', question: 'Match the prediction phrase:', pairs: [{ left: 'will probably', right: 'Very likely to happen' }, { left: 'might', right: 'Maybe, not sure' }, { left: 'could', right: 'One possible outcome' }], explanation: 'Use different prediction words to show range: probably > might > could.' },
    'The customers will probably have to wait at least 15 or 20 minutes. Some people might leave and come back later.',
    'Add time estimates and alternative outcomes. "15 or 20 minutes" sounds specific and confident.'
  ],
  // 25. T4 - Kids with a soccer ball
  [
    { type: 'choose', question: '[Task 4 — Making Predictions] You see kids holding a soccer ball at a field. What will probably happen?', options: ['They have a ball.', 'The kids will probably play a soccer game together. They might pick teams first, and I think they\'ll play until it gets dark outside.', 'They are at a field.', 'Someone will kick the ball.'], correct: 1, explanation: 'Predicts main action + process + duration. Natural and complete.' },
    { type: 'fillGap', sentence: 'They might pick teams first, and I think they\'ll play ________ it gets dark.', options: ['until', 'when', 'before', 'after'], correct: 0, explanation: '"Until" means continuing up to a point in time — "play until dark."' },
    'The kids will probably play a soccer game together. They might pick teams first and play until it gets dark.',
    'Predict the sequence: what happens first, then what, then when it ends.'
  ],

  // ─── T5: COMPARE & PERSUADE (26-31) ───
  // 26. T5 - Apartment vs House
  [
    { type: 'choose', question: '[Task 5 — Compare & Persuade] Your friend is choosing between renting an apartment downtown or a house in the suburbs. Which is a good recommendation?', options: ['Both are fine.', 'I would recommend the apartment downtown. First, you\'ll save time because you won\'t need to drive to work. Second, there are more restaurants and shops nearby.', 'The house is bigger.', 'It depends on what you want.'], correct: 1, explanation: '"I would recommend" + choice + two clear benefits with "First" and "Second."' },
    { type: 'reorder', question: 'Order this recommendation:', words: ['I would recommend', 'the apartment downtown.', 'First, you\'ll save time on driving.', 'Second, there are more shops nearby.'], correct: [0, 1, 2, 3], explanation: 'Choice → first benefit → second benefit. Clear and organized.' },
    'I would recommend the apartment downtown. First, you\'ll save time because you won\'t need to drive. Second, there are more shops nearby.',
    'Task 5: Choose ONE option and give 2 benefits. Use "First..." and "Second..." to organize.'
  ],
  // 27. T5 - Online class vs In-person
  [
    { type: 'choose', question: '[Task 5 — Compare & Persuade] Should students take online classes or in-person classes? Pick one and persuade.', options: ['Both have advantages.', 'I think in-person classes are better. First, you can ask the teacher questions right away. Second, you make friends in class, which makes learning more fun.', 'Online is more modern.', 'It depends on the student.'], correct: 1, explanation: 'Takes a clear side + two specific benefits. Task 5 needs you to CHOOSE one.' },
    { type: 'fillGap', sentence: 'I think in-person classes are better. First, you can ask questions right ________.', options: ['away', 'now', 'there', 'then'], correct: 0, explanation: '"Right away" means immediately, without waiting.' },
    'I think in-person classes are better. First, you can ask questions right away. Second, you make friends in class.',
    'Don\'t say "both are good." Task 5 wants you to PICK ONE and give reasons.'
  ],
  // 28. T5 - Bus vs Car
  [
    { type: 'choose', question: '[Task 5 — Compare & Persuade] For getting to work: taking the bus or driving a car? Recommend one.', options: ['Cars are faster.', 'I recommend taking the bus. The main reason is that you save a lot of money on gas and parking. Also, you can read or relax during the ride instead of driving in traffic.', 'Both are okay.', 'It depends on where you live.'], correct: 1, explanation: 'Clear recommendation + money benefit + time/comfort benefit.' },
    { type: 'match', question: 'Match the persuasion phrase:', pairs: [{ left: 'I recommend...', right: 'Direct recommendation' }, { left: 'The main reason is...', right: 'Strongest argument' }, { left: 'Also,...', right: 'Adding another benefit' }], explanation: 'Structure: recommend → main reason → extra benefit.' },
    'I recommend taking the bus. The main reason is you save money on gas and parking. Also, you can relax during the ride.',
    'Use "the main reason" for your strongest argument, then "also" for the second.'
  ],
  // 29. T5 - Small company vs Big company
  [
    { type: 'choose', question: '[Task 5 — Compare & Persuade] Your friend got two job offers: a small company and a big company. Recommend one.', options: ['Big companies pay more.', 'I would suggest the small company. You\'ll learn more because you do many different tasks. Plus, it\'s easier to talk to the boss and grow in your career.', 'Take the big company for sure.', 'I\'m not sure which is better.'], correct: 1, explanation: '"I would suggest" + choice + benefit 1 with reason + benefit 2 with reason.' },
    { type: 'fillGap', sentence: 'It\'s easier to talk to the boss and ________ in your career at a small company.', options: ['grow', 'move', 'rise', 'build'], correct: 0, explanation: '"Grow in your career" is the natural way to say advancing professionally.' },
    'I would suggest the small company. You\'ll learn more because you do different tasks. Plus, it\'s easier to grow in your career.',
    '"Plus" is a casual way to add a second benefit. Good for friendly persuasion.'
  ],
  // 30. T5 - Park vs Shopping mall for weekend
  [
    { type: 'choose', question: '[Task 5 — Compare & Persuade] For a weekend outing with friends: going to a park or a shopping mall? Choose one.', options: ['Both are fun.', 'I\'d say go to the park. First, it\'s free, so you don\'t have to spend any money. Second, being outdoors is much better for your health than walking around a mall.', 'The mall has more to do.', 'It depends on the weather.'], correct: 1, explanation: '"I\'d say" + choice + cost benefit + health benefit. Two different types of reasons.' },
    { type: 'fillGap', sentence: 'Being outdoors is much better for your ________ than walking around a mall.', options: ['health', 'body', 'mind', 'life'], correct: 0, explanation: '"Better for your health" is a simple, clear benefit anyone can understand.' },
    'I\'d say go to the park. First, it\'s free. Second, being outdoors is much better for your health.',
    '"I\'d say" is casual and friendly — great for recommending things to friends.'
  ],
  // 31. T5 - Cooking at home vs Eating out
  [
    { type: 'choose', question: '[Task 5 — Compare & Persuade] Cooking at home or eating at restaurants? Recommend one to a friend.', options: ['Restaurants are tastier.', 'I think cooking at home is better. For one thing, you know exactly what ingredients are in your food, so it\'s healthier. For another, you save a lot of money every month.', 'Both have good points.', 'I eat out because I can\'t cook.'], correct: 1, explanation: '"For one thing... for another..." is a great structure for two benefits.' },
    { type: 'reorder', question: 'Order this persuasion:', words: ['I think cooking at home is better.', 'For one thing,', 'you know what\'s in your food.', 'For another,', 'you save a lot of money.'], correct: [0, 1, 2, 3, 4], explanation: 'Position → connector → benefit 1 → connector → benefit 2.' },
    'I think cooking at home is better. For one thing, you know what\'s in your food. For another, you save a lot of money.',
    '"For one thing... for another..." is a useful pair of connectors for giving two reasons.'
  ],

  // ─── T6: DIFFICULT SITUATION (32-37) ───
  // 32. T6 - Noisy neighbor
  [
    { type: 'choose', question: '[Task 6 — Difficult Situation] Your neighbor plays loud music every night and you can\'t sleep. What do you say?', options: ['Stop the music!', 'Hi, I\'m sorry to bother you, but the music at night has been keeping me up. Would it be possible to lower the volume after 10 PM? I\'d really appreciate it.', 'I\'m going to call the police.', 'Your music is terrible.'], correct: 1, explanation: 'Polite opening + specific problem + specific request + appreciation. Perfect T6 structure.' },
    { type: 'fillGap', sentence: 'Would it be ________ to lower the volume after 10 PM? I\'d really appreciate it.', options: ['possible', 'okay', 'fine', 'good'], correct: 0, explanation: '"Would it be possible" is very polite — perfect for difficult situations.' },
    'I\'m sorry to bother you, but the music at night has been keeping me up. Would it be possible to lower the volume after 10 PM?',
    'Task 6: Be polite but clear. State the problem, make a specific request, and thank them.'
  ],
  // 33. T6 - Wrong order at restaurant
  [
    { type: 'choose', question: '[Task 6 — Difficult Situation] You received the wrong food at a restaurant. What do you say to the waiter?', options: ['This is wrong!', 'Excuse me, I\'m sorry but I think there might be a mix-up with my order. I ordered the chicken, but this looks like fish. Would you mind checking, please?', 'Take this back.', 'I want a different waiter.'], correct: 1, explanation: '"There might be a mix-up" is polite — doesn\'t blame anyone. Then states what\'s wrong clearly.' },
    { type: 'match', question: 'Match the polite complaint phrase:', pairs: [{ left: 'I think there might be a mix-up', right: 'Gentle way to say there\'s a mistake' }, { left: 'Would you mind checking?', right: 'Polite request for action' }, { left: 'I\'d appreciate it', right: 'Showing gratitude in advance' }], explanation: 'Soft language makes complaints more effective. Never blame directly.' },
    'Excuse me, I think there might be a mix-up. I ordered the chicken but this looks like fish. Would you mind checking?',
    'In Task 6, be polite even when you\'re upset. Soft words get better results.'
  ],
  // 34. T6 - Late delivery
  [
    { type: 'choose', question: '[Task 6 — Difficult Situation] A package you ordered was supposed to arrive a week ago. You call customer service. What do you say?', options: ['Where is my package?!', 'Hi, I ordered a package last week and it was supposed to arrive on Monday, but I still haven\'t received it. The tracking number is 12345. Could you please look into it for me?', 'This is unacceptable.', 'I want my money back.'], correct: 1, explanation: 'When you ordered + when it should arrive + tracking info + polite request. Organized and effective.' },
    { type: 'fillGap', sentence: 'It was supposed to arrive on Monday, but I still haven\'t ________ it.', options: ['received', 'gotten', 'had', 'seen'], correct: 0, explanation: '"Haven\'t received it" is the formal, clear way to say something didn\'t arrive.' },
    'I ordered a package last week and it was supposed to arrive on Monday, but I still haven\'t received it. Could you please look into it?',
    'Give details: when, what, order number. Be organized and polite on the phone.'
  ],
  // 35. T6 - Colleague took credit
  [
    { type: 'choose', question: '[Task 6 — Difficult Situation] A coworker presented your idea as their own in a meeting. What do you say to them privately?', options: ['You stole my idea!', 'Hey, I wanted to talk about the meeting earlier. I noticed the idea you presented was very similar to what I shared with you last week. I think it would be fair to mention that we worked on it together. What do you think?', 'I\'m telling the boss.', 'That\'s not cool.'], correct: 1, explanation: 'Private, factual, suggests fairness, asks for their input — mature approach.' },
    { type: 'fillGap', sentence: 'I think it would be ________ to mention that we worked on it together.', options: ['fair', 'good', 'nice', 'right'], correct: 0, explanation: '"Fair" appeals to their sense of justice — hard to argue against.' },
    'I noticed the idea you presented was similar to what I shared last week. I think it would be fair to mention we worked on it together.',
    'Stay calm in difficult situations. State facts, not feelings. Ask for fairness.'
  ],
  // 36. T6 - Overcharged on bill
  [
    { type: 'choose', question: '[Task 6 — Difficult Situation] You notice your phone bill is $50 more than usual. You call the company. What do you say?', options: ['You overcharged me!', 'Hi, I\'m calling about my latest bill. I noticed it\'s about $50 higher than usual. I didn\'t change my plan, so I\'m wondering if there might be an error. Could you help me understand the charge?', 'I\'m not paying this.', 'Fix my bill.'], correct: 1, explanation: 'States the problem, gives context, suggests possible error, asks for help — not accusatory.' },
    { type: 'reorder', question: 'Order this billing complaint:', words: ['I noticed my bill', 'is $50 higher than usual.', 'I didn\'t change my plan,', 'so there might be an error.', 'Could you help me understand?'], correct: [0, 1, 2, 3, 4], explanation: 'Observation → amount → context → suggestion → request.' },
    'I noticed my bill is about $50 higher than usual. I didn\'t change my plan, so there might be an error. Could you help me understand?',
    'Never accuse — suggest there "might be an error." This gets better customer service.'
  ],
  // 37. T6 - Roommate doesn't clean
  [
    { type: 'choose', question: '[Task 6 — Difficult Situation] Your roommate never cleans the shared kitchen. How do you bring it up?', options: ['You\'re so messy!', 'Hey, can we talk about the kitchen for a second? I\'ve been feeling like the cleaning isn\'t balanced. How about we make a simple schedule so it\'s fair for both of us?', 'Clean the kitchen.', 'I\'m tired of doing everything.'], correct: 1, explanation: '"Can we talk about" + "I feel" + solution suggestion. Non-confrontational and constructive.' },
    { type: 'fillGap', sentence: 'How about we make a simple ________ so it\'s fair for both of us?', options: ['schedule', 'plan', 'list', 'rule'], correct: 0, explanation: '"Make a schedule" is a practical solution that feels fair to both sides.' },
    'Can we talk about the kitchen? I feel like the cleaning isn\'t balanced. How about we make a simple schedule?',
    'Use "How about we..." to suggest solutions. It sounds cooperative, not bossy.'
  ],

  // ─── T7: EXPRESSING OPINIONS (38-44) ───
  // 38. T7 - Public transit
  [
    { type: 'choose', question: '[Task 7 — Expressing Opinions] Should the city invest more in public transit or roads? Give your opinion.', options: ['Both are important.', 'In my opinion, the city should invest more in public transit. First, buses and trains reduce traffic on the roads. Second, public transit is better for the environment because fewer cars means less pollution.', 'Roads are more important.', 'I don\'t really know.'], correct: 1, explanation: '"In my opinion" + clear position + two reasons with because = strong Task 7 answer.' },
    { type: 'fillGap', sentence: 'In my opinion, the city should invest more in public transit because buses ________ traffic on the roads.', options: ['reduce', 'lower', 'decrease', 'cut'], correct: 0, explanation: '"Reduce traffic" is the most natural phrase for less traffic on roads.' },
    'In my opinion, the city should invest more in public transit. Buses reduce traffic, and fewer cars means less pollution.',
    'Task 7: State your opinion clearly in the FIRST sentence. Then give 2 reasons with "First" and "Second."'
  ],
  // 39. T7 - Homework for children
  [
    { type: 'choose', question: '[Task 7 — Expressing Opinions] Should children have homework every day? Share your opinion.', options: ['Homework is important.', 'I believe children should have some homework, but not too much. First, a little homework helps them practice what they learned in school. However, too much homework takes away time for playing and family, which is also important for children.', 'No homework ever.', 'I don\'t have an opinion on this.'], correct: 1, explanation: 'Balanced position + reason for + reason against. Shows mature thinking.' },
    { type: 'reorder', question: 'Order this opinion:', words: ['I believe children should have', 'some homework, but not too much.', 'A little homework helps them practice.', 'However, too much takes away', 'time for playing and family.'], correct: [0, 1, 2, 3, 4], explanation: 'Position → qualifier → supporting reason → contrasting point.' },
    'I believe children should have some homework, but not too much. It helps them practice, but too much takes away time for family.',
    'You can have a balanced opinion — "some but not too much." Use "however" to add the other side.'
  ],
  // 40. T7 - Working from home
  [
    { type: 'choose', question: '[Task 7 — Expressing Opinions] Do you think working from home is better than working in an office?', options: ['It depends.', 'I think working from home is better for most people. First, you save time and money because you don\'t have to travel to work. Second, you can focus more because the office can be noisy and full of interruptions.', 'Office is always better.', 'I like both.'], correct: 1, explanation: 'Clear position + practical reason + productivity reason. Two different types of benefits.' },
    { type: 'fillGap', sentence: 'You save time and money because you don\'t have to ________ to work.', options: ['commute', 'travel', 'drive', 'go'], correct: 0, explanation: '"Commute" is the specific word for traveling between home and work.' },
    'I think working from home is better. You save time because you don\'t commute, and you can focus more without office interruptions.',
    'Pick a clear side — don\'t say "it depends." CELPIP wants a clear opinion with reasons.'
  ],
  // 41. T7 - Social media
  [
    { type: 'choose', question: '[Task 7 — Expressing Opinions] Is social media good or bad for young people?', options: ['It\'s both good and bad.', 'I think social media has more negative effects on young people. The main reason is that teenagers spend too much time scrolling instead of studying or exercising. On top of that, comparing themselves to others online can hurt their confidence.', 'Social media is great for learning.', 'Young people shouldn\'t use it.'], correct: 1, explanation: 'Clear negative position + time waste reason + mental health reason. Strong opinion with support.' },
    { type: 'fillGap', sentence: 'Comparing themselves to others online can ________ their confidence.', options: ['hurt', 'break', 'damage', 'lower'], correct: 0, explanation: '"Hurt their confidence" is a simple, clear way to express negative emotional impact.' },
    'I think social media has more negative effects on young people. They spend too much time scrolling, and comparing themselves to others hurts their confidence.',
    'Use "The main reason is..." for your strongest point, then "On top of that..." for more.'
  ],
  // 42. T7 - University education
  [
    { type: 'choose', question: '[Task 7 — Expressing Opinions] Is a university degree necessary for a successful career?', options: ['Yes, always.', 'I don\'t think a university degree is always necessary. Many successful people learned their skills through work experience or online courses. That said, some careers like medicine or law do require a degree.', 'No, degrees are useless.', 'Everyone should go to university.'], correct: 1, explanation: 'Nuanced position + evidence + acknowledgment of exceptions. Thoughtful opinion.' },
    { type: 'match', question: 'Match the opinion connector:', pairs: [{ left: 'I don\'t think...', right: 'Disagree politely' }, { left: 'That said,...', right: 'Acknowledge the other side' }, { left: 'The main reason is...', right: 'Introduce your strongest point' }], explanation: 'Good opinions acknowledge other viewpoints while keeping a clear position.' },
    'I don\'t think a university degree is always necessary. Many people succeed through work experience. That said, some careers do require one.',
    '"That said" or "However" shows you can see both sides — examiners like balanced thinking.'
  ],
  // 43. T7 - Pets in apartments
  [
    { type: 'choose', question: '[Task 7 — Expressing Opinions] Should apartment buildings allow pets?', options: ['Yes, everyone loves pets.', 'I strongly believe apartments should allow pets. Pets help people feel less lonely, especially those living alone. Also, many studies show that having a pet reduces stress and makes people happier.', 'No, pets are too messy.', 'Only small pets should be allowed.'], correct: 1, explanation: '"I strongly believe" + emotional benefit + health/research benefit. Strong, supported opinion.' },
    { type: 'fillGap', sentence: 'Pets help people feel less ________, especially those living alone.', options: ['lonely', 'sad', 'bored', 'tired'], correct: 0, explanation: '"Lonely" is the most relevant word for people living alone wanting companionship.' },
    'I strongly believe apartments should allow pets. Pets help people feel less lonely, and having a pet reduces stress.',
    '"I strongly believe" is a confident way to express your opinion. Use it for topics you feel sure about.'
  ],
  // 44. T7 - Tipping culture
  [
    { type: 'choose', question: '[Task 7 — Expressing Opinions] Should restaurants include tips in the price instead of expecting customers to tip?', options: ['Tipping is fine the way it is.', 'I think tips should be included in the price. First, it would make things simpler for customers, especially newcomers who don\'t know how much to tip. Second, workers would get a stable income instead of depending on tips.', 'Tipping should be banned.', 'I always tip 20%.'], correct: 1, explanation: 'Clear position + customer benefit + worker benefit. Two stakeholder perspectives.' },
    { type: 'reorder', question: 'Order this opinion:', words: ['I think tips should be', 'included in the price.', 'First, it would be simpler for customers.', 'Second, workers would get', 'a stable income.'], correct: [0, 1, 2, 3, 4], explanation: 'Position → first reason → second reason. Clean structure.' },
    'I think tips should be included in the price. It would be simpler for customers, and workers would get a stable income.',
    'Give reasons that help DIFFERENT groups of people. It shows broader thinking.'
  ],

  // ─── T8: UNUSUAL SITUATION (45-50) ───
  // 45. T8 - Water flooding apartment
  [
    { type: 'choose', question: '[Task 8 — Unusual Situation] You come home and find water all over your kitchen floor from a broken pipe. You call your landlord. What do you say?', options: ['There\'s water everywhere!', 'Hi, this is an emergency. I came home and there\'s water flooding my kitchen floor. I think a pipe under the sink is broken. I need someone to come fix it as soon as possible, please.', 'My apartment is wet.', 'You need to fix my apartment.'], correct: 1, explanation: 'States urgency + where + what\'s wrong + what\'s needed. Complete T8 response.' },
    { type: 'fillGap', sentence: 'I think a pipe under the sink is ________. I need someone to come fix it right away.', options: ['broken', 'damaged', 'leaking', 'cracked'], correct: 0, explanation: '"Broken" is the simplest, clearest word for something that doesn\'t work anymore.' },
    'This is an emergency. There\'s water flooding my kitchen. I think a pipe under the sink is broken. I need someone to fix it as soon as possible.',
    'Task 8: Who you\'re talking to + what\'s wrong + where + what you need them to do.'
  ],
  // 46. T8 - Stranger's dog in your yard
  [
    { type: 'choose', question: '[Task 8 — Unusual Situation] You find a lost dog in your front yard with a collar but no owner. You call the number on the tag. What do you say?', options: ['Is this your dog?', 'Hi, I think I found your dog. I noticed the number on his collar. He\'s safe in my front yard on Maple Street. He seems healthy but a little hungry. Would you be able to come pick him up?', 'Come get your dog.', 'Your dog is here.'], correct: 1, explanation: 'How you found it + where it is + its condition + request. Organized and helpful.' },
    { type: 'reorder', question: 'Order this unusual situation report:', words: ['I think I found your dog.', 'He\'s safe in my front yard', 'on Maple Street.', 'He seems healthy but hungry.', 'Can you come pick him up?'], correct: [0, 1, 2, 3, 4], explanation: 'What happened → where → condition → request.' },
    'I think I found your dog. He\'s safe in my front yard on Maple Street. He seems healthy. Would you be able to come pick him up?',
    'Give your location clearly — the person needs to find you!'
  ],
  // 47. T8 - Power outage during dinner party
  [
    { type: 'choose', question: '[Task 8 — Unusual Situation] You\'re hosting a dinner party and the power suddenly goes out. You call the power company. What do you say?', options: ['The lights went out.', 'Hi, I\'m calling to report a power outage at 125 Oak Avenue. The power went out about 10 minutes ago and the whole building seems dark. Do you know when it might be restored?', 'When will the power come back?', 'Fix the power now.'], correct: 1, explanation: 'Address + when it happened + scope + question about restoration. Complete report.' },
    { type: 'fillGap', sentence: 'I\'m calling to report a power ________ at 125 Oak Avenue.', options: ['outage', 'problem', 'failure', 'issue'], correct: 0, explanation: '"Power outage" is the standard term for when electricity stops working.' },
    'I\'m calling to report a power outage at 125 Oak Avenue. It went out about 10 minutes ago. Do you know when it might be restored?',
    'Give your address clearly. "Power outage" is the key vocabulary for this situation.'
  ],
  // 48. T8 - Locked out of car
  [
    { type: 'choose', question: '[Task 8 — Unusual Situation] You locked your keys inside your car at a mall parking lot. You call a locksmith. What do you say?', options: ['I\'m locked out.', 'Hi, I accidentally locked my keys inside my car. I\'m at the Southgate Mall parking lot, near the main entrance. It\'s a blue Honda Civic. How soon could someone come to help me?', 'I need help with my car.', 'Can you open my car?'], correct: 1, explanation: 'What happened + location + car description + time question. Everything they need to know.' },
    { type: 'fillGap', sentence: 'I ________ locked my keys inside my car. I\'m at the Southgate Mall parking lot.', options: ['accidentally', 'mistakenly', 'wrongly', 'suddenly'], correct: 0, explanation: '"Accidentally" means you didn\'t mean to do it — shows it was an honest mistake.' },
    'I accidentally locked my keys inside my car. I\'m at the Southgate Mall parking lot. It\'s a blue Honda Civic.',
    'Describe your car so they can find you: color, make, location in the lot.'
  ],
  // 49. T8 - Smoke in hallway
  [
    { type: 'choose', question: '[Task 8 — Unusual Situation] You smell smoke in your apartment hallway. You call the building manager. What do you say?', options: ['Something smells bad.', 'Hi, I need to let you know that I can smell smoke in the third-floor hallway near apartment 305. I don\'t see any fire, but the smell is getting stronger. I think you should check it right away.', 'Is there a fire?', 'The hallway smells like smoke.'], correct: 1, explanation: 'What you notice + exact location + current status + urgency + recommendation.' },
    { type: 'match', question: 'Match the emergency reporting element:', pairs: [{ left: 'I can smell smoke', right: 'What you notice' }, { left: 'Third-floor hallway, apartment 305', right: 'Exact location' }, { left: 'I think you should check it', right: 'What you need them to do' }], explanation: 'What + where + action needed = complete emergency report.' },
    'I can smell smoke in the third-floor hallway near apartment 305. The smell is getting stronger. I think you should check it right away.',
    'Be specific about WHERE you notice the problem. Floor number + apartment number helps.'
  ],
  // 50. T8 - Child fell at playground
  [
    { type: 'choose', question: '[Task 8 — Unusual Situation] You\'re at a playground and a child you don\'t know falls and hurts their knee. No parent is nearby. What do you say to the child?', options: ['Where are your parents?', 'Hey sweetie, are you okay? I saw you fall. Let me help you sit down. Can you show me where it hurts? Let\'s find your mom or dad together.', 'You should be more careful.', 'Don\'t cry.'], correct: 1, explanation: 'Reassuring + offers help + asks about injury + plan to find parents. Kind and responsible.' },
    { type: 'fillGap', sentence: 'Let me help you sit down. Can you show me ________ it hurts?', options: ['where', 'how', 'what', 'when'], correct: 0, explanation: '"Where does it hurt?" is the standard question when someone is injured.' },
    'Are you okay? I saw you fall. Let me help you sit down. Can you show me where it hurts? Let\'s find your mom or dad.',
    'Be calm and kind. Short, simple sentences are best in urgent situations.'
  ],
];
