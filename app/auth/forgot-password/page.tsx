'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Loader2, AlertCircle, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';
import styles from '@/styles/Auth.module.scss';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error sending email');
        return;
      }

      setSuccess(true);
    } catch {
      setError('Error sending email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>
              <CheckCircle size={48} />
            </div>
            <h2>Email Sent! 📧</h2>
            <p>
              If the email <strong>{email}</strong> is registered, you will receive a link to reset your password.
            </p>
            <p className={styles.smallText}>
              Check your inbox and spam folder.
            </p>
            <Link href="/auth/login" className={styles.submitButton}>
              Back to Login
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <Link href="/auth/login" className={styles.backLink}>
          <ArrowLeft size={16} />
          Back to login
        </Link>

        <div className={styles.authHeader}>
          <h1>Reset Password</h1>
          <p>Enter your email to receive a recovery link</p>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <div className={styles.inputWrapper}>
              <Mail size={18} />
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={18} className={styles.spinner} />
                Sending...
              </>
            ) : (
              <>
                Send Recovery Link
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
