'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, RotateCcw, Trophy, Brain } from 'lucide-react';
import type { ModuleQuiz } from '@content/quiz-data';
import styles from '@/styles/QuizCard.module.scss';

// Lightweight inline score saver — saves to localStorage AND syncs to server
const STORAGE_KEY = 'celpip-score-tracker';

function saveQuizResult(sectionId: string, moduleId: string, score: number, total: number) {
  if (typeof window === 'undefined') return;

  // 1) Save to localStorage (always works, even offline)
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : { attempts: [], version: 1 };
    data.attempts.push({
      moduleId,
      sectionId,
      score,
      total,
      timestamp: Date.now(),
    });
    // Trim: max 20 per module
    const key = `${sectionId}:${moduleId}`;
    const grouped: Record<string, typeof data.attempts> = {};
    for (const a of data.attempts) {
      const k = `${a.sectionId}:${a.moduleId}`;
      if (!grouped[k]) grouped[k] = [];
      grouped[k].push(a);
    }
    if (grouped[key] && grouped[key].length > 20) {
      grouped[key] = grouped[key].slice(-20);
    }
    data.attempts = Object.values(grouped).flat();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* silent */ }

  // 2) Sync to server (if logged in — fire and forget)
  fetch('/api/quiz-scores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sectionId, moduleId, score, total }),
  }).catch(() => { /* offline or not logged in — no problem */ });
}

interface QuizCardProps {
  quiz: ModuleQuiz;
  accentColor?: string;
}

export default function QuizCard({ quiz, accentColor = '#3b82f6' }: QuizCardProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(quiz.questions.length).fill(null));
  const savedRef = useRef(false);

  const question = quiz.questions[currentQ];
  const isCorrect = selected === question?.correctIndex;
  const total = quiz.questions.length;

  // Save result when quiz finishes
  useEffect(() => {
    if (finished && !savedRef.current) {
      savedRef.current = true;
      saveQuizResult(quiz.sectionId, quiz.moduleId, score, total);
    }
  }, [finished, quiz.sectionId, quiz.moduleId, score, total]);

  const handleSelect = useCallback((idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExplanation(true);
    const newAnswers = [...answers];
    newAnswers[currentQ] = idx;
    setAnswers(newAnswers);
    if (idx === question.correctIndex) {
      setScore((s) => s + 1);
    }
  }, [selected, currentQ, question, answers]);

  const handleNext = useCallback(() => {
    if (currentQ < total - 1) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
    }
  }, [currentQ, total]);

  const handleRestart = useCallback(() => {
    setCurrentQ(0);
    setSelected(null);
    setShowExplanation(false);
    setScore(0);
    setFinished(false);
    setAnswers(new Array(total).fill(null));
    savedRef.current = false;
  }, [total]);

  if (finished) {
    const pct = Math.round((score / total) * 100);
    const emoji = pct === 100 ? '🏆' : pct >= 70 ? '👏' : pct >= 50 ? '💪' : '📚';
    return (
      <div className={styles.quizContainer} style={{ '--accent': accentColor } as React.CSSProperties}>
        <div className={styles.resultCard}>
          <span className={styles.resultEmoji}>{emoji}</span>
          <h3>Quiz Complete!</h3>
          <div className={styles.resultScore}>
            <Trophy size={18} />
            <span>{score}/{total} correct ({pct}%)</span>
          </div>
          <p className={styles.resultMsg}>
            {pct === 100
              ? 'Perfect! You\'ve mastered this module.'
              : pct >= 70
              ? 'Great job! Review the ones you missed.'
              : 'Keep studying — review the module and try again!'}
          </p>
          <span className={styles.savedNote}>✓ Score saved to your progress</span>
          <button className={styles.restartBtn} onClick={handleRestart}>
            <RotateCcw size={14} />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.quizContainer} style={{ '--accent': accentColor } as React.CSSProperties}>
      <div className={styles.quizHeader}>
        <Brain size={16} />
        <span>Quick Quiz</span>
        <span className={styles.quizProgress}>{currentQ + 1}/{total}</span>
      </div>

      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${((currentQ + (selected !== null ? 1 : 0)) / total) * 100}%` }} />
      </div>

      <div className={styles.questionCard}>
        <p className={styles.questionText}>{question.question}</p>

        <div className={styles.options}>
          {question.options.map((opt, i) => {
            let cls = styles.option;
            if (selected !== null) {
              if (i === question.correctIndex) cls += ` ${styles.correct}`;
              else if (i === selected && !isCorrect) cls += ` ${styles.incorrect}`;
              else cls += ` ${styles.dimmed}`;
            }
            return (
              <button
                key={i}
                className={cls}
                onClick={() => handleSelect(i)}
                disabled={selected !== null}
              >
                <span className={styles.optionLetter}>{String.fromCharCode(65 + i)}</span>
                <span className={styles.optionText}>{opt}</span>
                {selected !== null && i === question.correctIndex && <CheckCircle size={16} className={styles.optionIcon} />}
                {selected !== null && i === selected && !isCorrect && i !== question.correctIndex && <XCircle size={16} className={styles.optionIcon} />}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className={`${styles.explanation} ${isCorrect ? styles.explanationCorrect : styles.explanationWrong}`}>
            <p>
              <strong>{isCorrect ? '✅ Correct!' : '❌ Not quite.'}</strong>{' '}
              {question.explanation}
            </p>
          </div>
        )}

        {selected !== null && (
          <button className={styles.nextBtn} onClick={handleNext}>
            <span>{currentQ < total - 1 ? 'Next Question' : 'See Results'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
