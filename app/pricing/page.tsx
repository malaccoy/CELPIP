'use client';

import { useState } from 'react';
import { Check, Sparkles, Zap, Crown, Shield, ArrowRight } from 'lucide-react';
import styles from '@/styles/Pricing.module.scss';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (plan: 'monthly' | 'annual') => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      
      if (data.error) {
        if (res.status === 401) {
          window.location.href = '/login?redirect=/pricing';
          return;
        }
        alert(data.error);
        return;
      }
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const freeFeatures = [
    '17 Reading passages',
    '16 Listening exercises with audio',
    'Writing editor with timer',
    'Speaking recording & self-evaluation',
    'Technique guides for all 4 sections',
    'Quiz per module with score tracking',
    'Progress dashboard',
  ];

  const proFeatures = [
    'Everything in Free, plus:',
    'Unlimited AI-generated exercises',
    'AI Writing Tutor (score + grammar + model answer)',
    'AI Speaking Coach (Whisper + detailed feedback)',
    'AI Mock Exams with CLB estimate',
    'Adaptive difficulty (auto-adjusts to your level)',
    'Weakness Report with AI recommendations',
    'AI Practice Generator (all 4 sections)',
    'Priority support',
  ];

  const monthlyPrice = 24.99;
  const annualPrice = 99;
  const annualMonthly = (annualPrice / 12).toFixed(2);
  const savings = Math.round(((monthlyPrice * 12 - annualPrice) / (monthlyPrice * 12)) * 100);

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.badge}>
          <Sparkles size={14} />
          <span>CELPIP AI Coach</span>
        </div>
        <h1 className={styles.title}>
          Invest in Your Future
        </h1>
        <p className={styles.subtitle}>
          The only CELPIP prep tool powered by AI that adapts to your level
        </p>
      </div>

      {/* Billing Toggle */}
      <div className={styles.toggle}>
        <button
          className={`${styles.toggleBtn} ${billingCycle === 'monthly' ? styles.active : ''}`}
          onClick={() => setBillingCycle('monthly')}
        >
          Monthly
        </button>
        <button
          className={`${styles.toggleBtn} ${billingCycle === 'annual' ? styles.active : ''}`}
          onClick={() => setBillingCycle('annual')}
        >
          Annual
          <span className={styles.saveBadge}>Save {savings}%</span>
        </button>
      </div>

      <div className={styles.plans}>
        {/* Free Plan */}
        <div className={styles.planCard}>
          <div className={styles.planHeader}>
            <div className={styles.planIcon}>
              <Shield size={24} />
            </div>
            <h2 className={styles.planName}>Free</h2>
            <p className={styles.planDesc}>Get started with static content</p>
          </div>
          
          <div className={styles.priceSection}>
            <span className={styles.price}>$0</span>
            <span className={styles.period}>/ forever</span>
          </div>

          <ul className={styles.features}>
            {freeFeatures.map((f, i) => (
              <li key={i}>
                <Check size={16} className={styles.checkIcon} />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <button className={styles.freeBtn} onClick={() => window.location.href = '/dashboard'}>
            Get Started
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Pro Plan */}
        <div className={`${styles.planCard} ${styles.proPlan}`}>
          <div className={styles.popularBadge}>
            <Crown size={14} />
            Most Popular
          </div>
          
          <div className={styles.planHeader}>
            <div className={`${styles.planIcon} ${styles.proIcon}`}>
              <Zap size={24} />
            </div>
            <h2 className={styles.planName}>Pro</h2>
            <p className={styles.planDesc}>AI-powered coaching for maximum results</p>
          </div>
          
          <div className={styles.priceSection}>
            {billingCycle === 'annual' ? (
              <>
                <span className={styles.price}>${annualMonthly}</span>
                <span className={styles.period}>/ month</span>
                <div className={styles.billedNote}>Billed ${annualPrice}/year</div>
              </>
            ) : (
              <>
                <span className={styles.price}>${monthlyPrice}</span>
                <span className={styles.period}>/ month</span>
              </>
            )}
          </div>

          <ul className={styles.features}>
            {proFeatures.map((f, i) => (
              <li key={i} className={i === 0 ? styles.highlight : ''}>
                {i === 0 ? <Sparkles size={16} className={styles.sparkleIcon} /> : <Check size={16} className={styles.checkIcon} />}
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <button 
            className={styles.proBtn} 
            onClick={() => handleCheckout(billingCycle)}
            disabled={loading}
          >
            {loading ? 'Redirecting...' : 'Upgrade to Pro'}
            {!loading && <Zap size={16} />}
          </button>
        </div>
      </div>

      <div className={styles.guarantee}>
        <Shield size={18} />
        <span>Secure payment via Stripe • Cancel anytime • Instant access</span>
      </div>
    </div>
  );
}
