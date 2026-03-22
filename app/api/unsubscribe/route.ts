import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET — unsubscribe via link click (token in query)
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  const email = req.nextUrl.searchParams.get('email');

  if (!token && !email) {
    return NextResponse.json({ error: 'Missing token or email' }, { status: 400 });
  }

  try {
    if (token) {
      await prisma.$queryRawUnsafe(
        `UPDATE email_preferences SET unsubscribed = true, unsubscribed_at = NOW() WHERE token = $1`,
        token
      );
    } else if (email) {
      await prisma.$queryRawUnsafe(
        `UPDATE email_preferences SET unsubscribed = true, unsubscribed_at = NOW() WHERE email = $1`,
        email
      );
    }

    // Redirect to unsubscribe confirmation page
    return NextResponse.redirect(new URL('/unsubscribe?success=true', req.url));
  } catch (e: unknown) {
    console.error('Unsubscribe error:', e);
    return NextResponse.redirect(new URL('/unsubscribe?error=true', req.url));
  }
}

// POST — unsubscribe via form / resubscribe
export async function POST(req: NextRequest) {
  const { email, action } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  try {
    if (action === 'resubscribe') {
      await prisma.$queryRawUnsafe(
        `UPDATE email_preferences SET unsubscribed = false, unsubscribed_at = NULL WHERE email = $1`,
        email
      );
      return NextResponse.json({ success: true, message: 'Resubscribed' });
    }

    await prisma.$queryRawUnsafe(
      `UPDATE email_preferences SET unsubscribed = true, unsubscribed_at = NOW() WHERE email = $1`,
      email
    );
    return NextResponse.json({ success: true, message: 'Unsubscribed' });
  } catch (e: unknown) {
    console.error('Unsubscribe error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
