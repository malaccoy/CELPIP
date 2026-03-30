import { NextRequest, NextResponse } from 'next/server';
import { checkIpRateLimit } from '@/lib/ip-rate-limit';

const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_SiSKMetP_Lq8CUt7eWMo5zHavU9ZJLrp3';
const FROM = 'CELPIP AI Coach <noreply@celpipaicoach.com>';
const SITE = 'https://celpipaicoach.com';

export async function POST(req: NextRequest) {
  try {
    if (!checkIpRateLimit(req, 'welcome-email', 5)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const { email, name, userId } = await req.json();
    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 });

    const unsubLink = `${SITE}/api/unsubscribe?uid=${userId || ''}`;
    const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#333;">
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="color:#e53e3e;margin:0;">Welcome to CELPIP AI Coach! 🎉</h1>
      </div>
      
      <p style="font-size:16px;">Hey${name ? ' ' + name : ''}!</p>
      
      <p>You just unlocked <strong>10 FREE exercises every day</strong> across all 4 CELPIP skills:</p>
      
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:20px 0;">
        <div style="background:#fef2f2;border-radius:10px;padding:14px;text-align:center;">
          <div style="font-size:24px;">🗣️</div>
          <div style="font-weight:700;color:#e53e3e;">Speaking</div>
          <div style="font-size:12px;color:#666;">AI evaluates your voice</div>
        </div>
        <div style="background:#eff6ff;border-radius:10px;padding:14px;text-align:center;">
          <div style="font-size:24px;">✍️</div>
          <div style="font-weight:700;color:#2563eb;">Writing</div>
          <div style="font-size:12px;color:#666;">Grammar & structure feedback</div>
        </div>
        <div style="background:#f0fdf4;border-radius:10px;padding:14px;text-align:center;">
          <div style="font-size:24px;">👂</div>
          <div style="font-weight:700;color:#16a34a;">Listening</div>
          <div style="font-size:12px;color:#666;">Real conversations</div>
        </div>
        <div style="background:#faf5ff;border-radius:10px;padding:14px;text-align:center;">
          <div style="font-size:24px;">📖</div>
          <div style="font-weight:700;color:#9333ea;">Reading</div>
          <div style="font-size:12px;color:#666;">Exact CELPIP format</div>
        </div>
      </div>

      <p><strong>💡 Pro tip:</strong> Start with the skill you feel weakest in. The AI will give you instant feedback so you know exactly what to improve.</p>

      <p style="text-align:center;margin:32px 0;">
        <a href="${SITE}/dashboard" style="background:#e53e3e;color:#fff;padding:16px 40px;border-radius:12px;text-decoration:none;font-weight:700;font-size:17px;display:inline-block;">
          Start Practicing Now →
        </a>
      </p>

      <div style="background:#f8f8f8;border-radius:10px;padding:16px;margin:24px 0;">
        <p style="margin:4px 0;font-weight:700;">🎯 Your daily free access includes:</p>
        <p style="margin:6px 0;">✅ 10 Duolingo-style drill exercises</p>
        <p style="margin:6px 0;">✅ 3 full AI practice sessions</p>
        <p style="margin:6px 0;">✅ Instant scores & detailed feedback</p>
        <p style="margin:6px 0;">✅ Progress tracking</p>
      </div>

      <p style="color:#666;font-size:14px;">Questions? Reply to this email or contact us at <a href="${SITE}/support">support</a>.</p>
      
      <p style="color:#999;font-size:12px;margin-top:40px;border-top:1px solid #eee;padding-top:16px;">
        You're receiving this because you signed up at CELPIP AI Coach.<br>
        <a href="${unsubLink}" style="color:#999;">Unsubscribe</a>
      </p>
    </div>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM,
        to: [email],
        subject: 'Welcome to CELPIP AI Coach! Your 10 free daily exercises are ready 🎯',
        html,
      }),
    });

    const data = await res.json();
    if (!res.ok) return NextResponse.json({ error: data }, { status: 500 });
    return NextResponse.json({ ok: true, id: data.id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
