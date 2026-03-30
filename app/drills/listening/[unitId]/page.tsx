'use client';
import dynamic from 'next/dynamic';
const LottieConfetti = dynamic(() => import('@/components/LottieConfetti'), { ssr: false });

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, ArrowRight, Sparkles, Trophy, Headphones, Volume2, Loader2 } from 'lucide-react';
import { usePlan } from '@/hooks/usePlan';
import { useGuest } from '@/hooks/useGuest';
import GuestWall from '@/components/GuestWall';
import ExerciseOfferPopup from '@/components/ExerciseOfferPopup';
import styles from '@/styles/DrillExercise.module.scss';

interface AudioLine { voice: string; text: string; }
interface Exercise {
  type: 'listenChoose'; audioLines: AudioLine[]; audioFile?: string;
  question: string; options: string[]; correct: number; explanation: string;
}
interface Unit {
  id: number; title: string; subtitle: string; icon: string; level: string;
  lesson: { title: string; points: string[] }; exercises: Exercise[];
}

const voiceMeta: Record<string, { name: string; initials: string; color: string; gradient: string }> = {
  female: { name: 'Ava', initials: 'A', color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #f472b6)' },
  female2: { name: 'Emma', initials: 'E', color: '#f472b6', gradient: 'linear-gradient(135deg, #f472b6, #fb7185)' },
  male: { name: 'Andrew', initials: 'A', color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)' },
  male2: { name: 'Brian', initials: 'B', color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #818cf8)' },
  narrator: { name: 'Narrator', initials: 'N', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
};

export default function ListeningUnitPage() {
  const router = useRouter();
  const params = useParams();
  const unitId = Number(params.unitId);
  const { isPro, loading: planLoading } = usePlan();
  const { isGuest, guestBlocked, guardAction, showWall, setShowWall, checkDone, trackExercise } = useGuest();

  const [unit, setUnit] = useState<Unit | null>(null);
  const [phase, setPhase] = useState<'listen' | 'answer' | 'result'>('listen');
  const [showOffer, setShowOffer] = useState(false);
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
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [activeLineIdx, setActiveLineIdx] = useState(-1);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [shuffledOpts, setShuffledOpts] = useState<{label: string; origIdx: number}[]>([]);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioQueueRef = useRef<AudioLine[]>([]);
  const audioIdxRef = useRef(0);

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
    fetch('/data/courses/listening.json').then(r => r.json()).then((data: Unit[]) => {
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
    setShuffledOpts(mapped); setPhase('listen'); setAudioPlayed(false); setAudioPlaying(false); setSelected(null); setAnswered(false);
  }, [exerciseIdx, exercise]);

  useEffect(() => { return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } }; }, []);

  const playAudioTTS = useCallback(() => {
    if (!exercise?.audioLines) return;
    setAudioPlaying(true); setAudioLoading(true);
    audioQueueRef.current = [...exercise.audioLines]; audioIdxRef.current = 0;
    const playNext = () => {
      const idx = audioIdxRef.current;
      if (idx >= audioQueueRef.current.length) { setAudioPlaying(false); setAudioPlayed(true); setActiveLineIdx(-1); setPhase('answer'); return; }
      setActiveLineIdx(idx);
      const line = audioQueueRef.current[idx];
      const audio = new Audio(`/api/tts?voice=${encodeURIComponent(line.voice)}&text=${encodeURIComponent(line.text)}`);
      audioRef.current = audio;
      audio.oncanplaythrough = () => setAudioLoading(false);
      audio.onended = () => { audioIdxRef.current++; setTimeout(playNext, 150); };
      audio.onerror = () => { audioIdxRef.current++; setTimeout(playNext, 100); };
      audio.play().catch(() => { audioIdxRef.current++; setTimeout(playNext, 200); });
    };
    playNext();
  }, [exercise]);

  const playAudio = useCallback(() => {
    if (audioPlaying) return;
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setAudioPlaying(true); setAudioLoading(true);
    if (exercise?.audioFile) {
      const audio = new Audio(exercise.audioFile + '?v=' + Date.now()); audioRef.current = audio;
      audio.oncanplaythrough = () => setAudioLoading(false);
      audio.onended = () => { setAudioPlaying(false); setAudioPlayed(true); setPhase('answer'); };
      audio.onerror = () => { setAudioPlaying(false); setAudioLoading(false); playAudioTTS(); };
      audio.play().catch(() => { setAudioPlaying(false); setAudioLoading(false); });
      return;
    }
    playAudioTTS();
  }, [exercise, audioPlaying, playAudioTTS]);

  const handleAnswer = useCallback((shuffledIdx: number) => {
    if (answered || !exercise || shuffledOpts.length === 0) return;
    const origIdx = shuffledOpts[shuffledIdx].origIdx;
    const correct = origIdx === exercise.correct;
    setSelected(shuffledIdx); setAnswered(true); setIsCorrect(correct);
    if (correct) setScore(s => s + 1);
    if (isGuest) trackExercise();
    setTotal(t => t + 1);
    if (!isGuest) {
      fetch('/api/log-activity', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'listening', count: 1 }) }).catch(() => {});
      if (!isPro) fetch('/api/daily-usage', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ category: 'drills' }) }).then(r => r.json()).then(data => { if (!data.isPro) setFreeUsed(data.used || 0); }).catch(() => {});
    }
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('exercise-complete'));
    setTimeout(() => { feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 100);
  }, [answered, exercise, shuffledOpts, isPro, isGuest, trackExercise]);

  const nextExercise = useCallback(() => {
    if (!unit) return;
    if (!isPro && freeUsed >= freeLimit) { setFreeBlocked(true); return; }
    if (exerciseIdx + 1 >= unit.exercises.length) {
      setPhase('result');
      if (!isPro) { const shown = sessionStorage.getItem('offerShown'); if (!shown) { setTimeout(() => setShowOffer(true), 1500); sessionStorage.setItem('offerShown', '1'); } }
      return;
    }
    setAnimateIn(false);
    setTimeout(() => { setExerciseIdx(i => i + 1); setAnimateIn(true); }, 200);
  }, [unit, exerciseIdx, isPro, freeUsed, freeLimit]);

  const replayAudio = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setAudioPlaying(false); setAudioPlayed(false); playAudio();
  }, [playAudio]);

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
          <button onClick={() => router.push('/drills/listening')} className={styles.paywallBackBtn}>
            ← Back to Listening Drills
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

  // Completion screen
  if (phase === 'result') {
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    return (
      <div className={styles.resultScreen}>
        <ExerciseOfferPopup show={showOffer} onClose={() => setShowOffer(false)} />
        <LottieConfetti trigger={true} />
        <Trophy size={64} color="#f59e0b" style={{ marginBottom: '1rem' }} />
        <h2 className={styles.resultTitle}>Unit Complete!</h2>
        <p className={styles.resultSubtitle}>You scored {score}/{total} ({pct}%)</p>
        <div className={styles.resultCircle} style={{ background: `conic-gradient(#3b82f6 ${pct * 3.6}deg, #232733 0deg)` }}>
          <div className={styles.resultCircleInner}>{pct}%</div>
        </div>
        <div className={styles.resultActions}>
          <button onClick={() => router.push('/drills/listening')} className={styles.resultBtnGhost}>
            ← Back
          </button>
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

  // Deduplicate speakers
  const speakers: { voice: string; indices: number[] }[] = [];
  const seenVoices = new Set<string>();
  exercise.audioLines.forEach((line, i) => {
    if (!seenVoices.has(line.voice)) { seenVoices.add(line.voice); speakers.push({ voice: line.voice, indices: [i] }); }
    else { speakers.find(s => s.voice === line.voice)?.indices.push(i); }
  });

  return (
    <div className={styles.pageImmersive} style={{ opacity: animateIn ? 1 : 0, transition: 'opacity 0.2s' }}>
      {/* Progress bar */}
      <div className={styles.progressBar}>
        <button onClick={() => { if (audioRef.current) audioRef.current.pause(); router.push('/drills/listening'); }} className={styles.backBtn}>
          <ArrowLeft size={22} />
        </button>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #3b82f6, #06b6d4)' }} />
        </div>
        <span className={styles.progressLabel}>{exerciseIdx + 1}/∞</span>
      </div>

      {/* Score strip */}
      <div className={styles.scoreStrip}>
        <span className={styles.scoreCorrect}><CheckCircle size={14} /> {score}</span>
        <span className={styles.scoreWrong}><XCircle size={14} /> {total - score}</span>
        <span className={styles.scorePct}>{total > 0 ? Math.round((score / total) * 100) : 0}%</span>
      </div>

      {/* Audio Player Section */}
      <div className={styles.audioSectionBlue}>
        {/* Speakers */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
          {speakers.map((sp) => {
            const meta = voiceMeta[sp.voice] || { name: sp.voice, initials: '?', color: '#888', gradient: 'linear-gradient(135deg, #888, #aaa)' };
            const isActive = audioPlaying && sp.indices.includes(activeLineIdx);
            return (
              <div key={sp.voice} className={isActive ? styles.speakerBubbleActive : (audioPlaying ? styles.speakerBubbleDim : styles.speakerBubble)}>
                <div className={isActive ? styles.speakerAvatarActive : styles.speakerAvatar} style={{ background: meta.gradient, boxShadow: isActive ? `0 0 20px ${meta.color}66` : 'none' }}>
                  {meta.initials}
                  {isActive && (
                    <div className={styles.speakerPulse}>
                      <div className={styles.speakerPulseDot} />
                    </div>
                  )}
                </div>
                <span className={styles.speakerName} style={{ color: isActive ? meta.color : 'rgba(255,255,255,0.5)' }}>
                  {meta.name}
                </span>
              </div>
            );
          })}
        </div>

        {!audioPlayed && !audioPlaying && (
          <button onClick={playAudio} className={styles.listenBtn}>
            <Headphones size={24} /> Listen
          </button>
        )}

        {audioPlaying && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            {audioLoading ? (
              <Loader2 size={32} color="#3b82f6" className={styles.spinner} />
            ) : (
              <div className={styles.waveContainer}>
                {[1,2,3,4,5,6,7].map(i => (
                  <div key={i} className={styles.waveBar} />
                ))}
              </div>
            )}
            <span className={styles.audioLoadingText}>
              {audioLoading ? 'Loading audio...' : 'Listening...'}
            </span>
          </div>
        )}

        {audioPlayed && !audioPlaying && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            <button onClick={replayAudio} className={styles.replayBtn}>
              <Volume2 size={18} /> Replay
            </button>
          </div>
        )}
      </div>

      {/* Question */}
      {(phase === 'answer' || answered) && (
        <>
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
                  <span className={letterClass}>
                    {icon || String.fromCharCode(65 + idx)}
                  </span>
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
              <button onClick={nextExercise} className={styles.nextBtn}>
                {exerciseIdx + 1 >= (unit?.exercises?.length || 0) ? 'See Results' : 'Next'}
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </>
      )}

      {showWall && <GuestWall isLoggedIn={false} />}
    </div>
  );
}
