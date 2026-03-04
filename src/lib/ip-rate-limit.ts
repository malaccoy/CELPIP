import { NextRequest } from 'next/server';

// Simple IP-based rate limiter for public routes (in-memory)
// Resets on server restart — good enough for anti-spam
const ipCounts = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60 * 1000; // 1 minute window

/**
 * IP-based rate limit for public (unauthenticated) routes.
 * Returns true if allowed, false if over limit.
 */
export function checkIpRateLimit(
  request: NextRequest,
  endpoint: string,
  maxPerMinute: number
): boolean {
  const ip = request.headers.get('x-real-ip')
    || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || 'unknown';

  const key = `${ip}:${endpoint}`;
  const now = Date.now();
  const entry = ipCounts.get(key);

  if (!entry || now > entry.resetAt) {
    ipCounts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  entry.count++;
  if (entry.count > maxPerMinute) {
    return false;
  }

  return true;
}

// Cleanup stale entries every 5 min to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of ipCounts) {
    if (now > entry.resetAt) ipCounts.delete(key);
  }
}, 5 * 60 * 1000);
