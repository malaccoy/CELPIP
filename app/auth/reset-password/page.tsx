'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import styles from '@/styles/Auth.module.scss';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#f87171', marginBottom: '1rem' }}><XCircle size={48} /></div>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Invalid Link</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>This recovery link is invalid or has expired.</p>
        <Link href="/auth/forgot-password" className={styles.submitBtn}>
          Request New Link <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) { setError('Passwords do not match'); setLoading(false); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Error resetting password'); return; }
      setSuccess(true);
    } catch {
      setError('Error resetting password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#4ade80', marginBottom: '1rem' }}><CheckCircle size={48} /></div>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Password Changed! 🔐</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Your password has been reset successfully.</p>
        <Link href="/auth/login" className={styles.submitBtn}>
          Sign In <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className={styles.logo}>
        <h1>New Password</h1>
        <p>Enter your new password below</p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <Lock size={18} className={styles.inputIcon} />
          <input
            type="password"
            placeholder="New password (min 6 characters)"
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
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? (
            <><div className={styles.spinner} /> Saving...</>
          ) : (
            <>Save New Password <ArrowRight size={18} /></>
          )}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Suspense fallback={
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div className={styles.spinner} style={{ width: 40, height: 40, margin: '0 auto' }} />
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
