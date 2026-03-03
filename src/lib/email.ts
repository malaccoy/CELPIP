import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://celpipaicoach.com';
const FROM = 'CELPIP AI Coach <hello@celpipaicoach.com>';

function emailWrapper(content: string) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0e1a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:40px 24px;">
  <div style="text-align:center;margin-bottom:32px;">
    <div style="font-size:32px;margin-bottom:8px;">🍁</div>
    <h1 style="color:#f1f5f9;font-size:24px;font-weight:800;margin:0;">CELPIP AI Coach</h1>
  </div>
  <div style="background:#1a1f2e;border-radius:16px;padding:32px;border:1px solid rgba(255,255,255,0.06);">
    ${content}
  </div>
  <div style="text-align:center;margin-top:32px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.06);">
    <p style="color:#475569;font-size:12px;margin:0;">CELPIP AI Coach · Vancouver, Canada<br><a href="https://celpipaicoach.com" style="color:#64748b;">celpipaicoach.com</a></p>
  </div>
</div>
</body></html>`;
}

function ctaButton(href: string, text: string) {
  return `<div style="text-align:center;margin:24px 0;">
    <a href="${href}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#cc0000,#ff3b3b);color:white;text-decoration:none;border-radius:12px;font-weight:700;font-size:16px;">${text}</a>
  </div>`;
}

async function sendEmail(to: string, subject: string, html: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM, to, replyTo: 'hello@celpipaicoach.com', subject, html,
    });
    if (error) { console.error('Resend error:', error); return { success: false, error }; }
    return { success: true, id: data?.id };
  } catch (err) {
    console.error('Email send error:', err);
    return { success: false, error: err };
  }
}

export async function sendVerificationEmail(to: string, token: string, name?: string) {
  const firstName = name?.split(' ')[0] || 'there';
  const verifyUrl = `${SITE_URL}/auth/verify?token=${token}`;

  return sendEmail(to, 'Verify your CELPIP AI Coach account', emailWrapper(`
    <h2 style="color:#f1f5f9;font-size:20px;font-weight:700;margin:0 0 12px;">Hey ${firstName}! Almost there.</h2>
    <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 24px;">Click the button below to verify your email and activate your account. This link expires in 24 hours.</p>
    ${ctaButton(verifyUrl, 'Verify My Email')}
    <p style="color:#64748b;font-size:13px;line-height:1.5;margin:0;">If the button doesn't work, copy and paste this link:<br><a href="${verifyUrl}" style="color:#ff3b3b;word-break:break-all;">${verifyUrl}</a></p>
  `));
}

export async function sendPasswordResetEmail(to: string, token: string, name?: string) {
  const firstName = name?.split(' ')[0] || 'there';
  const resetUrl = `${SITE_URL}/auth/reset-password?token=${token}`;

  return sendEmail(to, 'Reset your CELPIP AI Coach password', emailWrapper(`
    <h2 style="color:#f1f5f9;font-size:20px;font-weight:700;margin:0 0 12px;">Password Reset</h2>
    <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 24px;">Hey ${firstName}, we received a request to reset your password. Click below to choose a new one. This link expires in 1 hour.</p>
    ${ctaButton(resetUrl, 'Reset Password')}
    <p style="color:#64748b;font-size:13px;line-height:1.5;margin:0;">If you didn't request this, you can safely ignore this email.</p>
  `));
}

export async function sendWelcomeEmail(to: string, name?: string) {
  const firstName = name?.split(' ')[0] || 'there';

  return sendEmail(to, `Welcome to CELPIP AI Coach, ${firstName}!`, emailWrapper(`
    <h2 style="color:#f1f5f9;font-size:20px;font-weight:700;margin:0 0 12px;">Hey ${firstName}! 👋</h2>
    <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 20px;">Welcome to CELPIP AI Coach — Canada's AI-powered CELPIP preparation platform. You're now part of a community of test-takers working toward their Canadian dreams.</p>

    <h3 style="color:#f1f5f9;font-size:16px;font-weight:700;margin:0 0 12px;">🎯 Here's what you get for free:</h3>
    <ul style="color:#cbd5e1;font-size:14px;line-height:1.8;padding-left:20px;margin:0 0 20px;">
      <li><strong>200+ practice exercises</strong> across all 4 sections</li>
      <li><strong>Expert technique guides</strong> for Writing, Speaking, Reading & Listening</li>
      <li><strong>CRS Score Calculator</strong> — see your Express Entry points</li>
      <li><strong>Practice Timer</strong> — simulate real exam conditions</li>
      <li><strong>10 reading passages</strong> + 16 listening audio tracks</li>
    </ul>

    <h3 style="color:#f1f5f9;font-size:16px;font-weight:700;margin:0 0 12px;">🚀 Quick start (5 minutes):</h3>
    <ol style="color:#cbd5e1;font-size:14px;line-height:1.8;padding-left:20px;margin:0 0 24px;">
      <li>Take the <strong>free assessment</strong> to find your level</li>
      <li>Read the <strong>technique guide</strong> for your weakest section</li>
      <li>Try a <strong>practice exercise</strong> with the timer</li>
    </ol>

    ${ctaButton(`${SITE_URL}/dashboard`, 'Start Practicing Now →')}
  `) + `
  <div style="background:rgba(255,59,59,0.06);border:1px solid rgba(255,59,59,0.12);border-radius:12px;padding:20px;margin-top:16px;text-align:center;">
    <p style="color:#ff6b6b;font-size:14px;font-weight:700;margin:0 0 4px;">✨ Want AI-powered coaching?</p>
    <p style="color:#94a3b8;font-size:13px;margin:0;">Try Pro free for 3 days — AI feedback, mock exams, adaptive difficulty & more. <a href="${SITE_URL}/pricing" style="color:#ff3b3b;text-decoration:underline;">See plans</a></p>
  </div>`);
}
