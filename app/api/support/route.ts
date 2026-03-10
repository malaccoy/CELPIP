import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_SUPPORT_CHAT_ID || '886662847';

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
    `👤 <b>Name:</b> ${data.name || 'Not provided'}`,
    `📧 <b>Email:</b> ${data.email}`,
    `📌 <b>Subject:</b> ${data.subject}`,
    '',
    `💬 <b>Message:</b>`,
    data.message,
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
    const { name, email, subject, message } = await request.json();

    if (!email || !subject || !message) {
      return NextResponse.json(
        { error: 'Email, subject and message are required.' },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: 'Message too long (max 5000 characters).' },
        { status: 400 }
      );
    }

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
