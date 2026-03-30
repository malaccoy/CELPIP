import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { ref, referralCode } = await req.json();
    
    // Save referral source
    if (ref) {
      await prisma.$queryRawUnsafe(
        `UPDATE users SET "referralSource" = $1 WHERE id = $2 AND ("referralSource" IS NULL OR "referralSource" = '')`,
        ref, user.id
      );
    }

    // Process referral code — link this user to the referrer
    const code = referralCode || null;
    if (code) {
      // Find the referrer by code
      const referrer = await prisma.$queryRawUnsafe<any[]>(
        `SELECT id FROM users WHERE referral_code = $1 AND id != $2 LIMIT 1`,
        code.toUpperCase(), user.id
      );

      if (referrer.length > 0) {
        // Check if referral already exists for this pair
        const existing = await prisma.$queryRawUnsafe<any[]>(
          `SELECT id FROM referrals WHERE referrer_id = $1 AND referred_id = $2 LIMIT 1`,
          referrer[0].id, user.id
        );

        if (existing.length === 0) {
          await prisma.$queryRawUnsafe(
            `INSERT INTO referrals (id, referrer_id, referred_id, referred_email, status, created_at)
             VALUES (gen_random_uuid()::text, $1, $2, $3, 'registered', NOW())`,
            referrer[0].id, user.id, user.email || ''
          );
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
