import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();
const GUEST_LIMIT = 3;

function getClientIP(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') || 
    'unknown';
}

function todayStr() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Vancouver' });
}

export async function GET(req: NextRequest) {
  const ip = getClientIP(req);
  const today = todayStr();
  
  const record = await prisma.$queryRawUnsafe<{ count: number }[]>(
    `SELECT count FROM guest_usage WHERE ip = $1 AND date = $2`,
    ip, today
  ).catch(() => []);
  
  const used = record[0]?.count || 0;
  return NextResponse.json({ used, limit: GUEST_LIMIT, remaining: Math.max(0, GUEST_LIMIT - used), blocked: used >= GUEST_LIMIT });
}

export async function POST(req: NextRequest) {
  const ip = getClientIP(req);
  const today = todayStr();
  
  try {
    await prisma.$executeRawUnsafe(
      `INSERT INTO guest_usage (ip, date, count) VALUES ($1, $2, 1)
       ON CONFLICT (ip, date) DO UPDATE SET count = guest_usage.count + 1`,
      ip, today
    );
    
    const record = await prisma.$queryRawUnsafe<{ count: number }[]>(
      `SELECT count FROM guest_usage WHERE ip = $1 AND date = $2`,
      ip, today
    );
    
    const used = record[0]?.count || 1;
    return NextResponse.json({ used, limit: GUEST_LIMIT, remaining: Math.max(0, GUEST_LIMIT - used), blocked: used >= GUEST_LIMIT });
  } catch (e) {
    console.error('Guest usage error:', e);
    return NextResponse.json({ used: 0, limit: GUEST_LIMIT, remaining: GUEST_LIMIT, blocked: false });
  }
}
