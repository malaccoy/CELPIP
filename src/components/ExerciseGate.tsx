'use client';

import { useState, useEffect } from 'react';
import { Lock, ArrowRight, Sparkles, CheckCircle, CheckCircle2 } from 'lucide-react';
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
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/email-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'exercise-gate' }),
      });

      if (res.ok) {
        setStatus('success');
        localStorage.setItem('celpip-email-subscribed', 'true');
        // Unlock exercises after email capture
        localStorage.removeItem(STORAGE_KEY);
        setTimeout(() => setBlocked(false), 2500);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (checking || !blocked) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {status === 'success' ? (
          <div className={styles.successState}>
            <CheckCircle2 size={48} className={styles.successIcon} />
            <h2 className={styles.title}>You&apos;re in! 🎉</h2>
            <p className={styles.subtitle}>Unlocking your exercises now...</p>
          </div>
        ) : (
          <>
            <div className={styles.iconWrap}>
              <Lock size={32} />
            </div>

            <h2 className={styles.title}>
              Keep Practicing {section} — Free
            </h2>

            <p className={styles.subtitle}>
              Enter your email to unlock unlimited free exercises, plus get a 14-day CELPIP study plan.
            </p>

            <div className={styles.benefits}>
              <div className={styles.benefit}>
                <CheckCircle size={16} />
                <span>Unlimited free exercises</span>
              </div>
              <div className={styles.benefit}>
                <CheckCircle size={16} />
                <span>14-day study plan in your inbox</span>
              </div>
              <div className={styles.benefit}>
                <CheckCircle size={16} />
                <span>Weekly CELPIP tips & strategies</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.emailInput}
                autoFocus
              />
              <button
                type="submit"
                className={styles.primaryBtn}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <span>Unlocking...</span>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Start Practicing Free</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {status === 'error' && (
              <p className={styles.errorMsg}>Something went wrong. Please try again.</p>
            )}

            <p className={styles.privacy}>No spam, ever. Unsubscribe anytime.</p>
          </>
        )}
      </div>
    </div>
  );
}
