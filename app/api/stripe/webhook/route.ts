import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // For development/testing without webhook secret
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCanceled(subscription);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Payment failed for customer:', invoice.customer);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const supabaseUserId = session.metadata?.supabaseUserId 
    || (session.subscription 
      ? (await stripe.subscriptions.retrieve(session.subscription as string)).metadata?.supabaseUserId 
      : null);

  if (!supabaseUserId) {
    console.error('No supabaseUserId in checkout session');
    return;
  }

  const subscriptionId = session.subscription as string;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  await prisma.userPlan.upsert({
    where: { userId: supabaseUserId },
    create: {
      userId: supabaseUserId,
      plan: 'pro',
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: subscriptionId,
      expiresAt: new Date(subscription.items.data[0].current_period_end ?? Date.now()),
    },
    update: {
      plan: 'pro',
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: subscriptionId,
      expiresAt: new Date(subscription.items.data[0].current_period_end ?? Date.now()),
    }
  });

  console.log(`✅ User ${supabaseUserId} upgraded to Pro`);
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userPlan = await prisma.userPlan.findFirst({
    where: { stripeSubscriptionId: subscription.id }
  });

  if (!userPlan) return;

  const isActive = ['active', 'trialing'].includes(subscription.status);

  await prisma.userPlan.update({
    where: { id: userPlan.id },
    data: {
      plan: isActive ? 'pro' : 'free',
      expiresAt: new Date(subscription.items.data[0].current_period_end ?? Date.now()),
    }
  });

  console.log(`Subscription ${subscription.id} updated: ${subscription.status}`);
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const userPlan = await prisma.userPlan.findFirst({
    where: { stripeSubscriptionId: subscription.id }
  });

  if (!userPlan) return;

  // Keep pro until period end (already paid for)
  await prisma.userPlan.update({
    where: { id: userPlan.id },
    data: {
      // Don't immediately downgrade — expiresAt handles it
      expiresAt: new Date(subscription.items.data[0].current_period_end ?? Date.now()),
    }
  });

  console.log(`Subscription ${subscription.id} canceled — pro until ${userPlan.expiresAt}`);
}
