// Generate Speaking Drills — v4 (single level)
// Merges all triplets into one unit, shuffles, outputs JSON
const fs = require('fs');

function triplet(choose, apply, speakPhrase, speakExplanation) {
  return [
    { ...choose },
    { ...apply },
    { type: 'speak', question: 'Now say it out loud:', targetPhrase: speakPhrase, explanation: speakExplanation || 'Focus on natural rhythm, stress, and clarity.' }
  ];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Load all triplet files
const beginnerRaw = require('./beginner-triplets.js');
const intermediateRaw = require('./intermediate-triplets.js');
let advancedRaw = [];
try { advancedRaw = require('./advanced-triplets.js'); } catch(e) {}

// Process through triplet function
const process = (raw) => raw.map(t => triplet(t[0], t[1], t[2], t[3]));

// Merge all triplets in order (shuffle happens on frontend per session)
const allTriplets = [
  ...process(beginnerRaw),
  ...process(intermediateRaw),
  ...process(advancedRaw),
];

const units = [
  {
    id: 0,
    title: 'Speaking Practice',
    subtitle: 'All 8 CELPIP tasks · CLB 7+',
    icon: '🎤',
    level: 'all',
    exercises: allTriplets.flat(),
  },
];

const data = { title: 'Speaking Drills', description: 'Master CELPIP Speaking with structured practice', totalUnits: units.length, freeUnits: 0, units };
const total = units[0].exercises.length;
console.log(`✅ Speaking drills generated: ${total} exercises (${allTriplets.length} triplets)`);
console.log(`   Sources: Beginner ${beginnerRaw.length} + Intermediate ${intermediateRaw.length} + Advanced ${advancedRaw.length} triplets`);
fs.writeFileSync(__dirname + '/../public/data/courses/speaking.json', JSON.stringify(data, null, 2));
console.log('📁 Saved to speaking.json');
