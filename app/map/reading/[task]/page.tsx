'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Loader2, ChevronRight, ClipboardList, Mail, PenLine, RefreshCw } from 'lucide-react';
import styles from '@/styles/AIPractice.module.scss';
import { useAuth } from '@/hooks/useAuth';
import AuthGate from '@/components/AuthGate';

const PART_MAP: Record<string, string> = {
  '1': 'Part 1 (Reading Correspondence)',
  '2': 'Part 2 (Reading to Apply a Diagram)',
  '3': 'Part 3 (Reading for Information)',
  '4': 'Part 4 (Reading for Viewpoints)',
};

const PART_LABELS: Record<string, string> = {
  '1': 'Part 1 — Correspondence',
  '2': 'Part 2 — Diagram',
  '3': 'Part 3 — Information',
  '4': 'Part 4 — Viewpoints',
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

export default function ReadingTaskPage() {
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

  const fetchExercise = useCallback(async () => {
    if (!partOrTask) return;
    setLoading(true);
    setError('');
    setExercise(null);
    setAnswers({});
    setSubmitted(false);
    try {
      const res = await fetch('/api/reading-library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partOrTask, difficulty }),
      });
      if (!res.ok) throw new Error('No exercises available');
      const data = await res.json();
      setExercise(data.exercise);
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

  /* ─── Score logic ─── */
  const getScore = () => {
    if (!exercise) return { correct: 0, total: 0 };
    // Part 2
    if (exercise.poster && exercise.emailBlanks) {
      const blanks = exercise.emailBlanks || [];
      const comp = exercise.comprehension || [];
      const total = blanks.length + comp.length;
      let correct = 0;
      blanks.forEach((b: any) => { if (answers[`eb${b.id}`] === b.correct) correct++; });
      comp.forEach((c: any) => { if (answers[`comp${c.id}`] === c.correct) correct++; });
      return { correct, total };
    }
    // Part 4
    if (exercise.article && exercise.sectionA && exercise.sectionB) {
      const total = exercise.sectionA.length + exercise.sectionB.length;
      let correct = 0;
      exercise.sectionA.forEach((q: any) => { if (answers[`sa${q.id}`] === q.correct) correct++; });
      exercise.sectionB.forEach((q: any) => { if (answers[`sb${q.id}`] === q.correct) correct++; });
      return { correct, total };
    }
    // Part 3
    if (exercise.statements) {
      const opts = ['A', 'B', 'C', 'D', 'E'];
      const total = exercise.statements.length;
      const correct = exercise.statements.filter((st: any) => {
        const sel = answers[`st${st.id}`];
        return sel !== undefined && opts[sel] === st.correct;
      }).length;
      return { correct, total };
    }
    // Part 1
    if (exercise.questions) {
      const total = exercise.questions.length;
      const correct = exercise.questions.filter((q: any) => answers[q.id] === q.correct).length;
      return { correct, total };
    }
    return { correct: 0, total: 0 };
  };

  const submitQuiz = () => {
    if (submitted) return;
    setSubmitted(true);
    fetch('/api/log-activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'reading', count: 1 }),
    }).catch(() => {});
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
      {!authLoading && !isLoggedIn && <AuthGate message="Sign up free to practice Reading exercises and track your progress!" />}
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
            <BookOpen size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
            Reading — {partLabel}
          </div>
        </div>
        {/* Difficulty selector */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          {(['beginner', 'intermediate', 'advanced'] as const).map(d => (
            <button key={d} onClick={() => setDifficulty(d)} style={{
              fontSize: '0.7rem', fontWeight: 600, padding: '4px 8px', borderRadius: 6,
              border: 'none', cursor: 'pointer',
              background: difficulty === d ? '#22c55e' : 'rgba(255,255,255,0.08)',
              color: difficulty === d ? '#000' : '#888',
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
            <Loader2 size={36} className="animate-spin" style={{ color: '#22c55e', margin: '0 auto' }} />
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
          <div className={styles.exerciseWrap}>
            {/* Title */}
            <div className={styles.exerciseHeader}>
              <h2 className={styles.exerciseTitle}>{exercise.title}</h2>
              <span className={styles.exerciseMeta}>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
            </div>

            {/* ─── Part 1: Passage ─── */}
            {exercise.passage && !exercise.diagram && !exercise.poster && !exercise.paragraphs && !exercise.article && (
              <div className={styles.passageCard}>
                <p className={styles.passageText}>{exercise.passage}</p>
              </div>
            )}

            {/* ─── Part 1: MC Questions (Section A only) ─── */}
            {exercise.questions && !exercise.poster && !exercise.statements && !exercise.sectionA && (() => {
              const qs = exercise.replyEmail
                ? exercise.questions.filter((q: any) => q.section !== 'B')
                : exercise.questions;
              return (
                <div className={styles.questionsSection}>
                  <h3 className={styles.questionsSectionTitle}>Questions ({qs.length})</h3>
                  {qs.map((q: any) => (
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
                        {submitted && q.explanation && <div className={styles.explanation}>{q.explanation}</div>}
                      </ul>
                    </div>
                  ))}

                  {/* Submit for non-replyEmail parts */}
                  {!exercise.replyEmail && (
                    <>
                      <button className={styles.generateBtn} onClick={submitQuiz}
                        disabled={submitted || qs.some((q: any) => answers[q.id] === undefined)}
                        style={{ marginTop: '0.75rem', opacity: submitted ? 0.5 : 1 }}>
                        {submitted ? 'Answers Checked' : 'Check Answers'}
                      </button>
                      {submitted && <ScoreBlock score={getScore()} onNext={fetchExercise} />}
                    </>
                  )}
                </div>
              );
            })()}

            {/* ─── Part 1: Reply Email (Section B blanks) ─── */}
            {exercise.replyEmail && (
              <div className={styles.passageCard} style={{ marginTop: '0.5rem' }}>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontStyle: 'italic', marginBottom: '0.8rem' }}>
                  Here is a response to the message. Complete the response by filling in the blanks.
                </p>
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '16px', border: '1px solid rgba(255,255,255,0.08)', lineHeight: 2.2 }}>
                  {(() => {
                    const email = exercise.replyEmail as string;
                    const parts = email.split(/(\[BLANK \d+\])/);
                    const blankQs = (exercise.questions || []).filter((q: any) => q.section === 'B');
                    return parts.map((part: string, pi: number) => {
                      const m = part.match(/\[BLANK (\d+)\]/);
                      if (!m) return <span key={pi} style={{ color: 'rgba(255,255,255,0.85)', whiteSpace: 'pre-wrap' }}>{part}</span>;
                      const bIdx = parseInt(m[1]) - 1;
                      const q = blankQs[bIdx];
                      if (!q) return <span key={pi} style={{ background: 'rgba(96,165,250,0.2)', padding: '2px 10px', borderRadius: 6, color: '#60a5fa', fontWeight: 700 }}>{part}</span>;
                      const sel = answers[q.id];
                      const ok = submitted && sel === q.correct;
                      const bad = submitted && sel !== undefined && sel !== q.correct;
                      return (
                        <span key={pi} style={{ display: 'inline-block', verticalAlign: 'top' }}>
                          <select value={sel ?? ''} disabled={submitted}
                            onChange={e => setAnswers(p => ({ ...p, [q.id]: parseInt(e.target.value) }))}
                            style={{
                              background: submitted ? (ok ? 'rgba(34,197,94,0.2)' : bad ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)') : 'rgba(255,255,255,0.08)',
                              color: submitted ? (ok ? '#22c55e' : bad ? '#ef4444' : '#fff') : '#fff',
                              border: `1.5px solid ${submitted ? (ok ? '#22c55e' : bad ? '#ef4444' : 'rgba(255,255,255,0.15)') : 'rgba(96,165,250,0.4)'}`,
                              borderRadius: 8, padding: '4px 8px', fontSize: '0.85rem', fontWeight: 600,
                              cursor: submitted ? 'default' : 'pointer', minWidth: 140,
                            }}>
                            <option value="" disabled style={{ background: '#2a2a3c' }}>[ {bIdx + 7}...... ]</option>
                            {q.options.map((opt: string, oi: number) => (
                              <option key={oi} value={oi} style={{ background: '#2a2a3c' }}>{opt}</option>
                            ))}
                          </select>
                          {bad && <span style={{ display: 'block', fontSize: '0.72rem', color: '#22c55e', fontWeight: 600, marginTop: 2, paddingLeft: 4 }}>✓ {q.options[q.correct]}</span>}
                        </span>
                      );
                    });
                  })()}
                </div>
                <button className={styles.generateBtn} onClick={submitQuiz}
                  disabled={submitted || Object.keys(answers).length < (exercise.questions?.length || 0)}
                  style={{ marginTop: '1rem', opacity: submitted ? 0.5 : 1 }}>
                  {submitted ? 'Answers Checked' : 'Check Answers'}
                </button>
                {submitted && <ScoreBlock score={getScore()} onNext={fetchExercise} />}
              </div>
            )}

            {/* ─── Part 2: Poster + Email Blanks + Comprehension ─── */}
            {exercise.poster && (
              <div className={styles.passageCard}>
                <div style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(251,191,36,0.04))', borderRadius: 12, padding: '20px', border: '1px solid rgba(245,158,11,0.2)', marginBottom: '1rem' }}>
                  <h3 style={{ color: '#f59e0b', fontWeight: 800, fontSize: '1.1rem', textAlign: 'center', marginBottom: exercise.poster.subheading ? '0.2rem' : '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <ClipboardList size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> {exercise.poster.heading}
                  </h3>
                  {exercise.poster.subheading && <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', textAlign: 'center', marginBottom: '1rem' }}>{exercise.poster.subheading}</p>}
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {exercise.poster.sections?.map((sec: any, si: number) => (
                      <div key={si} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <h4 style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem', borderBottom: '1px solid rgba(251,191,36,0.2)', paddingBottom: '0.4rem' }}>{sec.name}</h4>
                        <div style={{ display: 'grid', gap: '4px' }}>
                          {sec.details?.map((d: any, di: number) => (
                            <div key={di} style={{ display: 'flex', gap: '8px', fontSize: '0.82rem' }}>
                              <span style={{ color: 'rgba(255,255,255,0.5)', minWidth: 70, fontWeight: 600 }}>{d.label}:</span>
                              <span style={{ color: 'rgba(255,255,255,0.85)' }}>{d.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {exercise.poster.footer && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontStyle: 'italic', marginTop: '0.8rem', textAlign: 'center' }}>{exercise.poster.footer}</p>}
                </div>
                {exercise.email && (
                  <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <h4 style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#60a5fa', fontSize: '0.85rem' }}><Mail size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Complete the Email</h4>
                    <div className={styles.passageText} style={{ margin: 0, lineHeight: 2.2 }}>
                      <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '0.5rem' }}>{exercise.email.greeting}</p>
                      <div style={{ whiteSpace: 'pre-wrap' }}>
                        {(() => {
                          const body = exercise.email.body as string;
                          const parts = body.split(/(\[\d+\])/);
                          return parts.map((part: string, pi: number) => {
                            const m = part.match(/\[(\d+)\]/);
                            if (!m) return <span key={pi}>{part}</span>;
                            const bn = parseInt(m[1]);
                            const q = exercise.emailBlanks?.find((b: any) => b.id === bn);
                            if (!q) return <span key={pi} style={{ background: 'rgba(96,165,250,0.2)', padding: '2px 10px', borderRadius: 6, color: '#60a5fa', fontWeight: 700 }}>{part}</span>;
                            const sel = answers[`eb${q.id}`];
                            const ok = submitted && sel === q.correct;
                            const bad = submitted && sel !== undefined && sel !== q.correct;
                            return (
                              <span key={pi} style={{ display: 'inline-block', verticalAlign: 'top' }}>
                                <select value={sel ?? ''} disabled={submitted}
                                  onChange={e => setAnswers(p => ({ ...p, [`eb${q.id}`]: parseInt(e.target.value) }))}
                                  style={{
                                    background: submitted ? (ok ? 'rgba(34,197,94,0.2)' : bad ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)') : 'rgba(255,255,255,0.08)',
                                    color: submitted ? (ok ? '#22c55e' : bad ? '#ef4444' : '#fff') : '#fff',
                                    border: `1.5px solid ${submitted ? (ok ? '#22c55e' : bad ? '#ef4444' : 'rgba(255,255,255,0.15)') : 'rgba(96,165,250,0.4)'}`,
                                    borderRadius: 8, padding: '4px 8px', fontSize: '0.85rem', fontWeight: 600,
                                    cursor: submitted ? 'default' : 'pointer', minWidth: 140,
                                  }}>
                                  <option value="" disabled style={{ background: '#2a2a3c' }}>[ {bn} ]</option>
                                  {q.options.map((opt: string, oi: number) => (
                                    <option key={oi} value={oi} style={{ background: '#2a2a3c' }}>{opt}</option>
                                  ))}
                                </select>
                                {bad && <span style={{ display: 'block', fontSize: '0.72rem', color: '#22c55e', fontWeight: 600, marginTop: 2, paddingLeft: 4 }}>✓ {q.options[q.correct]}</span>}
                              </span>
                            );
                          });
                        })()}
                      </div>
                      <p style={{ color: 'rgba(255,255,255,0.85)', marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>{exercise.email.closing}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Part 2: Comprehension */}
            {exercise.poster && exercise.comprehension && (
              <div className={styles.passageCard} style={{ marginTop: '0.5rem' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '0.8rem', color: '#a78bfa', fontSize: '0.9rem' }}><PenLine size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Comprehension Questions</h4>
                {exercise.comprehension.map((q: any, qi: number) => {
                  const key = `comp${q.id}`;
                  const ok = submitted && answers[key] === q.correct;
                  const bad = submitted && answers[key] !== undefined && answers[key] !== q.correct;
                  return (
                    <div key={qi} style={{ marginBottom: '1rem' }}>
                      <p style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>{q.id}. {q.question}</p>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {q.options.map((opt: string, oi: number) => {
                          const sel = answers[key] === oi;
                          const optOk = submitted && oi === q.correct;
                          const optBad = submitted && sel && oi !== q.correct;
                          return (
                            <li key={oi}>
                              <button onClick={() => !submitted && setAnswers(p => ({ ...p, [key]: oi }))} disabled={submitted}
                                style={{
                                  width: '100%', textAlign: 'left', padding: '10px 14px', marginBottom: 6, borderRadius: 10, fontSize: '0.85rem',
                                  cursor: submitted ? 'default' : 'pointer',
                                  background: optOk ? 'rgba(34,197,94,0.15)' : optBad ? 'rgba(239,68,68,0.15)' : sel ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)',
                                  border: `1.5px solid ${optOk ? '#22c55e' : optBad ? '#ef4444' : sel ? '#8b5cf6' : 'rgba(255,255,255,0.08)'}`,
                                  color: optOk ? '#22c55e' : optBad ? '#ef4444' : sel ? '#c4b5fd' : 'rgba(255,255,255,0.8)',
                                  fontWeight: sel || optOk ? 600 : 400,
                                }}>
                                {String.fromCharCode(65 + oi)}. {opt}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
                <button className={styles.generateBtn} onClick={submitQuiz}
                  disabled={submitted || (() => {
                    const bOk = (exercise.emailBlanks || []).every((b: any) => answers[`eb${b.id}`] !== undefined);
                    const cOk = (exercise.comprehension || []).every((c: any) => answers[`comp${c.id}`] !== undefined);
                    return !bOk || !cOk;
                  })()}
                  style={{ marginTop: '0.75rem', opacity: submitted ? 0.5 : 1 }}>
                  {submitted ? 'Answers Checked' : 'Check Answers'}
                </button>
                {submitted && <ScoreBlock score={getScore()} onNext={fetchExercise} />}
              </div>
            )}

            {/* ─── Part 3: Paragraphs + Statements ─── */}
            {exercise.paragraphs && Array.isArray(exercise.paragraphs) && (
              <div className={styles.passageCard}>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontStyle: 'italic', marginBottom: '1rem' }}>Read the following message.</p>
                {exercise.paragraphs.map((para: any, i: number) => (
                  <div key={i} style={{ marginBottom: i < exercise.paragraphs.length - 1 ? '1.2rem' : 0 }}>
                    <h4 style={{ fontWeight: 800, marginBottom: '0.4rem', color: '#a78bfa', fontSize: '0.95rem' }}>{para.label || String.fromCharCode(65 + i)}.</h4>
                    <p className={styles.passageText} style={{ margin: 0, lineHeight: 1.7 }}>{para.text}</p>
                  </div>
                ))}
              </div>
            )}
            {exercise.statements && Array.isArray(exercise.statements) && (
              <div className={styles.passageCard} style={{ marginTop: '0.5rem' }}>
                <div style={{ background: 'rgba(167,139,250,0.08)', borderRadius: 10, padding: '14px', marginBottom: '1rem', border: '1px solid rgba(167,139,250,0.15)' }}>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>
                    Decide which paragraph, <strong>(A)</strong> to <strong>(D)</strong>, has the information given in each statement below.
                    Select <strong>(E)</strong> if the information is not given in any of the paragraphs.
                  </p>
                </div>
                {exercise.statements.map((st: any, si: number) => {
                  const key = `st${st.id}`;
                  const opts = ['A', 'B', 'C', 'D', 'E'];
                  const sel = answers[key];
                  const correctIdx = opts.indexOf(st.correct);
                  const ok = submitted && sel === correctIdx;
                  const bad = submitted && sel !== undefined && sel !== correctIdx;
                  return (
                    <div key={si} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '0.8rem', padding: '10px 12px', borderRadius: 10,
                      background: submitted ? (ok ? 'rgba(34,197,94,0.06)' : bad ? 'rgba(239,68,68,0.06)' : 'transparent') : 'transparent',
                      border: `1px solid ${submitted ? (ok ? 'rgba(34,197,94,0.2)' : bad ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)') : 'rgba(255,255,255,0.05)'}`,
                    }}>
                      <select value={sel ?? ''} disabled={submitted}
                        onChange={e => setAnswers(p => ({ ...p, [key]: parseInt(e.target.value) }))}
                        style={{
                          background: submitted ? (ok ? 'rgba(34,197,94,0.2)' : bad ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)') : 'rgba(255,255,255,0.08)',
                          color: submitted ? (ok ? '#22c55e' : bad ? '#ef4444' : '#fff') : '#fff',
                          border: `1.5px solid ${submitted ? (ok ? '#22c55e' : bad ? '#ef4444' : 'rgba(255,255,255,0.15)') : 'rgba(167,139,250,0.4)'}`,
                          borderRadius: 8, padding: '6px 10px', fontSize: '0.85rem', fontWeight: 700, minWidth: 60, cursor: submitted ? 'default' : 'pointer', flexShrink: 0,
                        }}>
                        <option value="" disabled style={{ background: '#2a2a3c' }}>{st.id}...</option>
                        {opts.map((o, oi) => <option key={oi} value={oi} style={{ background: '#2a2a3c' }}>{o}</option>)}
                      </select>
                      <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', lineHeight: 1.5, paddingTop: '4px' }}>
                        {st.text}
                        {submitted && bad && <span style={{ color: '#22c55e', fontWeight: 600, marginLeft: 8 }}>→ {st.correct}</span>}
                      </span>
                    </div>
                  );
                })}
                <button className={styles.generateBtn} onClick={submitQuiz}
                  disabled={submitted || !(exercise.statements || []).every((st: any) => answers[`st${st.id}`] !== undefined)}
                  style={{ marginTop: '0.75rem', opacity: submitted ? 0.5 : 1 }}>
                  {submitted ? 'Answers Checked' : 'Check Answers'}
                </button>
                {submitted && <ScoreBlock score={getScore()} onNext={fetchExercise} />}
              </div>
            )}

            {/* ─── Part 4: Article + Section A + Section B ─── */}
            {exercise.article && exercise.sectionA && (
              <>
                <div className={styles.passageCard}>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontStyle: 'italic', marginBottom: '0.8rem' }}>Read the following message.</p>
                  <p className={styles.passageText} style={{ lineHeight: 1.8 }}>{exercise.article}</p>
                </div>
                <div className={styles.passageCard} style={{ marginTop: '0.5rem' }}>
                  <div style={{ background: 'rgba(96,165,250,0.08)', borderRadius: 10, padding: '12px', marginBottom: '1rem', border: '1px solid rgba(96,165,250,0.15)' }}>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.82rem', margin: 0, fontWeight: 600 }}>Choose the best option according to the information.</p>
                  </div>
                  {exercise.sectionA.map((q: any, qi: number) => {
                    const key = `sa${q.id}`;
                    const sel = answers[key];
                    const ok = submitted && sel === q.correct;
                    const bad = submitted && sel !== undefined && sel !== q.correct;
                    return (
                      <div key={qi} style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'baseline', flexWrap: 'wrap', fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)', lineHeight: 2.2 }}>
                          <span style={{ fontWeight: 600 }}>{q.id}.</span>
                          <span>{q.text}</span>
                          <select value={sel ?? ''} disabled={submitted}
                            onChange={e => setAnswers(p => ({ ...p, [key]: parseInt(e.target.value) }))}
                            style={{
                              background: submitted ? (ok ? 'rgba(34,197,94,0.2)' : bad ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)') : 'rgba(255,255,255,0.08)',
                              color: submitted ? (ok ? '#22c55e' : bad ? '#ef4444' : '#fff') : '#fff',
                              border: `1.5px solid ${submitted ? (ok ? '#22c55e' : bad ? '#ef4444' : 'rgba(255,255,255,0.15)') : 'rgba(96,165,250,0.4)'}`,
                              borderRadius: 8, padding: '4px 8px', fontSize: '0.82rem', fontWeight: 600,
                              cursor: submitted ? 'default' : 'pointer', minWidth: 180, maxWidth: '100%',
                            }}>
                            <option value="" disabled style={{ background: '#2a2a3c' }}>[ {q.id}...... ]</option>
                            {q.options.map((opt: string, oi: number) => <option key={oi} value={oi} style={{ background: '#2a2a3c' }}>{opt}</option>)}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {exercise.readerComment && exercise.sectionB && (
                  <div className={styles.passageCard} style={{ marginTop: '0.5rem' }}>
                    <div style={{ background: 'rgba(52,211,153,0.08)', borderRadius: 10, padding: '12px', marginBottom: '1rem', border: '1px solid rgba(52,211,153,0.15)' }}>
                      <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.82rem', margin: 0, fontWeight: 600 }}>
                        Complete the comment by choosing the best option to fill in each blank.
                      </p>
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', lineHeight: 2.4 }}>
                      {(() => {
                        const text = exercise.readerComment as string;
                        const parts = text.split(/(\[\d+(?:\.{3,}|…+)?\])/);
                        return parts.map((part: string, pi: number) => {
                          const m = part.match(/\[(\d+)/);
                          if (!m) return <span key={pi}>{part}</span>;
                          const bn = parseInt(m[1]);
                          const q = exercise.sectionB.find((b: any) => b.id === bn);
                          if (!q) return <span key={pi} style={{ background: 'rgba(52,211,153,0.2)', padding: '2px 10px', borderRadius: 6, color: '#34d399', fontWeight: 700 }}>{part}</span>;
                          const key = `sb${q.id}`;
                          const sel = answers[key];
                          const ok = submitted && sel === q.correct;
                          const bad = submitted && sel !== undefined && sel !== q.correct;
                          return (
                            <span key={pi} style={{ display: 'inline-block', verticalAlign: 'top' }}>
                              <select value={sel ?? ''} disabled={submitted}
                                onChange={e => setAnswers(p => ({ ...p, [key]: parseInt(e.target.value) }))}
                                style={{
                                  background: submitted ? (ok ? 'rgba(34,197,94,0.2)' : bad ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)') : 'rgba(255,255,255,0.08)',
                                  color: submitted ? (ok ? '#22c55e' : bad ? '#ef4444' : '#fff') : '#fff',
                                  border: `1.5px solid ${submitted ? (ok ? '#22c55e' : bad ? '#ef4444' : 'rgba(255,255,255,0.15)') : 'rgba(52,211,153,0.4)'}`,
                                  borderRadius: 8, padding: '4px 8px', fontSize: '0.85rem', fontWeight: 600,
                                  cursor: submitted ? 'default' : 'pointer', minWidth: 110,
                                }}>
                                <option value="" disabled style={{ background: '#2a2a3c' }}>[ {bn}...... ]</option>
                                {q.options.map((opt: string, oi: number) => <option key={oi} value={oi} style={{ background: '#2a2a3c' }}>{opt}</option>)}
                              </select>
                              {bad && <span style={{ display: 'block', fontSize: '0.72rem', color: '#22c55e', fontWeight: 600, marginTop: 2, paddingLeft: 4 }}>✓ {q.options[q.correct]}</span>}
                            </span>
                          );
                        });
                      })()}
                    </div>
                    <button className={styles.generateBtn} onClick={submitQuiz}
                      disabled={submitted || (() => {
                        const aOk = (exercise.sectionA || []).every((q: any) => answers[`sa${q.id}`] !== undefined);
                        const bOk = (exercise.sectionB || []).every((q: any) => answers[`sb${q.id}`] !== undefined);
                        return !aOk || !bOk;
                      })()}
                      style={{ marginTop: '1rem', opacity: submitted ? 0.5 : 1 }}>
                      {submitted ? 'Answers Checked' : 'Check Answers'}
                    </button>
                    {submitted && <ScoreBlock score={getScore()} onNext={fetchExercise} />}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Score Block (reusable) ─── */
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
        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
        color: '#fff', fontWeight: 700, fontSize: '1rem', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        Next Exercise <ChevronRight size={20} />
      </button>
    </div>
  );
}
