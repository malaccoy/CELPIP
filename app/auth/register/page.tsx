'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Mail, Lock, User, Loader2, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import styles from '@/styles/Auth.module.scss';
import { analytics } from '@/lib/analytics';

export default function RegisterPageWrapper() {
  return <Suspense><RegisterPageInner /></Suspense>;
}

function RegisterPageInner() {
  const searchParams = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralSource, setReferralSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) setReferralSource(ref);
  }, [searchParams]);

  const handleGoogleSignup = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

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

      // If user came from /try, save onboarding data
      try {
        const tryData = localStorage.getItem('try_onboarding');
        if (tryData) {
          const parsed = JSON.parse(tryData);
          if (parsed.goal || parsed.source) {
            const onboardingData = { ...parsed, completed: true, date: new Date().toISOString() };
            localStorage.setItem('celpip_onboarding', JSON.stringify(onboardingData));
            fetch('/api/onboarding', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(onboardingData),
            }).catch(() => {});
            localStorage.removeItem('try_onboarding');
          }
        }
      } catch {}
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

        {/* Google Sign Up — Primary */}
        <button 
          className={styles.googleBtn} 
          onClick={handleGoogleSignup}
          disabled={loading}
          style={{ marginBottom: 0 }}
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign up with Google
        </button>

        {/* Divider */}
        <div className={styles.divider}>
          <span>or sign up with email</span>
        </div>

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
