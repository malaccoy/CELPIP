import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserPlan } from '@/lib/plan';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();
const FREE_DAILY_LIMIT = 3;

function todayStr() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD" UTC
}

// GET — check usage
export async function GET() {
  try {
    const plan = await getUserPlan();
    if (!plan.authenticated || !plan.userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (plan.isPro) {
      return NextResponse.json({ isPro: true, used: 0, limit: Infinity, remaining: Infinity });
    }

    const record = await prisma.dailyUsage.findUnique({
      where: { userId_date: { userId: plan.userId, date: todayStr() } },
    });

    const used = record?.count || 0;
    return NextResponse.json({
      isPro: false,
      used,
      limit: FREE_DAILY_LIMIT,
      remaining: Math.max(0, FREE_DAILY_LIMIT - used),
    });
  } catch (error) {
    console.error('Daily usage GET error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// POST — increment usage (called when exercise is generated)
export async function POST() {
  try {
    const plan = await getUserPlan();
    if (!plan.authenticated || !plan.userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (plan.isPro) {
      return NextResponse.json({ isPro: true, used: 0, limit: Infinity, remaining: Infinity });
    }

    const date = todayStr();
    const record = await prisma.dailyUsage.upsert({
      where: { userId_date: { userId: plan.userId, date } },
      update: { count: { increment: 1 } },
      create: { userId: plan.userId, date, count: 1 },
    });

    const used = record.count;
    return NextResponse.json({
      isPro: false,
      used,
      limit: FREE_DAILY_LIMIT,
      remaining: Math.max(0, FREE_DAILY_LIMIT - used),
    });
  } catch (error) {
    console.error('Daily usage POST error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
