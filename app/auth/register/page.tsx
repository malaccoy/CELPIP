'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, Loader2, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';
import styles from '@/styles/Auth.module.scss';
import { analytics } from '@/lib/analytics';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralSource, setReferralSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, referralSource: referralSource || undefined }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Error creating account'); return; }
      setSuccess(true);
      analytics.signupCompleted();
    } catch {
      setError('Error creating account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#4ade80', marginBottom: '1rem' }}>
              <CheckCircle size={48} />
            </div>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Account created! 🎉</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', lineHeight: 1.6 }}>
              We sent a verification email to <strong>{email}</strong>.
            </p>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Click the link in the email to activate your account.
            </p>
            <Link href="/auth/login" className={styles.submitBtn}>
              Go to Login
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <h1>Create Account</h1>
          <p>Sign up to save your progress</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <User size={18} className={styles.inputIcon} />
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className={styles.inputGroup}>
            <Mail size={18} className={styles.inputIcon} />
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.inputGroup}>
            <Lock size={18} className={styles.inputIcon} />
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          <div className={styles.inputGroup}>
            <Lock size={18} className={styles.inputIcon} />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.inputGroup}>
            <AlertCircle size={18} className={styles.inputIcon} />
            <select
              value={referralSource}
              onChange={(e) => setReferralSource(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
              }}
            >
              <option value="" style={{ background: 'var(--bg-card)' }}>How did you hear about us?</option>
              <option value="google" style={{ background: 'var(--bg-card)' }}>Search Engine (Google, Bing)</option>
              <option value="youtube" style={{ background: 'var(--bg-card)' }}>YouTube</option>
              <option value="tiktok" style={{ background: 'var(--bg-card)' }}>TikTok</option>
              <option value="instagram" style={{ background: 'var(--bg-card)' }}>Instagram</option>
              <option value="facebook" style={{ background: 'var(--bg-card)' }}>Facebook</option>
              <option value="reddit" style={{ background: 'var(--bg-card)' }}>Reddit</option>
              <option value="friend" style={{ background: 'var(--bg-card)' }}>Friend / Family</option>
              <option value="consultant" style={{ background: 'var(--bg-card)' }}>School / Immigration Consultant</option>
              <option value="other" style={{ background: 'var(--bg-card)' }}>Other</option>
            </select>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? (
              <><div className={styles.spinner} /> Creating account...</>
            ) : (
              <>Create Account <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <p>Already have an account? <Link href="/auth/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
