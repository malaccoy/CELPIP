'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, X, Sparkles, Zap, Crown, Shield, Star, Users, BookOpen, TrendingUp, Flame, Lock, ChevronRight } from 'lucide-react';
import { analytics } from '@/lib/analytics';
import styles from '@/styles/Pricing.module.scss';

type Plan = 'weekly' | 'monthly' | 'quarterly' | 'annual';

const PLANS = [
  { id: 'weekly' as Plan, name: '1 Week', price: 9.99, period: '/week', perMonth: 39.96, months: 0.25 },
  { id: 'monthly' as Plan, name: '1 Month', price: 29.99, period: '/month', perMonth: 29.99, months: 1, savings: 25 },
  { id: 'quarterly' as Plan, name: '3 Months', price: 69.99, period: '/3 months', perMonth: 23.33, months: 3, badge: 'MOST POPULAR', savings: 42 },
  { id: 'annual' as Plan, name: '1 Year', price: 149.99, period: '/year', perMonth: 12.50, months: 12, badge: 'BEST VALUE', savings: 69 },
];

const FEATURES = [
  { feature: 'AI Practice Sessions', free: '3/day', pro: 'Unlimited' },
  { feature: 'Drill Exercises', free: '10/day', pro: 'Unlimited' },
  { feature: 'Advanced Difficulty', free: false, pro: true },
  { feature: 'Mock Exams', free: false, pro: true },
  { feature: 'AI Writing Feedback', free: 'Basic', pro: 'Detailed' },
  { feature: 'AI Speaking Feedback', free: 'Score only', pro: 'Full analysis' },
  { feature: 'Study Guides', free: false, pro: true },
  { feature: 'CLB Score Estimate', free: false, pro: true },
  { feature: 'Battle Mode PvP', free: true, pro: true },
  { feature: 'Priority Support', free: false, pro: true },
];

const TESTIMONIALS = [
  { name: 'Priya S.', loc: 'Toronto', text: 'I was stuck at CLB 7 for 3 tests. The AI feedback showed me exactly what was wrong with my writing. Got CLB 9 on my next try!', score: 'CLB 7 → 9', initials: 'PS', color: '#a855f7' },
  { name: 'Marco L.', loc: 'Vancouver', text: 'Saved me from paying $80/hour for a tutor. The speaking coach caught issues I didn\'t know I had.', score: 'CLB 8 → 10', initials: 'ML', color: '#10b981' },
  { name: 'Ahmed K.', loc: 'Calgary', text: 'The mock exam estimate was spot-on. I knew I was ready before spending $300 on the real test.', score: 'CLB 9', initials: 'AK', color: '#f59e0b' },
];

function PricingPageInner() {
  const searchParams = useSearchParams();
  const urlPromoCode = searchParams.get('promoCode');
  const [selected, setSelected] = useState<Plan>('quarterly');
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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a0a1a 0%, #0f0f2e 30%, #1a0a2e 60%, #0a0a1a 100%)',
      color: '#fff',
      fontFamily: "'Inter', -apple-system, sans-serif",
      paddingBottom: '100px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient glow effects */}
      <div style={{ position: 'absolute', top: '-200px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '400px', right: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
      {/* Desktop wrapper */}
      <div style={{ maxWidth: '640px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '48px 20px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.2))',
          border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: '20px', padding: '6px 14px', fontSize: '12px',
          color: '#c4b5fd', fontWeight: 600, marginBottom: '16px',
          backdropFilter: 'blur(10px)',
        }}>
          <Crown size={12} /> UNLOCK YOUR FULL POTENTIAL
        </div>
        <h1 style={{
          fontSize: '32px', fontWeight: 800, lineHeight: 1.1, margin: '0 0 12px',
          background: 'linear-gradient(135deg, #fff 30%, #c4b5fd 70%, #f0abfc 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Invest in Your<br />Canadian Dream
        </h1>
        <p style={{ fontSize: '15px', color: '#94a3b8', maxWidth: '480px', margin: '0 auto', lineHeight: 1.5 }}>
          Join 200+ learners who improved their CELPIP score with AI-powered practice
        </p>
      </section>

      {/* Trust bar */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: '20px', padding: '12px 20px',
        margin: '0 20px 24px', borderRadius: '16px',
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
      }}>
        {[
          { icon: <Users size={14} />, num: '200+', label: 'LEARNERS' },
          { icon: <BookOpen size={14} />, num: '540+', label: 'EXERCISES' },
          { icon: <Star size={14} />, num: '4.8★', label: 'RATING' },
        ].map((s, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#e2e8f0' }}>{s.num}</span>
            <span style={{ fontSize: '9px', color: '#64748b', fontWeight: 700, letterSpacing: '0.5px' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Plan selector tabs */}
      <div style={{
        display: 'flex', gap: '6px', padding: '4px',
        margin: '0 16px 20px', borderRadius: '14px',
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
      }}>
        {PLANS.map(p => {
          const active = selected === p.id;
          return (
            <button key={p.id} onClick={() => setSelected(p.id)} style={{
              flex: 1, padding: '10px 4px', borderRadius: '11px', border: 'none',
              background: active
                ? 'linear-gradient(135deg, #7c3aed, #a855f7)'
                : 'transparent',
              color: active ? '#fff' : '#94a3b8',
              fontSize: '12px', fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
              boxShadow: active ? '0 4px 15px rgba(139,92,246,0.4)' : 'none',
            }}>
              <span>{p.name}</span>
              {p.savings && <span style={{ fontSize: '10px', color: active ? '#c4f0c4' : '#4ade80', fontWeight: 800 }}>-{p.savings}%</span>}
            </button>
          );
        })}
      </div>

      {/* Main pricing card */}
      <div style={{
        margin: '0 16px 28px', borderRadius: '24px', padding: '28px 24px 24px',
        background: 'linear-gradient(180deg, rgba(139,92,246,0.08) 0%, rgba(30,20,60,0.8) 100%)',
        border: '1px solid rgba(139,92,246,0.25)',
        boxShadow: '0 0 60px rgba(139,92,246,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Badge */}
        {plan.badge && (
          <div style={{
            position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%)',
            background: plan.badge === 'BEST VALUE'
              ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
              : 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            padding: '4px 20px', borderRadius: '0 0 12px 12px',
            fontSize: '10px', fontWeight: 800, letterSpacing: '1px', color: '#fff',
          }}>
            {plan.badge}
          </div>
        )}

        {/* Price */}
        <div style={{ textAlign: 'center', marginTop: plan.badge ? '12px' : '0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '2px' }}>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#a78bfa', marginTop: '12px' }}>CA$</span>
            <span style={{
              fontSize: '64px', fontWeight: 900, lineHeight: 1,
              background: 'linear-gradient(180deg, #fff, #cbd5e1)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>{plan.price.toFixed(2).split('.')[0]}</span>
            <span style={{ fontSize: '24px', fontWeight: 700, color: '#94a3b8', marginTop: '12px' }}>.{plan.price.toFixed(2).split('.')[1]}</span>
          </div>
          <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>{plan.period}</span>
        </div>

        {/* Per month breakdown */}
        {plan.id !== 'weekly' && plan.id !== 'monthly' && (
          <p style={{ textAlign: 'center', fontSize: '14px', color: '#4ade80', fontWeight: 600, marginTop: '8px' }}>
            That&apos;s just CA${plan.perMonth.toFixed(2)}/month
          </p>
        )}
        {plan.id === 'weekly' && (
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#94a3b8', fontWeight: 500, marginTop: '8px' }}>
            Perfect to try before committing
          </p>
        )}

        {/* Features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
          {['Unlimited AI practice', 'All 4 CELPIP skills', 'Mock exams with scoring', 'Advanced difficulty levels', 'Detailed AI feedback'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '22px', height: '22px', borderRadius: '7px',
                background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(16,185,129,0.2))',
                border: '1px solid rgba(34,197,94,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Check size={12} style={{ color: '#4ade80' }} />
              </div>
              <span style={{ fontSize: '15px', fontWeight: 500, color: '#e2e8f0' }}>{f}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          ref={proBtnRef}
          onClick={() => handleCheckout(selected)}
          disabled={loading}
          style={{
            width: '100%', padding: '16px', border: 'none', borderRadius: '14px',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)',
            color: '#fff', fontSize: '17px', fontWeight: 800, cursor: 'pointer',
            marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: '0 4px 25px rgba(139,92,246,0.5), 0 0 0 1px rgba(255,255,255,0.1) inset',
            transition: 'all 0.3s ease', opacity: loading ? 0.7 : 1,
            letterSpacing: '0.3px',
          }}
        >
          {loading ? 'Redirecting...' : 'Start Pro Now'} {!loading && <Zap size={18} />}
        </button>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#64748b', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <Shield size={12} /> Cancel anytime · Secure Stripe checkout · All prices in CAD
        </p>
      </div>

      {/* Value comparison */}
      <div style={{
        margin: '0 16px 28px', borderRadius: '20px', padding: '20px',
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#94a3b8', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Compare the cost
        </h3>
        {[
          { label: 'CELPIP test retake', price: 'CA$300+', color: '#ef4444' },
          { label: 'Private tutor (1 month)', price: 'CA$640+', color: '#ef4444' },
          { label: 'Other prep tools', price: 'CA$49.99/mo', color: '#f59e0b' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: '14px', color: '#94a3b8' }}>{item.label}</span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: item.color, textDecoration: 'line-through', textDecorationColor: 'rgba(255,255,255,0.3)' }}>{item.price}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0 0' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#e2e8f0' }}>CELPIP AI Coach Pro</span>
          <span style={{
            fontSize: '16px', fontWeight: 800,
            background: 'linear-gradient(135deg, #4ade80, #22d3ee)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>CA${plan.price.toFixed(2)}{plan.period}</span>
        </div>
      </div>

      {/* Free vs Pro */}
      <div style={{ margin: '0 16px 28px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, textAlign: 'center', marginBottom: '16px', color: '#e2e8f0' }}>Free vs Pro</h2>
        <div style={{
          borderRadius: '20px', overflow: 'hidden',
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 65px 65px', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
            <div />
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textAlign: 'center' }}>Free</div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#a855f7', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
              <Crown size={10} /> Pro
            </div>
          </div>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1fr 65px 65px', padding: '10px 16px',
              borderBottom: i < FEATURES.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}>
              <div style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 500 }}>{f.feature}</div>
              <div style={{ textAlign: 'center' }}>
                {typeof f.free === 'boolean'
                  ? f.free ? <Check size={14} style={{ color: '#4ade80' }} /> : <X size={14} style={{ color: '#475569' }} />
                  : <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>{f.free}</span>
                }
              </div>
              <div style={{ textAlign: 'center' }}>
                {typeof f.pro === 'boolean'
                  ? f.pro ? <Check size={14} style={{ color: '#a855f7' }} /> : <X size={14} style={{ color: '#475569' }} />
                  : <span style={{ fontSize: '11px', color: '#a855f7', fontWeight: 700 }}>{f.pro}</span>
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ margin: '0 16px 28px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, textAlign: 'center', marginBottom: '16px', color: '#e2e8f0' }}>Real Results</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{
              borderRadius: '16px', padding: '18px',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[...Array(5)].map((_, j) => <Star key={j} size={12} fill="#fbbf24" color="#fbbf24" />)}
                </div>
                <span style={{
                  fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '8px',
                  background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)',
                }}>{t.score}</span>
              </div>
              <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 12px', fontStyle: 'italic' }}>
                &ldquo;{t.text}&rdquo;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '10px',
                  background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 800, color: '#fff',
                }}>{t.initials}</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0' }}>{t.name}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{t.loc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{
        position: 'fixed', bottom: '60px', left: 0, right: 0, zIndex: 100,
        padding: '12px 16px',
        background: 'linear-gradient(180deg, rgba(10,10,26,0) 0%, rgba(10,10,26,0.95) 20%)',
        backdropFilter: 'blur(12px)',
        display: showSticky ? 'flex' : 'none',
        alignItems: 'center', gap: '12px',
      }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>CA${plan.price.toFixed(2)}</span>
          <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '4px' }}>{plan.period}</span>
        </div>
        <button
          onClick={() => handleCheckout(selected)}
          disabled={loading}
          style={{
            padding: '12px 28px', border: 'none', borderRadius: '12px',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            color: '#fff', fontSize: '15px', fontWeight: 800, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            boxShadow: '0 4px 20px rgba(139,92,246,0.5)',
          }}
        >
          Get Pro <Zap size={14} />
        </button>
      </div>
      </div>{/* end desktop wrapper */}
    </div>
  );
}

export default function PricingPage() {
  return <Suspense><PricingPageInner /></Suspense>;
}
