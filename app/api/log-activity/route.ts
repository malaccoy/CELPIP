import { NextRequest, NextResponse } from 'next/server';
import { logActivity } from '@/lib/activity';
import { getUserPlan } from '@/lib/plan';

export async function POST(request: NextRequest) {
  try {
    const planCheck = await getUserPlan();
    if (!planCheck.authenticated || !planCheck.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, count } = await request.json();

    if (!['reading', 'listening', 'writing', 'speaking'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const safeCount = Math.min(Math.max(1, Number(count) || 1), 50);

    await logActivity(planCheck.userId, type, safeCount);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Log activity error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
