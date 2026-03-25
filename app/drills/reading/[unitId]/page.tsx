'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, ArrowRight, Sparkles, Trophy, BookOpen } from 'lucide-react';
import { usePlan } from '@/hooks/usePlan';
import { useGuest } from '@/hooks/useGuest';
import GuestWall from '@/components/GuestWall';

const T = {
  bg: '#1b1f2a', surface: '#232733', border: 'rgba(255,255,255,0.06)',
  text: '#ffffff', textMuted: 'rgba(255,255,255,0.5)', textSoft: 'rgba(255,255,255,0.7)',
  red: '#ff3b3b', green: '#22c55e', purple: '#8b5cf6', blue: '#3b82f6',
  gold: '#f59e0b', teal: '#14b8a6',
};

interface Exercise {
  type: 'readChoose';
  passage: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface Unit {
  id: number; title: string; subtitle: string; icon: string; level: string;
  lesson: { title: string; points: string[] };
  exercises: Exercise[];
}

export default function ReadingUnitPage() {
  const router = useRouter();
  const params = useParams();
  const unitId = Number(params.unitId);
  const { isPro, loading: planLoading } = usePlan();
  const { isGuest, guestBlocked, guardAction, showWall, setShowWall, checkDone, trackExercise } = useGuest();

  const [unit, setUnit] = useState<Unit | null>(null);
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [freeUsed, setFreeUsed] = useState(0);
  const [freeLimit, setFreeLimit] = useState(10);
  const [freeBlocked, setFreeBlocked] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [animateIn, setAnimateIn] = useState(true);
  const [showPassage, setShowPassage] = useState(true);
  const [shuffledOpts, setShuffledOpts] = useState<{label: string; origIdx: number}[]>([]);
  const [done, setDone] = useState(false);
  const feedbackRef = useRef<HTMLDivElement>(null);

  // Hide global nav
  useEffect(() => {
    const selectors = ['header', '.sidebar', '.bottomnav', '.bottom-nav', '[class*="BottomNav"]', '[class*="bottomNav"]', '.fab', '[class*="fab"]', 'footer', 'nav'];
    const hidden: HTMLElement[] = [];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        const h = el as HTMLElement;
        if (h.style.display !== 'none') {
          h.dataset.prevDisplay = h.style.display;
          h.style.display = 'none';
          hidden.push(h);
        }
      });
    });
    return () => { hidden.forEach(h => { h.style.display = h.dataset.prevDisplay || ''; }); };
  }, []);

  // Load data
  useEffect(() => {
    fetch('/data/courses/reading.json').then(r => r.json()).then((data: Unit[]) => {
      const u = data.find(u => u.id === unitId);
      if (u) {
        const exercises = [...u.exercises];
        const triplets: Exercise[][] = [];
        for (let i = 0; i < exercises.length; i += 3) triplets.push(exercises.slice(i, i + 3));
        for (let i = triplets.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [triplets[i], triplets[j]] = [triplets[j], triplets[i]];
        }
        setUnit({ ...u, exercises: triplets.flat() });
      }
    });
    if (!isGuest) fetch('/api/daily-usage?category=drills').then(r => r.json()).then(data => {
      if (data.isPro) return;
      setFreeUsed(data.used || 0);
      setFreeLimit(data.limit || 10);
    }).catch(() => {});
  }, [unitId]);

  // Shuffle options
  const exercise = unit?.exercises?.[exerciseIdx];
  useEffect(() => {
    if (!exercise?.options) return;
    const mapped = exercise.options.map((label: string, origIdx: number) => ({ label, origIdx }));
    for (let i = mapped.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [mapped[i], mapped[j]] = [mapped[j], mapped[i]];
    }
    setShuffledOpts(mapped);
    setSelected(null);
    setAnswered(false);
    setShowPassage(true);
  }, [exerciseIdx, exercise]);

  const handleAnswer = useCallback((shuffledIdx: number) => {
    if (answered || !exercise || shuffledOpts.length === 0) return;
    const origIdx = shuffledOpts[shuffledIdx].origIdx;
    const correct = origIdx === exercise.correct;
    setSelected(shuffledIdx);
    setAnswered(true);
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);
    if (isGuest) trackExercise();
    setTotal(t => t + 1);

    if (isGuest) {
      
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('exercise-complete'));
    } else {
      fetch('/api/log-activity', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'reading', count: 1 }),
      }).catch(() => {});

      if (typeof window !== 'undefined') window.dispatchEvent(new Event('exercise-complete'));

      if (!isPro) {
        fetch('/api/daily-usage', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: 'drills' }),
        }).then(r => r.json()).then(data => { if (!data.isPro) setFreeUsed(data.used || 0); }).catch(() => {});
      }
    }

    setTimeout(() => {
      feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }, [answered, exercise, shuffledOpts, isPro]);

  const nextExercise = useCallback(() => {
    if (!unit) return;
    if (!isPro && freeUsed >= freeLimit) { setFreeBlocked(true); return; }
    if (exerciseIdx + 1 >= unit.exercises.length) { setDone(true); return; }
    setAnimateIn(false);
    setTimeout(() => { setExerciseIdx(i => i + 1); setAnimateIn(true); }, 200);
  }, [unit, exerciseIdx, isPro, freeUsed, freeLimit]);

  if (planLoading || !unit) return <div style={{ minHeight: '100vh', background: T.bg }} />;

  // Paywall

  if ((isGuest ? guestBlocked : freeBlocked) && !isPro) {
    return (
      <div style={{ minHeight: '100vh', background: T.bg, color: T.text, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔥</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>You&apos;re on fire!</h2>
        <p style={{ color: T.textMuted, marginBottom: '1.5rem', lineHeight: 1.6 }}>
          You&apos;ve completed your {freeLimit} free exercises for today.<br />
          Come back tomorrow or upgrade for unlimited practice!
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: 280 }}>
          <Link href="/pricing" style={{ background: `linear-gradient(135deg, ${T.teal}, ${T.blue})`, color: '#fff', fontWeight: 700, padding: '0.85rem', borderRadius: 14, textAlign: 'center', textDecoration: 'none' }}>⚡ Upgrade to Pro</Link>
          <button onClick={() => router.push('/drills/reading')} style={{ background: T.surface, color: T.textSoft, fontWeight: 600, padding: '0.75rem', borderRadius: 14, border: `1px solid ${T.border}`, cursor: 'pointer' }}>← Back to Reading Drills</button>
        </div>
        <div style={{ marginTop: '1.5rem', background: T.surface, borderRadius: 16, padding: '1rem', border: `1px solid ${T.border}` }}>
          <p style={{ fontSize: '0.8rem', color: T.textSoft, margin: 0 }}>📊 Session: {score}/{total} correct ({total > 0 ? Math.round((score / total) * 100) : 0}%)</p>
        </div>
      </div>
    );
  }

  // Done
  if (done) {
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    return (
      <div style={{ minHeight: '100vh', background: T.bg, color: T.text, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
        <Trophy size={64} color={T.gold} style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Unit Complete!</h2>
        <p style={{ color: T.textMuted, marginBottom: '1.5rem' }}>You scored {score}/{total} ({pct}%)</p>
        <div style={{ width: 120, height: 120, borderRadius: '50%', background: `conic-gradient(${T.teal} ${pct * 3.6}deg, ${T.surface} 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: 96, height: 96, borderRadius: '50%', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800 }}>{pct}%</div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => router.push('/drills/reading')} style={{ background: T.surface, color: T.textSoft, fontWeight: 600, padding: '0.75rem 1.5rem', borderRadius: 14, border: `1px solid ${T.border}`, cursor: 'pointer' }}>← Back</button>
          <button onClick={() => window.location.reload()} style={{ background: `linear-gradient(135deg, ${T.teal}, ${T.blue})`, color: '#fff', fontWeight: 700, padding: '0.75rem 1.5rem', borderRadius: 14, border: 'none', cursor: 'pointer' }}>🔄 Try Again</button>
        </div>
      </div>
    );
  }

  if (!exercise) return null;

  const correctShuffledIdx = shuffledOpts.findIndex(o => o.origIdx === exercise.correct);
  const progress = ((exerciseIdx + 1) / unit.exercises.length) * 100;

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text, padding: '0 1rem 6rem', maxWidth: 600, margin: '0 auto', opacity: animateIn ? 1 : 0, transition: 'opacity 0.2s' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 0' }}>
        <button onClick={() => router.push('/drills/reading')} style={{ background: 'none', border: 'none', color: T.textMuted, cursor: 'pointer', display: 'flex' }}>
          <ArrowLeft size={22} />
        </button>
        <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', borderRadius: 4, background: `linear-gradient(90deg, ${T.teal}, ${T.blue})`, transition: 'width 0.3s' }} />
        </div>
        <span style={{ fontSize: '0.75rem', color: T.textMuted, fontWeight: 600, flexShrink: 0 }}>{exerciseIdx + 1}/∞</span>
      </div>

      {/* Score bar */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1rem', padding: '0.5rem', background: T.surface, borderRadius: 12, border: `1px solid ${T.border}` }}>
        <span style={{ fontSize: '0.8rem', color: T.green, fontWeight: 700 }}>✓ {score}</span>
        <span style={{ fontSize: '0.8rem', color: T.red, fontWeight: 700 }}>✗ {total - score}</span>
        <span style={{ fontSize: '0.8rem', color: T.textMuted }}>{total > 0 ? Math.round((score / total) * 100) : 0}%</span>
      </div>

      {/* Passage */}
      <div style={{
        background: `linear-gradient(135deg, rgba(20,184,166,0.08), rgba(59,130,246,0.05))`,
        borderRadius: 20, padding: '1.25rem', marginBottom: '1.25rem',
        border: '1px solid rgba(20,184,166,0.15)', maxHeight: showPassage ? 400 : 60,
        overflow: 'hidden', transition: 'max-height 0.3s', position: 'relative',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <BookOpen size={16} color={T.teal} />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: T.teal }}>Read the passage</span>
          <button onClick={() => setShowPassage(!showPassage)} style={{
            marginLeft: 'auto', background: 'none', border: 'none', color: T.textMuted,
            fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline',
          }}>
            {showPassage ? 'Collapse' : 'Expand'}
          </button>
        </div>
        <div style={{ fontSize: '0.85rem', color: T.textSoft, lineHeight: 1.7, whiteSpace: 'pre-line' }}>
          {exercise.passage}
        </div>
      </div>

      {/* Question */}
      <div style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.5 }}>
        {exercise.question}
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {shuffledOpts.map((opt, idx) => {
          const isSelected = selected === idx;
          const isThisCorrect = idx === correctShuffledIdx;
          let bg = T.surface;
          let borderColor = T.border;
          let icon = null;

          if (answered) {
            if (isThisCorrect) {
              bg = 'rgba(34,197,94,0.12)'; borderColor = T.green;
              icon = <CheckCircle size={20} color={T.green} />;
            } else if (isSelected && !isThisCorrect) {
              bg = 'rgba(255,59,59,0.12)'; borderColor = T.red;
              icon = <XCircle size={20} color={T.red} />;
            }
          }

          return (
            <button key={idx} onClick={() => handleAnswer(idx)} disabled={answered} style={{
              width: '100%', padding: '1rem 1.25rem', background: bg, borderRadius: 16,
              border: `2px solid ${borderColor}`, color: T.text,
              cursor: answered ? 'default' : 'pointer', textAlign: 'left',
              fontSize: '0.9rem', lineHeight: 1.5, display: 'flex', alignItems: 'center',
              gap: '0.75rem', transition: 'all 0.2s',
            }}>
              <span style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                background: answered && isThisCorrect ? `${T.green}22` : 'rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700, color: T.textMuted,
              }}>
                {icon || String.fromCharCode(65 + idx)}
              </span>
              <span style={{ flex: 1 }}>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {answered && (
        <div ref={feedbackRef} style={{
          marginTop: '1.25rem', padding: '1.25rem',
          background: isCorrect ? 'rgba(34,197,94,0.08)' : 'rgba(255,59,59,0.08)',
          borderRadius: 20, border: `1px solid ${isCorrect ? T.green : T.red}33`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {isCorrect
              ? <><CheckCircle size={20} color={T.green} /><span style={{ fontWeight: 700, color: T.green }}>Correct!</span></>
              : <><XCircle size={20} color={T.red} /><span style={{ fontWeight: 700, color: T.red }}>Not quite</span></>}
          </div>
          <p style={{ fontSize: '0.85rem', color: T.textSoft, lineHeight: 1.6, margin: 0 }}>
            {exercise.explanation}
          </p>
          <button onClick={nextExercise} style={{
            marginTop: '1rem', width: '100%',
            background: `linear-gradient(135deg, ${T.teal}, ${T.blue})`,
            color: '#fff', fontWeight: 700, padding: '0.85rem', borderRadius: 14,
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '0.5rem', fontSize: '0.95rem',
          }}>
            {exerciseIdx + 1 >= (unit?.exercises?.length || 0) ? 'See Results' : 'Next'}
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    {showWall && <GuestWall isLoggedIn={false} />}
    </div>
  );
}
