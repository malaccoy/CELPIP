#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const emailTriplets = require('./writing-beginner-triplets.js');
const surveyTriplets = require('./writing-survey-triplets.js');

function process(triplets) {
  let id = 0;
  return triplets.map(triplet => {
    return triplet.map(ex => {
      return { id: id++, ...ex };
    });
  });
}

const emailProcessed = process(emailTriplets);
const surveyProcessed = process(surveyTriplets);

const units = [
  {
    id: 0,
    title: 'Task 1: Email Writing',
    subtitle: 'Master email structure — Opening, Body & Closing',
    icon: '✉️',
    level: 'beginner',
    exercises: emailProcessed.flat(),
  },
  {
    id: 1,
    title: 'Task 2: Survey Response',
    subtitle: 'Write clear opinions with strong arguments',
    icon: '📋',
    level: 'beginner',
    exercises: surveyProcessed.flat(),
  },
];

const output = {
  id: 'writing-drills',
  title: 'Writing Drills',
  freeUnits: 2,
  units,
};

fs.writeFileSync(
  path.join(__dirname, '..', 'public', 'data', 'courses', 'writing.json'),
  JSON.stringify(output, null, 2)
);

const total = emailProcessed.flat().length + surveyProcessed.flat().length;
console.log(`✅ Writing drills generated: ${total} exercises`);
console.log(`   📧 Task 1 (Email): ${emailProcessed.flat().length} exercises (${emailProcessed.length} scenarios)`);
console.log(`   📋 Task 2 (Survey): ${surveyProcessed.flat().length} exercises (${surveyProcessed.length} scenarios)`);
console.log(`📁 Saved to writing.json`);
