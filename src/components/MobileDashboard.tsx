'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Headphones, BookOpen, PenTool, Mic,
  ArrowRight, Sparkles, FileText, GraduationCap,
  Calculator, MessageCircle, Crown, Dumbbell
} from 'lucide-react';
import { useContentAccess } from '@/hooks/useContentAccess';

/* ─── Design Tokens (Duolingo-inspired dark) ─── */
const T = {
  bg: '#1b1f2a',
  surface: '#232733',
  red: '#ff3b3b',
  text: '#ffffff',
  textMuted: 'rgba(255,255,255,0.55)',
  textDim: 'rgba(255,255,255,0.3)',
  border: 'rgba(255,255,255,0.06)',
  green: '#22c55e',
  gold: '#fbbf24',
  purple: '#8b5cf6',
  blue: '#3b82f6',
  radius: 16,
};

/* ─── CSS Animations ─── */
const animStyles = `
@keyframes beaver-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
@keyframes fire-flicker {
  0%, 100% { transform: scale(1); opacity: 1; }
  25% { transform: scale(1.15) rotate(-5deg); opacity: 0.9; }
  50% { transform: scale(1.05) rotate(3deg); opacity: 1; }
  75% { transform: scale(1.2) rotate(-3deg); opacity: 0.85; }
}
@keyframes pulse-glow {
  0%, 100% { filter: drop-shadow(0 0 3px rgba(251,191,36,0.4)); }
  50% { filter: drop-shadow(0 0 8px rgba(251,191,36,0.8)); }
}
@keyframes zap-pulse {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 4px rgba(168,85,247,0.4)); }
  50% { transform: scale(1.15); filter: drop-shadow(0 0 10px rgba(168,85,247,0.8)); }
}
@keyframes medal-shine {
  0%, 100% { transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 3px rgba(34,197,94,0.3)); }
  50% { transform: scale(1.1) rotate(5deg); filter: drop-shadow(0 0 10px rgba(34,197,94,0.7)); }
}
`;

export default function MobileDashboard({ desktop }: { desktop?: boolean } = {}) {
  const router = useRouter();
  const { isPro } = useContentAccess();
  const [stats, setStats] = useState<any>(null);
  const [streakData, setStreakData] = useState<any>(null);
  const [dailyUsage, setDailyUsage] = useState<any>(null);
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Hide global header and sidebar only on mobile (keep BottomNav)
  useEffect(() => {
    if (desktop) return; // Desktop keeps header/sidebar
    const header = document.querySelector('header') as HTMLElement;
    const sidebar = document.querySelector('aside, [class*="sidebar"]') as HTMLElement;
    const fab = document.querySelector('[class*="fab"], [class*="FAB"]') as HTMLElement;
    const footer = document.querySelector('footer') as HTMLElement;
    const mainContainer = document.querySelector('[class*="container"]') as HTMLElement;
    const mainContent = document.querySelector('main') as HTMLElement;

    const els = [header, sidebar, fab, footer].filter(Boolean);
    els.forEach(el => { el.style.display = 'none'; });
    if (mainContainer) { mainContainer.style.padding = '0'; mainContainer.style.margin = '0'; }
    if (mainContent) { mainContent.style.padding = '0'; mainContent.style.margin = '0'; mainContent.style.maxWidth = '100%'; }

    return () => {
      els.forEach(el => { el.style.display = ''; });
      if (mainContainer) { mainContainer.style.padding = ''; mainContainer.style.margin = ''; }
      if (mainContent) { mainContent.style.padding = ''; mainContent.style.margin = ''; mainContent.style.maxWidth = ''; }
    };
  }, [desktop]);

  useEffect(() => {
    // Fetch real stats from server API
    fetch('/api/profile-stats').then(r => r.ok ? r.json() : null).then(d => {
      if (d?.skills) {
        setStats({
          listening: { sessions: d.skills.listening?.practices || 0 },
          reading: { sessions: d.skills.reading?.practices || 0 },
          writing: { sessions: d.skills.writing?.practices || 0 },
          speaking: { sessions: d.skills.speaking?.practices || 0 },
          totalPoints: d.totalPoints || 0,
        });
      }
    }).catch(() => {});
    fetch('/api/streak').then(r => r.ok ? r.json() : null).then(d => d && setStreakData(d)).catch(() => {});
    fetch('/api/daily-usage').then(r => r.ok ? r.json() : null).then(d => d && setDailyUsage(d)).catch(() => {});
    fetch('/api/plan').then(r => {
      if (!r.ok) { setIsLoggedIn(false); return null; }
      return r.json();
    }).then(d => {
      if (d) setIsLoggedIn(true);
    }).catch(() => setIsLoggedIn(false));

    // Get user info from Supabase session
    import('@/lib/supabase/client').then(({ createClient }) => {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }: any) => {
        const u = data?.user;
        if (u) {
          setIsLoggedIn(true);
          const meta = u.user_metadata || {};
          setUserName((meta.full_name || meta.name || u.email || '').split(' ')[0]);
          setUserImage(meta.avatar_url || meta.picture || '');
        }
      });
    });
  }, []);

  const listening = stats?.listening?.sessions || 0;
  const reading = stats?.reading?.sessions || 0;
  const writing = stats?.writing?.sessions || 0;
  const speaking = stats?.speaking?.sessions || 0;
  const streak = streakData?.currentStreak ?? 0;
  const longestStreak = streakData?.longestStreak ?? 0;
  const atRisk = streakData?.atRisk;
  const xp = stats?.totalPoints || (listening * 1 + reading * 1 + writing * 3 + speaking * 2);
  const league = xp >= 500 ? 'Diamond' : xp >= 200 ? 'Gold' : xp >= 50 ? 'Silver' : 'Bronze';
  const leagueEmoji = xp >= 500 ? '💎' : xp >= 200 ? '🥇' : xp >= 50 ? '🥈' : '🥉';
  const used = dailyUsage?.used ?? 0;
  const dailyLimit = dailyUsage?.limit ?? 3;

  return (
    <div style={{ background: T.bg, minHeight: '100vh', padding: desktop ? '1rem 2rem 2rem' : '0 0 100px 0', overscrollBehavior: 'none', maxWidth: desktop ? 900 : undefined, margin: desktop ? '0 auto' : undefined }}>
      <style>{animStyles}</style>

      {/* ─── Top Bar (mobile only) ─── */}
      {!desktop && (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', background: T.bg,
        position: 'sticky', top: 0, zIndex: 50,
        borderBottom: `1px solid ${T.border}`,
      }}>
        {/* Left: Maple leaf logo */}
        <div
          onClick={() => router.push('/dashboard')}
          style={{
            width: 44, height: 44,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <img
            src="/logo-leaf.png"
            alt="CELPIP"
            width={44}
            height={44}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Center: Stats */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          {/* Streak with glow + flicker */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            animation: 'pulse-glow 2s ease-in-out infinite',
          }}>
            <span style={{
              fontSize: '1.5rem',
              animation: 'fire-flicker 1.5s ease-in-out infinite',
              filter: 'drop-shadow(0 0 6px rgba(255,149,0,0.6))',
            }}>🔥</span>
            <span style={{
              color: T.gold, fontWeight: 800, fontSize: '1.15rem',
              textShadow: '0 0 8px rgba(255,149,0,0.4)',
            }}>{streak}</span>
          </div>
          {/* XP with electric pulse */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <span style={{
              fontSize: '1.5rem',
              filter: 'drop-shadow(0 0 6px rgba(168,85,247,0.6))',
              animation: 'zap-pulse 2s ease-in-out infinite',
            }}>⚡</span>
            <span style={{
              color: T.purple, fontWeight: 800, fontSize: '1.15rem',
              textShadow: '0 0 8px rgba(168,85,247,0.4)',
            }}>{xp}</span>
          </div>
          {/* League with shine */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <span style={{
              fontSize: '1.5rem',
              filter: 'drop-shadow(0 0 6px rgba(34,197,94,0.5))',
              animation: 'medal-shine 3s ease-in-out infinite',
            }}>{leagueEmoji}</span>
          </div>
        </div>

        {/* Right: Sign In button or User avatar */}
        {!isLoggedIn ? (
          <button
            onClick={() => router.push('/auth/login')}
            style={{
              background: T.red, color: '#fff', border: 'none',
              borderRadius: 20, padding: '8px 16px', fontWeight: 700,
              fontSize: '0.85rem', cursor: 'pointer', flexShrink: 0,
            }}
          >
            Sign In
          </button>
        ) : (
          <div
            onClick={() => router.push('/profile')}
            style={{
              width: 40, height: 40, borderRadius: '50%', overflow: 'hidden',
              cursor: 'pointer', flexShrink: 0,
              background: T.surface, border: `2px solid ${T.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: T.text, fontWeight: 700, fontSize: '0.9rem',
            }}
          >
            {userImage ? (
              <img src={userImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              userName ? userName.charAt(0).toUpperCase() : '👤'
            )}
          </div>
        )}
      </div>
      )}

      {/* ─── Desktop Welcome Header ─── */}
      {desktop && (
        <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ color: T.text, fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
              {userName ? `Welcome back, ${userName}! 👋` : 'Welcome! 👋'}
            </h1>
            <p style={{ color: T.textMuted, fontSize: '0.9rem', marginTop: 4 }}>
              {isPro ? '⭐ Pro Member' : 'Free Plan'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, animation: 'pulse-glow 2s ease-in-out infinite' }}>
              <span style={{ fontSize: '1.5rem', animation: 'fire-flicker 1.5s ease-in-out infinite', filter: 'drop-shadow(0 0 6px rgba(255,149,0,0.6))' }}>🔥</span>
              <span style={{ color: T.gold, fontWeight: 800, fontSize: '1.2rem', textShadow: '0 0 8px rgba(255,149,0,0.4)' }}>{streak}</span>
              <span style={{ color: T.textMuted, fontSize: '0.75rem' }}>streak</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '1.5rem', animation: 'zap-pulse 2s ease-in-out infinite', filter: 'drop-shadow(0 0 6px rgba(168,85,247,0.6))' }}>⚡</span>
              <span style={{ color: T.purple, fontWeight: 800, fontSize: '1.2rem', textShadow: '0 0 8px rgba(168,85,247,0.4)' }}>{xp}</span>
              <span style={{ color: T.textMuted, fontSize: '0.75rem' }}>XP</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '1.5rem', animation: 'medal-shine 3s ease-in-out infinite', filter: 'drop-shadow(0 0 6px rgba(34,197,94,0.5))' }}>{leagueEmoji}</span>
              <span style={{ color: T.green, fontWeight: 700, fontSize: '1rem' }}>{league}</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── Daily Usage (free only) ─── */}
      {!isPro && (
        <div style={{ padding: '10px 16px 0' }}>
          <div style={{
            background: T.surface, borderRadius: 12, padding: '10px 16px',
            border: `1px solid ${T.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.82rem', color: T.textMuted }}>Daily:</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {Array.from({ length: dailyLimit }).map((_, i) => (
                  <div key={i} style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: i < used ? T.red : 'rgba(255,255,255,0.15)',
                  }} />
                ))}
              </div>
              <span style={{ fontSize: '0.78rem', color: T.textMuted }}>{used}/{dailyLimit}</span>
              {used >= 3 && <RechargeTimer />}
            </div>
            <span onClick={() => router.push('/pricing')} style={{
              fontSize: '0.72rem', color: T.red, fontWeight: 700, cursor: 'pointer',
              background: 'rgba(255,59,59,0.1)', padding: '4px 10px', borderRadius: 12,
            }}>Upgrade →</span>
          </div>
        </div>
      )}

      {/* ─── Quick Access: 2 big + 3 small ─── */}
      <div style={{ padding: '16px 16px 0' }}>
        <h2 style={{ color: T.text, fontSize: '1.05rem', fontWeight: 700, margin: '0 0 12px' }}>
          Quick Access
        </h2>
        {/* 2 big cards */}
        <div style={{ display: 'grid', gridTemplateColumns: desktop ? '1fr 1fr 1fr 1fr' : '1fr 1fr', gap: desktop ? 16 : 10, marginBottom: desktop ? 16 : 10 }}>
          <BigCard
            icon={<IconCircle gradient={G.purple}><FileText size={22} /></IconCircle>}
            title="Mock Exams"
            subtitle="Full test sim"
            badge="PRO"
            badgeColor={T.purple}
            onClick={() => router.push('/mock-exam')}
          />
          <BigCard
            icon={<IconCircle gradient={G.amber}><Dumbbell size={22} /></IconCircle>}
            title="Drills"
            subtitle="Speaking practice"
            badge="NEW"
            badgeColor={T.green}
            onClick={() => router.push('/drills')}
          />
        </div>
        {/* 3 small cards */}
        <div style={{ display: 'grid', gridTemplateColumns: desktop ? '1fr 1fr 1fr' : '1fr 1fr 1fr', gap: desktop ? 16 : 10 }}>
          <SmallCard icon={<IconCircle gradient={G.green} size={36}><GraduationCap size={18} /></IconCircle>} title="Guides" badge="PRO" badgeColor={T.purple} onClick={() => router.push('/guides')} />
          <SmallCard icon={<IconCircle gradient={G.cyan} size={36}><Calculator size={18} /></IconCircle>} title="CRS Calc" onClick={() => router.push('/tools/score-calculator')} />
          <SmallCard icon={<IconCircle gradient={G.slate} size={36}><MessageCircle size={18} /></IconCircle>} title="Community" onClick={() => window.open('https://t.me/+YcO9MfUHIjQyYjAx', '_blank')} />
        </div>
      </div>

      {/* ─── Practice by Skill ─── */}
      <div style={{ padding: '20px 16px 0' }}>
        <h2 style={{ color: T.text, fontSize: '1.05rem', fontWeight: 700, margin: '0 0 12px' }}>
          Practice by Skill
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: desktop ? '1fr 1fr 1fr 1fr' : '1fr 1fr', gap: desktop ? 16 : 10 }}>
          {[
            { icon: <Headphones size={20} />, title: 'Listening', gradient: G.blue, sessions: listening, href: '/ai-coach?skill=listening' },
            { icon: <BookOpen size={20} />, title: 'Reading', gradient: G.green, sessions: reading, href: '/ai-coach?skill=reading' },
            { icon: <PenTool size={20} />, title: 'Writing', gradient: G.amber, sessions: writing, href: '/ai-coach?skill=writing' },
            { icon: <Mic size={20} />, title: 'Speaking', gradient: G.red, sessions: speaking, href: '/ai-coach?skill=speaking' },
          ].map(s => (
            <div key={s.title} onClick={() => window.location.href = s.href} style={{
              background: T.surface, borderRadius: T.radius, padding: '16px 14px',
              cursor: 'pointer', border: `1px solid ${T.border}`,
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            >
              <div style={{ marginBottom: 8 }}><IconCircle gradient={s.gradient} size={40}>{s.icon}</IconCircle></div>
              <div style={{ color: T.text, fontWeight: 600, fontSize: '0.9rem' }}>{s.title}</div>
              <div style={{ color: T.textMuted, fontSize: '0.72rem', marginTop: 3 }}>
                {s.sessions} exercise{s.sessions !== 1 ? 's' : ''} done
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Your Progress ─── */}
      <div style={{ padding: '20px 16px 0' }}>
        <h2 style={{ color: T.text, fontSize: '1.05rem', fontWeight: 700, margin: '0 0 12px' }}>
          Your Progress
        </h2>
        <div style={{
          background: T.surface, borderRadius: T.radius,
          padding: '14px', display: 'flex', flexDirection: 'column' as const, gap: 12,
          border: `1px solid ${T.border}`,
        }}>
          {[
            { label: 'Listening', lucide: <Headphones size={14} />, color: '#3b82f6', sessions: listening },
            { label: 'Reading', lucide: <BookOpen size={14} />, color: '#22c55e', sessions: reading },
            { label: 'Writing', lucide: <PenTool size={14} />, color: '#f59e0b', sessions: writing },
            { label: 'Speaking', lucide: <Mic size={14} />, color: '#ef4444', sessions: speaking },
          ].map(p => {
            const pct = Math.min(100, Math.round((p.sessions / 50) * 100));
            return (
              <div key={p.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ color: T.text, fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: p.color, display: 'flex' }}>{p.lucide}</span> {p.label}
                  </span>
                  <span style={{ color: T.textMuted, fontSize: '0.75rem' }}>{p.sessions}</span>
                </div>
                <div style={{
                  height: 7, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', width: `${pct}%`, background: p.color,
                    borderRadius: 4, transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Upgrade Banner (free only) ─── */}
      {!isPro && (
        <div style={{ padding: '20px 16px 0' }}>
          <div onClick={() => router.push('/pricing')} style={{
            background: `linear-gradient(135deg, ${T.red}, #dc2626)`,
            borderRadius: T.radius, padding: '18px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>
                <Crown size={16} style={{ display: 'inline' }} /> Upgrade to Pro
              </div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.78rem', marginTop: 3 }}>
                Unlimited practice, mock exams & more
              </div>
            </div>
            <ArrowRight size={20} color="#fff" />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Sub Components ─── */

// Premium icon circle with gradient
function IconCircle({ children, gradient, size = 44 }: { children: React.ReactNode; gradient: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.3,
      background: gradient,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', flexShrink: 0,
      boxShadow: `0 4px 12px ${gradient.includes('#3b82f6') ? 'rgba(59,130,246,0.3)' : gradient.includes('#22c55e') ? 'rgba(34,197,94,0.3)' : gradient.includes('#f59e0b') ? 'rgba(245,158,11,0.3)' : gradient.includes('#ef4444') ? 'rgba(239,68,68,0.3)' : gradient.includes('#8b5cf6') ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.1)'}`,
    }}>
      {children}
    </div>
  );
}

const G = {
  blue: 'linear-gradient(135deg, #3b82f6, #2563eb)',
  green: 'linear-gradient(135deg, #22c55e, #16a34a)',
  amber: 'linear-gradient(135deg, #f59e0b, #d97706)',
  red: 'linear-gradient(135deg, #ef4444, #dc2626)',
  purple: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  cyan: 'linear-gradient(135deg, #06b6d4, #0891b2)',
  slate: 'linear-gradient(135deg, #64748b, #475569)',
};

function BigCard({ icon, title, subtitle, badge, badgeColor, onClick }: {
  icon: React.ReactNode; title: string; subtitle: string; badge?: string; badgeColor?: string; onClick: () => void;
}) {
  return (
    <div onClick={onClick} style={{
      background: T.surface, borderRadius: T.radius, padding: '18px 14px',
      cursor: 'pointer', position: 'relative' as const,
      border: `1px solid ${T.border}`,
      transition: 'transform 0.15s, box-shadow 0.15s',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
    >
      <div style={{ marginBottom: 10 }}>{icon}</div>
      <div style={{ color: T.text, fontWeight: 700, fontSize: '0.95rem' }}>{title}</div>
      <div style={{ color: T.textMuted, fontSize: '0.7rem', marginTop: 2 }}>{subtitle}</div>
      {badge && (
        <div style={{
          position: 'absolute' as const, top: 10, right: 10,
          background: badgeColor || T.green, color: '#fff',
          fontSize: '0.58rem', fontWeight: 800, padding: '3px 8px',
          borderRadius: 6, textTransform: 'uppercase' as const, letterSpacing: '0.5px',
        }}>{badge}</div>
      )}
    </div>
  );
}

function RechargeTimer() {
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    const calc = () => {
      const now = new Date();
      // Midnight PST = 08:00 UTC
      const utcH = now.getUTCHours();
      let hoursLeft = utcH < 8 ? 8 - utcH : 32 - utcH;
      const minsLeft = 60 - now.getUTCMinutes();
      if (minsLeft < 60) hoursLeft--;
      setTimeLeft(`${hoursLeft}h ${minsLeft === 60 ? 0 : minsLeft}m`);
    };
    calc();
    const t = setInterval(calc, 60000);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>
      ⏱ {timeLeft}
    </span>
  );
}

function SmallCard({ icon, title, badge, badgeColor, onClick }: {
  icon: React.ReactNode; title: string; badge?: string; badgeColor?: string; onClick: () => void;
}) {
  return (
    <div onClick={onClick} style={{
      background: T.surface, borderRadius: 12, padding: '14px 10px',
      cursor: 'pointer', textAlign: 'center' as const,
      border: `1px solid ${T.border}`, position: 'relative' as const,
      transition: 'transform 0.15s, box-shadow 0.15s',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
    >
      {badge && (
        <div style={{
          position: 'absolute' as const, top: 6, right: 6,
          background: badgeColor || T.purple, color: '#fff',
          fontSize: '0.5rem', fontWeight: 800, padding: '2px 6px',
          borderRadius: 5, textTransform: 'uppercase' as const,
        }}>{badge}</div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>{icon}</div>
      <div style={{ color: T.text, fontWeight: 600, fontSize: '0.78rem' }}>{title}</div>
    </div>
  );
}
