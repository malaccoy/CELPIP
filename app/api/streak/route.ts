import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserPlan } from '@/lib/plan';

export const dynamic = 'force-dynamic';
const prisma = new PrismaClient();

const MAX_FREE_FREEZES = 1; // 1 free freeze per week
const MAX_PRO_FREEZES = 3;  // Pro gets 3 per week

export async function GET() {
  try {
    const plan = await getUserPlan();
    if (!plan.authenticated || !plan.userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get or create streak data
    let streak = await prisma.streakData.findUnique({ where: { userId: plan.userId } });

    if (!streak) {
      // Calculate streak from activity logs (migration from old system)
      const logs = await prisma.activityLog.findMany({
        where: { userId: plan.userId },
        select: { createdAt: true },
        orderBy: { createdAt: 'desc' },
      });

      const dates = [...new Set(logs.map(l =>
        l.createdAt.toLocaleDateString('en-CA', { timeZone: 'America/Vancouver' })
      ))];

      let currentStreak = 0;
      const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Vancouver' });
      const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('en-CA', { timeZone: 'America/Vancouver' });

      if (dates.length > 0 && (dates[0] === today || dates[0] === yesterday)) {
        currentStreak = 1;
        for (let i = 1; i < dates.length; i++) {
          const curr = new Date(dates[i - 1]);
          const prev = new Date(dates[i]);
          const diff = (curr.getTime() - prev.getTime()) / 86400000;
          if (diff <= 1.5) currentStreak++;
          else break;
        }
      }

      streak = await prisma.streakData.create({
        data: {
          userId: plan.userId,
          currentStreak,
          longestStreak: currentStreak,
          lastPracticeAt: logs[0]?.createdAt || null,
        },
      });
    }

    // Check if weekly freeze reset needed (Sundays)
    const now = new Date();
    const lastReset = new Date(streak.freezeLastReset);
    const daysSinceReset = (now.getTime() - lastReset.getTime()) / 86400000;
    if (daysSinceReset >= 7) {
      streak = await prisma.streakData.update({
        where: { userId: plan.userId },
        data: { freezesUsed: 0, freezeLastReset: now },
      });
    }

    const maxFreezes = plan.isPro ? MAX_PRO_FREEZES : MAX_FREE_FREEZES;
    const freezesRemaining = Math.max(0, maxFreezes - streak.freezesUsed);

    // Check if streak is at risk (last practice > 20h ago, not yet broken)
    const hoursSincePractice = streak.lastPracticeAt
      ? (now.getTime() - new Date(streak.lastPracticeAt).getTime()) / 3600000
      : 999;
    const atRisk = hoursSincePractice > 20 && hoursSincePractice < 48;
    const broken = hoursSincePractice >= 48 && !streak.streakFrozenAt;

    return NextResponse.json({
      currentStreak: broken ? 0 : streak.currentStreak,
      longestStreak: streak.longestStreak,
      lastPracticeAt: streak.lastPracticeAt,
      freezesRemaining,
      maxFreezes,
      freezesUsed: streak.freezesUsed,
      atRisk,
      broken,
      hoursSincePractice: Math.round(hoursSincePractice),
      streakFrozenAt: streak.streakFrozenAt,
    });
  } catch (err: any) {
    console.error('Streak GET error:', err.message);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// POST — use a streak freeze
export async function POST() {
  try {
    const plan = await getUserPlan();
    if (!plan.authenticated || !plan.userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const streak = await prisma.streakData.findUnique({ where: { userId: plan.userId } });
    if (!streak) {
      return NextResponse.json({ error: 'No streak data' }, { status: 404 });
    }

    const maxFreezes = plan.isPro ? MAX_PRO_FREEZES : MAX_FREE_FREEZES;
    if (streak.freezesUsed >= maxFreezes) {
      return NextResponse.json({
        error: 'No freezes remaining',
        freezesRemaining: 0,
        isPro: plan.isPro,
      }, { status: 429 });
    }

    // Apply freeze — extend lastPracticeAt to now so streak doesn't break
    const updated = await prisma.streakData.update({
      where: { userId: plan.userId },
      data: {
        freezesUsed: { increment: 1 },
        streakFrozenAt: new Date(),
        lastPracticeAt: new Date(), // Resets the 48h timer
      },
    });

    return NextResponse.json({
      success: true,
      freezesRemaining: maxFreezes - updated.freezesUsed,
      currentStreak: updated.currentStreak,
    });
  } catch (err: any) {
    console.error('Streak freeze error:', err.message);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
