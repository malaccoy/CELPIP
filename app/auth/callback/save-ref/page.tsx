'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SaveRefInner() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = localStorage.getItem('signup_ref');
    const referralCode = localStorage.getItem('referral_code');
    const next = searchParams.get('next') || '/map';

    if (ref || referralCode) {
      // Fire-and-forget: save ref + referral code to user record
      fetch('/api/save-referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ref, referralCode }),
      }).catch(() => {});
      localStorage.removeItem('signup_ref');
      localStorage.removeItem('referral_code');
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
