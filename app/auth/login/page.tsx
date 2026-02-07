'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import styles from '@/styles/Auth.module.scss';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const verified = searchParams.get('verified');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError('Error signing in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {verified && (
        <div className={styles.successMessage}>
          <span>✅</span>
          <span>Email verified successfully! Sign in to continue.</span>
        </div>
      )}

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

        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <div className={styles.inputWrapper}>
            <Lock size={18} />
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        <Link href="/auth/forgot-password" className={styles.forgotLink}>
          Forgot your password?
        </Link>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={18} className={styles.spinner} />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1>Sign In</h1>
          <p>Access your CELPIP Coach account</p>
        </div>

        <Suspense fallback={<div className={styles.loadingCard}><Loader2 size={32} className={styles.spinner} /></div>}>
          <LoginForm />
        </Suspense>

        <div className={styles.authFooter}>
          <p>
            Don't have an account?{' '}
            <Link href="/auth/register">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
