'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [router]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <h1 style={{
        fontSize: '4rem',
        fontWeight: 800,
        color: '#ff3b3b',
        marginBottom: '0.5rem',
        fontFamily: 'Space Grotesk, sans-serif',
      }}>404</h1>
      <h2 style={{
        fontSize: '1.5rem',
        color: '#f1f5f9',
        marginBottom: '0.75rem',
        fontFamily: 'Space Grotesk, sans-serif',
      }}>Page Not Found</h2>
      <p style={{
        color: '#94a3b8',
        marginBottom: '0.5rem',
        maxWidth: '400px',
        lineHeight: 1.5,
      }}>
        This page doesn&apos;t exist. But your CELPIP score can still exist at CLB 9+.
      </p>
      <p style={{
        color: '#64748b',
        fontSize: '0.85rem',
        marginBottom: '2rem',
      }}>
        Redirecting to home in {countdown}s...
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" style={{
          padding: '0.75rem 1.5rem',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #6366f1, #818cf8)',
          color: 'white',
          fontWeight: 700,
          textDecoration: 'none',
        }}>Go Home Now</Link>
        <Link href="/blog" style={{
          padding: '0.75rem 1.5rem',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#cbd5e1',
          fontWeight: 600,
          textDecoration: 'none',
        }}>Read Blog</Link>
      </div>
    </div>
  );
}
