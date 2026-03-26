import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { ref } = await req.json();
    if (!ref) return NextResponse.json({ ok: true });

    // Update user's referralSource if not already set
    await prisma.$queryRawUnsafe(
      `UPDATE users SET "referralSource" = $1 WHERE id = $2 AND ("referralSource" IS NULL OR "referralSource" = '')`,
      ref, user.id
    );

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
