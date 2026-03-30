import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET — return user's referral code + stats
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Get or create referral code
  let dbUser = await prisma.$queryRawUnsafe<any[]>(
    `SELECT referral_code FROM users WHERE id = $1`, user.id
  );

  let code = dbUser[0]?.referral_code;
  if (!code) {
    code = (require('crypto').createHash('md5').update(user.id + 'celpip-ref').digest('hex').substring(0, 8)).toUpperCase();
    await prisma.$queryRawUnsafe(
      `UPDATE users SET referral_code = $1 WHERE id = $2`, code, user.id
    );
  }

  // Get referral stats
  const stats = await prisma.$queryRawUnsafe<any[]>(`
    SELECT 
      COUNT(*) FILTER (WHERE status IN ('registered','paid')) as invited,
      COUNT(*) FILTER (WHERE status = 'paid') as paid,
      COALESCE(SUM(days_rewarded), 0) as days_earned
    FROM referrals WHERE referrer_id = $1
  `, user.id);

  return NextResponse.json({
    code,
    link: `https://celpipaicoach.com/ref/${code}`,
    invited: Number(stats[0]?.invited ?? 0),
    paid: Number(stats[0]?.paid ?? 0),
    daysEarned: Number(stats[0]?.days_earned ?? 0),
  });
}
