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
      setMessage('Link de verificação inválido.');
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

        if (!res.ok) {
          setStatus('error');
          setMessage(data.error || 'Erro ao verificar email.');
          return;
        }

        setStatus('success');
        setMessage(data.message);
      } catch {
        setStatus('error');
        setMessage('Erro ao verificar email. Tente novamente.');
      }
    };

    verifyEmail();
  }, [token]);

  if (status === 'loading') {
    return (
      <div className={styles.loadingCard}>
        <Loader2 size={48} className={styles.spinner} />
        <h2>Verificando seu email...</h2>
        <p>Aguarde um momento.</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className={styles.successCard}>
        <div className={styles.successIcon}>
          <CheckCircle size={48} />
        </div>
        <h2>Email Verificado! 🎉</h2>
        <p>{message}</p>
        <Link href="/auth/login?verified=true" className={styles.submitButton}>
          Fazer Login
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.errorCard}>
      <div className={styles.errorIcon}>
        <XCircle size={48} />
      </div>
      <h2>Ops! Algo deu errado</h2>
      <p>{message}</p>
      <div className={styles.errorActions}>
        <Link href="/auth/register" className={styles.secondaryButton}>
          Criar nova conta
        </Link>
        <Link href="/auth/login" className={styles.submitButton}>
          Ir para Login
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <Suspense fallback={
          <div className={styles.loadingCard}>
            <Loader2 size={48} className={styles.spinner} />
            <h2>Verificando...</h2>
          </div>
        }>
          <VerifyContent />
        </Suspense>
      </div>
    </div>
  );
}
