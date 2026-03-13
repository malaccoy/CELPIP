import { NextResponse } from 'next/server';
import { getUserPlan } from '@/lib/plan';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const { userId } = await getUserPlan();
    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const logs = await prisma.$queryRaw<{ type: string; points: number; createdAt: Date }[]>`
      SELECT type, points, "createdAt" FROM activity_logs WHERE "userId" = ${userId} ORDER BY "createdAt" DESC
    `;

    // Stats per skill
    const skills: Record<string, { practices: number; totalPoints: number; lastPractice: string | null }> = {
      reading: { practices: 0, totalPoints: 0, lastPractice: null },
      listening: { practices: 0, totalPoints: 0, lastPractice: null },
      writing: { practices: 0, totalPoints: 0, lastPractice: null },
      speaking: { practices: 0, totalPoints: 0, lastPractice: null },
      citizenship: { practices: 0, totalPoints: 0, lastPractice: null },
    };

    let totalPractices = 0;
    let totalPoints = 0;

    for (const log of logs) {
      const skill = log.type;
      if (skills[skill]) {
        skills[skill].practices++;
        skills[skill].totalPoints += log.points;
        if (!skills[skill].lastPractice) {
          skills[skill].lastPractice = log.createdAt.toISOString();
        }
      }
      totalPractices++;
      totalPoints += log.points;
    }

    // Streak
    const daySet = new Set<string>();
    for (const log of logs) {
      daySet.add(new Date(log.createdAt).toISOString().split('T')[0]);
    }
    const days = Array.from(daySet).sort().reverse();
    let streak = 0;
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = new Date(today.getTime() - 86400000).toISOString().split('T')[0];
    
    if (days.length > 0 && (days[0] === todayStr || days[0] === yesterdayStr)) {
      streak = 1;
      for (let i = 1; i < days.length; i++) {
        const prev = new Date(days[i - 1]);
        const curr = new Date(days[i]);
        const diff = (prev.getTime() - curr.getTime()) / 86400000;
        if (diff <= 1.5) streak++;
        else break;
      }
    }

    // Daily practice minutes (today only — estimated per activity type)
    const minuteMap: Record<string, number> = { reading: 10, listening: 10, writing: 15, speaking: 5, citizenship: 5 };
    let todayMinutes = 0;
    let totalMinutes = 0;
    
    // Daily breakdown (last 7 days)
    const dailyMinutes: Record<string, number> = {};
    for (const log of logs) {
      const m = minuteMap[log.type] || 8;
      totalMinutes += m;
      const dayKey = new Date(log.createdAt).toISOString().split('T')[0];
      if (dayKey === todayStr) todayMinutes += m;
      dailyMinutes[dayKey] = (dailyMinutes[dayKey] || 0) + m;
    }

    // Last 7 days array
    const last7Days: { date: string; minutes: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today.getTime() - i * 86400000);
      const key = d.toISOString().split('T')[0];
      last7Days.push({ date: key, minutes: dailyMinutes[key] || 0 });
    }

    // Radar chart scores — based on practice volume (scale 0-12 like CELPIP)
    // More practices = higher estimated readiness score
    const radarScores: Record<string, number> = {};
    for (const skill of ['writing', 'reading', 'speaking', 'listening']) {
      const p = skills[skill].practices;
      // Logarithmic scale: 0 practices = 0, 5 = ~5, 15 = ~7, 30 = ~9, 50+ = ~11
      if (p === 0) radarScores[skill] = 0;
      else radarScores[skill] = Math.min(12, Math.round(3 + Math.log2(p) * 2));
    }

    return NextResponse.json({
      totalPractices,
      totalPoints,
      totalMinutes,
      todayMinutes,
      streak,
      skills,
      radarScores,
      last7Days,
      joinedAt: logs.length > 0 ? logs[logs.length - 1].createdAt : null,
    });
  } catch (error: unknown) {
    console.error('Profile stats error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
