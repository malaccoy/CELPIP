'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import NotificationBell from '@/components/NotificationBell';

const RiveIcon = dynamic(() => import('@/components/RiveIcon'), { ssr: false });
const LottieIcon = dynamic(() => import('lottie-react').then(m => {
  const Lottie = m.default;
  return { default: ({ src, size }: { src: string; size: number }) => {
    const [data, setData] = React.useState<any>(null);
    React.useEffect(() => { fetch(src).then(r => r.json()).then(setData).catch(() => {}); }, [src]);
    if (!data) return <div style={{ width: size, height: size }} />;
    return <Lottie animationData={data} loop autoplay style={{ width: size, height: size }} />;
  }};
}), { ssr: false });

const T = {
  bg: '#1b1f2a',
  surface: '#232733',
  red: '#ff3b3b',
  text: '#ffffff',
  textMuted: 'rgba(255,255,255,0.55)',
  border: 'rgba(255,255,255,0.06)',
  green: '#22c55e',
  gold: '#fbbf24',
  purple: '#8b5cf6',
};

const animStyles = `
@keyframes fire-flicker-tb {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15) rotate(-3deg); }
}
@keyframes pulse-glow-tb {
  0%, 100% { filter: drop-shadow(0 0 2px rgba(251,191,36,0.3)); }
  50% { filter: drop-shadow(0 0 6px rgba(251,191,36,0.7)); }
}
`;

export default function MobileTopBar() {
  const router = useRouter();
  const { displayName, avatarUrl, isLoggedIn } = useCurrentUser();
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const userName = displayName.split(' ')[0];
  const userImage = avatarUrl || '';

  useEffect(() => {
    // Stats from server API
    fetch('/api/profile-stats').then(r => r.ok ? r.json() : null).then(d => {
      if (d?.totalPoints) setXp(d.totalPoints);
    }).catch(() => {});
    fetch('/api/streak', { credentials: 'include' }).then(r => r.ok ? r.json() : null).then(d => d && setStreak(d.currentStreak ?? 0)).catch(() => {});
  }, []);

  const league = xp >= 500 ? 'Diamond' : xp >= 200 ? 'Gold' : xp >= 50 ? 'Silver' : 'Bronze';
  const leagueEmoji = xp >= 500 ? '💎' : xp >= 200 ? '🥇' : xp >= 50 ? '🥈' : '🥉';

  return (
    <>
      <style>{animStyles}</style>
      <div id="mobile-top-bar" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', background: T.bg,
        borderBottom: `1px solid ${T.border}`,
      }}>
        <div
          onClick={() => router.push('/map')}
          style={{ width: 52, height: 52, cursor: 'pointer', flexShrink: 0 }}
        >
          <Image src="/logo-leaf.png" alt="CELPIP" width={52} height={52}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <LottieIcon src="/lottie/fire.json" size={34} />
            <span style={{ color: T.gold, fontWeight: 800, fontSize: '1.35rem' }}>{streak}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <RiveIcon artboard="03_Flash" size={34} />
            <span style={{ color: T.purple, fontWeight: 800, fontSize: '1.35rem' }}>{xp}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <RiveIcon artboard="21_Crown" size={34} />
            <span style={{ color: T.green, fontWeight: 700, fontSize: '1rem' }}>{league}</span>
          </div>
        </div>

        {!isLoggedIn ? (
          <button onClick={() => router.push('/auth/login')} style={{
            background: T.red, color: '#fff', border: 'none', borderRadius: 20,
            padding: '8px 16px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', flexShrink: 0,
          }}>Sign In</button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <NotificationBell />
            <div onClick={() => router.push('/profile')} style={{
            width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', cursor: 'pointer', flexShrink: 0,
            background: T.surface, border: `2px solid ${T.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: T.text, fontWeight: 700, fontSize: '0.9rem',
          }}>
            {userImage ? (
              <Image src={userImage} alt="" width={32} height={32} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : userName ? userName.charAt(0).toUpperCase() : '👤'}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
