import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const rows = await prisma.$queryRawUnsafe(`
      SELECT 
        bs.user_id,
        COALESCE(u.name, u.email, 'Player') as name,
        u.image as avatar,
        bs.rating,
        bs.wins,
        bs.losses,
        bs.draws,
        bs.battles_played
      FROM battle_stats bs
      LEFT JOIN users u ON u.id::text = bs.user_id
      ORDER BY bs.rating DESC
      LIMIT 50
    `) as any[];

    return NextResponse.json({ leaderboard: rows });
  } catch (e: any) {
    console.error('Battle stats error:', e.message);
    return NextResponse.json({ leaderboard: [] });
  }
}
