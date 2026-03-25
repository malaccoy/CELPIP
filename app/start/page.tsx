'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/* ═══ Theme ═══ */
const T = {
  bg: '#0f1523', surface: '#1b1f2a', surface2: '#232733', card: '#1e2235',
  text: '#fff', muted: 'rgba(255,255,255,0.55)', subtle: 'rgba(255,255,255,0.08)',
  red: '#ff3b3b', redGlow: 'rgba(255,59,59,0.35)',
  green: '#22c55e', blue: '#3b82f6', purple: '#a78bfa', orange: '#f97316',
  wrongBg: 'rgba(239,68,68,0.15)', wrongBorder: '#ef4444',
  correctBg: 'rgba(34,197,94,0.15)', correctBorder: '#22c55e',
};

interface AudioLine { voice: string; text: string; }
interface Exercise {
  label: string; part: string;
  audioLines: AudioLine[];
  question: string; options: string[]; correct: number; explanation: string;
}

/* ═══ 2 Listening exercises — real CELPIP-style dialogues ═══ */
const EXERCISES: Exercise[] = [
  {
    label: 'Listening — Part 1: Problem Solving',
    part: 'Part 1',
    audioLines: [
      { voice: 'male', text: "Doctor, I've been getting terrible headaches almost every day for the past two weeks. I've tried regular painkillers but they barely help." },
      { voice: 'female', text: "I see. Are the headaches worse at any particular time of day?" },
      { voice: 'male', text: "Yes, they're usually worst in the morning when I wake up, and they get a bit better in the afternoon." },
      { voice: 'female', text: "Morning headaches can be related to sleep issues. Are you getting enough sleep? And have you noticed any changes in your vision?" },
      { voice: 'male', text: "Actually, now that you mention it, I have been staying up late working on my computer, and sometimes my vision gets blurry." },
      { voice: 'female', text: "That could be the problem. Extended screen time, especially before bed, can cause eye strain and disrupt your sleep cycle. I'd recommend limiting screen time to no more than one hour before bed, and I'll refer you to an optometrist to check your vision. Let's also do some blood work to rule out anything else." },
    ],
    question: 'What does the doctor think is causing the headaches?',
    options: [
      'A serious brain condition',
      'Too much screen time and poor sleep habits',
      'An allergic reaction to medication',
      'High blood pressure',
    ],
    correct: 1,
    explanation: 'The doctor says "extended screen time, especially before bed, can cause eye strain and disrupt your sleep cycle" — pointing to screen time and sleep as the likely cause.',
  },
  {
    label: 'Listening — Part 3: Information',
    part: 'Part 3',
    audioLines: [
      { voice: 'female', text: "Welcome to the Toronto Public Library orientation. I'd like to tell you about some changes to our services starting next month." },
      { voice: 'female', text: "First, we're extending our hours. Starting March first, the library will be open from eight AM to nine PM on weekdays, and ten AM to six PM on weekends. That's two extra hours on weekday evenings." },
      { voice: 'female', text: "Second, we're launching a new digital borrowing system. You'll be able to borrow up to five e-books and three audiobooks at a time using our app. The loan period for digital items is twenty-one days with one automatic renewal." },
      { voice: 'female', text: "Third, our study rooms can now be booked online up to seven days in advance. Each booking is limited to three hours, and you can make up to two bookings per week." },
      { voice: 'female', text: "Finally, we're introducing free Wi-Fi printing. Library members can print up to twenty pages per day at no charge. Just connect to our Wi-Fi and use the print station on the second floor." },
    ],
    question: 'How many e-books can you borrow at one time with the new system?',
    options: [
      'Three',
      'Five',
      'Seven',
      'Twenty-one',
    ],
    correct: 1,
    explanation: 'The librarian says "you\'ll be able to borrow up to five e-books and three audiobooks at a time." Five is the limit for e-books.',
  },
];

/* ═══ TTS — pass key: male/female/narrator ═══ */
async function playLineTTS(text: string, voice: string): Promise<void> {
  const v = voice === 'male' ? 'male' : voice === 'narrator' ? 'narrator' : 'female';
  try {
    const res = await fetch(`/api/tts?text=${encodeURIComponent(text)}&voice=${v}`);
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    await new Promise<void>((resolve) => {
      const a = new Audio(url);
      a.onended = () => { URL.revokeObjectURL(url); resolve(); };
      a.onerror = () => { URL.revokeObjectURL(url); resolve(); };
      a.play().catch(() => resolve());
    });
  } catch {}
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

const CSS = `
@keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
@keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(255,59,59,.2)} 50%{box-shadow:0 0 40px rgba(255,59,59,.4)} }
.fade-up { animation: fadeUp .5s ease-out both; }
.btn-hover:active { transform: scale(.97) !important; }
`;

/* ══════════════════════ COMPONENT ══════════════════════ */
export default function StartPage() {
  const router = useRouter();
  type Step = 'intro' | 'exercise' | 'results';
  const [step, setStep] = useState<Step>('intro');
  const [exIdx, setExIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [shuffledOpts, setShuffledOpts] = useState<{ text: string; origIdx: number }[]>([]);
  const feedbackRef = useRef<HTMLDivElement>(null);

  const [audioPhase, setAudioPhase] = useState<'idle' | 'playing' | 'done'>('idle');
  const [activeLineIdx, setActiveLineIdx] = useState(-1);

  const ex = EXERCISES[exIdx] || null;

  useEffect(() => {
    if (!ex) return;
    setShuffledOpts(shuffle(ex.options.map((t, i) => ({ text: t, origIdx: i }))));
    setSelected(null); setAnswered(false); setIsCorrect(false);
    setAudioPhase('idle'); setActiveLineIdx(-1);
  }, [exIdx]);

  const playAudio = useCallback(async () => {
    if (!ex || audioPhase === 'playing') return;
    setAudioPhase('playing');
    for (let i = 0; i < ex.audioLines.length; i++) {
      setActiveLineIdx(i);
      await playLineTTS(ex.audioLines[i].text, ex.audioLines[i].voice);
    }
    setActiveLineIdx(-1);
    setAudioPhase('done');
  }, [ex, audioPhase]);

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx); setAnswered(true);
    const origIdx = shuffledOpts[idx]?.origIdx ?? idx;
    const correct = ex!.correct === origIdx;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);
    setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
  };

  const handleNext = () => {
    if (exIdx + 1 >= EXERCISES.length) setStep('results');
    else { setExIdx(exIdx + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  };

  const goSignup = () => { localStorage.setItem('redirect_after_login', '/dashboard'); router.push('/auth/register?ref=start'); };
  const goLogin = () => { localStorage.setItem('redirect_after_login', '/dashboard'); router.push('/auth/login'); };

  /* ═══ INTRO ═══ */
  if (step === 'intro') return (
    <>
      <style>{CSS}</style>
      <div style={{
        minHeight: '100dvh', background: `linear-gradient(180deg, ${T.bg} 0%, #0d1220 50%, #131832 100%)`,
        color: T.text, display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '0 16px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        <div style={{ width: '100%', maxWidth: 440, padding: '20px 0 8px', display: 'flex', justifyContent: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: T.muted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>🎯 CELPIP AI Coach</span>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', maxWidth: 400, textAlign: 'center' }}>
          <h1 className="fade-up" style={{ fontSize: 'clamp(1.7rem, 7vw, 2.4rem)', fontWeight: 900, margin: '0 0 8px', lineHeight: 1.15, letterSpacing: '-0.03em' }}>
            Test your<br /><span style={{ background: 'linear-gradient(90deg, #3b82f6, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CELPIP Listening</span>
          </h1>
          <p className="fade-up" style={{ color: T.muted, fontSize: 'clamp(0.85rem, 3.5vw, 0.95rem)', margin: '0 0 28px', lineHeight: 1.6, animationDelay: '.08s' }}>
            Listen to <strong style={{ color: T.text }}>2 real conversations</strong> and answer — just like the real exam
          </p>

          {/* Feature cards */}
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 360, marginBottom: 28, animationDelay: '.15s' }}>
            {[
              { icon: '🔊', title: 'Real voices', desc: 'Male & female speakers — just like the test', color: T.blue },
              { icon: '🎯', title: '2 CELPIP tasks', desc: 'Part 1 (Problem Solving) + Part 3 (Information)', color: T.purple },
              { icon: '⚡', title: 'Instant feedback', desc: 'See the correct answer with explanation', color: T.green },
            ].map((f, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                background: `${f.color}08`, border: `1px solid ${f.color}18`, borderRadius: 14,
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${f.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{f.icon}</div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{f.title}</div>
                  <div style={{ fontSize: '0.75rem', color: T.muted, lineHeight: 1.4 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <button className="btn-hover fade-up" onClick={() => setStep('exercise')} style={{
            width: '100%', maxWidth: 360, padding: '17px 24px', borderRadius: 16, border: 'none',
            background: `linear-gradient(135deg, ${T.blue}, #2563eb)`, color: '#fff',
            fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer',
            boxShadow: `0 6px 28px ${T.blue}35`, animationDelay: '.25s',
            animation: 'fadeUp .5s ease-out .25s both',
          }}>
            🎧 Start Listening Practice
          </button>

          <div className="fade-up" style={{ display: 'flex', gap: 14, marginTop: 16, fontSize: 12, color: T.muted, animationDelay: '.35s' }}>
            <span>✅ Free</span><span>⚡ 2 min</span><span>🔒 No signup</span>
          </div>
        </div>

        <div style={{ padding: '16px 0 28px', textAlign: 'center' }}>
          <div style={{ padding: '8px 16px', borderRadius: 10, fontSize: 12, color: T.muted, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {['🇨🇦','🇮🇳','🇧🇷'].map((f, i) => <span key={i} style={{ fontSize: 14, marginLeft: i ? -4 : 0 }}>{f}</span>)}
            <span>Trusted by <strong style={{ color: T.text }}>350+</strong> students</span>
          </div>
        </div>
      </div>
    </>
  );

  /* ═══ RESULTS ═══ */
  if (step === 'results') {
    const pct = score / EXERCISES.length;
    const scoreColor = pct >= 0.8 ? T.green : pct >= 0.5 ? T.orange : T.red;
    return (
      <>
        <style>{CSS}</style>
        <div style={{
          minHeight: '100dvh', background: `linear-gradient(180deg, ${T.bg} 0%, #131832 100%)`,
          color: T.text, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '24px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}>
          <div className="fade-up" style={{
            width: 130, height: 130, borderRadius: '50%', margin: '0 auto 20px',
            background: `conic-gradient(${scoreColor} ${pct * 360}deg, ${T.surface2} 0deg)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 40px ${scoreColor}30`,
          }}>
            <div style={{ width: 104, height: 104, borderRadius: '50%', background: T.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: 30, fontWeight: 800 }}>{score}/{EXERCISES.length}</div>
              <div style={{ fontSize: 11, color: T.muted }}>correct</div>
            </div>
          </div>

          <h2 className="fade-up" style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 6px', animationDelay: '.1s' }}>
            {pct >= 1 ? 'Perfect! 🎉' : pct >= 0.5 ? 'Good start! 👏' : 'Keep practicing! 💪'}
          </h2>
          <p className="fade-up" style={{ color: T.muted, margin: '0 0 6px', fontSize: '0.88rem', textAlign: 'center', animationDelay: '.15s' }}>
            That was just 2 questions from the Listening section.
          </p>
          <p className="fade-up" style={{ color: T.text, margin: '0 0 24px', fontSize: '0.95rem', fontWeight: 700, textAlign: 'center', animationDelay: '.2s' }}>
            Want to practice <span style={{ color: T.blue }}>Speaking</span>, <span style={{ color: T.purple }}>Reading</span> & <span style={{ color: T.orange }}>Writing</span> too?
          </p>

          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24, maxWidth: 320, width: '100%', animationDelay: '.25s' }}>
            {[
              ['🎯', '10 free exercises daily'],
              ['🗣️', 'Speaking with AI feedback'],
              ['🎧', 'Full listening with real voices'],
              ['📖', 'Reading passages & comprehension'],
              ['📊', 'Track your progress & rank up'],
            ].map(([e, t], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)' }}>
                <span style={{ fontSize: 16 }}>{e}</span><span>{t}</span>
              </div>
            ))}
          </div>

          <button className="btn-hover fade-up" onClick={goSignup} style={{
            width: '100%', maxWidth: 320, padding: '16px', borderRadius: 14, border: 'none',
            background: `linear-gradient(135deg, ${T.red}, #ff5252)`, color: '#fff',
            fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer',
            boxShadow: `0 4px 20px ${T.redGlow}`, animationDelay: '.3s',
            animation: 'glow 2.5s infinite, fadeUp .5s ease-out .3s both',
          }}>
            Create Free Account 🚀
          </button>
          <p className="fade-up" style={{ margin: '14px 0', fontSize: '0.8rem', color: T.muted, animationDelay: '.35s' }}>
            Already have an account? <span onClick={goLogin} style={{ color: T.blue, cursor: 'pointer', textDecoration: 'underline' }}>Log in</span>
          </p>
        </div>
      </>
    );
  }

  /* ═══ EXERCISE ═══ */
  if (!ex) return null;
  const canAnswer = audioPhase === 'done';
  const uniqueVoices = [...new Set(ex.audioLines.map(l => l.voice))];

  return (
    <>
      <style>{CSS}</style>
      <div style={{
        minHeight: '100dvh', background: T.bg, color: T.text,
        padding: '16px 16px 40px', maxWidth: 520, margin: '0 auto',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontSize: 15, fontWeight: 800 }}>🎯 CELPIP <span style={{ color: T.red }}>AI Coach</span></span>
          <span style={{ fontSize: 11, color: T.muted, background: T.surface2, padding: '4px 10px', borderRadius: 8 }}>Free Trial</span>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 5, background: T.surface2, borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 3,
              background: `linear-gradient(90deg, ${T.blue}, #60a5fa)`,
              width: `${((exIdx + (answered ? 1 : 0)) / EXERCISES.length) * 100}%`,
              transition: 'width .4s',
            }} />
          </div>
          <span style={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>{exIdx + 1}/{EXERCISES.length}</span>
        </div>

        {/* Part badge */}
        <div className="fade-up" style={{
          display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px',
          background: `${T.blue}15`, border: `1px solid ${T.blue}30`,
          borderRadius: 20, fontSize: 12, fontWeight: 700, color: T.blue, marginBottom: 14,
        }}>
          🎧 {ex.label}
        </div>

        {/* Audio player */}
        <div className="fade-up" style={{
          background: 'linear-gradient(135deg, #0f1a3a 0%, #162044 50%, #1a2550 100%)',
          borderRadius: 18, padding: '20px 18px', marginBottom: 16, textAlign: 'center',
          border: `1px solid ${T.blue}15`, boxShadow: `0 4px 24px ${T.blue}10`,
        }}>
          {/* Speaker avatars */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 14 }}>
            {uniqueVoices.map((voice, i) => {
              const isActive = activeLineIdx >= 0 && ex.audioLines[activeLineIdx]?.voice === voice;
              const isMale = voice === 'male';
              const color = isMale ? '#3b82f6' : '#ec4899';
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: isActive ? `${color}30` : `${color}10`,
                    border: `2.5px solid ${isActive ? color : `${color}25`}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, transition: 'all .2s',
                    boxShadow: isActive ? `0 0 20px ${color}40` : 'none',
                    animation: isActive ? 'pulse 1s infinite' : 'none',
                  }}>{isMale ? '👨' : '👩'}</div>
                  <span style={{ fontSize: 10, color: isActive ? color : T.muted, fontWeight: 600 }}>
                    {isMale ? 'Speaker 1' : 'Speaker 2'}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ fontSize: '0.78rem', color: T.muted, marginBottom: 14 }}>
            {audioPhase === 'idle' ? 'Tap play and listen carefully' : audioPhase === 'playing' ? 'Listen to both speakers...' : '✅ Audio finished — answer below'}
          </div>

          <button className="btn-hover" onClick={playAudio} disabled={audioPhase === 'playing'} style={{
            background: audioPhase === 'done' ? 'rgba(255,255,255,0.08)' : `linear-gradient(135deg, ${T.blue}, #2563eb)`,
            border: audioPhase === 'done' ? `1px solid rgba(255,255,255,0.12)` : 'none',
            color: '#fff', borderRadius: 12, padding: '13px 28px', cursor: audioPhase === 'playing' ? 'default' : 'pointer',
            fontWeight: 700, fontSize: '0.9rem', opacity: audioPhase === 'playing' ? .6 : 1,
            boxShadow: audioPhase !== 'done' ? `0 4px 16px ${T.blue}30` : 'none',
          }}>
            {audioPhase === 'idle' ? '▶️  Play Audio' : audioPhase === 'playing' ? '🔊 Playing...' : '🔁 Play Again'}
          </button>
        </div>

        {/* Question */}
        <div style={{
          background: T.card, borderRadius: 14, padding: '12px 14px', marginBottom: 12,
          fontSize: '0.92rem', lineHeight: 1.55, fontWeight: 600, border: `1px solid ${T.subtle}`,
          opacity: canAnswer ? 1 : .3, transition: 'opacity .3s',
        }}>{ex.question}</div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, opacity: canAnswer ? 1 : .25, pointerEvents: canAnswer ? 'auto' : 'none', transition: 'opacity .3s' }}>
          {shuffledOpts.map((opt, i) => {
            const isSel = selected === i;
            const isC = answered && opt.origIdx === ex.correct;
            const isW = answered && isSel && !isC;
            const L = ['A', 'B', 'C', 'D'];
            let bg = T.surface2, bdr = T.subtle, lBg = 'rgba(255,255,255,0.06)', lC = T.muted;
            if (isC) { bg = T.correctBg; bdr = T.correctBorder; lBg = T.green; lC = '#fff'; }
            if (isW) { bg = T.wrongBg; bdr = T.wrongBorder; lBg = T.wrongBorder; lC = '#fff'; }
            return (
              <button key={i} className="btn-hover" onClick={() => handleAnswer(i)} disabled={answered} style={{
                background: bg, border: `1.5px solid ${bdr}`, borderRadius: 12, padding: '12px 14px',
                cursor: answered ? 'default' : 'pointer', textAlign: 'left', fontSize: '0.85rem', lineHeight: 1.5,
                color: T.text, transition: 'all .15s', display: 'flex', alignItems: 'flex-start', gap: 10,
              }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, borderRadius: '50%', flexShrink: 0, background: lBg, color: lC, fontSize: 12, fontWeight: 700 }}>
                  {isC ? '✓' : isW ? '✗' : L[i]}
                </span>
                <span>{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {answered && (
          <div ref={feedbackRef} className="fade-up" style={{ marginTop: 14, borderRadius: 14, padding: 14, background: isCorrect ? T.correctBg : T.wrongBg, border: `1px solid ${isCorrect ? T.correctBorder : T.wrongBorder}` }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 6 }}>{isCorrect ? '✅ Correct!' : '❌ Not quite'}</div>
            <div style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{ex.explanation}</div>
            <button className="btn-hover" onClick={handleNext} style={{
              marginTop: 14, background: `linear-gradient(135deg, ${T.blue}, #2563eb)`, border: 'none', color: '#fff',
              borderRadius: 12, padding: '13px 20px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', width: '100%',
              boxShadow: `0 4px 16px ${T.blue}30`,
            }}>
              {exIdx + 1 < EXERCISES.length ? 'Next Question →' : 'See Results 🎯'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
