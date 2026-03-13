import { PrismaClient } from '@prisma/client';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export type Plan = 'free' | 'pro';

export interface PlanCheck {
  authenticated: boolean;
  userId: string | null;
  plan: Plan;
  isPro: boolean;
}

/**
 * Check the current user's plan from a server-side API route.
 * Returns plan info or null if not authenticated.
 */
export async function getUserPlan(): Promise<PlanCheck> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return { authenticated: false, userId: null, plan: 'free', isPro: false };
  }

  const userPlan = await prisma.userPlan.findUnique({
    where: { userId: user.id },
  });

  // Auto-create local user if missing (Supabase Auth exists but local DB doesn't)
  const localUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!localUser) {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || user.user_metadata?.full_name || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }).catch(() => {}); // ignore if race condition
  }

  const plan: Plan = userPlan?.plan === 'pro' ? 'pro' : 'free';

  // Check expiration
  if (plan === 'pro' && userPlan?.expiresAt && userPlan.expiresAt < new Date()) {
    // Double-check with Stripe before denying access — expiresAt might be wrong
    if (userPlan.stripeSubscriptionId) {
      try {
        const { stripe } = await import('@/lib/stripe');
        const sub = await stripe.subscriptions.retrieve(userPlan.stripeSubscriptionId);
        if (['active', 'trialing'].includes(sub.status)) {
          // Subscription is actually active! Fix the expiresAt
          const itemEnd = (sub as any).items?.data?.[0]?.current_period_end;
          const newExpires = itemEnd && itemEnd > 1000000000
            ? new Date(itemEnd * 1000)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          await prisma.userPlan.update({
            where: { id: userPlan.id },
            data: { expiresAt: newExpires, plan: 'pro' }
          });
          console.log(`🔧 Auto-fixed expiresAt for user ${user.id}: ${newExpires.toISOString()}`);
          return { authenticated: true, userId: user.id, plan: 'pro', isPro: true };
        }
      } catch (e) {
        console.error('Stripe re-check failed:', e);
      }
    }
    return { authenticated: true, userId: user.id, plan: 'free', isPro: false };
  }

  return { authenticated: true, userId: user.id, plan, isPro: plan === 'pro' };
}

/**
 * Require Pro plan. Returns a 403 response if user is not Pro.
 * Use in API routes: const denied = await requirePro(); if (denied) return denied;
 */
export async function requirePro(): Promise<NextResponse | null> {
  const { authenticated, isPro } = await getUserPlan();

  if (!authenticated) {
    return NextResponse.json(
      { error: 'Authentication required', code: 'AUTH_REQUIRED' },
      { status: 401 }
    );
  }

  if (!isPro) {
    return NextResponse.json(
      { error: 'Pro plan required', code: 'PRO_REQUIRED' },
      { status: 403 }
    );
  }

  return null; // All good — user is Pro
}

/**
 * Require Pro + enforce silent rate limit.
 * Returns a Response if blocked, or null if allowed.
 */
export async function requireProWithLimit(endpoint: string): Promise<NextResponse | null> {
  const { authenticated, userId, isPro } = await getUserPlan();

  if (!authenticated || !userId) {
    return NextResponse.json(
      { error: 'Authentication required', code: 'AUTH_REQUIRED' },
      { status: 401 }
    );
  }

  if (!isPro) {
    return NextResponse.json(
      { error: 'Pro plan required', code: 'PRO_REQUIRED' },
      { status: 403 }
    );
  }

  const { checkRateLimit, rateLimitResponse } = await import('./rate-limit');
  const { allowed } = await checkRateLimit(userId, endpoint, isPro);
  if (!allowed) {
    return rateLimitResponse() as unknown as NextResponse;
  }

  return null;
}
