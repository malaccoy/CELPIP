'use client';

import { useRouter } from 'next/navigation';

export default function AuthGate({ message }: { message?: string }) {
  const router = useRouter();

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        background: '#1a1a2e', borderRadius: 20, padding: '32px 24px',
        maxWidth: 360, width: '100%', textAlign: 'center',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔒</div>
        <h2 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 800, margin: '0 0 8px' }}>
          Create Your Free Account
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5, margin: '0 0 24px' }}>
          {message || 'Sign up to start practicing — it\'s free! Track your progress and get AI feedback.'}
        </p>
        <button
          onClick={() => router.push('/auth/register')}
          style={{
            width: '100%', padding: '14px', borderRadius: 12,
            background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
            color: '#fff', fontWeight: 700, fontSize: '1rem', border: 'none', cursor: 'pointer',
            marginBottom: 10,
          }}
        >
          Sign Up Free
        </button>
        <button
          onClick={() => router.push('/auth/login')}
          style={{
            width: '100%', padding: '12px', borderRadius: 12,
            background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
            color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
          }}
        >
          Already have an account? Log in
        </button>
      </div>
    </div>
  );
}
