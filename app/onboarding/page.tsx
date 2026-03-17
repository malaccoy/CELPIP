'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Target, Calendar, Flame, BookOpen, ArrowRight, ChevronLeft, Sparkles } from 'lucide-react';
import Image from 'next/image';

type Step = 'goal' | 'date' | 'daily' | 'focus' | 'source' | 'ready' | 'start';

const T = {
  bg: '#1b1f2a',
  surface: '#232733',
  surfaceHover: '#2a2f3d',
  red: '#ff3b3b',
  redGlow: 'rgba(255, 59, 59, 0.3)',
  text: '#ffffff',
  textMuted: 'rgba(255,255,255,0.5)',
  textSoft: 'rgba(255,255,255,0.7)',
  green: '#22c55e',
  purple: '#8b5cf6',
  amber: '#f59e0b',
  blue: '#3b82f6',
};

const STEPS: Step[] = ['goal', 'date', 'daily', 'focus', 'source', 'ready', 'start'];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('goal');
  const [ready, setReady] = useState(false);
  const [answers, setAnswers] = useState({
    goal: '',
    testDate: '',
    dailyMinutes: '',
    focusSkills: [] as string[],
    source: '',
  });
  const [animating, setAnimating] = useState(false);

  // Check if already completed — redirect to dashboard
  useEffect(() => {
    const ob = localStorage.getItem('celpip_onboarding');
    if (ob) {
      try {
        const data = JSON.parse(ob);
        if (data.completed) {
          router.replace('/dashboard');
          return;
        }
      } catch {}
    }
    // Also check server
    fetch('/api/onboarding').then(r => r.json()).then(d => {
      if (d.data?.completed) {
        localStorage.setItem('celpip_onboarding', JSON.stringify({ completed: true }));
        router.replace('/dashboard');
      } else {
        setReady(true);
      }
    }).catch(() => setReady(true));
  }, [router]);

  const stepIndex = STEPS.indexOf(step);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const goNext = () => {
    if (stepIndex < STEPS.length - 1) {
      setAnimating(true);
      setTimeout(() => {
        setStep(STEPS[stepIndex + 1]);
        setAnimating(false);
      }, 200);
    }
  };

  const goBack = () => {
    if (stepIndex > 0) {
      setStep(STEPS[stepIndex - 1]);
    }
  };

  const finish = async () => {
    // Save to localStorage + server
    localStorage.setItem('celpip_onboarding', JSON.stringify({ ...answers, completed: true, date: new Date().toISOString() }));
    
    try {
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      });
    } catch (e) { /* non-critical */ }

    // Route based on focus skill
    const skill = answers.focusSkills[0] || 'reading';
    const skillMap: Record<string, string> = {
      reading: '/ai-coach?skill=reading',
      listening: '/ai-coach?skill=listening',
      writing: '/ai-coach?skill=writing',
      speaking: '/ai-coach?skill=speaking',
    };
    router.push(answers.focusSkills.length === 4 ? '/ai-coach' : (skillMap[skill] || '/ai-coach'));
  };

  const select = (field: string, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
    // Auto-advance after short delay
    setTimeout(goNext, 300);
  };

  const OptionCard = ({ emoji, label, value, field, selected }: { emoji: string; label: string; value: string; field: string; selected: boolean }) => (
    <button
      onClick={() => select(field, value)}
      style={{
        display: 'flex', alignItems: 'center', gap: '1rem',
        padding: '1rem 1.25rem',
        background: selected ? `${T.red}15` : T.surface,
        border: selected ? `2px solid ${T.red}` : '2px solid transparent',
        borderRadius: 16,
        color: T.text,
        fontSize: '1.05rem',
        fontWeight: selected ? 700 : 500,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        width: '100%',
        textAlign: 'left',
      }}
    >
      <span style={{ fontSize: '1.5rem' }}>{emoji}</span>
      <span>{label}</span>
    </button>
  );

  if (!ready) return <div style={{ minHeight: '100vh', background: '#1b1f2a' }} />;

  return (
    <div style={{
      minHeight: '100vh',
      background: T.bg,
      display: 'flex',
      flexDirection: 'column',
      maxWidth: 480,
      margin: '0 auto',
      padding: '0 1.25rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '1rem 0', gap: '0.75rem' }}>
        {stepIndex > 0 && (
          <button onClick={goBack} style={{ background: 'none', border: 'none', color: T.textMuted, cursor: 'pointer', padding: 4 }}>
            <ChevronLeft size={24} />
          </button>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ height: 8, background: T.surface, borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${T.red}, #ff6b6b)`,
              borderRadius: 4,
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>
        <span style={{ color: T.textMuted, fontSize: '0.85rem', fontWeight: 600 }}>
          {stepIndex + 1}/{STEPS.length}
        </span>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '2rem',
        opacity: animating ? 0 : 1,
        transform: animating ? 'translateX(20px)' : 'translateX(0)',
        transition: 'all 0.2s ease',
        paddingBottom: '2rem',
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
              <OptionCard emoji="🏥" label="Professional designation" value="professional" field="goal" selected={answers.goal === 'professional'} />
              <OptionCard emoji="📝" label="Just practicing" value="practice" field="goal" selected={answers.goal === 'practice'} />
            </div>
          </>
        )}

        {/* Step 2: Test date */}
        {step === 'date' && (
          <>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📅</div>
              <h1 style={{ color: T.text, fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
                When is your test?
              </h1>
              <p style={{ color: T.textSoft, fontSize: '1rem', margin: 0 }}>
                We&apos;ll create a study schedule for you
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <OptionCard emoji="🔥" label="Less than 2 weeks" value="2weeks" field="testDate" selected={answers.testDate === '2weeks'} />
              <OptionCard emoji="📆" label="1-2 months" value="1-2months" field="testDate" selected={answers.testDate === '1-2months'} />
              <OptionCard emoji="🗓️" label="3+ months away" value="3months" field="testDate" selected={answers.testDate === '3months'} />
              <OptionCard emoji="🤷" label="Not booked yet" value="notbooked" field="testDate" selected={answers.testDate === 'notbooked'} />
            </div>
          </>
        )}

        {/* Step 3: Daily commitment */}
        {step === 'daily' && (
          <>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>⏱️</div>
              <h1 style={{ color: T.text, fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
                Daily practice goal?
              </h1>
              <p style={{ color: T.textSoft, fontSize: '1rem', margin: 0 }}>
                Consistency beats intensity
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <OptionCard emoji="🌱" label="5 minutes / day" value="5" field="dailyMinutes" selected={answers.dailyMinutes === '5'} />
              <OptionCard emoji="💪" label="15 minutes / day" value="15" field="dailyMinutes" selected={answers.dailyMinutes === '15'} />
              <OptionCard emoji="🔥" label="30 minutes / day" value="30" field="dailyMinutes" selected={answers.dailyMinutes === '30'} />
              <OptionCard emoji="🏆" label="60+ minutes / day" value="60" field="dailyMinutes" selected={answers.dailyMinutes === '60'} />
            </div>
          </>
        )}

        {/* Step 4: Focus skill (multi-select) */}
        {step === 'focus' && (
          <>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📚</div>
              <h1 style={{ color: T.text, fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
                What do you want to improve?
              </h1>
              <p style={{ color: T.textSoft, fontSize: '1rem', margin: 0 }}>
                Select one or more skills
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { emoji: '👂', label: 'Listening', value: 'listening' },
                { emoji: '📖', label: 'Reading', value: 'reading' },
                { emoji: '✍️', label: 'Writing', value: 'writing' },
                { emoji: '🗣️', label: 'Speaking', value: 'speaking' },
              ].map(opt => {
                const isSelected = answers.focusSkills.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setAnswers(prev => ({
                        ...prev,
                        focusSkills: isSelected
                          ? prev.focusSkills.filter(s => s !== opt.value)
                          : [...prev.focusSkills, opt.value],
                      }));
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      padding: '1rem 1.25rem',
                      background: isSelected ? `${T.red}15` : T.surface,
                      border: isSelected ? `2px solid ${T.red}` : '2px solid transparent',
                      borderRadius: 16,
                      color: T.text,
                      fontSize: '1.05rem',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      width: '100%',
                      textAlign: 'left' as const,
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>{opt.emoji}</span>
                    <span style={{ flex: 1 }}>{opt.label}</span>
                    <span style={{
                      width: 24, height: 24, borderRadius: 8,
                      border: isSelected ? `2px solid ${T.red}` : '2px solid rgba(255,255,255,0.2)',
                      background: isSelected ? T.red : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.85rem', color: '#fff', transition: 'all 0.2s',
                    }}>
                      {isSelected && '✓'}
                    </span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={goNext}
              disabled={answers.focusSkills.length === 0}
              style={{
                padding: '1rem',
                background: answers.focusSkills.length > 0 ? `linear-gradient(135deg, ${T.red}, #cc2f2f)` : T.surface,
                border: 'none',
                borderRadius: 16,
                color: answers.focusSkills.length > 0 ? '#fff' : T.textMuted,
                fontWeight: 700,
                fontSize: '1.05rem',
                cursor: answers.focusSkills.length > 0 ? 'pointer' : 'not-allowed',
                marginTop: '0.5rem',
                transition: 'all 0.3s',
                boxShadow: answers.focusSkills.length > 0 ? `0 4px 16px ${T.redGlow}` : 'none',
              }}
            >
              Continue <ArrowRight size={16} style={{ verticalAlign: 'middle' }} />
            </button>
          </>
        )}

        {/* Step 5: How did you find us */}
        {step === 'source' && (
          <>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🔍</div>
              <h1 style={{ color: T.text, fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
                How did you find us?
              </h1>
              <p style={{ color: T.textSoft, fontSize: '1rem', margin: 0 }}>
                This helps us improve
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <OptionCard emoji="📱" label="TikTok" value="tiktok" field="source" selected={answers.source === 'tiktok'} />
              <OptionCard emoji="📸" label="Instagram" value="instagram" field="source" selected={answers.source === 'instagram'} />
              <OptionCard emoji="📘" label="Facebook" value="facebook" field="source" selected={answers.source === 'facebook'} />
              <OptionCard emoji="▶️" label="YouTube" value="youtube" field="source" selected={answers.source === 'youtube'} />
              <OptionCard emoji="🔎" label="Google Search" value="google" field="source" selected={answers.source === 'google'} />
              <OptionCard emoji="👥" label="Friend / Word of mouth" value="friend" field="source" selected={answers.source === 'friend'} />
              <OptionCard emoji="💬" label="Reddit / Forum" value="reddit" field="source" selected={answers.source === 'reddit'} />
              <OptionCard emoji="🎯" label="Other" value="other" field="source" selected={answers.source === 'other'} />
            </div>
          </>
        )}

        {/* Step 6: Ready! */}
        {step === 'ready' && (
          <>
            <div style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 1rem' }}>
                <Image src="/mascot-beaver.png" alt="Castor" fill style={{ objectFit: 'contain' }} />
              </div>
              <h1 style={{ color: T.text, fontSize: '1.8rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
                You&apos;re all set! 🍁
              </h1>
              <p style={{ color: T.textSoft, fontSize: '1.05rem', margin: '0 0 1.5rem', lineHeight: 1.6 }}>
                {answers.testDate === '2weeks' 
                  ? "Your test is soon — let's start with intensive practice right now!"
                  : "Your personalized practice is ready. Let's start with your first exercise!"}
              </p>

              <div style={{
                background: T.surface,
                borderRadius: 16,
                padding: '1.25rem',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.3rem' }}>🎯</span>
                  <span style={{ color: T.textSoft, fontSize: '0.95rem' }}>
                    Goal: <strong style={{ color: T.text }}>{
                      { immigration: 'Canada PR', education: 'University', job: 'Job', professional: 'Designation', practice: 'Practice' }[answers.goal] || answers.goal
                    }</strong>
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.3rem' }}>⏱️</span>
                  <span style={{ color: T.textSoft, fontSize: '0.95rem' }}>
                    Daily: <strong style={{ color: T.text }}>{answers.dailyMinutes} min/day</strong>
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.3rem' }}>📚</span>
                  <span style={{ color: T.textSoft, fontSize: '0.95rem' }}>
                    Focus: <strong style={{ color: T.text, textTransform: 'capitalize' }}>{
                      answers.focusSkills.length === 4 ? 'All skills' : answers.focusSkills.join(', ')
                    }</strong>
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={async () => {
                // Save onboarding data
                localStorage.setItem('celpip_onboarding', JSON.stringify({ ...answers, completed: true, date: new Date().toISOString() }));
                try { await fetch('/api/onboarding', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(answers) }); } catch (e) {}
                goNext();
              }}
              style={{
                padding: '1.1rem 2rem',
                background: `linear-gradient(135deg, ${T.red}, #cc2f2f)`,
                border: 'none',
                borderRadius: 16,
                color: '#fff',
                fontWeight: 800,
                fontSize: '1.15rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: `0 4px 20px ${T.redGlow}`,
                transition: 'transform 0.2s',
                width: '100%',
              }}
            >
              <Sparkles size={20} />
              Let&apos;s Go!
              <ArrowRight size={20} />
            </button>

            <p style={{ color: T.textMuted, fontSize: '0.85rem', textAlign: 'center', margin: 0 }}>
              3 free exercises daily • No credit card needed
            </p>
          </>
        )}

        {/* Step 6: Choose skill to practice now */}
        {step === 'start' && (
          <>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🚀</div>
              <h1 style={{ color: T.text, fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
                What do you want to practice now?
              </h1>
              <p style={{ color: T.textSoft, fontSize: '1rem', margin: 0 }}>
                Pick a skill and start your first exercise
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[
                { emoji: '👂', label: 'Listening', value: 'listening', color: '#3b82f6', desc: 'Audio exercises' },
                { emoji: '📖', label: 'Reading', value: 'reading', color: '#22c55e', desc: 'Comprehension' },
                { emoji: '✍️', label: 'Writing', value: 'writing', color: '#f59e0b', desc: 'Email & essay' },
                { emoji: '🗣️', label: 'Speaking', value: 'speaking', color: '#8b5cf6', desc: 'Record & AI feedback' },
              ].map(skill => (
                <button
                  key={skill.value}
                  onClick={() => router.push(`/ai-coach?skill=${skill.value}`)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                    padding: '1.5rem 1rem',
                    background: T.surface,
                    border: '2px solid transparent',
                    borderRadius: 20,
                    color: T.text,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden',
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
              onClick={() => router.push('/dashboard')}
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
