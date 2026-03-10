import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/../auth';
import { logActivity } from '@/lib/activity';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, count } = await request.json();

    if (!['reading', 'listening', 'writing', 'speaking'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const safeCount = Math.min(Math.max(1, Number(count) || 1), 50); // cap at 50 per call

    await logActivity(session.user.id, type, safeCount);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Log activity error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
