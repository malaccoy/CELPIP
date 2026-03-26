'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, ArrowRight, BookOpen, Sparkles, Trophy, Mic, Volume2 } from 'lucide-react';
import { usePlan } from '@/hooks/usePlan';
import { useGuest } from '@/hooks/useGuest';
import GuestWall from '@/components/GuestWall';
import ExerciseOfferPopup from '@/components/ExerciseOfferPopup';
import styles from '@/styles/DrillExercise.module.scss';

interface Exercise {
  type: 'choose' | 'fillGap' | 'match' | 'reorder' | 'speak';
  question?: string; sentence?: string; instruction?: string;
  options?: string[]; correct?: number | number[]; explanation?: string;
  pairs?: { left: string; right: string }[];
  words?: string[]; targetPhrase?: string;
}
interface Unit {
  id: number; title: string; subtitle: string; icon: string; level: string;
  lesson: { title: string; points: string[] }; exercises: Exercise[];
}

export default function UnitPage() {
  const router = useRouter();
  const params = useParams();
  const unitId = Number(params.unitId);
  const { isPro, loading: planLoading } = usePlan();
  const { isGuest, guestBlocked, guardAction, showWall, setShowWall, checkDone, trackExercise } = useGuest();

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
  const [ttsPlaying, setTtsPlaying] = useState(false);
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
    fetch('/data/courses/speaking.json').then(r => r.json()).then(data => {
      setCourse(data);
      const u = data.units.find((u: Unit) => u.id === unitId);
      setFreeUnits(data.freeUnits || 6);
      if (u) {
        const exercises = [...u.exercises];
        const triplets: any[][] = [];
        for (let i = 0; i < exercises.length; i += 3) triplets.push(exercises.slice(i, i + 3));
        for (let i = triplets.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [triplets[i], triplets[j]] = [triplets[j], triplets[i]]; }
        setUnit({ ...u, exercises: triplets.flat() });
      }
    });
    if (!isGuest) fetch('/api/daily-usage?category=drills').then(r => r.json()).then(data => {
      if (data.isPro) return;
      setFreeUsed(data.used || 0); setFreeLimit(data.limit || 5);
      if (data.remaining <= 0) setFreeBlocked(true);
    }).catch(() => {});
  }, [unitId]);

  const FREE_EXERCISES = freeLimit;
  const hitPaywall = isGuest ? guestBlocked : (!isPro && (freeBlocked || (freeUsed + total) > FREE_EXERCISES));
  const exercise = unit?.exercises[exerciseIdx];

  const [shuffledOpts, setShuffledOpts] = useState<{ label: string; origIdx: number }[]>([]);
  useEffect(() => {
    if (exercise && (exercise.type === 'choose' || exercise.type === 'fillGap') && exercise.options) {
      const mapped = exercise.options.map((o: string, i: number) => ({ label: o, origIdx: i }));
      for (let i = mapped.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [mapped[i], mapped[j]] = [mapped[j], mapped[i]]; }
      setShuffledOpts(mapped);
    }
  }, [exerciseIdx, exercise]);

  useEffect(() => {
    if (exercise?.type === 'reorder' && exercise.words) {
      const indices = exercise.words.map((_: string, i: number) => i);
      for (let i = indices.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [indices[i], indices[j]] = [indices[j], indices[i]]; }
      setReorderItems(indices); setReorderAnswer([]);
    }
  }, [exerciseIdx, exercise?.type]);

  const logExercise = useCallback(() => {
    if (isGuest) { if (typeof window !== 'undefined') window.dispatchEvent(new Event('exercise-complete')); return; }
    fetch('/api/log-activity', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'speaking', count: 1 }) }).catch(() => {});
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('exercise-complete'));
    if (!isPro) {
      fetch('/api/daily-usage', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ category: 'drills' }) })
        .then(r => r.json()).then(data => { if (data.used) setFreeUsed(data.used); if (data.remaining <= 0) setFreeBlocked(true); }).catch(() => {});
    }
  }, [isPro, isGuest]);

  const handleAnswer = useCallback((selectedIdx: number) => {
    if (answered || !exercise) return;
    setSelected(selectedIdx); setAnswered(true);
    const origIdx = shuffledOpts[selectedIdx]?.origIdx ?? selectedIdx;
    const correct = exercise.correct as number === origIdx;
    setIsCorrect(correct); setTotal(t => t + 1); logExercise();
    if (correct) setScore(s => s + 1);
    if (isGuest) trackExercise();
    setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
  }, [answered, exercise, shuffledOpts, isGuest, trackExercise, logExercise]);

  const handleMatchTap = useCallback((side: 'left' | 'right', idx: number) => {
    if (!exercise?.pairs || matched.includes(idx)) return;
    if (!matchSelected) { setMatchSelected({ side, idx }); }
    else if (matchSelected.side !== side) {
      const leftIdx = side === 'left' ? idx : matchSelected.idx;
      const rightIdx = side === 'right' ? idx : matchSelected.idx;
      if (leftIdx === rightIdx) setMatched(m => [...m, leftIdx]);
      setMatchSelected(null);
      if (matched.length + 1 === exercise.pairs.length) {
        setAnswered(true); setIsCorrect(true); setTotal(t => t + 1); logExercise(); setScore(s => s + 1);
        setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
      }
    } else { setMatchSelected({ side, idx }); }
  }, [matchSelected, matched, exercise, logExercise]);

  const handleReorderSelect = useCallback((wordIdx: number) => {
    if (answered) return;
    setReorderItems(items => items.filter(i => i !== wordIdx));
    setReorderAnswer(ans => {
      const newAns = [...ans, wordIdx];
      const correctOrder = (exercise?.correct as number[]) || [];
      if (newAns.length === correctOrder.length) {
        const isCorrectOrder = newAns.every((v, i) => v === correctOrder[i]);
        setAnswered(true); setIsCorrect(isCorrectOrder); setTotal(t => t + 1); logExercise();
        if (isCorrectOrder) setScore(s => s + 1);
        setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
      }
      return newAns;
    });
  }, [answered, exercise, logExercise]);

  const handleReorderDeselect = useCallback((idx: number) => {
    if (answered) return;
    const wordIdx = reorderAnswer[idx];
    setReorderAnswer(ans => ans.filter((_, i) => i !== idx));
    setReorderItems(items => [...items, wordIdx]);
  }, [answered, reorderAnswer]);

  const nextExercise = () => {
    if (!unit) return;
    if (exerciseIdx + 1 >= unit.exercises.length) {
      fetch('/api/drill-progress', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ drillType: 'speaking', levelId: unitId, score, total: unit.exercises.length, completed: true }) }).catch(() => {});
      setPhase('result');
      if (!isPro) { const shown = sessionStorage.getItem('offerShown'); if (!shown) { setTimeout(() => setShowOffer(true), 1500); sessionStorage.setItem('offerShown', '1'); } }
      return;
    }
    setAnimateIn(false);
    if (!isPro) fetch('/api/drill-progress', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ drillType: 'speaking', levelId: unitId, score, total: freeUsed + total }) }).catch(() => {});
    setTimeout(() => {
      setExerciseIdx(i => i + 1); setSelected(null); setAnswered(false); setIsCorrect(false);
      setMatchSelected(null); setMatched([]); setReorderAnswer([]); setSpeechResult(''); setSpeechScore(null); setAnimateIn(true);
    }, 200);
  };

  const playTTS = (text: string) => {
    if (ttsRef.current) { ttsRef.current.pause(); ttsRef.current.src = ''; ttsRef.current = null; }
    setTtsPlaying(true);
    const a = new Audio(`/api/tts?text=${encodeURIComponent(text)}`);
    ttsRef.current = a;
    a.onended = () => { ttsRef.current = null; setTtsPlaying(false); };
    a.onerror = () => { ttsRef.current = null; setTtsPlaying(false); };
    a.play().catch(() => setTtsPlaying(false));
  };

  if (planLoading || !unit) return <div className={styles.skeletonPage} />;

  // Result
  if (phase === 'result') {
    const pct = Math.round((score / total) * 100);
    const msg = pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good job!' : 'Keep practicing!';
    const nextUnit = unitId + 1;
    const hasNext = nextUnit <= (course?.totalUnits ? course.totalUnits - 1 : 2);
    const scoreColor = pct >= 80 ? '#22c55e' : pct >= 60 ? '#f59e0b' : '#ef4444';

    return (
      <div className={styles.resultScreen}>
        <ExerciseOfferPopup show={showOffer} onClose={() => setShowOffer(false)} />
        <Trophy size={64} color="#f59e0b" style={{ marginBottom: '1rem' }} />
        <h2 className={styles.resultTitle}>{msg}</h2>
        <p className={styles.resultSubtitle}>Unit {unitId}: {unit.title}</p>

        <div className={styles.resultScorecard}>
          <div className={styles.resultScoreValue} style={{ color: scoreColor }}>{score}/{total}</div>
          <div className={styles.resultScorePct}>{pct}% correct</div>
          <div className={styles.resultProgressBar}>
            <div className={styles.resultProgressFill} style={{ background: scoreColor, width: `${pct}%` }} />
          </div>
          <div className={styles.resultXP}>+{score * 2} XP earned</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 360, width: '100%' }}>
          {hasNext && (
            <Link href={`/drills/speaking/${nextUnit}`} className={styles.resultLinkPrimary} style={{ background: 'linear-gradient(135deg, #ef4444, #cc0000)' }}>
              Next Unit <ArrowRight size={18} />
            </Link>
          )}
          <Link href="/ai-coach?skill=speaking" className={styles.resultLinkSecondary}>
            <Sparkles size={18} /> Practice Speaking with AI
          </Link>
          <Link href="/drills/speaking" className={styles.resultLinkBack}>
            ← Back to Course
          </Link>
        </div>
      </div>
    );
  }

  // Paywall
  if (hitPaywall) {
    const now = new Date();
    const vanTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Vancouver' }));
    const nextReset = new Date(vanTime); nextReset.setDate(nextReset.getDate() + 1); nextReset.setHours(0, 0, 0, 0);
    const diffMs = nextReset.getTime() - vanTime.getTime();
    const hoursLeft = Math.floor(diffMs / 3600000);
    const minsLeft = Math.floor((diffMs % 3600000) / 60000);

    return (
      <div className={styles.paywallScreen}>
        <Sparkles size={48} color="#f59e0b" style={{ marginBottom: '1rem' }} />
        <h2 className={styles.paywallTitle}>Great practice today!</h2>

        <div className={styles.paywallDailyDots}>
          {Array.from({ length: FREE_EXERCISES }).map((_, i) => (
            <div key={i} className={i < freeUsed ? styles.paywallDotUsed : styles.paywallDotRemaining}>
              {i < freeUsed ? <CheckCircle size={14} /> : i + 1}
            </div>
          ))}
        </div>

        <p className={styles.paywallUsageText}>{freeUsed}/{FREE_EXERCISES} daily exercises used</p>
        <p className={styles.paywallResetText}>Resets in <b>{hoursLeft}h {minsLeft}m</b></p>

        {total > 0 && (
          <p className={styles.paywallScoreText}>Today&apos;s score: <b>{score}/{total}</b></p>
        )}

        <Link href="/pricing" className={styles.paywallUpgradeBtnLarge}>
          <Sparkles size={18} /> Upgrade to Pro — Unlimited
        </Link>
        <p className={styles.paywallPriceHint}>From CA$9.99/week · Cancel anytime</p>
        <Link href="/drills/speaking" className={styles.resultLinkBack}>← Back to levels</Link>
      </div>
    );
  }

  // Exercise
  if (!exercise) return null;
  const progressPct = ((exerciseIdx + 1) / unit.exercises.length) * 100;

  return (
    <div className={styles.pageImmersive} style={{ opacity: animateIn ? 1 : 0, transform: animateIn ? 'translateY(0)' : 'translateY(10px)', transition: 'all 0.2s ease' }}>
      {/* Progress bar */}
      <div className={styles.progressBar}>
        <Link href="/drills/speaking" className={styles.backBtn}>
          <XCircle size={22} />
        </Link>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, #22c55e, #4ade80)' }} />
        </div>
        <span className={styles.progressLabel}>{exerciseIdx + 1}/∞</span>
      </div>

      {/* Score strip */}
      <div className={styles.scoreStrip}>
        <span className={styles.scoreCorrect}><CheckCircle size={14} /> {score}</span>
        <span className={styles.scoreWrong}><XCircle size={14} /> {total - score}</span>
        <span className={styles.scorePct}>{total > 0 ? Math.round((score / total) * 100) : 0}%</span>
      </div>

      {/* Question */}
      <div style={{ padding: '1.5rem 0' }}>
        <h2 className={styles.questionText}>
          {exercise.type === 'fillGap' ? 'Fill in the blank:' : (exercise.question || exercise.instruction)}
        </h2>

        {/* Fill Gap sentence */}
        {exercise.type === 'fillGap' && exercise.sentence && (
          <div className={styles.fillGapSentence}>
            {exercise.sentence.replace('________', answered && selected !== null
              ? `[${exercise.options?.[selected]}]` : '________')}
          </div>
        )}

        {/* Options (choose / fillGap) */}
        {(exercise.type === 'choose' || exercise.type === 'fillGap') && exercise.options && (
          <div className={styles.optionsList}>
            {shuffledOpts.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrectOpt = (exercise.correct as number) === opt.origIdx;
              let btnClass = styles.optionBtn;
              let letterClass = styles.optionLetter;
              let icon = null;

              if (answered) {
                if (isCorrectOpt) { btnClass = styles.optionBtnCorrect; letterClass = styles.optionLetterCorrect; icon = <CheckCircle size={16} />; }
                else if (isSelected && !isCorrectOpt) { btnClass = styles.optionBtnWrong; icon = <XCircle size={16} />; }
              }

              return (
                <button key={i} onClick={() => handleAnswer(i)} disabled={answered} className={btnClass}>
                  <span className={letterClass}>{icon || String.fromCharCode(65 + i)}</span>
                  <span style={{ lineHeight: 1.4 }}>{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Match pairs */}
        {exercise.type === 'match' && exercise.pairs && (
          <div className={styles.matchContainer}>
            <div className={styles.matchColumn}>
              {exercise.pairs.map((p, i) => (
                <button key={`l-${i}`} onClick={() => handleMatchTap('left', i)} disabled={matched.includes(i)}
                  className={matched.includes(i) ? styles.matchBtnMatched : (matchSelected?.side === 'left' && matchSelected.idx === i ? styles.matchBtnSelected : styles.matchBtn)}>
                  {p.left}
                </button>
              ))}
            </div>
            <div className={styles.matchColumn}>
              {exercise.pairs.map((p, i) => (
                <button key={`r-${i}`} onClick={() => handleMatchTap('right', i)} disabled={matched.includes(i)}
                  className={matched.includes(i) ? styles.matchBtnMatched : (matchSelected?.side === 'right' && matchSelected.idx === i ? styles.matchBtnSelected : styles.matchBtn)}>
                  {p.right}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Reorder */}
        {exercise.type === 'reorder' && exercise.words && (
          <div>
            <div className={answered ? (isCorrect ? styles.reorderAnswerCorrect : styles.reorderAnswerWrong) : styles.reorderAnswer}>
              {reorderAnswer.length === 0 && <span className={styles.reorderPlaceholder}>Tap words in order...</span>}
              {reorderAnswer.map((wordIdx, i) => (
                <button key={`ans-${wordIdx}`} onClick={() => handleReorderDeselect(i)} disabled={answered}
                  className={answered ? (isCorrect ? styles.reorderWordCorrect : styles.reorderWordWrong) : styles.reorderWordActive}>
                  {exercise.words![wordIdx]}
                </button>
              ))}
            </div>
            <div className={styles.reorderWordBank}>
              {reorderItems.map((wordIdx) => (
                <button key={`pool-${wordIdx}`} onClick={() => handleReorderSelect(wordIdx)} disabled={answered} className={styles.reorderWord}>
                  {exercise.words![wordIdx]}
                </button>
              ))}
            </div>
            {answered && !isCorrect && (
              <div className={styles.reorderCorrectHint}>
                <strong>Correct: </strong>
                <span>{(exercise.correct as number[]).map(i => exercise.words![i]).join(' ')}</span>
              </div>
            )}
          </div>
        )}

        {/* Speak */}
        {exercise.type === 'speak' && exercise.targetPhrase && (
          <div>
            <div className={styles.speakPromptCard}>
              <div className={styles.speakPromptLabel}>Say this phrase:</div>
              <div className={styles.speakPromptText}>&ldquo;{exercise.targetPhrase}&rdquo;</div>
              <button onClick={() => playTTS(exercise.targetPhrase!)} disabled={ttsPlaying} className={styles.speakListenBtn}>
                <Volume2 size={16} /> {ttsPlaying ? 'Playing...' : 'Listen first'}
              </button>
            </div>

            {!answered && (
              <button
                onClick={() => {
                  if (isRecording) return;
                  const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                  if (!SR) {
                    setSpeechResult('Speech recognition not supported in this browser');
                    setAnswered(true); setIsCorrect(false); setTotal(t => t + 1); logExercise();
                    setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                    return;
                  }
                  const recognition = new SR();
                  recognition.lang = 'en-US'; recognition.continuous = false; recognition.interimResults = false;
                  setIsRecording(true);
                  recognition.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript.toLowerCase().trim();
                    const target = (exercise.targetPhrase || '').toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
                    const spoken = transcript.replace(/[^a-z0-9\s]/g, '');
                    const targetWords = target.split(/\s+/); const spokenWords = spoken.split(/\s+/);
                    let matchCount = 0; targetWords.forEach((w, i) => { if (spokenWords[i] === w) matchCount++; });
                    const pct = Math.round((matchCount / targetWords.length) * 100);
                    setSpeechResult(transcript); setSpeechScore(pct); setAnswered(true); setIsCorrect(pct >= 70);
                    setTotal(t => t + 1); logExercise(); if (pct >= 70) setScore(s => s + 1); setIsRecording(false);
                    setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                  };
                  recognition.onerror = () => { setIsRecording(false); setSpeechResult('Could not detect speech. Try again.'); };
                  recognition.onend = () => setIsRecording(false);
                  recognition.start();
                }}
                className={isRecording ? styles.speakRecordBtnActive : styles.speakRecordBtn}
              >
                <Mic size={22} /> {isRecording ? 'Listening...' : 'Tap to Speak'}
              </button>
            )}

            {answered && speechResult && (
              <div className={styles.speakResultCard}>
                <div className={styles.speakResultLabel}>You said:</div>
                <div className={styles.speakResultText}>&ldquo;{speechResult}&rdquo;</div>
                {speechScore !== null && (
                  <div className={styles.speakScoreBar}>
                    <div className={styles.speakScoreTrack}>
                      <div className={styles.speakScoreFill} style={{
                        background: speechScore >= 85 ? '#22c55e' : speechScore >= 70 ? '#f59e0b' : '#ef4444',
                        width: `${speechScore}%`,
                      }} />
                    </div>
                    <span className={styles.speakScoreValue} style={{
                      color: speechScore >= 85 ? '#22c55e' : speechScore >= 70 ? '#f59e0b' : '#ef4444',
                    }}>{speechScore}%</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Feedback / Continue */}
      {answered && (
        <div ref={feedbackRef} className={isCorrect ? styles.feedbackCorrect : styles.feedbackWrong}>
          <div className={styles.feedbackHeader}>
            {isCorrect
              ? <><CheckCircle size={20} color="#22c55e" /><span className={styles.feedbackTitle} style={{ color: '#22c55e' }}>Correct!</span></>
              : <><XCircle size={20} color="#ef4444" /><span className={styles.feedbackTitle} style={{ color: '#ef4444' }}>Not quite</span></>}
          </div>
          {exercise.explanation && <p className={styles.feedbackExplanation}>{exercise.explanation}</p>}
          {!isCorrect && exercise.type === 'speak' && (
            <button onClick={() => { setAnswered(false); setSpeechResult(''); setSpeechScore(null); setIsRecording(false); }} className={styles.speakRetryBtn}>
              <Mic size={18} /> Try Again
            </button>
          )}
          <button onClick={nextExercise} className={styles.continueBtn} style={{ background: isCorrect ? '#22c55e' : '#ef4444' }}>
            {exerciseIdx + 1 >= unit.exercises.length ? 'See Results' : 'Continue'}
          </button>
        </div>
      )}
      {showWall && <GuestWall isLoggedIn={false} />}
    </div>
  );
}
