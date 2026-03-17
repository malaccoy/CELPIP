import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserPlan } from '@/lib/plan';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

const LIMITS: Record<string, number> = {
  practice: 3,
  drills: 10,
};

function todayStr() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Vancouver' });
}

// GET — check usage. ?category=practice|drills (default: practice)
export async function GET(request: NextRequest) {
  try {
    const plan = await getUserPlan();
    if (!plan.authenticated || !plan.userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const category = request.nextUrl.searchParams.get('category') || 'practice';
    const limit = LIMITS[category] || LIMITS.practice;

    if (plan.isPro) {
      return NextResponse.json({ isPro: true, used: 0, limit: Infinity, remaining: Infinity });
    }

    const record = await prisma.dailyUsage.findUnique({
      where: { userId_date_category: { userId: plan.userId, date: todayStr(), category } },
    });

    const used = record?.count || 0;
    return NextResponse.json({ isPro: false, used, limit, remaining: Math.max(0, limit - used) });
  } catch (error) {
    console.error('Daily usage GET error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// POST — increment usage. Body: { category?: "practice"|"drills" }
export async function POST(request: NextRequest) {
  try {
    const plan = await getUserPlan();
    if (!plan.authenticated || !plan.userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (plan.isPro) {
      return NextResponse.json({ isPro: true, used: 0, limit: Infinity, remaining: Infinity });
    }

    let category = 'practice';
    try {
      const body = await request.json();
      if (body.category && LIMITS[body.category]) category = body.category;
    } catch {}

    const limit = LIMITS[category];
    const date = todayStr();

    const current = await prisma.dailyUsage.findUnique({
      where: { userId_date_category: { userId: plan.userId, date, category } },
    });

    if ((current?.count || 0) >= limit) {
      return NextResponse.json({
        isPro: false, used: current!.count, limit, remaining: 0, blocked: true,
      }, { status: 429 });
    }

    const record = await prisma.dailyUsage.upsert({
      where: { userId_date_category: { userId: plan.userId, date, category } },
      update: { count: { increment: 1 } },
      create: { userId: plan.userId, date, category, count: 1 },
    });

    const used = record.count;
    return NextResponse.json({ isPro: false, used, limit, remaining: Math.max(0, limit - used) });
  } catch (error) {
    console.error('Daily usage POST error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
