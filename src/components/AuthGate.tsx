'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthGate({ message }: { message?: string }) {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth/register');
  }, [router]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#0f1117',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <p style={{ color: '#888' }}>Redirecting to sign up...</p>
    </div>
  );
}
