import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { getUserPlan } = await import('@/lib/plan');
    const { authenticated, userId } = await getUserPlan();
    if (!authenticated || !userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const progress = await prisma.userEnglishProgress.findUnique({ where: { userId } });
    const completions = await prisma.lessonCompletion.findMany({
      where: { userId },
      include: { lesson: { select: { title: true, number: true, levelId: true } } },
      orderBy: { completedAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({
      progress: progress || {
        currentLevel: 1, currentLesson: 1, totalXp: 0,
        streakDays: 0, wordsLearned: 0, lessonsCompleted: 0, certificates: [],
      },
      recentCompletions: completions,
    });
  } catch (error) {
    console.error('Progress error:', error);
    return NextResponse.json({ error: 'Failed to load progress' }, { status: 500 });
  }
}
