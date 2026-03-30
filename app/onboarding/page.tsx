'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/OnboardingPage.module.scss';

type Step = 'goal' | 'source' | 'start';

const STEPS: Step[] = ['goal', 'source', 'start'];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('goal');
  const [ready, setReady] = useState(false);
  const [answers, setAnswers] = useState({ goal: '', source: '' });
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
      className={`${styles.optionCard} ${selected ? styles.optionCardSelected : ''}`}
    >
      <span className={styles.optionEmoji}>{emoji}</span>
      <span>{label}</span>
    </button>
  );

  if (!ready) return <div className={styles.loading} />;

  return (
    <div className={styles.page}>
      {/* Progress Header */}
      <div className={styles.progressHeader}>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <span className={styles.progressLabel}>{stepIndex + 1}/{STEPS.length}</span>
      </div>

      {/* Content */}
      <div className={`${styles.content} ${animating ? styles.contentAnimating : styles.contentVisible}`}>

        {/* Step 1: Goal */}
        {step === 'goal' && (
          <>
            <div className={styles.stepHeader}>
              <div className={styles.stepEmoji}>🎯</div>
              <h1 className={styles.stepTitle}>What&apos;s your goal?</h1>
              <p className={styles.stepSub}>We&apos;ll personalize your experience</p>
            </div>
            <div className={styles.optionList}>
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
            <div className={styles.stepHeader}>
              <div className={styles.stepEmoji}>🔍</div>
              <h1 className={styles.stepTitle}>How did you find us?</h1>
              <p className={styles.stepSub}>This helps us reach more students like you</p>
            </div>
            <div className={styles.optionList}>
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

        {/* Step 3: Choose skill */}
        {step === 'start' && (
          <>
            <div className={styles.stepHeader}>
              <div className={styles.stepEmoji}>🚀</div>
              <h1 className={styles.stepTitle}>Let&apos;s start practicing!</h1>
              <p className={styles.stepSub}>Pick a skill — your first exercise is free</p>
            </div>
            <div className={styles.skillGrid}>
              {[
                { emoji: '👂', label: 'Listening', value: 'listening', color: '#3b82f6', desc: 'Audio exercises' },
                { emoji: '📖', label: 'Reading', value: 'reading', color: '#22c55e', desc: 'Comprehension' },
                { emoji: '✍️', label: 'Writing', value: 'writing', color: '#f59e0b', desc: 'Email & essay' },
                { emoji: '🗣️', label: 'Speaking', value: 'speaking', color: '#8b5cf6', desc: 'Record & feedback' },
              ].map(skill => (
                <button
                  key={skill.value}
                  onClick={() => router.push(`/ai-coach?skill=${skill.value}`)}
                  className={styles.skillCard}
                  style={{ ['--skill-color' as string]: skill.color }}
                >
                  <span className={styles.skillEmoji}>{skill.emoji}</span>
                  <span className={styles.skillLabel}>{skill.label}</span>
                  <span className={styles.skillDesc}>{skill.desc}</span>
                  <div className={styles.skillAccent} style={{ background: `linear-gradient(90deg, ${skill.color}, ${skill.color}80)` }} />
                </button>
              ))}
            </div>
            <button onClick={() => router.push('/map')} className={styles.skipBtn}>
              Skip — go to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
