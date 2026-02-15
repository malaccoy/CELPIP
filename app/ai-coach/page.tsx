'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
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

  const [section, setSection] = useState<Section>('reading');
  const [partOrTask, setPartOrTask] = useState(PARTS.reading[0].id);
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');
  const [autoMode, setAutoMode] = useState(true);

  const [generating, setGenerating] = useState(false);
  const [exercise, setExercise] = useState<any>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Quiz state (reading/listening)
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [usedTopics, setUsedTopics] = useState<string[]>([]);

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
    setAudioSrc(null); setImageSrc(null);
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
    setGenerating(true);
    setError(null);
    setExercise(null);
    setAudioSrc(null); setImageSrc(null);
    resetQuiz();

    try {
      const res = await fetch('/api/ai-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section,
          partOrTask,
          difficulty,
          previousTopics: usedTopics.slice(-5),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed (${res.status})`);
      }

      const data = await res.json();
      setExercise(data.exercise);

      // Track topic to avoid repeats
      if (data.exercise?.title) {
        setUsedTopics(prev => [...prev, data.exercise.title]);
      }

      // Audio for listening
      if (data.audio) {
        const blob = new Blob(
          [Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))],
          { type: 'audio/mpeg' }
        );
        setAudioSrc(URL.createObjectURL(blob));
      }

      // Image for speaking Task 3/4
      if (data.image) {
        setImageSrc(`data:image/png;base64,${data.image}`);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setGenerating(false);
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
              onClick={() => { setPartOrTask(p.id); setExercise(null); setAudioSrc(null); setImageSrc(null); resetQuiz(); }}
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
        disabled={generating}
      >
        {generating ? (
          <>
            <Loader2 size={18} className={styles.spinner} />
            Generating{section === 'listening' ? ' (includes audio)' : ''}...
          </>
        ) : (
          <>
            <Zap size={18} />
            Generate {section.charAt(0).toUpperCase() + section.slice(1)} Exercise
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
              {section === 'listening' && audioSrc && (
                <div className={styles.audioPlayer}>
                  <Volume2 size={20} className={styles.audioIcon} />
                  <audio ref={audioRef} src={audioSrc} controls preload="auto" />
                </div>
              )}

              {/* Passage (hidden for listening — audio only, like real CELPIP) */}
              {section !== 'listening' && exercise.passage && (
                <div className={styles.passageCard}>
                  <p className={styles.passageText}>{exercise.passage}</p>
                </div>
              )}

              {/* Questions */}
              {exercise.questions && (
                <div className={styles.questionsSection}>
                  <h3 className={styles.questionsSectionTitle}>
                    Questions ({exercise.questions.length})
                  </h3>

                  {exercise.questions.map((q: any) => (
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

                  {/* Submit / Score */}
                  {!submitted ? (
                    <button
                      className={styles.generateBtn}
                      onClick={submitQuiz}
                      disabled={Object.keys(answers).length < (exercise.questions?.length || 0)}
                      style={{ marginTop: '0.75rem' }}
                    >
                      Check Answers
                    </button>
                  ) : (
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
              )}
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
              <button className={styles.nextBtn} onClick={generate} disabled={generating}>
                <RefreshCw size={16} />
                Generate Another
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
