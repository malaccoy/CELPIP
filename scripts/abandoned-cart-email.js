const RESEND_API_KEY = 're_SiSKMetP_Lq8CUt7eWMo5zHavU9ZJLrp3';
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Abandoned cart emails (exclude active Pro + owner accounts)
const abandoned = [
  'yana.metalidi@gmail.com',
  'dan.otoo25@yahoo.com',
  'anshulchauhan220@gmail.com',
  'ziangnatividad@gmail.com',
  'genoci@protonmail.com',
  'kcgranjith219@gmail.com',
  'mobeter030@gmail.com',
  'shubamgarg05@gmail.com',
  'lawalfaheezo@gmail.com',
  'bharwaddharmin651@gmail.com',
  'yamzonlly@yahoo.com',
  'namradaed@gmail.com',
  'sheryll_024@yahoo.com',
  'sarawadhwa81@gmail.com',
  'kaceabubakar@gmail.com',
  'imohdabdulmustafa@gmail.com',
  'avleen7748@gmail.com',
  'rocco.don1997@gmail.com',
  'sumit17chauhan95@gmail.com',
];

async function getToken(email) {
  const rows = await prisma.$queryRawUnsafe('SELECT token FROM email_preferences WHERE email = $1', email);
  if (rows.length > 0) return rows[0].token;
  const token = crypto.randomBytes(32).toString('hex');
  await prisma.$queryRawUnsafe(
    'INSERT INTO email_preferences (email, token) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING', email, token
  );
  return token;
}

async function isUnsub(email) {
  const rows = await prisma.$queryRawUnsafe('SELECT unsubscribed FROM email_preferences WHERE email = $1', email);
  return rows.length > 0 && rows[0].unsubscribed === true;
}

function emailHtml(token) {
  const unsubUrl = `https://celpipaicoach.com/api/unsubscribe?token=${token}`;
  return `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #0f172a; color: #f8fafc; padding: 2rem; border-radius: 16px;">
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="font-size: 3rem;">👋</div>
      <h1 style="margin: 8px 0; font-size: 22px; color: #fff;">We noticed you didn't finish signing up for Pro</h1>
    </div>

    <p style="font-size: 15px; line-height: 1.7; color: rgba(255,255,255,0.75);">
      Hey! We saw you started the checkout for CELPIP AI Coach Pro but didn't complete it.
    </p>

    <p style="font-size: 15px; line-height: 1.7; color: rgba(255,255,255,0.75);">
      Was there a problem with the payment? We'd love to help! Here's what Pro gives you:
    </p>

    <div style="background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.3); border-radius: 12px; padding: 16px; margin: 20px 0;">
      <p style="margin: 6px 0; font-size: 14px;">✅ <strong>Unlimited</strong> practice — all 4 skills</p>
      <p style="margin: 6px 0; font-size: 14px;">🎯 <strong>Advanced</strong> exercises (CLB 9-10)</p>
      <p style="margin: 6px 0; font-size: 14px;">⚔️ <strong>PvP Battles</strong> — compete with other students</p>
      <p style="margin: 6px 0; font-size: 14px;">📝 <strong>Full Mock Exams</strong> with AI scoring</p>
      <p style="margin: 6px 0; font-size: 14px;">💬 <strong>AI Feedback</strong> on Speaking & Writing</p>
    </div>

    <p style="font-size: 15px; line-height: 1.7; color: rgba(255,255,255,0.75);">
      If you had any issues, we're here to help! Reach out anytime:
    </p>

    <div style="text-align: center; margin: 24px 0;">
      <a href="https://celpipaicoach.com/support" style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #6366f1, #4f46e5); color: #fff; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 15px; margin: 4px;">
        Contact Support 💬
      </a>
      <br><br>
      <a href="https://celpipaicoach.com/pricing" style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #ef4444, #dc2626); color: #fff; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 15px; margin: 4px;">
        Complete Your Upgrade →
      </a>
    </div>

    <p style="text-align: center; color: rgba(255,255,255,0.35); font-size: 12px; margin-top: 24px;">
      Plans start at CA$7.99/week · Cancel anytime
    </p>

    <div style="margin-top: 20px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
      <p style="color: rgba(255,255,255,0.25); font-size: 11px; margin: 0;">
        You're receiving this because you started a checkout at celpipaicoach.com
      </p>
      <p style="color: rgba(255,255,255,0.25); font-size: 11px; margin: 4px 0 0;">
        <a href="${unsubUrl}" style="color: rgba(255,255,255,0.35); text-decoration: underline;">Unsubscribe from emails</a>
      </p>
    </div>
  </div>`;
}

async function send(email, html) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'CELPIP AI Coach <noreply@celpipaicoach.com>',
      to: [email],
      subject: '👋 Having trouble with checkout? We can help!',
      html,
    }),
  });
  return res.ok;
}

async function main() {
  let sent = 0, skipped = 0;
  for (const email of abandoned) {
    if (await isUnsub(email)) { console.log(`SKIP (unsub): ${email}`); skipped++; continue; }
    const token = await getToken(email);
    const ok = await send(email, emailHtml(token));
    console.log(`${ok ? 'SENT' : 'FAIL'}: ${email}`);
    if (ok) sent++;
    await new Promise(r => setTimeout(r, 1500)); // rate limit
  }
  console.log(`\nDone! Sent: ${sent}, Skipped: ${skipped}, Total: ${abandoned.length}`);
  await prisma.$disconnect();
}

main().catch(console.error);
