'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, ArrowRight, Sparkles, Trophy, BookOpen } from 'lucide-react';
import { usePlan } from '@/hooks/usePlan';
import { useGuest } from '@/hooks/useGuest';
import GuestWall from '@/components/GuestWall';
import styles from '@/styles/DrillExercise.module.scss';

interface Exercise {
  type: 'readChoose'; passage: string; question: string;
  options: string[]; correct: number; explanation: string;
}
interface Unit {
  id: number; title: string; subtitle: string; icon: string; level: string;
  lesson: { title: string; points: string[] }; exercises: Exercise[];
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
        if (h.style.display !== 'none') { h.dataset.prevDisplay = h.style.display; h.style.display = 'none'; hidden.push(h); }
      });
    });
    return () => { hidden.forEach(h => { h.style.display = h.dataset.prevDisplay || ''; }); };
  }, []);

  useEffect(() => {
    fetch('/data/courses/reading.json').then(r => r.json()).then((data: Unit[]) => {
      const u = data.find(u => u.id === unitId);
      if (u) {
        const exercises = [...u.exercises];
        const triplets: Exercise[][] = [];
        for (let i = 0; i < exercises.length; i += 3) triplets.push(exercises.slice(i, i + 3));
        for (let i = triplets.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [triplets[i], triplets[j]] = [triplets[j], triplets[i]]; }
        setUnit({ ...u, exercises: triplets.flat() });
      }
    });
    if (!isGuest) fetch('/api/daily-usage?category=drills').then(r => r.json()).then(data => { if (data.isPro) return; setFreeUsed(data.used || 0); setFreeLimit(data.limit || 10); }).catch(() => {});
  }, [unitId]);

  const exercise = unit?.exercises?.[exerciseIdx];
  useEffect(() => {
    if (!exercise?.options) return;
    const mapped = exercise.options.map((label: string, origIdx: number) => ({ label, origIdx }));
    for (let i = mapped.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [mapped[i], mapped[j]] = [mapped[j], mapped[i]]; }
    setShuffledOpts(mapped); setSelected(null); setAnswered(false); setShowPassage(true);
  }, [exerciseIdx, exercise]);

  const handleAnswer = useCallback((shuffledIdx: number) => {
    if (answered || !exercise || shuffledOpts.length === 0) return;
    const origIdx = shuffledOpts[shuffledIdx].origIdx;
    const correct = origIdx === exercise.correct;
    setSelected(shuffledIdx); setAnswered(true); setIsCorrect(correct);
    if (correct) setScore(s => s + 1);
    if (isGuest) trackExercise();
    setTotal(t => t + 1);
    if (!isGuest) {
      fetch('/api/log-activity', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'reading', count: 1 }) }).catch(() => {});
      if (!isPro) fetch('/api/daily-usage', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ category: 'drills' }) }).then(r => r.json()).then(data => { if (!data.isPro) setFreeUsed(data.used || 0); }).catch(() => {});
    }
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('exercise-complete'));
    setTimeout(() => { feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 100);
  }, [answered, exercise, shuffledOpts, isPro, isGuest, trackExercise]);

  const nextExercise = useCallback(() => {
    if (!unit) return;
    if (!isPro && freeUsed >= freeLimit) { setFreeBlocked(true); return; }
    if (exerciseIdx + 1 >= unit.exercises.length) { setDone(true); return; }
    setAnimateIn(false);
    setTimeout(() => { setExerciseIdx(i => i + 1); setAnimateIn(true); }, 200);
  }, [unit, exerciseIdx, isPro, freeUsed, freeLimit]);

  if (planLoading || !unit) return <div className={styles.skeletonPage} />;

  // Paywall
  if ((isGuest ? guestBlocked : freeBlocked) && !isPro) {
    return (
      <div className={styles.paywallScreen}>
        <Sparkles size={48} color="#f59e0b" style={{ marginBottom: '1rem' }} />
        <h2 className={styles.paywallTitle}>You&apos;re on fire!</h2>
        <p className={styles.paywallDesc}>
          You&apos;ve completed your {freeLimit} free exercises for today.<br />
          Come back tomorrow or upgrade for unlimited practice!
        </p>
        <div className={styles.paywallActions}>
          <Link href="/pricing" className={styles.paywallUpgradeBtn}>
            <Sparkles size={18} /> Upgrade to Pro
          </Link>
          <button onClick={() => router.push('/drills/reading')} className={styles.paywallBackBtn}>
            ← Back to Reading Drills
          </button>
        </div>
        <div className={styles.resultSessionBox}>
          <p className={styles.resultSessionText}>
            Session: {score}/{total} correct ({total > 0 ? Math.round((score / total) * 100) : 0}%)
          </p>
        </div>
      </div>
    );
  }

  // Done
  if (done) {
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    return (
      <div className={styles.resultScreen}>
        <Trophy size={64} color="#f59e0b" style={{ marginBottom: '1rem' }} />
        <h2 className={styles.resultTitle}>Unit Complete!</h2>
        <p className={styles.resultSubtitle}>You scored {score}/{total} ({pct}%)</p>
        <div className={styles.resultCircle} style={{ background: `conic-gradient(#14b8a6 ${pct * 3.6}deg, #232733 0deg)` }}>
          <div className={styles.resultCircleInner}>{pct}%</div>
        </div>
        <div className={styles.resultActions}>
          <button onClick={() => router.push('/drills/reading')} className={styles.resultBtnGhost}>← Back</button>
          <button onClick={() => window.location.reload()} className={styles.resultBtnPrimary}>
            <ArrowRight size={18} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!exercise) return null;

  const correctShuffledIdx = shuffledOpts.findIndex(o => o.origIdx === exercise.correct);
  const progress = ((exerciseIdx + 1) / unit.exercises.length) * 100;

  return (
    <div className={styles.pageImmersive} style={{ opacity: animateIn ? 1 : 0, transition: 'opacity 0.2s' }}>
      {/* Progress bar */}
      <div className={styles.progressBar}>
        <button onClick={() => router.push('/drills/reading')} className={styles.backBtn}>
          <ArrowLeft size={22} />
        </button>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #14b8a6, #3b82f6)' }} />
        </div>
        <span className={styles.progressLabel}>{exerciseIdx + 1}/∞</span>
      </div>

      {/* Score strip */}
      <div className={styles.scoreStrip}>
        <span className={styles.scoreCorrect}><CheckCircle size={14} /> {score}</span>
        <span className={styles.scoreWrong}><XCircle size={14} /> {total - score}</span>
        <span className={styles.scorePct}>{total > 0 ? Math.round((score / total) * 100) : 0}%</span>
      </div>

      {/* Passage */}
      <div className={styles.passageBox} style={{ maxHeight: showPassage ? 400 : 60 }}>
        <div className={styles.passageHeader}>
          <BookOpen size={16} color="#14b8a6" />
          <span className={styles.passageLabel}>Read the passage</span>
          <button onClick={() => setShowPassage(!showPassage)} className={styles.passageToggle}>
            {showPassage ? 'Collapse' : 'Expand'}
          </button>
        </div>
        <div className={styles.passageText}>{exercise.passage}</div>
      </div>

      {/* Question */}
      <div className={styles.questionText}>{exercise.question}</div>

      {/* Options */}
      <div className={styles.optionsList}>
        {shuffledOpts.map((opt, idx) => {
          const isSelected = selected === idx;
          const isThisCorrect = idx === correctShuffledIdx;
          let btnClass = styles.optionBtn;
          let letterClass = styles.optionLetter;
          let icon = null;

          if (answered) {
            if (isThisCorrect) {
              btnClass = styles.optionBtnCorrect;
              letterClass = styles.optionLetterCorrect;
              icon = <CheckCircle size={20} color="#22c55e" />;
            } else if (isSelected && !isThisCorrect) {
              btnClass = styles.optionBtnWrong;
              icon = <XCircle size={20} color="#ef4444" />;
            }
          }

          return (
            <button key={idx} onClick={() => handleAnswer(idx)} disabled={answered} className={btnClass}>
              <span className={letterClass}>{icon || String.fromCharCode(65 + idx)}</span>
              <span style={{ flex: 1 }}>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {answered && (
        <div ref={feedbackRef} className={isCorrect ? styles.feedbackCorrect : styles.feedbackWrong}>
          <div className={styles.feedbackHeader}>
            {isCorrect
              ? <><CheckCircle size={20} color="#22c55e" /><span className={styles.feedbackTitle} style={{ color: '#22c55e' }}>Correct!</span></>
              : <><XCircle size={20} color="#ef4444" /><span className={styles.feedbackTitle} style={{ color: '#ef4444' }}>Not quite</span></>}
          </div>
          <p className={styles.feedbackExplanation}>{exercise.explanation}</p>
          <button onClick={nextExercise} className={styles.nextBtn} style={{ background: 'linear-gradient(135deg, #14b8a6, #3b82f6)' }}>
            {exerciseIdx + 1 >= (unit?.exercises?.length || 0) ? 'See Results' : 'Next'}
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {showWall && <GuestWall isLoggedIn={false} />}
    </div>
  );
}
