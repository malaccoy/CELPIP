import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get('uid');
  if (!uid) return new NextResponse(html('Invalid link'), { headers: { 'Content-Type': 'text/html' } });

  try {
    await prisma.$queryRawUnsafe(
      `UPDATE email_sequence SET "unsubscribed" = true, "updatedAt" = NOW() WHERE "userId" = $1`,
      uid
    );
  } catch (e) {
    // ignore — maybe no entry yet
  }

  return new NextResponse(html('You have been unsubscribed from CELPIP AI Coach emails. You can still use the platform at any time.'), {
    headers: { 'Content-Type': 'text/html' },
  });
}

function html(msg: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Unsubscribe</title></head>
  <body style="font-family:system-ui,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f5f5f5;margin:0;">
    <div style="background:white;border-radius:16px;padding:40px;max-width:400px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.1);">
      <p style="font-size:48px;margin:0;">📧</p>
      <h2 style="color:#333;">Unsubscribed</h2>
      <p style="color:#666;">${msg}</p>
      <a href="https://celpipaicoach.com" style="color:#e53e3e;text-decoration:none;font-weight:600;">← Back to CELPIP AI Coach</a>
    </div>
  </body></html>`;
}
