import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { getUserPlan } = await import('@/lib/plan');
    const { authenticated, userId } = await getUserPlan();

    const levels = await prisma.englishLevel.findMany({
      orderBy: { number: 'asc' },
      include: {
        _count: { select: { lessons: true } },
      },
    });

    let progress = null;
    let completions: any[] = [];
    if (authenticated && userId) {
      progress = await prisma.userEnglishProgress.findUnique({ where: { userId } });
      completions = await prisma.lessonCompletion.findMany({
        where: { userId },
        select: { lessonId: true, score: true },
      });
    }

    const completedLessonIds = new Set(completions.map(c => c.lessonId));

    const result = levels.map(level => ({
      id: level.id,
      number: level.number,
      name: level.name,
      theme: level.theme,
      cefr: level.cefr,
      clb: level.clb,
      certName: level.certName,
      totalLessons: level.totalLessons,
      isFree: level.isFree,
      lessonsCount: level._count.lessons,
      locked: !level.isFree && !progress, // simplified — expand with Pro check later
    }));

    return NextResponse.json({
      levels: result,
      progress: progress || { currentLevel: 1, currentLesson: 1, totalXp: 0, streakDays: 0, wordsLearned: 0, lessonsCompleted: 0 },
      completedLessonIds: Array.from(completedLessonIds),
    });
  } catch (error) {
    console.error('English levels error:', error);
    return NextResponse.json({ error: 'Failed to load levels' }, { status: 500 });
  }
}
