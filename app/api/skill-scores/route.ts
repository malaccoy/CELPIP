import { NextRequest, NextResponse } from 'next/server';
import { getUserPlan } from '@/lib/plan';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST — save a skill score after completing all parts
export async function POST(req: NextRequest) {
  try {
    const { userId } = await getUserPlan();
    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { skill, score, correct, total } = await req.json();
    if (!skill || score === undefined) {
      return NextResponse.json({ error: 'Missing skill or score' }, { status: 400 });
    }

    await prisma.skillScore.create({
      data: { userId, skill, score: Number(score), correct: correct || 0, total: total || 0 }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Save skill score error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// GET — get latest skill scores for radar chart
export async function GET() {
  try {
    const { userId } = await getUserPlan();
    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    // Get the latest score per skill
    const scores: Record<string, number> = {};
    for (const skill of ['reading', 'listening', 'writing', 'speaking']) {
      const latest = await prisma.skillScore.findFirst({
        where: { userId, skill },
        orderBy: { createdAt: 'desc' },
      });
      scores[skill] = latest?.score || 0;
    }

    return NextResponse.json({ scores });
  } catch (error) {
    console.error('Get skill scores error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
