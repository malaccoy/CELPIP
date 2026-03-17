import { NextRequest, NextResponse } from 'next/server';
import { logActivity } from '@/lib/activity';
import { getUserPlan } from '@/lib/plan';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const planCheck = await getUserPlan();
    if (!planCheck.authenticated || !planCheck.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, count } = await request.json();

    if (!['reading', 'listening', 'writing', 'speaking'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const safeCount = Math.min(Math.max(1, Number(count) || 1), 50);

    await logActivity(planCheck.userId, type, safeCount);

    // Update streak data
    try {
      const now = new Date();
      const streak = await prisma.streakData.findUnique({ where: { userId: planCheck.userId } });

      if (streak) {
        const lastDate = streak.lastPracticeAt
          ? new Date(streak.lastPracticeAt).toLocaleDateString('en-CA', { timeZone: 'America/Vancouver' })
          : null;
        const todayDate = now.toLocaleDateString('en-CA', { timeZone: 'America/Vancouver' });

        if (lastDate !== todayDate) {
          // New day of practice
          const hoursSince = streak.lastPracticeAt
            ? (now.getTime() - new Date(streak.lastPracticeAt).getTime()) / 3600000
            : 999;

          let newStreak = streak.currentStreak;
          if (hoursSince > 48) newStreak = 1; // Broken
          else if (hoursSince > 16) newStreak += 1; // New day

          await prisma.streakData.update({
            where: { userId: planCheck.userId },
            data: {
              currentStreak: newStreak,
              longestStreak: Math.max(streak.longestStreak, newStreak),
              lastPracticeAt: now,
              streakFrozenAt: null, // Clear freeze
            },
          });
        } else {
          // Same day — just update timestamp
          await prisma.streakData.update({
            where: { userId: planCheck.userId },
            data: { lastPracticeAt: now },
          });
        }
      } else {
        // Create new streak
        await prisma.streakData.create({
          data: {
            userId: planCheck.userId,
            currentStreak: 1,
            longestStreak: 1,
            lastPracticeAt: now,
          },
        });
      }
    } catch (e) {
      console.error('Streak update error (non-fatal):', e);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Log activity error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
