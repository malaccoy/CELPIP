'use client';

import { useRouter } from 'next/navigation';

const T = {
  bg: '#0a0e1a',
  surface: '#151929',
  text: '#ffffff',
  muted: 'rgba(255,255,255,0.6)',
  red: '#ff3b3b',
  accent: '#ff3b3b',
  positive: '#a78bfa',
  blue: '#3b82f6',
};

export default function StartLandingPage() {
  const router = useRouter();
  const cta = () => router.push('/auth/register');

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text, fontFamily: "'Inter','Segoe UI',sans-serif", position: 'relative', overflow: 'hidden' }}>
      {/* Global styles */}
      <style>{`
        @keyframes aurora {
          0% { transform: translate(0,0) rotate(0deg) scale(1); }
          33% { transform: translate(30px,-50px) rotate(120deg) scale(1.1); }
          66% { transform: translate(-20px,20px) rotate(240deg) scale(0.9); }
          100% { transform: translate(0,0) rotate(360deg) scale(1); }
        }
        @keyframes ctaPulse {
          0%,100% { box-shadow: 0 4px 20px rgba(255,59,59,0.4); transform: scale(1); }
          50% { box-shadow: 0 8px 40px rgba(255,59,59,0.6); transform: scale(1.03); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .aurora-orb {
          position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.12;
          animation: aurora 15s ease-in-out infinite; pointer-events: none;
        }
        .cta-pulse { animation: ctaPulse 2s ease-in-out infinite; }
        .cta-pulse:hover { animation: none; transform: scale(1.05); box-shadow: 0 8px 40px rgba(255,59,59,0.7) !important; }
        .free-badge {
          background: linear-gradient(90deg, #ff3b3b, #a78bfa, #3b82f6, #a78bfa, #ff3b3b);
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Aurora orbs */}
      <div className="aurora-orb" style={{ width: 400, height: 400, top: -100, left: -100, background: 'radial-gradient(circle, #ff3b3b, #8b5cf6)' }} />
      <div className="aurora-orb" style={{ width: 500, height: 500, top: '40%', right: -150, background: 'radial-gradient(circle, #3b82f6, #06b6d4)', animationDelay: '-5s' }} />
      <div className="aurora-orb" style={{ width: 350, height: 350, bottom: -50, left: '30%', background: 'radial-gradient(circle, #8b5cf6, #ec4899)', animationDelay: '-10s' }} />

      {/* Sticky CTA bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(10,14,26,0.95)', backdropFilter: 'blur(10px)',
        padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', justifyContent: 'center',
      }}>
        <button className="cta-pulse" onClick={cta} style={{
          background: `linear-gradient(135deg, ${T.red}, #cc2f2f)`,
          color: '#fff', border: 'none', borderRadius: 14, padding: '14px 40px',
          fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', maxWidth: 400, width: '100%',
        }}>
          START FREE — No Credit Card
        </button>
      </div>

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 1, padding: '60px 20px 40px', maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block', background: 'rgba(255,59,59,0.15)', border: '1px solid rgba(255,59,59,0.3)',
          borderRadius: 50, padding: '6px 16px', fontSize: '0.85rem', fontWeight: 600, color: T.red, marginBottom: 20,
        }}>
          279+ students already practicing
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1.15, margin: '0 0 16px', letterSpacing: '-1px' }}>
          Failed CELPIP?<br />
          <span style={{ color: T.red }}>Score CLB 9+ in 30 Days.</span>
        </h1>
        <p style={{ fontSize: '1.1rem', color: T.muted, lineHeight: 1.6, margin: '0 0 28px', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
          The AI coach that scores your Speaking &amp; Writing instantly. Practice all 4 skills in real CELPIP format — for free.
        </p>
        <button className="cta-pulse" onClick={cta} style={{
          background: `linear-gradient(135deg, ${T.red}, #cc2f2f)`,
          color: '#fff', border: 'none', borderRadius: 14, padding: '16px 48px',
          fontWeight: 800, fontSize: '1.15rem', cursor: 'pointer',
        }}>
          Practice Free Now
        </button>
        <p style={{ color: T.muted, fontSize: '0.85rem', marginTop: 10 }}>
          No credit card required. <span className="free-badge" style={{ fontWeight: 800, fontSize: '0.95rem' }}>10 FREE exercises daily</span>
        </p>
      </section>

      {/* Pain → Solution */}
      <section style={{ position: 'relative', zIndex: 1, padding: '40px 20px', maxWidth: 600, margin: '0 auto' }}>
        <div style={{ background: T.surface, borderRadius: 20, padding: '28px 24px', marginBottom: 16 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 16px', color: T.red }}>
            Sound familiar?
          </h3>
          {[
            '"I studied for months but still got CLB 7"',
            '"I paid $300 for a course with 30 students — no personal feedback"',
            '"I don\'t know WHY I\'m losing marks in Speaking"',
            '"My Express Entry is stuck — I need +40 CRS points"',
          ].map((pain, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
              <span style={{ color: T.red, fontSize: '1.2rem', flexShrink: 0 }}>&#10007;</span>
              <span style={{ color: T.muted, fontSize: '0.95rem', fontStyle: 'italic' }}>{pain}</span>
            </div>
          ))}
        </div>

        <div style={{ background: T.surface, borderRadius: 20, padding: '28px 24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 16px', color: T.positive }}>
            What if you could...
          </h3>
          {[
            'Get instant AI feedback on every Speaking & Writing answer',
            'Practice unlimited CELPIP exercises — all 4 skills',
            'See exactly where you lose marks and how to fix it',
            'Study 30 min/day and improve 1-2 CLB levels in a month',
          ].map((sol, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
              <span style={{ color: T.positive, fontSize: '1.2rem', flexShrink: 0 }}>&#10003;</span>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>{sol}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ position: 'relative', zIndex: 1, padding: '40px 20px', maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 24px' }}>How It Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { step: '1', title: 'Pick a Skill', desc: 'Listening, Reading, Writing, or Speaking', color: '#3b82f6' },
            { step: '2', title: 'Practice', desc: 'Real CELPIP format exercises', color: '#f59e0b' },
            { step: '3', title: 'Get AI Feedback', desc: 'Instant scores + corrections', color: '#8b5cf6' },
            { step: '4', title: 'Improve', desc: 'Track progress, climb rankings', color: '#ff3b3b' },
          ].map(s => (
            <div key={s.step} style={{ background: T.surface, borderRadius: 16, padding: '20px 16px', textAlign: 'center' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: `${s.color}20`, color: s.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: '1rem', margin: '0 auto 10px',
              }}>{s.step}</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{s.title}</div>
              <div style={{ color: T.muted, fontSize: '0.8rem' }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section style={{ position: 'relative', zIndex: 1, padding: '40px 20px', maxWidth: 600, margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 24px', textAlign: 'center' }}>Real Results</h2>
        {[
          { name: 'Priya K.', flag: '\ud83c\uddee\ud83c\uddf3', text: 'I went from CLB 7 to CLB 9 in 3 weeks. The Speaking feedback is incredible — it shows exactly what to fix.', score: 'CLB 7 → 9' },
          { name: 'Paulo M.', flag: '\ud83c\udde7\ud83c\uddf7', text: 'Paid $300 for a prep course before. This free tool is better. My Express Entry got approved last month.', score: '+50 CRS' },
          { name: 'Amandeep S.', flag: '\ud83c\uddee\ud83c\uddf3', text: 'The daily drills kept me consistent. 30 minutes a day for a month and I passed with CLB 10.', score: 'CLB 10' },
        ].map((t, i) => (
          <div key={i} style={{ background: T.surface, borderRadius: 16, padding: '20px', marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.2rem' }}>{t.flag}</span>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.name}</span>
              </div>
              <span style={{ background: `${T.positive}20`, color: T.positive, padding: '4px 10px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700 }}>
                {t.score}
              </span>
            </div>
            <p style={{ color: T.muted, fontSize: '0.9rem', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>
              &ldquo;{t.text}&rdquo;
            </p>
          </div>
        ))}
      </section>

      {/* Price comparison */}
      <section style={{ position: 'relative', zIndex: 1, padding: '40px 20px', maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 8px' }}>Save Thousands</h2>
        <p style={{ color: T.muted, fontSize: '0.95rem', margin: '0 0 24px' }}>Compare us to traditional CELPIP prep</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ background: T.surface, borderRadius: 16, padding: '24px 16px', opacity: 0.7 }}>
            <div style={{ color: T.muted, fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>Others</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: T.red, marginBottom: 4 }}>CA$49.99</div>
            <div style={{ color: T.muted, fontSize: '0.8rem' }}>/month</div>
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column' as const, gap: 6, textAlign: 'left' as const }}>
              {['Group classes', 'Limited practice', 'No AI feedback', 'Fixed schedule'].map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center', color: T.muted, fontSize: '0.8rem' }}>
                  <span style={{ color: T.red }}>&#10007;</span>{f}
                </div>
              ))}
            </div>
          </div>
          <div style={{
            background: `linear-gradient(135deg, ${T.positive}15, ${T.positive}05)`,
            border: `2px solid ${T.positive}40`, borderRadius: 16, padding: '24px 16px', position: 'relative' as const,
          }}>
            <div style={{
              position: 'absolute' as const, top: -10, left: '50%', transform: 'translateX(-50%)',
              background: T.positive, color: '#fff', padding: '3px 12px', borderRadius: 20,
              fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' as const,
            }}>Best Value</div>
            <div style={{ color: T.positive, fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>CELPIP AI Coach</div>
            <div className="free-badge" style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: 4 }}>FREE</div>
            <div style={{ color: T.muted, fontSize: '0.8rem' }}>to start</div>
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column' as const, gap: 6, textAlign: 'left' as const }}>
              {['AI feedback instantly', 'All 4 skills', 'Unlimited exercises', 'Practice anytime'].map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: '0.8rem' }}>
                  <span style={{ color: T.positive }}>&#10003;</span>{f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Express Entry hook */}
      <section style={{ position: 'relative', zIndex: 1, padding: '40px 20px', maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1e3a5f, #0a1628)',
          borderRadius: 20, padding: '32px 24px', border: '1px solid rgba(59,130,246,0.2)',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>&#127464;&#127462;</div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 8px' }}>Stuck in Express Entry?</h3>
          <p style={{ color: T.muted, fontSize: '0.95rem', margin: '0 0 16px', lineHeight: 1.5 }}>
            CLB 7 → CLB 9 = <strong style={{ color: T.blue }}>+40 CRS points</strong><br />
            That&apos;s often the difference between an ITA and 6 more months of waiting.
          </p>
          <button onClick={cta} style={{
            background: T.blue, color: '#fff', border: 'none', borderRadius: 12,
            padding: '14px 36px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
          }}>
            Boost Your CRS Score
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ position: 'relative', zIndex: 1, padding: '40px 20px 120px', maxWidth: 600, margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 24px', textAlign: 'center' }}>Common Questions</h2>
        {[
          { q: 'Is it really free?', a: 'Yes. 10 free exercises daily, no credit card needed. Pro unlocks unlimited + advanced content.' },
          { q: 'How does AI scoring work?', a: 'Our AI analyzes your Speaking recordings and Writing answers using CELPIP criteria. You get scores, corrections, and improvement tips instantly.' },
          { q: 'What skills are covered?', a: 'All 4 CELPIP skills: Listening, Reading, Writing, and Speaking. Real test format exercises.' },
          { q: 'Can I use it on my phone?', a: 'Yes! Works on any device — phone, tablet, or computer. Also available on Google Play.' },
        ].map((faq, i) => (
          <div key={i} style={{ background: T.surface, borderRadius: 14, padding: '18px 20px', marginBottom: 10 }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 6 }}>{faq.q}</div>
            <div style={{ color: T.muted, fontSize: '0.88rem', lineHeight: 1.5 }}>{faq.a}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
