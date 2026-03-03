import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Daily limits per endpoint (Pro users)
const DAILY_LIMITS: Record<string, number> = {
  'ai-practice': 30,
  'ai-feedback': 15,
  'speaking-feedback': 15,
  'sentence-feedback': 20,
  'mock-exam': 3,
  'evaluate-ai': 15,
};

// Free users get a taste (for assessment etc.)
const FREE_LIMITS: Record<string, number> = {
  'ai-practice': 2,
  'ai-feedback': 1,
  'speaking-feedback': 1,
  'sentence-feedback': 2,
  'mock-exam': 0,
  'evaluate-ai': 2,
};

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Check if a user has exceeded their daily rate limit for an endpoint.
 * Returns { allowed: true, remaining } or { allowed: false, remaining: 0 }.
 * Silently increments the counter if allowed.
 */
export async function checkRateLimit(
  userId: string,
  endpoint: string,
  isPro: boolean
): Promise<{ allowed: boolean; remaining: number }> {
  const limits = isPro ? DAILY_LIMITS : FREE_LIMITS;
  const limit = limits[endpoint];

  // If no limit configured, allow (don't block unknown endpoints)
  if (limit === undefined) {
    return { allowed: true, remaining: 999 };
  }

  // Zero limit = blocked
  if (limit === 0) {
    return { allowed: false, remaining: 0 };
  }

  const date = getToday();

  try {
    const usage = await prisma.apiUsage.upsert({
      where: {
        userId_endpoint_date: { userId, endpoint, date },
      },
      create: { userId, endpoint, date, count: 1 },
      update: { count: { increment: 1 } },
    });

    // If we just went over, it's already incremented — check against limit
    if (usage.count > limit) {
      return { allowed: false, remaining: 0 };
    }

    return { allowed: true, remaining: limit - usage.count };
  } catch {
    // On DB error, allow (don't block users due to infra issues)
    return { allowed: true, remaining: 999 };
  }
}

/**
 * Generic rate limit error response (intentionally vague)
 */
export function rateLimitResponse() {
  return Response.json(
    { error: 'Please try again later.' },
    { status: 429 }
  );
}
