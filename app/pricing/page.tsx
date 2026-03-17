'use client';

import { useState, useEffect, useRef } from 'react';
import { Check, X, Sparkles, Zap, Crown, Shield, ArrowRight, Clock, Star, TrendingUp, Quote } from 'lucide-react';
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
  { id: 'annual', name: '1 Year', price: 149.99, period: '/year', perMonth: 12.50, badge: 'Best Value', badgeColor: '#fbbf24', icon: Crown },
];

const COMPARISON_FEATURES = [
  { feature: 'Practice Exercises', free: '3/day', pro: 'Unlimited', highlight: true },
  { feature: 'Listening (with audio)', free: true, pro: true },
  { feature: 'Reading Passages', free: true, pro: true },
  { feature: 'Writing Prompts', free: true, pro: true },
  { feature: 'Speaking Prompts', free: true, pro: true },
  { feature: 'AI Writing Feedback', free: 'Basic', pro: 'Full AI' },
  { feature: 'AI Speaking Feedback', free: 'Score only', pro: 'Full details' },
  { feature: 'Technique Guides', free: false, pro: true },
  { feature: 'Advanced Difficulty', free: false, pro: true },
  { feature: 'Mock Exams (Quick + Full)', free: false, pro: true },
  { feature: 'CLB Score Estimate', free: false, pro: true },
  { feature: 'Leaderboard & Rankings', free: true, pro: true },
  { feature: 'CRS Score Calculator', free: true, pro: true },
  { feature: 'Priority Support', free: false, pro: true },
];

const TESTIMONIALS = [
  {
    name: 'Priya S.',
    location: 'Toronto',
    text: 'I was stuck at CLB 7 for 3 tests. The AI feedback showed me exactly what was wrong with my writing structure. Got CLB 9 on my next try.',
    score: 'CLB 7 → 9',
    initials: 'PS',
    color: '#6366f1',
  },
  {
    name: 'Marco L.',
    location: 'Vancouver',
    text: 'Saved me from paying $80/hour for a tutor. The speaking coach caught pronunciation issues I didn\'t even know I had.',
    score: 'CLB 8 → 10',
    initials: 'ML',
    color: '#10b981',
  },
  {
    name: 'Ahmed K.',
    location: 'Calgary',
    text: 'The mock exam CLB estimate was spot-on. I knew I was ready before spending $300 on the real test.',
    score: 'CLB 9',
    initials: 'AK',
    color: '#f59e0b',
  },
];

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>('quarterly');
  const [loading, setLoading] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const proBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    analytics.viewPricing();
  }, []);

  // Sticky CTA: show when Pro button scrolls out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0, rootMargin: '0px' }
    );
    if (proBtnRef.current) observer.observe(proBtnRef.current);
    return () => observer.disconnect();
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

  const selectedPlanData = PLANS.find(p => p.id === selectedPlan)!;

  return (
    <div className={styles.container}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.badge}>
          <Sparkles size={14} />
          <span>CELPIP AI Coach</span>
        </div>
        <h1 className={styles.title}>
          Invest in Your CELPIP Success
        </h1>
        <p className={styles.subtitle}>
          AI-powered preparation that adapts to your level — from CA${(PLANS[3].price / 52).toFixed(2)}/week
        </p>
      </div>

      {/* Promo Banner */}
      <div className={styles.promoBanner}>
        <div className={styles.promoDiscount}>30% OFF</div>
        <div className={styles.promoText}>
          <strong>Launch Special!</strong> Use code <span className={styles.promoCode}>WELCOME30</span> at checkout
        </div>
        <div className={styles.promoExpiry}>Ends March 16</div>
      </div>

      {/* ─── Free vs Pro Comparison Table ─── */}
      <section className={styles.comparisonSection}>
        <h2 className={styles.sectionTitle}>Free vs Pro — What You Get</h2>
        <div className={styles.comparisonTable}>
          <div className={`${styles.compRow} ${styles.compHeader}`}>
            <div className={styles.compFeature}>Feature</div>
            <div className={styles.compFree}>
              <Shield size={16} />
              Free
            </div>
            <div className={styles.compPro}>
              <Crown size={16} />
              Pro
            </div>
          </div>
          {COMPARISON_FEATURES.map((row, i) => (
            <div key={i} className={`${styles.compRow} ${row.highlight ? styles.compHighlightRow : ''}`}>
              <div className={styles.compFeature}>{row.feature}</div>
              <div className={styles.compFree}>
                {typeof row.free === 'boolean' ? (
                  row.free ? <Check size={18} className={styles.compCheck} /> : <X size={18} className={styles.compX} />
                ) : (
                  <span className={styles.compText}>{row.free}</span>
                )}
              </div>
              <div className={styles.compPro}>
                {typeof row.pro === 'boolean' ? (
                  row.pro ? <Check size={18} className={styles.compCheck} /> : <X size={18} className={styles.compX} />
                ) : (
                  <span className={styles.compTextPro}>{row.pro}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Plan Selector + Checkout ─── */}
      <section className={styles.planSection}>
        <h2 className={styles.sectionTitle}>Choose Your Plan</h2>
        <p className={styles.sectionSub}>All plans include every Pro feature. Pick what fits your timeline.</p>

        <div className={styles.planGrid}>
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
                className={`${styles.planOption} ${isSelected ? styles.planOptionSelected : ''}`}
              >
                {plan.badge && (
                  <div className={styles.planBadge} style={{ background: plan.badgeColor }}>
                    {plan.badge}
                  </div>
                )}
                <div className={styles.planOptionHeader}>
                  <Icon size={16} className={styles.planOptionIcon} />
                  <span className={styles.planOptionName}>{plan.name}</span>
                </div>
                <div className={styles.planOptionPrice}>
                  CA${plan.price.toFixed(2)}
                </div>
                <div className={styles.planOptionSub}>
                  {plan.id === 'weekly' ? `≈ CA$${plan.perMonth.toFixed(2)}/mo` :
                   `CA$${plan.perMonth.toFixed(2)}/mo`}
                  {savings > 0 && (
                    <span className={styles.planSavings}>Save {savings}%</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <button
          ref={proBtnRef}
          className={styles.proBtn}
          onClick={() => handleCheckout(selectedPlan)}
          disabled={loading}
        >
          {loading ? 'Redirecting...' : `Get Pro — CA$${selectedPlanData.price.toFixed(2)}${selectedPlanData.period}`}
          {!loading && <Zap size={18} />}
        </button>

        <div className={styles.guarantee}>
          <Shield size={16} />
          <span>Cancel anytime • Secure payment via Stripe • All prices in CAD</span>
        </div>
      </section>

      {/* ─── Testimonials with Stars ─── */}
      <section className={styles.testimonialsSection}>
        <h2 className={styles.sectionTitle}>Real Results From Real Students</h2>
        <div className={styles.testimonialsGrid}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className={styles.testimonialCard}>
              <div className={styles.testimonialStars}>
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={16} fill="#fbbf24" color="#fbbf24" />
                ))}
              </div>
              <p className={styles.testimonialText}>&ldquo;{t.text}&rdquo;</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar} style={{ background: t.color }}>
                  {t.initials}
                </div>
                <div className={styles.testimonialInfo}>
                  <span className={styles.testimonialName}>{t.name}</span>
                  <span className={styles.testimonialLocation}>{t.location}</span>
                </div>
                <span className={styles.testimonialScore}>{t.score}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Competitor Comparison ─── */}
      <div className={styles.competitorCallout}>
        <p>
          💡 <strong>Other CELPIP prep tools charge CA$49.99/month or CA$249.99/year.</strong>
          <br />We offer the same AI features at a fraction of the cost — because everyone deserves a fair shot.
        </p>
      </div>

      {/* ─── Sticky CTA (Mobile) ─── */}
      <div className={`${styles.stickyCta} ${showSticky ? styles.stickyCtaVisible : ''}`}>
        <div className={styles.stickyInfo}>
          <span className={styles.stickyPrice}>CA${selectedPlanData.price.toFixed(2)}</span>
          <span className={styles.stickyPeriod}>{selectedPlanData.period}</span>
        </div>
        <button
          className={styles.stickyBtn}
          onClick={() => handleCheckout(selectedPlan)}
          disabled={loading}
        >
          {loading ? '...' : 'Get Pro'}
          <Zap size={16} />
        </button>
      </div>
    </div>
  );
}
