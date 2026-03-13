import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const levelId = parseInt(id);
    if (isNaN(levelId)) return NextResponse.json({ error: 'Invalid level ID' }, { status: 400 });

    const lessons = await prisma.englishLesson.findMany({
      where: { levelId },
      orderBy: { number: 'asc' },
      select: {
        id: true, number: true, title: true, situation: true,
        grammarFocus: true, imageUrl: true,
      },
    });

    return NextResponse.json({ lessons });
  } catch (error) {
    console.error('Level lessons error:', error);
    return NextResponse.json({ error: 'Failed to load lessons' }, { status: 500 });
  }
}
