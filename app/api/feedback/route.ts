import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserPlan } from '@/lib/plan';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const plan = await getUserPlan();
    if (!plan.authenticated || !plan.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { rating, message, category, page } = await req.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating 1-5 required' }, { status: 400 });
    }

    const feedback = await prisma.userFeedback.create({
      data: {
        userId: plan.userId,
        rating,
        challenge: message || null,
        category: category || 'general',
        page: page || null,
      },
    });

    return NextResponse.json({ ok: true, id: feedback.id });
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const plan = await getUserPlan();
    if (!plan.authenticated || !plan.userId) {
      return NextResponse.json({ recentFeedback: false });
    }

    const recent = await prisma.userFeedback.findFirst({
      where: { userId: plan.userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ recentFeedback: !!recent });
  } catch {
    return NextResponse.json({ recentFeedback: false });
  }
}
