'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import styles from '@/styles/StartPracticing.module.scss';

export default function StartPracticingButton({ className }: { className?: string }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleClick = () => {
    // If already subscribed, go straight to exercise
    if (typeof window !== 'undefined' && localStorage.getItem('celpip-email-subscribed')) {
      router.push('/writing/task-1');
      return;
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/email-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'start-practicing' }),
      });

      if (res.ok) {
        setStatus('success');
        localStorage.setItem('celpip-email-subscribed', 'true');
        setTimeout(() => router.push('/writing/task-1'), 1500);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <button onClick={handleClick} className={className}>
        <span>Start Practicing Free</span>
        <ArrowRight size={20} />
      </button>

      {showModal && (
        <div className={styles.overlay} onClick={() => status !== 'loading' && setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            {status === 'success' ? (
              <div className={styles.successState}>
                <CheckCircle2 size={48} className={styles.successIcon} />
                <h2>You&apos;re in! 🎉</h2>
                <p>Taking you to your first exercise...</p>
              </div>
            ) : (
              <>
                <h2 className={styles.title}>Start Your Free Practice</h2>
                <p className={styles.subtitle}>
                  Enter your email to access a free Writing exercise + get a 14-day CELPIP study plan.
                </p>

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
                    className={styles.submitBtn}
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? (
                      <span>Loading...</span>
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
                  <p className={styles.errorMsg}>Something went wrong. Try again.</p>
                )}
                <p className={styles.privacy}>No spam, ever. Unsubscribe anytime.</p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
