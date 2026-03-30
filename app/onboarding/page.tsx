'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles } from 'lucide-react';

type Step = 'goal' | 'source' | 'start';

const T = {
  bg: '#1b1f2a',
  surface: '#232733',
  red: '#ff3b3b',
  redGlow: 'rgba(255, 59, 59, 0.3)',
  text: '#ffffff',
  textMuted: 'rgba(255,255,255,0.5)',
  textSoft: 'rgba(255,255,255,0.7)',
};

const STEPS: Step[] = ['goal', 'source', 'start'];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('goal');
  const [ready, setReady] = useState(false);
  const [answers, setAnswers] = useState({
    goal: '',
    source: '',
  });
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const ob = localStorage.getItem('celpip_onboarding');
    if (ob) {
      try {
        const data = JSON.parse(ob);
        if (data.completed) { router.replace('/map'); return; }
      } catch {}
    }
    fetch('/api/onboarding').then(r => r.json()).then(d => {
      if (d.data?.completed) {
        localStorage.setItem('celpip_onboarding', JSON.stringify({ completed: true }));
        router.replace('/map');
      } else { setReady(true); }
    }).catch(() => setReady(true));
  }, [router]);

  const stepIndex = STEPS.indexOf(step);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const goNext = () => {
    if (stepIndex < STEPS.length - 1) {
      setAnimating(true);
      setTimeout(() => { setStep(STEPS[stepIndex + 1]); setAnimating(false); }, 200);
    }
  };

  const select = (field: string, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
    if (field === 'source') {
      // Save and go to start
      const final = { ...answers, [field]: value, completed: true, date: new Date().toISOString() };
      localStorage.setItem('celpip_onboarding', JSON.stringify(final));
      try { fetch('/api/onboarding', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(final) }); } catch {}
      setTimeout(goNext, 300);
    } else {
      setTimeout(goNext, 300);
    }
  };

  const OptionCard = ({ emoji, label, value, field, selected }: { emoji: string; label: string; value: string; field: string; selected: boolean }) => (
    <button
      onClick={() => select(field, value)}
      style={{
        display: 'flex', alignItems: 'center', gap: '1rem',
        padding: '1rem 1.25rem',
        background: selected ? `${T.red}15` : T.surface,
        border: selected ? `2px solid ${T.red}` : '2px solid transparent',
        borderRadius: 16, color: T.text, fontSize: '1.05rem',
        fontWeight: selected ? 700 : 500, cursor: 'pointer',
        transition: 'all 0.2s ease', width: '100%', textAlign: 'left',
      }}
    >
      <span style={{ fontSize: '1.5rem' }}>{emoji}</span>
      <span>{label}</span>
    </button>
  );

  if (!ready) return <div style={{ minHeight: '100vh', background: '#1b1f2a' }} />;

  return (
    <div style={{
      minHeight: '100vh', background: T.bg, display: 'flex', flexDirection: 'column',
      maxWidth: 480, margin: '0 auto', padding: '0 1.25rem', position: 'relative', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '1rem 0', gap: '0.75rem' }}>
        <div style={{ flex: 1 }}>
          <div style={{ height: 8, background: T.surface, borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: `linear-gradient(90deg, ${T.red}, #ff6b6b)`,
              borderRadius: 4, transition: 'width 0.4s ease',
            }} />
          </div>
        </div>
        <span style={{ color: T.textMuted, fontSize: '0.85rem', fontWeight: 600 }}>
          {stepIndex + 1}/{STEPS.length}
        </span>
      </div>

      {/* Content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2rem',
        opacity: animating ? 0 : 1, transform: animating ? 'translateX(20px)' : 'translateX(0)',
        transition: 'all 0.2s ease', paddingBottom: '2rem',
      }}>

        {/* Step 1: Goal */}
        {step === 'goal' && (
          <>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🎯</div>
              <h1 style={{ color: T.text, fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
                What&apos;s your goal?
              </h1>
              <p style={{ color: T.textSoft, fontSize: '1rem', margin: 0 }}>
                We&apos;ll personalize your experience
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <OptionCard emoji="🇨🇦" label="Immigration to Canada (PR)" value="immigration" field="goal" selected={answers.goal === 'immigration'} />
              <OptionCard emoji="🎓" label="University / College admission" value="education" field="goal" selected={answers.goal === 'education'} />
              <OptionCard emoji="💼" label="Job requirement" value="job" field="goal" selected={answers.goal === 'job'} />
              <OptionCard emoji="📝" label="Just practicing" value="practice" field="goal" selected={answers.goal === 'practice'} />
            </div>
          </>
        )}

        {/* Step 2: How did you find us */}
        {step === 'source' && (
          <>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🔍</div>
              <h1 style={{ color: T.text, fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
                How did you find us?
              </h1>
              <p style={{ color: T.textSoft, fontSize: '1rem', margin: 0 }}>
                This helps us reach more students like you
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <OptionCard emoji="🔎" label="Google Search" value="google" field="source" selected={answers.source === 'google'} />
              <OptionCard emoji="📸" label="Instagram" value="instagram" field="source" selected={answers.source === 'instagram'} />
              <OptionCard emoji="📘" label="Facebook" value="facebook" field="source" selected={answers.source === 'facebook'} />
              <OptionCard emoji="▶️" label="YouTube" value="youtube" field="source" selected={answers.source === 'youtube'} />
              <OptionCard emoji="📱" label="TikTok" value="tiktok" field="source" selected={answers.source === 'tiktok'} />
              <OptionCard emoji="👥" label="Friend / Word of mouth" value="friend" field="source" selected={answers.source === 'friend'} />
              <OptionCard emoji="🎯" label="Other" value="other" field="source" selected={answers.source === 'other'} />
            </div>
          </>
        )}

        {/* Step 3: Choose skill to practice NOW */}
        {step === 'start' && (
          <>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🚀</div>
              <h1 style={{ color: T.text, fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
                Let&apos;s start practicing!
              </h1>
              <p style={{ color: T.textSoft, fontSize: '1rem', margin: 0 }}>
                Pick a skill — your first exercise is free
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[
                { emoji: '👂', label: 'Listening', value: 'listening', color: '#3b82f6', desc: 'Audio exercises' },
                { emoji: '📖', label: 'Reading', value: 'reading', color: '#22c55e', desc: 'Comprehension' },
                { emoji: '✍️', label: 'Writing', value: 'writing', color: '#f59e0b', desc: 'Email & essay' },
                { emoji: '🗣️', label: 'Speaking', value: 'speaking', color: '#8b5cf6', desc: 'Record & feedback' },
              ].map(skill => (
                <button
                  key={skill.value}
                  onClick={() => router.push(`/ai-coach?skill=${skill.value}`)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                    padding: '1.5rem 1rem', background: T.surface, border: '2px solid transparent',
                    borderRadius: 20, color: T.text, cursor: 'pointer', transition: 'all 0.2s ease',
                    position: 'relative', overflow: 'hidden',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.border = `2px solid ${skill.color}`; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${skill.color}30`; }}
                  onMouseLeave={e => { e.currentTarget.style.border = '2px solid transparent'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <span style={{ fontSize: '2.5rem' }}>{skill.emoji}</span>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{skill.label}</span>
                  <span style={{ color: T.textMuted, fontSize: '0.8rem' }}>{skill.desc}</span>
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
                    background: `linear-gradient(90deg, ${skill.color}, ${skill.color}80)`,
                    borderRadius: '0 0 20px 20px',
                  }} />
                </button>
              ))}
            </div>
            <button
              onClick={() => router.push('/map')}
              style={{
                background: 'none', border: 'none', color: T.textMuted,
                fontSize: '0.95rem', cursor: 'pointer', padding: '0.75rem',
                textDecoration: 'underline', textUnderlineOffset: 4,
              }}
            >
              Skip — go to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
