'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, X, Sparkles, Zap, Crown, Shield, ArrowRight, Star, ChevronRight, Users, BookOpen, Clock, Award, TrendingUp } from 'lucide-react';
import { analytics } from '@/lib/analytics';
import styles from '@/styles/Pricing.module.scss';

type Plan = 'weekly' | 'monthly' | 'quarterly' | 'annual';

const PLANS = [
  { id: 'weekly' as Plan, name: '1 Week', price: 9.99, period: '/week', perMonth: 39.96, months: 0.25 },
  { id: 'monthly' as Plan, name: '1 Month', price: 24.99, period: '/month', perMonth: 24.99, months: 1 },
  { id: 'quarterly' as Plan, name: '3 Months', price: 49.99, period: '/3 months', perMonth: 16.66, months: 3, badge: 'POPULAR', savings: 33 },
  { id: 'annual' as Plan, name: '1 Year', price: 99.99, period: '/year', perMonth: 8.33, months: 12, badge: 'BEST VALUE', savings: 67 },
];

const FEATURES = [
  { feature: 'AI Practice Sessions', free: '3/day', pro: 'Unlimited' },
  { feature: 'Drill Exercises', free: '10/day', pro: 'Unlimited' },
  { feature: 'Advanced Difficulty', free: false, pro: true },
  { feature: 'Mock Exams', free: false, pro: true },
  { feature: 'AI Writing Feedback', free: 'Basic', pro: 'Detailed' },
  { feature: 'AI Speaking Feedback', free: 'Score', pro: 'Full analysis' },
  { feature: 'Study Guides', free: false, pro: true },
  { feature: 'CLB Score Estimate', free: false, pro: true },
  { feature: 'Priority Support', free: false, pro: true },
];

const TESTIMONIALS = [
  { name: 'Priya S.', loc: 'Toronto', text: 'I was stuck at CLB 7 for 3 tests. The AI feedback showed me exactly what was wrong with my writing. Got CLB 9 on my next try.', score: 'CLB 7→9', initials: 'PS', color: '#6366f1' },
  { name: 'Marco L.', loc: 'Vancouver', text: 'Saved me from paying $80/hour for a tutor. The speaking coach caught issues I didn\'t know I had.', score: 'CLB 8→10', initials: 'ML', color: '#10b981' },
  { name: 'Ahmed K.', loc: 'Calgary', text: 'The mock exam estimate was spot-on. I knew I was ready before spending $300 on the real test.', score: 'CLB 9', initials: 'AK', color: '#f59e0b' },
];

function PricingPageInner() {
  const searchParams = useSearchParams();
  const urlPromoCode = searchParams.get('promoCode');
  const [selected, setSelected] = useState<Plan>('monthly');
  const [loading, setLoading] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const proBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { analytics.viewPricing(); }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0 }
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
        body: JSON.stringify({ plan, ...(urlPromoCode ? { promoCode: urlPromoCode } : {}) }),
      });
      const data = await res.json();
      if (data.error) {
        if (res.status === 401) { window.location.href = '/login?redirect=/pricing'; return; }
        alert(data.error); return;
      }
      if (data.url) window.location.href = data.url;
    } catch { alert('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  const plan = PLANS.find(p => p.id === selected)!;

  return (
    <div className={styles.page}>
      {/* Ambient background */}
      <div className={styles.ambientOrb1} />
      <div className={styles.ambientOrb2} />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <Sparkles size={12} /> CELPIP AI Coach Pro
        </div>
        <h1 className={styles.heroTitle}>Get the score you need</h1>
        <p className={styles.heroSub}>
          AI-powered CELPIP prep trusted by 200+ learners across Canada
        </p>
      </section>

      {/* Social Proof — moved above pricing for trust */}
      <section className={styles.proof}>
        <div className={styles.proofStats}>
          <div className={styles.proofStat}>
            <div className={styles.proofIcon}><Users size={14} /></div>
            <span className={styles.proofNum}>200+</span>
            <span className={styles.proofLabel}>Active learners</span>
          </div>
          <div className={styles.proofDivider} />
          <div className={styles.proofStat}>
            <div className={styles.proofIcon}><BookOpen size={14} /></div>
            <span className={styles.proofNum}>540+</span>
            <span className={styles.proofLabel}>Drill exercises</span>
          </div>
          <div className={styles.proofDivider} />
          <div className={styles.proofStat}>
            <div className={styles.proofIcon}><Star size={14} /></div>
            <span className={styles.proofNum}>4.8★</span>
            <span className={styles.proofLabel}>User rating</span>
          </div>
        </div>
      </section>

      {/* Plan Toggle */}
      <section className={styles.plans}>
        <div className={styles.planToggle}>
          {PLANS.map(p => (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className={`${styles.planTab} ${selected === p.id ? styles.planTabActive : ''}`}
            >
              <span className={styles.planTabName}>{p.name}</span>
              {p.savings && <span className={styles.planSave}>-{p.savings}%</span>}
            </button>
          ))}
        </div>

        {/* Selected Plan Card */}
        <div className={styles.planCard}>
          {plan.badge && <div className={styles.planCardBadge}>{plan.badge}</div>}

          <div className={styles.planPrice}>
            <span className={styles.planCurrency}>CA$</span>
            <span className={styles.planAmount}>{plan.price.toFixed(2).split('.')[0]}</span>
            <span className={styles.planCents}>.{plan.price.toFixed(2).split('.')[1]}</span>
            <span className={styles.planPeriod}>{plan.period}</span>
          </div>

          {plan.id !== 'monthly' && (
            <p className={styles.planPerMonth}>
              {plan.id === 'weekly'
                ? <>Try it for a week — upgrade anytime</>
                : <>That&apos;s just <strong>CA${plan.perMonth.toFixed(2)}/month</strong></>}
            </p>
          )}

          <div className={styles.planFeatures}>
            {['Unlimited AI practice', 'All 4 CELPIP skills', 'Mock exams with scoring', 'Advanced difficulty levels', 'Detailed AI feedback'].map(f => (
              <div key={f} className={styles.planFeature}>
                <div className={styles.planFeatureCheckBox}>
                  <Check size={12} />
                </div>
                <span>{f}</span>
              </div>
            ))}
          </div>

          <button
            ref={proBtnRef}
            className={styles.ctaBtn}
            onClick={() => handleCheckout(selected)}
            disabled={loading}
          >
            {loading ? 'Redirecting to checkout...' : 'Start Pro Now'}
            {!loading && <Zap size={18} />}
          </button>

          <p className={styles.guarantee}>
            <Shield size={13} /> Cancel anytime · Secure Stripe checkout · All prices in CAD
          </p>
        </div>
      </section>

      {/* Value Comparison */}
      <section className={styles.valueSection}>
        <div className={styles.valueCard}>
          <div className={styles.valueRow}>
            <span className={styles.valueLabel}>CELPIP test retake</span>
            <span className={styles.valuePrice}>CA$300+</span>
          </div>
          <div className={styles.valueRow}>
            <span className={styles.valueLabel}>Private tutor (1 month)</span>
            <span className={styles.valuePrice}>CA$640+</span>
          </div>
          <div className={styles.valueDivider} />
          <div className={`${styles.valueRow} ${styles.valueRowHighlight}`}>
            <span className={styles.valueLabel}>CELPIP AI Coach Pro</span>
            <span className={styles.valuePriceGreen}>CA${plan.price.toFixed(2)}{plan.period}</span>
          </div>
        </div>
      </section>

      {/* Free vs Pro */}
      <section className={styles.comparison}>
        <h2 className={styles.sectionTitle}>Free vs Pro</h2>
        <div className={styles.compTable}>
          <div className={`${styles.compRow} ${styles.compHead}`}>
            <div />
            <div className={styles.compColFree}>Free</div>
            <div className={styles.compColPro}><Crown size={12} /> Pro</div>
          </div>
          {FEATURES.map((f, i) => (
            <div key={i} className={styles.compRow}>
              <div className={styles.compLabel}>{f.feature}</div>
              <div className={styles.compColFree}>
                {typeof f.free === 'boolean' ? (
                  f.free ? <Check size={15} className={styles.checkGreen} /> : <X size={15} className={styles.xGray} />
                ) : <span className={styles.compLimit}>{f.free}</span>}
              </div>
              <div className={styles.compColPro}>
                {typeof f.pro === 'boolean' ? (
                  f.pro ? <Check size={15} className={styles.checkPurple} /> : <X size={15} className={styles.xGray} />
                ) : <span className={styles.compUnlimited}>{f.pro}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonials}>
        <h2 className={styles.sectionTitle}>Real Results</h2>
        <div className={styles.testGrid}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className={styles.testCard}>
              <div className={styles.testHeader}>
                <div className={styles.testStars}>
                  {[...Array(5)].map((_, j) => <Star key={j} size={13} fill="#fbbf24" color="#fbbf24" />)}
                </div>
                <span className={styles.testScore}>{t.score}</span>
              </div>
              <p className={styles.testText}>&ldquo;{t.text}&rdquo;</p>
              <div className={styles.testAuthor}>
                <div className={styles.testAvatar} style={{ background: t.color }}>{t.initials}</div>
                <div className={styles.testInfo}>
                  <span className={styles.testName}>{t.name}</span>
                  <span className={styles.testLoc}>{t.loc}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Competitor Note */}
      <div className={styles.competitor}>
        <div className={styles.competitorIcon}><TrendingUp size={16} /></div>
        <p><strong>Other CELPIP prep tools charge CA$49.99/month.</strong> We offer the same AI features at a fraction of the cost.</p>
      </div>

      {/* Sticky CTA */}
      <div className={`${styles.sticky} ${showSticky ? styles.stickyShow : ''}`}>
        <div className={styles.stickyLeft}>
          <span className={styles.stickyPrice}>CA${plan.price.toFixed(2)}</span>
          <span className={styles.stickyPer}>{plan.period}</span>
        </div>
        <button className={styles.stickyBtn} onClick={() => handleCheckout(selected)} disabled={loading}>
          {loading ? '...' : 'Get Pro'} <Zap size={14} />
        </button>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return <Suspense><PricingPageInner /></Suspense>;
}
