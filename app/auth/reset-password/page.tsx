'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Loader2, AlertCircle, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
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
      <div className={styles.errorCard}>
        <div className={styles.errorIcon}>
          <XCircle size={48} />
        </div>
        <h2>Invalid Link</h2>
        <p>This recovery link is invalid or has expired.</p>
        <Link href="/auth/forgot-password" className={styles.submitButton}>
          Request New Link
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

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
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error resetting password');
        return;
      }

      setSuccess(true);
    } catch {
      setError('Error resetting password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.successCard}>
        <div className={styles.successIcon}>
          <CheckCircle size={48} />
        </div>
        <h2>Password Changed! 🔐</h2>
        <p>Your password has been reset successfully.</p>
        <Link href="/auth/login" className={styles.submitButton}>
          Sign In
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className={styles.authHeader}>
        <h1>New Password</h1>
        <p>Enter your new password below</p>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.authForm}>
        <div className={styles.inputGroup}>
          <label htmlFor="password">New Password</label>
          <div className={styles.inputWrapper}>
            <Lock size={18} />
            <input
              id="password"
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <div className={styles.inputWrapper}>
            <Lock size={18} />
            <input
              id="confirmPassword"
              type="password"
              placeholder="Enter password again"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={18} className={styles.spinner} />
              Saving...
            </>
          ) : (
            <>
              Save New Password
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <Suspense fallback={<div className={styles.loadingCard}><Loader2 size={32} className={styles.spinner} /></div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
