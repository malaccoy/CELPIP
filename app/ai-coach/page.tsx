'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles, BookOpen, PenTool, Headphones, Mic,
  Loader2, RefreshCw, ArrowRight, Clock, FileText,
  Volume2, ChevronRight, Zap, TrendingUp, TrendingDown, Minus
} from 'lucide-react';
import { usePlan } from '@/hooks/usePlan';
import { useAdaptiveDifficulty } from '@/hooks/useAdaptiveDifficulty';
import { ProGate } from '@/components/ProGate';
import styles from '@/styles/AIPractice.module.scss';

// ─── Config ──────────────────────────────────────
type Section = 'reading' | 'writing' | 'listening' | 'speaking';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';

const SECTIONS: { id: Section; label: string; icon: React.ElementType; }[] = [
  { id: 'reading', label: 'Reading', icon: BookOpen },
  { id: 'writing', label: 'Writing', icon: PenTool },
  { id: 'listening', label: 'Listening', icon: Headphones },
  { id: 'speaking', label: 'Speaking', icon: Mic },
];

const PARTS: Record<Section, { id: string; label: string }[]> = {
  reading: [
    { id: 'Part 1 (Reading Correspondence)', label: 'Part 1 — Correspondence' },
    { id: 'Part 2 (Reading to Apply a Diagram)', label: 'Part 2 — Diagram' },
    { id: 'Part 3 (Reading for Information)', label: 'Part 3 — Information' },
    { id: 'Part 4 (Reading for Viewpoints)', label: 'Part 4 — Viewpoints' },
  ],
  writing: [
    { id: 'Task 1 (Email/Letter)', label: 'Task 1 — Email' },
    { id: 'Task 2 (Opinion Survey)', label: 'Task 2 — Opinion' },
  ],
  listening: [
    { id: 'Part 1 (Problem Solving)', label: 'Part 1 — Problem Solving' },
    { id: 'Part 2 (Daily Life Conversation)', label: 'Part 2 — Daily Life' },
    { id: 'Part 3 (Information)', label: 'Part 3 — Information' },
    { id: 'Part 4 (News Item)', label: 'Part 4 — News' },
    { id: 'Part 5 (Discussion)', label: 'Part 5 — Discussion' },
    { id: 'Part 6 (Viewpoints)', label: 'Part 6 — Viewpoints' },
  ],
  speaking: [
    { id: 'Task 1 (Giving Advice)', label: 'Task 1 — Advice' },
    { id: 'Task 2 (Personal Experience)', label: 'Task 2 — Experience' },
    { id: 'Task 3 (Describing a Scene)', label: 'Task 3 — Scene' },
    { id: 'Task 4 (Making Predictions)', label: 'Task 4 — Predictions' },
    { id: 'Task 5 (Comparing and Persuading)', label: 'Task 5 — Compare' },
    { id: 'Task 6 (Difficult Situation)', label: 'Task 6 — Difficult Situation' },
    { id: 'Task 7 (Expressing Opinions)', label: 'Task 7 — Opinions' },
    { id: 'Task 8 (Unusual Situation)', label: 'Task 8 — Unusual' },
  ],
};

const SPEAKING_TASK_SLUGS: Record<string, string> = {
  '1': 'giving-advice',
  '2': 'personal-experience',
  '3': 'describing-scene',
  '4': 'making-predictions',
  '5': 'comparing-persuading',
  '6': 'difficult-situation',
  '7': 'expressing-opinions',
  '8': 'unusual-situation',
};

const DIFFICULTIES: { id: Difficulty; emoji: string; label: string; desc: string }[] = [
  { id: 'beginner', emoji: '🌱', label: 'Beginner', desc: 'CLB 5-6' },
  { id: 'intermediate', emoji: '🔥', label: 'Intermediate', desc: 'CLB 7-8' },
  { id: 'advanced', emoji: '🏆', label: 'Advanced', desc: 'CLB 9+' },
];

// ─── Component ───────────────────────────────────
export default function AIPracticePage() {
  const { isPro, loading: planLoading } = usePlan();
  const { performances, loaded: adaptiveLoaded, getLevelForSection, recordAttempt } = useAdaptiveDifficulty();

  const router = useRouter();
  const [section, setSection] = useState<Section>('reading');
  const [partOrTask, setPartOrTask] = useState(PARTS.reading[0].id);
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');
  const [autoMode, setAutoMode] = useState(true);

  const [generating, setGenerating] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [exercise, setExercise] = useState<any>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [clipAudioSrcs, setClipAudioSrcs] = useState<string[]>([]);
  const [currentClipIdx, setCurrentClipIdx] = useState(0);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Quiz state (reading/listening)
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [usedTopics, setUsedTopics] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        return JSON.parse(localStorage.getItem('celpip_used_topics') || '[]');
      } catch { return []; }
    }
    return [];
  });

  // Persist used topics
  useEffect(() => {
    if (usedTopics.length > 0) {
      localStorage.setItem('celpip_used_topics', JSON.stringify(usedTopics.slice(-30)));
    }
  }, [usedTopics]);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Reset answers when new exercise generated
  const resetQuiz = useCallback(() => {
    setAnswers({});
    setSubmitted(false);
  }, []);

  // Change section → reset part to first option + auto-adjust difficulty
  const handleSectionChange = (s: Section) => {
    setSection(s);
    setPartOrTask(PARTS[s][0].id);
    setExercise(null);
    setAudioSrc(null); setClipAudioSrcs([]); setCurrentClipIdx(0); setImageSrc(null);
    resetQuiz();
    if (autoMode && adaptiveLoaded) {
      setDifficulty(getLevelForSection(s));
    }
  };

  // Auto-set difficulty on first load
  useEffect(() => {
    if (autoMode && adaptiveLoaded) {
      setDifficulty(getLevelForSection(section));
    }
  }, [adaptiveLoaded]);

  // ─── Generate ──────────────────────────────────
  const generate = async () => {
    // Writing: skip API, redirect directly to writing page with random theme
    if (section === 'writing') {
      localStorage.setItem('celpip_ai_writing_prompt', JSON.stringify({
        task: partOrTask.includes('Task 1') ? 1 : 2,
        randomTheme: true,
      }));
      router.push(partOrTask.includes('Task 1') ? '/writing/task-1' : '/writing/task-2');
      return;
    }

    setGenerating(true);
    setError(null);
    setExercise(null);
    setAudioSrc(null); setClipAudioSrcs([]); setCurrentClipIdx(0); setImageSrc(null);
    resetQuiz();

    try {
      // Listening: use pre-generated library (instant, no AI call)
      if (section === 'listening') {
        const res = await fetch('/api/listening-library', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ partOrTask }),
        });

        if (res.ok) {
          const data = await res.json();
          setExercise(data.exercise);
          if (data.clipAudioUrls) {
            // Part 1 clips
            setClipAudioSrcs(data.clipAudioUrls.map((u: string) => u + '?v=' + Date.now()));
            setCurrentClipIdx(0);
            setAudioSrc(null);
          } else {
            setAudioSrc(data.audioUrl + '?v=' + Date.now());
            setClipAudioSrcs([]);
          }
          setGenerating(false);
          setCooldown(3);
          return;
        }
        // If library not available, fall through to AI generation
      }

      // Speaking: use pre-generated prompt library
      if (section === 'speaking') {
        const taskId = partOrTask.replace(/^Task \d+[:\s]*/, '').trim().toLowerCase().replace(/\s+/g, '-');
        const res = await fetch('/api/speaking-library', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskId }),
        });

        if (res.ok) {
          const data = await res.json();
          const p = data.prompt;
          setExercise({
            title: p.scenario,
            passage: p.prompt,
            questions: [],
            bulletPoints: p.bulletPoints,
            context: p.context,
            optionA: p.optionA,
            optionB: p.optionB,
            choiceA: p.choiceA,
            choiceB: p.choiceB,
            statement: p.statement,
          });
          setGenerating(false);
          setCooldown(3);
          return;
        }
        // Fall through to AI generation
      }

      const res = await fetch('/api/ai-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section,
          partOrTask,
          difficulty,
          previousTopics: usedTopics.slice(-15),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed (${res.status})`);
      }

      const data = await res.json();
      const ex = data.exercise;
      // Normalize clip-based exercises: flatten questions for quiz rendering
      if (ex?.clips && Array.isArray(ex.clips) && !ex.questions?.length) {
        ex.questions = ex.clips.flatMap((c: any) => c.questions || []);
      }
      setExercise(ex);

      // Track topic to avoid repeats (title + scenario for stronger dedup)
      if (data.exercise?.title) {
        const topicDesc = data.exercise.title + (data.exercise.scenario ? ': ' + data.exercise.scenario.substring(0, 80) : '');
        setUsedTopics(prev => [...prev, topicDesc]);
      }

      // Audio for listening
      if (data.audio) {
        const blob = new Blob(
          [Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))],
          { type: 'audio/mpeg' }
        );
        setAudioSrc(URL.createObjectURL(blob));
      }

      // Clip audios for listening Part 1
      if (data.clipAudios && Array.isArray(data.clipAudios)) {
        const urls = data.clipAudios.map((b64: string) => {
          const blob = new Blob(
            [Uint8Array.from(atob(b64), c => c.charCodeAt(0))],
            { type: 'audio/mpeg' }
          );
          return URL.createObjectURL(blob);
        });
        setClipAudioSrcs(urls);
        setCurrentClipIdx(0);
      }

      // Image for speaking Task 3/4
      if (data.image) {
        setImageSrc(`data:image/png;base64,${data.image}`);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setGenerating(false);
      // Cooldown to prevent spam
      setCooldown(10);
      const cd = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) { clearInterval(cd); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // ─── Quiz answer ───────────────────────────────
  const selectAnswer = (qId: number, optIdx: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const submitQuiz = () => {
    setSubmitted(true);
    // Record for adaptive difficulty
    if (exercise?.questions) {
      const total = exercise.questions.length;
      const correct = exercise.questions.filter(
        (q: any) => answers[q.id] === q.correct
      ).length;
      recordAttempt(section, partOrTask, correct, total);
    }
  };

  const getScore = () => {
    if (!exercise?.questions) return { correct: 0, total: 0 };
    const total = exercise.questions.length;
    const correct = exercise.questions.filter(
      (q: any) => answers[q.id] === q.correct
    ).length;
    return { correct, total };
  };

  // ─── Render ────────────────────────────────────
  if (planLoading) return null;

  if (!isPro) {
    return (
      <div className={styles.container}>
        <ProGate
          feature="AI Practice Generator"
          description="Generate unlimited CELPIP exercises with AI — Reading, Writing, Listening, and Speaking. Each exercise is unique, with adaptive difficulty and instant feedback."
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.badge}>
          <Sparkles size={13} />
          AI Coach
        </div>
        <h1 className={styles.title}>Practice Generator</h1>
        <p className={styles.subtitle}>
          Unlimited AI-generated exercises. Pick a section, choose your level, and train.
        </p>
      </div>

      {/* Section selector */}
      <div className={styles.sectionGrid}>
        {SECTIONS.map(s => {
          const Icon = s.icon;
          const isActive = section === s.id;
          return (
            <div
              key={s.id}
              className={`${isActive ? styles.sectionCardActive : styles.sectionCard} ${styles[s.id]}`}
              onClick={() => handleSectionChange(s.id)}
            >
              <div className={styles.sectionIcon}>
                <Icon size={20} />
              </div>
              <span className={styles.sectionLabel}>{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* Part/Task selector */}
      <div className={styles.partSelector}>
        <div className={styles.partSelectorLabel}>
          {section === 'writing' || section === 'speaking' ? 'Task' : 'Part'}
        </div>
        <div className={styles.partChips}>
          {PARTS[section].map(p => (
            <div
              key={p.id}
              className={partOrTask === p.id ? styles.partChipActive : styles.partChip}
              onClick={() => { setPartOrTask(p.id); setExercise(null); setAudioSrc(null); setClipAudioSrcs([]); setCurrentClipIdx(0); setImageSrc(null); resetQuiz(); }}
            >
              {p.label}
            </div>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div className={styles.difficultySelector}>
        <div className={styles.partSelectorLabel}>
          Difficulty
          <button
            className={`${styles.autoToggle} ${autoMode ? styles.autoActive : ''}`}
            onClick={() => {
              setAutoMode(!autoMode);
              if (!autoMode && adaptiveLoaded) {
                setDifficulty(getLevelForSection(section));
              }
            }}
          >
            <Zap size={12} /> {autoMode ? 'Auto' : 'Manual'}
          </button>
        </div>
        {autoMode && performances[section] && (
          <div className={styles.adaptiveInfo}>
            {performances[section].trend === 'improving' && <TrendingUp size={13} />}
            {performances[section].trend === 'declining' && <TrendingDown size={13} />}
            {performances[section].trend === 'stable' && <Minus size={13} />}
            <span>
              {performances[section].attempts} attempts · {Math.round(performances[section].avgScore * 100)}% avg
              {performances[section].trend !== 'stable' && ` · ${performances[section].trend}`}
            </span>
          </div>
        )}
        <div className={styles.difficultyOptions}>
          {DIFFICULTIES.map(d => (
            <div
              key={d.id}
              className={difficulty === d.id ? styles.difficultyActive : styles.difficultyOption}
              onClick={() => { setAutoMode(false); setDifficulty(d.id); }}
            >
              <span className={styles.difficultyEmoji}>{d.emoji}</span>
              <span className={styles.difficultyLabel}>{d.label}</span>
              <span className={styles.difficultyDesc}>{d.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <button
        className={generating ? styles.loading : styles.generateBtn}
        onClick={generate}
        disabled={generating || cooldown > 0}
      >
        {cooldown > 0 ? (
          <>Wait {cooldown}s</>
        ) : generating ? (
          <>
            <Loader2 size={18} className={styles.spinner} />
            Generating{section === 'listening' ? ' (includes audio)' : ''}...
          </>
        ) : (
          <>
            <Zap size={18} />
            {section === 'writing' 
              ? `Start ${partOrTask} Practice` 
              : `Generate ${section.charAt(0).toUpperCase() + section.slice(1)} Exercise`}
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <div style={{ color: '#f87171', textAlign: 'center', marginBottom: '1rem', fontSize: '0.88rem' }}>
          {error}
        </div>
      )}

      {/* ─── Exercise Display ─── */}
      {exercise && (
        <div className={styles.exerciseWrap}>
          {/* READING / LISTENING */}
          {(section === 'reading' || section === 'listening') && (
            <>
              <div className={styles.exerciseHeader}>
                <h2 className={styles.exerciseTitle}>{exercise.title}</h2>
                <span className={styles.exerciseMeta}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </span>
              </div>

              {/* Audio (listening only) */}
              {section === 'listening' && clipAudioSrcs.length > 0 && exercise.clips && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    marginBottom: '0.75rem', fontWeight: 600, color: '#6366f1'
                  }}>
                    🎧 Clip {currentClipIdx + 1} of {clipAudioSrcs.length}
                  </div>
                  <div className={styles.audioPlayer}>
                    <Volume2 size={20} className={styles.audioIcon} />
                    <audio key={currentClipIdx} ref={audioRef} src={clipAudioSrcs[currentClipIdx]} controls preload="auto" />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {clipAudioSrcs.map((_, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '0.3rem 0.8rem',
                          borderRadius: 6,
                          border: i === currentClipIdx ? '2px solid #6366f1' : '1px solid #e2e8f0',
                          background: i === currentClipIdx ? 'rgba(99,102,241,0.1)' : i < currentClipIdx ? 'rgba(34,197,94,0.1)' : '#1e293b',
                          fontWeight: i === currentClipIdx ? 600 : 400,
                          fontSize: '0.8rem',
                          color: i < currentClipIdx ? '#22c55e' : i === currentClipIdx ? '#6366f1' : '#94a3b8'
                        }}
                      >
                        {i < currentClipIdx ? '✅' : ''} Clip {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {section === 'listening' && audioSrc && clipAudioSrcs.length === 0 && (
                <div className={styles.audioPlayer}>
                  <Volume2 size={20} className={styles.audioIcon} />
                  <audio ref={audioRef} src={audioSrc} controls preload="auto" />
                </div>
              )}

              {/* Passage: hidden for listening when audio available — shown as fallback if no audio */}
              {section === 'listening' && !audioSrc && exercise.passage && (
                <div className={styles.passageCard}>
                  <p style={{ fontSize: '0.8rem', color: '#f59e0b', marginBottom: '0.5rem' }}>⚠️ Audio generation failed — read the passage below:</p>
                  <p className={styles.passageText}>{exercise.passage}</p>
                </div>
              )}
              {section !== 'listening' && exercise.passage && (
                <div className={styles.passageCard}>
                  <p className={styles.passageText}>{exercise.passage}</p>
                </div>
              )}

              {/* Questions */}
              {exercise.questions && (() => {
                const isClipMode = !!(exercise.clips && clipAudioSrcs.length > 0);
                const currentQuestions = isClipMode && exercise.clips?.[currentClipIdx]?.questions
                  ? exercise.clips[currentClipIdx].questions
                  : exercise.questions;
                const clipAnswered = currentQuestions.every((q: any) => answers[q.id] !== undefined);
                const isLastClip = !isClipMode || currentClipIdx >= (exercise.clips?.length || 1) - 1;
                const allClipsDone = isClipMode && submitted && isLastClip;

                return (
                <div className={styles.questionsSection}>
                  <h3 className={styles.questionsSectionTitle}>
                    {isClipMode
                      ? `Clip ${currentClipIdx + 1} — Questions (${currentQuestions.length})`
                      : `Questions (${exercise.questions.length})`}
                  </h3>

                  {currentQuestions.map((q: any) => (
                    <div key={q.id} className={styles.questionCard}>
                      <p className={styles.questionText}>
                        {q.id}. {q.question}
                      </p>
                      <ul className={styles.optionsList}>
                        {q.options.map((opt: string, idx: number) => {
                          const letters = ['A', 'B', 'C', 'D'];
                          let cls = styles.optionBtn;
                          if (submitted) {
                            if (idx === q.correct) cls = `${styles.optionBtn} ${styles.correct}`;
                            else if (answers[q.id] === idx) cls = `${styles.optionBtn} ${styles.wrong}`;
                          } else if (answers[q.id] === idx) {
                            cls = `${styles.optionBtn} ${styles.selected}`;
                          }
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
                      {submitted && q.explanation && (
                        <div className={styles.explanation}>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Clip mode: Check Answers for this clip → Next Clip */}
                  {isClipMode && !submitted && (
                    <button
                      className={styles.generateBtn}
                      onClick={() => setSubmitted(true)}
                      disabled={!clipAnswered}
                      style={{ marginTop: '0.75rem' }}
                    >
                      Check Answers
                    </button>
                  )}
                  {isClipMode && submitted && !isLastClip && (
                    <button
                      className={styles.generateBtn}
                      onClick={() => {
                        setCurrentClipIdx(prev => prev + 1);
                        setSubmitted(false);
                      }}
                      style={{ marginTop: '0.75rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                    >
                      Next Clip 🎧
                    </button>
                  )}
                  {isClipMode && submitted && isLastClip && (
                    <div className={styles.resultsBar}>
                      <div>
                        <div className={styles.scoreDisplay}>
                          <span className={styles.scoreNum}>{getScore().correct}</span>
                          <span className={styles.scoreTotal}>/ {getScore().total}</span>
                        </div>
                        <span className={styles.scoreLabel}>
                          {getScore().correct === getScore().total
                            ? 'Perfect! 🎉'
                            : getScore().correct >= getScore().total * 0.7
                              ? 'Good job! 👍'
                              : 'Keep practicing! 💪'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Non-clip mode: original submit/score */}
                  {!isClipMode && !submitted && (
                    <button
                      className={styles.generateBtn}
                      onClick={submitQuiz}
                      disabled={Object.keys(answers).length < (exercise.questions?.length || 0)}
                      style={{ marginTop: '0.75rem' }}
                    >
                      Check Answers
                    </button>
                  )}
                  {!isClipMode && submitted && (
                    <div className={styles.resultsBar}>
                      <div>
                        <div className={styles.scoreDisplay}>
                          <span className={styles.scoreNum}>{getScore().correct}</span>
                          <span className={styles.scoreTotal}>/ {getScore().total}</span>
                        </div>
                        <span className={styles.scoreLabel}>
                          {getScore().correct === getScore().total
                            ? 'Perfect! 🎉'
                            : getScore().correct >= getScore().total * 0.7
                              ? 'Good job! 👍'
                              : 'Keep practicing! 💪'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                );
              })()}
            </>
          )}

          {/* WRITING */}
          {section === 'writing' && (
            <>
              <div className={styles.exerciseHeader}>
                <h2 className={styles.exerciseTitle}>{exercise.title}</h2>
                <span className={styles.exerciseMeta}>{difficulty}</span>
              </div>

              <div className={styles.writingPrompt}>
                <p className={styles.scenarioText}>{exercise.scenario}</p>
                {exercise.bullets && exercise.bullets.length > 0 && (
                  <ul className={styles.bulletList}>
                    {exercise.bullets.map((b: string, i: number) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
                <div className={styles.promptMeta}>
                  <span className={styles.metaItem}>
                    <Clock size={14} />
                    {exercise.timeMinutes || 27} min
                  </span>
                  <span className={styles.metaItem}>
                    <FileText size={14} />
                    {exercise.wordCountTarget?.min || 150}–{exercise.wordCountTarget?.max || 200} words
                  </span>
                </div>
              </div>

              <a
                href={partOrTask.includes('Task 1') ? '/writing/task-1' : '/writing/task-2'}
                className={styles.startPracticeBtn}
                onClick={() => {
                  // Signal writing page to pick a random theme from existing contexts
                  localStorage.setItem('celpip_ai_writing_prompt', JSON.stringify({
                    task: partOrTask.includes('Task 1') ? 1 : 2,
                    randomTheme: true,
                  }));
                }}
              >
                Start Writing <ArrowRight size={16} />
              </a>
            </>
          )}

          {/* SPEAKING */}
          {section === 'speaking' && (
            <>
              <div className={styles.exerciseHeader}>
                <h2 className={styles.exerciseTitle}>{exercise.title}</h2>
                <span className={styles.exerciseMeta}>{difficulty}</span>
              </div>

              {/* Scene image for Task 3/4 */}
              {imageSrc && (
                <div className={styles.sceneImage}>
                  <img src={imageSrc} alt={exercise.title || 'Scene'} />
                </div>
              )}

              <div className={styles.speakingPrompt}>
                <p className={styles.speakingText}>{exercise.prompt}</p>
                <div className={styles.promptMeta}>
                  <span className={styles.metaItem}>
                    <Clock size={14} />
                    Prep: {exercise.prepTimeSeconds || 30}s
                  </span>
                  <span className={styles.metaItem}>
                    <Mic size={14} />
                    Speak: {exercise.speakTimeSeconds || 60}s
                  </span>
                </div>
                {exercise.tips && exercise.tips.length > 0 && (
                  <ul className={styles.tipsList} style={{ marginTop: '1rem' }}>
                    {exercise.tips.map((t: string, i: number) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                )}
              </div>

              <a
                href={`/speaking/practice/${SPEAKING_TASK_SLUGS[partOrTask.match(/Task (\d)/)?.[1] || '1'] || 'giving-advice'}`}
                className={styles.startPracticeBtn}
              >
                Start Speaking Practice <ArrowRight size={16} />
              </a>
            </>
          )}

          {/* Next exercise button (hidden for visual tasks to avoid DALL-E abuse) */}
          {!(section === 'speaking' && (partOrTask.includes('Task 3') || partOrTask.includes('Task 4'))) && (
            <div className={styles.actions}>
              <button className={styles.nextBtn} onClick={generate} disabled={generating || cooldown > 0}>
                <RefreshCw size={16} />
                {cooldown > 0 ? `Wait ${cooldown}s` : 'Generate Another'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
