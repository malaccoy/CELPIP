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
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {verified && (
        <div className={styles.successMessage}>
          <span>✅</span>
          <span>Email verificado com sucesso! Faça login para continuar.</span>
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
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Senha</label>
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
          Esqueceu sua senha?
        </Link>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={18} className={styles.spinner} />
              Entrando...
            </>
          ) : (
            <>
              Entrar
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
          <h1>Entrar</h1>
          <p>Acesse sua conta no CELPIP Writing Coach</p>
        </div>

        <Suspense fallback={<div className={styles.loadingCard}><Loader2 size={32} className={styles.spinner} /></div>}>
          <LoginForm />
        </Suspense>

        <div className={styles.authFooter}>
          <p>
            Não tem uma conta?{' '}
            <Link href="/auth/register">Criar conta</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
