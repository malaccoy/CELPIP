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

  const plan: Plan = userPlan?.plan === 'pro' ? 'pro' : 'free';

  // Check expiration
  if (plan === 'pro' && userPlan?.expiresAt && userPlan.expiresAt < new Date()) {
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
