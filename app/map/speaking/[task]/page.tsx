'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Mic, Loader2, ChevronRight, Clock, Lock, CheckCircle, ArrowRight, RefreshCw } from 'lucide-react';
import styles from '@/styles/AIPractice.module.scss';
import { useAuth } from '@/hooks/useAuth';
import AuthGate from '@/components/AuthGate';

const TASK_MAP: Record<string, string> = {
  '1': 'Task 1 (Giving Advice)',
  '2': 'Task 2 (Personal Experience)',
  '3': 'Task 3 (Describing a Scene)',
  '4': 'Task 4 (Making Predictions)',
  '5': 'Task 5 (Comparing and Persuading)',
  '6': 'Task 6 (Difficult Situation)',
  '7': 'Task 7 (Expressing Opinions)',
  '8': 'Task 8 (Unusual Situation)',
};
const TASK_LABELS: Record<string, string> = {
  '1': 'Task 1 — Advice', '2': 'Task 2 — Experience', '3': 'Task 3 — Scene',
  '4': 'Task 4 — Predictions', '5': 'Task 5 — Compare', '6': 'Task 6 — Difficult',
  '7': 'Task 7 — Opinions', '8': 'Task 8 — Unusual',
};

export default function SpeakingTaskPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn, loading: authLoading } = useAuth();
  const task = params.task as string;
  const partOrTask = TASK_MAP[task];
  const partLabel = TASK_LABELS[task];

  const [exercise, setExercise] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');

  const [phase, setPhase] = useState<'prompt' | 'prep' | 'speak' | 'review'>('prompt');
  const [countdown, setCountdown] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<any>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [isPro, setIsPro] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startRecordingRef = useRef<() => void>(() => {});
  const stopRecordingRef = useRef<() => void>(() => {});

  useEffect(() => {
    fetch('/api/user-plan').then(r => r.json()).then(d => {
      if (d.plan === 'pro' || d.plan === 'trial') setIsPro(true);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => {
      const v = countdown - 1;
      setCountdown(v);
      if (v === 0 && phase === 'prep') startRecordingRef.current();
      if (v === 0 && phase === 'speak') stopRecordingRef.current();
    }, 1000);
    return () => clearTimeout(t);
  }, [countdown, phase]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeOpts = MediaRecorder.isTypeSupported('audio/webm') ? { mimeType: 'audio/webm' }
        : MediaRecorder.isTypeSupported('audio/mp4') ? { mimeType: 'audio/mp4' } : {};
      const mr = new MediaRecorder(stream, mimeOpts);
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setPhase('speak');
      setCountdown(exercise?.speakTimeSeconds || 60);
    } catch {
      alert('Please allow microphone access to record your response.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') mediaRecorderRef.current.stop();
    setPhase('review');
  };

  startRecordingRef.current = startRecording;
  stopRecordingRef.current = stopRecording;

  const startPrep = () => {
    setPhase('prep'); setFeedback(null); setAudioBlob(null); setAudioUrl(null);
    setCountdown(exercise?.prepTimeSeconds || 30);
  };

  const submitFeedback = async () => {
    if (!audioBlob || !exercise) return;
    setFeedbackLoading(true);
    try {
      const ext = audioBlob.type.includes('mp4') || audioBlob.type.includes('m4a') ? '.m4a' : '.webm';
      const fd = new FormData();
      fd.append('audio', new File([audioBlob], `recording${ext}`, { type: audioBlob.type }));
      fd.append('task', partOrTask || '');
      fd.append('prompt', exercise.prompt || '');
      const res = await fetch('/api/speaking-feedback', { method: 'POST', body: fd });
      if (res.ok) setFeedback(await res.json());
    } catch {} finally { setFeedbackLoading(false); }
  };

  const fetchExercise = useCallback(async () => {
    if (!partOrTask) return;
    setLoading(true); setError(''); setExercise(null);
    setPhase('prompt'); setFeedback(null); setAudioBlob(null); setAudioUrl(null);
    try {
      // Task 3 & 4 use AI (need images), others use library
      if (task === '3' || task === '4') {
        const res = await fetch('/api/ai-practice', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ section: 'speaking', partOrTask, difficulty, previousTopics: [] }),
        });
        if (!res.ok) throw new Error('Failed to generate exercise');
        const data = await res.json();
        setExercise(data.exercise);
      } else {
        const taskId = `task${task}`;
        const res = await fetch('/api/speaking-library', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskId, difficulty }),
        });
        if (!res.ok) throw new Error('No exercises available');
        const data = await res.json();
        const p = data.prompt;
        setExercise({
          title: p.title || p.scenario || 'Speaking Exercise',
          prompt: p.prompt, scenario: p.scenario,
          tips: p.tips || [], prepTimeSeconds: p.prepTimeSeconds || 30,
          speakTimeSeconds: p.speakTimeSeconds || 60,
          bulletPoints: p.bulletPoints, context: p.context,
          optionA: p.optionA, optionB: p.optionB,
          choiceA: p.choiceA, choiceB: p.choiceB,
          statement: p.statement, difficulty: p.difficulty,
        });
      }
    } catch (e: any) {
      setError(e.message || 'Failed to load');
    } finally { setLoading(false); }
  }, [partOrTask, difficulty, task]);

  useEffect(() => { fetchExercise(); }, [fetchExercise]);

  // Hide global layout
  useEffect(() => {
    const h = document.querySelector('header') as HTMLElement;
    const c = document.querySelector('[class*="container"]') as HTMLElement;
    const m = document.querySelector('main') as HTMLElement;
    if (h) h.style.display = 'none';
    if (c) { c.style.paddingTop = '0'; c.style.paddingBottom = '0'; }
    if (m) { m.style.padding = '0'; m.style.margin = '0'; }
    return () => {
      if (h) h.style.display = '';
      if (c) { c.style.paddingTop = ''; c.style.paddingBottom = ''; }
      if (m) { m.style.padding = ''; m.style.margin = ''; }
    };
  }, []);

  if (!partOrTask) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f1117', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Invalid task. <button onClick={() => router.push('/map')} style={{ color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer' }}>Back to Map</button></p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', color: '#e2e8f0' }}>
      {!authLoading && !isLoggedIn && <AuthGate message="Sign up free to practice Speaking with AI feedback!" />}
      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(15,17,23,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button onClick={() => router.push('/map')} style={{
          background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%',
          width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <ArrowLeft size={20} color="#e2e8f0" />
        </button>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
          <Mic size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
          Speaking — {partLabel}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          {(['beginner', 'intermediate', 'advanced'] as const).map(d => (
            <button key={d} onClick={() => setDifficulty(d)} style={{
              fontSize: '0.7rem', fontWeight: 600, padding: '4px 8px', borderRadius: 6,
              border: 'none', cursor: 'pointer',
              background: difficulty === d ? '#f97316' : 'rgba(255,255,255,0.08)',
              color: difficulty === d ? '#fff' : '#888',
            }}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Regenerate button */}
      {exercise && !loading && phase === 'prompt' && (
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

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '16px 16px 100px' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <Loader2 size={36} className="animate-spin" style={{ color: '#f97316', margin: '0 auto' }} />
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
            <div className={styles.exerciseHeader}>
              <h2 className={styles.exerciseTitle}>{exercise.title}</h2>
              <span className={styles.exerciseMeta}>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
            </div>

            {/* Prompt */}
            <div className={styles.speakingPrompt}>
              <p className={styles.speakingText}>{exercise.prompt}</p>
            </div>

            {/* Phase: prompt */}
            {phase === 'prompt' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
                <div className={styles.promptMeta}>
                  <span className={styles.metaItem}><Clock size={14} /> Prep: {exercise.prepTimeSeconds || 30}s</span>
                  <span className={styles.metaItem}><Mic size={14} /> Speak: {exercise.speakTimeSeconds || 60}s</span>
                </div>
                {exercise.tips && exercise.tips.length > 0 && (
                  <ul className={styles.tipsList}>{exercise.tips.map((t: string, i: number) => <li key={i}>{t}</li>)}</ul>
                )}
                <button onClick={startPrep} style={{
                  padding: '1rem', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                  border: 'none', borderRadius: 14, color: '#fff', fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                  <Clock size={18} /> Start Preparation
                </button>
              </div>
            )}

            {/* Phase: prep */}
            {phase === 'prep' && (
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Preparation Time</div>
                <div style={{ fontSize: '4rem', fontWeight: 800, color: '#a78bfa', fontVariantNumeric: 'tabular-nums' }}>{countdown}s</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Think about your response... Recording starts automatically.</div>
              </div>
            )}

            {/* Phase: speak */}
            {phase === 'speak' && (
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Recording</div>
                <div style={{ fontSize: '4rem', fontWeight: 800, color: countdown <= 10 ? '#f87171' : '#34d399', fontVariantNumeric: 'tabular-nums' }}>{countdown}s</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Speak now! Recording will stop automatically.</div>
                <button onClick={stopRecording} style={{
                  marginTop: '1rem', padding: '0.8rem 2rem', background: '#ef4444',
                  border: 'none', borderRadius: 12, color: '#fff', fontWeight: 600, cursor: 'pointer',
                }}>Stop Early</button>
              </div>
            )}

            {/* Phase: review */}
            {phase === 'review' && (
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {audioUrl && <audio controls src={audioUrl} style={{ width: '100%', borderRadius: 8 }} />}

                {!feedback && (
                  <button onClick={submitFeedback} disabled={feedbackLoading} style={{
                    padding: '1rem', background: feedbackLoading ? '#4b5563' : 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none', borderRadius: 14, color: '#fff', fontWeight: 700, fontSize: '1rem',
                    cursor: feedbackLoading ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}>
                    {feedbackLoading ? 'Analyzing your response...' : 'Get AI Feedback'}
                  </button>
                )}

                {feedback && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Score Card */}
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(109,40,217,0.15))',
                      border: '1px solid rgba(139,92,246,0.3)', borderRadius: 16, padding: '1.5rem', textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>CELPIP Score</div>
                      <div style={{ fontSize: '3.5rem', fontWeight: 900, color: feedback.score >= 7 ? '#34d399' : feedback.score >= 5 ? '#fbbf24' : '#f87171' }}>
                        {feedback.score}<span style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.3)' }}>/12</span>
                      </div>
                      {feedback.overallComment && <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.5, marginTop: 8 }}>{feedback.overallComment}</p>}
                    </div>

                    {/* Blurred paywall for free users */}
                    {!isPro && (
                      <div style={{ position: 'relative', marginTop: '0.5rem' }}>
                        <div style={{ filter: 'blur(6px)', pointerEvents: 'none', userSelect: 'none' }}>
                          <div style={{ background: 'rgba(30,30,40,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
                            <h4 style={{ color: '#a78bfa', margin: '0 0 0.8rem', fontSize: '0.95rem' }}>Detailed Scores</h4>
                            <p style={{ color: 'rgba(255,255,255,0.5)' }}>Content: 7/12 · Vocabulary: 6/12 · Fluency: 5/12 · Structure: 6/12</p>
                          </div>
                        </div>
                        <div style={{
                          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                          alignItems: 'center', justifyContent: 'center', zIndex: 10,
                          background: 'rgba(10,14,26,0.4)', borderRadius: 14,
                        }}>
                          <Lock size={40} style={{ color: '#a78bfa', marginBottom: '0.5rem' }} />
                          <h3 style={{ color: '#fff', fontSize: '1.1rem', margin: '0 0 0.3rem', fontWeight: 700 }}>Unlock Full Feedback</h3>
                          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 1rem', textAlign: 'center', maxWidth: 280 }}>
                            See detailed scores, grammar corrections, vocabulary upgrades & model response
                          </p>
                          <button onClick={() => router.push('/pricing')} style={{
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff',
                            padding: '0.7rem 2rem', borderRadius: 12, border: 'none', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                          }}>Upgrade to Pro →</button>
                        </div>
                      </div>
                    )}

                    {/* Pro: Detailed Scores */}
                    {isPro && feedback.detailedFeedback && (
                      <div style={{ background: 'rgba(30,30,40,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
                        <h4 style={{ color: '#a78bfa', margin: '0 0 0.8rem', fontSize: '0.95rem' }}>Detailed Scores</h4>
                        {['content', 'vocabulary', 'fluency', 'structure'].map(cat => {
                          const fb = (feedback.detailedFeedback as any)[cat];
                          if (!fb) return null;
                          const labels: any = { content: 'Content', vocabulary: 'Vocabulary', fluency: 'Fluency', structure: 'Structure' };
                          const s = fb.score || 0;
                          return (
                            <div key={cat} style={{ marginBottom: '0.8rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>{labels[cat]}</span>
                                <span style={{ color: s >= 7 ? '#34d399' : s >= 5 ? '#fbbf24' : '#f87171', fontWeight: 700, fontSize: '0.85rem' }}>{s}/12</span>
                              </div>
                              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 6, height: 6, overflow: 'hidden' }}>
                                <div style={{ width: `${(s / 12) * 100}%`, height: '100%', borderRadius: 6, background: s >= 7 ? '#34d399' : s >= 5 ? '#fbbf24' : '#f87171' }} />
                              </div>
                              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginTop: 4 }}>{fb.comment}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Pro: Transcript */}
                    {isPro && feedback.transcript && (
                      <div style={{ background: 'rgba(30,30,40,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
                        <h4 style={{ color: '#60a5fa', margin: '0 0 0.5rem', fontSize: '0.95rem' }}>Your Transcript</h4>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic' }}>&ldquo;{feedback.transcript}&rdquo;</p>
                      </div>
                    )}

                    {/* Pro: Grammar */}
                    {isPro && feedback.grammarErrors?.length > 0 && (
                      <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 14, padding: '1.2rem' }}>
                        <h4 style={{ color: '#fbbf24', margin: '0 0 0.8rem', fontSize: '0.95rem' }}>Grammar Corrections</h4>
                        {feedback.grammarErrors.map((g: any, i: number) => (
                          <div key={i} style={{ marginBottom: i < feedback.grammarErrors.length - 1 ? '0.8rem' : 0 }}>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                              <span style={{ color: '#f87171', textDecoration: 'line-through', fontSize: '0.9rem' }}>{typeof g === 'string' ? g : g.error}</span>
                              {typeof g !== 'string' && g.correction && (<><span style={{ color: 'rgba(255,255,255,0.3)' }}>→</span><span style={{ color: '#34d399', fontWeight: 600, fontSize: '0.9rem' }}>{g.correction}</span></>)}
                            </div>
                            {typeof g !== 'string' && g.explanation && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: 4 }}>{g.explanation}</p>}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Pro: Vocabulary */}
                    {isPro && feedback.vocabularySuggestions?.length > 0 && (
                      <div style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 14, padding: '1.2rem' }}>
                        <h4 style={{ color: '#34d399', margin: '0 0 0.8rem', fontSize: '0.95rem' }}>Vocabulary Upgrades</h4>
                        {feedback.vocabularySuggestions.map((v: any, i: number) => (
                          <div key={i} style={{ marginBottom: i < feedback.vocabularySuggestions.length - 1 ? '0.8rem' : 0 }}>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>{typeof v === 'string' ? v : `"${v.used}"`}</span>
                              {typeof v !== 'string' && v.better && (<><span style={{ color: 'rgba(255,255,255,0.3)' }}>→</span><span style={{ color: '#34d399', fontWeight: 600, fontSize: '0.9rem' }}>&ldquo;{v.better}&rdquo;</span></>)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Pro: Strengths & Improvements */}
                    {isPro && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                        {feedback.strengths?.length > 0 && (
                          <div style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)', borderRadius: 14, padding: '1rem' }}>
                            <h4 style={{ color: '#34d399', margin: '0 0 0.5rem', fontSize: '0.85rem' }}><CheckCircle size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> Strengths</h4>
                            <ul style={{ margin: 0, paddingLeft: '1rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
                              {feedback.strengths.map((s: string, i: number) => <li key={i} style={{ marginBottom: 4 }}>{s}</li>)}
                            </ul>
                          </div>
                        )}
                        {feedback.improvements?.length > 0 && (
                          <div style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: 14, padding: '1rem' }}>
                            <h4 style={{ color: '#f87171', margin: '0 0 0.5rem', fontSize: '0.85rem' }}>To Improve</h4>
                            <ul style={{ margin: 0, paddingLeft: '1rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
                              {feedback.improvements.map((s: string, i: number) => <li key={i} style={{ marginBottom: 4 }}>{s}</li>)}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Pro: Model Response */}
                    {isPro && feedback.modelResponse && (
                      <div style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 14, padding: '1.2rem' }}>
                        <h4 style={{ color: '#60a5fa', margin: '0 0 0.5rem', fontSize: '0.95rem' }}>Improved Version</h4>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic' }}>&ldquo;{feedback.modelResponse}&rdquo;</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Next / Try Another */}
                {feedback && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                    <button onClick={fetchExercise} style={{
                      width: '100%', padding: '14px', borderRadius: 12,
                      background: 'linear-gradient(135deg, #f97316, #ea580c)',
                      color: '#fff', fontWeight: 700, fontSize: '1rem', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}>
                      Next Exercise <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
