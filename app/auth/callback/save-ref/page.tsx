'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SaveRefInner() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = localStorage.getItem('signup_ref');
    const next = searchParams.get('next') || '/dashboard';

    if (ref) {
      // Fire-and-forget: save ref to user record
      fetch('/api/save-referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ref }),
      }).catch(() => {});
      localStorage.removeItem('signup_ref');
    }

    // Redirect to destination
    window.location.href = next;
  }, [searchParams]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#1e1e2e', color: '#fff' }}>
      <p>Redirecting...</p>
    </div>
  );
}

export default function SaveRefPage() {
  return (
    <Suspense fallback={<div style={{ background: '#1e1e2e', minHeight: '100vh' }} />}>
      <SaveRefInner />
    </Suspense>
  );
}
