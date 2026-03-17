'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

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
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    // Stats from server API
    fetch('/api/profile-stats').then(r => r.ok ? r.json() : null).then(d => {
      if (d?.totalPoints) setXp(d.totalPoints);
    }).catch(() => {});
    fetch('/api/streak', { credentials: 'include' }).then(r => r.ok ? r.json() : null).then(d => d && setStreak(d.currentStreak ?? 0)).catch(() => {});
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }: any) => {
      const u = data?.user;
      if (u) {
        setIsLoggedIn(true);
        const meta = u.user_metadata || {};
        setUserName((meta.full_name || meta.name || u.email || '').split(' ')[0]);
        setUserImage(meta.avatar_url || meta.picture || '');
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  const league = xp >= 500 ? 'Diamond' : xp >= 200 ? 'Gold' : xp >= 50 ? 'Silver' : 'Bronze';
  const leagueEmoji = xp >= 500 ? '💎' : xp >= 200 ? '🥇' : xp >= 50 ? '🥈' : '🥉';

  return (
    <>
      <style>{animStyles}</style>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', background: T.bg,
        borderBottom: `1px solid ${T.border}`,
      }}>
        <div
          onClick={() => router.push('/dashboard')}
          style={{ width: 44, height: 44, cursor: 'pointer', flexShrink: 0 }}
        >
          <img src="/logo-leaf.png" alt="CELPIP" width={44} height={44}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, animation: 'pulse-glow-tb 2s ease-in-out infinite' }}>
            <span style={{ fontSize: '1.5rem', animation: 'fire-flicker-tb 1.5s ease-in-out infinite' }}>🔥</span>
            <span style={{ color: T.gold, fontWeight: 800, fontSize: '1.15rem' }}>{streak}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: '1.5rem' }}>⚡</span>
            <span style={{ color: T.purple, fontWeight: 800, fontSize: '1.15rem' }}>{xp}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: '1.5rem' }}>{leagueEmoji}</span>
            <span style={{ color: T.green, fontWeight: 700, fontSize: '1rem' }}>{league}</span>
          </div>
        </div>

        {!isLoggedIn ? (
          <button onClick={() => router.push('/auth/login')} style={{
            background: T.red, color: '#fff', border: 'none', borderRadius: 20,
            padding: '8px 16px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', flexShrink: 0,
          }}>Sign In</button>
        ) : (
          <div onClick={() => router.push('/profile')} style={{
            width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', cursor: 'pointer', flexShrink: 0,
            background: T.surface, border: `2px solid ${T.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: T.text, fontWeight: 700, fontSize: '0.9rem',
          }}>
            {userImage ? (
              <img src={userImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : userName ? userName.charAt(0).toUpperCase() : '👤'}
          </div>
        )}
      </div>
    </>
  );
}
