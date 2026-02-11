import { NextResponse } from 'next/server';
import { getUserPlan } from '@/lib/plan';

export async function GET() {
  try {
    const planCheck = await getUserPlan();

    if (!planCheck.authenticated) {
      return NextResponse.json(
        { error: 'Not authenticated', code: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      plan: planCheck.plan,
      isPro: planCheck.isPro,
    });
  } catch (error) {
    console.error('Plan check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
