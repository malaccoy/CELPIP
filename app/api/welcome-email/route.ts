import { NextResponse } from 'next/server';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const displayName = name || email.split('@')[0];

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'CELPIP AI Coach <noreply@celpipaicoach.com>',
        to: email,
        subject: 'Welcome to CELPIP AI Coach! 🎯 Your journey to CLB 9+ starts now',
        html: `
          <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1b1f2a; color: #e0e0e0; padding: 40px 30px; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="font-family: 'Space Grotesk', Arial, sans-serif; color: #ffffff; font-size: 28px; margin: 0;">Welcome to CELPIP AI Coach! 🎯</h1>
            </div>
            <p style="font-size: 16px; line-height: 1.6;">Hey ${displayName},</p>
            <p style="font-size: 16px; line-height: 1.6;">You just took the first step toward crushing your CELPIP exam. Here's what you can do <strong>right now</strong>:</p>
            <div style="background: #1a1f2e; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <p style="margin: 8px 0;">✅ <strong>Take the Free Assessment</strong> — Get your estimated CLB level in 10 minutes</p>
              <p style="margin: 8px 0;">📚 <strong>Study Technique Guides</strong> — Expert strategies for all 4 sections</p>
              <p style="margin: 8px 0;">🎧 <strong>Practice Listening</strong> — Real CELPIP-style audio exercises</p>
              <p style="margin: 8px 0;">✍️ <strong>Practice Writing</strong> — Templates + self-evaluation tools</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://celpipaicoach.com/dashboard" style="display: inline-block; background: #ff3b3b; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Start Practicing Now →</a>
            </div>
            <p style="font-size: 14px; color: #888; margin-top: 30px;">Questions? Just reply to this email.<br>— CELPIP AI Coach Team</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      console.error('Resend failed:', await res.text());
      return NextResponse.json({ success: true, emailSent: false });
    }

    return NextResponse.json({ success: true, emailSent: true });
  } catch (error) {
    console.error('Welcome email error:', error);
    return NextResponse.json({ success: true, emailSent: false });
  }
}
