import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();

/**
 * Get the correct expiration date from a Stripe subscription.
 * Stripe timestamps are in SECONDS (Unix epoch).
 * We check multiple locations because Stripe puts the value in different places
 * depending on the subscription state.
 * 
 * SAFETY: If we can't determine expiration, default to 30 days from now
 * so the customer NEVER loses access after paying.
 */
function getExpirationDate(subscription: Stripe.Subscription): Date {
  // Try all possible timestamp locations (all in seconds)
  const candidates: number[] = [];

  // 1. Item-level current_period_end (most reliable for active subscriptions)
  const itemEnd = (subscription as any).items?.data?.[0]?.current_period_end;
  if (itemEnd && typeof itemEnd === 'number' && itemEnd > 1000000000) {
    candidates.push(itemEnd);
  }

  // 2. Top-level current_period_end
  const subEnd = (subscription as any).current_period_end;
  if (subEnd && typeof subEnd === 'number' && subEnd > 1000000000) {
    candidates.push(subEnd);
  }

  // 3. Trial end (for trialing subscriptions)
  const trialEnd = (subscription as any).trial_end;
  if (trialEnd && typeof trialEnd === 'number' && trialEnd > 1000000000) {
    candidates.push(trialEnd);
  }

  if (candidates.length > 0) {
    // Use the LATEST date (most generous to customer)
    const maxTimestamp = Math.max(...candidates);
    const date = new Date(maxTimestamp * 1000);

    // Sanity check: date should be in the future and within 2 years
    const now = new Date();
    const twoYearsFromNow = new Date(now.getTime() + 2 * 365 * 24 * 60 * 60 * 1000);

    if (date > now && date < twoYearsFromNow) {
      return date;
    }

    // If date is in the past but within last 24h, it might be a race condition — give 30 days
    if (date > new Date(now.getTime() - 24 * 60 * 60 * 1000)) {
      console.warn(`⚠️ Subscription ${subscription.id}: expiration date just passed (${date.toISOString()}), granting 30 days`);
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    }
  }

  // FALLBACK: Give 30 days — NEVER deny a paying customer
  console.error(`🚨 Subscription ${subscription.id}: could not determine expiration, granting 30 days as safety net`);
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
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

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
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
    console.error('🚨 No supabaseUserId in checkout session:', session.id);
    return;
  }

  const subscriptionId = session.subscription as string;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const expiresAt = getExpirationDate(subscription);

  console.log(`📦 Checkout complete: user=${supabaseUserId}, sub=${subscriptionId}, expires=${expiresAt.toISOString()}`);

  await prisma.userPlan.upsert({
    where: { userId: supabaseUserId },
    create: {
      userId: supabaseUserId,
      plan: 'pro',
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: subscriptionId,
      expiresAt,
    },
    update: {
      plan: 'pro',
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: subscriptionId,
      expiresAt,
    }
  });

  console.log(`✅ User ${supabaseUserId} upgraded to Pro until ${expiresAt.toISOString()}`);

  // --- Referral reward: give referrer 7 extra days ---
  try {
    const pendingRefs = await prisma.$queryRawUnsafe<any[]>(
      `SELECT id, referrer_id FROM referrals WHERE referred_id = $1 AND status = 'registered' LIMIT 1`,
      supabaseUserId
    );
    if (pendingRefs.length > 0) {
      const ref = pendingRefs[0];
      // Mark referral as paid
      await prisma.$queryRawUnsafe(
        `UPDATE referrals SET status = 'paid', days_rewarded = 7, paid_at = NOW() WHERE id = $1`,
        ref.id
      );
      // Extend referrer's Pro by 7 days
      await prisma.$queryRawUnsafe(`
        UPDATE user_plans 
        SET "expiresAt" = GREATEST("expiresAt", NOW()) + INTERVAL '7 days',
            plan = 'pro'
        WHERE "userId" = $1
      `, ref.referrer_id);
      console.log(`🎁 Referral reward: +7 days for referrer ${ref.referrer_id} (referred ${supabaseUserId})`);

      // Notify referrer by email
      try {
        const referrerData = await prisma.$queryRawUnsafe<any[]>(
          `SELECT email, referral_code FROM users WHERE id = $1`, ref.referrer_id
        );
        if (referrerData[0]?.email) {
          const { Resend } = require('resend');
          const resend = new Resend(process.env.RESEND_API_KEY);
          const refCode = referrerData[0].referral_code || '';
          await resend.emails.send({
            from: 'CELPIP AI Coach <noreply@celpipaicoach.com>',
            to: referrerData[0].email,
            subject: '🎉 Your friend subscribed! +7 days Pro for you!',
            html: `
              <div style="font-family:Inter,sans-serif;max-width:500px;margin:0 auto;background:#0f0f2e;color:#fff;border-radius:16px;padding:32px">
                <h1 style="font-size:24px;text-align:center;margin:0 0 16px">🎉 Great News!</h1>
                <p style="font-size:16px;line-height:1.6;color:#cbd5e1">
                  Your friend just subscribed to <strong style="color:#a855f7">CELPIP AI Coach Pro</strong>!
                </p>
                <div style="background:linear-gradient(135deg,rgba(139,92,246,0.2),rgba(236,72,153,0.15));border:1px solid rgba(139,92,246,0.3);border-radius:12px;padding:20px;text-align:center;margin:20px 0">
                  <p style="font-size:32px;margin:0">+7 days</p>
                  <p style="color:#4ade80;font-size:14px;margin:4px 0 0">added to your Pro plan</p>
                </div>
                <p style="font-size:14px;color:#94a3b8;line-height:1.6">
                  Keep sharing your link to earn more free days:<br/>
                  <a href="https://celpipaicoach.com/ref/${refCode}" style="color:#a855f7">celpipaicoach.com/ref/${refCode}</a>
                </p>
                <p style="font-size:12px;color:#64748b;margin-top:24px;text-align:center">CELPIP AI Coach — AI-Powered CELPIP Preparation</p>
              </div>
            `,
          });
          console.log(`📧 Referral reward email sent to ${referrerData[0].email}`);
        }
      } catch (emailErr) {
        console.error('Referral email error (non-fatal):', emailErr);
      }
    }
  } catch (refErr) {
    console.error('Referral reward error (non-fatal):', refErr);
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userPlan = await prisma.userPlan.findFirst({
    where: { stripeSubscriptionId: subscription.id }
  });

  if (!userPlan) {
    console.warn(`⚠️ Subscription ${subscription.id} updated but no user_plan found`);
    return;
  }

  const isActive = ['active', 'trialing'].includes(subscription.status);
  const expiresAt = getExpirationDate(subscription);

  console.log(`🔄 Subscription update: ${subscription.id}, status=${subscription.status}, expires=${expiresAt.toISOString()}`);

  await prisma.userPlan.update({
    where: { id: userPlan.id },
    data: {
      plan: isActive ? 'pro' : 'free',
      expiresAt,
    }
  });
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const userPlan = await prisma.userPlan.findFirst({
    where: { stripeSubscriptionId: subscription.id }
  });

  if (!userPlan) return;

  const expiresAt = getExpirationDate(subscription);

  console.log(`❌ Subscription canceled: ${subscription.id}, pro until ${expiresAt.toISOString()}`);

  // Keep pro until period end (already paid for)
  await prisma.userPlan.update({
    where: { id: userPlan.id },
    data: { expiresAt }
  });
}

/**
 * Handle successful invoice payment (renewal).
 * This is the MOST RELIABLE event for renewals — update expiresAt here too.
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as any).subscription as string;
  if (!subscriptionId) return;

  const userPlan = await prisma.userPlan.findFirst({
    where: { stripeSubscriptionId: subscriptionId }
  });

  if (!userPlan) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const expiresAt = getExpirationDate(subscription);

  console.log(`💰 Invoice paid: sub=${subscriptionId}, renewing until ${expiresAt.toISOString()}`);

  await prisma.userPlan.update({
    where: { id: userPlan.id },
    data: {
      plan: 'pro',
      expiresAt,
    }
  });
}
