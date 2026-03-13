#!/usr/bin/env node
/**
 * Seed the English Learning module database from generated JSON files
 * Run: node scripts/seed-english.js
 */
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  // Create Level 1
  const level = await prisma.englishLevel.upsert({
    where: { number: 1 },
    update: { name: 'Foundations', theme: 'Rights, Identity & History', cefr: 'A2-B1', clb: 'CLB 4-5', certName: 'Citizenship Foundations', totalLessons: 25, isFree: true },
    create: {
      number: 1,
      name: 'Foundations',
      theme: 'Rights, Identity & History',
      cefr: 'A2-B1',
      clb: 'CLB 4-5',
      certName: 'Citizenship Foundations',
      totalLessons: 25,
      isFree: true,
    },
  });
  console.log(`Level 1 created/found: id=${level.id}`);

  // Also create placeholder levels 2-5
  const levelDefs = [
    { number: 2, name: 'Government & Law', theme: 'Parliament, Elections & Justice', cefr: 'B1', clb: 'CLB 5-6', certName: 'Government Expert', totalLessons: 25, isFree: false },
    { number: 3, name: 'Economy & Regions', theme: 'Provinces, Economy & Geography', cefr: 'B1-B2', clb: 'CLB 6-7', certName: 'Canada Expert', totalLessons: 25, isFree: false },
    { number: 4, name: 'Advanced Topics', theme: 'Deep Dive — Tricky Test Questions', cefr: 'B2', clb: 'CLB 7-8', certName: 'Test Ready', totalLessons: 25, isFree: false },
    { number: 5, name: 'Practice Tests', theme: 'Full Simulated Citizenship Tests', cefr: 'B2+', clb: 'CLB 8+', certName: 'Citizenship Master', totalLessons: 25, isFree: false },
  ];

  for (const def of levelDefs) {
    await prisma.englishLevel.upsert({
      where: { number: def.number },
      update: {},
      create: def,
    });
    console.log(`Level ${def.number} created`);
  }

  // Load Level 1 lessons
  const dataPath = '/var/www/CELPIP/public/data/english/level1.json';
  if (!fs.existsSync(dataPath)) {
    console.log('Level 1 JSON not found yet — run generate-english-level1.js first');
    return;
  }

  const lessons = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  console.log(`\nSeeding ${lessons.length} lessons...`);

  for (const lesson of lessons) {
    // Upsert lesson
    const dbLesson = await prisma.englishLesson.upsert({
      where: { levelId_number: { levelId: level.id, number: lesson.number } },
      update: {
        title: lesson.title,
        situation: lesson.situation,
        grammarFocus: lesson.grammarFocus,
        keyPhrases: lesson.keyPhrases || [],
        dialogue: lesson.dialogue || [],
        vocabulary: lesson.vocabulary || [],
      },
      create: {
        levelId: level.id,
        number: lesson.number,
        title: lesson.title,
        situation: lesson.situation,
        grammarFocus: lesson.grammarFocus,
        keyPhrases: lesson.keyPhrases || [],
        dialogue: lesson.dialogue || [],
        vocabulary: lesson.vocabulary || [],
      },
    });

    // Delete existing exercises for this lesson (to re-seed)
    await prisma.englishExercise.deleteMany({ where: { lessonId: dbLesson.id } });

    // Create exercises
    for (const ex of (lesson.exercises || [])) {
      await prisma.englishExercise.create({
        data: {
          lessonId: dbLesson.id,
          type: ex.type,
          order: ex.order,
          question: ex.question || {},
          options: ex.options || null,
          correct: ex.correct ?? 0,
          hint: ex.explanation || ex.hint || null,
          points: ex.points || 10,
        },
      });
    }

    console.log(`  ✅ Lesson ${lesson.number}: "${lesson.title}" — ${lesson.exercises?.length || 0} exercises`);
  }

  console.log(`\n🎉 Seeding complete! ${lessons.length} lessons in database.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
