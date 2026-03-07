'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import styles from '@/styles/ExerciseGate.module.scss';

const STORAGE_KEY = 'celpip_exercises_done';
const FREE_LIMIT = 1;

interface ExerciseGateProps {
  section: string;
}

export default function ExerciseGate({ section }: ExerciseGateProps) {
  const [blocked, setBlocked] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    fetch('/api/plan')
      .then(res => {
        if (res.ok) {
          // Logged in → no gate
          setChecking(false);
          return;
        }
        // Not logged in → check exercise count
        const count = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
        if (count >= FREE_LIMIT) {
          setBlocked(true);
        } else {
          // First exercise — increment counter
          localStorage.setItem(STORAGE_KEY, String(count + 1));
        }
        setChecking(false);
      })
      .catch(() => {
        // Network error — let them through
        setChecking(false);
      });
  }, []);

  if (checking) return null;

  if (!blocked) return null;

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
