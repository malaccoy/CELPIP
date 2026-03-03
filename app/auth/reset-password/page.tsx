'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import styles from '@/styles/Auth.module.scss';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [ready, setReady] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Supabase recovery: tokens come in URL hash or as code param
    const handleRecovery = async () => {
      // Listen for PASSWORD_RECOVERY event
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
          setReady(true);
        }
      });

      // Check if already has a session (e.g. from server-side token exchange)
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setReady(true);
        return () => subscription.unsubscribe();
      }

      // Check URL for hash params (Supabase PKCE flow)
      const hash = window.location.hash;
      if (hash && hash.includes('access_token')) {
        // Supabase client auto-picks up hash tokens
        await new Promise(resolve => setTimeout(resolve, 1500));
        const { data: { session: s } } = await supabase.auth.getSession();
        if (s) { setReady(true); return () => subscription.unsubscribe(); }
      }

      // Wait longer for token exchange
      setTimeout(async () => {
        const { data: { session: s } } = await supabase.auth.getSession();
        if (s) setReady(true);
        else setError('Invalid or expired recovery link. Please request a new one.');
      }, 8000);

      return () => subscription.unsubscribe();
    };

    handleRecovery();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) { setError('Passwords do not match'); setLoading(false); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) { setError(updateError.message); return; }
      setSuccess(true);
    } catch {
      setError('Error resetting password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#4ade80', marginBottom: '1rem' }}><CheckCircle size={48} /></div>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Password Changed! 🔐</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Your password has been reset successfully.</p>
            <Link href="/auth/login" className={styles.submitBtn}>
              Sign In <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!ready && !error) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div className={styles.spinner} style={{ width: 40, height: 40, margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-muted)' }}>Verifying recovery link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !ready) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#f87171', marginBottom: '1rem' }}><XCircle size={48} /></div>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Invalid Link</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
            <Link href="/auth/forgot-password" className={styles.submitBtn}>
              Request New Link <ArrowRight size={18} />
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
      </div>
    </div>
  );
}
