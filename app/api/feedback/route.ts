import { NextRequest, NextResponse } from 'next/server';
import { getUserPlan } from '@/lib/plan';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Check if user already submitted feedback
export async function GET() {
  try {
    const plan = await getUserPlan();
    if (!plan.authenticated || !plan.userId) {
      return NextResponse.json({ submitted: false });
    }

    const existing = await prisma.userFeedback.findUnique({
      where: { userId: plan.userId },
    });

    return NextResponse.json({ submitted: !!existing });
  } catch {
    return NextResponse.json({ submitted: false });
  }
}

// Submit feedback
export async function POST(request: NextRequest) {
  try {
    const plan = await getUserPlan();
    if (!plan.authenticated || !plan.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { challenge, suggestion } = await request.json();

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge is required' }, { status: 400 });
    }

    await prisma.userFeedback.upsert({
      where: { userId: plan.userId },
      create: {
        userId: plan.userId,
        challenge,
        suggestion: suggestion || null,
      },
      update: {
        challenge,
        suggestion: suggestion || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
