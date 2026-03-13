import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { getUserPlan } = await import('@/lib/plan');
    const { authenticated, userId } = await getUserPlan();
    if (!authenticated || !userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { id } = await params;
    const lessonId = parseInt(id);
    if (isNaN(lessonId)) return NextResponse.json({ error: 'Invalid lesson ID' }, { status: 400 });

    const { answers, timeSeconds } = await req.json();
    // answers: { [exerciseId]: answer }

    const exercises = await prisma.englishExercise.findMany({
      where: { lessonId },
      orderBy: { order: 'asc' },
    });

    if (!exercises.length) return NextResponse.json({ error: 'No exercises found' }, { status: 404 });

    // Grade answers
    let correct = 0;
    const results: any[] = [];
    for (const ex of exercises) {
      const userAnswer = answers?.[ex.id];
      const correctAnswer = ex.correct as any;
      
      let isCorrect = false;
      if (ex.type === 'word_order') {
        // Compare arrays
        isCorrect = JSON.stringify(userAnswer) === JSON.stringify(correctAnswer);
      } else {
        // Compare single value
        isCorrect = userAnswer === correctAnswer;
      }
      
      if (isCorrect) correct++;
      results.push({
        exerciseId: ex.id,
        type: ex.type,
        correct: isCorrect,
        correctAnswer: correctAnswer,
        userAnswer,
        points: isCorrect ? ex.points : 0,
      });
    }

    const score = Math.round((correct / exercises.length) * 100);
    const xpEarned = results.reduce((sum, r) => sum + r.points, 0);

    // Save completion
    await prisma.lessonCompletion.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { score, xpEarned, timeSeconds: timeSeconds || 0 },
      create: { userId, lessonId, score, xpEarned, timeSeconds: timeSeconds || 0 },
    });

    // Update progress
    const lesson = await prisma.englishLesson.findUnique({
      where: { id: lessonId },
      select: { number: true, levelId: true, level: { select: { number: true } } },
    });

    const totalCompleted = await prisma.lessonCompletion.count({ where: { userId } });
    const vocabCount = await prisma.userVocabulary.count({ where: { userId } });

    // Streak logic
    const progress = await prisma.userEnglishProgress.findUnique({ where: { userId } });
    const now = new Date();
    const lastPractice = progress?.lastPracticeAt;
    let streakDays = progress?.streakDays || 0;
    
    if (lastPractice) {
      const diffHours = (now.getTime() - lastPractice.getTime()) / (1000 * 60 * 60);
      if (diffHours > 48) streakDays = 1; // Streak broken
      else if (diffHours > 20) streakDays += 1; // New day
      // else same day — no change
    } else {
      streakDays = 1;
    }

    await prisma.userEnglishProgress.upsert({
      where: { userId },
      update: {
        totalXp: { increment: xpEarned },
        lessonsCompleted: totalCompleted,
        wordsLearned: vocabCount,
        streakDays,
        lastPracticeAt: now,
        currentLevel: lesson?.level.number || 1,
        currentLesson: (lesson?.number || 0) + 1,
      },
      create: {
        userId,
        totalXp: xpEarned,
        lessonsCompleted: totalCompleted,
        wordsLearned: vocabCount,
        streakDays: 1,
        lastPracticeAt: now,
        currentLevel: lesson?.level.number || 1,
        currentLesson: (lesson?.number || 0) + 1,
      },
    });

    // Log activity for rankings (fire-and-forget)
    try {
      const { logActivity } = await import('@/lib/activity');
      await logActivity(userId, 'citizenship', 1);
    } catch {}

    return NextResponse.json({
      score,
      xpEarned,
      correct,
      total: exercises.length,
      results,
      streakDays,
    });
  } catch (error) {
    console.error('Lesson complete error:', error);
    return NextResponse.json({ error: 'Failed to submit answers' }, { status: 500 });
  }
}
