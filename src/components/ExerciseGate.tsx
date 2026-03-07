'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import styles from '@/styles/ExerciseGate.module.scss';

const STORAGE_KEY = 'celpip_exercises_done';
const FREE_LIMIT = 1;

/** Call this after user completes an exercise (submits feedback, finishes quiz, etc.) */
export function markExerciseDone() {
  if (typeof window === 'undefined') return;
  const count = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
  localStorage.setItem(STORAGE_KEY, String(count + 1));
}

interface ExerciseGateProps {
  section: string;
}

export default function ExerciseGate({ section }: ExerciseGateProps) {
  const [blocked, setBlocked] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch('/api/plan')
      .then(res => {
        if (res.ok) {
          setChecking(false);
          return;
        }
        const count = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
        if (count >= FREE_LIMIT) {
          setBlocked(true);
        }
        setChecking(false);
      })
      .catch(() => {
        setChecking(false);
      });
  }, []);

  if (checking || !blocked) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.iconWrap}>
          <Lock size={32} />
        </div>

        <h2 className={styles.title}>
          You&apos;ve Used Your Free Preview
        </h2>

        <p className={styles.subtitle}>
          Create a free account to keep practicing {section} — unlimited exercises, progress tracking & more.
        </p>

        <div className={styles.benefits}>
          <div className={styles.benefit}>
            <CheckCircle size={16} />
            <span>Unlimited free exercises</span>
          </div>
          <div className={styles.benefit}>
            <CheckCircle size={16} />
            <span>Track your progress</span>
          </div>
          <div className={styles.benefit}>
            <CheckCircle size={16} />
            <span>Save your work</span>
          </div>
        </div>

        <Link href="/auth/register" className={styles.primaryBtn}>
          <Sparkles size={18} />
          <span>Create Free Account</span>
          <ArrowRight size={16} />
        </Link>

        <Link href="/auth/login" className={styles.secondaryBtn}>
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  );
}
