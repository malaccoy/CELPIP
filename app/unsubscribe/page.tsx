'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

function UnsubscribeContent() {
  const params = useSearchParams();
  const success = params.get('success') === 'true';
  const error = params.get('error') === 'true';
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleUnsubscribe = async () => {
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus('done');
        setMessage('You have been unsubscribed. You will no longer receive emails from us.');
      } else {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  const T = {
    bg: '#0a0e1a', surface: '#141926', border: '#1e2536',
    text: '#e2e8f0', textMuted: '#94a3b8', green: '#22c55e',
    blue: '#3b82f6', red: '#ef4444',
  };

  return (
    <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: T.surface, borderRadius: 20, padding: 40, maxWidth: 480, width: '100%', textAlign: 'center' }}>
        {success ? (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h1 style={{ color: T.text, fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Unsubscribed</h1>
            <p style={{ color: T.textMuted, fontSize: 16, lineHeight: 1.6 }}>
              You have been successfully unsubscribed from our emails. You will no longer receive marketing or reminder emails.
            </p>
            <p style={{ color: T.textMuted, fontSize: 14, marginTop: 16 }}>
              Changed your mind?{' '}
              <a href="https://celpipaicoach.com" style={{ color: T.blue, textDecoration: 'none' }}>
                Visit celpipaicoach.com
              </a>
            </p>
          </>
        ) : error ? (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h1 style={{ color: T.text, fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Something went wrong</h1>
            <p style={{ color: T.textMuted, fontSize: 16, lineHeight: 1.6 }}>
              We could not process your unsubscribe request. Please try using the form below.
            </p>
          </>
        ) : status === 'done' ? (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h1 style={{ color: T.text, fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Done!</h1>
            <p style={{ color: T.textMuted, fontSize: 16, lineHeight: 1.6 }}>{message}</p>
          </>
        ) : (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
            <h1 style={{ color: T.text, fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Email Preferences</h1>
            <p style={{ color: T.textMuted, fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
              Enter your email address to unsubscribe from all CELPIP AI Coach emails.
            </p>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%', padding: '14px 16px', borderRadius: 12,
                background: T.bg, border: `1px solid ${T.border}`, color: T.text,
                fontSize: 16, outline: 'none', marginBottom: 16,
              }}
            />
            <button
              onClick={handleUnsubscribe}
              disabled={status === 'loading' || !email}
              style={{
                width: '100%', padding: '14px', borderRadius: 12,
                background: T.red, color: '#fff', fontSize: 16, fontWeight: 700,
                border: 'none', cursor: status === 'loading' ? 'wait' : 'pointer',
                opacity: !email ? 0.5 : 1,
              }}
            >
              {status === 'loading' ? 'Processing...' : 'Unsubscribe'}
            </button>
            {status === 'error' && (
              <p style={{ color: T.red, fontSize: 14, marginTop: 12 }}>{message}</p>
            )}
          </>
        )}

        <div style={{ marginTop: 32, paddingTop: 16, borderTop: `1px solid ${T.border}` }}>
          <p style={{ color: T.textMuted, fontSize: 12 }}>
            CELPIP AI Coach · <a href="https://celpipaicoach.com" style={{ color: T.textMuted }}>celpipaicoach.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}

const UnsubscribePage = dynamic(() => Promise.resolve(UnsubscribeContent), { ssr: false });
export default function Page() { return <UnsubscribePage />; }
