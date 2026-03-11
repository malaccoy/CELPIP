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

    const { plan, promoCode } = await request.json();
    const priceMap: Record<string, string> = {
      weekly: PRICES.weekly,
      monthly: PRICES.monthly,
      quarterly: PRICES.quarterly,
      annual: PRICES.annual,
    };
    const priceId = priceMap[plan];

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
    
    // If promoCode provided, look up the promotion code in Stripe
    let discounts: { promotion_code: string }[] | undefined;
    if (promoCode && plan !== 'annual') {
      try {
        const promoCodes = await stripe.promotionCodes.list({ code: promoCode, active: true, limit: 1 });
        if (promoCodes.data.length > 0) {
          discounts = [{ promotion_code: promoCodes.data[0].id }];
        }
      } catch (e) {
        console.error('Promo code lookup failed:', e);
      }
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard?upgraded=true`,
      cancel_url: `${origin}/pricing`,
      subscription_data: {
        // trial removed — free tier (3/day) serves as trial
        metadata: { supabaseUserId: user.id }
      },
      // Apply promo automatically if found, otherwise allow manual entry
      ...(discounts ? { discounts } : { allow_promotion_codes: plan !== 'annual' }),
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
