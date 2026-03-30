'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Headphones, Loader2, ChevronRight, Play, Pause, ArrowRight, RefreshCw } from 'lucide-react';
import styles from '@/styles/AIPractice.module.scss';
import { useAuth } from '@/hooks/useAuth';
import AuthGate from '@/components/AuthGate';

const PART_MAP: Record<string, string> = {
  '1': 'Part 1 (Problem Solving)',
  '2': 'Part 2 (Daily Life Conversation)',
  '3': 'Part 3 (Information)',
  '4': 'Part 4 (News Item)',
  '5': 'Part 5 (Discussion)',
  '6': 'Part 6 (Viewpoints)',
};

const PART_LABELS: Record<string, string> = {
  '1': 'Part 1 — Problem Solving',
  '2': 'Part 2 — Daily Life',
  '3': 'Part 3 — Information',
  '4': 'Part 4 — News',
  '5': 'Part 5 — Discussion',
  '6': 'Part 6 — Viewpoints',
};

/* ─── LottieResult (inline) ─── */
function LottieResult({ score, size = 80 }: { score: number; size?: number }) {
  const [Lottie, setLottie] = useState<any>(null);
  const [data, setData] = useState<object | null>(null);
  useEffect(() => {
    import('lottie-react').then(m => setLottie(() => m.default));
    const src = score >= 70 ? '/lottie/trophy.json' : '/lottie/sad.json';
    fetch(src).then(r => r.json()).then(setData).catch(() => {});
  }, [score]);
  if (!Lottie || !data) return null;
  return <Lottie animationData={data} loop={false} style={{ width: size, height: size }} />;
}

export default function ListeningTaskPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn, loading: authLoading } = useAuth();
  const task = params.task as string;
  const partOrTask = PART_MAP[task];
  const partLabel = PART_LABELS[task];

  const [exercise, setExercise] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');

  // Audio state
  const [audioSrc, setAudioSrc] = useState('');
  const [clipAudioSrcs, setClipAudioSrcs] = useState<string[]>([]);
  const [currentClipIdx, setCurrentClipIdx] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [hasListened, setHasListened] = useState(false);
  const [phase, setPhase] = useState<'listen' | 'questions'>('listen');
  const audioRef = useRef<HTMLAudioElement>(null);

  const fetchExercise = useCallback(async () => {
    if (!partOrTask) return;
    setLoading(true);
    setError('');
    setExercise(null);
    setAnswers({});
    setSubmitted(false);
    setAudioSrc('');
    setClipAudioSrcs([]);
    setCurrentClipIdx(0);
    setIsAudioPlaying(false);
    setHasListened(false);
    setPhase('listen');
    try {
      const res = await fetch('/api/listening-library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partOrTask, difficulty }),
      });
      if (!res.ok) throw new Error('No exercises available');
      const data = await res.json();
      setExercise(data.exercise);
      if (data.clipAudioUrls) {
        setClipAudioSrcs(data.clipAudioUrls.map((u: string) => u + '?v=' + Date.now()));
      } else if (data.audioUrl) {
        setAudioSrc(data.audioUrl + '?v=' + Date.now());
      }
    } catch (e: any) {
      setError(e.message || 'Failed to load exercise');
    } finally {
      setLoading(false);
    }
  }, [partOrTask, difficulty]);

  useEffect(() => { fetchExercise(); }, [fetchExercise]);

  // Hide global layout
  useEffect(() => {
    const header = document.querySelector('header') as HTMLElement;
    const container = document.querySelector('[class*="container"]') as HTMLElement;
    const main = document.querySelector('main') as HTMLElement;
    if (header) header.style.display = 'none';
    if (container) { container.style.paddingTop = '0'; container.style.paddingBottom = '0'; }
    if (main) { main.style.padding = '0'; main.style.margin = '0'; }
    return () => {
      if (header) header.style.display = '';
      if (container) { container.style.paddingTop = ''; container.style.paddingBottom = ''; }
      if (main) { main.style.padding = ''; main.style.margin = ''; }
    };
  }, []);

  const selectAnswer = (qId: string | number, optIdx: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const getScore = () => {
    if (!exercise?.questions) return { correct: 0, total: 0 };
    const total = exercise.questions.length;
    const correct = exercise.questions.filter((q: any) => answers[q.id] === q.correct).length;
    return { correct, total };
  };

  const submitQuiz = () => {
    if (submitted) return;
    setSubmitted(true);
    fetch('/api/log-activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'listening', count: 1 }),
    }).catch(() => {});
  };

  const isClipMode = !!(exercise?.clips && clipAudioSrcs.length > 0);

  const getCurrentQuestions = () => {
    if (!exercise) return [];
    if (isClipMode && exercise.clips?.[currentClipIdx]?.questions) {
      return exercise.clips[currentClipIdx].questions;
    }
    return exercise.questions || [];
  };

  if (!partOrTask) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f1117', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Invalid task. <button onClick={() => router.push('/map')} style={{ color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer' }}>Back to Map</button></p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', color: '#e2e8f0' }}>
      {!authLoading && !isLoggedIn && <AuthGate message="Sign up free to practice Listening exercises with real audio!" />}
      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(15,17,23,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button onClick={() => router.push('/map')} style={{
          background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%',
          width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <ArrowLeft size={20} color="#e2e8f0" />
        </button>
        <div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
            <Headphones size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
            Listening — {partLabel}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          {(['beginner', 'intermediate', 'advanced'] as const).map(d => (
            <button key={d} onClick={() => setDifficulty(d)} style={{
              fontSize: '0.7rem', fontWeight: 600, padding: '4px 8px', borderRadius: 6,
              border: 'none', cursor: 'pointer',
              background: difficulty === d ? '#3b82f6' : 'rgba(255,255,255,0.08)',
              color: difficulty === d ? '#fff' : '#888',
            }}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Regenerate button */}
      {exercise && !loading && (
        <div style={{ maxWidth: 720, margin: '8px auto 0', padding: '0 16px' }}>
          <button onClick={fetchExercise} disabled={loading} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
          }}>
            <RefreshCw size={14} /> New Exercise
          </button>
        </div>
      )}

      {/* Content */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '16px 16px 100px' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <Loader2 size={36} className="animate-spin" style={{ color: '#3b82f6', margin: '0 auto' }} />
            <p style={{ color: '#888', marginTop: 12 }}>Loading exercise...</p>
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p style={{ color: '#ef4444' }}>{error}</p>
            <button onClick={fetchExercise} style={{ color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer', marginTop: 8 }}>Try Again</button>
          </div>
        )}

        {exercise && (
          <>
            {/* ─── Listen Phase ─── */}
            {phase === 'listen' && (audioSrc || clipAudioSrcs.length > 0) && (
              <div className={styles.listenCard}>
                <div className={styles.audioVisual}>
                  <div className={`${styles.audioWave} ${isAudioPlaying ? styles.audioWavePlaying : ''}`}>
                    {[...Array(5)].map((_, i) => <div key={i} className={styles.waveBar} />)}
                  </div>
                </div>

                <h2 className={styles.listenTitle}>{exercise.title}</h2>

                {isClipMode && exercise.clips && (
                  <div className={styles.clipBadge}>
                    <Headphones size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Clip {currentClipIdx + 1} of {clipAudioSrcs.length}
                  </div>
                )}

                <p className={styles.listenHint}>
                  {hasListened ? "Audio finished. Click below when you're ready to answer." : 'Listen carefully, then answer the questions.'}
                </p>

                <audio
                  key={isClipMode ? currentClipIdx : 'single'}
                  ref={audioRef}
                  src={isClipMode ? clipAudioSrcs[currentClipIdx] : audioSrc}
                  preload="auto"
                  onPlay={() => setIsAudioPlaying(true)}
                  onPause={() => setIsAudioPlaying(false)}
                  onEnded={() => { setIsAudioPlaying(false); setHasListened(true); }}
                />

                <div>
                  <button className={styles.playBtn} onClick={() => audioRef.current?.play()} disabled={hasListened}>
                    {isAudioPlaying ? <Pause size={20} /> : <Play size={20} />}
                    <span>{isAudioPlaying ? 'Playing...' : hasListened ? 'Already Played' : 'Play Audio'}</span>
                  </button>
                </div>

                {hasListened && (
                  <button className={styles.readyBtn} onClick={() => setPhase('questions')}>
                    Answer Questions <ArrowRight size={18} />
                  </button>
                )}

                {isClipMode && (
                  <div className={styles.clipTabs}>
                    {clipAudioSrcs.map((_, i) => (
                      <div key={i} className={i === currentClipIdx ? styles.clipTabActive : i < currentClipIdx ? styles.clipTabDone : styles.clipTab}>
                        Clip {i + 1}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── Questions Phase ─── */}
            {phase === 'questions' && (() => {
              const currentQuestions = getCurrentQuestions();
              const clipAnswered = currentQuestions.every((q: any) => answers[q.id] !== undefined);
              const isLastClip = !isClipMode || currentClipIdx >= (exercise.clips?.length || 1) - 1;

              return (
                <div className={styles.questionsSection}>
                  {/* Clip badge in question phase */}
                  {isClipMode && (
                    <div className={styles.clipBadge} style={{ marginBottom: '1rem' }}>
                      <Headphones size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Clip {currentClipIdx + 1} of {clipAudioSrcs.length}
                    </div>
                  )}

                  <h3 className={styles.questionsSectionTitle}>
                    {isClipMode ? `Clip ${currentClipIdx + 1} — Questions (${currentQuestions.length})` : `Questions (${(exercise.questions || []).length})`}
                  </h3>

                  {currentQuestions.map((q: any) => (
                    <div key={q.id} className={styles.questionCard}>
                      <p className={styles.questionText}>{q.id}. {q.question}</p>
                      <ul className={styles.optionsList}>
                        {q.options.map((opt: string, idx: number) => {
                          const letters = ['A', 'B', 'C', 'D'];
                          let cls = styles.optionBtn;
                          if (submitted) {
                            if (idx === q.correct) cls = `${styles.optionBtn} ${styles.correct}`;
                            else if (answers[q.id] === idx) cls = `${styles.optionBtn} ${styles.wrong}`;
                          } else if (answers[q.id] === idx) cls = `${styles.optionBtn} ${styles.selected}`;
                          return (
                            <li key={idx}>
                              <button className={cls} onClick={() => selectAnswer(q.id, idx)}>
                                <span className={styles.optionLetter}>{letters[idx]}</span>
                                {opt}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                      {submitted && q.explanation && <div className={styles.explanation}>{q.explanation}</div>}
                    </div>
                  ))}

                  {/* Clip mode: Check → Next Clip flow */}
                  {isClipMode && !submitted && (
                    <button className={styles.generateBtn} onClick={() => { setSubmitted(true); }}
                      disabled={!clipAnswered} style={{ marginTop: '0.75rem' }}>
                      Check Answers
                    </button>
                  )}
                  {isClipMode && submitted && !isLastClip && (
                    <button className={styles.generateBtn}
                      onClick={() => {
                        setCurrentClipIdx(prev => prev + 1);
                        setSubmitted(false);
                        setPhase('listen');
                        setHasListened(false);
                        setIsAudioPlaying(false);
                      }}
                      style={{ marginTop: '0.75rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                      Next Clip
                    </button>
                  )}
                  {isClipMode && submitted && isLastClip && (
                    <ScoreBlock score={getScore()} onNext={fetchExercise} />
                  )}

                  {/* Non-clip mode */}
                  {!isClipMode && (
                    <>
                      <button className={styles.generateBtn} onClick={submitQuiz}
                        disabled={submitted || (exercise.questions || []).some((q: any) => answers[q.id] === undefined)}
                        style={{ marginTop: '0.75rem', opacity: submitted ? 0.5 : 1 }}>
                        {submitted ? 'Answers Checked' : 'Check Answers'}
                      </button>
                      {submitted && <ScoreBlock score={getScore()} onNext={fetchExercise} />}
                    </>
                  )}
                </div>
              );
            })()}

            {/* Fallback: no audio */}
            {!audioSrc && clipAudioSrcs.length === 0 && exercise.passage && (
              <div className={styles.passageCard}>
                <p style={{ fontSize: '0.8rem', color: '#f59e0b', marginBottom: '0.5rem' }}>Audio not available — read the passage:</p>
                <p className={styles.passageText}>{exercise.passage}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Score Block ─── */
function ScoreBlock({ score, onNext }: { score: { correct: number; total: number }; onNext: () => void }) {
  const pct = Math.round((score.correct / Math.max(score.total, 1)) * 100);
  return (
    <div style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px', background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
        <LottieResult score={pct} size={80} />
        <div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
            {score.correct}<span style={{ fontSize: '1rem', color: '#888', fontWeight: 400 }}> / {score.total}</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: pct >= 80 ? '#22c55e' : pct >= 60 ? '#f59e0b' : '#ef4444', fontWeight: 600 }}>
            {pct === 100 ? 'Perfect!' : pct >= 70 ? 'Good job!' : 'Keep practicing!'}
          </div>
        </div>
      </div>
      <button onClick={onNext} style={{
        width: '100%', marginTop: 12, padding: '14px', borderRadius: 12,
        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        color: '#fff', fontWeight: 700, fontSize: '1rem', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        Next Exercise <ChevronRight size={20} />
      </button>
    </div>
  );
}
