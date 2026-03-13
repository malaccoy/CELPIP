import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getUserPlan } from '@/lib/plan';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' as any });

export async function POST(req: NextRequest) {
  try {
    const { userId } = await getUserPlan();
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Find Stripe customer by userId metadata or email
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({ where: { id: userId } });
    await prisma.$disconnect();

    if (!user?.email) {
      return NextResponse.json({ error: 'No email found' }, { status: 400 });
    }

    // Search for Stripe customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (!customers.data.length) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
    }

    const origin = req.headers.get('origin') || 'https://celpipaicoach.com';

    // Create billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customers.data[0].id,
      return_url: `${origin}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Portal error:', error.message);
    return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 });
  }
}
