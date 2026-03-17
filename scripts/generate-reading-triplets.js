// Generate reading drills JSON from triplet files
const fs = require('fs');
const path = require('path');

const easier = require('./reading-easier-triplets');
const harder = require('./reading-harder-triplets');

const units = [
  {
    id: 0,
    title: 'Tasks 1-2: Correspondence & Diagrams',
    subtitle: 'Letters, emails, and matching information',
    icon: '📧',
    level: 'easier',
    lesson: {
      title: 'Reading Strategies — Tasks 1-2',
      points: [
        'Read paragraph by paragraph — don\'t skim the whole text first',
        'For each paragraph, check: can I answer any open question? YES → select, NO → move on',
        'In Task 2, find the PATTERN in the diagram first, then read the email',
        'Focus on MAIN IDEAS, not small details like exact dates or statistics',
        'Part 2 (reply) is usually easier — you already know the context from Part 1',
      ],
    },
    exercises: easier.flat(),
  },
  {
    id: 1,
    title: 'Tasks 3-4: Information & Viewpoints',
    subtitle: 'Paragraph matching and multiple opinions',
    icon: '📰',
    level: 'harder',
    lesson: {
      title: 'Reading Strategies — Tasks 3-4',
      points: [
        'Task 3: Read paragraph → check ALL questions → Yes/No/Red Flag → next paragraph',
        'Not Given (E) also means FALSE — if the statement contradicts the text, it\'s E',
        'The test uses SYNONYMS — same idea, different words',
        'Task 4: Identify each person\'s name and FEELING (positive/negative/mixed)',
        'For "who agrees" questions, match the IDEA not the exact words',
        'The "Best Title" question requires understanding the WHOLE article — do it last',
      ],
    },
    exercises: harder.flat(),
  },
];

const out = path.join(__dirname, '..', 'public', 'data', 'courses', 'reading.json');
fs.writeFileSync(out, JSON.stringify(units, null, 2));

const total = units.reduce((s, u) => s + u.exercises.length, 0);
console.log(`✅ Reading drills generated: ${total} exercises`);
units.forEach(u => console.log(`   ${u.icon} ${u.title}: ${u.exercises.length} exercises`));
console.log(`📁 Saved to reading.json`);
