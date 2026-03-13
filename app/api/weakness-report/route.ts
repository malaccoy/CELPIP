import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserPlan } from '@/lib/plan';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId, plan } = await getUserPlan();
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    if (plan !== 'pro') {
      return NextResponse.json({ error: 'Pro required' }, { status: 403 });
    }

    // Get activity logs from last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const logs = await prisma.activityLog.findMany({
      where: {
        userId,
        createdAt: { gte: thirtyDaysAgo },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Aggregate by type
    const byType: Record<string, { count: number; points: number; dates: string[] }> = {};
    for (const log of logs) {
      if (!byType[log.type]) byType[log.type] = { count: 0, points: 0, dates: [] };
      byType[log.type].count += 1;
      byType[log.type].points += log.points;
      byType[log.type].dates.push(log.createdAt.toISOString().split('T')[0]);
    }

    // Calculate streaks and trends per skill
    const skills = ['reading', 'listening', 'writing', 'speaking'];
    const analysis: Record<string, {
      totalAttempts: number;
      totalPoints: number;
      activeDays: number;
      lastPracticed: string | null;
      trend: 'improving' | 'stable' | 'declining' | 'new';
      weeklyAvg: number;
    }> = {};

    for (const skill of skills) {
      const data = byType[skill];
      if (!data) {
        analysis[skill] = {
          totalAttempts: 0, totalPoints: 0, activeDays: 0,
          lastPracticed: null, trend: 'new', weeklyAvg: 0,
        };
        continue;
      }

      const uniqueDays = [...new Set(data.dates)];
      const lastPracticed = uniqueDays[0] || null;

      // Trend: compare first half vs second half of period
      const mid = Math.floor(uniqueDays.length / 2);
      const firstHalf = uniqueDays.slice(mid).length;
      const secondHalf = uniqueDays.slice(0, mid).length;
      let trend: 'improving' | 'stable' | 'declining' | 'new' = 'stable';
      if (uniqueDays.length < 3) trend = 'new';
      else if (secondHalf > firstHalf * 1.3) trend = 'improving';
      else if (secondHalf < firstHalf * 0.7) trend = 'declining';

      analysis[skill] = {
        totalAttempts: data.count,
        totalPoints: data.points,
        activeDays: uniqueDays.length,
        lastPracticed,
        trend,
        weeklyAvg: Math.round((data.count / 4) * 10) / 10, // 4 weeks
      };
    }

    // Overall stats
    const totalPoints = Object.values(analysis).reduce((s, a) => s + a.totalPoints, 0);
    const totalAttempts = Object.values(analysis).reduce((s, a) => s + a.totalAttempts, 0);
    
    // Find weakest (least practiced) and strongest (most practiced)
    const practiced = skills.filter(s => analysis[s].totalAttempts > 0);
    const weakest = practiced.length > 0
      ? practiced.reduce((w, s) => analysis[s].totalAttempts < analysis[w].totalAttempts ? s : w)
      : null;
    const strongest = practiced.length > 0
      ? practiced.reduce((w, s) => analysis[s].totalAttempts > analysis[w].totalAttempts ? s : w)
      : null;

    // Skills never practiced
    const neverPracticed = skills.filter(s => analysis[s].totalAttempts === 0);

    return NextResponse.json({
      analysis,
      summary: {
        totalPoints,
        totalAttempts,
        weakest,
        strongest,
        neverPracticed,
        activeDays: [...new Set(logs.map(l => l.createdAt.toISOString().split('T')[0]))].length,
      },
    });
  } catch (error) {
    console.error('Weakness report error:', error);
    return NextResponse.json({ error: 'Failed to load report' }, { status: 500 });
  }
}
