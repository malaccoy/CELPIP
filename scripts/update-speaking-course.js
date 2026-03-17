// Update Speaking Course with official material
// Adds Unit 0 (Orientation & Diagnostic), corrects timings, adds scoring criteria

const fs = require('fs');
const data = JSON.parse(fs.readFileSync('/var/www/CELPIP/public/data/courses/speaking.json', 'utf8'));

// Fix Unit 1 lesson points with accurate info from official material
data.units[0].lesson.points = [
  "CELPIP Speaking has 8 tasks + 1 practice warm-up (not scored)",
  "Responses are recorded on the computer and rated later by examiners",
  "A blue progress bar shows your remaining speaking time",
  "A grey mic bar moves with your voice — keep it in the middle range",
  "Total Speaking time is about 15-20 minutes — it's the LAST section of the test"
];

// Fix Unit 1 exercises with accurate data
data.units[0].exercises[0] = {
  type: "choose",
  question: "How many scored speaking tasks are in the CELPIP test?",
  options: ["6 tasks", "7 tasks", "8 tasks", "9 tasks (including practice)"],
  correct: 2,
  explanation: "CELPIP has 8 scored tasks plus 1 unscored practice warm-up task."
};

// Add exercises about timing, mic, scoring
data.units[0].exercises.push(
  {
    type: "choose",
    question: "What happens when your preparation time ends?",
    options: [
      "You click 'Start Recording'",
      "Recording starts automatically",
      "You get extra time if needed",
      "The task is skipped"
    ],
    correct: 1,
    explanation: "Recording starts automatically when prep ends. You can't go back to earlier screens."
  },
  {
    type: "choose",
    question: "What does the grey mic bar help you with?",
    options: [
      "It shows your score in real time",
      "It shows your speaking speed",
      "It helps you keep a steady volume",
      "It counts your words"
    ],
    correct: 2,
    explanation: "The grey bar bounces with your voice. Keep it in the middle range — not too quiet, not too loud."
  },
  {
    type: "match",
    instruction: "Match each scoring area to what it measures:",
    pairs: [
      { left: "Content & Coherence", right: "Clear ideas, logical order, examples" },
      { left: "Vocabulary", right: "Natural, precise words with range" },
      { left: "Listenability", right: "Rhythm, pronunciation, smooth pauses" },
      { left: "Task Fulfillment", right: "On topic, right tone, uses full time" }
    ]
  }
);

// Insert new Unit 0 at the beginning — Orientation & Setup
const unit0 = {
  id: 0,
  title: "Test Orientation",
  subtitle: "Setup, scoring & your first plan",
  icon: "🧭",
  lesson: {
    title: "Before You Start — Know the Rules",
    points: [
      "Speaking is the LAST section: Listening → Reading → Writing → Speaking",
      "You can't go back to earlier screens — once time ends, it moves forward",
      "The practice task is NOT scored — use it to check your mic and warm up",
      "4 scoring areas: Content & Coherence, Vocabulary, Listenability, Task Fulfillment",
      "Position your mic a finger-width from the corner of your mouth",
      "If you finish early, add one concrete detail or a short wrap-up — never trail off"
    ]
  },
  exercises: [
    {
      type: "reorder",
      instruction: "Put the CELPIP test sections in order:",
      words: ["Listening", "Reading", "Writing", "Speaking"],
      correct: [0, 1, 2, 3],
      explanation: "The order is always: Listening → Reading → Writing → Speaking. Speaking comes last!"
    },
    {
      type: "choose",
      question: "Is the practice task at the beginning scored?",
      options: ["Yes, it counts toward your final score", "No, it's a warm-up for voice and volume"],
      correct: 1,
      explanation: "The practice task is NOT scored. Use it to set your mic level and warm up your voice."
    },
    {
      type: "match",
      instruction: "Match each task to its speaking time:",
      pairs: [
        { left: "Task 1 — Giving Advice", right: "90 seconds" },
        { left: "Task 2 — Personal Experience", right: "60 seconds" },
        { left: "Task 5 — Compare & Persuade", right: "60 seconds (Part 2)" },
        { left: "Task 7 — Expressing Opinions", right: "90 seconds" }
      ]
    },
    {
      type: "choose",
      question: "Where should you position your mic?",
      options: [
        "Touching your skin directly",
        "A finger-width from the corner of your mouth",
        "Far from your face for less noise",
        "It doesn't matter"
      ],
      correct: 1,
      explanation: "A finger-width from the corner of your mouth, not touching skin. This gives the clearest recording."
    },
    {
      type: "fillGap",
      sentence: "When speaking, the grey bar should bounce in the ________ range — not too quiet, not too loud.",
      options: ["middle", "top", "bottom", "maximum"],
      correct: 0,
      explanation: "Keep the grey mic bar in the middle range for the best recording quality."
    },
    {
      type: "choose",
      question: "Which warm-up line tests volume AND structure?",
      options: [
        "Test test test...",
        "Hello, can you hear me?",
        "I'll give two reasons and a short example for each.",
        "One two three four five."
      ],
      correct: 2,
      explanation: "A full sentence tests your mic AND warms up your speaking structure. 'Test test' tells you nothing."
    },
    {
      type: "choose",
      question: "What should you do if you finish a task early?",
      options: [
        "Stay silent until time runs out",
        "Say 'I'm done' and stop",
        "Add one concrete detail or a short wrap-up line",
        "Repeat everything you said"
      ],
      correct: 2,
      explanation: "Never waste speaking time. Add a detail, example, or brief closing line."
    },
    {
      type: "reorder",
      instruction: "Build a simple speaking plan:",
      words: ["Opening (1 line)", "Reason A + example", "Reason B + example", "1-line close"],
      correct: [0, 1, 2, 3],
      explanation: "Opening → Reason A → Reason B → Close. This plan works for almost every task!"
    },
    {
      type: "fillGap",
      sentence: "If others are speaking in the test room, you should speak at a steady, ________ tone — the recording focuses on YOUR voice.",
      options: ["natural", "loud", "whispered", "fast"],
      correct: 0,
      explanation: "Don't whisper or shout because of room noise. Keep your natural volume — the mic is close to YOUR mouth."
    },
    {
      type: "choose",
      question: "Can you redo a task during the test?",
      options: [
        "Yes, you can go back once",
        "Yes, if you have extra time",
        "No — the test moves forward automatically",
        "Only the practice task"
      ],
      correct: 2,
      explanation: "No going back. When time ends, the test moves forward automatically."
    }
  ]
};

// Shift all existing unit IDs by 1
data.units.forEach(u => u.id += 1);
data.units.unshift(unit0);
data.totalUnits = data.units.length;
data.freeUnits = 6; // Units 0-5 free (orientation + first 5)

// Fix Task 5 lesson (unit that was 8, now 9) — it's a TWO-PART task
const task5Unit = data.units.find(u => u.title === "Task 5: Comparing Options");
if (task5Unit) {
  task5Unit.lesson.points[0] = "Part 1 — Prep: 60 seconds (choose your option, plan arguments)";
  task5Unit.lesson.points[1] = "Part 2 — Speak: 60 seconds";
  task5Unit.lesson.points.splice(2, 0, "This is the ONLY two-part task in CELPIP Speaking");
}

fs.writeFileSync('/var/www/CELPIP/public/data/courses/speaking.json', JSON.stringify(data, null, 2));
console.log(`✅ Updated: ${data.units.length} units, ${data.units.reduce((s, u) => s + u.exercises.length, 0)} exercises`);
console.log(`   Free units: 0-${data.freeUnits - 1}, Pro: ${data.freeUnits}-${data.totalUnits - 1}`);
