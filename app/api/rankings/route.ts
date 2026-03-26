import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserPlan } from '@/lib/plan';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const planCheck = await getUserPlan();
    const currentUserId = planCheck.userId;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Top 10 users by points this month
    const topRaw = await prisma.activityLog.groupBy({
      by: ['userId'],
      where: { createdAt: { gte: startOfMonth } },
      _sum: { points: true },
      orderBy: { _sum: { points: 'desc' } },
      take: 10,
    });

    // Get user names for top 10 (only those who opt in)
    const userIds = topRaw.map(r => r.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true, image: true, showInRanking: true },
    });
    const userMap = new Map(users.map(u => [u.id, u]));

    const top10 = topRaw
      .map((r, i) => {
        const user = userMap.get(r.userId);
        if (!user || !user.showInRanking) return null;
        // Privacy: first name + last initial
        let displayName = 'Anonymous';
        if (user.name) {
          const parts = user.name.trim().split(/\s+/);
          displayName = parts[0] + (parts.length > 1 ? ' ' + parts[parts.length - 1][0] + '.' : '');
        } else if (user.email) {
          displayName = user.email.split('@')[0].slice(0, 8) + '...';
        }
        return {
          rank: i + 1,
          displayName,
          avatar: user.image || null,
          points: r._sum.points || 0,
          isCurrentUser: r.userId === currentUserId,
        };
      })
      .filter(Boolean);

    // Total active learners this week
    const activeLearners = await prisma.activityLog.groupBy({
      by: ['userId'],
      where: { createdAt: { gte: startOfMonth } },
    });
    const totalLearners = activeLearners.length;

    // Current user's rank and points
    let myRank = null;
    let myPoints = 0;
    let myStreak = 0;

    if (currentUserId) {
      // My points this week
      const myResult = await prisma.activityLog.aggregate({
        where: { userId: currentUserId, createdAt: { gte: startOfMonth } },
        _sum: { points: true },
      });
      myPoints = myResult._sum.points || 0;

      // My rank
      if (myPoints > 0) {
        const usersAbove = await prisma.activityLog.groupBy({
          by: ['userId'],
          where: { createdAt: { gte: startOfMonth } },
          _sum: { points: true },
          having: { points: { _sum: { gt: myPoints } } },
        });
        myRank = usersAbove.length + 1;
      }

      // Streak: consecutive days with activity
      const logs = await prisma.activityLog.findMany({
        where: { userId: currentUserId },
        select: { createdAt: true },
        orderBy: { createdAt: 'desc' },
      });
      
      if (logs.length > 0) {
        const days = new Set(logs.map(l => l.createdAt.toISOString().slice(0, 10)));
        const sortedDays = [...days].sort().reverse();
        const today = new Date().toISOString().slice(0, 10);
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        
        // Streak must include today or yesterday
        if (sortedDays[0] === today || sortedDays[0] === yesterday) {
          myStreak = 1;
          for (let i = 1; i < sortedDays.length; i++) {
            const prev = new Date(sortedDays[i - 1]);
            const curr = new Date(sortedDays[i]);
            const diff = (prev.getTime() - curr.getTime()) / 86400000;
            if (diff === 1) myStreak++;
            else break;
          }
        }
      }
    }

    return NextResponse.json({
      top10,
      totalLearners,
      myRank,
      myPoints,
      myStreak,
    }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } });
  } catch (error) {
    console.error('Rankings error:', error);
    return NextResponse.json({ error: 'Failed to load rankings' }, { status: 500 });
  }
}
