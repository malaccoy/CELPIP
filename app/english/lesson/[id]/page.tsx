'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Flame, Star, RotateCcw, BookOpen, CheckCircle2, XCircle } from 'lucide-react';
import styles from '../../learn.module.scss';
import { analytics } from '@/lib/analytics';

type Phase = 'study' | 'quiz' | 'results';

interface KeyFact { fact: string; detail: string; }
interface Exercise {
  id: number; type: string; order: number;
  question: any; options: any; points: number; explanation?: string;
}

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const lessonId = parseInt(params.id as string);

  const [lesson, setLesson] = useState<any>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [phase, setPhase] = useState<Phase>('study');
  const [currentExIdx, setCurrentExIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!lessonId || isNaN(lessonId)) return;
    fetch(`/api/english/lessons/${lessonId}`)
      .then(r => r.json())
      .then(data => {
        setLesson(data.lesson);
        setExercises(data.exercises || []);
        analytics.lessonStarted(lessonId, data.lesson?.title);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [lessonId]);

  const currentExercise = exercises[currentExIdx];
  const keyFacts = (lesson?.dialogue || []) as KeyFact[];
  const totalSteps = 1 + exercises.length;
  const currentStep = phase === 'study' ? 1 : phase === 'quiz' ? 1 + currentExIdx + 1 : totalSteps;
  const progressPct = (currentStep / totalSteps) * 100;

  const selectingRef = React.useRef(false);
  const handleSelect = (exerciseId: number, optIdx: number) => {
    if (answers[exerciseId] !== undefined) return; // Already answered
    if (selectingRef.current) return; // Debounce
    selectingRef.current = true;
    setAnswers(prev => ({ ...prev, [exerciseId]: optIdx }));
    setShowExplanation(true);
    setTimeout(() => { selectingRef.current = false; }, 500);
  };

  const nextQuestion = () => {
    setShowExplanation(false);
    if (currentExIdx < exercises.length - 1) {
      setCurrentExIdx(prev => prev + 1);
    } else {
      submitLesson();
    }
  };

  const submitLesson = async () => {
    setPhase('results');
    try {
      const res = await fetch(`/api/english/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          timeSeconds: Math.round((Date.now() - startTime) / 1000),
        }),
      });
      if (res.ok) {
        const r = await res.json();
        setResults(r);
        analytics.lessonCompleted(lessonId, r.score);
      }
    } catch {}
  };

  if (loading) return (
    <div className={styles.lessonContainer}>
      <div className={styles.loading}><p>Loading lesson...</p></div>
    </div>
  );

  if (!lesson) return (
    <div className={styles.lessonContainer}>
      <p>Lesson not found</p>
      <button onClick={() => router.back()}>Go Back</button>
    </div>
  );

  return (
    <div className={styles.lessonContainer}>
      {/* Header */}
      <div className={styles.lessonHeader}>
        <button className={styles.backBtn} onClick={() => router.back()}>
          <ArrowLeft size={18} />
        </button>
        <div className={styles.lessonHeaderInfo}>
          <h1 className={styles.lessonHeaderTitle}>{lesson.title}</h1>
          <p className={styles.lessonHeaderSub}>{lesson.grammarFocus || lesson.situation}</p>
        </div>
      </div>

      <div className={styles.progressTop}>
        <div className={styles.progressTopFill} style={{ width: `${progressPct}%` }} />
      </div>

      {/* Phase: Study — Key Facts */}
      {phase === 'study' && (
        <div className={styles.studySection}>
          <p className={styles.sectionLabel}>📖 Key Facts — Study These!</p>
          <p className={styles.studyHint}>Read carefully — you&apos;ll be quizzed on these facts</p>

          <div className={styles.factsGrid}>
            {keyFacts.map((f, i) => (
              <div key={i} className={styles.factCard}>
                <div className={styles.factNumber}>{i + 1}</div>
                <div className={styles.factContent}>
                  <p className={styles.factText}>{f.fact}</p>
                  {f.detail && <p className={styles.factDetail}>{f.detail}</p>}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.lessonNav}>
            <button className={`${styles.navBtn} ${styles.navBtnPrimary}`} onClick={() => { setPhase('quiz'); setCurrentExIdx(0); }}>
              Start Quiz ({exercises.length} questions) <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Phase: Quiz */}
      {phase === 'quiz' && currentExercise && (
        <div className={styles.exerciseArea}>
          <p className={styles.sectionLabel}>
            ❓ Question {currentExIdx + 1} of {exercises.length}
          </p>

          <div className={styles.exerciseCard} key={`exercise-${currentExercise.id}`}>
            <p className={styles.exerciseQuestion}>
              {currentExercise.question?.text || ''}
            </p>

            <div className={styles.optionsList}>
              {(currentExercise.options as string[] || []).map((opt: string, i: number) => {
                const answered = answers[currentExercise.id] !== undefined;
                const selected = answers[currentExercise.id] === i;
                const isCorrect = i === (currentExercise as any).correct;
                
                let cls = styles.optionBtn;
                if (answered) {
                  if (isCorrect) cls += ` ${styles.correct}`;
                  else if (selected) cls += ` ${styles.wrong}`;
                } else {
                  cls += ` ${styles.quizOption}`;
                }

                return (
                  <button
                    key={i}
                    className={cls}
                    onClick={() => handleSelect(currentExercise.id, i)}
                    disabled={answered}
                  >
                    <span className={styles.optionLetter}>
                      {['A', 'B', 'C', 'D'][i]}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Explanation after answering */}
            {showExplanation && answers[currentExercise.id] !== undefined && (
              <div className={`${styles.explanationBox} ${
                answers[currentExercise.id] === (currentExercise as any).correct 
                  ? styles.explanationCorrect 
                  : styles.explanationWrong
              }`}>
                <div className={styles.explanationHeader}>
                  {answers[currentExercise.id] === (currentExercise as any).correct ? (
                    <><CheckCircle2 size={20} /> Correct!</>
                  ) : (
                    <><XCircle size={20} /> Incorrect</>
                  )}
                </div>
                {(currentExercise as any).explanation && (
                  <p className={styles.explanationText}>{(currentExercise as any).explanation}</p>
                )}
              </div>
            )}
          </div>

          {showExplanation && (
            <div className={styles.lessonNav}>
              <button className={`${styles.navBtn} ${styles.navBtnPrimary}`} onClick={nextQuestion}>
                {currentExIdx < exercises.length - 1 ? (
                  <>Next Question <ArrowRight size={16} /></>
                ) : (
                  <>See Results <Check size={16} /></>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Phase: Results */}
      {phase === 'results' && (
        <div className={styles.exerciseCard}>
          <div className={styles.resultsCard}>
            <p className={styles.sectionLabel}>
              {results && results.score >= 75 ? '🎉 You Passed!' : '📚 Keep Studying!'}
            </p>

            {results ? (
              <>
                <div className={styles.resultsScore} style={{
                  color: results.score >= 75 ? '#22c55e' : results.score >= 50 ? '#fbbf24' : '#f87171'
                }}>
                  {results.score}%
                </div>
                <p style={{ color: 'rgba(255,255,255,0.5)', margin: '0.3rem 0' }}>
                  {results.correct}/{results.total} correct
                  {results.score >= 75 ? ' ✅ (75% needed to pass)' : ' ❌ (75% needed to pass)'}
                </p>
                <div className={styles.resultsXp}>
                  <Star size={18} /> +{results.xpEarned} XP
                </div>
                <div className={styles.resultsStreak}>
                  <Flame size={18} /> {results.streakDays} day streak!
                </div>
              </>
            ) : (
              <p style={{ color: 'rgba(255,255,255,0.5)' }}>Calculating score...</p>
            )}

            <div className={styles.lessonNav} style={{ marginTop: '2rem' }}>
              <button
                className={`${styles.navBtn} ${styles.navBtnSecondary}`}
                onClick={() => { setPhase('study'); setCurrentExIdx(0); setAnswers({}); setShowExplanation(false); setResults(null); }}
              >
                <RotateCcw size={16} /> Study Again
              </button>
              <button
                className={`${styles.navBtn} ${styles.navBtnPrimary}`}
                onClick={() => router.back()}
              >
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
