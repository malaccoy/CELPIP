'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, ArrowRight, BookOpen, Sparkles, Trophy } from 'lucide-react';
import { usePlan } from '@/hooks/usePlan';
import ExerciseOfferPopup from '@/components/ExerciseOfferPopup';

const T = {
  bg: '#1b1f2a',
  surface: '#232733',
  border: 'rgba(255,255,255,0.06)',
  text: '#ffffff',
  textMuted: 'rgba(255,255,255,0.5)',
  textSoft: 'rgba(255,255,255,0.7)',
  red: '#ff3b3b',
  green: '#22c55e',
  purple: '#8b5cf6',
  blue: '#3b82f6',
  gold: '#f59e0b',
};

interface Exercise {
  type: 'choose' | 'fillGap' | 'match' | 'reorder' | 'speak';
  question?: string;
  sentence?: string;
  instruction?: string;
  options?: string[];
  correct?: number | number[];
  explanation?: string;
  pairs?: { left: string; right: string }[];
  words?: string[];
  targetPhrase?: string;
}

interface Unit {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  level: string;
  lesson: { title: string; points: string[] };
  exercises: Exercise[];
}

export default function UnitPage() {
  const router = useRouter();
  const params = useParams();
  const unitId = Number(params.unitId);
  const { isPro, loading: planLoading } = usePlan();

  const [unit, setUnit] = useState<Unit | null>(null);
  const [course, setCourse] = useState<any>(null);
  const [freeUnits, setFreeUnits] = useState(6);
  const ttsRef = useRef<HTMLAudioElement | null>(null);
  
  const [phase, setPhase] = useState<'exercise' | 'result'>('exercise');
  const [showOffer, setShowOffer] = useState(false);
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [freeUsed, setFreeUsed] = useState(0);
  const [freeLimit, setFreeLimit] = useState(10);
  const [freeBlocked, setFreeBlocked] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [matchSelected, setMatchSelected] = useState<{ side: 'left' | 'right'; idx: number } | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const [reorderItems, setReorderItems] = useState<number[]>([]);
  const [reorderAnswer, setReorderAnswer] = useState<number[]>([]);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [animateIn, setAnimateIn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [speechResult, setSpeechResult] = useState('');
  const [speechScore, setSpeechScore] = useState<number | null>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);

  // Hide global nav elements
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
    return () => {
      hidden.forEach(h => { h.style.display = h.dataset.prevDisplay || ''; });
    };
  }, []);

  useEffect(() => {
    fetch('/data/courses/writing.json').then(r => r.json()).then(data => {
      setCourse(data);
      const u = data.units.find((u: Unit) => u.id === unitId);
      setFreeUnits(data.freeUnits || 6);
      if (u) {
        // Shuffle by triplet blocks (3 exercises per block stay together)
        const exercises = [...u.exercises];
        const triplets: any[][] = [];
        for (let i = 0; i < exercises.length; i += 3) {
          triplets.push(exercises.slice(i, i + 3));
        }
        // Fisher-Yates shuffle on triplet blocks
        for (let i = triplets.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [triplets[i], triplets[j]] = [triplets[j], triplets[i]];
        }
        setUnit({ ...u, exercises: triplets.flat() });
      }
    });
    // Load daily free usage
    fetch('/api/daily-usage?category=drills')
      .then(r => r.json())
      .then(data => {
        if (data.isPro) return;
        setFreeUsed(data.used || 0);
        setFreeLimit(data.limit || 5);
        if (data.remaining <= 0) setFreeBlocked(true);
      })
      .catch(() => {});
  }, [unitId]);

  // Lock check
  const FREE_EXERCISES = freeLimit;
  const hitPaywall = !isPro && (freeBlocked || (freeUsed + total) > FREE_EXERCISES);

  const exercise = unit?.exercises[exerciseIdx];

  // Shuffle options for choose/fillGap so correct answer isn't always in same position
  const [shuffledOpts, setShuffledOpts] = useState<{ label: string; origIdx: number }[]>([]);
  useEffect(() => {
    if (exercise && (exercise.type === 'choose' || exercise.type === 'fillGap') && exercise.options) {
      const mapped = exercise.options.map((o: string, i: number) => ({ label: o, origIdx: i }));
      for (let i = mapped.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mapped[i], mapped[j]] = [mapped[j], mapped[i]];
      }
      setShuffledOpts(mapped);
    }
  }, [exerciseIdx, exercise]);

  // Shuffle reorder items on new exercise
  useEffect(() => {
    if (exercise?.type === 'reorder' && exercise.words) {
      const indices = exercise.words.map((_: string, i: number) => i);
      // Shuffle
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      setReorderItems(indices);
      setReorderAnswer([]);
    }
  }, [exerciseIdx, exercise?.type]);

  // Log activity + earn XP + count daily usage
  const logExercise = useCallback(() => {
    fetch('/api/log-activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'writing', count: 1 }),
    }).catch(() => {});
    // Trigger feedback popup after 2 exercises
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('exercise-complete'));
    // Increment daily usage for free tier
    if (!isPro) {
      fetch('/api/daily-usage', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ category: 'drills' }) })
        .then(r => r.json())
        .then(data => {
          if (data.used) setFreeUsed(data.used);
          if (data.remaining <= 0) setFreeBlocked(true);
        })
        .catch(() => {});
    }
  }, [isPro]);

  const handleAnswer = useCallback((selectedIdx: number) => {
    if (answered || !exercise) return;
    setSelected(selectedIdx);
    setAnswered(true);
    // Map back to original index for correctness check
    const origIdx = shuffledOpts[selectedIdx]?.origIdx ?? selectedIdx;
    const correct = exercise.correct as number === origIdx;
    setIsCorrect(correct);
    setTotal(t => t + 1); logExercise();
    if (correct) setScore(s => s + 1);
    setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
  }, [answered, exercise, shuffledOpts]);

  const handleMatchTap = useCallback((side: 'left' | 'right', idx: number) => {
    if (!exercise?.pairs || matched.includes(idx)) return;
    if (!matchSelected) {
      setMatchSelected({ side, idx });
    } else if (matchSelected.side !== side) {
      // Check if this pair is correct
      const leftIdx = side === 'left' ? idx : matchSelected.idx;
      const rightIdx = side === 'right' ? idx : matchSelected.idx;
      if (leftIdx === rightIdx) {
        setMatched(m => [...m, leftIdx]);
      }
      setMatchSelected(null);
      // Check if all matched
      if (matched.length + 1 === exercise.pairs.length) {
        setAnswered(true);
        setIsCorrect(true);
        setTotal(t => t + 1); logExercise();
        setScore(s => s + 1);
        setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
      }
    } else {
      setMatchSelected({ side, idx });
    }
  }, [matchSelected, matched, exercise]);

  const handleReorderSelect = useCallback((wordIdx: number) => {
    if (answered) return;
    // Move from pool to answer
    setReorderItems(items => items.filter(i => i !== wordIdx));
    setReorderAnswer(ans => {
      const newAns = [...ans, wordIdx];
      const correctOrder = (exercise?.correct as number[]) || [];
      // Check if complete and correct
      if (newAns.length === correctOrder.length) {
        const isCorrectOrder = newAns.every((v, i) => v === correctOrder[i]);
        setAnswered(true);
        setIsCorrect(isCorrectOrder);
        setTotal(t => t + 1); logExercise();
        if (isCorrectOrder) setScore(s => s + 1);
        setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
      }
      return newAns;
    });
  }, [answered, exercise]);

  const handleReorderDeselect = useCallback((idx: number) => {
    if (answered) return;
    const wordIdx = reorderAnswer[idx];
    setReorderAnswer(ans => ans.filter((_, i) => i !== idx));
    setReorderItems(items => [...items, wordIdx]);
  }, [answered, reorderAnswer]);

  const nextExercise = () => {
    if (!unit) return;
    if (exerciseIdx + 1 >= unit.exercises.length) {
      // Save completion
      // Save completion to DB
      fetch('/api/drill-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drillType: 'writing', levelId: unitId, score, total: unit.exercises.length, completed: true }),
      }).catch(() => {});
      setPhase('result');
      if (!isPro) {
        const shown = sessionStorage.getItem('offerShown');
        if (!shown) { setTimeout(() => setShowOffer(true), 1500); sessionStorage.setItem('offerShown', '1'); }
      }
      return;
    }
    setAnimateIn(false);
    // Save partial progress for free tier tracking
    if (!isPro) {
      fetch('/api/drill-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drillType: 'writing', levelId: unitId, score, total: freeUsed + total }),
      }).catch(() => {});
    }
    setTimeout(() => {
      setExerciseIdx(i => i + 1);
      setSelected(null);
      setAnswered(false);
      setIsCorrect(false);
      setMatchSelected(null);
      setMatched([]);
      setReorderAnswer([]);
      setSpeechResult('');
      setSpeechScore(null);
      setAnimateIn(true);
    }, 200);
  };

  const [ttsPlaying, setTtsPlaying] = useState(false);
  const playTTS = (text: string) => {
    if (ttsRef.current) { ttsRef.current.pause(); ttsRef.current.src = ''; ttsRef.current = null; }
    setTtsPlaying(true);
    const a = new Audio(`/api/tts?text=${encodeURIComponent(text)}`);
    ttsRef.current = a;
    a.onended = () => { ttsRef.current = null; setTtsPlaying(false); };
    a.onerror = () => { ttsRef.current = null; setTtsPlaying(false); };
    a.play().catch(() => setTtsPlaying(false));
  };

  if (planLoading || !unit) return <div style={{ minHeight: '100vh', background: T.bg }} />;

  // ─── RESULT PHASE ───
  if (phase === 'result') {
    const pct = Math.round((score / total) * 100);
    const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '💪';
    const msg = pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good job!' : 'Keep practicing!';
    const nextUnit = unitId + 1;
    const hasNext = nextUnit <= (course?.totalUnits ? course.totalUnits - 1 : 2);

    return (
      <div style={{ minHeight: '100vh', background: T.bg, color: T.text, padding: '2rem 1rem', textAlign: 'center' }}>
        <ExerciseOfferPopup show={showOffer} onClose={() => setShowOffer(false)} />
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{emoji}</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>{msg}</h1>
        <p style={{ color: T.textMuted, fontSize: '1rem', marginBottom: '2rem' }}>
          Unit {unitId}: {unit.title}
        </p>

        <div style={{
          background: T.surface,
          borderRadius: 16,
          padding: '2rem',
          border: `1px solid ${T.border}`,
          marginBottom: '2rem',
          maxWidth: 360,
          margin: '0 auto 2rem',
        }}>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: pct >= 80 ? T.green : pct >= 60 ? T.gold : T.red }}>
            {score}/{total}
          </div>
          <div style={{ color: T.textMuted, fontSize: '0.9rem', marginTop: '0.25rem' }}>
            {pct}% correct
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 8,
            height: 10,
            overflow: 'hidden',
            marginTop: '1rem',
          }}>
            <div style={{
              background: pct >= 80 ? T.green : pct >= 60 ? T.gold : T.red,
              height: '100%',
              width: `${pct}%`,
              borderRadius: 8,
            }} />
          </div>
          <div style={{ color: T.textSoft, fontSize: '0.8rem', marginTop: '0.75rem' }}>
            +{score * 2} XP earned
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 360, margin: '0 auto' }}>
          {hasNext && (
            <Link href={`/drills/speaking/${nextUnit}`} style={{
              padding: '1rem',
              borderRadius: 14,
              background: `linear-gradient(135deg, ${T.red}, #cc0000)`,
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}>
              Next Unit <ArrowRight size={18} />
            </Link>
          )}
          <Link href="/ai-coach?skill=speaking" style={{
            padding: '1rem',
            borderRadius: 14,
            background: 'rgba(139,92,246,0.15)',
            border: `1px solid rgba(139,92,246,0.3)`,
            color: T.purple,
            fontWeight: 700,
            fontSize: '0.95rem',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}>
            <Sparkles size={18} /> Practice Writing with AI
          </Link>
          <Link href="/drills/speaking" style={{
            padding: '0.75rem',
            color: T.textMuted,
            fontSize: '0.9rem',
            textDecoration: 'none',
          }}>
            ← Back to Course
          </Link>
        </div>
      </div>
    );
  }

  // ─── PAYWALL ───
  if (hitPaywall) {
    // Calculate next reset (midnight Vancouver time)
    const now = new Date();
    const vanTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Vancouver' }));
    const nextReset = new Date(vanTime);
    nextReset.setDate(nextReset.getDate() + 1);
    nextReset.setHours(0, 0, 0, 0);
    const diffMs = nextReset.getTime() - vanTime.getTime();
    const hoursLeft = Math.floor(diffMs / 3600000);
    const minsLeft = Math.floor((diffMs % 3600000) / 60000);

    return (
      <div style={{ minHeight: '100vh', background: T.bg, color: T.text, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔥</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Great practice today!</h2>

        {/* Counter dots */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          {Array.from({ length: FREE_EXERCISES }).map((_, i) => (
            <div key={i} style={{
              width: 32, height: 32, borderRadius: '50%',
              background: i < freeUsed
                ? `linear-gradient(135deg, ${T.green}, #16a34a)`
                : 'rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 700, color: i < freeUsed ? '#fff' : T.textMuted,
            }}>
              {i < freeUsed ? '✓' : i + 1}
            </div>
          ))}
        </div>

        <p style={{ color: T.textMuted, fontSize: '0.85rem', marginBottom: '0.3rem' }}>
          {freeUsed}/{FREE_EXERCISES} daily exercises used
        </p>
        <p style={{ color: T.textMuted, fontSize: '0.8rem', marginBottom: '1.25rem' }}>
          ⏰ Resets in <b style={{ color: T.gold }}>{hoursLeft}h {minsLeft}m</b>
        </p>

        {total > 0 && (
          <p style={{ color: T.textSoft, fontSize: '0.85rem', marginBottom: '1rem' }}>
            Today&apos;s score: <b style={{ color: T.green }}>{score}/{total}</b>
          </p>
        )}

        <Link href="/pricing" style={{
          background: `linear-gradient(135deg, ${T.purple}, ${T.red})`,
          color: '#fff', fontWeight: 700, fontSize: '1rem',
          padding: '0.9rem 2.5rem', borderRadius: 14, textDecoration: 'none',
          display: 'inline-block', marginBottom: '0.75rem',
          boxShadow: '0 4px 20px rgba(139,92,246,0.3)',
        }}>
          ⚡ Upgrade to Pro — Unlimited
        </Link>
        <p style={{ color: T.textMuted, fontSize: '0.7rem', marginBottom: '1.5rem' }}>
          From CA$9.99/week · Cancel anytime
        </p>
        <Link href="/drills/speaking" style={{ color: T.textMuted, fontSize: '0.85rem', textDecoration: 'none' }}>
          ← Back to levels
        </Link>
      </div>
    );
  }

  // ─── EXERCISE PHASE ───
  if (!exercise) return null;
  const progressPct = ((exerciseIdx + 1) / unit.exercises.length) * 100;

  return (
    <div style={{
      minHeight: '100vh',
      background: T.bg,
      color: T.text,
      padding: '0 1rem 2rem',
      maxWidth: 600,
      margin: '0 auto',
      opacity: animateIn ? 1 : 0,
      transform: animateIn ? 'translateY(0)' : 'translateY(10px)',
      transition: 'all 0.2s ease',
    }}>
      {/* Progress bar */}
      <div style={{ padding: '1rem 0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Link href="/drills/speaking" style={{ color: T.textMuted, display: 'flex' }}>
          <XCircle size={22} />
        </Link>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.08)', borderRadius: 8, height: 8 }}>
          <div style={{
            background: `linear-gradient(90deg, ${T.green}, #4ade80)`,
            height: '100%',
            width: `${progressPct}%`,
            borderRadius: 8,
            transition: 'width 0.3s ease',
          }} />
        </div>
        <span style={{ color: T.textMuted, fontSize: '0.8rem', flexShrink: 0 }}>
          {exerciseIdx + 1}/∞
        </span>
      </div>

      {/* Score bar */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: '1.5rem',
        marginBottom: '0.5rem', padding: '0.5rem',
        background: T.surface, borderRadius: 12, border: `1px solid ${T.border}`,
      }}>
        <span style={{ fontSize: '0.8rem', color: T.green, fontWeight: 700 }}>✓ {score}</span>
        <span style={{ fontSize: '0.8rem', color: T.red, fontWeight: 700 }}>✗ {total - score}</span>
        <span style={{ fontSize: '0.8rem', color: T.textMuted }}>
          {total > 0 ? Math.round((score / total) * 100) : 0}%
        </span>
      </div>

      {/* Question */}
      <div style={{ padding: '1.5rem 0' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.4, marginBottom: '1.5rem' }}>
          {exercise.type === 'fillGap' ? 'Fill in the blank:' : (exercise.question || exercise.instruction)}
        </h2>

        {/* Fill Gap — show sentence with blank */}
        {exercise.type === 'fillGap' && exercise.sentence && (
          <div style={{
            background: T.surface,
            borderRadius: 14,
            padding: '1.25rem',
            marginBottom: '1.5rem',
            fontSize: '1.05rem',
            lineHeight: 1.6,
            color: T.textSoft,
            border: `1px solid ${T.border}`,
          }}>
            {exercise.sentence.replace('________', answered && selected !== null
              ? `[${exercise.options?.[selected]}]`
              : '________'
            )}
          </div>
        )}

        {/* Options (choose / fillGap) */}
        {(exercise.type === 'choose' || exercise.type === 'fillGap') && exercise.options && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {shuffledOpts.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrectOpt = (exercise.correct as number) === opt.origIdx;
              let bg = T.surface;
              let border = T.border;
              if (answered) {
                if (isCorrectOpt) { bg = 'rgba(34,197,94,0.15)'; border = T.green; }
                else if (isSelected && !isCorrectOpt) { bg = 'rgba(239,68,68,0.15)'; border = '#ef4444'; }
              } else if (isSelected) {
                bg = 'rgba(59,130,246,0.15)'; border = T.blue;
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={answered}
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: 14,
                    background: bg,
                    border: `2px solid ${border}`,
                    color: T.text,
                    fontSize: '0.95rem',
                    textAlign: 'left',
                    cursor: answered ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: answered && isCorrectOpt ? T.green : answered && isSelected ? '#ef4444' : 'rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}>
                    {answered && isCorrectOpt ? <CheckCircle size={16} /> : answered && isSelected ? <XCircle size={16} /> : String.fromCharCode(65 + i)}
                  </span>
                  <span style={{ lineHeight: 1.4 }}>{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Match pairs */}
        {exercise.type === 'match' && exercise.pairs && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {exercise.pairs.map((p, i) => (
                <button
                  key={`l-${i}`}
                  onClick={() => handleMatchTap('left', i)}
                  disabled={matched.includes(i)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 12,
                    background: matched.includes(i) ? 'rgba(34,197,94,0.15)' : matchSelected?.side === 'left' && matchSelected.idx === i ? 'rgba(59,130,246,0.15)' : T.surface,
                    border: `2px solid ${matched.includes(i) ? T.green : matchSelected?.side === 'left' && matchSelected.idx === i ? T.blue : T.border}`,
                    color: T.text,
                    fontSize: '0.8rem',
                    cursor: matched.includes(i) ? 'default' : 'pointer',
                    textAlign: 'center',
                    lineHeight: 1.3,
                  }}
                >{p.left}</button>
              ))}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {exercise.pairs.map((p, i) => (
                <button
                  key={`r-${i}`}
                  onClick={() => handleMatchTap('right', i)}
                  disabled={matched.includes(i)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 12,
                    background: matched.includes(i) ? 'rgba(34,197,94,0.15)' : matchSelected?.side === 'right' && matchSelected.idx === i ? 'rgba(59,130,246,0.15)' : T.surface,
                    border: `2px solid ${matched.includes(i) ? T.green : matchSelected?.side === 'right' && matchSelected.idx === i ? T.blue : T.border}`,
                    color: T.text,
                    fontSize: '0.8rem',
                    cursor: matched.includes(i) ? 'default' : 'pointer',
                    textAlign: 'center',
                    lineHeight: 1.3,
                  }}
                >{p.right}</button>
              ))}
            </div>
          </div>
        )}

        {/* Reorder */}
        {exercise.type === 'reorder' && exercise.words && (
          <div>
            {/* Answer area */}
            <div style={{
              minHeight: 56,
              background: T.surface,
              borderRadius: 14,
              padding: '0.75rem',
              marginBottom: '1rem',
              border: `2px solid ${answered ? (isCorrect ? T.green : '#ef4444') : T.border}`,
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              alignItems: 'center',
            }}>
              {reorderAnswer.length === 0 && (
                <span style={{ color: T.textMuted, fontSize: '0.85rem', fontStyle: 'italic' }}>Tap words in order...</span>
              )}
              {reorderAnswer.map((wordIdx, i) => (
                <button
                  key={`ans-${wordIdx}`}
                  onClick={() => handleReorderDeselect(i)}
                  disabled={answered}
                  style={{
                    padding: '0.6rem 1rem',
                    borderRadius: 10,
                    background: answered
                      ? (isCorrect ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)')
                      : 'rgba(59,130,246,0.15)',
                    border: `2px solid ${answered ? (isCorrect ? T.green : '#ef4444') : T.blue}`,
                    color: T.text,
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    cursor: answered ? 'default' : 'pointer',
                  }}
                >
                  {exercise.words![wordIdx]}
                </button>
              ))}
            </div>
            {/* Word bank */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {reorderItems.map((wordIdx) => (
                <button
                  key={`pool-${wordIdx}`}
                  onClick={() => handleReorderSelect(wordIdx)}
                  disabled={answered}
                  style={{
                    padding: '0.6rem 1rem',
                    borderRadius: 10,
                    background: T.surface,
                    border: `2px solid ${T.border}`,
                    color: T.text,
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    cursor: answered ? 'default' : 'pointer',
                  }}
                >
                  {exercise.words![wordIdx]}
                </button>
              ))}
            </div>
            {/* Show correct answer if wrong */}
            {answered && !isCorrect && (
              <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(34,197,94,0.08)', borderRadius: 10 }}>
                <span style={{ color: T.green, fontSize: '0.85rem', fontWeight: 600 }}>Correct: </span>
                <span style={{ color: T.textSoft, fontSize: '0.85rem' }}>
                  {(exercise.correct as number[]).map(i => exercise.words![i]).join(' ')}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Speak */}
        {exercise.type === 'speak' && exercise.targetPhrase && (
          <div>
            <div style={{
              background: T.surface,
              borderRadius: 14,
              padding: '1.25rem',
              marginBottom: '1.5rem',
              border: `1px solid ${T.border}`,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.75rem', color: T.textMuted, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: 1 }}>Say this phrase:</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.5, color: T.text }}>
                &ldquo;{exercise.targetPhrase}&rdquo;
              </div>
              <button
                onClick={() => playTTS(exercise.targetPhrase!)}
                disabled={ttsPlaying}
                style={{
                  marginTop: '0.75rem', padding: '0.5rem 1.25rem', borderRadius: 10,
                  border: `1px solid ${T.purple}`, background: 'rgba(139,92,246,0.08)',
                  color: T.purple, fontWeight: 600, fontSize: '0.8rem',
                  cursor: ttsPlaying ? 'default' : 'pointer',
                  opacity: ttsPlaying ? 0.7 : 1,
                }}
              >
                {ttsPlaying ? '🔊 Playing...' : '🔊 Listen first'}
              </button>
            </div>

            {!answered && (
              <button
                onClick={() => {
                  if (isRecording) return;
                  const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                  if (!SR) {
                    setSpeechResult('Speech recognition not supported in this browser');
                    setAnswered(true);
                    setIsCorrect(false);
                    setTotal(t => t + 1); logExercise();
                    setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                    return;
                  }
                  const recognition = new SR();
                  recognition.lang = 'en-US';
                  recognition.continuous = false;
                  recognition.interimResults = false;
                  setIsRecording(true);

                  recognition.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript.toLowerCase().trim();
                    const target = (exercise.targetPhrase || '').toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
                    const spoken = transcript.replace(/[^a-z0-9\s]/g, '');

                    const targetWords = target.split(/\s+/);
                    const spokenWords = spoken.split(/\s+/);
                    let matchCount = 0;
                    targetWords.forEach((w, i) => {
                      if (spokenWords[i] === w) matchCount++;
                    });
                    const pct = Math.round((matchCount / targetWords.length) * 100);

                    setSpeechResult(transcript);
                    setSpeechScore(pct);
                    setAnswered(true);
                    setIsCorrect(pct >= 70);
                    setTotal(t => t + 1); logExercise();
                    if (pct >= 70) setScore(s => s + 1);
                    setIsRecording(false);
                    setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                  };

                  recognition.onerror = () => {
                    setIsRecording(false);
                    setSpeechResult('Could not detect speech. Try again.');
                  };

                  recognition.onend = () => setIsRecording(false);
                  recognition.start();
                }}
                style={{
                  width: '100%',
                  padding: '1.25rem',
                  borderRadius: 14,
                  border: 'none',
                  background: isRecording
                    ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                    : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  animation: isRecording ? 'pulse 1.5s infinite' : 'none',
                }}
              >
                {isRecording ? '🔴 Listening...' : '🎤 Tap to Speak'}
              </button>
            )}

            {answered && speechResult && (
              <div style={{
                background: T.surface,
                borderRadius: 14,
                padding: '1rem',
                border: `1px solid ${T.border}`,
              }}>
                <div style={{ fontSize: '0.8rem', color: T.textMuted, marginBottom: '0.5rem' }}>You said:</div>
                <div style={{ fontSize: '1rem', color: T.text, fontStyle: 'italic', marginBottom: '0.75rem' }}>
                  &ldquo;{speechResult}&rdquo;
                </div>
                {speechScore !== null && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.08)',
                      borderRadius: 8,
                      height: 8,
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        background: speechScore >= 85 ? T.green : speechScore >= 70 ? T.gold : '#ef4444',
                        height: '100%',
                        width: `${speechScore}%`,
                        borderRadius: 8,
                      }} />
                    </div>
                    <span style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: speechScore >= 85 ? T.green : speechScore >= 70 ? T.gold : '#ef4444',
                    }}>{speechScore}%</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Explanation / Continue */}
      {answered && (
        <div ref={feedbackRef} style={{
          marginTop: '1.5rem',
          background: isCorrect ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
          borderRadius: 16,
          border: `2px solid ${isCorrect ? T.green : '#ef4444'}`,
          padding: '1.25rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            {isCorrect ? <CheckCircle size={20} color={T.green} /> : <XCircle size={20} color="#ef4444" />}
            <span style={{ fontWeight: 700, color: isCorrect ? T.green : '#ef4444' }}>
              {isCorrect ? 'Correct!' : 'Not quite'}
            </span>
          </div>
          {exercise.explanation && (
            <p style={{ color: T.textSoft, fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1rem' }}>
              {exercise.explanation}
            </p>
          )}
          {/* Try Again for speak exercises */}
          {!isCorrect && exercise.type === 'speak' && (
            <button
              onClick={() => {
                setAnswered(false);
                setSpeechResult('');
                setSpeechScore(null);
                setIsRecording(false);
              }}
              style={{
                width: '100%',
                padding: '0.9rem',
                borderRadius: 12,
                border: '2px solid #ef4444',
                background: 'transparent',
                color: '#ef4444',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                marginBottom: '0.5rem',
              }}
            >
              🎤 Try Again
            </button>
          )}
          <button
            onClick={nextExercise}
            style={{
              width: '100%',
              padding: '0.9rem',
              borderRadius: 12,
              border: 'none',
              background: isCorrect ? T.green : '#ef4444',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            {exerciseIdx + 1 >= unit.exercises.length ? 'See Results' : 'Continue'}
          </button>
        </div>
      )}
    </div>
  );
}
