'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ReferralPage() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const code = params.code as string;
    if (code) {
      localStorage.setItem('referral_code', code.toUpperCase());
    }
    router.replace('/auth/register?ref=referral');
  }, [params.code, router]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f1117', color: '#fff' }}>
      <p>Redirecting...</p>
    </div>
  );
}
