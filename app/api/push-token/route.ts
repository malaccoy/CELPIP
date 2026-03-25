import { NextResponse } from 'next/server';
import { getUserPlan } from '@/lib/plan';

export async function POST(req: Request) {
  try {
    const plan = await getUserPlan();
    if (!plan.authenticated || !plan.userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { token, platform } = await req.json();
    const userId = plan.userId; // Use authenticated userId, not client-provided
    
    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    // Import prisma
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    // Upsert the push token
    await prisma.$executeRawUnsafe(`
      INSERT INTO push_tokens ("userId", token, platform, "updatedAt")
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT ("userId", platform) 
      DO UPDATE SET token = $2, "updatedAt" = NOW()
    `, userId, token, platform || 'android');

    await prisma.$disconnect();

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('[push-token] Error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
