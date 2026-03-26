'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const T = {
  bg: '#1e1e2e',
  surface: '#2a2a3c',
  text: '#ffffff',
  muted: 'rgba(255,255,255,0.6)',
  red: '#ff3b3b',
  accent: '#ff3b3b',
  positive: '#a78bfa',
  blue: '#3b82f6',
  green: '#22c55e',
  orange: '#f97316',
  border: 'rgba(255,255,255,0.06)',
};

export default function HomePage() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      if (data?.user) setLoggedIn(true);
    });
  }, []);

  const cta = () => router.push(loggedIn ? '/dashboard' : '/auth/register');
  const ctaStart = () => router.push('/start');

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text, fontFamily: "'Inter','Segoe UI',sans-serif", position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes aurora { 0%{transform:translate(0,0) rotate(0deg) scale(1)} 33%{transform:translate(30px,-50px) rotate(120deg) scale(1.1)} 66%{transform:translate(-20px,20px) rotate(240deg) scale(0.9)} 100%{transform:translate(0,0) rotate(360deg) scale(1)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes ctaPulse { 0%,100%{box-shadow:0 4px 20px rgba(255,59,59,0.4);transform:scale(1)} 50%{box-shadow:0 8px 40px rgba(255,59,59,0.6);transform:scale(1.03)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
        .aurora-orb { position:absolute; border-radius:50%; filter:blur(80px); opacity:0.12; animation:aurora 15s ease-in-out infinite; pointer-events:none; }
        .cta-pulse { animation:ctaPulse 2s ease-in-out infinite; }
        .cta-pulse:hover { animation:none; transform:scale(1.05); box-shadow:0 8px 40px rgba(255,59,59,0.7) !important; }
        .fade-up { animation: fadeUp 0.7s ease-out both; }
        .fade-up-d1 { animation-delay: 0.1s; }
        .fade-up-d2 { animation-delay: 0.2s; }
        .fade-up-d3 { animation-delay: 0.3s; }

        /* ── MOBILE DEFAULT ── */
        .hp-section { max-width: 600px; margin: 0 auto; padding: 40px 20px; position: relative; z-index: 1; }
        .hp-hero { padding: 60px 20px 40px; text-align: center; }
        .hp-hero h1 { font-size: clamp(1.8rem, 6vw, 2.4rem); }
        .hp-hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 24px; max-width: 380px; margin-left: auto; margin-right: auto; }
        .hp-steps { display: flex; flex-direction: column; gap: 14px; }
        .hp-value-list { }
        .hp-plans { display: flex; flex-direction: column; gap: 10px; }
        .hp-testimonials { display: flex; flex-direction: column; gap: 12px; }
        .hp-pain-grid { display: flex; flex-direction: column; gap: 16px; }
        .hp-faq-grid { display: flex; flex-direction: column; gap: 10px; }
        .hp-cta-bar { display: flex; }
        .hp-hero-subtitle { max-width: 460px; margin-left: auto; margin-right: auto; }
        .hp-hero-content { }
        .hp-hero-right { display: none; }
        .hp-price-compare { display: none; }

        /* ── DESKTOP (>1024px) ── */
        @media (min-width: 1024px) {
          .hp-section { max-width: 1100px; padding: 60px 40px; }
          .hp-hero { max-width: 1100px; padding: 80px 40px 60px; text-align: left; display: flex; align-items: center; gap: 60px; }
          .hp-hero h1 { font-size: 3rem; }
          .hp-hero-content { flex: 1; }
          .hp-hero-right { display: flex; flex: 0 0 400px; }
          .hp-hero-grid { max-width: 100%; grid-template-columns: 1fr 1fr; gap: 14px; margin: 0; }
          .hp-hero-subtitle { max-width: 520px; margin-left: 0; }
          .hp-steps { flex-direction: row; gap: 20px; }
          .hp-steps > div { flex: 1; }
          .hp-pain-grid { flex-direction: row; gap: 20px; }
          .hp-pain-grid > div { flex: 1; }
          .hp-plans { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
          .hp-plan-card { flex-direction: column !important; text-align: center !important; padding: 24px 16px !important; }
          .hp-plan-card > div { text-align: center !important; }
          .hp-testimonials { flex-direction: row; gap: 16px; }
          .hp-testimonials > div { flex: 1; }
          .hp-faq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
          .hp-cta-bar { display: none; }
          .hp-price-compare { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 20px; }
          .hp-value-list { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
        }

        .skill-card { transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s; cursor: pointer; }
        .skill-card:hover { transform: translateY(-4px) scale(1.03); }
        .plan-highlight { position: relative; }
        .plan-highlight::before { content: ''; position: absolute; inset: -1px; border-radius: 17px; background: linear-gradient(135deg, #22c55e60, #22c55e10); z-index: 0; pointer-events: none; }
      `}</style>

      {/* Aurora orbs */}
      <div className="aurora-orb" style={{ width: 400, height: 400, top: -100, left: -100, background: 'radial-gradient(circle, #ff3b3b, #8b5cf6)' }} />
      <div className="aurora-orb" style={{ width: 500, height: 500, top: '40%', right: -150, background: 'radial-gradient(circle, #3b82f6, #06b6d4)', animationDelay: '-5s' }} />
      <div className="aurora-orb" style={{ width: 350, height: 350, bottom: -50, left: '30%', background: 'radial-gradient(circle, #8b5cf6, #ec4899)', animationDelay: '-10s' }} />

      {/* Sticky CTA bar — mobile only */}
      <div className="hp-cta-bar" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(10,14,26,0.95)', backdropFilter: 'blur(10px)',
        padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.08)',
        justifyContent: 'center',
      }}>
        <button className="cta-pulse" onClick={cta} style={{
          background: `linear-gradient(135deg, ${T.red}, #cc2f2f)`,
          color: '#fff', border: 'none', borderRadius: 14, padding: '14px 40px',
          fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', maxWidth: 400, width: '100%',
        }}>
          START FREE — No Credit Card
        </button>
      </div>

      {/* ═══════ HERO ═══════ */}
      <section className="hp-hero hp-section fade-up">
        <div className="hp-hero-content">
          {/* Social proof badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)',
            borderRadius: 50, padding: '6px 16px', fontSize: '0.82rem', fontWeight: 600, color: T.green, marginBottom: 20,
          }}>
            350+ students from 15+ countries
          </div>

          <h1 style={{ fontWeight: 900, lineHeight: 1.1, margin: '0 0 16px', letterSpacing: '-1.5px' }}>
            Pass CELPIP.<br />
            <span style={{ color: T.red }}>On Your First Try.</span>
          </h1>

          <p className="hp-hero-subtitle" style={{ fontSize: '1.1rem', color: T.muted, lineHeight: 1.65, margin: '0 0 8px' }}>
            Don&apos;t waste <strong style={{ color: T.text }}>$300 on a retake</strong>. Practice with AI that scores like the real exam — instant feedback on every answer.
          </p>

          <p style={{ fontSize: '0.78rem', color: T.muted, margin: '0 0 24px', opacity: 0.7 }}>
            Based on official CELPIP scoring criteria (CLB framework)
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="cta-pulse" onClick={cta} style={{
              background: `linear-gradient(135deg, ${T.red}, #cc2f2f)`,
              color: '#fff', border: 'none', borderRadius: 14, padding: '16px 36px',
              fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer',
            }}>
              Start Free Practice
            </button>
          </div>

          <p style={{ color: T.muted, fontSize: '0.82rem', marginTop: 14, textAlign: 'center' }}>
            No credit card required. <span style={{ fontWeight: 800, fontSize: '0.92rem', color: T.positive }}>10 FREE exercises daily</span>
          </p>
        </div>

        {/* Desktop: skill cards on right side */}
        <div className="hp-hero-right">
          <div className="hp-hero-grid">
            {[
              { icon: '🎤', label: 'Speaking', desc: '8 tasks • AI feedback', color: '#8b5cf6' },
              { icon: '✍️', label: 'Writing', desc: '2 tasks • Voice dictation', color: '#f59e0b' },
              { icon: '🎧', label: 'Listening', desc: '6 parts • Real voices', color: '#3b82f6' },
              { icon: '📖', label: 'Reading', desc: '4 parts • Timed', color: '#22c55e' },
            ].map(s => (
              <button key={s.label} onClick={cta} className="skill-card" style={{
                background: `linear-gradient(145deg, ${s.color}18, ${s.color}08)`,
                border: `1.5px solid ${s.color}35`, borderRadius: 18, padding: '24px 16px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 60, height: 60, borderRadius: '50%', background: `${s.color}15`, filter: 'blur(20px)', pointerEvents: 'none' }} />
                <div style={{ fontSize: 36, lineHeight: 1, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))', animation: 'float 3s ease-in-out infinite' }}>{s.icon}</div>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem' }}>{s.label}</span>
                <span style={{ color: `${s.color}cc`, fontSize: '0.75rem', fontWeight: 600 }}>{s.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile: skill cards below */}
        <div className="hp-hero-grid" style={{ display: 'var(--mob-grid, grid)' }}>
          <style>{`@media (min-width: 1024px) { :root { --mob-grid: none; } }`}</style>
          {[
            { icon: '🎤', label: 'Speaking', desc: '8 tasks • AI feedback', color: '#8b5cf6' },
            { icon: '✍️', label: 'Writing', desc: '2 tasks • Voice dictation', color: '#f59e0b' },
            { icon: '🎧', label: 'Listening', desc: '6 parts • Real voices', color: '#3b82f6' },
            { icon: '📖', label: 'Reading', desc: '4 parts • Timed', color: '#22c55e' },
          ].map(s => (
            <button key={s.label} onClick={cta} className="skill-card" style={{
              background: `linear-gradient(145deg, ${s.color}18, ${s.color}08)`,
              border: `1.5px solid ${s.color}35`, borderRadius: 18, padding: '20px 12px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 60, height: 60, borderRadius: '50%', background: `${s.color}15`, filter: 'blur(20px)', pointerEvents: 'none' }} />
              <div style={{ fontSize: 32, lineHeight: 1, animation: 'float 3s ease-in-out infinite' }}>{s.icon}</div>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>{s.label}</span>
              <span style={{ color: `${s.color}cc`, fontSize: '0.72rem', fontWeight: 600 }}>{s.desc}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ═══════ PROBLEM + SOLUTION ═══════ */}
      <section className="hp-section fade-up fade-up-d1">
        <div className="hp-pain-grid">
          <div style={{ background: T.surface, borderRadius: 20, padding: '28px 24px', flex: 1 }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 16px', color: T.red }}>
              Sound familiar?
            </h3>
            {[
              '"I studied for months but still scored below CLB 7"',
              '"I paid $300 for a retake — and I\'m still not confident"',
              '"I don\'t know WHERE I\'m losing marks in Speaking"',
              '"My Express Entry is stuck — I need those CRS points NOW"',
            ].map((pain, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{ color: T.red, fontSize: '1.2rem', flexShrink: 0 }}>✗</span>
                <span style={{ color: T.muted, fontSize: '0.95rem', fontStyle: 'italic' }}>{pain}</span>
              </div>
            ))}
          </div>

          <div style={{ background: T.surface, borderRadius: 20, padding: '28px 24px', flex: 1 }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 6px', color: T.positive }}>
              We built this for you.
            </h3>
            <p style={{ fontSize: '0.85rem', color: T.muted, margin: '0 0 16px', lineHeight: 1.5 }}>
              We know how stressful CELPIP is. That&apos;s why we created an AI coach that gives you <strong style={{ color: T.text }}>the exact feedback</strong> you need — instantly, 24/7.
            </p>
            {[
              'Get instant AI feedback on every Speaking & Writing answer',
              'See exactly WHERE you lose marks and HOW to fix it',
              'Practice 1,270+ real CELPIP exercises — all 4 skills',
              'Study 30 min/day → improve 1-2 CLB levels in a month',
            ].map((sol, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{ color: T.positive, fontSize: '1.2rem', flexShrink: 0 }}>✓</span>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>{sol}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 3 STEPS ═══════ */}
      <section className="hp-section fade-up fade-up-d2" style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 6px' }}>3 Steps to Your Best Score</h2>
        <p style={{ color: T.muted, fontSize: '0.88rem', margin: '0 0 28px' }}>Simple. Clear. No confusion.</p>
        <div className="hp-steps">
          {[
            { step: '1', title: 'Practice Daily', desc: '10 free exercises across all 4 CELPIP skills. Pick your weak areas — the AI adapts.', color: T.blue, icon: '🎯' },
            { step: '2', title: 'Get Instant Feedback', desc: 'AI scores your answers using CELPIP criteria. See mistakes, corrections, and a model response.', color: T.positive, icon: '🤖' },
            { step: '3', title: 'Pass with Confidence', desc: 'Watch your CLB score climb week by week. When you\'re ready — pass on the first try.', color: T.green, icon: '🏆' },
          ].map(s => (
            <div key={s.step} style={{
              background: T.surface, borderRadius: 18, padding: '24px 22px',
              display: 'flex', alignItems: 'flex-start', gap: 16, textAlign: 'left',
              border: `1px solid ${s.color}12`,
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16, flexShrink: 0,
                background: `${s.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26,
              }}>{s.icon}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ background: `${s.color}22`, color: s.color, width: 24, height: 24, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 12 }}>{s.step}</span>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>{s.title}</span>
                </div>
                <div style={{ color: T.muted, fontSize: '0.88rem', lineHeight: 1.55 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ VALUE STACK ═══════ */}
      <section className="hp-section fade-up" style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 6px' }}>Everything You Get</h2>
        <p style={{ color: T.muted, fontSize: '0.88rem', margin: '0 0 28px' }}>CA$339+ in value — included in every plan</p>

        <div style={{ background: T.surface, borderRadius: 20, padding: '24px 22px', textAlign: 'left' }}>
          <div className="hp-value-list">
            {[
              { item: 'AI Speaking feedback (8 tasks)', value: 'CA$97/mo', icon: '🎤' },
              { item: '562 Listening exercises with real voices', value: 'CA$47', icon: '🎧' },
              { item: '492 Reading comprehension passages', value: 'CA$37', icon: '📖' },
              { item: 'Writing feedback with error corrections', value: 'CA$47', icon: '✍️' },
              { item: 'Mock Exam (Quick + Full format)', value: 'CA$67', icon: '📝' },
              { item: 'Battle Mode PvP + Leaderboard', value: 'CA$27', icon: '⚔️' },
              { item: 'Progress tracking + CLB score estimate', value: 'CA$17', icon: '📊' },
            ].map((v, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 4px', borderBottom: `1px solid ${T.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{v.icon}</span>
                  <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)' }}>{v.item}</span>
                </div>
                <span style={{ fontSize: '0.8rem', color: T.muted, textDecoration: 'line-through', opacity: 0.5 }}>{v.value}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 4px 6px', marginTop: 8, borderTop: `1px solid ${T.positive}30` }}>
            <span style={{ fontWeight: 800, fontSize: '1.05rem', color: T.positive }}>Total Value</span>
            <span style={{ fontWeight: 800, fontSize: '1.15rem', color: T.positive, textDecoration: 'line-through' }}>CA$339/mo</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 4px 0' }}>
            <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>Your Price</span>
            <span style={{ fontWeight: 900, fontSize: '1.4rem', color: T.green }}>CA$24.99/mo</span>
          </div>
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <span style={{ fontSize: '0.78rem', color: T.green, fontWeight: 700 }}>Save 93% vs buying separately</span>
          </div>
        </div>
      </section>

      {/* ═══════ PRICING ═══════ */}
      <section className="hp-section fade-up" style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 6px' }}>Choose Your Plan</h2>
        <p style={{ color: T.muted, fontSize: '0.88rem', margin: '0 0 6px' }}>Start free. Upgrade when you&apos;re ready.</p>
        <p style={{ color: T.muted, fontSize: '0.75rem', margin: '0 0 24px', opacity: 0.6 }}>Cancel anytime. No contracts.</p>

        {/* Desktop: comparison strip */}
        <div className="hp-price-compare">
          {[
            { label: 'Others charge', price: 'CA$49.99/mo', sub: 'Group classes, no AI', color: T.red, opacity: 0.6 },
            { label: 'Retake exam', price: 'CA$300+', sub: 'If you fail again', color: T.red, opacity: 0.6 },
            { label: 'CELPIP AI Coach', price: 'FREE to start', sub: 'AI feedback, all 4 skills', color: T.green, opacity: 1 },
          ].map((c, i) => (
            <div key={i} style={{ background: T.surface, borderRadius: 14, padding: '16px', textAlign: 'center', opacity: c.opacity, border: c.color === T.green ? `1px solid ${T.green}30` : 'none' }}>
              <div style={{ fontSize: '0.8rem', color: T.muted, marginBottom: 4 }}>{c.label}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: c.color }}>{c.price}</div>
              <div style={{ fontSize: '0.72rem', color: T.muted, marginTop: 2 }}>{c.sub}</div>
            </div>
          ))}
        </div>

        <div className="hp-plans">
          {[
            { name: 'Weekly', price: 'CA$9.99', per: '/week', yearly: '= CA$520/year', save: '', color: T.text, highlight: false },
            { name: 'Monthly', price: 'CA$24.99', per: '/month', yearly: '= CA$300/year', save: 'Save 42%', color: T.text, highlight: false },
            { name: 'Quarterly', price: 'CA$49.99', per: '/3 months', yearly: '= CA$200/year', save: 'Save 62%', color: T.text, highlight: false },
            { name: 'Annual', price: 'CA$99.99', per: '/year', yearly: 'CA$8.33/month', save: 'Save 81%', color: T.green, highlight: true },
          ].map(p => (
            <div key={p.name} className={`hp-plan-card ${p.highlight ? 'plan-highlight' : ''}`} style={{
              background: p.highlight ? `linear-gradient(135deg, ${T.green}12, ${T.green}05)` : T.surface,
              border: p.highlight ? `2px solid ${T.green}50` : `1px solid ${T.border}`,
              borderRadius: 16, padding: '16px 18px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              position: 'relative',
            }}>
              {p.highlight && (
                <div style={{
                  position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                  background: T.green, color: '#fff', padding: '3px 14px', borderRadius: 20,
                  fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', zIndex: 1,
                }}>🏆 Best Value</div>
              )}
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: p.color }}>{p.name}</div>
                <div style={{ fontSize: '0.72rem', color: T.muted }}>{p.yearly}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 900, fontSize: p.highlight ? '1.2rem' : '1.1rem', color: p.color }}>
                  {p.price}<span style={{ fontSize: '0.75rem', color: T.muted, fontWeight: 400 }}>{p.per}</span>
                </div>
                {p.save && <div style={{ fontSize: '0.72rem', color: p.highlight ? T.green : T.orange, fontWeight: 700 }}>{p.save}</div>}
              </div>
            </div>
          ))}
        </div>

        <button className="cta-pulse" onClick={cta} style={{
          background: `linear-gradient(135deg, ${T.red}, #cc2f2f)`,
          color: '#fff', border: 'none', borderRadius: 14, padding: '16px 48px',
          fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', marginTop: 24, width: '100%', maxWidth: 380,
        }}>
          Start Free — Upgrade Later
        </button>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className="hp-section fade-up">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 24px', textAlign: 'center' }}>Real Results from Real Students</h2>
        <div className="hp-testimonials">
          {[
            { name: 'Priya K.', flag: '🇮🇳', text: 'I went from CLB 7 to CLB 9 in 3 weeks. The Speaking feedback shows exactly what to fix.', score: 'CLB 7 → 9', highlight: '+40 CRS' },
            { name: 'Paulo M.', flag: '🇧🇷', text: 'Paid $300 for a prep course before. This free tool gives better feedback. My PR got approved!', score: 'PR Approved', highlight: '+50 CRS' },
            { name: 'Amandeep S.', flag: '🇮🇳', text: '30 minutes a day for a month and I passed with CLB 10. The daily drills kept me consistent.', score: 'CLB 10', highlight: '1st try' },
          ].map((t, i) => (
            <div key={i} style={{ background: T.surface, borderRadius: 16, padding: '22px', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1.2rem' }}>{t.flag}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.name}</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ background: `${T.positive}20`, color: T.positive, padding: '4px 10px', borderRadius: 8, fontSize: '0.73rem', fontWeight: 700 }}>{t.score}</span>
                  <span style={{ background: `${T.green}20`, color: T.green, padding: '4px 10px', borderRadius: 8, fontSize: '0.73rem', fontWeight: 700 }}>{t.highlight}</span>
                </div>
              </div>
              <p style={{ color: T.muted, fontSize: '0.9rem', margin: 0, lineHeight: 1.55, fontStyle: 'italic' }}>
                &ldquo;{t.text}&rdquo;
              </p>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
          {['🇨🇦 Canada','🇮🇳 India','🇧🇷 Brazil','🇵🇭 Philippines','🇳🇬 Nigeria','🇵🇰 Pakistan','🇧🇩 Bangladesh','🇱🇰 Sri Lanka'].map((c, i) => (
            <span key={i} style={{ fontSize: '0.7rem', color: T.muted, background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: 6 }}>{c}</span>
          ))}
        </div>
      </section>

      {/* ═══════ EXPRESS ENTRY ═══════ */}
      <section className="hp-section fade-up" style={{ textAlign: 'center' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1e3a5f, #0a1628)',
          borderRadius: 24, padding: '36px 28px', border: '1px solid rgba(59,130,246,0.2)',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🇨🇦</div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 8px' }}>Stuck in Express Entry?</h3>
          <p style={{ color: T.muted, fontSize: '0.95rem', margin: '0 0 6px', lineHeight: 1.5 }}>
            CLB 7 → CLB 9 = <strong style={{ color: T.blue }}>+40 CRS points</strong>
          </p>
          <p style={{ color: T.muted, fontSize: '0.85rem', margin: '0 0 20px', lineHeight: 1.5 }}>
            That&apos;s often the difference between an ITA and <strong style={{ color: T.red }}>6 more months of waiting</strong>.
          </p>

          <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 14, padding: '16px', marginBottom: 16, textAlign: 'left', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
            <div style={{ fontSize: '0.78rem', color: T.green, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Imagine this:</div>
            <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>
              &ldquo;You open that email: <strong>CELPIP Score — CLB 9</strong>. Your Express Entry application — <strong style={{ color: T.green }}>approved</strong>. Your new life in Canada starts now.&rdquo;
            </p>
          </div>

          <p style={{ color: 'rgba(255,59,59,0.7)', fontSize: '0.8rem', margin: '0 0 16px' }}>
            Every week you don&apos;t practice is another week your PR is delayed.
          </p>

          <button onClick={cta} style={{
            background: T.blue, color: '#fff', border: 'none', borderRadius: 12,
            padding: '14px 36px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
          }}>
            Boost Your CRS Score →
          </button>
        </div>
      </section>

      {/* ═══════ FAQ ═══════ */}
      <section className="hp-section fade-up">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 24px', textAlign: 'center' }}>Common Questions</h2>
        <div className="hp-faq-grid">
          {[
            { q: 'Is it really free?', a: 'Yes! 10 free exercises daily across all 4 skills. No credit card needed. Pro unlocks unlimited + advanced content.' },
            { q: 'How accurate is the AI scoring?', a: 'Our AI is trained on official CELPIP scoring criteria (CLB framework). It analyzes grammar, vocabulary, coherence, and task completion — just like a real examiner.' },
            { q: 'How fast will I improve?', a: 'Students who practice 30 min/day typically improve 1-2 CLB levels in 3-4 weeks. Consistency is key.' },
            { q: 'What if I don\'t improve?', a: 'If you don\'t see improvement in 30 days of consistent practice, contact us — we\'ll extend your Pro subscription for free.' },
            { q: 'Can I use it on my phone?', a: 'Absolutely! Works on any device. Also available on Google Play for Android.' },
            { q: 'Can I cancel anytime?', a: 'Yes. No contracts, no hidden fees. Cancel your subscription anytime from your dashboard.' },
          ].map((faq, i) => (
            <div key={i} style={{ background: T.surface, borderRadius: 14, padding: '20px 22px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 8 }}>{faq.q}</div>
              <div style={{ color: T.muted, fontSize: '0.88rem', lineHeight: 1.55 }}>{faq.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ FINAL CTA ═══════ */}
      <section className="hp-section fade-up" style={{ textAlign: 'center', paddingBottom: 140 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 8px' }}>Your CELPIP Score Won&apos;t Improve by Waiting.</h2>
        <p style={{ color: T.muted, fontSize: '0.95rem', margin: '0 0 24px' }}>
          Join 350+ students already practicing. Start for free today.
        </p>
        <button className="cta-pulse" onClick={cta} style={{
          background: `linear-gradient(135deg, ${T.red}, #cc2f2f)`,
          color: '#fff', border: 'none', borderRadius: 14, padding: '16px 48px',
          fontWeight: 800, fontSize: '1.15rem', cursor: 'pointer',
        }}>
          Start Free Practice Now
        </button>
        <p style={{ color: T.muted, fontSize: '0.78rem', marginTop: 10 }}>
          Free forever. No credit card. Upgrade when you&apos;re ready.
        </p>
      </section>
    </div>
  );
}
