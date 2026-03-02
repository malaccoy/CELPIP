import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getUserId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}

// GET — load onboarding data from server
export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ data: null });
    }

    const onboarding = await prisma.userOnboarding.findUnique({
      where: { userId }
    });

    if (!onboarding) {
      return NextResponse.json({ data: null });
    }

    return NextResponse.json({
      data: {
        completed: onboarding.completed,
        targetCLB: onboarding.targetCLB,
        goal: onboarding.goal,
        experience: onboarding.experience,
        timeline: onboarding.timeline,
        assessmentScores: onboarding.assessmentScores,
      }
    });
  } catch (error) {
    console.error('GET onboarding error:', error);
    return NextResponse.json({ data: null });
  }
}

// POST — save onboarding data to server
export async function POST(request: Request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
    }

    const body = await request.json();
    const { completed, targetCLB, goal, experience, timeline, assessmentScores } = body;

    await prisma.userOnboarding.upsert({
      where: { userId },
      create: {
        userId,
        completed: completed || false,
        targetCLB: targetCLB || null,
        goal: goal || null,
        experience: experience || null,
        timeline: timeline || null,
        assessmentScores: assessmentScores || null,
      },
      update: {
        ...(completed !== undefined && { completed }),
        ...(targetCLB !== undefined && { targetCLB }),
        ...(goal !== undefined && { goal }),
        ...(experience !== undefined && { experience }),
        ...(timeline !== undefined && { timeline }),
        ...(assessmentScores !== undefined && { assessmentScores }),
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST onboarding error:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
