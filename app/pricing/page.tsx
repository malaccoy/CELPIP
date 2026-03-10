'use client';

import { useState, useEffect } from 'react';
import { Check, Sparkles, Zap, Crown, Shield, ArrowRight, Clock, Star, TrendingUp } from 'lucide-react';
import { analytics } from '@/lib/analytics';
import styles from '@/styles/Pricing.module.scss';

type Plan = 'weekly' | 'monthly' | 'quarterly' | 'annual';

const PLANS: {
  id: Plan;
  name: string;
  price: number;
  period: string;
  perMonth: number;
  badge?: string;
  badgeColor?: string;
  icon: typeof Clock;
}[] = [
  { id: 'weekly', name: '1 Week', price: 9.99, period: '/week', perMonth: 39.96, icon: Clock },
  { id: 'monthly', name: '1 Month', price: 29.99, period: '/month', perMonth: 29.99, icon: Star },
  { id: 'quarterly', name: '3 Months', price: 59.99, period: '/3 months', perMonth: 20.00, badge: 'Popular', badgeColor: '#60a5fa', icon: TrendingUp },
  { id: 'annual', name: '1 Year', price: 99.00, period: '/year', perMonth: 8.25, badge: 'Best Value', badgeColor: '#fbbf24', icon: Crown },
];

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>('quarterly');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    analytics.viewPricing();
  }, []);

  const handleCheckout = async (plan: Plan) => {
    setLoading(true);
    const p = PLANS.find(pp => pp.id === plan)!;
    analytics.beginCheckout(p.price, 'CAD');
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
    '180 Listening exercises with real audio',
    '78 Reading exercises',
    '240 Speaking prompts',
    '60 Writing prompts',
    'AI Writing Tutor (score + grammar + model answer)',
    'AI Speaking Coach (Whisper + detailed feedback)',
    'Mock Exams — Quick (~30 min) & Full (~3h)',
    'AI evaluation with CLB score estimate',
    'Adaptive difficulty (auto-adjusts to your level)',
    'AI Practice Generator (unlimited)',
    'Priority support',
  ];

  const bestPlan = PLANS.find(p => p.id === 'annual')!;
  const weeklyEquiv = bestPlan.price / 52;

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.badge}>
          <Sparkles size={14} />
          <span>CELPIP AI Coach</span>
        </div>
        <h1 className={styles.title}>
          Invest in Your CELPIP Success
        </h1>
        <p className={styles.subtitle}>
          AI-powered preparation that adapts to your level — from CA${weeklyEquiv.toFixed(2)}/week
        </p>
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
            Pro — Full AI Power
          </div>

          <div className={styles.planHeader}>
            <div className={`${styles.planIcon} ${styles.proIcon}`}>
              <Zap size={24} />
            </div>
            <h2 className={styles.planName}>Pro</h2>
            <p className={styles.planDesc}>Choose your plan — same features, flexible commitment</p>
          </div>

          {/* Plan selector cards */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
            marginBottom: 20,
          }}>
            {PLANS.map(plan => {
              const isSelected = selectedPlan === plan.id;
              const savings = plan.id !== 'weekly'
                ? Math.round((1 - plan.perMonth / PLANS[0].perMonth) * 100)
                : 0;
              const Icon = plan.icon;
              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  style={{
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.08))'
                      : 'rgba(255,255,255,0.03)',
                    border: isSelected
                      ? '2px solid rgba(99,102,241,0.6)'
                      : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 12,
                    padding: '14px 12px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {plan.badge && (
                    <div style={{
                      position: 'absolute', top: 0, right: 0,
                      background: plan.badgeColor, color: '#0f172a',
                      fontSize: 9, fontWeight: 700, padding: '2px 8px',
                      borderBottomLeftRadius: 8, textTransform: 'uppercase',
                    }}>
                      {plan.badge}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <Icon size={14} style={{ color: isSelected ? '#818cf8' : 'rgba(248,250,252,0.4)' }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: isSelected ? '#e0e7ff' : 'rgba(248,250,252,0.6)' }}>
                      {plan.name}
                    </span>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: isSelected ? '#fff' : 'rgba(248,250,252,0.8)' }}>
                    CA${plan.price.toFixed(2)}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(248,250,252,0.4)', marginTop: 2 }}>
                    {plan.id === 'weekly' ? `CA$${plan.perMonth.toFixed(2)}/mo` :
                     plan.id === 'monthly' ? `CA$${plan.perMonth.toFixed(2)}/mo` :
                     plan.id === 'quarterly' ? `CA$${plan.perMonth.toFixed(2)}/mo` :
                     `CA$${plan.perMonth.toFixed(2)}/mo`}
                    {savings > 0 && (
                      <span style={{ color: '#34d399', marginLeft: 4, fontWeight: 600 }}>
                        Save {savings}%
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
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
            onClick={() => handleCheckout(selectedPlan)}
            disabled={loading}
          >
            {loading ? 'Redirecting...' : `Get Pro — CA$${PLANS.find(p => p.id === selectedPlan)!.price.toFixed(2)}${PLANS.find(p => p.id === selectedPlan)!.period}`}
            {!loading && <Zap size={16} />}
          </button>
        </div>
      </div>

      {/* Comparison callout */}
      <div style={{
        maxWidth: 640, margin: '32px auto 0', textAlign: 'center',
        background: 'rgba(251,191,36,0.06)', borderRadius: 16, padding: '20px 24px',
        border: '1px solid rgba(251,191,36,0.15)',
      }}>
        <p style={{ fontSize: 14, color: 'rgba(248,250,252,0.7)', margin: 0, lineHeight: 1.6 }}>
          💡 <strong style={{ color: '#fbbf24' }}>Other CELPIP prep tools charge CA$49.99/month or CA$249.99/year.</strong>
          <br />We offer the same AI features at a fraction of the cost — because everyone deserves a fair shot.
        </p>
      </div>

      <div className={styles.guarantee}>
        <Shield size={18} />
        <span>Cancel anytime • Secure payment via Stripe • All prices in CAD</span>
      </div>
    </div>
  );
}
