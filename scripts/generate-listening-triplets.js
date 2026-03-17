#!/usr/bin/env node
// Generate listening.json from triplet files
const fs = require('fs');
const path = require('path');

const easierTriplets = require('./listening-easier-triplets.js');
const harderTriplets = require('./listening-harder-triplets.js');

function buildUnit(id, title, subtitle, icon, level, triplets) {
  const exercises = [];
  for (const triplet of triplets) {
    for (const ex of triplet) {
      exercises.push(ex);
    }
  }
  return {
    id,
    title,
    subtitle,
    icon,
    level,
    lesson: { title: `${title} — Technique`, points: [
      'Listen to the audio carefully — it plays ONCE, just like the real test',
      'Use the 7 Secret Steps to identify key information',
      'Choose the best answer from 4 options',
      'Read the explanation to understand the technique used',
    ]},
    exercises,
  };
}

const units = [
  buildUnit(0, 'Tasks 1-3: Easier', 'Problem Solving • Daily Life • Information', '🔧', 'beginner', easierTriplets),
  buildUnit(1, 'Tasks 4-6: Harder', 'News Items • Discussions • Viewpoints', '📰', 'intermediate', harderTriplets),
];

const outPath = path.join(__dirname, '..', 'public', 'data', 'courses', 'listening.json');
fs.writeFileSync(outPath, JSON.stringify(units, null, 2));

const totalEx = units.reduce((s, u) => s + u.exercises.length, 0);
console.log(`✅ Listening drills generated: ${totalEx} exercises`);
units.forEach(u => console.log(`   ${u.icon} ${u.title}: ${u.exercises.length} exercises`));
console.log(`📁 Saved to listening.json`);
