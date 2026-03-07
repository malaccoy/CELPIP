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
type ExamPhase = 'setup' | 'section' | 'review' | 'results';
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
  audio?: string; // base64
  questions?: ExamQuestion[];
  // writing
  scenario?: string;
  bullets?: string[];
  // speaking
  prompt?: string;
  prepTime?: number;
  speakTime?: number;
}

interface SectionResult {
  section: Section;
  score: number;
  total: number;
  answers?: Record<number, number>;
  writingText?: string;
  timeTaken: number;
}

// ─── Exam structure ──────────────────────────────
const EXAM_PARTS: { section: Section; partId: string; label: string; timeMinutes: number }[] = [
  { section: 'listening', partId: 'Part 1 (Problem Solving)', label: 'Listening — Problem Solving', timeMinutes: 8 },
  { section: 'listening', partId: 'Part 3 (Information)', label: 'Listening — Information', timeMinutes: 8 },
  { section: 'reading', partId: 'Part 1 (Reading Correspondence)', label: 'Reading — Correspondence', timeMinutes: 10 },
  { section: 'reading', partId: 'Part 3 (Reading for Information)', label: 'Reading — Information', timeMinutes: 10 },
  { section: 'writing', partId: 'Task 1 (Email/Letter)', label: 'Writing — Email (Task 1)', timeMinutes: 27 },
  { section: 'speaking', partId: 'Task 1 (Giving Advice)', label: 'Speaking — Giving Advice', timeMinutes: 3 },
];

const TOTAL_TIME = EXAM_PARTS.reduce((acc, p) => acc + p.timeMinutes, 0);

export default function AIMockExamPage() {
  const { isPro, loading: planLoading } = usePlan();
  const { recordAttempt } = useAdaptiveDifficulty();

  const [phase, setPhase] = useState<ExamPhase>('setup');
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [sectionData, setSectionData] = useState<ExamSection | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [writingText, setWritingText] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [results, setResults] = useState<SectionResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [startTime, setStartTime] = useState(0);

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

  // ─── Generate section ──────────────────────────
  const generateSection = async (idx: number) => {
    const part = EXAM_PARTS[idx];
    setGenerating(true);
    setError(null);
    setAnswers({});
    setWritingText('');
    setSectionData(null);
    setAudioSrc(null);

    try {
      const res = await fetch('/api/ai-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: part.section,
          partOrTask: part.partId,
          difficulty,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate section');

      const data = await res.json();
      const exercise = data.exercise;

      const sec: ExamSection = {
        section: part.section,
        part: part.partId,
        title: exercise.title || part.label,
        passage: exercise.passage,
        questions: exercise.questions,
        scenario: exercise.scenario,
        bullets: exercise.bullets,
        prompt: exercise.prompt,
        prepTime: exercise.prepTimeSeconds,
        speakTime: exercise.speakTimeSeconds,
      };

      setSectionData(sec);
      setTimeLeft(part.timeMinutes * 60);
      setStartTime(Date.now());
      setPhase('section');

      if (data.audio) {
        const blob = new Blob(
          [Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))],
          { type: 'audio/mpeg' }
        );
        setAudioSrc(URL.createObjectURL(blob));
      }
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
      total = sectionData.questions.length;
      score = sectionData.questions.filter(q => answers[q.id] === q.correct).length;
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
      score,
      total,
      answers: { ...answers },
      writingText: part.section === 'writing' ? writingText : undefined,
      timeTaken,
    };

    setResults(prev => [...prev, result]);
    setPhase('review');
  }, [currentIdx, answers, writingText, sectionData, startTime]);

  // ─── Next section ──────────────────────────────
  const nextSection = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx >= EXAM_PARTS.length) {
      // Save results to adaptive difficulty tracker
      const allResults = [...results]; // results already has all previous sections
      for (const r of allResults) {
        if (r.section !== 'writing' && r.section !== 'speaking' && r.total > 0) {
          recordAttempt(r.section, `mock-exam`, r.score, r.total);
        }
      }
      // Also save mock exam CLB estimate to localStorage
      const quizResults = allResults.filter(r => r.section !== 'writing' && r.section !== 'speaking');
      const totalCorrect = quizResults.reduce((a, r) => a + r.score, 0);
      const totalQ = quizResults.reduce((a, r) => a + r.total, 0);
      const pct = totalQ > 0 ? totalCorrect / totalQ : 0;
      const clb = pct >= 0.9 ? '10+' : pct >= 0.8 ? '9' : pct >= 0.7 ? '8' : pct >= 0.6 ? '7' : pct >= 0.5 ? '6' : '5';
      try {
        localStorage.setItem('celpip-mock-exam-result', JSON.stringify({
          clb, pct: Math.round(pct * 100), sections: allResults.map(r => ({
            section: r.section, score: r.score, total: r.total,
          })), date: new Date().toISOString(),
        }));
      } catch {}
      setPhase('results');
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
    setResults([]);
    setCurrentIdx(0);
    setSectionData(null);
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
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.badge}><Sparkles size={13} /> AI Coach</div>
          <h1 className={styles.title}>Mock Exam</h1>
          <p className={styles.subtitle}>
            Simulate a real CELPIP test — {EXAM_PARTS.length} sections, timed, AI-generated
          </p>
        </div>

        {/* Exam overview */}
        <div className={styles.overviewCard}>
          <div className={styles.overviewHeader}>
            <Trophy size={20} style={{ color: '#fbbf24' }} />
            <h3>Exam Structure</h3>
          </div>
          <div className={styles.overviewSections}>
            {EXAM_PARTS.map((p, i) => {
              const icons: Record<Section, React.ElementType> = {
                listening: Headphones,
                reading: BookOpen,
                writing: PenTool,
                speaking: Mic,
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
          </div>
        </div>

        {/* Difficulty */}
        <div className={styles.difficultyPicker}>
          <span className={styles.pickerLabel}>Difficulty</span>
          <div className={styles.difficultyBtns}>
            <button
              className={`${styles.diffBtn} ${difficulty === 'intermediate' ? styles.diffActive : ''}`}
              onClick={() => setDifficulty('intermediate')}
            >
              🔥 Intermediate
            </button>
            <button
              className={`${styles.diffBtn} ${difficulty === 'advanced' ? styles.diffActive : ''}`}
              onClick={() => setDifficulty('advanced')}
            >
              🏆 Advanced
            </button>
          </div>
        </div>

        <button className={styles.startBtn} onClick={startExam}>
          <Play size={18} />
          Start Mock Exam
        </button>
      </div>
    );
  }

  // ─── GENERATING ────────────────────────────────
  if (generating) {
    return (
      <div className={styles.container}>
        <div className={styles.generatingWrap}>
          <Loader2 size={36} className={styles.spinner} />
          <h2>Generating Section {currentIdx + 1}/{EXAM_PARTS.length}</h2>
          <p>{EXAM_PARTS[currentIdx].label}</p>
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

        <h2 className={styles.exerciseTitle}>{sectionData.title}</h2>

        {/* Listening/Reading: passage + questions */}
        {(currentPart.section === 'listening' || currentPart.section === 'reading') && (
          <>
            {audioSrc && (
              <div className={styles.audioPlayer}>
                <Volume2 size={18} className={styles.audioIcon} />
                <audio ref={audioRef} src={audioSrc} controls preload="auto" />
              </div>
            )}

            {sectionData.passage && (
              <div className={styles.passageCard}>
                <p className={styles.passageText}>{sectionData.passage}</p>
              </div>
            )}

            {sectionData.questions?.map(q => (
              <div key={q.id} className={styles.questionCard}>
                <p className={styles.questionText}>{q.id}. {q.question}</p>
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

            <button
              className={styles.submitBtn}
              onClick={handleSectionComplete}
              disabled={Object.keys(answers).length < (sectionData.questions?.length || 0)}
            >
              Submit &amp; Continue <ChevronRight size={16} />
            </button>
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

  // ─── RESULTS ───────────────────────────────────
  if (phase === 'results') {
    const totalCorrect = results
      .filter(r => r.section !== 'writing' && r.section !== 'speaking')
      .reduce((acc, r) => acc + r.score, 0);
    const totalQuestions = results
      .filter(r => r.section !== 'writing' && r.section !== 'speaking')
      .reduce((acc, r) => acc + r.total, 0);
    const totalTime = results.reduce((acc, r) => acc + r.timeTaken, 0);
    const pct = totalQuestions > 0 ? totalCorrect / totalQuestions : 0;

    // Estimate CLB level
    const clbEstimate = pct >= 0.9 ? '10+' : pct >= 0.8 ? '9' : pct >= 0.7 ? '8' : pct >= 0.6 ? '7' : pct >= 0.5 ? '6' : '5 or below';

    return (
      <div className={styles.container}>
        <div className={styles.resultsWrap}>
          <div className={styles.header}>
            <Trophy size={28} style={{ color: '#fbbf24' }} />
            <h1 className={styles.title}>Mock Exam Results</h1>
          </div>

          {/* Overall */}
          <div className={styles.overallScore}>
            <div className={styles.bigScore} style={{ color: scoreColor(pct) }}>
              {Math.round(pct * 100)}%
            </div>
            <div className={styles.clbEstimate}>
              Estimated CLB Level: <strong>{clbEstimate}</strong>
            </div>
            <p className={styles.totalTime}>
              <Clock size={14} /> Total time: {formatTime(totalTime)}
            </p>
          </div>

          {/* Section breakdown */}
          <div className={styles.breakdownSection}>
            <h3 className={styles.breakdownTitle}>
              <BarChart3 size={16} /> Section Breakdown
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
