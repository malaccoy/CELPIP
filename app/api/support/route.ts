import { NextRequest, NextResponse } from 'next/server';
import { checkIpRateLimit } from '@/lib/ip-rate-limit';
import { SupportTicketSchema, parseBody } from '@/lib/validations';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_SUPPORT_CHAT_ID || '886662847';

/** Strip HTML tags to prevent Telegram HTML injection */
function sanitizeHtml(str: string): string {
  return str.replace(/[<>&]/g, (c) =>
    c === '<' ? '&lt;' : c === '>' ? '&gt;' : '&amp;'
  );
}

async function sendTelegramNotification(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  if (!TELEGRAM_BOT_TOKEN) return;

  const text = [
    '🆘 <b>New Support Ticket</b>',
    '',
    `👤 <b>Name:</b> ${sanitizeHtml(data.name || 'Not provided')}`,
    `📧 <b>Email:</b> ${sanitizeHtml(data.email)}`,
    `📌 <b>Subject:</b> ${sanitizeHtml(data.subject)}`,
    '',
    `💬 <b>Message:</b>`,
    sanitizeHtml(data.message),
  ].join('\n');

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'HTML',
      }),
    });
  } catch (err) {
    console.error('Telegram notification failed:', err);
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!checkIpRateLimit(request, 'support', 3)) {
      return NextResponse.json({ error: 'Please try again later.' }, { status: 429 });
    }

    // Validate input with Zod schema
    const result = await parseBody(request, SupportTicketSchema);
    if (!result.success) return result.error as unknown as NextResponse;
    const { name, email, subject, message } = result.data;

    // Send Telegram notification
    await sendTelegramNotification({ name, email, subject, message });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Support ticket error:', error);
    return NextResponse.json(
      { error: 'Failed to submit. Please try again.' },
      { status: 500 }
    );
  }
}
