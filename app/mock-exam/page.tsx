'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Sparkles, Clock, BookOpen, PenTool, Headphones, Mic,
  ChevronRight, Play, CheckCircle, AlertCircle, Loader2,
  BarChart3, ArrowRight, RotateCcw, Trophy, Target,
  Volume2, FileText, Pause, TrendingUp
} from 'lucide-react';
import { usePlan } from '@/hooks/usePlan';
import { useAdaptiveDifficulty } from '@/hooks/useAdaptiveDifficulty';
import { ProGate } from '@/components/ProGate';
import { analytics } from '@/lib/analytics';
import styles from '@/styles/AIMockExam.module.scss';

// ─── Types ───────────────────────────────────────
type ExamPhase = 'setup' | 'section' | 'review' | 'evaluating' | 'results';
type Section = 'listening' | 'reading' | 'writing' | 'speaking';
type Difficulty = 'intermediate' | 'advanced';

interface ExamQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

interface ExamSection {
  section: Section;
  part: string;
  title: string;
  passage?: string;
  audio?: string;
  questions?: ExamQuestion[];
  scenario?: string;
  bullets?: string[];
  prompt?: string;
  prepTime?: number;
  speakTime?: number;
}

interface SectionResult {
  section: Section;
  label: string;
  score: number;
  total: number;
  answers?: Record<number, number>;
  writingText?: string;
  writingPrompt?: string;
  timeTaken: number;
}

interface AIFeedback {
  overallCLB: string;
  listeningCLB: string;
  readingCLB: string;
  writingCLB: string;
  speakingNote: string;
  overallFeedback: string;
  listeningFeedback: { strengths: string[]; improvements: string[]; tips: string[] };
  readingFeedback: { strengths: string[]; improvements: string[]; tips: string[] };
  writingFeedback: {
    score: string;
    strengths: string[];
    errors: { original: string; correction: string; explanation: string }[];
    improvements: string[];
    modelResponse: string;
  };
  studyPlan: string[];
  encouragement: string;
}

// ─── Exam structures ─────────────────────────────
type ExamMode = 'quick' | 'full';

interface ExamPartDef { section: Section; partId: string; label: string; timeMinutes: number }

const QUICK_PARTS: ExamPartDef[] = [
  { section: 'listening', partId: 'Part 1 (Problem Solving)', label: 'Listening — Problem Solving', timeMinutes: 8 },
  { section: 'listening', partId: 'Part 3 (Information)', label: 'Listening — Information', timeMinutes: 6 },
  { section: 'listening', partId: 'Part 5 (Discussion)', label: 'Listening — Discussion', timeMinutes: 8 },
  { section: 'reading', partId: 'Part 1 (Reading Correspondence)', label: 'Reading — Correspondence', timeMinutes: 11 },
  { section: 'reading', partId: 'Part 3 (Reading for Information)', label: 'Reading — Information', timeMinutes: 10 },
  { section: 'writing', partId: 'Task 1 (Email/Letter)', label: 'Writing — Email', timeMinutes: 27 },
  { section: 'speaking', partId: 'Task 1 (Giving Advice)', label: 'Speaking — Giving Advice', timeMinutes: 2 },
  { section: 'speaking', partId: 'Task 5 (Comparing and Persuading)', label: 'Speaking — Compare & Persuade', timeMinutes: 2 },
];

const FULL_PARTS: ExamPartDef[] = [
  // Listening (~50 min)
  { section: 'listening', partId: 'Part 1 (Problem Solving)', label: 'Listening — Part 1: Problem Solving', timeMinutes: 8 },
  { section: 'listening', partId: 'Part 2 (Daily Life)', label: 'Listening — Part 2: Daily Life', timeMinutes: 7 },
  { section: 'listening', partId: 'Part 3 (Information)', label: 'Listening — Part 3: Information', timeMinutes: 7 },
  { section: 'listening', partId: 'Part 4 (News Item)', label: 'Listening — Part 4: News Item', timeMinutes: 7 },
  { section: 'listening', partId: 'Part 5 (Discussion)', label: 'Listening — Part 5: Discussion', timeMinutes: 10 },
  { section: 'listening', partId: 'Part 6 (Viewpoints)', label: 'Listening — Part 6: Viewpoints', timeMinutes: 11 },
  // Reading (~55 min)
  { section: 'reading', partId: 'Part 1 (Reading Correspondence)', label: 'Reading — Part 1: Correspondence', timeMinutes: 11 },
  { section: 'reading', partId: 'Part 2 (Diagram)', label: 'Reading — Part 2: Diagram', timeMinutes: 9 },
  { section: 'reading', partId: 'Part 3 (Reading for Information)', label: 'Reading — Part 3: Information', timeMinutes: 10 },
  { section: 'reading', partId: 'Part 4 (Viewpoints)', label: 'Reading — Part 4: Viewpoints', timeMinutes: 13 },
  // Writing (~53 min)
  { section: 'writing', partId: 'Task 1 (Email/Letter)', label: 'Writing — Task 1: Email', timeMinutes: 27 },
  { section: 'writing', partId: 'Task 2 (Survey)', label: 'Writing — Task 2: Survey Response', timeMinutes: 26 },
  // Speaking (~18 min)
  { section: 'speaking', partId: 'Task 1 (Giving Advice)', label: 'Speaking — Task 1: Giving Advice', timeMinutes: 2 },
  { section: 'speaking', partId: 'Task 2 (Personal Experience)', label: 'Speaking — Task 2: Personal Experience', timeMinutes: 2 },
  { section: 'speaking', partId: 'Task 3 (Describing a Scene)', label: 'Speaking — Task 3: Describing a Scene', timeMinutes: 2 },
  { section: 'speaking', partId: 'Task 4 (Making Predictions)', label: 'Speaking — Task 4: Making Predictions', timeMinutes: 2 },
  { section: 'speaking', partId: 'Task 5 (Comparing and Persuading)', label: 'Speaking — Task 5: Compare & Persuade', timeMinutes: 2 },
  { section: 'speaking', partId: 'Task 6 (Dealing with a Difficult Situation)', label: 'Speaking — Task 6: Difficult Situation', timeMinutes: 2 },
  { section: 'speaking', partId: 'Task 7 (Expressing Opinions)', label: 'Speaking — Task 7: Expressing Opinions', timeMinutes: 2 },
  { section: 'speaking', partId: 'Task 8 (Describing an Unusual Situation)', label: 'Speaking — Task 8: Unusual Situation', timeMinutes: 2 },
];

export default function AIMockExamPage() {
  const { isPro, loading: planLoading } = usePlan();
  const { recordAttempt } = useAdaptiveDifficulty();

  const [examMode, setExamMode] = useState<ExamMode | null>(null);
  const [phase, setPhase] = useState<ExamPhase>('setup');
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [sectionData, setSectionData] = useState<ExamSection | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [writingText, setWritingText] = useState('');
  const [clipAudioSrcs, setClipAudioSrcs] = useState<string[]>([]);
  const [currentClip, setCurrentClip] = useState(0);
  const [clipQuestions, setClipQuestions] = useState<ExamQuestion[][]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [results, setResults] = useState<SectionResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [aiFeedback, setAiFeedback] = useState<AIFeedback | null>(null);
  const [evaluating, setEvaluating] = useState(false);

  const EXAM_PARTS = examMode === 'full' ? FULL_PARTS : QUICK_PARTS;
  const TOTAL_TIME = EXAM_PARTS.reduce((acc, p) => acc + p.timeMinutes, 0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Timer
  useEffect(() => {
    if (phase === 'section' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleSectionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [phase, currentIdx]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // ─── Generate section (from pre-built libraries) ──
  const generateSection = async (idx: number) => {
    const part = EXAM_PARTS[idx];
    setGenerating(true);
    setError(null);
    setAnswers({});
    setWritingText('');
    setSectionData(null);
    setAudioSrc(null);

    try {
      let sec: ExamSection | null = null;

      if (part.section === 'listening') {
        // Use listening library
        const res = await fetch('/api/listening-library', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ partOrTask: part.partId }),
        });
        if (!res.ok) throw new Error('Failed to load listening exercise');
        const data = await res.json();
        const ex = data.exercise;

        // Check if clip-based (Part 1)
        if (data.clipAudioUrls?.length && ex?.clips?.length) {
          // Clip mode: show clip-by-clip
          const clips = ex.clips;
          const clipQs: ExamQuestion[][] = [];
          let globalId = 0;
          for (const c of clips) {
            const qs = (c.questions || []).map((q: any) => ({
              id: globalId++, question: q.question, options: q.options,
              correct: q.options.indexOf(q.correctAnswer), explanation: q.explanation || '',
            }));
            clipQs.push(qs);
          }
          setClipQuestions(clipQs);
          setClipAudioSrcs(data.clipAudioUrls.map((u: string) => u + '?v=' + Date.now()));
          setCurrentClip(0);
          setAudioSrc(null);
          sec = {
            section: 'listening',
            part: part.partId,
            title: ex.title || part.label,
            passage: '',
            questions: clipQs[0] || [],
          };
        } else {
          // Single audio mode
          if (ex?.clips && Array.isArray(ex.clips) && !ex.questions?.length) {
            ex.questions = ex.clips.flatMap((c: any) => c.questions || []);
          }
          setClipAudioSrcs([]);
          setClipQuestions([]);
          setCurrentClip(0);
          sec = {
            section: 'listening',
            part: part.partId,
            title: ex.title || part.label,
            passage: ex.passage,
            questions: ex.questions,
          };
          if (data.audioUrl) {
            setAudioSrc(data.audioUrl + '?v=' + Date.now());
          }
        }

      } else if (part.section === 'reading') {
        // Use reading library
        const partKey = part.partId.match(/Part (\d)/)?.[1];
        const res = await fetch('/api/reading-library', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ partId: `part${partKey}` }),
        });
        if (!res.ok) throw new Error('Failed to load reading exercise');
        const data = await res.json();
        const ex = data.exercise;
        // Build passage from paragraphs if needed
        const passage = ex.passage || ex.paragraphs?.map((p: any) => `**${p.label}**\n${p.text}`).join('\n\n') || '';
        // Include diagram/writers text if present
        const fullPassage = [
          passage,
          ex.diagram ? `\n---\n📊 Diagram:\n${ex.diagram}` : '',
          ex.replyEmail ? `\n---\n📧 Reply Email:\n${ex.replyEmail}` : '',
          ex.writers?.map((w: any) => `\n**${w.name}:**\n${w.text}`).join('') || '',
          ex.readerResponse ? `\n---\n📝 Reader Response:\n${ex.readerResponse}` : '',
          ex.completionEmail ? `\n---\n📧 Email to Complete:\n${ex.completionEmail}` : '',
        ].filter(Boolean).join('');
        sec = {
          section: 'reading',
          part: part.partId,
          title: ex.title || part.label,
          passage: fullPassage,
          questions: ex.questions,
        };

      } else if (part.section === 'writing') {
        // Use writing library
        const taskKey = part.partId.includes('Task 1') ? 'task1' : 'task2';
        const res = await fetch('/api/writing-library', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskId: taskKey }),
        });
        if (!res.ok) throw new Error('Failed to load writing prompt');
        const data = await res.json();
        const p = data.prompt;
        sec = {
          section: 'writing',
          part: part.partId,
          title: p.scenario ? 'Writing an Email' : 'Responding to a Survey',
          scenario: p.scenario || p.question,
          bullets: p.bulletPoints || [p.optionA, p.optionB].filter(Boolean),
        };

      } else if (part.section === 'speaking') {
        // Use speaking library
        const taskId = part.partId.replace(/^Task \d+\s*\(/, '').replace(/\)$/, '').trim().toLowerCase().replace(/\s+/g, '-');
        const res = await fetch('/api/speaking-library', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskId }),
        });
        if (!res.ok) throw new Error('Failed to load speaking prompt');
        const data = await res.json();
        const p = data.prompt;
        sec = {
          section: 'speaking',
          part: part.partId,
          title: part.label,
          prompt: `${p.scenario}\n\n${p.prompt}`,
          prepTime: 30,
          speakTime: 90,
        };
      }

      if (!sec) throw new Error('Failed to load section');

      setSectionData(sec);
      setTimeLeft(part.timeMinutes * 60);
      setStartTime(Date.now());
      setPhase('section');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  // ─── Complete section ──────────────────────────
  const handleSectionComplete = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    const part = EXAM_PARTS[currentIdx];
    const timeTaken = Math.round((Date.now() - startTime) / 1000);

    let score = 0;
    let total = 0;

    if (sectionData?.questions) {
      // For clip-based, total is all clips' questions combined
      if (clipQuestions.length > 0) {
        const allQ = clipQuestions.flat();
        total = allQ.length;
        score = allQ.filter(q => answers[q.id] === q.correct).length;
      } else {
        total = sectionData.questions.length;
        score = sectionData.questions.filter(q => answers[q.id] === q.correct).length;
      }
    } else if (part.section === 'writing') {
      const wc = writingText.trim().split(/\s+/).filter(w => w.length > 0).length;
      total = 12;
      score = Math.min(12, Math.round(wc / 15)); // rough estimate
    } else if (part.section === 'speaking') {
      total = 12;
      score = 0; // can't evaluate without recording in mock
    }

    const result: SectionResult = {
      section: part.section,
      label: part.label,
      score,
      total,
      answers: { ...answers },
      writingText: part.section === 'writing' ? writingText : undefined,
      writingPrompt: part.section === 'writing' ? (sectionData?.scenario || '') : undefined,
      timeTaken,
    };

    if (part.section === 'writing') {
      // writingText saved in result above
    }

    setResults(prev => [...prev, result]);
    setPhase('review');
  }, [currentIdx, answers, writingText, sectionData, startTime]);

  // ─── Next section ──────────────────────────────
  const nextSection = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx >= EXAM_PARTS.length) {
      // Save results to adaptive difficulty tracker
      const allResults = [...results];
      for (const r of allResults) {
        if (r.section !== 'writing' && r.section !== 'speaking' && r.total > 0) {
          recordAttempt(r.section, `mock-exam`, r.score, r.total);
        }
      }
      // Trigger AI evaluation
      setPhase('evaluating');
      setEvaluating(true);
      const totalTime = allResults.reduce((a, r) => a + r.timeTaken, 0);
      fetch('/api/mock-exam-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sections: allResults.map(r => ({
            section: r.section,
            label: r.label,
            score: r.score,
            total: r.total,
            writingText: r.writingText,
            writingPrompt: r.writingPrompt,
            timeTaken: r.timeTaken,
          })),
          totalTime,
        }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.feedback) {
            setAiFeedback(data.feedback);
            // Save CLB to localStorage
            try {
              localStorage.setItem('celpip-mock-exam-result', JSON.stringify({
                clb: data.feedback.overallCLB,
                listening: data.feedback.listeningCLB,
                reading: data.feedback.readingCLB,
                writing: data.feedback.writingCLB,
                sections: allResults.map(r => ({
                  section: r.section, score: r.score, total: r.total,
                })),
                date: new Date().toISOString(),
              }));
            } catch {}
          }
          setPhase('results');
        })
        .catch(() => {
          // Fallback: show results without AI feedback
          setPhase('results');
        })
        .finally(() => setEvaluating(false));
    } else {
      setCurrentIdx(nextIdx);
      generateSection(nextIdx);
    }
  };

  // ─── Start exam ────────────────────────────────
  const startExam = () => {
    analytics.mockExamStart();
    setResults([]);
    setCurrentIdx(0);
    generateSection(0);
  };

  // ─── Restart ───────────────────────────────────
  const restartExam = () => {
    setPhase('setup');
    setExamMode(null);
    setResults([]);
    setCurrentIdx(0);
    setSectionData(null);
    setAiFeedback(null);
  };

  // ─── Score color ───────────────────────────────
  const scoreColor = (pct: number) =>
    pct >= 0.8 ? '#34d399' : pct >= 0.6 ? '#fbbf24' : '#f87171';

  // ─── Render ────────────────────────────────────
  if (planLoading) return null;

  if (!isPro) {
    return (
      <div className={styles.container}>
        <ProGate
          feature="AI Mock Exam"
          description="Simulate a real CELPIP test with AI-generated questions across all sections. Timed, scored, and analyzed."
        />
      </div>
    );
  }

  // ─── SETUP ─────────────────────────────────────
  if (phase === 'setup') {
    // Mode selection
    if (!examMode) {
      return (
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.badge}><Sparkles size={13} /> AI Coach</div>
            <h1 className={styles.title}>Mock Exam</h1>
            <p className={styles.subtitle}>
              Simulate a real CELPIP test — choose your format
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>
            {/* Quick Mock */}
            <button
              onClick={() => setExamMode('quick')}
              style={{
                background: 'linear-gradient(135deg, rgba(96,165,250,0.15), rgba(96,165,250,0.05))',
                border: '1px solid rgba(96,165,250,0.3)', borderRadius: 16, padding: '24px 20px',
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 28 }}>🏃</span>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#60a5fa' }}>Quick Mock</div>
                  <div style={{ fontSize: 13, color: 'rgba(248,250,252,0.5)' }}>~{QUICK_PARTS.reduce((a,p)=>a+p.timeMinutes,0)} minutes</div>
                </div>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(248,250,252,0.7)', margin: 0, lineHeight: 1.6 }}>
                Sample of each section — perfect for quick practice or your first try.
                <br/>3 Listening + 2 Reading + 1 Writing + 2 Speaking
              </p>
            </button>

            {/* Full Mock */}
            <button
              onClick={() => setExamMode('full')}
              style={{
                background: 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(251,191,36,0.05))',
                border: '1px solid rgba(251,191,36,0.3)', borderRadius: 16, padding: '24px 20px',
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 28 }}>🏆</span>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#fbbf24' }}>Full Mock Exam</div>
                  <div style={{ fontSize: 13, color: 'rgba(248,250,252,0.5)' }}>~{FULL_PARTS.reduce((a,p)=>a+p.timeMinutes,0)} minutes (~3 hours)</div>
                </div>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(248,250,252,0.7)', margin: 0, lineHeight: 1.6 }}>
                Complete CELPIP simulation — all sections, real timing, no breaks.
                <br/>6 Listening + 4 Reading + 2 Writing + 8 Speaking
              </p>
              <div style={{
                marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(251,191,36,0.15)', borderRadius: 8, padding: '4px 10px',
                fontSize: 12, color: '#fbbf24', fontWeight: 600
              }}>
                <Trophy size={12} /> Just like the real exam
              </div>
            </button>
          </div>
        </div>
      );
    }

    // Exam overview after mode selected
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.badge}><Sparkles size={13} /> AI Coach</div>
          <h1 className={styles.title}>{examMode === 'full' ? '🏆 Full Mock Exam' : '🏃 Quick Mock'}</h1>
          <p className={styles.subtitle}>
            {examMode === 'full'
              ? 'Complete CELPIP simulation — all sections, real timing'
              : `Quick practice — ${EXAM_PARTS.length} sections, ~${TOTAL_TIME} min`}
          </p>
        </div>

        <div className={styles.overviewCard}>
          <div className={styles.overviewHeader}>
            <Trophy size={20} style={{ color: '#fbbf24' }} />
            <h3>Exam Structure</h3>
          </div>
          <div className={styles.overviewSections}>
            {EXAM_PARTS.map((p, i) => {
              const icons: Record<Section, React.ElementType> = {
                listening: Headphones, reading: BookOpen, writing: PenTool, speaking: Mic,
              };
              const Icon = icons[p.section];
              return (
                <div key={i} className={`${styles.overviewItem} ${styles[p.section]}`}>
                  <Icon size={16} />
                  <span className={styles.overviewLabel}>{p.label}</span>
                  <span className={styles.overviewTime}>{p.timeMinutes} min</span>
                </div>
              );
            })}
          </div>
          <div className={styles.overviewTotal}>
            <Clock size={16} />
            Total: ~{TOTAL_TIME} minutes
            {examMode === 'full' && <span style={{ color: 'rgba(248,250,252,0.4)', marginLeft: 8 }}>• No breaks (just like the real exam)</span>}
          </div>
        </div>

        {examMode === 'full' && (
          <div style={{
            background: 'rgba(251,191,36,0.08)', borderRadius: 12, padding: 16, marginTop: 16,
            fontSize: 14, color: 'rgba(248,250,252,0.7)', lineHeight: 1.6
          }}>
            <strong style={{ color: '#fbbf24' }}>📋 Before you start:</strong>
            <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
              <li>Find a quiet place — no interruptions for ~3 hours</li>
              <li>Have headphones ready for the Listening section</li>
              <li>Keep scratch paper nearby for notes</li>
              <li>Once started, the timer runs continuously — just like the real exam</li>
            </ul>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button
            style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12, padding: '12px 20px', cursor: 'pointer', color: 'rgba(248,250,252,0.6)',
              fontSize: 14
            }}
            onClick={() => setExamMode(null)}
          >
            ← Back
          </button>
          <button className={styles.startBtn} onClick={startExam} style={{ flex: 1 }}>
            <Play size={18} />
            {examMode === 'full' ? 'Start Full Exam' : 'Start Quick Mock'}
          </button>
        </div>
      </div>
    );
  }

  // ─── GENERATING ────────────────────────────────
  if (generating) {
    return (
      <div className={styles.container}>
        <div className={styles.generatingWrap}>
          <Loader2 size={36} className={styles.spinner} />
          <h2>Loading Section {currentIdx + 1}/{EXAM_PARTS.length}</h2>
          <p>{EXAM_PARTS[currentIdx]?.label}</p>
        </div>
      </div>
    );
  }

  // ─── EVALUATING (AI grading) ───────────────────
  if (phase === 'evaluating') {
    return (
      <div className={styles.container}>
        <div className={styles.generatingWrap}>
          <Sparkles size={36} style={{ color: '#fbbf24' }} />
          <h2>AI is Evaluating Your Exam...</h2>
          <p style={{ color: 'rgba(248,250,252,0.6)', marginTop: 8 }}>
            Analyzing your answers, writing, and performance across all sections
          </p>
          <Loader2 size={24} className={styles.spinner} style={{ marginTop: 16 }} />
        </div>
      </div>
    );
  }

  // ─── SECTION (active) ─────────────────────────
  if (phase === 'section' && sectionData) {
    const currentPart = EXAM_PARTS[currentIdx];

    return (
      <div className={styles.container}>
        {/* Top bar */}
        <div className={styles.examTopBar}>
          <div className={styles.sectionIndicator}>
            <span className={styles.sectionNum}>{currentIdx + 1}/{EXAM_PARTS.length}</span>
            <span className={styles.sectionName}>{currentPart.label}</span>
          </div>
          <div className={styles.timer} style={{ color: timeLeft < 60 ? '#f87171' : undefined }}>
            <Clock size={16} />
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Section transition banner for Full Mock */}
        {examMode === 'full' && currentIdx > 0 && EXAM_PARTS[currentIdx].section !== EXAM_PARTS[currentIdx - 1]?.section && (
          <div style={{
            background: 'rgba(96,165,250,0.1)', borderRadius: 10, padding: '10px 16px',
            marginBottom: 16, textAlign: 'center', fontSize: 14, color: '#60a5fa', fontWeight: 600
          }}>
            📋 {currentPart.section.charAt(0).toUpperCase() + currentPart.section.slice(1)} Section
          </div>
        )}

        <h2 className={styles.exerciseTitle}>{sectionData.title}</h2>

        {/* Listening/Reading: passage + questions */}
        {(currentPart.section === 'listening' || currentPart.section === 'reading') && (
          <>
            {/* Audio: clip mode or single */}
            {clipAudioSrcs.length > 0 ? (
              <div className={styles.audioPlayer}>
                <div style={{ fontSize: 13, color: 'rgba(248,250,252,0.5)', marginBottom: 6 }}>
                  🎧 Clip {currentClip + 1} of {clipAudioSrcs.length}
                </div>
                <Volume2 size={18} className={styles.audioIcon} />
                <audio key={clipAudioSrcs[currentClip]} src={clipAudioSrcs[currentClip]} controls autoPlay preload="auto" />
              </div>
            ) : audioSrc ? (
              <div className={styles.audioPlayer}>
                <Volume2 size={18} className={styles.audioIcon} />
                <audio ref={audioRef} src={audioSrc} controls preload="auto" />
              </div>
            ) : null}

            {sectionData.passage && (
              <div className={styles.passageCard}>
                <p className={styles.passageText}>{sectionData.passage}</p>
              </div>
            )}

            {sectionData.questions?.map((q, qi) => (
              <div key={q.id} className={styles.questionCard}>
                <p className={styles.questionText}>
                  {(clipQuestions.length > 0 ? clipQuestions.slice(0, currentClip).reduce((a, c) => a + c.length, 0) : 0) + qi + 1}. {q.question}
                </p>
                <div className={styles.optionsList}>
                  {q.options.map((opt, idx) => (
                    <button
                      key={idx}
                      className={`${styles.optionBtn} ${answers[q.id] === idx ? styles.selected : ''}`}
                      onClick={() => setAnswers(prev => ({ ...prev, [q.id]: idx }))}
                    >
                      <span className={styles.optionLetter}>{['A','B','C','D'][idx]}</span>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Clip: next clip or submit */}
            {clipQuestions.length > 0 && currentClip < clipQuestions.length - 1 ? (
              <button
                className={styles.submitBtn}
                onClick={() => {
                  const next = currentClip + 1;
                  setCurrentClip(next);
                  setSectionData(prev => prev ? {
                    ...prev,
                    questions: clipQuestions[next] || []
                  } : prev);
                }}
                disabled={sectionData.questions?.some(q => answers[q.id] === undefined)}
              >
                Next Clip ({currentClip + 2}/{clipQuestions.length}) <ChevronRight size={16} />
              </button>
            ) : (
              <button
                className={styles.submitBtn}
                onClick={handleSectionComplete}
                disabled={clipQuestions.length > 0
                  ? clipQuestions.flat().some((_, i) => answers[i] === undefined)
                  : Object.keys(answers).length < (sectionData.questions?.length || 0)
                }
              >
                Submit &amp; Continue <ChevronRight size={16} />
              </button>
            )}
          </>
        )}

        {/* Writing */}
        {currentPart.section === 'writing' && (
          <>
            <div className={styles.writingPromptCard}>
              <p>{sectionData.scenario}</p>
              {sectionData.bullets && (
                <ul className={styles.bulletList}>
                  {sectionData.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
            <textarea
              className={styles.writingArea}
              value={writingText}
              onChange={e => setWritingText(e.target.value)}
              placeholder="Write your email here..."
              rows={12}
            />
            <div className={styles.writingFooter}>
              <span className={styles.wordCountSmall}>
                {writingText.trim().split(/\s+/).filter(w => w.length > 0).length} words
              </span>
              <button className={styles.submitBtn} onClick={handleSectionComplete}>
                Submit &amp; Continue <ChevronRight size={16} />
              </button>
            </div>
          </>
        )}

        {/* Speaking */}
        {currentPart.section === 'speaking' && (
          <>
            <div className={styles.speakingPromptCard}>
              <p>{sectionData.prompt}</p>
            </div>
            <p className={styles.speakingNote}>
              In the real exam, you would record your response. For this mock, read the prompt and think about how you would respond, then continue.
            </p>
            <button className={styles.submitBtn} onClick={handleSectionComplete}>
              Continue <ChevronRight size={16} />
            </button>
          </>
        )}

        {error && <div className={styles.errorMsg}><AlertCircle size={16} /> {error}</div>}
      </div>
    );
  }

  // ─── REVIEW (between sections) ─────────────────
  if (phase === 'review') {
    const lastResult = results[results.length - 1];
    const part = EXAM_PARTS[currentIdx];

    return (
      <div className={styles.container}>
        <div className={styles.reviewWrap}>
          <CheckCircle size={32} style={{ color: '#34d399' }} />
          <h2>Section Complete!</h2>
          <p className={styles.reviewSectionName}>{part.label}</p>

          {lastResult.total > 0 && lastResult.section !== 'writing' && lastResult.section !== 'speaking' && (
            <div className={styles.reviewScore}>
              <span className={styles.reviewScoreNum} style={{ color: scoreColor(lastResult.score / lastResult.total) }}>
                {lastResult.score}
              </span>
              <span className={styles.reviewScoreTotal}>/ {lastResult.total}</span>
            </div>
          )}

          {lastResult.section === 'writing' && lastResult.writingText && (
            <p className={styles.reviewMeta}>
              {lastResult.writingText.trim().split(/\s+/).filter(w => w.length > 0).length} words written
            </p>
          )}

          <p className={styles.reviewMeta}>
            Time: {formatTime(lastResult.timeTaken)}
          </p>

          {/* Show correct answers for reading/listening */}
          {sectionData?.questions && (
            <div className={styles.reviewAnswers}>
              {sectionData.questions.map(q => {
                const userAnswer = lastResult.answers?.[q.id];
                const isCorrect = userAnswer === q.correct;
                return (
                  <div key={q.id} className={`${styles.reviewAnswer} ${isCorrect ? styles.reviewCorrect : styles.reviewWrong}`}>
                    <span className={styles.reviewQNum}>{q.id}.</span>
                    <span className={styles.reviewQText}>{q.question}</span>
                    <span className={styles.reviewQResult}>
                      {isCorrect ? '✓' : `✗ (${['A','B','C','D'][q.correct]})`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <button className={styles.nextSectionBtn} onClick={nextSection}>
            {currentIdx + 1 < EXAM_PARTS.length ? (
              <>Next Section <ArrowRight size={16} /></>
            ) : (
              <>View Results <Trophy size={16} /></>
            )}
          </button>
        </div>
      </div>
    );
  }

  // ─── RESULTS (with AI feedback) ─────────────────
  if (phase === 'results') {
    const totalCorrect = results
      .filter(r => r.section !== 'writing' && r.section !== 'speaking')
      .reduce((acc, r) => acc + r.score, 0);
    const totalQuestions = results
      .filter(r => r.section !== 'writing' && r.section !== 'speaking')
      .reduce((acc, r) => acc + r.total, 0);
    const totalTime = results.reduce((acc, r) => acc + r.timeTaken, 0);
    const pct = totalQuestions > 0 ? totalCorrect / totalQuestions : 0;
    const fb = aiFeedback;

    return (
      <div className={styles.container}>
        <div className={styles.resultsWrap}>
          <div className={styles.header}>
            <Trophy size={28} style={{ color: '#fbbf24' }} />
            <h1 className={styles.title}>Mock Exam Results</h1>
          </div>

          {/* Overall CLB */}
          <div className={styles.overallScore}>
            <div className={styles.bigScore} style={{ color: scoreColor(pct) }}>
              CLB {fb?.overallCLB || (pct >= 0.9 ? '10+' : pct >= 0.8 ? '9' : pct >= 0.7 ? '8' : pct >= 0.6 ? '7' : pct >= 0.5 ? '6' : '5')}
            </div>
            {fb?.overallFeedback && (
              <p style={{ color: 'rgba(248,250,252,0.7)', marginTop: 8, fontSize: 14, lineHeight: 1.5 }}>
                {fb.overallFeedback}
              </p>
            )}
            <p className={styles.totalTime}>
              <Clock size={14} /> Total time: {formatTime(totalTime)}
            </p>
          </div>

          {/* CLB by skill */}
          {fb && (
            <div className={styles.breakdownSection}>
              <h3 className={styles.breakdownTitle}>
                <BarChart3 size={16} /> CLB by Skill
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                {[
                  { icon: Headphones, label: 'Listening', clb: fb.listeningCLB, color: '#60a5fa' },
                  { icon: BookOpen, label: 'Reading', clb: fb.readingCLB, color: '#34d399' },
                  { icon: PenTool, label: 'Writing', clb: fb.writingCLB, color: '#c084fc' },
                  { icon: Mic, label: 'Speaking', clb: fb.speakingNote ? '—' : '—', color: '#fbbf24' },
                ].map(({ icon: Icon, label, clb, color }) => (
                  <div key={label} style={{
                    background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '16px',
                    display: 'flex', alignItems: 'center', gap: 12
                  }}>
                    <Icon size={20} style={{ color }} />
                    <div>
                      <div style={{ fontSize: 12, color: 'rgba(248,250,252,0.5)' }}>{label}</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color }}>{clb === '—' ? '—' : `CLB ${clb}`}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section breakdown */}
          <div className={styles.breakdownSection}>
            <h3 className={styles.breakdownTitle}>
              <BarChart3 size={16} /> Score Breakdown
            </h3>
            {results.map((r, i) => {
              const part = EXAM_PARTS[i];
              const icons: Record<Section, React.ElementType> = {
                listening: Headphones, reading: BookOpen, writing: PenTool, speaking: Mic,
              };
              const Icon = icons[r.section];
              const isQuiz = r.section !== 'writing' && r.section !== 'speaking';
              const rPct = isQuiz && r.total > 0 ? r.score / r.total : null;

              return (
                <div key={i} className={`${styles.breakdownItem} ${styles[r.section]}`}>
                  <div className={styles.breakdownLeft}>
                    <Icon size={18} />
                    <span>{part.label}</span>
                  </div>
                  <div className={styles.breakdownRight}>
                    {isQuiz ? (
                      <span style={{ color: scoreColor(rPct!) }}>
                        {r.score}/{r.total}
                      </span>
                    ) : r.section === 'writing' ? (
                      <span style={{ color: '#c084fc' }}>
                        {r.writingText?.trim().split(/\s+/).filter(w => w.length > 0).length || 0}w
                      </span>
                    ) : (
                      <span style={{ color: 'rgba(248,250,252,0.4)' }}>—</span>
                    )}
                    <span className={styles.breakdownTime}>{formatTime(r.timeTaken)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Feedback sections */}
          {fb?.listeningFeedback && (
            <div style={{ background: 'rgba(96,165,250,0.08)', borderRadius: 12, padding: 20, marginTop: 16 }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: '#60a5fa' }}>
                <Headphones size={18} /> Listening Feedback
              </h3>
              {fb.listeningFeedback.strengths?.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <strong style={{ color: '#34d399', fontSize: 13 }}>✅ Strengths</strong>
                  <ul style={{ margin: '4px 0 0 16px', fontSize: 14, color: 'rgba(248,250,252,0.8)' }}>
                    {fb.listeningFeedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
              {fb.listeningFeedback.improvements?.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <strong style={{ color: '#fbbf24', fontSize: 13 }}>⚠️ To Improve</strong>
                  <ul style={{ margin: '4px 0 0 16px', fontSize: 14, color: 'rgba(248,250,252,0.8)' }}>
                    {fb.listeningFeedback.improvements.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
              {fb.listeningFeedback.tips?.length > 0 && (
                <div>
                  <strong style={{ color: '#c084fc', fontSize: 13 }}>💡 Tips</strong>
                  <ul style={{ margin: '4px 0 0 16px', fontSize: 14, color: 'rgba(248,250,252,0.8)' }}>
                    {fb.listeningFeedback.tips.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}

          {fb?.readingFeedback && (
            <div style={{ background: 'rgba(52,211,153,0.08)', borderRadius: 12, padding: 20, marginTop: 16 }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: '#34d399' }}>
                <BookOpen size={18} /> Reading Feedback
              </h3>
              {fb.readingFeedback.strengths?.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <strong style={{ color: '#34d399', fontSize: 13 }}>✅ Strengths</strong>
                  <ul style={{ margin: '4px 0 0 16px', fontSize: 14, color: 'rgba(248,250,252,0.8)' }}>
                    {fb.readingFeedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
              {fb.readingFeedback.improvements?.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <strong style={{ color: '#fbbf24', fontSize: 13 }}>⚠️ To Improve</strong>
                  <ul style={{ margin: '4px 0 0 16px', fontSize: 14, color: 'rgba(248,250,252,0.8)' }}>
                    {fb.readingFeedback.improvements.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
              {fb.readingFeedback.tips?.length > 0 && (
                <div>
                  <strong style={{ color: '#c084fc', fontSize: 13 }}>💡 Tips</strong>
                  <ul style={{ margin: '4px 0 0 16px', fontSize: 14, color: 'rgba(248,250,252,0.8)' }}>
                    {fb.readingFeedback.tips.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}

          {fb?.writingFeedback && (
            <div style={{ background: 'rgba(192,132,252,0.08)', borderRadius: 12, padding: 20, marginTop: 16 }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: '#c084fc' }}>
                <PenTool size={18} /> Writing Feedback — CLB {fb.writingFeedback.score}
              </h3>
              {fb.writingFeedback.strengths?.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <strong style={{ color: '#34d399', fontSize: 13 }}>✅ Strengths</strong>
                  <ul style={{ margin: '4px 0 0 16px', fontSize: 14, color: 'rgba(248,250,252,0.8)' }}>
                    {fb.writingFeedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
              {fb.writingFeedback.errors?.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <strong style={{ color: '#f87171', fontSize: 13 }}>❌ Errors Found</strong>
                  <div style={{ marginTop: 6 }}>
                    {fb.writingFeedback.errors.map((err, i) => (
                      <div key={i} style={{
                        background: 'rgba(248,113,113,0.1)', borderRadius: 8, padding: '10px 14px',
                        marginBottom: 8, fontSize: 14, color: 'rgba(248,250,252,0.85)'
                      }}>
                        <div><span style={{ textDecoration: 'line-through', color: '#f87171' }}>{err.original}</span></div>
                        <div style={{ color: '#34d399', marginTop: 2 }}>→ {err.correction}</div>
                        <div style={{ fontSize: 12, color: 'rgba(248,250,252,0.5)', marginTop: 2 }}>{err.explanation}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {fb.writingFeedback.improvements?.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <strong style={{ color: '#fbbf24', fontSize: 13 }}>⚠️ To Improve</strong>
                  <ul style={{ margin: '4px 0 0 16px', fontSize: 14, color: 'rgba(248,250,252,0.8)' }}>
                    {fb.writingFeedback.improvements.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
              {fb.writingFeedback.modelResponse && (
                <div style={{ marginTop: 12 }}>
                  <strong style={{ color: '#60a5fa', fontSize: 13 }}>📝 Model Response (CLB 9+)</strong>
                  <div style={{
                    background: 'rgba(96,165,250,0.1)', borderRadius: 8, padding: 14,
                    marginTop: 6, fontSize: 14, lineHeight: 1.6, color: 'rgba(248,250,252,0.85)',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {fb.writingFeedback.modelResponse}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Study Plan */}
          {fb?.studyPlan && fb.studyPlan.length > 0 && (
            <div style={{ background: 'rgba(251,191,36,0.08)', borderRadius: 12, padding: 20, marginTop: 16 }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: '#fbbf24' }}>
                <Target size={18} /> Your Study Plan
              </h3>
              <ol style={{ margin: '0 0 0 16px', fontSize: 14, color: 'rgba(248,250,252,0.85)', lineHeight: 1.8 }}>
                {fb.studyPlan.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </div>
          )}

          {/* Encouragement */}
          {fb?.encouragement && (
            <div style={{
              textAlign: 'center', padding: '20px 16px', marginTop: 16,
              background: 'rgba(52,211,153,0.08)', borderRadius: 12,
              fontSize: 15, color: '#34d399', fontStyle: 'italic', lineHeight: 1.6
            }}>
              💪 {fb.encouragement}
            </div>
          )}

          {/* Actions */}
          <div className={styles.resultActions}>
            <button className={styles.retakeBtn} onClick={restartExam}>
              <RotateCcw size={16} /> Take Another Exam
            </button>
            <a href="/ai-coach" className={styles.practiceBtn}>
              <Target size={16} /> Practice Weak Areas
            </a>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
