import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendWelcomeEmail } from '@/lib/email';
import { checkIpRateLimit } from '@/lib/ip-rate-limit';
import { EmailCaptureSchema, parseBody } from '@/lib/validations';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    if (!checkIpRateLimit(request, 'email-capture', 5)) {
      return NextResponse.json({ error: 'Please try again later.' }, { status: 429 });
    }

    // Validate input with Zod schema
    const result = await parseBody(request, EmailCaptureSchema);
    if (!result.success) return result.error as unknown as NextResponse;
    const { email, name, source } = result.data;

    // Check if already exists (don't re-send welcome email)
    const existing = await prisma.emailSubscriber.findUnique({
      where: { email },
    });

    const subscriber = await prisma.emailSubscriber.upsert({
      where: { email },
      create: {
        email,
        name: name || null,
        source: source || 'popup',
      },
      update: {},
    });

    // Send welcome email only for new subscribers
    if (!existing) {
      sendWelcomeEmail(email, name).catch(err =>
        console.error('Welcome email failed:', err)
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email capture error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
