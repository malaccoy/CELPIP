// Listening Drills — Tasks 1-3 (Easier) Triplets
// 15 scenarios × 3 exercises = 45 exercises
// Based on CELPIP Listening Technique Guide "7 Secret Steps"
// Format: Listen to audio → answer question (no transcript shown)
// Each exercise has: audioText (for TTS), audioVoice, question, options, correct, explanation

module.exports = [
  // ─── Task 1: Problem Solving ─── (5 scenarios)
  
  // 1.1 — Vet Clinic (cat scratching)
  [
    { type: 'listenChoose',
      audioLines: [
        { voice: 'male', text: "I'm really worried about my cat. She's usually so playful, but this past week all she's been doing is scratching herself." },
        { voice: 'female', text: "I see. Is she an indoor cat or does she go outside?" },
        { voice: 'male', text: "Mostly outside. She loves being in the garden." },
      ],
      question: 'What is the main problem?',
      options: ['The cat is not eating', 'The cat keeps scratching itself', 'The cat ran away from home', 'The cat is too old to play'],
      correct: 1, explanation: 'Step 1: Identify the Problem. The owner says "all she\'s been doing is scratching herself." The problem is scratching, not lack of play.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'female', text: "Well, these marks look like they could be from insect bites. Have you noticed any small bugs on her fur?" },
        { voice: 'male', text: "I tried giving her a bath with special shampoo, but it didn't help at all." },
        { voice: 'female', text: "That's because shampoo won't treat the underlying cause. I'll prescribe a monthly medication that should clear this up." },
      ],
      question: 'What is the REAL solution?',
      options: ['A special shampoo bath', 'Keeping the cat indoors', 'Monthly medication prescribed by the vet', 'Taking the cat to a different clinic'],
      correct: 2, explanation: 'Step 2: Real vs Fake solution. The shampoo was tried and FAILED (fake solution). The vet prescribes monthly medication (real solution). Always wait for the second suggestion!' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'male', text: "Thank you, doctor. Should I bring her back for a follow-up?" },
        { voice: 'female', text: "Yes, let's check on her in about three weeks. If the scratching stops within the first week, that's a great sign." },
        { voice: 'male', text: "Perfect. I'll keep her inside until then, just to be safe." },
      ],
      question: 'What will the man probably do next?',
      options: ['Buy a new cat', 'Keep the cat indoors and return in three weeks', 'Try a different shampoo at home', 'Take the cat to a different veterinarian'],
      correct: 1, explanation: 'Step 7: Future Outcomes. He says "I\'ll keep her inside" and the vet said "come back in three weeks." Future = indoor cat + follow-up visit.' },
  ],

  // 1.2 — Laptop repair
  [
    { type: 'listenChoose',
      audioLines: [
        { voice: 'female', text: "Hi, I'm having trouble with my laptop. It keeps shutting down randomly, even when the battery is fully charged." },
        { voice: 'male', text: "How long has this been happening?" },
        { voice: 'female', text: "About two weeks now. It started right after I updated the software." },
      ],
      question: 'What is the woman\'s problem?',
      options: ['Her laptop battery is dead', 'Her laptop shuts down randomly', 'She cannot install software updates', 'Her laptop screen is broken'],
      correct: 1, explanation: 'Step 1: Identify the Problem. "It keeps shutting down randomly" — the battery is fine, the issue is random shutdowns after a software update.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'male', text: "Have you tried resetting the software update? Sometimes rolling it back fixes the issue." },
        { voice: 'female', text: "Yes, I tried that last week, but it didn't make any difference." },
        { voice: 'male', text: "In that case, it might be a hardware issue. The fan could be overheating. I can open it up and clean the cooling system. That usually solves this type of problem." },
      ],
      question: 'Which solution was tried but FAILED?',
      options: ['Cleaning the cooling system', 'Rolling back the software update', 'Replacing the battery', 'Buying a new laptop'],
      correct: 1, explanation: 'Step 2: Fake vs Real. Rolling back the update was tried and "didn\'t make any difference" (FAKE). Cleaning the cooling system is the REAL solution proposed.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'female', text: "How long would that take?" },
        { voice: 'male', text: "Usually about two hours. I can have it ready by this afternoon if you leave it with me now." },
        { voice: 'female', text: "That works. I'll grab a coffee next door and come back around three." },
      ],
      question: 'What will the woman probably do?',
      options: ['Buy a new laptop today', 'Wait at the store for two hours', 'Leave the laptop and return later', 'Try fixing it herself at home'],
      correct: 2, explanation: 'Step 7: Future. She says "I\'ll grab a coffee and come back around three." She\'s leaving the laptop and returning — not waiting at the store.' },
  ],

  // 1.3 — Noisy apartment
  [
    { type: 'listenChoose',
      audioLines: [
        { voice: 'male', text: "I need to talk to you about the apartment above mine. The noise has been unbearable for the past month." },
        { voice: 'female', text: "I'm sorry to hear that. What kind of noise is it?" },
        { voice: 'male', text: "It sounds like they're moving furniture every night, usually starting around eleven. I can barely sleep." },
      ],
      question: 'Why is the man upset?',
      options: ['His apartment needs repairs', 'There is too much noise from upstairs at night', 'His rent was increased', 'The building has no parking'],
      correct: 1, explanation: 'Step 1: The problem is noise from upstairs, specifically at night ("starting around eleven"). He "can barely sleep."' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'female', text: "Have you tried talking to them directly?" },
        { voice: 'male', text: "I knocked on their door twice, but nobody answered. I also left a note, but nothing changed." },
        { voice: 'female', text: "Alright. I'll send them an official notice from management. If it continues after that, we can look into moving you to a quieter unit on a different floor." },
      ],
      question: 'What is the building manager\'s solution?',
      options: ['She will call the police about the noise', 'She will send an official notice to the noisy tenant', 'She will reduce the man\'s rent', 'She will ask the noisy tenant to move out'],
      correct: 1, explanation: 'Step 2: The man tried direct contact (fake solution — failed). The manager will send an official notice (real solution, step 1). Moving to a different unit is the backup plan.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'male', text: "And if the notice doesn't work?" },
        { voice: 'female', text: "Then we'll find you a comparable unit on the second floor. There's one available next month." },
        { voice: 'male', text: "Okay, let's try the notice first. I'd rather not move if I don't have to." },
      ],
      question: 'How does the man feel about moving to a different unit?',
      options: ['He is excited about the new apartment', 'He would prefer to stay and hopes the notice works', 'He is angry and wants to move immediately', 'He doesn\'t care either way'],
      correct: 1, explanation: 'Step 4: Feelings. He says "I\'d rather not move if I don\'t have to." He PREFERS staying — he\'s not excited about moving, not angry, and not indifferent.' },
  ],

  // 1.4 — Car trouble
  [
    { type: 'listenChoose',
      audioLines: [
        { voice: 'female', text: "My car is making a strange grinding noise whenever I brake. It started a few days ago." },
        { voice: 'male', text: "Does it happen every time, or only at high speeds?" },
        { voice: 'female', text: "Every time. Even when I'm just slowing down in a parking lot." },
      ],
      question: 'What brought the woman to the mechanic?',
      options: ['Her car won\'t start in the morning', 'She hears a grinding noise when braking', 'Her brakes stopped working completely', 'She needs an oil change'],
      correct: 1, explanation: 'Step 1: "A strange grinding noise whenever I brake." It\'s not a complete brake failure — just a noise when braking.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'male', text: "It could be the brake pads. They wear down over time and start grinding against the rotor." },
        { voice: 'female', text: "My neighbor said I should just add brake fluid. Would that help?" },
        { voice: 'male', text: "No, brake fluid is for a different issue. What you need is new brake pads. I can install them today if you'd like." },
      ],
      question: 'Why won\'t adding brake fluid solve the problem?',
      options: ['The car doesn\'t use brake fluid', 'Brake fluid is too expensive', 'The problem is worn brake pads, not low fluid', 'The mechanic doesn\'t have brake fluid'],
      correct: 2, explanation: 'Step 2: Adding brake fluid is the FAKE solution (neighbor\'s bad advice). The mechanic says "brake fluid is for a different issue." The REAL problem is worn brake pads.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'female', text: "How much would new brake pads cost?" },
        { voice: 'male', text: "About a hundred and fifty dollars, including installation. It takes about an hour." },
        { voice: 'female', text: "Alright, let's do it. I have some errands to run nearby, so I'll come back in an hour." },
      ],
      question: 'What will the woman do while the car is being fixed?',
      options: ['Wait at the mechanic\'s shop', 'Go home and come back tomorrow', 'Run errands nearby and return in an hour', 'Call her neighbor for a ride'],
      correct: 2, explanation: 'Step 7: Future. "I have some errands to run nearby, so I\'ll come back in an hour." She\'s leaving and returning — not waiting there.' },
  ],

  // 1.5 — Internet service
  [
    { type: 'listenChoose',
      audioLines: [
        { voice: 'male', text: "Thank you for calling tech support. How can I help you today?" },
        { voice: 'female', text: "My internet has been incredibly slow for the past three days. I can barely load a web page, and streaming is impossible." },
        { voice: 'male', text: "I'm sorry about that. Let me look into your account." },
      ],
      question: 'What is the customer\'s complaint?',
      options: ['She has no internet connection at all', 'Her internet speed is very slow', 'She was charged too much on her bill', 'She wants to cancel her service'],
      correct: 1, explanation: 'Step 1: "My internet has been incredibly slow." She HAS internet, but it\'s very slow. Not a total outage.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'male', text: "Have you tried restarting your router?" },
        { voice: 'female', text: "Yes, I've restarted it three times and even unplugged it overnight. Nothing changed." },
        { voice: 'male', text: "I see. It looks like there's an issue on our end. We had some maintenance in your area that may have affected your connection. I'm going to reset your line from here, which should fix it within the next hour." },
      ],
      question: 'What caused the slow internet?',
      options: ['A broken router at the customer\'s home', 'Maintenance work done by the internet company', 'Too many devices connected at once', 'The customer\'s computer has a virus'],
      correct: 1, explanation: 'Step 2: Restarting the router was the FAKE solution (tried 3 times, failed). The REAL cause was maintenance on the company\'s end. The tech will reset the line remotely.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'female', text: "And if it's still slow after an hour?" },
        { voice: 'male', text: "Then call us back and we'll send a technician to your home. But I'm quite confident the reset will work." },
        { voice: 'female', text: "Fine. I'll wait an hour and test it. Thank you." },
      ],
      question: 'What will the woman do next?',
      options: ['Switch to a different internet provider', 'Wait an hour and check if the internet improves', 'Go to the company\'s office to complain', 'Ask a technician to come immediately'],
      correct: 1, explanation: 'Step 7: Future. "I\'ll wait an hour and test it." If still slow → call back for a technician. But her immediate next action is waiting and testing.' },
  ],

  // ─── Task 2: Daily Life Conversation ─── (5 scenarios)

  // 2.1 — Missing shirt / party
  [
    { type: 'listenChoose',
      audioLines: [
        { voice: 'male', text: "Julie, is that you? We're going to be late to Susan and Anthony's housewarming party!" },
        { voice: 'female', text: "I know, I know. I'm looking for your blue striped shirt. You asked me to iron it yesterday." },
        { voice: 'male', text: "That's my favorite shirt! Where did you put it?" },
      ],
      question: 'Why are they having this conversation?',
      options: ['They are shopping for new clothes', 'They are late for a party and can\'t find a shirt', 'They are arguing about doing laundry', 'They are planning what to wear tomorrow'],
      correct: 1, explanation: 'Step 1: The WHY. They\'re late to a housewarming party AND can\'t find his shirt. The real trigger is being late, but the conversation is about the missing shirt.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'female', text: "Oh no. I think I donated that one to the thrift store last week by accident." },
        { voice: 'male', text: "You donated my favorite shirt?! How could you mix that up?" },
        { voice: 'female', text: "I'm sorry! I thought it was the old gray one with the stained collar. They looked similar in the pile." },
      ],
      question: 'How is the man feeling?',
      options: ['Relieved that the shirt was found', 'Annoyed and upset about the mistake', 'Sad because the party was cancelled', 'Afraid of going to the thrift store'],
      correct: 1, explanation: 'Step 4: Feelings. "You donated my favorite shirt?!" — he\'s annoyed/upset. NOT sad (the party isn\'t cancelled), not afraid, not relieved. Use precise emotion words.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'male', text: "Well, I can't go to the party without a nice shirt." },
        { voice: 'female', text: "What about your navy blue one? The solid one you wore to dinner last month?" },
        { voice: 'male', text: "I guess that'll work. Let me grab it. We need to leave in five minutes." },
      ],
      question: 'What shirt will the man wear to the party?',
      options: ['The blue striped shirt', 'The gray shirt with the stained collar', 'The solid navy blue shirt', 'A new shirt from the store'],
      correct: 2, explanation: 'Step 7: TRAP! You might select the striped shirt (his favorite) but it was donated. The FUTURE answer is the navy blue one — "I guess that\'ll work." Always pick the LAST decision.' },
  ],

  // 2.2 — Weekend plans
  [
    { type: 'listenChoose',
      audioLines: [
        { voice: 'female', text: "So what do you want to do this weekend? We haven't done anything fun in ages." },
        { voice: 'male', text: "I was thinking we could go hiking at Eagle Mountain. The weather is supposed to be perfect on Saturday." },
        { voice: 'female', text: "Hmm, I don't know. My knee has been bothering me since that run last Tuesday." },
      ],
      question: 'What is the main topic of their conversation?',
      options: ['Planning a vacation abroad', 'Deciding what to do this weekend', 'The woman\'s knee injury', 'A hiking trip they already completed'],
      correct: 1, explanation: 'Step 2: Find the Main Topic. Though hiking and the knee come up, the MAIN topic is deciding on weekend plans. The knee is a factor, not the topic.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'male', text: "What about something less physical? We could check out that new farmers market downtown." },
        { voice: 'female', text: "Oh, I heard about that! They have live music and food trucks too. That sounds much better for my knee." },
        { voice: 'male', text: "Great. And there's a new Thai restaurant on the same street. We could have lunch there after." },
      ],
      question: 'Why does the man suggest the farmers market instead of hiking?',
      options: ['He doesn\'t enjoy hiking anymore', 'The weather forecast changed to rain', 'The woman\'s knee is bothering her', 'The farmers market is free to enter'],
      correct: 2, explanation: 'Step 3: Track explanations. He says "something less physical" — directly responding to her knee issue. The topic SHIFTED from hiking to the market because of her knee.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'female', text: "What time should we go? I prefer mornings when it's less crowded." },
        { voice: 'male', text: "It opens at nine. Let's get there early, walk around, then hit the Thai place for lunch around noon." },
        { voice: 'female', text: "Perfect plan. I'll set an alarm so we don't sleep in." },
      ],
      question: 'What will they do on Saturday?',
      options: ['Go hiking at Eagle Mountain in the morning', 'Visit the farmers market and then have Thai food', 'Stay home because of the woman\'s knee', 'Go to a concert downtown at night'],
      correct: 1, explanation: 'Step 7: Future plan. Farmers market at 9 AM → Thai restaurant around noon. NOT hiking (that was rejected). The conversation shifted and the final plan is market + Thai food.' },
  ],

  // 2.3 — New neighbor's dog
  [
    { type: 'listenChoose',
      audioLines: [
        { voice: 'female', text: "Have you met the new neighbors yet? They moved in last weekend." },
        { voice: 'male', text: "Not officially, but I've seen them. They have a huge dog that barks every morning at six." },
        { voice: 'female', text: "Oh no, is it waking you up?" },
      ],
      question: 'What are they mainly talking about?',
      options: ['Planning a welcome party for the neighbors', 'The new neighbor\'s dog and its barking', 'Problems with the neighborhood in general', 'Buying a dog of their own'],
      correct: 1, explanation: 'Step 2: Main Topic. Though it starts with "new neighbors," the conversation centers on the DOG and its barking. The topic is the dog, not the neighbors generally.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'male', text: "Every single morning. I'm exhausted. I even tried sleeping with earplugs, but I can still hear it." },
        { voice: 'female', text: "Maybe you should go introduce yourself and mention it gently. They might not realize how loud it is." },
        { voice: 'male', text: "I thought about it, but I don't want to start off on the wrong foot with new neighbors." },
      ],
      question: 'How does the man feel about talking to the neighbors?',
      options: ['Confident he can solve the problem quickly', 'Hesitant because he doesn\'t want to create conflict', 'Angry and ready to file a complaint', 'Indifferent about the whole situation'],
      correct: 1, explanation: 'Step 4: Feelings. He\'s hesitant — "I don\'t want to start off on the wrong foot." He\'s NOT angry (no aggression), not indifferent (he\'s exhausted), and not confident.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'female', text: "What if we bake some cookies and bring them over? It would be a nice way to meet them, and you could casually bring up the early mornings." },
        { voice: 'male', text: "That's actually a great idea. It won't feel like a complaint if we're being friendly first." },
        { voice: 'female', text: "I'll make those chocolate chip ones this afternoon. We can go over together tomorrow evening." },
      ],
      question: 'What do they plan to do?',
      options: ['Call the building manager about the noise', 'Bring cookies to the neighbors and mention the barking casually', 'Put a complaint letter under the neighbor\'s door', 'Buy earplugs for both of them'],
      correct: 1, explanation: 'Step 7: Future. Bake cookies this afternoon → visit neighbors tomorrow evening → casually mention the barking. A friendly approach, not a formal complaint.' },
  ],

  // 2.4 — Gift for mom's birthday
  [
    { type: 'listenChoose',
      audioLines: [
        { voice: 'male', text: "Mom's birthday is next Saturday and I have absolutely no idea what to get her." },
        { voice: 'female', text: "Didn't she mention wanting a new scarf? She said hers got ruined in the wash." },
        { voice: 'male', text: "She did say that, but scarves feel so impersonal. I want to get her something more meaningful." },
      ],
      question: 'Why are they having this conversation?',
      options: ['They forgot about their mother\'s birthday', 'They need to decide on a birthday gift for their mom', 'They want to plan a surprise party', 'Their mother asked them to buy her a scarf'],
      correct: 1, explanation: 'Step 1: The WHY. "Mom\'s birthday is next Saturday and I have no idea what to get her." They need to decide on a gift.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'female', text: "What about a spa day? She always talks about how stressed she is from work." },
        { voice: 'male', text: "That's a good idea, but those gift certificates are really expensive. Like over two hundred dollars." },
        { voice: 'female', text: "True. Oh! What about a cooking class? She's been watching those baking shows every night." },
        { voice: 'male', text: "Now that's perfect. She'd love that. And we could sign up together so it's like a family activity." },
      ],
      question: 'Why do they reject the spa day idea?',
      options: ['Their mother doesn\'t like spas', 'It is too far from their mother\'s house', 'It is too expensive', 'They already gave her a spa gift last year'],
      correct: 2, explanation: 'Step 3: Track the discussion. The spa was rejected because "those gift certificates are really expensive — over two hundred dollars." Price was the deciding factor.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'female', text: "Should we look for a baking class specifically? She's obsessed with that bread-making show." },
        { voice: 'male', text: "Yes, a baking class! I'll search online tonight and book one for next weekend." },
        { voice: 'female', text: "And I'll get a card. Let's keep it a surprise — don't tell her anything." },
      ],
      question: 'What gift will they give their mother?',
      options: ['A new scarf to replace the ruined one', 'A spa day gift certificate', 'A baking class they can do together', 'A bread-making cookbook'],
      correct: 2, explanation: 'Step 7: Future. They decided on a BAKING class (not just cooking). He\'ll book it tonight. It\'s a surprise. The scarf and spa were both rejected earlier.' },
  ],

  // 2.5 — Coworker's lunch habits
  [
    { type: 'listenChoose',
      audioLines: [
        { voice: 'female', text: "Have you noticed that the break room always smells like fish now?" },
        { voice: 'male', text: "Oh, you mean because of David? He started bringing fish curry for lunch every single day." },
        { voice: 'female', text: "Every day? No wonder the microwave smells terrible." },
      ],
      question: 'What triggered this conversation?',
      options: ['The office kitchen needs cleaning', 'A coworker\'s fish curry is causing a smell in the break room', 'The microwave in the break room is broken', 'Someone complained to management about food'],
      correct: 1, explanation: 'Step 1: The WHY. The fish curry smell is the trigger. The microwave smelling bad is a RESULT, not the cause.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'male', text: "I actually mentioned it to him last week. I said the smell lingers all afternoon." },
        { voice: 'female', text: "What did he say?" },
        { voice: 'male', text: "He got a bit defensive. He said he has every right to eat whatever he wants." },
        { voice: 'female', text: "I mean, he does, but there should be some consideration for shared spaces." },
      ],
      question: 'How did David react when told about the smell?',
      options: ['He apologized and offered to change his lunch', 'He became defensive and said he can eat what he wants', 'He ignored the comment completely', 'He agreed and started eating at his desk'],
      correct: 1, explanation: 'Step 4: Feelings & reactions. David "got a bit defensive" and said he has "every right to eat whatever he wants." Defensive, not apologetic or indifferent.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'female', text: "Maybe we should suggest getting a better ventilation fan for the break room instead of making it about David." },
        { voice: 'male', text: "That's smart. We could bring it up at the team meeting on Thursday as a general improvement." },
        { voice: 'female', text: "Exactly. Nobody gets singled out, and the problem gets solved." },
      ],
      question: 'What do they plan to do about the situation?',
      options: ['Report David to their manager', 'Suggest better ventilation at the team meeting', 'Ask David to stop bringing fish curry', 'Start eating lunch at a restaurant instead'],
      correct: 1, explanation: 'Step 7: Future. They\'ll suggest a ventilation fan at Thursday\'s team meeting — framing it as a general improvement, NOT targeting David. A diplomatic approach.' },
  ],

  // ─── Task 3: Listening for Information ─── (5 scenarios)

  // 3.1 — Apartment rental
  [
    { type: 'listenChoose',
      audioLines: [
        { voice: 'female', text: "Hi, I saw a sign on the front door about apartments available. I was wondering if I could get some information." },
        { voice: 'male', text: "Sure. We have two units open right now. One is on the ground floor and the other is on the third floor." },
        { voice: 'female', text: "Great. What's the difference between them?" },
      ],
      question: 'Why did the woman come to the building?',
      options: ['She wants to visit a friend who lives there', 'She saw a sign about available apartments', 'She is delivering a package', 'She has a meeting with the building owner'],
      correct: 1, explanation: 'Step 1: Why are they talking? "I saw a sign on the front door about apartments available." She came because of the sign — this specific detail will be tested.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'male', text: "The ground floor unit has an open floor plan — the kitchen and living room flow together. It's eight hundred and fifty square feet." },
        { voice: 'female', text: "And the one upstairs?" },
        { voice: 'male', text: "Same size, but it has two separate bedrooms with walls between the living area and kitchen. It also gets more natural light." },
        { voice: 'female', text: "I think I'd prefer the open layout. I work from home and I like having a big open space." },
      ],
      question: 'Which apartment does the woman prefer and why?',
      options: ['The third floor, because it has more light', 'The ground floor, because she likes the open layout for working from home', 'The third floor, because it has two bedrooms', 'The ground floor, because it is cheaper'],
      correct: 1, explanation: 'Step 3: Identify Choices. She says "I\'d prefer the open layout" and explains she works from home and likes open space. The choice is ground floor + open plan.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'female', text: "When could I move in?" },
        { voice: 'male', text: "The ground floor unit is available the first of next month. Would you like to see it? I can show you around at three this afternoon." },
        { voice: 'female', text: "That would be great. I'll go grab a coffee and come back then." },
      ],
      question: 'What will happen next?',
      options: ['The woman will sign the lease immediately', 'The woman will return at three to see the apartment', 'The man will call her tomorrow with more details', 'The woman will look at other buildings first'],
      correct: 1, explanation: 'Step 7: Future. "I can show you at three" + "I\'ll go grab a coffee and come back." She\'ll return at 3 PM to view the apartment. Not signing yet — just viewing.' },
  ],

  // 3.2 — Gym membership
  [
    { type: 'listenChoose',
      audioLines: [
        { voice: 'male', text: "Hi, I'm interested in joining the gym. A friend of mine is a member and recommended this place." },
        { voice: 'female', text: "That's great to hear! We have three membership options. Would you like me to go over them?" },
        { voice: 'male', text: "Yes, please. I'm mainly interested in using the pool and weight room." },
      ],
      question: 'Why is the man at the gym?',
      options: ['He wants to cancel his membership', 'He is looking for information about joining', 'He is meeting his friend for a workout', 'He is applying for a job there'],
      correct: 1, explanation: 'Step 1: Why are they talking? "I\'m interested in joining the gym." He was recommended by a friend and wants membership information.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'female', text: "Our basic plan is forty dollars a month and includes the weight room and group classes. The premium plan is sixty-five and adds the pool, sauna, and personal training sessions." },
        { voice: 'male', text: "What about the third option?" },
        { voice: 'female', text: "That's our annual plan — six hundred for the year, which comes to fifty a month. It includes everything in the premium plan." },
        { voice: 'male', text: "So the annual plan is actually cheaper than premium monthly? And it includes the pool?" },
        { voice: 'female', text: "Exactly. It's our best value." },
      ],
      question: 'Which plan is the best value according to the employee?',
      options: ['The basic plan at forty dollars a month', 'The premium plan at sixty-five a month', 'The annual plan at six hundred per year', 'A student discount plan'],
      correct: 2, explanation: 'Step 2: Track information. The annual plan ($600/year = $50/month) includes everything in premium ($65/month). The employee says "it\'s our best value."' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'male', text: "I think the annual plan makes the most sense since I want the pool anyway. Can I start today?" },
        { voice: 'female', text: "Absolutely. I just need your ID and we can set everything up. Your first session with a personal trainer can be booked for this week." },
        { voice: 'male', text: "Perfect. Let's do it." },
      ],
      question: 'What does the man decide to do?',
      options: ['Sign up for the basic plan to save money', 'Think about it and come back next week', 'Sign up for the annual plan starting today', 'Ask his friend for more advice first'],
      correct: 2, explanation: 'Step 3: The Choice. "The annual plan makes the most sense" + "Can I start today?" He\'s signing up for the annual plan immediately.' },
  ],

  // 3.3 — Library services
  [
    { type: 'listenChoose',
      audioLines: [
        { voice: 'female', text: "Excuse me, I just moved to the area and I'd like to get a library card. Is there anything I need to bring?" },
        { voice: 'male', text: "Welcome! All you need is a piece of ID with your current address. A utility bill or bank statement works too." },
        { voice: 'female', text: "I have my driver's license. It has my new address on it." },
      ],
      question: 'What does the woman need to get a library card?',
      options: ['A letter from her previous library', 'Two forms of photo identification', 'An ID showing her current address', 'A recommendation from a current member'],
      correct: 2, explanation: 'Step 2: Track Q&A. She needs "a piece of ID with your current address." A driver\'s license, utility bill, or bank statement would work.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'male', text: "With your card, you can borrow up to twenty items at a time. Books are for three weeks, movies for one week, and we also have a free digital library with audiobooks and e-books." },
        { voice: 'female', text: "Oh, I love audiobooks! How do I access the digital library?" },
        { voice: 'male', text: "Just download the library app on your phone and sign in with your card number. Everything is free." },
      ],
      question: 'How long can movies be borrowed?',
      options: ['Three days', 'One week', 'Two weeks', 'Three weeks'],
      correct: 1, explanation: 'Step 6: Details. Books = three weeks, movies = one week. Listen carefully when specific details are given about different categories.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'female', text: "One more question — do you have any programs for newcomers? I'm from Brazil and I'd love to improve my English." },
        { voice: 'male', text: "Yes! We have free English conversation circles every Wednesday evening at six. And there's a newcomer orientation this Saturday at ten." },
        { voice: 'female', text: "That's wonderful. I'll definitely come to the orientation on Saturday." },
      ],
      question: 'What will the woman attend first?',
      options: ['The English conversation circle on Wednesday', 'The newcomer orientation on Saturday', 'A reading club next month', 'A digital library workshop online'],
      correct: 1, explanation: 'Step 7: Future. She says "I\'ll definitely come to the orientation on Saturday." The conversation circles are Wednesday (ongoing), but her FIRST action is Saturday\'s orientation.' },
  ],

  // 3.4 — Dentist appointment
  [
    { type: 'listenChoose',
      audioLines: [
        { voice: 'male', text: "Good morning. I'd like to book a dental checkup. I haven't been to a dentist in about two years." },
        { voice: 'female', text: "No problem. Are you a new patient with us?" },
        { voice: 'male', text: "Yes, this is my first time. A colleague recommended your clinic." },
      ],
      question: 'Why is the man calling?',
      options: ['To complain about a previous visit', 'To schedule a dental checkup as a new patient', 'To ask about dental insurance', 'To cancel an existing appointment'],
      correct: 1, explanation: 'Step 1: He wants to book a checkup. He\'s a new patient (hasn\'t been to a dentist in two years) referred by a colleague.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'female', text: "For new patients, the first visit includes X-rays, a cleaning, and a full examination. It takes about an hour and a half." },
        { voice: 'male', text: "Is that covered by insurance?" },
        { voice: 'female', text: "The checkup and cleaning are fully covered by most plans. X-rays depend on your provider, but we can check that for you before the appointment." },
      ],
      question: 'What is included in the first visit?',
      options: ['Only a quick examination', 'X-rays, cleaning, and a full examination', 'Teeth whitening and a cleaning', 'A consultation about braces'],
      correct: 1, explanation: 'Step 2: Track information. "X-rays, a cleaning, and a full examination" — all three. Takes about an hour and a half.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'female', text: "We have openings this Thursday at two, or next Monday morning at nine." },
        { voice: 'male', text: "I work until five on weekdays. Is there anything available on a Saturday?" },
        { voice: 'female', text: "We have Saturday appointments once a month. The next one is in two weeks, on the nineteenth, at ten in the morning." },
        { voice: 'male', text: "That works perfectly. Let's book that one." },
      ],
      question: 'When will the man\'s appointment be?',
      options: ['Thursday at two in the afternoon', 'Monday morning at nine', 'Saturday the nineteenth at ten in the morning', 'He will call back to confirm later'],
      correct: 2, explanation: 'Step 3: The Choice. He rejected Thursday and Monday (works until 5). He chose Saturday the 19th at 10 AM — the only option that fits his schedule.' },
  ],

  // 3.5 — Car rental
  [
    { type: 'listenChoose',
      audioLines: [
        { voice: 'female', text: "Hi, I'd like to rent a car for this weekend. I'm driving to Banff with my family." },
        { voice: 'male', text: "Great choice! How many people will be traveling?" },
        { voice: 'female', text: "Four adults and two children. So we'll need something with enough space for everyone plus our luggage." },
      ],
      question: 'What does the woman need?',
      options: ['A small car for a business trip', 'A large vehicle for a family trip to Banff', 'A truck to move furniture', 'A car for her daily commute'],
      correct: 1, explanation: 'Step 1: She needs a car for her family (4 adults + 2 kids + luggage) going to Banff. Size and space are the key requirements.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'male', text: "We have a midsize SUV for eighty-five dollars a day, or a full-size minivan for a hundred and ten. The minivan has a third row and a bigger trunk." },
        { voice: 'female', text: "With six people and suitcases, I think we'll need the extra space. But a hundred and ten per day for three days is quite a lot." },
        { voice: 'male', text: "I can offer you our weekend special — three days for two hundred and ninety instead of three hundred and thirty. That saves you forty dollars." },
      ],
      question: 'Why does the woman hesitate about the minivan?',
      options: ['She thinks it\'s too big to drive', 'She prefers the color of the SUV', 'The daily price is expensive for three days', 'Her children don\'t like minivans'],
      correct: 2, explanation: 'Step 3: She says "$110 per day for three days is quite a lot." Price is the concern. The employee then offers a discount to address it.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'female', text: "Two hundred and ninety for the weekend? That's much better. I'll take the minivan with the weekend special." },
        { voice: 'male', text: "Perfect. You can pick it up Friday afternoon after three, and return it by Monday at noon." },
        { voice: 'female', text: "We'll be there Friday around four. Thank you!" },
      ],
      question: 'What does the woman decide?',
      options: ['She chooses the midsize SUV to save money', 'She rents the minivan with the weekend discount', 'She decides to wait and compare other rental companies', 'She cancels the trip because it\'s too expensive'],
      correct: 1, explanation: 'Step 3: The Choice. Minivan + weekend special ($290 for 3 days). She\'ll pick it up Friday around 4 PM and return Monday by noon.' },
  ],
];
