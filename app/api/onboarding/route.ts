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
    const { completed, targetCLB, goal, experience, timeline, assessmentScores, source, focusSkills, dailyMinutes, testDate, canadaStatus } = body;

    await prisma.userOnboarding.upsert({
      where: { userId },
      create: {
        userId,
        completed: true,
        targetCLB: targetCLB || null,
        goal: goal || null,
        experience: experience || null,
        timeline: timeline || testDate || null,
        source: source || null,
        focusSkills: Array.isArray(focusSkills) ? focusSkills.join(',') : (focusSkills || null),
        dailyMinutes: dailyMinutes || null,
        canadaStatus: canadaStatus || null,
        assessmentScores: assessmentScores || null,
      },
      update: {
        completed: true,
        ...(goal !== undefined && { goal }),
        ...(targetCLB !== undefined && { targetCLB }),
        ...(experience !== undefined && { experience }),
        ...(timeline !== undefined && { timeline }),
        ...(testDate !== undefined && { timeline: testDate }),
        ...(source !== undefined && { source }),
        ...(canadaStatus !== undefined && { canadaStatus }),
        ...(focusSkills !== undefined && { focusSkills: Array.isArray(focusSkills) ? focusSkills.join(',') : focusSkills }),
        ...(dailyMinutes !== undefined && { dailyMinutes }),
        ...(assessmentScores !== undefined && { assessmentScores }),
      }
    });

    // Send welcome email (fire-and-forget)
    try {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, name: true } });
      if (user?.email) {
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://celpipaicoach.com'}/api/welcome-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, name: user.name, userId }),
        }).catch(() => {});
      }
    } catch (_) {}

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST onboarding error:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
