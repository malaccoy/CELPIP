import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getUserId() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}

export async function GET(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const drillType = req.nextUrl.searchParams.get('type') || 'speaking';
  const rows: any[] = await prisma.$queryRaw`
    SELECT level_id, completed, score, total, completed_at 
    FROM drill_progress 
    WHERE user_id = ${userId} AND drill_type = ${drillType}
  `;

  const progress: Record<number, { completed: boolean; score: number; total: number }> = {};
  rows.forEach((r) => {
    progress[r.level_id] = { completed: r.completed, score: r.score, total: r.total };
  });

  return NextResponse.json({ progress });
}

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { drillType = 'speaking', levelId, score, total, completed = false } = await req.json();

  await prisma.$executeRaw`
    INSERT INTO drill_progress (user_id, drill_type, level_id, score, total, completed)
    VALUES (${userId}, ${drillType}, ${levelId}, ${score || 0}, ${total || 0}, ${completed})
    ON CONFLICT (user_id, drill_type, level_id) 
    DO UPDATE SET 
      completed = CASE WHEN ${completed} THEN true ELSE drill_progress.completed END,
      score = GREATEST(drill_progress.score, ${score || 0}), 
      total = GREATEST(drill_progress.total, ${total || 0}), 
      completed_at = CASE WHEN ${completed} THEN NOW() ELSE drill_progress.completed_at END
  `;

  return NextResponse.json({ ok: true });
}
