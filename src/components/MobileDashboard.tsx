'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Headphones, BookOpen, PenTool, Mic,
  ArrowRight, Sparkles, FileText, GraduationCap,
  Calculator, MessageCircle, Crown, Dumbbell, ChevronRight, Swords
} from 'lucide-react';
import { useContentAccess } from '@/hooks/useContentAccess';
import NotificationBell from '@/components/NotificationBell';

/* ─── Design Tokens ─── */
const T = {
  bg: '#0f1117',
  surface: '#1a1d27',
  surfaceHover: '#1f2231',
  card: '#181b24',
  text: '#f1f5f9',
  textSecondary: 'rgba(255,255,255,0.6)',
  textMuted: 'rgba(255,255,255,0.35)',
  border: 'rgba(255,255,255,0.06)',
  borderLight: 'rgba(255,255,255,0.08)',
  accent: '#ff3b3b',
  gold: '#fbbf24',
  purple: '#a78bfa',
  blue: '#60a5fa',
  green: '#34d399',
  orange: '#fb923c',
  red: '#f87171',
  radius: 14,
};

const G = {
  blue: 'linear-gradient(135deg, #3b82f6, #6366f1)',
  green: 'linear-gradient(135deg, #22c55e, #10b981)',
  amber: 'linear-gradient(135deg, #f59e0b, #ef4444)',
  red: 'linear-gradient(135deg, #ef4444, #dc2626)',
  purple: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
  cyan: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
  slate: 'linear-gradient(135deg, #475569, #334155)',
};

export default function MobileDashboard({ desktop }: { desktop?: boolean } = {}) {
  const router = useRouter();
  const { isPro } = useContentAccess();
  const [stats, setStats] = useState<any>(null);
  const [streakData, setStreakData] = useState<any>(null);
  const [dailyUsage, setDailyUsage] = useState<any>(null);
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [myRank, setMyRank] = useState<number | null>(null);

  useEffect(() => {
    if (desktop) return;
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
    fetch('/api/rankings').then(r => r.ok ? r.json() : null).then(d => {
      if (d?.myRank) setMyRank(d.myRank);
      else if (Array.isArray(d)) {
        const me = d.find((e: any) => e.isCurrentUser);
        if (me) setMyRank(me.rank);
      }
    }).catch(() => {});
    fetch('/api/plan').then(r => { if (!r.ok) { setIsLoggedIn(false); return null; } return r.json(); })
      .then(d => { if (d) setIsLoggedIn(true); }).catch(() => setIsLoggedIn(false));

    import('@/lib/supabase/client').then(({ createClient }) => {
      const supabase = createClient();
      const loadUser = (u: any) => {
        if (u) {
          setIsLoggedIn(true);
          const meta = u.user_metadata || {};
          setUserName((meta.full_name || meta.name || u.email || '').split(' ')[0]);
          setUserImage(meta.avatar_url || meta.picture || '');
        }
      };
      supabase.auth.getUser().then(({ data }: any) => loadUser(data?.user));
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
        if (session?.user) loadUser(session.user);
        else { setIsLoggedIn(false); setUserName(''); setUserImage(''); }
      });
      return () => subscription?.unsubscribe();
    });
  }, []);

  const listening = stats?.listening?.sessions || 0;
  const reading = stats?.reading?.sessions || 0;
  const writing = stats?.writing?.sessions || 0;
  const speaking = stats?.speaking?.sessions || 0;
  const streak = streakData?.currentStreak ?? 0;
  const atRisk = streakData?.atRisk;
  const xp = stats?.totalPoints || (listening * 1 + reading * 1 + writing * 3 + speaking * 2);
  const used = dailyUsage?.used ?? 0;
  const dailyLimit = dailyUsage?.limit ?? 3;

  const greeting = () => {
    const h = new Date().getUTCHours() - 3; // approx BRT/PST display
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div style={{ background: T.bg, minHeight: '100vh', padding: desktop ? '1rem 2rem 2rem' : '0 0 100px 0', maxWidth: desktop ? 900 : undefined, margin: desktop ? '0 auto' : undefined }}>

      {/* ─── Top Bar ─── */}
      {!desktop && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 16px', background: T.bg,
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <div onClick={() => router.push('/dashboard')} style={{ cursor: 'pointer', flexShrink: 0 }}>
            <img src="/logo-leaf.png" alt="CELPIP" width={40} height={40} style={{ width: 40, height: 40, objectFit: 'contain' }} />
          </div>

          {/* Stats chips */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <StatChip emoji="🔥" value={streak} color={T.gold} glow="rgba(251,191,36,0.3)" />
            <StatChip emoji="⚡" value={xp} color={T.purple} glow="rgba(167,139,250,0.3)" />
            <div onClick={() => router.push('/rankings')} style={{ cursor: 'pointer' }}>
              <StatChip
                emoji={myRank === 1 ? '🥇' : myRank === 2 ? '🥈' : myRank === 3 ? '🥉' : '🏆'}
                value={myRank ? `#${myRank}` : '—'}
                color={T.green}
                glow="rgba(52,211,153,0.3)"
              />
            </div>
          </div>

          {/* Right */}
          {!isLoggedIn ? (
            <button onClick={() => router.push('/auth/login')} style={{
              background: T.accent, color: '#fff', border: 'none',
              borderRadius: 20, padding: '8px 16px', fontWeight: 700,
              fontSize: '0.8rem', cursor: 'pointer', flexShrink: 0,
            }}>Sign In</button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <NotificationBell />
              <div onClick={() => router.push('/profile')} style={{
                width: 36, height: 36, borderRadius: '50%', overflow: 'hidden',
                cursor: 'pointer', flexShrink: 0,
                background: T.surface, border: `2px solid ${T.borderLight}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: T.text, fontWeight: 700, fontSize: '0.85rem',
              }}>
                {userImage ? (
                  <img src={userImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (userName ? userName.charAt(0).toUpperCase() : '👤')}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── Greeting ─── */}
      <div style={{ padding: desktop ? '0 0 16px' : '16px 20px 12px' }}>
        <h1 style={{ color: T.text, fontSize: '1.4rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
          {greeting()}{userName ? `, ${userName}` : ''} 👋
        </h1>
        <p style={{ color: T.textSecondary, fontSize: '0.82rem', margin: '4px 0 0', fontWeight: 500 }}>
          {isPro ? '⭐ Pro Member' : streak > 0 ? `${streak} day streak${atRisk ? ' — practice today!' : '! Keep going 🔥'}` : 'Start your first practice today'}
        </p>
      </div>

      {/* ─── Daily Usage (free only) ─── */}
      {!isPro && (
        <div style={{ padding: '0 20px 12px' }}>
          <div style={{
            background: T.surface, borderRadius: 12, padding: '10px 14px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            border: `1px solid ${T.border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.78rem', color: T.textSecondary, fontWeight: 600 }}>Today</span>
              <div style={{ display: 'flex', gap: 3 }}>
                {Array.from({ length: dailyLimit }).map((_, i) => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: i < used ? T.accent : 'rgba(255,255,255,0.12)',
                    transition: 'background 0.2s',
                  }} />
                ))}
              </div>
              <span style={{ fontSize: '0.72rem', color: T.textMuted }}>{used}/{dailyLimit}</span>
              {used >= dailyLimit && <RechargeTimer />}
            </div>
            <span onClick={() => router.push('/pricing')} style={{
              fontSize: '0.7rem', color: T.accent, fontWeight: 700, cursor: 'pointer',
              padding: '3px 10px', borderRadius: 10,
              background: 'rgba(255,59,59,0.08)',
            }}>Upgrade</span>
          </div>
        </div>
      )}

      {/* ─── Main Action: Practice ─── */}
      <div style={{ padding: '0 20px 16px' }}>
        <div onClick={() => router.push('/drills')} style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
          borderRadius: T.radius, padding: '20px',
          cursor: 'pointer', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: -30, right: 30, width: 80, height: 80, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Sparkles size={22} color="#fff" />
              <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>Start Practice</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.78rem', margin: 0, lineHeight: 1.4 }}>
              Speaking, Writing, Listening & Reading drills
            </p>
          </div>
          <ArrowRight size={20} color="rgba(255,255,255,0.6)" style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        {/* Battle Mode */}
        <div onClick={() => router.push('/battle')} style={{
          background: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
          borderRadius: T.radius, padding: '16px 20px', marginTop: 10,
          cursor: 'pointer', position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: 10, display: 'flex' }}>
            <Swords size={22} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>⚔️ Battle Mode</span>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.75rem', margin: '2px 0 0' }}>Challenge other students in real-time PvP!</p>
          </div>
          <ArrowRight size={18} color="rgba(255,255,255,0.6)" />
        </div>
      </div>

      {/* ─── Practice by Skill ─── */}
      <div style={{ padding: '0 20px 16px' }}>
        <SectionTitle>Practice by Skill</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { icon: <Headphones size={20} />, title: 'Listening', gradient: G.blue, color: '#60a5fa', sessions: listening, href: '/ai-coach?skill=listening' },
            { icon: <BookOpen size={20} />, title: 'Reading', gradient: G.green, color: '#34d399', sessions: reading, href: '/ai-coach?skill=reading' },
            { icon: <PenTool size={20} />, title: 'Writing', gradient: G.amber, color: '#fbbf24', sessions: writing, href: '/ai-coach?skill=writing' },
            { icon: <Mic size={20} />, title: 'Speaking', gradient: G.red, color: '#f87171', sessions: speaking, href: '/ai-coach?skill=speaking' },
          ].map(s => (
            <div key={s.title} onClick={() => window.location.href = s.href} style={{
              background: T.surface, borderRadius: T.radius, padding: '16px',
              cursor: 'pointer', border: `1px solid ${T.border}`,
              transition: 'all 0.15s ease',
            }}>
              <IconCircle gradient={s.gradient} size={40}>{s.icon}</IconCircle>
              <div style={{ color: T.text, fontWeight: 700, fontSize: '0.88rem', marginTop: 10 }}>{s.title}</div>
              <div style={{ color: T.textMuted, fontSize: '0.7rem', marginTop: 2 }}>
                {s.sessions} exercise{s.sessions !== 1 ? 's' : ''} done
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Quick Access ─── */}
      <div style={{ padding: '0 20px 16px' }}>
        <SectionTitle>Quick Access</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: T.surface, borderRadius: T.radius, overflow: 'hidden', border: `1px solid ${T.border}` }}>
          <QuickLink icon={<FileText size={18} />} gradient={G.purple} label="Mock Exams" sub="Full test simulation" badge={!isPro ? 'PRO' : undefined} onClick={() => router.push('/mock-exam')} />
          <QuickLink icon={<GraduationCap size={18} />} gradient={G.green} label="Study Guides" sub="Techniques & strategies" badge={!isPro ? 'PRO' : undefined} onClick={() => router.push('/guides')} />
          <QuickLink icon={<Calculator size={18} />} gradient={G.cyan} label="CRS Calculator" sub="Check your score" onClick={() => router.push('/tools/score-calculator')} />
          <QuickLink icon={<MessageCircle size={18} />} gradient={G.slate} label="Community" sub="Join 200+ learners" onClick={() => window.open('https://t.me/+YcO9MfUHIjQyYjAx', '_blank')} last />
        </div>
      </div>

      {/* ─── Your Progress ─── */}
      <div style={{ padding: '0 20px 16px' }}>
        <SectionTitle>Your Progress</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Listening', emoji: '🎧', color: '#60a5fa', glow: 'rgba(96,165,250,0.12)', sessions: listening, path: '/drills/listening' },
            { label: 'Reading', emoji: '📖', color: '#34d399', glow: 'rgba(52,211,153,0.12)', sessions: reading, path: '/drills/reading' },
            { label: 'Writing', emoji: '✍️', color: '#fbbf24', glow: 'rgba(251,191,36,0.12)', sessions: writing, path: '/drills/writing' },
            { label: 'Speaking', emoji: '🎤', color: '#f87171', glow: 'rgba(248,113,113,0.12)', sessions: speaking, path: '/drills/speaking' },
          ].map(p => {
            // Level system: 0-10 → Lvl 1, 11-25 → Lvl 2, 26-50 → Lvl 3, 51-100 → Lvl 4, 101-200 → Lvl 5, 200+ → Lvl 6+
            const LEVELS = [0, 10, 25, 50, 100, 200, 350, 550, 800, 1100];
            let lvl = 1;
            for (let i = 1; i < LEVELS.length; i++) { if (p.sessions >= LEVELS[i]) lvl = i + 1; else break; }
            const lvlFloor = LEVELS[lvl - 1] || 0;
            const lvlCeil = LEVELS[lvl] || lvlFloor + 200;
            const inLvl = p.sessions - lvlFloor;
            const needed = lvlCeil - lvlFloor;
            const pct = Math.min(100, Math.round((inLvl / needed) * 100));
            const stars = lvl >= 5 ? '⭐⭐⭐' : lvl >= 3 ? '⭐⭐' : lvl >= 2 ? '⭐' : '';
            const tierLabel = lvl >= 6 ? 'Master' : lvl >= 4 ? 'Advanced' : lvl >= 3 ? 'Intermediate' : lvl >= 2 ? 'Beginner' : 'Starter';

            return (
              <div key={p.label} onClick={() => router.push(p.path)} style={{
                background: T.surface, borderRadius: T.radius, padding: '14px 16px',
                border: `1px solid ${T.border}`, cursor: 'pointer',
                transition: 'border-color 0.2s', position: 'relative', overflow: 'hidden',
              }}>
                {/* Glow accent */}
                <div style={{ position: 'absolute', top: -10, right: -10, width: 60, height: 60, borderRadius: '50%', background: p.glow, filter: 'blur(20px)' }} />

                {/* Top row: emoji + name + level badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 24 }}>{p.emoji}</span>
                    <div>
                      <span style={{ color: T.text, fontSize: '0.85rem', fontWeight: 700 }}>{p.label}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                        <span style={{ fontSize: '0.65rem', color: p.color, fontWeight: 600, background: `${p.color}18`, padding: '1px 6px', borderRadius: 6 }}>
                          Lvl {lvl} · {tierLabel}
                        </span>
                        {stars && <span style={{ fontSize: 10 }}>{stars}</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: T.text }}>{p.sessions}</span>
                    <div style={{ fontSize: '0.6rem', color: T.textMuted, fontWeight: 500 }}>exercises</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${pct}%`,
                      background: `linear-gradient(90deg, ${p.color}, ${p.color}cc)`,
                      borderRadius: 4, transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: `0 0 8px ${p.color}40`,
                    }} />
                  </div>
                  <span style={{ fontSize: '0.65rem', color: T.textMuted, fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {inLvl}/{needed}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Upgrade Banner (free only) ─── */}
      {!isPro && (
        <div style={{ padding: '0 20px 16px' }}>
          <div onClick={() => router.push('/pricing')} style={{
            background: `linear-gradient(135deg, ${T.accent}, #b91c1c)`,
            borderRadius: T.radius, padding: '16px 20px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Crown size={16} /> Upgrade to Pro
              </div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.75rem', marginTop: 3 }}>
                Unlimited practice • Mock exams • AI feedback
              </div>
            </div>
            <ArrowRight size={18} color="rgba(255,255,255,0.7)" />
          </div>
        </div>
      )}

      {/* Desktop: Welcome header override */}
      {desktop && (
        <style>{`
          /* Desktop adjustments handled by grid/flex above */
        `}</style>
      )}
    </div>
  );
}

/* ─── Sub Components ─── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      color: '#f1f5f9', fontSize: '0.95rem', fontWeight: 700,
      margin: '0 0 10px', letterSpacing: '-0.01em',
    }}>
      {children}
    </h2>
  );
}

function StatChip({ emoji, value, color, glow }: { emoji: string; value: string | number; color: string; glow: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4,
      background: `${glow.replace('0.3', '0.08')}`,
      borderRadius: 20, padding: '4px 10px',
    }}>
      <span style={{ fontSize: '1rem' }}>{emoji}</span>
      <span style={{ color, fontWeight: 800, fontSize: '0.85rem' }}>{value}</span>
    </div>
  );
}

function IconCircle({ children, gradient, size = 44 }: { children: React.ReactNode; gradient: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28,
      background: gradient,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', flexShrink: 0,
    }}>
      {children}
    </div>
  );
}

function QuickLink({ icon, gradient, label, sub, badge, onClick, last }: {
  icon: React.ReactNode; gradient: string; label: string; sub: string; badge?: string; onClick: () => void; last?: boolean;
}) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 16px', cursor: 'pointer',
      borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.04)',
      transition: 'background 0.1s',
    }}>
      <IconCircle gradient={gradient} size={36}>{icon}</IconCircle>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          {label}
          {badge && (
            <span style={{
              fontSize: '0.55rem', fontWeight: 800, padding: '2px 6px',
              background: 'rgba(139,92,246,0.2)', color: '#a78bfa',
              borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.5px',
            }}>{badge}</span>
          )}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', marginTop: 1 }}>{sub}</div>
      </div>
      <ChevronRight size={16} color="rgba(255,255,255,0.15)" />
    </div>
  );
}

function RechargeTimer() {
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    const calc = () => {
      const now = new Date();
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
  return <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>⏱ {timeLeft}</span>;
}
