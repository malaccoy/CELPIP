'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Star, Send, MessageSquare } from 'lucide-react';

const TAGS = [
  '🎯 Love the exercises',
  '📚 Need more content',
  '🐛 Found a bug',
  '⚡ App is slow',
  '💡 Feature request',
  '😍 Great AI feedback',
];

/**
 * Full-screen feedback popup.
 * Triggers after the user completes 2 exercises (tracked via sessionStorage counter
 * incremented by drill/practice pages calling `FeedbackPopup.tick()`).
 * Only shows ONCE per user (server-side `recentFeedback` check — any prior submission blocks).
 */
export default function FeedbackPopup() {
  const [show, setShow] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [checked, setChecked] = useState(false);

  // Listen for exercise-complete events
  useEffect(() => {
    if (checked) return;

    const handler = () => {
      const count = parseInt(sessionStorage.getItem('exercisesDone') || '0') + 1;
      sessionStorage.setItem('exercisesDone', String(count));

      if (count >= 2 && !sessionStorage.getItem('feedbackShown')) {
        sessionStorage.setItem('feedbackShown', '1');
        // Check server: has user ever submitted feedback?
        fetch('/api/feedback')
          .then(r => r.json())
          .then(d => { if (!d.recentFeedback) setShow(true); })
          .catch(() => {});
        setChecked(true);
      }
    };

    window.addEventListener('exercise-complete', handler);
    return () => window.removeEventListener('exercise-complete', handler);
  }, [checked]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, 3].length > 3 ? prev : [...prev, tag]);
  };

  const submit = useCallback(async () => {
    if (rating === 0) return;
    setSending(true);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          category: selectedTags.join(', ') || undefined,
          message: message.trim() || undefined,
          page: window.location.pathname,
        }),
      });
      setSent(true);
      setTimeout(() => setShow(false), 2500);
    } catch {
      setSending(false);
    }
  }, [rating, selectedTags, message]);

  if (!show) return null;

  return (
    <div style={S.overlay} onClick={() => setShow(false)}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        {/* Close button */}
        <button style={S.close} onClick={() => setShow(false)}><X size={20} /></button>

        {sent ? (
          <div style={S.thankYou}>
            <div style={{ fontSize: 48 }}>🎉</div>
            <h2 style={S.title}>Thank you!</h2>
            <p style={S.sub}>Your feedback helps us improve</p>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <MessageSquare size={32} style={{ color: '#6366f1', marginBottom: 8 }} />
              <h2 style={S.title}>How&apos;s your experience?</h2>
              <p style={S.sub}>Rate us and help us improve!</p>
            </div>

            {/* Stars */}
            <div style={S.stars}>
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  style={S.starBtn}
                  onMouseEnter={() => setHoveredStar(n)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setRating(n)}
                >
                  <Star
                    size={36}
                    fill={(hoveredStar || rating) >= n ? '#fbbf24' : 'transparent'}
                    stroke={(hoveredStar || rating) >= n ? '#fbbf24' : '#475569'}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p style={S.ratingLabel}>
                {['', 'Poor 😞', 'Fair 😐', 'Good 🙂', 'Great 😊', 'Amazing! 🤩'][rating]}
              </p>
            )}

            {/* Tags */}
            <div style={S.tags}>
              {TAGS.map(tag => (
                <button
                  key={tag}
                  style={{
                    ...S.tag,
                    ...(selectedTags.includes(tag) ? S.tagActive : {}),
                  }}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Message */}
            <textarea
              style={S.textarea}
              placeholder="Anything else? (optional)"
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
            />

            {/* Submit */}
            <button
              style={{
                ...S.submit,
                opacity: rating === 0 ? 0.4 : 1,
                pointerEvents: rating === 0 ? 'none' : 'auto',
              }}
              onClick={submit}
              disabled={sending || rating === 0}
            >
              {sending ? 'Sending...' : <>Send Feedback <Send size={16} /></>}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Helper to trigger from drill/practice pages
FeedbackPopup.tick = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('exercise-complete'));
  }
};

const S: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 9999,
    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 20, animation: 'feedbackFadeIn 0.25s ease',
  },
  modal: {
    background: '#1a1d2e', borderRadius: 20,
    padding: '32px 24px', width: '100%', maxWidth: 400,
    position: 'relative', border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
  },
  close: {
    position: 'absolute', top: 12, right: 12,
    background: 'rgba(255,255,255,0.06)', border: 'none',
    borderRadius: '50%', width: 36, height: 36,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#94a3b8', cursor: 'pointer',
  },
  title: {
    color: '#f1f5f9', fontSize: 22, fontWeight: 800, margin: '0 0 4px',
  },
  sub: {
    color: '#94a3b8', fontSize: 14, margin: 0,
  },
  stars: {
    display: 'flex', justifyContent: 'center', gap: 8, margin: '16px 0 4px',
  },
  starBtn: {
    background: 'none', border: 'none', cursor: 'pointer', padding: 2,
    transition: 'transform 0.15s',
  },
  ratingLabel: {
    textAlign: 'center', color: '#94a3b8', fontSize: 14, margin: '4px 0 12px',
  },
  tags: {
    display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 16,
  },
  tag: {
    padding: '6px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600,
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    color: '#94a3b8', cursor: 'pointer', transition: 'all 0.15s',
  },
  tagActive: {
    background: 'rgba(99,102,241,0.15)', borderColor: 'rgba(99,102,241,0.4)',
    color: '#a5b4fc',
  },
  textarea: {
    width: '100%', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12,
    padding: '10px 14px', color: '#f1f5f9', fontSize: 14,
    resize: 'none', outline: 'none', fontFamily: 'inherit',
    boxSizing: 'border-box', marginBottom: 16,
  },
  submit: {
    width: '100%', padding: '14px 0', borderRadius: 12, border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff',
    fontSize: 16, fontWeight: 700, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    transition: 'all 0.15s',
  },
  thankYou: {
    textAlign: 'center', padding: '20px 0',
  },
};
