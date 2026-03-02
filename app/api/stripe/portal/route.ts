import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
    }

    const userPlan = await prisma.userPlan.findUnique({
      where: { userId: user.id }
    });

    if (!userPlan?.stripeCustomerId) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
    }

    const origin = request.headers.get('origin') || 'https://celpipaicoach.com';

    const session = await stripe.billingPortal.sessions.create({
      customer: userPlan.stripeCustomerId,
      return_url: `${origin}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Portal error:', error);
    return NextResponse.json({ error: 'Failed to open portal' }, { status: 500 });
  }
}
