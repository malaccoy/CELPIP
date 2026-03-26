#!/usr/bin/env node
/**
 * Email Sequence Automation
 * Runs daily via cron. Sends up to 100 emails/day (Resend limit).
 * 
 * Step 0 → Email 1: Welcome (immediate on signup — handled by auth callback)
 * Step 1 → Email 2: 24h nudge (no exercise done)
 * Step 2 → Email 3: 72h conversion (did exercises, not Pro)
 * Step 3 → Email 4: 7d last push (still not Pro)
 * Step 4 → Done (no more emails)
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_SiSKMetP_Lq8CUt7eWMo5zHavU9ZJLrp3';
const FROM = 'CELPIP AI Coach <noreply@celpipaicoach.com>';
const DAILY_LIMIT = 95; // leave 5 buffer for transactional
const SITE = 'https://celpipaicoach.com';

async function sendEmail(to, subject, html) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Resend error: ${JSON.stringify(data)}`);
  return data;
}

function unsubLink(userId) {
  return `${SITE}/api/unsubscribe?uid=${userId}`;
}

function footer(userId) {
  return `<p style="color:#999;font-size:12px;margin-top:40px;border-top:1px solid #eee;padding-top:16px;">
    You're receiving this because you signed up at CELPIP AI Coach.<br>
    <a href="${unsubLink(userId)}" style="color:#999;">Unsubscribe</a>
  </p>`;
}

const emails = {
  // Step 1: 24h nudge — sent to users who haven't done any exercise
  1: (name, userId) => ({
    subject: "Your free CELPIP exercises are waiting! 🎯",
    html: `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#333;">
      <h2 style="color:#e53e3e;">Hey${name ? ' ' + name : ''}! 👋</h2>
      <p>You signed up for CELPIP AI Coach yesterday but haven't tried any exercises yet.</p>
      <p>Here's what you're missing:</p>
      <ul>
        <li>🎯 <strong>10 FREE exercises every day</strong> — Speaking, Writing, Listening & Reading</li>
        <li>🤖 <strong>Instant AI feedback</strong> — know your score immediately</li>
        <li>📊 <strong>Track your progress</strong> — see how you improve over time</li>
      </ul>
      <p><strong>Students who practice in their first 24 hours are 3x more likely to reach their target score.</strong></p>
      <p style="text-align:center;margin:32px 0;">
        <a href="${SITE}/dashboard" style="background:#e53e3e;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;">
          Start Your First Exercise →
        </a>
      </p>
      <p style="color:#666;font-size:14px;">It takes less than 2 minutes. Give it a try!</p>
      ${footer(userId)}
    </div>`
  }),

  // Step 2: 72h conversion — sent to active users who aren't Pro
  2: (name, userId, exerciseCount) => ({
    subject: `You've completed ${exerciseCount || 'several'} exercises! Here's what's next 🚀`,
    html: `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#333;">
      <h2 style="color:#e53e3e;">Great progress${name ? ', ' + name : ''}! 🎉</h2>
      <p>You've already completed <strong>${exerciseCount || 'several'} exercises</strong>. That's awesome!</p>
      <p>Here's what Pro members get that you're missing:</p>
      <div style="background:#f8f8f8;border-radius:12px;padding:20px;margin:20px 0;">
        <p style="margin:8px 0;">🔓 <strong>Unlimited exercises</strong> — no daily limit</p>
        <p style="margin:8px 0;">📈 <strong>Advanced difficulty</strong> — CLB 9-12 level content</p>
        <p style="margin:8px 0;">⚔️ <strong>Battle Mode</strong> — compete with other students</p>
        <p style="margin:8px 0;">📊 <strong>Detailed analytics</strong> — know exactly where to improve</p>
      </div>
      <p><strong>Pro starts at just CA$9.99/week</strong> — less than a coffee a day.</p>
      <p style="text-align:center;margin:32px 0;">
        <a href="${SITE}/pricing" style="background:#e53e3e;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;">
          See Pro Plans →
        </a>
      </p>
      <p style="color:#666;font-size:14px;">Still on free? No problem — your 10 daily exercises are always here.</p>
      ${footer(userId)}
    </div>`
  }),

  // Step 3: 7d last push
  3: (name, userId) => ({
    subject: "Students who practice daily score 2+ points higher 📊",
    html: `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#333;">
      <h2 style="color:#e53e3e;">Quick reminder${name ? ', ' + name : ''} 💪</h2>
      <p>Research shows that <strong>consistent daily practice</strong> is the #1 factor in CELPIP success.</p>
      <p>Students who practice every day for 2 weeks typically score <strong>2+ points higher</strong> than those who study sporadically.</p>
      <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:12px;padding:20px;margin:20px 0;">
        <p style="margin:4px 0;font-weight:700;color:#166534;">🏆 What top scorers do:</p>
        <p style="margin:8px 0;">✅ Practice 15-30 min every day</p>
        <p style="margin:8px 0;">✅ Focus on weakest skills first</p>
        <p style="margin:8px 0;">✅ Review AI feedback carefully</p>
        <p style="margin:8px 0;">✅ Use Advanced exercises to push limits</p>
      </div>
      <p style="text-align:center;margin:32px 0;">
        <a href="${SITE}/dashboard" style="background:#e53e3e;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;">
          Continue Practicing →
        </a>
      </p>
      <p style="color:#666;font-size:14px;">Your CELPIP exam date is getting closer. Make every day count!</p>
      ${footer(userId)}
    </div>`
  }),
};

async function main() {
  let sent = 0;

  // 1. Initialize sequence for new users (no entry yet)
  const newUsers = await prisma.$queryRawUnsafe(`
    INSERT INTO email_sequence (id, "userId", step, "createdAt", "updatedAt")
    SELECT gen_random_uuid()::text, u.id, 0, NOW(), NOW()
    FROM users u
    LEFT JOIN email_sequence es ON es."userId" = u.id
    WHERE es.id IS NULL AND u.email IS NOT NULL
    ON CONFLICT DO NOTHING
    RETURNING "userId"
  `);
  if (newUsers.length > 0) console.log(`Initialized ${newUsers.length} new users`);

  // 2. Process Step 0→1: Users signed up >24h ago, no exercises done
  if (sent < DAILY_LIMIT) {
    const step0 = await prisma.$queryRawUnsafe(`
      SELECT es."userId", u.email, u.name
      FROM email_sequence es
      JOIN users u ON u.id = es."userId"
      WHERE es.step = 0 AND es."unsubscribed" = false
        AND u."createdAt" < NOW() - INTERVAL '24 hours'
        AND NOT EXISTS (SELECT 1 FROM activity_logs al WHERE al."userId" = es."userId")
      LIMIT $1
    `, DAILY_LIMIT - sent);

    for (const user of step0) {
      if (sent >= DAILY_LIMIT) break;
      try {
        const tmpl = emails[1](user.displayName, user.userId);
        await sendEmail(user.email, tmpl.subject, tmpl.html);
        await prisma.$queryRawUnsafe(`UPDATE email_sequence SET step = 1, "lastSentAt" = NOW(), "updatedAt" = NOW() WHERE "userId" = $1`, user.userId);
        sent++;
        console.log(`Step 1 → ${user.email}`);
      } catch (e) { console.error(`Err step1 ${user.email}:`, e.message); }
    }
  }

  // 3. Process Step 0→2 or 1→2: Users >72h, DID exercises, not Pro
  if (sent < DAILY_LIMIT) {
    const step1 = await prisma.$queryRawUnsafe(`
      SELECT es."userId", u.email, u.name,
        (SELECT COUNT(*) FROM activity_logs al WHERE al."userId" = es."userId") as ex_count
      FROM email_sequence es
      JOIN users u ON u.id = es."userId"
      WHERE es.step IN (0, 1) AND es."unsubscribed" = false
        AND u."createdAt" < NOW() - INTERVAL '72 hours'
        AND EXISTS (SELECT 1 FROM activity_logs al WHERE al."userId" = es."userId")
        AND NOT EXISTS (SELECT 1 FROM user_plans up WHERE up."userId" = es."userId" AND up.plan = 'pro' AND up."expiresAt" > NOW())
      LIMIT $1
    `, DAILY_LIMIT - sent);

    for (const user of step1) {
      if (sent >= DAILY_LIMIT) break;
      try {
        const tmpl = emails[2](user.displayName, user.userId, Number(user.ex_count));
        await sendEmail(user.email, tmpl.subject, tmpl.html);
        await prisma.$queryRawUnsafe(`UPDATE email_sequence SET step = 2, "lastSentAt" = NOW(), "updatedAt" = NOW() WHERE "userId" = $1`, user.userId);
        sent++;
        console.log(`Step 2 → ${user.email} (${user.ex_count} exercises)`);
      } catch (e) { console.error(`Err step2 ${user.email}:`, e.message); }
    }
  }

  // 4. Process Step 2→3: Users >7d, still not Pro
  if (sent < DAILY_LIMIT) {
    const step2 = await prisma.$queryRawUnsafe(`
      SELECT es."userId", u.email, u.name
      FROM email_sequence es
      JOIN users u ON u.id = es."userId"
      WHERE es.step = 2 AND es."unsubscribed" = false
        AND u."createdAt" < NOW() - INTERVAL '7 days'
        AND NOT EXISTS (SELECT 1 FROM user_plans up WHERE up."userId" = es."userId" AND up.plan = 'pro' AND up."expiresAt" > NOW())
      LIMIT $1
    `, DAILY_LIMIT - sent);

    for (const user of step2) {
      if (sent >= DAILY_LIMIT) break;
      try {
        const tmpl = emails[3](user.displayName, user.userId);
        await sendEmail(user.email, tmpl.subject, tmpl.html);
        await prisma.$queryRawUnsafe(`UPDATE email_sequence SET step = 3, "lastSentAt" = NOW(), "updatedAt" = NOW() WHERE "userId" = $1`, user.userId);
        sent++;
        console.log(`Step 3 → ${user.email}`);
      } catch (e) { console.error(`Err step3 ${user.email}:`, e.message); }
    }
  }

  // 5. Mark step 3 users >7d as done (step 4)
  await prisma.$queryRawUnsafe(`
    UPDATE email_sequence SET step = 4, "updatedAt" = NOW()
    WHERE step = 3 AND "lastSentAt" < NOW() - INTERVAL '7 days'
  `);

  // 6. Auto-complete Pro users (skip remaining sequence)
  await prisma.$queryRawUnsafe(`
    UPDATE email_sequence SET step = 4, "updatedAt" = NOW()
    WHERE step < 4
      AND EXISTS (SELECT 1 FROM user_plans up WHERE up."userId" = email_sequence."userId" AND up.plan = 'pro' AND up."expiresAt" > NOW())
  `);

  console.log(`\nTotal sent: ${sent}/${DAILY_LIMIT}`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
