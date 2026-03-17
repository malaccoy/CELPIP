// Restructure Speaking Drills: by CLB level, not topic
// Level 1: Beginner CLB 5-6 (FREE)
// Level 2: Intermediate CLB 7-8 (PRO)  
// Level 3: Advanced CLB 9-12 (PRO)

const fs = require('fs');

const beginner = {
  id: 0,
  title: "Beginner",
  subtitle: "CLB 5-6 · Build your foundation",
  icon: "🟢",
  level: "beginner",
  exercises: [
    // Basic vocabulary & simple structures
    {
      type: "choose",
      question: "Which is the correct way to start giving advice?",
      options: ["You must do this.", "I think you should try...", "Do it now.", "Why don't you just..."],
      correct: 1,
      explanation: "'I think you should try...' is polite and natural — good for CLB 5-6."
    },
    {
      type: "fillGap",
      sentence: "I think you ________ try going to the park on weekends.",
      options: ["should", "must", "will", "can't"],
      correct: 0,
      explanation: "'Should' is the most natural way to give friendly advice."
    },
    {
      type: "choose",
      question: "Your friend is tired. Which advice sounds most natural?",
      options: [
        "You need sleep immediately.",
        "Maybe you should get some rest tonight.",
        "Sleep is important for health.",
        "I order you to sleep."
      ],
      correct: 1,
      explanation: "'Maybe you should...' is a gentle, natural way to suggest something."
    },
    {
      type: "reorder",
      instruction: "Build a simple advice sentence:",
      words: ["I", "think", "you", "should", "take", "a", "break"],
      correct: [0, 1, 2, 3, 4, 5, 6],
      explanation: "'I think you should take a break' — simple, clear advice structure."
    },
    {
      type: "fillGap",
      sentence: "The park is ________ my house. It takes 5 minutes to walk there.",
      options: ["near", "far", "behind", "above"],
      correct: 0,
      explanation: "'Near' describes a short distance — a basic location word you'll use often."
    },
    {
      type: "choose",
      question: "How do you describe where something is in a picture?",
      options: [
        "The thing is there.",
        "On the left side, there is a tree.",
        "Tree left.",
        "I see things."
      ],
      correct: 1,
      explanation: "'On the left side, there is...' gives a clear location. Always say WHERE things are."
    },
    {
      type: "match",
      instruction: "Match the location word to its meaning:",
      pairs: [
        { left: "On the left", right: "Left side of the image" },
        { left: "In the middle", right: "Center of the image" },
        { left: "On the right", right: "Right side of the image" },
        { left: "In the back", right: "Far away in the image" }
      ]
    },
    {
      type: "fillGap",
      sentence: "I ________ to the store yesterday and bought some groceries.",
      options: ["went", "go", "going", "gone"],
      correct: 0,
      explanation: "'Went' is the past tense of 'go'. When describing past experiences, use past tense."
    },
    {
      type: "choose",
      question: "Which sentence uses the past tense correctly?",
      options: [
        "Yesterday I go to the mall.",
        "Yesterday I went to the mall.",
        "Yesterday I going to the mall.",
        "Yesterday I will go to the mall."
      ],
      correct: 1,
      explanation: "'Went' is correct for past events. 'Go' is present, 'going' needs a helper verb."
    },
    {
      type: "reorder",
      instruction: "Describe a past event:",
      words: ["Last", "week", "I", "visited", "my", "friend"],
      correct: [0, 1, 2, 3, 4, 5],
      explanation: "'Last week I visited my friend' — time marker + subject + past verb."
    },
    {
      type: "choose",
      question: "Which is the best opening for describing a picture?",
      options: [
        "I see a picture.",
        "In this image, I can see a busy street.",
        "There are things.",
        "The picture has colors."
      ],
      correct: 1,
      explanation: "'In this image, I can see...' is a clear, natural opening for scene description."
    },
    {
      type: "fillGap",
      sentence: "There ________ many people walking in the park today.",
      options: ["are", "is", "was", "be"],
      correct: 0,
      explanation: "'There are' for plural (many people). 'There is' for singular."
    },
    {
      type: "choose",
      question: "Which word connects two ideas?",
      options: ["And", "The", "A", "It"],
      correct: 0,
      explanation: "'And' connects ideas: 'I like coffee AND tea.' It's the simplest connector."
    },
    {
      type: "fillGap",
      sentence: "I like this restaurant ________ the food is delicious.",
      options: ["because", "but", "or", "so"],
      correct: 0,
      explanation: "'Because' gives a reason: I like it BECAUSE the food is good."
    },
    {
      type: "match",
      instruction: "Match the connector to its use:",
      pairs: [
        { left: "And", right: "Add more information" },
        { left: "But", right: "Show a contrast" },
        { left: "Because", right: "Give a reason" },
        { left: "So", right: "Show a result" }
      ]
    },
    {
      type: "choose",
      question: "What does 'I will probably...' mean?",
      options: ["100% certain", "Likely but not sure", "Impossible", "Already happened"],
      correct: 1,
      explanation: "'Probably' means you think it's likely but you're not 100% sure."
    },
    {
      type: "reorder",
      instruction: "Make a prediction:",
      words: ["I", "think", "it", "will", "rain", "tomorrow"],
      correct: [0, 1, 2, 3, 4, 5],
      explanation: "'I think it will rain tomorrow' — opinion + future prediction."
    },
    {
      type: "fillGap",
      sentence: "In my ________, this is the best restaurant in town.",
      options: ["opinion", "idea", "head", "brain"],
      correct: 0,
      explanation: "'In my opinion' is the standard phrase for sharing what you think."
    },
    {
      type: "choose",
      question: "How long is the CELPIP Speaking section?",
      options: ["5-10 minutes", "15-20 minutes", "30-40 minutes", "1 hour"],
      correct: 1,
      explanation: "The Speaking section takes about 15-20 minutes total."
    },
    {
      type: "choose",
      question: "Which ending is better for a speaking task?",
      options: [
        "That's all.",
        "So, I hope this helps you make a decision.",
        "I'm done talking.",
        "Thank you for listening."
      ],
      correct: 1,
      explanation: "A natural closing that connects back to the topic sounds much better than 'That's all.'"
    },
    {
      type: "fillGap",
      sentence: "The weather today is very ________. I think we should stay inside.",
      options: ["cold", "happy", "big", "fast"],
      correct: 0,
      explanation: "Basic adjectives like 'cold', 'hot', 'nice' are essential for descriptions."
    },
    {
      type: "reorder",
      instruction: "Give a simple opinion:",
      words: ["I", "believe", "this", "is", "a", "good", "idea"],
      correct: [0, 1, 2, 3, 4, 5, 6],
      explanation: "'I believe this is a good idea' — clear, simple opinion structure."
    },
    {
      type: "choose",
      question: "Which phrase asks for help politely?",
      options: [
        "Give me that.",
        "Could you please help me?",
        "Help now.",
        "I need help immediately."
      ],
      correct: 1,
      explanation: "'Could you please...' is polite and appropriate for CELPIP situations."
    },
    {
      type: "fillGap",
      sentence: "Excuse me, ________ you tell me where the bus stop is?",
      options: ["could", "must", "should", "will"],
      correct: 0,
      explanation: "'Could you tell me...' is a polite question form."
    },
    {
      type: "match",
      instruction: "Match the situation to the right phrase:",
      pairs: [
        { left: "Giving advice", right: "I think you should..." },
        { left: "Describing a place", right: "On the left, there is..." },
        { left: "Sharing opinion", right: "In my opinion..." },
        { left: "Making prediction", right: "I think it will..." }
      ]
    },
    // More varied exercises
    {
      type: "choose",
      question: "Which is the BEST way to describe what someone is doing in a picture?",
      options: [
        "Man walking.",
        "A man is walking down the street.",
        "He walks.",
        "Walking is happening."
      ],
      correct: 1,
      explanation: "'A man is walking...' uses present continuous — the best tense for describing actions in pictures."
    },
    {
      type: "fillGap",
      sentence: "She is ________ a book at the coffee shop right now.",
      options: ["reading", "read", "reads", "readed"],
      correct: 0,
      explanation: "Present continuous: is + verb-ing. 'She is reading' describes what's happening now."
    },
    {
      type: "choose",
      question: "Which response is correct? 'How was your weekend?'",
      options: [
        "It was great! I went to the beach.",
        "It is great! I go to the beach.",
        "It will be great! I going to beach.",
        "Weekend good."
      ],
      correct: 0,
      explanation: "Past tense for past events: 'It WAS great' and 'I WENT to the beach.'"
    },
    {
      type: "reorder",
      instruction: "Describe what you see:",
      words: ["There", "is", "a", "woman", "sitting", "on", "the", "bench"],
      correct: [0, 1, 2, 3, 4, 5, 6, 7],
      explanation: "'There is a woman sitting on the bench' — clear scene description."
    },
    {
      type: "fillGap",
      sentence: "I had a great time ________ I was in Vancouver last summer.",
      options: ["when", "but", "or", "if"],
      correct: 0,
      explanation: "'When' connects a time to an event: 'when I was in Vancouver.'"
    }
  ]
};

const intermediate = {
  id: 1,
  title: "Intermediate",
  subtitle: "CLB 7-8 · Level up your responses",
  icon: "🟡",
  level: "intermediate",
  exercises: [
    {
      type: "choose",
      question: "Which advice phrase sounds more natural for CLB 7-8?",
      options: [
        "You should do it.",
        "I would recommend trying a different approach to this.",
        "Do this thing.",
        "It's good to try."
      ],
      correct: 1,
      explanation: "'I would recommend' is more sophisticated than 'you should' — shows range."
    },
    {
      type: "fillGap",
      sentence: "I would ________ recommend visiting the new community center downtown.",
      options: ["definitely", "maybe", "sort of", "kind"],
      correct: 0,
      explanation: "'I would definitely recommend' shows confidence in your suggestion."
    },
    {
      type: "match",
      instruction: "Upgrade these basic phrases:",
      pairs: [
        { left: "I think", right: "I believe / In my view" },
        { left: "It's good", right: "It's beneficial / It's advantageous" },
        { left: "Also", right: "Additionally / Furthermore" },
        { left: "But", right: "However / On the other hand" }
      ]
    },
    {
      type: "reorder",
      instruction: "Build a strong advice sentence:",
      words: ["I", "would", "strongly", "recommend", "looking", "into", "this", "option"],
      correct: [0, 1, 2, 3, 4, 5, 6, 7],
      explanation: "'I would strongly recommend looking into this option' — confident, specific advice."
    },
    {
      type: "choose",
      question: "Which transition connects a contrasting idea?",
      options: ["Furthermore", "However", "Additionally", "Moreover"],
      correct: 1,
      explanation: "'However' introduces a contrast. 'Furthermore', 'Additionally', and 'Moreover' all ADD info."
    },
    {
      type: "fillGap",
      sentence: "The restaurant has great food. ________, the service can be quite slow during weekends.",
      options: ["However", "Also", "And", "Because"],
      correct: 0,
      explanation: "'However' shows contrast: food is great BUT service is slow."
    },
    {
      type: "choose",
      question: "Which description is more detailed?",
      options: [
        "There are some people in the park.",
        "In the foreground, several families appear to be enjoying a picnic near the lake.",
      ],
      correct: 1,
      explanation: "Location words (foreground) + specific details (families, picnic, lake) = higher score."
    },
    {
      type: "fillGap",
      sentence: "In the ________, I can see a couple walking their dog along the pathway.",
      options: ["background", "picture", "place", "area"],
      correct: 0,
      explanation: "'In the background' precisely locates what you're describing — examiners love this."
    },
    {
      type: "match",
      instruction: "Match the CELPIP task to its key skill:",
      pairs: [
        { left: "Task 1 — Giving Advice", right: "2-3 suggestions with reasons" },
        { left: "Task 3 — Scene Description", right: "Location words + details" },
        { left: "Task 5 — Compare & Persuade", right: "Choose one, argue with benefits" },
        { left: "Task 7 — Express Opinion", right: "Position + 2 reasons + examples" }
      ]
    },
    {
      type: "reorder",
      instruction: "Start a scene description:",
      words: ["In", "this", "image", "I", "can", "see", "a", "bustling", "marketplace"],
      correct: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      explanation: "'In this image I can see a bustling marketplace' — strong opening with descriptive adjective."
    },
    {
      type: "choose",
      question: "Which prediction phrase shows more confidence?",
      options: [
        "Maybe something will happen.",
        "Based on the evidence, it's likely that she will...",
        "I don't know what will happen.",
        "Something might happen or not."
      ],
      correct: 1,
      explanation: "'Based on the evidence, it's likely that...' shows analytical thinking."
    },
    {
      type: "fillGap",
      sentence: "Based on what we can see, it's ________ that the situation will improve.",
      options: ["likely", "maybe", "possible can", "sure definitely"],
      correct: 0,
      explanation: "'It's likely that...' is a confident but measured prediction — perfect for CLB 7-8."
    },
    {
      type: "choose",
      question: "In Task 5 (Compare & Persuade), should you stay neutral?",
      options: [
        "Yes, present both sides equally",
        "No — choose one side and argue strongly for it",
        "It doesn't matter",
        "Yes, the examiner wants balance"
      ],
      correct: 1,
      explanation: "ALWAYS choose a side. The examiner wants to see your persuasion skills, not neutrality."
    },
    {
      type: "fillGap",
      sentence: "I ________ believe that Option A is the better choice for this situation.",
      options: ["firmly", "kind of", "maybe", "slightly"],
      correct: 0,
      explanation: "'I firmly believe' shows strong conviction — exactly what Task 5 needs."
    },
    {
      type: "reorder",
      instruction: "Build a comparison sentence:",
      words: ["While", "Option", "B", "has", "merit,", "Option", "A", "is", "clearly", "superior"],
      correct: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      explanation: "'While Option B has merit, Option A is clearly superior' — acknowledges both, picks one."
    },
    {
      type: "choose",
      question: "Which is the best way to handle a difficult situation in Task 6?",
      options: [
        "Get angry and complain",
        "Acknowledge the problem, then suggest a diplomatic solution",
        "Ignore the problem",
        "Say you don't know what to do"
      ],
      correct: 1,
      explanation: "Acknowledge + Solve = Task 6 formula. Always stay calm and constructive."
    },
    {
      type: "fillGap",
      sentence: "I completely understand your ________, and I'd like to suggest a possible solution.",
      options: ["concern", "anger", "thing", "stuff"],
      correct: 0,
      explanation: "'I understand your concern' is diplomatic — shows empathy before solving."
    },
    {
      type: "match",
      instruction: "Match the speaking task formula:",
      pairs: [
        { left: "Task 1 formula", right: "Greet → Acknowledge → Advice → Encourage" },
        { left: "Task 2 formula", right: "Set scene → What happened → Feelings → Lesson" },
        { left: "Task 5 formula", right: "Choose → 2 reasons why → Why other is worse → Conclude" },
        { left: "Task 7 formula", right: "Position → Reason 1 + example → Reason 2 → Wrap" }
      ]
    },
    {
      type: "choose",
      question: "Which sentence shows better vocabulary range?",
      options: [
        "The park is good. It has good trees and good paths.",
        "The park is lovely. It features mature trees and well-maintained pathways.",
      ],
      correct: 1,
      explanation: "Varied vocabulary (lovely, features, mature, well-maintained) scores higher than repeating 'good'."
    },
    {
      type: "fillGap",
      sentence: "One significant ________ of this location is its proximity to public transportation.",
      options: ["advantage", "thing", "good", "nice"],
      correct: 0,
      explanation: "'One significant advantage' is more precise and academic than 'one good thing'."
    },
    {
      type: "reorder",
      instruction: "Give a strong opinion opening:",
      words: ["In", "my", "view,", "this", "approach", "offers", "several", "key", "benefits"],
      correct: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      explanation: "'In my view, this approach offers several key benefits' — clear position with preview."
    },
    {
      type: "choose",
      question: "What should you do if you lose your train of thought while speaking?",
      options: [
        "Stop completely and say nothing",
        "Say 'ummm' until you remember",
        "Use a bridge phrase: 'What I'm trying to say is...'",
        "Start over from the beginning"
      ],
      correct: 2,
      explanation: "Bridge phrases buy time naturally. 'What I'm trying to say is...' sounds composed."
    },
    {
      type: "fillGap",
      sentence: "What I'm ________ to convey is that this option benefits everyone involved.",
      options: ["trying", "wanting", "hoping", "thinking"],
      correct: 0,
      explanation: "'What I'm trying to convey' is a natural bridge phrase when you need to refocus."
    },
    {
      type: "choose",
      question: "Which closing works best for an opinion task (90 seconds)?",
      options: [
        "That's my opinion.",
        "In conclusion, I firmly believe this approach addresses all the key concerns I've mentioned.",
        "I'm done now.",
        "So yeah, that's what I think."
      ],
      correct: 1,
      explanation: "Strong conclusions restate your position and reference your arguments."
    },
    {
      type: "fillGap",
      sentence: "________ things considered, I believe this is the most practical solution available.",
      options: ["All", "Some", "Many", "Few"],
      correct: 0,
      explanation: "'All things considered' is a sophisticated concluding phrase — great for wrapping up."
    },
    {
      type: "reorder",
      instruction: "Build a diplomatic response:",
      words: ["I", "understand", "your", "frustration,", "and", "I'd", "like", "to", "help"],
      correct: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      explanation: "Empathy first, then offer to help. Perfect for Task 6."
    },
    {
      type: "choose",
      question: "How should you use your 30-second prep time?",
      options: [
        "Just wait and think of something",
        "Write 2-3 keyword cues for your main points",
        "Write complete sentences",
        "Practice speaking out loud"
      ],
      correct: 1,
      explanation: "Quick keyword cues keep you organized: [Point A] / [Point B] / [Example]. Don't write full sentences — no time."
    },
    {
      type: "fillGap",
      sentence: "Having said ________, there are some potential drawbacks we should consider.",
      options: ["that", "this", "it", "so"],
      correct: 0,
      explanation: "'Having said that' is a powerful transition to introduce a contrasting point."
    },
    {
      type: "choose",
      question: "What grammar tense do you use to describe actions happening in a picture?",
      options: ["Simple past", "Present continuous", "Future", "Past perfect"],
      correct: 1,
      explanation: "Present continuous: 'The man is walking', 'Children are playing'. Describes what's happening NOW in the image."
    },
    {
      type: "fillGap",
      sentence: "The overall ________ of the scene appears to be quite peaceful and relaxed.",
      options: ["atmosphere", "thing", "look", "way"],
      correct: 0,
      explanation: "'Atmosphere' is a sophisticated word for describing the mood of a scene."
    }
  ]
};

const advanced = {
  id: 2,
  title: "Advanced",
  subtitle: "CLB 9-12 · Score 9+ on test day",
  icon: "🔴",
  level: "advanced",
  exercises: [
    {
      type: "choose",
      question: "Which shows the best sentence variety for CLB 9+?",
      options: [
        "I like parks. Parks are good. People go to parks.",
        "Parks offer incredible benefits. Not only do they provide green spaces, but they also serve as community gathering spots. Wouldn't that be valuable?",
      ],
      correct: 1,
      explanation: "Mix of statement + 'Not only...but also' + rhetorical question = excellent variety for 9+."
    },
    {
      type: "fillGap",
      sentence: "The whole experience turned out to be a blessing in ________.",
      options: ["disguise", "hiding", "secret", "cover"],
      correct: 0,
      explanation: "'A blessing in disguise' — using idioms naturally shows CLB 9+ ability."
    },
    {
      type: "match",
      instruction: "Match the idiom to its meaning:",
      pairs: [
        { left: "Hit the nail on the head", right: "Be exactly right" },
        { left: "A blessing in disguise", right: "Bad thing that turns out good" },
        { left: "The tip of the iceberg", right: "Only a small part of the problem" },
        { left: "Break the ice", right: "Start a conversation comfortably" }
      ]
    },
    {
      type: "choose",
      question: "Which hedging phrase shows sophistication?",
      options: [
        "I think maybe...",
        "It might be worth considering the possibility that...",
        "I don't know but...",
        "Probably yes."
      ],
      correct: 1,
      explanation: "'It might be worth considering the possibility that...' shows nuanced thinking — CLB 10+ territory."
    },
    {
      type: "fillGap",
      sentence: "Not ________ does this benefit individuals, but it also strengthens the community as a whole.",
      options: ["only", "just", "simply", "merely"],
      correct: 0,
      explanation: "'Not only...but also' is a powerful emphatic structure — adds sophistication."
    },
    {
      type: "reorder",
      instruction: "Build a CLB 9+ counter-argument:",
      words: ["While", "some", "may", "argue", "otherwise,", "I", "firmly", "believe"],
      correct: [0, 1, 2, 3, 4, 5, 6, 7],
      explanation: "'While some may argue otherwise, I firmly believe...' — counter-argument + strong position."
    },
    {
      type: "choose",
      question: "Which shows better formality range?",
      options: [
        "I think it's great. Really great. Super great.",
        "From a professional standpoint, this is excellent. But honestly? It's also just really exciting.",
      ],
      correct: 1,
      explanation: "Mixing formal ('professional standpoint') with casual ('honestly? exciting') shows range."
    },
    {
      type: "fillGap",
      sentence: "I ________ remember the time I volunteered at the community center — it was absolutely transformative.",
      options: ["vividly", "really", "very", "much"],
      correct: 0,
      explanation: "'Vividly remember' is CLB 9+ vocabulary — much more impactful than 'really remember'."
    },
    {
      type: "choose",
      question: "Which speculative phrase is best for describing an unusual situation?",
      options: [
        "This is weird.",
        "One plausible explanation for this peculiar scene could be that...",
        "I don't understand.",
        "Something strange happened."
      ],
      correct: 1,
      explanation: "'One plausible explanation for this peculiar scene could be that...' — analytical, speculative, sophisticated."
    },
    {
      type: "fillGap",
      sentence: "What immediately ________ my attention is the unusual juxtaposition of the modern architecture against the traditional landscape.",
      options: ["captures", "gets", "sees", "does"],
      correct: 0,
      explanation: "'Captures my attention' + 'juxtaposition' = CLB 10+ vocabulary in action."
    },
    {
      type: "match",
      instruction: "Match the basic phrase to its CLB 9+ upgrade:",
      pairs: [
        { left: "I think he will", right: "I anticipate that he will" },
        { left: "Maybe she", right: "In all likelihood, she" },
        { left: "It's good because", right: "One compelling advantage is that" },
        { left: "In the end", right: "All things considered" }
      ]
    },
    {
      type: "reorder",
      instruction: "Build a sophisticated prediction:",
      words: ["Given", "the", "circumstances,", "I", "anticipate", "a", "favorable", "outcome"],
      correct: [0, 1, 2, 3, 4, 5, 6, 7],
      explanation: "'Given the circumstances, I anticipate a favorable outcome' — analytical prediction language."
    },
    {
      type: "choose",
      question: "When is self-correction helpful?",
      options: [
        "Never — it shows weakness",
        "When done naturally: 'Actually, what I mean to say is...'",
        "You should correct every small mistake",
        "Only in writing"
      ],
      correct: 1,
      explanation: "Natural self-correction shows language monitoring — a CLB 10+ skill."
    },
    {
      type: "fillGap",
      sentence: "Upon closer ________, I notice that the situation is even more intriguing than it initially appeared.",
      options: ["inspection", "look", "view", "check"],
      correct: 0,
      explanation: "'Upon closer inspection' is a sophisticated phrase for adding details to descriptions."
    },
    {
      type: "choose",
      question: "Which conclusion demonstrates the highest level of English?",
      options: [
        "So I guess that's good.",
        "To encapsulate my position, I wholeheartedly maintain that the merits of this approach far outweigh any potential concerns.",
        "That's my answer.",
        "I think I'm right about this."
      ],
      correct: 1,
      explanation: "'Encapsulate', 'wholeheartedly maintain', 'merits outweigh concerns' — CLB 11+ territory."
    },
    {
      type: "fillGap",
      sentence: "It's ________ to assume that the trend will continue based on the evidence we've observed.",
      options: ["reasonable", "good", "nice", "okay"],
      correct: 0,
      explanation: "'It's reasonable to assume' is an analytical phrase — perfect for predictions."
    },
    {
      type: "reorder",
      instruction: "Build an advanced diplomatic response:",
      words: ["I", "appreciate", "your", "patience,", "and", "I'd", "like", "to", "propose", "a", "compromise"],
      correct: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      explanation: "'I appreciate your patience, and I'd like to propose a compromise' — diplomatic CLB 9+ language."
    },
    {
      type: "choose",
      question: "Which rhetorical question engages the listener best?",
      options: [
        "Don't you think?",
        "Wouldn't it be far more beneficial if we approached this from a community-wide perspective?",
        "Right?",
        "You agree?"
      ],
      correct: 1,
      explanation: "Detailed rhetorical questions with strong vocabulary show confidence and engage the listener."
    },
    {
      type: "fillGap",
      sentence: "In all ________, the outcome will be significantly more positive than what we initially anticipated.",
      options: ["likelihood", "ways", "cases", "times"],
      correct: 0,
      explanation: "'In all likelihood' replaces 'probably' — much more sophisticated for CLB 9+."
    },
    {
      type: "match",
      instruction: "Match the emotion word to its CLB 9+ upgrade:",
      pairs: [
        { left: "Happy", right: "Thrilled / Overjoyed" },
        { left: "Scared", right: "Apprehensive / Petrified" },
        { left: "Surprised", right: "Astonished / Taken aback" },
        { left: "Sad", right: "Disheartened / Devastated" }
      ]
    },
    {
      type: "choose",
      question: "Which phrase best introduces an example in a CLB 9+ response?",
      options: [
        "For example...",
        "To illustrate this point, consider the scenario where...",
        "Like...",
        "One time..."
      ],
      correct: 1,
      explanation: "'To illustrate this point, consider the scenario where...' — academic, analytical, engaging."
    },
    {
      type: "fillGap",
      sentence: "The ________ of this approach is that it addresses both the immediate concern and the underlying issue.",
      options: ["beauty", "good", "nice", "great"],
      correct: 0,
      explanation: "'The beauty of this approach' is an idiomatic phrase that shows natural fluency."
    },
    {
      type: "reorder",
      instruction: "Build an advanced opinion opening:",
      words: ["I", "wholeheartedly", "agree", "with", "this", "perspective,", "and", "I", "have", "compelling", "reasons"],
      correct: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      explanation: "'I wholeheartedly agree with this perspective, and I have compelling reasons' — strong CLB 9+ opening."
    },
    {
      type: "choose",
      question: "What separates CLB 9 from CLB 12?",
      options: [
        "Speaking faster",
        "Using bigger words",
        "Natural idioms, varied structures, rhetorical devices, and nuanced thinking",
        "Having a better accent"
      ],
      correct: 2,
      explanation: "CLB 12 isn't about speed or big words — it's about natural fluency, variety, and depth of expression."
    },
    {
      type: "fillGap",
      sentence: "________ a doubt, this initiative represents a paradigm shift in how we approach community development.",
      options: ["Without", "With", "Beyond", "Past"],
      correct: 0,
      explanation: "'Without a doubt' + 'paradigm shift' = CLB 11+ conviction with academic vocabulary."
    },
    {
      type: "choose",
      question: "Which shows the most natural use of an idiom?",
      options: [
        "We need to hit the nail on the head about this problem.",
        "I think Sarah really hit the nail on the head when she mentioned the budget concerns.",
        "The nail was hit on the head.",
        "Hit the nail on the head, that's what I say."
      ],
      correct: 1,
      explanation: "Idioms work best embedded naturally in context — not forced or isolated."
    },
    {
      type: "fillGap",
      sentence: "First and ________, I believe we need to address the root cause rather than merely treating the symptoms.",
      options: ["foremost", "first", "important", "main"],
      correct: 0,
      explanation: "'First and foremost' is an emphatic opener — plus 'root cause vs symptoms' shows analytical depth."
    },
    {
      type: "match",
      instruction: "Match the advanced technique to its purpose:",
      pairs: [
        { left: "Rhetorical question", right: "Engage the listener, show confidence" },
        { left: "Self-correction", right: "Show language monitoring ability" },
        { left: "Idioms", right: "Demonstrate natural fluency" },
        { left: "Counter-argument", right: "Show intellectual maturity" }
      ]
    },
    {
      type: "reorder",
      instruction: "Build a counter-argument conclusion:",
      words: ["Nevertheless,", "the", "evidence", "overwhelmingly", "supports", "my", "initial", "position"],
      correct: [0, 1, 2, 3, 4, 5, 6, 7],
      explanation: "'Nevertheless, the evidence overwhelmingly supports my initial position' — powerful concluding statement."
    },
    {
      type: "fillGap",
      sentence: "To ________ my position, the benefits of this approach are both immediate and far-reaching.",
      options: ["encapsulate", "say", "tell", "show"],
      correct: 0,
      explanation: "'To encapsulate' is CLB 11+ vocabulary for summarizing your position elegantly."
    }
  ]
};

const courseData = {
  id: 'speaking',
  title: 'Speaking Drills',
  description: 'Practice all 8 CELPIP Speaking tasks with interactive drills',
  icon: '🎤',
  totalUnits: 3,
  freeUnits: 0, // Only unit 0 (Beginner) is free
  exerciseTypes: ['choose', 'fillGap', 'match', 'reorder'],
  units: [beginner, intermediate, advanced],
};

const outPath = '/var/www/CELPIP/public/data/courses/speaking.json';
fs.writeFileSync(outPath, JSON.stringify(courseData, null, 2));
console.log(`✅ Speaking drills restructured by CLB level:`);
courseData.units.forEach(u => {
  console.log(`   ${u.icon} ${u.title} (${u.level}): ${u.exercises.length} exercises`);
});
console.log(`   Total: ${courseData.units.reduce((s, u) => s + u.exercises.length, 0)} exercises`);
