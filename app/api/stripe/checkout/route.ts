import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRICES } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Please log in first' }, { status: 401 });
    }

    const { plan } = await request.json();
    const priceId = plan === 'annual' ? PRICES.annual : PRICES.monthly;

    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Check if user already has a Stripe customer ID
    const existingPlan = await prisma.userPlan.findUnique({
      where: { userId: user.id }
    });

    // Create or retrieve Stripe customer
    let customerId: string;
    
    if (existingPlan?.stripeCustomerId) {
      customerId = existingPlan.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabaseUserId: user.id }
      });
      customerId = customer.id;
      
      // Save customer ID
      await prisma.userPlan.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          plan: 'free',
          stripeCustomerId: customerId,
        },
        update: {
          stripeCustomerId: customerId,
        }
      });
    }

    // Create Checkout Session
    const origin = request.headers.get('origin') || 'https://celpipaicoach.com';
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard?upgraded=true`,
      cancel_url: `${origin}/pricing`,
      subscription_data: {
        trial_period_days: 3,
        metadata: { supabaseUserId: user.id }
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
