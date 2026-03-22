// Streak Notification Script
// Run via cron every 6h — sends email when streak is at risk
// Usage: node scripts/streak-notifications.js

const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_SiSKMetP_Lq8CUt7eWMo5zHavU9ZJLrp3';

async function getUnsubToken(email, userId) {
  const rows = await prisma.$queryRawUnsafe('SELECT token, unsubscribed FROM email_preferences WHERE email = $1', email);
  if (rows.length > 0) return rows[0];
  const token = crypto.randomBytes(32).toString('hex');
  await prisma.$queryRawUnsafe(
    'INSERT INTO email_preferences (email, user_id, token) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING',
    email, userId || null, token
  );
  return { token, unsubscribed: false };
}

function unsubFooter(token) {
  const url = `https://celpipaicoach.com/api/unsubscribe?token=${token}`;
  return `
    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
      <p style="color: rgba(255,255,255,0.25); font-size: 11px; margin: 0;">
        You're receiving this because you signed up at celpipaicoach.com
      </p>
      <p style="color: rgba(255,255,255,0.25); font-size: 11px; margin: 4px 0 0;">
        <a href="${url}" style="color: rgba(255,255,255,0.35); text-decoration: underline;">Unsubscribe from emails</a>
      </p>
    </div>`;
}

async function sendEmail(to, subject, html) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'CELPIP AI Coach <noreply@celpipaicoach.com>',
      to: [to],
      subject,
      html,
    }),
  });
  return res.ok;
}

function streakEmail(name, streak, unsubToken) {
  return `
  <div style="font-family: 'Segoe UI', sans-serif; max-width: 500px; margin: 0 auto; background: #0f172a; color: #f8fafc; padding: 2rem; border-radius: 16px;">
    <div style="text-align: center; margin-bottom: 1.5rem;">
      <div style="font-size: 4rem;">🔥</div>
      <h1 style="margin: 0.5rem 0; font-size: 1.5rem;">Your ${streak}-day streak is at risk!</h1>
      <p style="color: rgba(255,255,255,0.6); font-size: 0.9rem;">
        Hey ${name || 'there'}, don't let your progress slip away!
      </p>
    </div>
    <div style="background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3); border-radius: 12px; padding: 1rem; text-align: center; margin-bottom: 1.5rem;">
      <p style="margin: 0; color: #fbbf24; font-weight: 600;">
        ⏰ Practice before midnight to keep your streak alive!
      </p>
    </div>
    <div style="text-align: center;">
      <a href="https://celpipaicoach.com/dashboard" style="display: inline-block; padding: 0.8rem 2rem; background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: #fff; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 1rem;">
        Practice Now →
      </a>
    </div>
    <p style="text-align: center; color: rgba(255,255,255,0.3); font-size: 0.75rem; margin-top: 1.5rem;">
      CELPIP AI Coach · <a href="https://celpipaicoach.com" style="color: rgba(255,255,255,0.3);">celpipaicoach.com</a>
    </p>
    ${unsubFooter(unsubToken)}
  </div>`;
}

async function main() {
  const now = new Date();
  console.log('Streak notifications check:', now.toISOString());

  const streaks = await prisma.streakData.findMany({
    where: {
      currentStreak: { gte: 3 },
      lastPracticeAt: {
        lt: new Date(now.getTime() - 20 * 3600000),
        gt: new Date(now.getTime() - 44 * 3600000),
      },
      streakFrozenAt: null,
    },
  });

  console.log(`Found ${streaks.length} at-risk streaks`);

  let sent = 0, skipped = 0;
  for (const s of streaks) {
    const user = await prisma.user.findUnique({ where: { id: s.userId }, select: { email: true, name: true } });
    if (!user?.email) continue;

    // Check unsubscribe
    const pref = await getUnsubToken(user.email, s.userId);
    if (pref.unsubscribed) {
      console.log(`Skipped ${user.email} (unsubscribed)`);
      skipped++;
      continue;
    }

    console.log(`Sending to ${user.email} (streak: ${s.currentStreak})`);
    const ok = await sendEmail(
      user.email,
      `🔥 Your ${s.currentStreak}-day streak is at risk! ⏳`,
      streakEmail(user.name, s.currentStreak, pref.token)
    );
    if (ok) sent++;

    await new Promise(r => setTimeout(r, 1500));
  }

  console.log(`Sent: ${sent}/${streaks.length}, Skipped: ${skipped}`);
  await prisma.$disconnect();
}

main().catch(console.error);
