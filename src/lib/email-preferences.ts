import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

interface EmailPref {
  token: string;
  unsubscribed: boolean;
}

// Get or create unsubscribe token for an email
export async function getUnsubscribeToken(email: string, userId?: string): Promise<string> {
  const existing = await prisma.$queryRawUnsafe<EmailPref[]>(
    `SELECT token FROM email_preferences WHERE email = $1`,
    email
  );

  if (existing.length > 0) {
    return existing[0].token;
  }

  const token = crypto.randomBytes(32).toString('hex');
  await prisma.$queryRawUnsafe(
    `INSERT INTO email_preferences (email, user_id, token) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING`,
    email, userId || null, token
  );

  return token;
}

// Check if email is unsubscribed
export async function isUnsubscribed(email: string): Promise<boolean> {
  const result = await prisma.$queryRawUnsafe<EmailPref[]>(
    `SELECT unsubscribed FROM email_preferences WHERE email = $1`,
    email
  );

  return result.length > 0 && result[0].unsubscribed === true;
}

// Generate unsubscribe URL
export function getUnsubscribeUrl(token: string): string {
  return `https://celpipaicoach.com/api/unsubscribe?token=${token}`;
}

// Generate unsubscribe HTML footer for emails
export function getUnsubscribeFooter(token: string): string {
  const url = getUnsubscribeUrl(token);
  return `
    <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
        You're receiving this because you signed up at celpipaicoach.com
      </p>
      <p style="color: #9ca3af; font-size: 12px; margin: 4px 0 0;">
        <a href="${url}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe from emails</a>
        &nbsp;·&nbsp;
        <a href="https://celpipaicoach.com/unsubscribe" style="color: #9ca3af; text-decoration: underline;">Email preferences</a>
      </p>
    </div>
  `;
}
