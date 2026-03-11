import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Daily limits per endpoint (Pro users)
const DAILY_LIMITS: Record<string, number> = {
  'ai-practice': 20,
  'ai-feedback': 10,
  'speaking-feedback': 10,
  'sentence-feedback': 15,
  'mock-exam': 3,
  'evaluate-ai': 10,
};

// Free users get a taste (for assessment etc.)
const FREE_LIMITS: Record<string, number> = {
  'ai-practice': 5,
  'ai-feedback': 3,
  'speaking-feedback': 3,
  'sentence-feedback': 3,
  'mock-exam': 0,
  'evaluate-ai': 3,
};

// Per-minute burst limits (prevents rapid-fire spam)
const BURST_WINDOW_MS = 60_000;
const BURST_LIMITS: Record<string, number> = {
  'ai-practice': 3,
  'ai-feedback': 2,
  'speaking-feedback': 2,
  'sentence-feedback': 3,
  'mock-exam': 1,
  'evaluate-ai': 2,
};

// In-memory burst tracker (resets on restart, intentionally lightweight)
const burstTracker = new Map<string, number[]>();

function checkBurst(userId: string, endpoint: string): boolean {
  const key = `${userId}:${endpoint}`;
  const now = Date.now();
  const limit = BURST_LIMITS[endpoint] || 5;
  
  const timestamps = (burstTracker.get(key) || []).filter(t => now - t < BURST_WINDOW_MS);
  
  if (timestamps.length >= limit) {
    burstTracker.set(key, timestamps);
    return false; // blocked
  }
  
  timestamps.push(now);
  burstTracker.set(key, timestamps);
  return true; // allowed
}

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

  // Burst check (per-minute)
  if (!checkBurst(userId, endpoint)) {
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
