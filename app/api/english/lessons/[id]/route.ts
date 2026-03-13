import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const lessonId = parseInt(id);
    if (isNaN(lessonId)) return NextResponse.json({ error: 'Invalid lesson ID' }, { status: 400 });

    const lesson = await prisma.englishLesson.findUnique({
      where: { id: lessonId },
      include: {
        exercises: { orderBy: { order: 'asc' } },
        level: { select: { number: true, name: true } },
      },
    });

    if (!lesson) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });

    // Check completion
    const { getUserPlan } = await import('@/lib/plan');
    const { authenticated, userId } = await getUserPlan();
    let completion = null;
    if (authenticated && userId) {
      completion = await prisma.lessonCompletion.findUnique({
        where: { userId_lessonId: { userId, lessonId } },
      });
    }

    return NextResponse.json({
      lesson: {
        id: lesson.id,
        number: lesson.number,
        title: lesson.title,
        situation: lesson.situation,
        grammarFocus: lesson.grammarFocus,
        keyPhrases: lesson.keyPhrases,
        imageUrl: lesson.imageUrl,
        dialogue: lesson.dialogue,
        vocabulary: lesson.vocabulary,
        levelNumber: lesson.level.number,
        levelName: lesson.level.name,
      },
      exercises: lesson.exercises.map(e => ({
        id: e.id,
        type: e.type,
        order: e.order,
        question: e.question,
        options: e.options,
        hint: e.hint,
        explanation: e.hint,
        correct: e.correct,
        points: e.points,
        // Don't send correct answer to client — validate server-side
      })),
      completion,
      totalExercises: lesson.exercises.length,
    });
  } catch (error) {
    console.error('Lesson fetch error:', error);
    return NextResponse.json({ error: 'Failed to load lesson' }, { status: 500 });
  }
}
