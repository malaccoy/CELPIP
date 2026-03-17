// Generate Speaking Course — Duolingo-style units with learn + practice
// Each unit: brief lesson → 8-10 interactive exercises

const units = [
  {
    id: 1,
    title: "First Impressions",
    subtitle: "How CELPIP Speaking works",
    icon: "🎤",
    lesson: {
      title: "Welcome to CELPIP Speaking!",
      points: [
        "CELPIP Speaking has 8 tasks, each with a different format",
        "You get 30-60 seconds to prepare before each task",
        "You speak for 60-90 seconds per task",
        "The test judges HOW you say it, not WHAT you say",
        "Use contractions naturally: I've, don't, here's"
      ]
    },
    exercises: [
      {
        type: "choose",
        question: "How many speaking tasks are in the CELPIP test?",
        options: ["4 tasks", "6 tasks", "8 tasks", "10 tasks"],
        correct: 2,
        explanation: "CELPIP Speaking has exactly 8 tasks, each with a unique format."
      },
      {
        type: "choose",
        question: "What does the CELPIP examiner mainly evaluate?",
        options: ["Your accent", "How you express your ideas", "Whether your opinion is correct", "How fast you speak"],
        correct: 1,
        explanation: "Examiners judge HOW you communicate — structure, vocabulary, fluency — not WHAT your opinion is."
      },
      {
        type: "fillGap",
        sentence: "In CELPIP Speaking, you have 30-60 seconds to ________ before each task.",
        options: ["prepare", "write", "read", "listen"],
        correct: 0,
        explanation: "You always get preparation time — use every second of it!"
      },
      {
        type: "choose",
        question: "Which sounds more natural in CELPIP Speaking?",
        options: ["I do not think that is a good idea.", "I don't think that's a good idea."],
        correct: 1,
        explanation: "Contractions (don't, that's) sound natural in spoken English. CELPIP rewards natural speech."
      },
      {
        type: "fillGap",
        sentence: "The total CELPIP Speaking section takes about ________ minutes.",
        options: ["10", "20", "30", "45"],
        correct: 1,
        explanation: "The entire Speaking section is approximately 20 minutes."
      },
      {
        type: "choose",
        question: "Speaking is the ________ section in the CELPIP exam order.",
        options: ["first", "second", "third", "last"],
        correct: 3,
        explanation: "The order is: Listening → Reading → Writing → Speaking. Speaking is last!"
      },
      {
        type: "reorder",
        instruction: "Put the CELPIP sections in the correct order:",
        words: ["Listening", "Reading", "Writing", "Speaking"],
        correct: [0, 1, 2, 3],
        explanation: "The exam always follows this order: Listening → Reading → Writing → Speaking."
      },
      {
        type: "choose",
        question: "If you make a mistake while speaking, you should:",
        options: ["Stop and apologize", "Start over from the beginning", "Correct it naturally and keep going", "Ignore it completely"],
        correct: 2,
        explanation: "Just correct yourself naturally — 'I mean...' or 'Actually...' — and continue. Never apologize for mistakes."
      }
    ]
  },
  {
    id: 2,
    title: "The CSF Technique",
    subtitle: "Your secret weapon for every task",
    icon: "🎯",
    lesson: {
      title: "Context → Skill → Formula",
      points: [
        "C = Context: What do I need to READ for this task?",
        "S = Skill: What is the EXAMINER looking for?",
        "F = Formula: What is my STEP-BY-STEP structure?",
        "CSF works because CELPIP tasks are ALWAYS the same format",
        "A formula is NOT a template — you customize it every time"
      ]
    },
    exercises: [
      {
        type: "match",
        instruction: "Match each CSF letter to its meaning:",
        pairs: [
          { left: "C — Context", right: "What do I need to read?" },
          { left: "S — Skill", right: "What does the examiner want?" },
          { left: "F — Formula", right: "What is my step-by-step?" }
        ]
      },
      {
        type: "choose",
        question: "Why does the CSF technique work for CELPIP?",
        options: ["Because it's a memorized script", "Because CELPIP tasks are always the same format", "Because it tricks the examiner", "Because it only uses simple words"],
        correct: 1,
        explanation: "CELPIP is the most structured English test — every task follows the exact same format every time."
      },
      {
        type: "fillGap",
        sentence: "The 'C' in CSF stands for ________, which means knowing what to focus on in each task.",
        options: ["Context", "Communication", "Creativity", "Confidence"],
        correct: 0,
        explanation: "Context = knowing what to read and what to skip for each specific task."
      },
      {
        type: "choose",
        question: "What's the difference between a formula and a template?",
        options: ["They are the same thing", "A formula is shorter", "A formula gives structure but you customize the content", "A template is better for high scores"],
        correct: 2,
        explanation: "Templates sound robotic and examiners recognize them. Formulas give structure while you add personal, realistic content."
      },
      {
        type: "fillGap",
        sentence: "Even native English speakers can fail CELPIP because they don't know what the ________ is looking for.",
        options: ["computer", "examiner", "teacher", "audience"],
        correct: 1,
        explanation: "8 out of 10 native speakers don't score 9+ because they don't understand the evaluation criteria."
      },
      {
        type: "choose",
        question: "The 'Skill' in CSF refers to:",
        options: ["Your English level", "Your speaking speed", "What the examiner evaluates in that task", "How many words you know"],
        correct: 2,
        explanation: "Each task has a specific skill the examiner is looking for — advice-giving, describing, persuading, etc."
      },
      {
        type: "reorder",
        instruction: "Put the CSF steps in order:",
        words: ["Context", "Skill", "Formula"],
        correct: [0, 1, 2],
        explanation: "First understand the Context, then know the Skill being tested, then follow your Formula."
      },
      {
        type: "choose",
        question: "When should you learn the CSF for each task?",
        options: ["During the test", "Before the test — through practice", "It doesn't matter", "Only for difficult tasks"],
        correct: 1,
        explanation: "You learn CSF during preparation. On test day, you already know exactly what to do for each task."
      }
    ]
  },
  {
    id: 3,
    title: "Power Phrases",
    subtitle: "Sound like a CLB 9+ speaker",
    icon: "💬",
    lesson: {
      title: "Upgrade Your Vocabulary",
      points: [
        "Replace simple words with CELPIP power phrases",
        "Instead of 'I think' → 'I would strongly recommend'",
        "Instead of 'It's good' → 'One significant advantage is'",
        "Use transition phrases: 'Having said that...', 'On the other hand...'",
        "Hedging phrases show sophistication: 'It might be worth considering...'"
      ]
    },
    exercises: [
      {
        type: "choose",
        question: "Which phrase would score higher on CELPIP?",
        options: ["I think you should go to the park", "I would strongly recommend visiting the park"],
        correct: 1,
        explanation: "'I would strongly recommend' is a CLB 9+ advice phrase — more sophisticated than 'I think you should'."
      },
      {
        type: "fillGap",
        sentence: "________ said that, there are some disadvantages we should consider.",
        options: ["Having", "After", "Before", "When"],
        correct: 0,
        explanation: "'Having said that' is a powerful transition phrase that shows you can present both sides."
      },
      {
        type: "match",
        instruction: "Match the basic phrase to its power upgrade:",
        pairs: [
          { left: "I think", right: "I would strongly suggest" },
          { left: "It's good", right: "One significant advantage is" },
          { left: "Also", right: "Furthermore" },
          { left: "But", right: "On the other hand" }
        ]
      },
      {
        type: "choose",
        question: "Complete: '________ the other hand, this option has some drawbacks.'",
        options: ["In", "On", "At", "By"],
        correct: 1,
        explanation: "'On the other hand' is the correct transition phrase to introduce a contrasting point."
      },
      {
        type: "fillGap",
        sentence: "It might be worth ________ a different approach to this problem.",
        options: ["considering", "thinking", "doing", "making"],
        correct: 0,
        explanation: "'It might be worth considering' is a hedging phrase that shows sophistication — you're suggesting without being forceful."
      },
      {
        type: "choose",
        question: "Which transition phrase introduces an additional point?",
        options: ["However", "Furthermore", "On the other hand", "Nevertheless"],
        correct: 1,
        explanation: "'Furthermore' adds a new supporting point. 'However', 'On the other hand', and 'Nevertheless' introduce contrasts."
      },
      {
        type: "fillGap",
        sentence: "One ________ advantage of this location is its proximity to public transportation.",
        options: ["significant", "big", "very", "much"],
        correct: 0,
        explanation: "'Significant' is more academic and scores higher than 'big' or 'very good'."
      },
      {
        type: "choose",
        question: "Which filler should you AVOID in CELPIP Speaking?",
        options: ["Actually...", "Well, I believe...", "Ummm... uhhh...", "In my opinion..."],
        correct: 2,
        explanation: "Practice natural pauses instead of 'um' and 'uh'. Short silence is better than filler sounds."
      },
      {
        type: "reorder",
        instruction: "Build a CLB 9+ sentence:",
        words: ["I", "would", "strongly", "recommend", "taking", "the", "bus"],
        correct: [0, 1, 2, 3, 4, 5, 6],
        explanation: "'I would strongly recommend taking the bus' — uses a power phrase structure."
      },
      {
        type: "fillGap",
        sentence: "________, I believe this is the best option available to us.",
        options: ["All things considered", "So", "Like", "Anyway"],
        correct: 0,
        explanation: "'All things considered' is a sophisticated concluding phrase — much better than 'So' or 'Anyway'."
      }
    ]
  },
  {
    id: 4,
    title: "Task 1: Giving Advice",
    subtitle: "Help a friend with a personal situation",
    icon: "💡",
    lesson: {
      title: "Task 1 — Giving Advice to a Friend",
      points: [
        "Prep: 30 seconds | Speak: 90 seconds",
        "Context: Read the situation + who you're talking to",
        "Skill: Give detailed, practical advice with reasons",
        "Formula: Greet → Acknowledge → Advice 1 (with reason + example) → Advice 2 → Encourage",
        "Sound like a REAL friend — warm, supportive, specific"
      ]
    },
    exercises: [
      {
        type: "choose",
        question: "In Task 1, how long do you have to speak?",
        options: ["30 seconds", "60 seconds", "90 seconds", "120 seconds"],
        correct: 2,
        explanation: "Task 1 gives you 30 seconds to prepare and 90 seconds to speak."
      },
      {
        type: "reorder",
        instruction: "Put the Task 1 formula in order:",
        words: ["Greet your friend", "Acknowledge the situation", "Give Advice 1 with reason", "Give Advice 2", "Encourage them"],
        correct: [0, 1, 2, 3, 4],
        explanation: "Greet → Acknowledge → Advice 1 (detailed) → Advice 2 → Encourage. This fills 90 seconds perfectly."
      },
      {
        type: "choose",
        question: "Which opening sounds best for Task 1?",
        options: [
          "Hello. I want to give you advice.",
          "Hey! I heard about your situation, and I totally understand how you feel.",
          "Dear friend, I am writing to inform you...",
          "So basically, here's what you should do."
        ],
        correct: 1,
        explanation: "Sound like a real friend — warm, empathetic, natural. Not too formal, not too blunt."
      },
      {
        type: "fillGap",
        sentence: "I totally understand how you ________, and I want to help.",
        options: ["feel", "think", "say", "do"],
        correct: 0,
        explanation: "Acknowledging feelings ('how you feel') shows empathy — this is what examiners look for in Task 1."
      },
      {
        type: "choose",
        question: "Your friend is stressed about a job interview. Which advice is better?",
        options: [
          "Just relax, it will be fine.",
          "I would recommend preparing a list of your key achievements. For example, you could write down three projects you're proud of and practice explaining them."
        ],
        correct: 1,
        explanation: "Specific, actionable advice with examples scores much higher than vague encouragement."
      },
      {
        type: "fillGap",
        sentence: "For ________, you could try going for a walk every morning — it really helped me when I was in a similar situation.",
        options: ["example", "instance", "starters", "one thing"],
        correct: 1,
        explanation: "'For instance' is a great way to introduce a specific example — it sounds natural and academic."
      },
      {
        type: "choose",
        question: "How should you end Task 1?",
        options: [
          "That's it. Good luck.",
          "I really hope this helps! I'm sure you'll do great, and remember, I'm always here if you need to talk.",
          "Thank you for listening to my advice.",
          "In conclusion, follow my advice."
        ],
        correct: 1,
        explanation: "End with genuine encouragement and support — like a real friend would. Warm and personal."
      },
      {
        type: "match",
        instruction: "Match each part of the formula to its purpose:",
        pairs: [
          { left: "Greet", right: "Sound friendly and warm" },
          { left: "Acknowledge", right: "Show you understand their situation" },
          { left: "Advice + Reason", right: "Give specific help with explanation" },
          { left: "Encourage", right: "End on a positive, supportive note" }
        ]
      }
    ]
  },
  {
    id: 5,
    title: "Task 2: Talking About Experience",
    subtitle: "Describe a personal experience",
    icon: "📸",
    lesson: {
      title: "Task 2 — Personal Experience",
      points: [
        "Prep: 30 seconds | Speak: 60 seconds",
        "Context: Read the situation — someone asks about YOUR experience",
        "Skill: Describe a past event with details and emotions",
        "Formula: Set the scene → What happened → How you felt → What you learned",
        "Use past tense naturally and add sensory details"
      ]
    },
    exercises: [
      {
        type: "choose",
        question: "What tense should you mainly use in Task 2?",
        options: ["Present tense", "Past tense", "Future tense", "Present perfect"],
        correct: 1,
        explanation: "You're describing a past experience, so past tense is your main tool: 'I went', 'I felt', 'I learned'."
      },
      {
        type: "fillGap",
        sentence: "I ________ remember the time I went hiking in the Rocky Mountains — it was absolutely breathtaking.",
        options: ["vividly", "good", "much", "very"],
        correct: 0,
        explanation: "'Vividly remember' is a powerful phrase that shows strong vocabulary — much better than 'really remember'."
      },
      {
        type: "choose",
        question: "Which description is more engaging?",
        options: [
          "I went to a nice restaurant.",
          "I visited this charming little Italian restaurant tucked away on a quiet street downtown."
        ],
        correct: 1,
        explanation: "Sensory details ('charming', 'tucked away', 'quiet street') paint a picture and score higher."
      },
      {
        type: "reorder",
        instruction: "Put the Task 2 formula in order:",
        words: ["Set the scene", "Describe what happened", "Share how you felt", "Explain what you learned"],
        correct: [0, 1, 2, 3],
        explanation: "Scene → Event → Feelings → Lesson. This structure keeps you organized in 60 seconds."
      },
      {
        type: "fillGap",
        sentence: "What I ________ from that experience was the importance of staying calm under pressure.",
        options: ["learned", "knew", "thought", "said"],
        correct: 0,
        explanation: "'What I learned' is the perfect way to share the lesson — examiners love reflective conclusions."
      },
      {
        type: "choose",
        question: "Task 2 gives you how long to speak?",
        options: ["30 seconds", "60 seconds", "90 seconds", "120 seconds"],
        correct: 1,
        explanation: "Task 2 is shorter — only 60 seconds. Be concise but detailed."
      },
      {
        type: "match",
        instruction: "Match the emotion word to a stronger alternative:",
        pairs: [
          { left: "Happy", right: "Thrilled / Overjoyed" },
          { left: "Scared", right: "Terrified / Petrified" },
          { left: "Surprised", right: "Astonished / Taken aback" },
          { left: "Sad", right: "Devastated / Heartbroken" }
        ]
      },
      {
        type: "fillGap",
        sentence: "The whole experience was incredibly ________, and it really changed my perspective.",
        options: ["eye-opening", "good", "nice", "okay"],
        correct: 0,
        explanation: "'Eye-opening' is sophisticated vocabulary that shows depth — much better than 'good' or 'nice'."
      }
    ]
  },
  {
    id: 6,
    title: "Task 3: Describing a Scene",
    subtitle: "Talk about what you see in a picture",
    icon: "🖼️",
    lesson: {
      title: "Task 3 — Scene Description",
      points: [
        "Prep: 30 seconds | Speak: 60 seconds",
        "Context: You see a picture — describe what's happening",
        "Skill: Describe location, people, actions, and atmosphere",
        "Formula: Big picture → Left side details → Right side details → Atmosphere/mood",
        "Use location words: in the foreground, behind, next to, in the background"
      ]
    },
    exercises: [
      {
        type: "choose",
        question: "What should you describe FIRST in Task 3?",
        options: ["A small detail", "The overall scene (big picture)", "Your opinion about the picture", "The colors"],
        correct: 1,
        explanation: "Start with the big picture — 'This appears to be a busy park on a sunny afternoon.' Then zoom into details."
      },
      {
        type: "match",
        instruction: "Match the location word to where it describes:",
        pairs: [
          { left: "In the foreground", right: "Close to the viewer, front of image" },
          { left: "In the background", right: "Far away, back of image" },
          { left: "Adjacent to", right: "Right next to something" },
          { left: "In the center", right: "Middle of the image" }
        ]
      },
      {
        type: "fillGap",
        sentence: "In the ________, I can see a family having a picnic on a red blanket.",
        options: ["foreground", "sky", "picture", "color"],
        correct: 0,
        explanation: "'In the foreground' tells the examiner exactly WHERE in the image you're describing."
      },
      {
        type: "choose",
        question: "Which description sounds more CLB 9+?",
        options: [
          "There are some people and trees.",
          "In the foreground, a young couple appears to be enjoying a leisurely stroll along the pathway, while several children can be seen playing in the background."
        ],
        correct: 1,
        explanation: "Use location words, specific vocabulary, and present continuous ('appears to be enjoying') for high scores."
      },
      {
        type: "fillGap",
        sentence: "The overall ________ of the scene seems quite peaceful and relaxed.",
        options: ["atmosphere", "thing", "look", "stuff"],
        correct: 0,
        explanation: "'Atmosphere' is a sophisticated word for describing the mood/feeling of a scene."
      },
      {
        type: "reorder",
        instruction: "Put the Task 3 formula in order:",
        words: ["Describe the big picture", "Detail the left side", "Detail the right side", "Comment on the atmosphere"],
        correct: [0, 1, 2, 3],
        explanation: "Big picture → Left → Right → Atmosphere. This systematic approach ensures you cover everything."
      },
      {
        type: "choose",
        question: "What grammar structure works best for describing actions in a picture?",
        options: ["Simple past ('walked')", "Present continuous ('is walking')", "Future ('will walk')", "Past perfect ('had walked')"],
        correct: 1,
        explanation: "Present continuous ('is walking', 'appears to be enjoying') describes what's happening RIGHT NOW in the picture."
      },
      {
        type: "fillGap",
        sentence: "________ to the main building, there appears to be a small café with outdoor seating.",
        options: ["Adjacent", "Near", "Close", "By"],
        correct: 0,
        explanation: "'Adjacent to' is a CLB 9+ location word — more precise and academic than 'near' or 'close to'."
      }
    ]
  },
  {
    id: 7,
    title: "Task 4: Making Predictions",
    subtitle: "What will happen next?",
    icon: "🔮",
    lesson: {
      title: "Task 4 — Predictions",
      points: [
        "Prep: 30 seconds | Speak: 60 seconds",
        "Context: Look at a picture sequence and predict what happens next",
        "Skill: Make logical predictions with reasons",
        "Formula: Summarize what happened → Prediction 1 (with reason) → Prediction 2 → Conclusion",
        "Use future language: 'will likely', 'is probably going to', 'I anticipate that'"
      ]
    },
    exercises: [
      {
        type: "choose",
        question: "Which prediction phrase sounds most natural for CLB 9+?",
        options: [
          "I think he will go home.",
          "I anticipate that he will most likely head home to reflect on the situation.",
          "He goes home.",
          "Maybe home."
        ],
        correct: 1,
        explanation: "'I anticipate that' + 'most likely' shows sophisticated prediction language."
      },
      {
        type: "fillGap",
        sentence: "Based on what happened, she will ________ decide to change her approach.",
        options: ["likely", "maybe", "possibly can", "sure"],
        correct: 0,
        explanation: "'Will likely' is a natural and sophisticated way to make predictions with confidence."
      },
      {
        type: "match",
        instruction: "Match the basic prediction to its upgrade:",
        pairs: [
          { left: "I think he will", right: "I anticipate that he will" },
          { left: "Maybe she", right: "In all likelihood, she" },
          { left: "It will be", right: "It's bound to be" },
          { left: "Probably", right: "In all probability" }
        ]
      },
      {
        type: "choose",
        question: "In Task 4, what should you do FIRST?",
        options: ["Make your prediction immediately", "Briefly summarize what has happened so far", "Describe the picture in detail", "Give your opinion"],
        correct: 1,
        explanation: "Start by summarizing the situation — this shows you understand the context before making predictions."
      },
      {
        type: "fillGap",
        sentence: "Given the circumstances, it's ________ to assume that they will resolve the conflict peacefully.",
        options: ["reasonable", "good", "nice", "okay"],
        correct: 0,
        explanation: "'It's reasonable to assume' is a CLB 9+ prediction phrase — sounds academic and thoughtful."
      },
      {
        type: "reorder",
        instruction: "Put the Task 4 formula in order:",
        words: ["Summarize what happened", "Make Prediction 1 with reason", "Make Prediction 2", "Conclude with overall outcome"],
        correct: [0, 1, 2, 3],
        explanation: "Summary → Prediction 1 (detailed) → Prediction 2 → Conclusion."
      },
      {
        type: "choose",
        question: "Which reason best supports a prediction?",
        options: [
          "Because I said so.",
          "Because based on the pattern in the images, it seems clear that...",
          "Because that's what I would do.",
          "Because why not?"
        ],
        correct: 1,
        explanation: "Reference evidence from the images — 'based on the pattern' shows analytical thinking."
      },
      {
        type: "fillGap",
        sentence: "In all ________, the situation will improve significantly over the next few weeks.",
        options: ["likelihood", "ways", "cases", "times"],
        correct: 0,
        explanation: "'In all likelihood' is a sophisticated alternative to 'probably' — great for predictions."
      }
    ]
  },
  {
    id: 8,
    title: "Task 5: Comparing Options",
    subtitle: "Choose between two options and explain why",
    icon: "⚖️",
    lesson: {
      title: "Task 5 — Comparing and Persuading",
      points: [
        "Prep: 60 seconds | Speak: 60 seconds",
        "Context: Two options are presented — you MUST choose one",
        "Skill: Compare advantages/disadvantages and persuade",
        "Formula: State your choice → Why it's better (2 reasons) → Why the other is worse → Conclude",
        "Strong opinion language: 'I firmly believe', 'Without a doubt'"
      ]
    },
    exercises: [
      {
        type: "choose",
        question: "In Task 5, should you stay neutral or choose a side?",
        options: ["Stay neutral and present both equally", "Clearly choose one option and argue for it", "Say you don't have an opinion", "Argue for both options"],
        correct: 1,
        explanation: "ALWAYS pick a side. The examiner wants to see your ability to persuade and argue — sitting on the fence scores lower."
      },
      {
        type: "fillGap",
        sentence: "I ________ believe that Option A is the better choice for several compelling reasons.",
        options: ["firmly", "kind of", "maybe", "just"],
        correct: 0,
        explanation: "'I firmly believe' shows strong conviction — exactly what Task 5 requires."
      },
      {
        type: "choose",
        question: "Task 5 gives you how long to prepare?",
        options: ["30 seconds", "45 seconds", "60 seconds", "90 seconds"],
        correct: 2,
        explanation: "Task 5 gives the most prep time — 60 seconds! Use it to plan your arguments."
      },
      {
        type: "match",
        instruction: "Match the weak phrase to its persuasive upgrade:",
        pairs: [
          { left: "I think Option A is good", right: "I firmly believe Option A is superior" },
          { left: "Option B is bad", right: "Option B falls short in several areas" },
          { left: "Also", right: "What's more" },
          { left: "In the end", right: "All things considered" }
        ]
      },
      {
        type: "fillGap",
        sentence: "While Option B has some merit, it ________ short in terms of long-term benefits.",
        options: ["falls", "comes", "gets", "runs"],
        correct: 0,
        explanation: "'Falls short' is a natural idiom for saying something is not good enough — great for comparing."
      },
      {
        type: "reorder",
        instruction: "Put the Task 5 formula in order:",
        words: ["State your choice clearly", "Give 2 reasons why it's better", "Explain why the other option is worse", "Conclude confidently"],
        correct: [0, 1, 2, 3],
        explanation: "Choose → Support → Contrast → Conclude. Strong structure for 60 seconds."
      },
      {
        type: "choose",
        question: "Which conclusion sounds most confident?",
        options: [
          "So I guess Option A is okay.",
          "All things considered, Option A is clearly the superior choice and I would wholeheartedly recommend it.",
          "That's my answer.",
          "I hope you agree with me."
        ],
        correct: 1,
        explanation: "'All things considered' + 'clearly superior' + 'wholeheartedly recommend' = confident CLB 9+ conclusion."
      },
      {
        type: "fillGap",
        sentence: "________ a doubt, this option offers far more advantages than the alternative.",
        options: ["Without", "With", "Beyond", "Past"],
        correct: 0,
        explanation: "'Without a doubt' is a strong conviction phrase — perfect for Task 5 persuasion."
      }
    ]
  },
  {
    id: 9,
    title: "Task 6: Dealing with Difficulty",
    subtitle: "Handle a challenging situation",
    icon: "🔧",
    lesson: {
      title: "Task 6 — Difficult Situations",
      points: [
        "Prep: 60 seconds | Speak: 60 seconds",
        "Context: A problem situation — you choose how to handle it",
        "Skill: Show problem-solving ability and diplomacy",
        "Formula: Acknowledge the problem → Choose approach → Explain your solution → Expected outcome",
        "Be diplomatic: 'I understand your concern', 'I appreciate your patience'"
      ]
    },
    exercises: [
      {
        type: "choose",
        question: "In Task 6, what should you demonstrate?",
        options: ["Anger at the situation", "Problem-solving ability", "That you don't care", "Academic knowledge"],
        correct: 1,
        explanation: "Task 6 tests your ability to handle difficult situations diplomatically and constructively."
      },
      {
        type: "fillGap",
        sentence: "I completely understand your ________, and I want to assure you that we can resolve this together.",
        options: ["concern", "anger", "problem", "thing"],
        correct: 0,
        explanation: "'I understand your concern' is diplomatic and professional — perfect for handling difficult situations."
      },
      {
        type: "choose",
        question: "Which response is most diplomatic?",
        options: [
          "That's your problem, not mine.",
          "I really appreciate your patience, and I'd like to suggest a solution that works for both of us.",
          "Just deal with it.",
          "I don't know what to do."
        ],
        correct: 1,
        explanation: "Acknowledging feelings + offering a collaborative solution = high-scoring diplomacy."
      },
      {
        type: "reorder",
        instruction: "Put the Task 6 formula in order:",
        words: ["Acknowledge the problem", "Choose your approach", "Explain your solution in detail", "Describe the expected outcome"],
        correct: [0, 1, 2, 3],
        explanation: "Acknowledge → Choose → Solve → Outcome. Shows logical problem-solving."
      },
      {
        type: "match",
        instruction: "Match the diplomatic phrase to its use:",
        pairs: [
          { left: "I understand your concern", right: "Acknowledge the problem" },
          { left: "What I'd suggest is", right: "Introduce your solution" },
          { left: "I appreciate your patience", right: "Show respect for the other person" },
          { left: "This way, we can ensure", right: "Describe the positive outcome" }
        ]
      },
      {
        type: "fillGap",
        sentence: "What I'd ________ is that we take a step back and look at this from both perspectives.",
        options: ["suggest", "say", "want", "like"],
        correct: 0,
        explanation: "'What I'd suggest' is a polite, professional way to introduce your solution."
      },
      {
        type: "choose",
        question: "How should you end a Task 6 response?",
        options: [
          "That's all I have to say.",
          "By describing the positive outcome your solution will achieve.",
          "By complaining about the problem again.",
          "By asking the examiner for help."
        ],
        correct: 1,
        explanation: "End with the expected positive outcome — 'This way, we can ensure everyone is satisfied and move forward productively.'"
      },
      {
        type: "fillGap",
        sentence: "This way, we can ________ that everyone involved is satisfied with the outcome.",
        options: ["ensure", "make", "hope", "try"],
        correct: 0,
        explanation: "'Ensure' is more confident and professional than 'hope' or 'try'."
      }
    ]
  },
  {
    id: 10,
    title: "Task 7: Expressing Opinions",
    subtitle: "Agree or disagree and explain why",
    icon: "🗣️",
    lesson: {
      title: "Task 7 — Opinions with Support",
      points: [
        "Prep: 30 seconds | Speak: 90 seconds",
        "Context: A statement is given — agree OR disagree",
        "Skill: State opinion clearly + support with 2-3 arguments",
        "Formula: State opinion → Reason 1 (with example) → Reason 2 → Counter-argument → Restate",
        "Including a counter-argument shows maturity: 'While some may argue that...'"
      ]
    },
    exercises: [
      {
        type: "choose",
        question: "How long do you speak in Task 7?",
        options: ["60 seconds", "75 seconds", "90 seconds", "120 seconds"],
        correct: 2,
        explanation: "Task 7 gives 90 seconds — the joint longest speaking time with Task 1. Use all of it!"
      },
      {
        type: "fillGap",
        sentence: "I ________ agree with this statement, and I have several reasons to support my position.",
        options: ["wholeheartedly", "kind of", "maybe", "sort of"],
        correct: 0,
        explanation: "'Wholeheartedly agree' shows strong, clear conviction — much better than 'kind of' or 'sort of'."
      },
      {
        type: "choose",
        question: "Why should you include a counter-argument?",
        options: [
          "To confuse the examiner",
          "To show you can consider multiple perspectives — it demonstrates maturity",
          "Because you're not sure of your opinion",
          "It's not necessary"
        ],
        correct: 1,
        explanation: "Counter-arguments show intellectual maturity: 'While some may argue X, I believe Y because...'"
      },
      {
        type: "reorder",
        instruction: "Build a counter-argument sentence:",
        words: ["While", "some", "may", "argue", "that...,", "I", "firmly", "believe"],
        correct: [0, 1, 2, 3, 4, 5, 6, 7],
        explanation: "'While some may argue that..., I firmly believe' — perfect counter-argument structure."
      },
      {
        type: "match",
        instruction: "Match the opinion structure to its purpose:",
        pairs: [
          { left: "I wholeheartedly agree", right: "State your opinion clearly" },
          { left: "First and foremost", right: "Introduce your strongest reason" },
          { left: "While some may argue", right: "Acknowledge the other side" },
          { left: "In conclusion", right: "Restate your position firmly" }
        ]
      },
      {
        type: "fillGap",
        sentence: "First and ________, I believe education is the foundation of a successful society.",
        options: ["foremost", "first", "important", "main"],
        correct: 0,
        explanation: "'First and foremost' is an emphatic way to introduce your strongest argument."
      },
      {
        type: "choose",
        question: "Statement: 'Social media does more harm than good.' Which is a better response opening?",
        options: [
          "Social media is bad. I agree.",
          "I wholeheartedly agree that social media, despite its apparent benefits, ultimately causes more harm than good in our society.",
        ],
        correct: 1,
        explanation: "Restate the topic in your own words + clear position + nuance ('despite its apparent benefits') = CLB 9+."
      },
      {
        type: "fillGap",
        sentence: "In ________, I firmly maintain that the benefits far outweigh the drawbacks.",
        options: ["conclusion", "end", "finish", "last"],
        correct: 0,
        explanation: "'In conclusion, I firmly maintain' is a strong way to close Task 7 — confident and decisive."
      }
    ]
  },
  {
    id: 11,
    title: "Task 8: Describing Unusual",
    subtitle: "Talk about an unusual situation",
    icon: "🎭",
    lesson: {
      title: "Task 8 — Describing Something Unusual",
      points: [
        "Prep: 30 seconds | Speak: 60 seconds",
        "Context: Describe an unusual or unexpected situation from pictures",
        "Skill: Use creative, descriptive language",
        "Formula: What's unusual → Describe details → Why it's unexpected → Your reaction",
        "Use speculative language: 'It seems as though', 'One possible explanation is'"
      ]
    },
    exercises: [
      {
        type: "choose",
        question: "What makes Task 8 different from Task 3 (scene description)?",
        options: [
          "They're the same",
          "Task 8 focuses on what's UNUSUAL or UNEXPECTED in the scene",
          "Task 8 is longer",
          "Task 8 doesn't use pictures"
        ],
        correct: 1,
        explanation: "Task 8 specifically asks you to identify and describe what's unusual — not just describe everything you see."
      },
      {
        type: "fillGap",
        sentence: "It ________ as though something quite unexpected has occurred in this scenario.",
        options: ["seems", "looks", "is", "makes"],
        correct: 0,
        explanation: "'It seems as though' is a great speculative phrase — you're describing what you observe without being 100% certain."
      },
      {
        type: "choose",
        question: "Which speculative phrase works best for Task 8?",
        options: [
          "I know exactly what happened.",
          "One possible explanation for this unusual scene could be...",
          "This is weird.",
          "I don't understand this picture."
        ],
        correct: 1,
        explanation: "'One possible explanation could be' shows analytical thinking and creativity — exactly what Task 8 rewards."
      },
      {
        type: "reorder",
        instruction: "Put the Task 8 formula in order:",
        words: ["Identify what's unusual", "Describe specific details", "Suggest why it's unexpected", "Share your reaction"],
        correct: [0, 1, 2, 3],
        explanation: "What's unusual → Details → Why → Reaction. Clean structure for 60 seconds."
      },
      {
        type: "match",
        instruction: "Match the creative phrase to its use:",
        pairs: [
          { left: "What immediately catches my eye", right: "Identify the unusual element" },
          { left: "Upon closer inspection", right: "Add more details" },
          { left: "One possible explanation", right: "Speculate about the cause" },
          { left: "I find it quite fascinating", right: "Express your reaction" }
        ]
      },
      {
        type: "fillGap",
        sentence: "What immediately ________ my eye is the unusual arrangement of objects in the room.",
        options: ["catches", "sees", "looks", "finds"],
        correct: 0,
        explanation: "'What immediately catches my eye' is a natural and sophisticated way to start describing something unusual."
      },
      {
        type: "choose",
        question: "How should you react to the unusual scene?",
        options: [
          "Say it's weird and move on",
          "Express genuine curiosity and fascination with sophisticated language",
          "Criticize what you see",
          "Ignore the unusual aspect"
        ],
        correct: 1,
        explanation: "Show intellectual curiosity: 'I find it quite fascinating' or 'This is a remarkably intriguing scene'."
      },
      {
        type: "fillGap",
        sentence: "Upon closer ________, I notice that the situation is even more peculiar than it first appeared.",
        options: ["inspection", "look", "view", "see"],
        correct: 0,
        explanation: "'Upon closer inspection' is a sophisticated phrase for adding more details to your description."
      }
    ]
  },
  {
    id: 12,
    title: "Score Boosters",
    subtitle: "Advanced techniques for CLB 10+",
    icon: "🚀",
    lesson: {
      title: "Level Up to CLB 10+",
      points: [
        "Use VARIED sentence structures — short + long sentences mixed",
        "Add IDIOMATIC expressions: 'hit the nail on the head', 'a blessing in disguise'",
        "Show RANGE: formal + informal language in the same response",
        "Master SELF-CORRECTION: 'Actually, what I mean to say is...'",
        "Use RHETORICAL QUESTIONS: 'Wouldn't that be a better approach?'"
      ]
    },
    exercises: [
      {
        type: "choose",
        question: "Which shows the best sentence variety?",
        options: [
          "I like parks. Parks are good. People go to parks. Parks have trees.",
          "Parks offer incredible benefits. Not only do they provide green spaces for relaxation, but they also serve as community gathering spots. Who wouldn't appreciate that?"
        ],
        correct: 1,
        explanation: "Mix of statement + 'Not only...but also' + rhetorical question = excellent variety."
      },
      {
        type: "fillGap",
        sentence: "Honestly, the whole experience turned out to be a blessing in ________.",
        options: ["disguise", "hiding", "secret", "mask"],
        correct: 0,
        explanation: "'A blessing in disguise' — an idiom meaning something bad that turns out good. Using idioms naturally shows CLB 10+ ability."
      },
      {
        type: "match",
        instruction: "Match the idiom to its meaning:",
        pairs: [
          { left: "Hit the nail on the head", right: "Be exactly right" },
          { left: "A blessing in disguise", right: "Something bad that turns out good" },
          { left: "The tip of the iceberg", right: "Only a small part of the problem" },
          { left: "Break the ice", right: "Start a conversation comfortably" }
        ]
      },
      {
        type: "choose",
        question: "When is self-correction helpful in CELPIP?",
        options: [
          "Never — it shows weakness",
          "When done naturally, it shows language awareness: 'Actually, what I mean is...'",
          "You should correct every small mistake",
          "Only in writing"
        ],
        correct: 1,
        explanation: "Natural self-correction shows you can monitor your own language — a CLB 10+ skill."
      },
      {
        type: "fillGap",
        sentence: "Wouldn't that be a much more ________ approach to solving this issue?",
        options: ["effective", "good", "nice", "okay"],
        correct: 0,
        explanation: "Rhetorical questions with strong vocabulary ('effective approach') engage the listener and show confidence."
      },
      {
        type: "choose",
        question: "Which shows better range of formality?",
        options: [
          "I think it's great. Really great. Super great.",
          "From a professional standpoint, this is excellent. But honestly? It's also just really cool."
        ],
        correct: 1,
        explanation: "Mixing formal ('From a professional standpoint') with casual ('honestly? it's just really cool') shows range."
      },
      {
        type: "fillGap",
        sentence: "Not ________ does this benefit individuals, but it also strengthens the community as a whole.",
        options: ["only", "just", "simply", "merely"],
        correct: 0,
        explanation: "'Not only...but also' is a powerful sentence structure that adds emphasis and variety."
      },
      {
        type: "choose",
        question: "What's the BEST way to fill silence if you lose your train of thought?",
        options: [
          "Say 'ummm' until you remember",
          "Stop talking completely",
          "Use a natural bridge phrase: 'What I'm trying to say is...' or 'The point I'd like to make is...'",
          "Start over from the beginning"
        ],
        correct: 2,
        explanation: "Bridge phrases buy you time while sounding natural — way better than silence or 'um'."
      }
    ]
  }
];

// Metadata
const courseData = {
  id: 'speaking',
  title: 'Speaking Mastery',
  description: 'Master all 8 CELPIP Speaking tasks with interactive exercises',
  icon: '🎤',
  totalUnits: units.length,
  freeUnits: 5,
  exerciseTypes: ['choose', 'fillGap', 'match', 'reorder'],
  units: units,
};

const fs = require('fs');
const outPath = '/var/www/CELPIP/public/data/courses/speaking.json';
fs.writeFileSync(outPath, JSON.stringify(courseData, null, 2));
console.log(`✅ Speaking course generated: ${units.length} units, ${units.reduce((s, u) => s + u.exercises.length, 0)} exercises`);
console.log(`   Free units: 1-${courseData.freeUnits}, Pro: ${courseData.freeUnits + 1}-${units.length}`);
