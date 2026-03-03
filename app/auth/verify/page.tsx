'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import styles from '@/styles/Auth.module.scss';

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();
        if (!res.ok) { setStatus('error'); setMessage(data.error || 'Error verifying email.'); return; }
        setStatus('success');
        setMessage(data.message);
      } catch {
        setStatus('error');
        setMessage('Error verifying email. Please try again.');
      }
    };

    verifyEmail();
  }, [token]);

  if (status === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <div className={styles.spinner} style={{ width: 40, height: 40, margin: '0 auto 1rem' }} />
        <h2 style={{ color: 'var(--text-primary)' }}>Verifying your email...</h2>
        <p style={{ color: 'var(--text-muted)' }}>Please wait.</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#4ade80', marginBottom: '1rem' }}><CheckCircle size={48} /></div>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Email Verified! 🎉</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{message}</p>
        <Link href="/auth/login?verified=true" className={styles.submitBtn}>
          Go to Login <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ color: '#f87171', marginBottom: '1rem' }}><XCircle size={48} /></div>
      <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Something went wrong</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{message}</p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/auth/register" className={styles.googleBtn}>Create new account</Link>
        <Link href="/auth/login" className={styles.submitBtn}>Go to Login <ArrowRight size={18} /></Link>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Suspense fallback={
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div className={styles.spinner} style={{ width: 40, height: 40, margin: '0 auto 1rem' }} />
            <h2 style={{ color: 'var(--text-primary)' }}>Verifying...</h2>
          </div>
        }>
          <VerifyContent />
        </Suspense>
      </div>
    </div>
  );
}
