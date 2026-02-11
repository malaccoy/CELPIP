import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const MAX_HISTORY_PER_MODULE = 20;

// GET — fetch all quiz attempts for the logged-in user
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const attempts = await prisma.quizAttempt.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({
      attempts: attempts.map(a => ({
        moduleId: a.moduleId,
        sectionId: a.sectionId,
        score: a.score,
        total: a.total,
        timestamp: a.createdAt.getTime(),
      })),
      version: 1,
    });
  } catch (error) {
    console.error('Quiz scores GET error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// POST — record a new quiz attempt
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const { sectionId, moduleId, score, total } = body;

    if (!sectionId || !moduleId || score == null || !total) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Create the attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        sectionId,
        moduleId,
        score: Number(score),
        total: Number(total),
      },
    });

    // Trim old attempts for this module (keep only MAX_HISTORY_PER_MODULE)
    const moduleAttempts = await prisma.quizAttempt.findMany({
      where: { userId: user.id, sectionId, moduleId },
      orderBy: { createdAt: 'desc' },
    });

    if (moduleAttempts.length > MAX_HISTORY_PER_MODULE) {
      const toDelete = moduleAttempts.slice(MAX_HISTORY_PER_MODULE);
      await prisma.quizAttempt.deleteMany({
        where: { id: { in: toDelete.map(a => a.id) } },
      });
    }

    return NextResponse.json({
      success: true,
      attempt: {
        moduleId: attempt.moduleId,
        sectionId: attempt.sectionId,
        score: attempt.score,
        total: attempt.total,
        timestamp: attempt.createdAt.getTime(),
      },
    });
  } catch (error) {
    console.error('Quiz scores POST error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// DELETE — clear all quiz data for the user
export async function DELETE() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await prisma.quizAttempt.deleteMany({
      where: { userId: user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Quiz scores DELETE error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
