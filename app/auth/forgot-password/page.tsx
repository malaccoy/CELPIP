'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import styles from '@/styles/Auth.module.scss';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (resetError) {
        setError(resetError.message);
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
      <div className={styles.container}>
        <div className={styles.card}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#4ade80', marginBottom: '1rem' }}>
              <CheckCircle size={48} />
            </div>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Email Sent! 📧</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', lineHeight: 1.6 }}>
              If the email <strong>{email}</strong> is registered, you will receive a link to reset your password.
            </p>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Check your inbox and spam folder.
            </p>
            <Link href="/auth/login" className={styles.submitBtn}>
              Back to Login
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
        <Link href="/auth/login" className={styles.backLink}>
          <ArrowLeft size={16} />
          Back to login
        </Link>

        <div className={styles.logo}>
          <h1>Reset Password</h1>
          <p>Enter your email to receive a recovery link</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <Mail size={18} className={styles.inputIcon} />
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

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? (
              <><div className={styles.spinner} /> Sending...</>
            ) : (
              <>Send Recovery Link <ArrowRight size={18} /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
