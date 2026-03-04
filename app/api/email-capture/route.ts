import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendWelcomeEmail } from '@/lib/email';
import { checkIpRateLimit } from '@/lib/ip-rate-limit';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    if (!checkIpRateLimit(request, 'email-capture', 5)) {
      return NextResponse.json({ error: 'Please try again later.' }, { status: 429 });
    }

    const { email, name, source } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if already exists (don't re-send welcome email)
    const existing = await prisma.emailSubscriber.findUnique({
      where: { email: normalizedEmail },
    });

    const subscriber = await prisma.emailSubscriber.upsert({
      where: { email: normalizedEmail },
      create: {
        email: normalizedEmail,
        name: name || null,
        source: source || 'popup',
      },
      update: {},
    });

    // Send welcome email only for new subscribers
    if (!existing) {
      sendWelcomeEmail(normalizedEmail, name).catch(err =>
        console.error('Welcome email failed:', err)
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email capture error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
