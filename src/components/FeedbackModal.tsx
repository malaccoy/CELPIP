'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/FeedbackModal.module.scss';

const challenges = [
  { id: 'listening', label: '👂 Understanding listening audio', emoji: '👂' },
  { id: 'writing', label: '✍️ Writing structured emails/responses', emoji: '✍️' },
  { id: 'speaking', label: '🗣️ Speaking fluently under time pressure', emoji: '🗣️' },
  { id: 'reading', label: '📖 Reading comprehension speed', emoji: '📖' },
  { id: 'grammar', label: '📝 Grammar & vocabulary', emoji: '📝' },
  { id: 'other', label: '💡 Other', emoji: '💡' },
];

export function FeedbackModal() {
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [suggestion, setSuggestion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Check if user already submitted or dismissed recently
    const dismissed = localStorage.getItem('feedback-dismissed');
    if (dismissed) {
      const ts = parseInt(dismissed);
      // Don't show again for 7 days after dismiss
      if (Date.now() - ts < 7 * 24 * 60 * 60 * 1000) return;
    }

    // Check exercise count
    const exerciseCount = parseInt(localStorage.getItem('exercise-count') || '0');
    if (exerciseCount < 3) return;

    // Check server if already submitted
    fetch('/api/feedback')
      .then(r => r.json())
      .then(data => {
        if (!data.submitted) {
          setTimeout(() => setShow(true), 2000);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (selected.length === 0) return;
    setSubmitting(true);

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challenge: selected.join(', '),
          suggestion: suggestion.trim() || null,
        }),
      });
      setDone(true);
      setTimeout(() => setShow(false), 2500);
    } catch {
      setSubmitting(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('feedback-dismissed', Date.now().toString());
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className={styles.overlay} onClick={handleDismiss}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {done ? (
          <div className={styles.thanks}>
            <span className={styles.thanksEmoji}>🙏</span>
            <h3>Thank you!</h3>
            <p>Your feedback helps us improve.</p>
          </div>
        ) : (
          <>
            <button className={styles.close} onClick={handleDismiss}>✕</button>
            <h3 className={styles.title}>Help Us Help You! 🎯</h3>
            <p className={styles.subtitle}>Quick 30-second survey to improve your experience</p>

            <div className={styles.question}>
              <label>What&apos;s your biggest challenge preparing for CELPIP?</label>
              <p className={styles.hint}>Select all that apply</p>
              <div className={styles.options}>
                {challenges.map(c => (
                  <button
                    key={c.id}
                    className={`${styles.option} ${selected.includes(c.id) ? styles.selected : ''}`}
                    onClick={() => setSelected(prev =>
                      prev.includes(c.id) ? prev.filter(x => x !== c.id) : [...prev, c.id]
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.question}>
              <label>Any feature you&apos;d love to see? <span className={styles.optional}>(optional)</span></label>
              <textarea
                className={styles.textarea}
                placeholder="e.g., More speaking practice with different accents..."
                value={suggestion}
                onChange={e => setSuggestion(e.target.value)}
                rows={3}
                maxLength={500}
              />
            </div>

            <button
              className={styles.submit}
              onClick={handleSubmit}
              disabled={selected.length === 0 || submitting}
            >
              {submitting ? 'Sending...' : 'Submit Feedback'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
