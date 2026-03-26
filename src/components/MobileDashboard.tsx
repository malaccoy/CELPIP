'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Headphones, BookOpen, PenTool, Mic,
  ArrowRight, Sparkles, FileText, GraduationCap,
  Calculator, MessageCircle, Crown, Swords, ChevronRight,
  Flame, Zap, Trophy, Star, Clock,
} from 'lucide-react';
import { useContentAccess } from '@/hooks/useContentAccess';
import NotificationBell from '@/components/NotificationBell';
import SkillRadar from '@/components/SkillRadar';
import { DashboardSkeleton } from '@/components/SkeletonLoader';
import EmptyState from '@/components/EmptyState';
import { checkStreakMilestone, checkPracticeMilestone } from '@/components/MilestoneCelebration';
import styles from '@/styles/MobileDashboard.module.scss';

/* ─── Gradient Tokens ─── */
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

  const [isLoading, setIsLoading] = useState(true);

  const listening = stats?.listening?.sessions || 0;
  const reading = stats?.reading?.sessions || 0;
  const writing = stats?.writing?.sessions || 0;
  const speaking = stats?.speaking?.sessions || 0;
  const streak = streakData?.currentStreak ?? 0;
  const atRisk = streakData?.atRisk;
  const xp = stats?.totalPoints || (listening * 1 + reading * 1 + writing * 3 + speaking * 2);
  const used = dailyUsage?.used ?? 0;
  const dailyLimit = dailyUsage?.limit ?? 3;
  const totalPractices = listening + reading + writing + speaking;

  // Loading state management
  useEffect(() => {
    if (stats !== null) {
      setIsLoading(false);
    }
  }, [stats]);

  // Milestone checks
  useEffect(() => {
    if (!isLoading && streak > 0) {
      checkStreakMilestone(streak);
    }
  }, [isLoading, streak]);

  useEffect(() => {
    if (!isLoading && totalPractices > 0) {
      checkPracticeMilestone(totalPractices);
    }
  }, [isLoading, totalPractices]);

  const greeting = () => {
    const h = new Date().getUTCHours() - 3;
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const skills = [
    { icon: Headphones, title: 'Listening', gradient: G.blue, sessions: listening, href: '/ai-coach?skill=listening' },
    { icon: BookOpen, title: 'Reading', gradient: G.green, sessions: reading, href: '/ai-coach?skill=reading' },
    { icon: PenTool, title: 'Writing', gradient: G.amber, sessions: writing, href: '/ai-coach?skill=writing' },
    { icon: Mic, title: 'Speaking', gradient: G.red, sessions: speaking, href: '/ai-coach?skill=speaking' },
  ];

  const progressItems = [
    { label: 'Listening', icon: Headphones, color: '#60a5fa', glow: 'rgba(96,165,250,0.12)', sessions: listening, path: '/drills/listening' },
    { label: 'Reading', icon: BookOpen, color: '#34d399', glow: 'rgba(52,211,153,0.12)', sessions: reading, path: '/drills/reading' },
    { label: 'Writing', icon: PenTool, color: '#fbbf24', glow: 'rgba(251,191,36,0.12)', sessions: writing, path: '/drills/writing' },
    { label: 'Speaking', icon: Mic, color: '#f87171', glow: 'rgba(248,113,113,0.12)', sessions: speaking, path: '/drills/speaking' },
  ];

  const LEVELS = [0, 10, 25, 50, 100, 200, 350, 550, 800, 1100];
  const getLevel = (sessions: number) => {
    let lvl = 1;
    for (let i = 1; i < LEVELS.length; i++) { if (sessions >= LEVELS[i]) lvl = i + 1; else break; }
    const lvlFloor = LEVELS[lvl - 1] || 0;
    const lvlCeil = LEVELS[lvl] || lvlFloor + 200;
    const inLvl = sessions - lvlFloor;
    const needed = lvlCeil - lvlFloor;
    const pct = Math.min(100, Math.round((inLvl / needed) * 100));
    const tierLabel = lvl >= 6 ? 'Master' : lvl >= 4 ? 'Advanced' : lvl >= 3 ? 'Intermediate' : lvl >= 2 ? 'Beginner' : 'Starter';
    return { lvl, pct, inLvl, needed, tierLabel };
  };

  return (
    <div className={`${styles.page} ${desktop ? styles.pageDesktop : ''}`}>
      {/* ─── Top Bar ─── */}
      {!desktop && (
        <div className={styles.topBar}>
          <div className={styles.topBarLogo} onClick={() => router.push('/dashboard')}>
            <Image src="/logo-leaf.png" alt="CELPIP" width={40} height={40} />
          </div>

          <div className={styles.topBarChips}>
            <div className={styles.statChip} style={{ background: 'rgba(251,191,36,0.08)' }}>
              <Flame size={14} style={{ color: '#fbbf24' }} />
              <span className={styles.statChipValue} style={{ color: '#fbbf24' }}>{streak}</span>
            </div>
            <div className={styles.statChip} style={{ background: 'rgba(167,139,250,0.08)' }}>
              <Zap size={14} style={{ color: '#a78bfa' }} />
              <span className={styles.statChipValue} style={{ color: '#a78bfa' }}>{xp}</span>
            </div>
            <div className={styles.statChip} style={{ background: 'rgba(52,211,153,0.08)', cursor: 'pointer' }} onClick={() => router.push('/rankings')}>
              <Trophy size={14} style={{ color: '#34d399' }} />
              <span className={styles.statChipValue} style={{ color: '#34d399' }}>{myRank ? `#${myRank}` : '\u2014'}</span>
            </div>
          </div>

          <div className={styles.topBarRight}>
            {!isLoggedIn ? (
              <button className={styles.signInBtn} onClick={() => router.push('/auth/login')}>Sign In</button>
            ) : (
              <>
                <NotificationBell />
                <div className={styles.profileAvatar} onClick={() => router.push('/profile')}>
                  {userImage ? (
                    <Image src={userImage} alt="" width={32} height={32} style={{ objectFit: 'cover' }} />
                  ) : (userName ? userName.charAt(0).toUpperCase() : 'U')}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ─── Greeting ─── */}
      <div className={desktop ? styles.greetingDesktop : styles.greeting}>
        <h1 className={styles.greetingTitle}>
          {greeting()}{userName ? `, ${userName}` : ''}
        </h1>
        <p className={styles.greetingSub}>
          {isPro ? (
            <><Star size={14} style={{ color: '#fbbf24' }} /> Pro Member</>
          ) : streak > 0 ? (
            <><Flame size={14} style={{ color: '#fbbf24' }} /> {streak} day streak{atRisk ? ' \u2014 practice today!' : '! Keep going'}</>
          ) : (
            'Start your first practice today'
          )}
        </p>
      </div>

      {/* ─── Daily Usage (free only) ─── */}
      {!isPro && (
        <div className={styles.dailyUsage}>
          <div className={styles.dailyUsageBar}>
            <div className={styles.dailyUsageLeft}>
              <span className={styles.dailyUsageLabel}>Today</span>
              <div className={styles.dailyDots}>
                {Array.from({ length: dailyLimit }).map((_, i) => (
                  <div key={i} className={`${styles.dailyDot} ${i < used ? styles.dailyDotActive : styles.dailyDotInactive}`} />
                ))}
              </div>
              <span className={styles.dailyCount}>{used}/{dailyLimit}</span>
              {used >= dailyLimit && <RechargeTimer />}
            </div>
            <button className={styles.upgradeChip} onClick={() => router.push('/pricing')}>Upgrade</button>
          </div>
        </div>
      )}

      {/* ─── Main Action Cards ─── */}
      <div className={styles.mainCards}>
        <div className={styles.mainCardsGrid}>
          <div className={styles.practiceCard} onClick={() => router.push('/drills')}>
            <div className={styles.practiceCardDecor1} />
            <div className={styles.practiceCardDecor2} />
            <div className={styles.practiceCardContent}>
              <div className={styles.practiceCardHeader}>
                <Sparkles size={22} />
                <span className={styles.practiceCardTitle}>Start Practice</span>
              </div>
              <p className={styles.practiceCardDesc}>
                Speaking, Writing, Listening & Reading drills
              </p>
            </div>
            <ArrowRight size={20} className={styles.practiceCardArrow} />
          </div>

          <div className={styles.battleCard} onClick={() => router.push('/battle')}>
            <div className={styles.battleIconBox}>
              <Swords size={22} />
            </div>
            <div className={styles.battleContent}>
              <span className={styles.battleTitle}>
                <Swords size={18} /> Battle Mode
              </span>
              <p className={styles.battleDesc}>Challenge other students in real-time PvP!</p>
            </div>
            <ArrowRight size={18} style={{ color: 'rgba(255,255,255,0.6)' }} />
          </div>
        </div>
      </div>

      {/* ─── Practice by Skill ─── */}
      <div className={styles.skillsSection}>
        <h2 className={styles.sectionTitle}>Practice by Skill</h2>
        <div className={styles.skillsGrid}>
          {skills.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.title} className={styles.skillCard} onClick={() => { window.location.href = s.href; }}>
                <div className={styles.skillIconCircle} style={{ background: s.gradient }}>
                  <Icon size={20} />
                </div>
                <div className={styles.skillCardTitle}>{s.title}</div>
                <div className={styles.skillCardSessions}>
                  {s.sessions} exercise{s.sessions !== 1 ? 's' : ''} done
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Quick Access ─── */}
      <div className={styles.quickSection}>
        <h2 className={styles.sectionTitle}>Quick Access</h2>
        <div className={styles.quickList}>
          {[
            { icon: FileText, gradient: G.purple, label: 'Mock Exams', sub: 'Full test simulation', badge: !isPro ? 'PRO' : undefined, onClick: () => router.push('/mock-exam') },
            { icon: GraduationCap, gradient: G.green, label: 'Study Guides', sub: 'Techniques & strategies', badge: !isPro ? 'PRO' : undefined, onClick: () => router.push('/guides') },
            { icon: Calculator, gradient: G.cyan, label: 'CRS Calculator', sub: 'Check your score', onClick: () => router.push('/tools/score-calculator') },
            { icon: MessageCircle, gradient: G.slate, label: 'Community', sub: 'Join 200+ learners', onClick: () => window.open('https://t.me/+YcO9MfUHIjQyYjAx', '_blank') },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className={styles.quickItem} onClick={item.onClick}>
                <div className={styles.quickIconCircle} style={{ background: item.gradient }}>
                  <Icon size={18} />
                </div>
                <div className={styles.quickInfo}>
                  <div className={styles.quickLabel}>
                    {item.label}
                    {item.badge && <span className={styles.quickBadge}>{item.badge}</span>}
                  </div>
                  <div className={styles.quickSub}>{item.sub}</div>
                </div>
                <ChevronRight size={16} className={styles.quickArrow} />
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Your Progress ─── */}
      <div className={styles.progressSection}>
        <h2 className={styles.sectionTitle}>Your Progress</h2>
        <div className={styles.progressGrid}>
          {progressItems.map(p => {
            const { lvl, pct, inLvl, needed, tierLabel } = getLevel(p.sessions);
            const Icon = p.icon;
            return (
              <div key={p.label} className={styles.progressCard} onClick={() => router.push(p.path)}>
                <div className={styles.progressGlow} style={{ background: p.glow }} />
                <div className={styles.progressTop}>
                  <div className={styles.progressInfo}>
                    <div className={styles.progressIcon} style={{ background: `${p.color}18` }}>
                      <Icon size={16} style={{ color: p.color }} />
                    </div>
                    <div>
                      <span className={styles.progressLabel}>{p.label}</span>
                      <div className={styles.progressLevel}>
                        <span className={styles.progressLevelBadge} style={{ color: p.color, background: `${p.color}18` }}>
                          Lvl {lvl} &middot; {tierLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.progressCount}>
                    <span className={styles.progressCountValue}>{p.sessions}</span>
                    <div className={styles.progressCountLabel}>exercises</div>
                  </div>
                </div>
                <div className={styles.progressBarRow}>
                  <div className={styles.progressBarTrack}>
                    <div
                      className={styles.progressBarFill}
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${p.color}, ${p.color}cc)`,
                        boxShadow: `0 0 8px ${p.color}40`,
                      }}
                    />
                  </div>
                  <span className={styles.progressBarLabel}>{inLvl}/{needed}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Skill Analytics (Pro or users with data) ─── */}
      <SkillRadar />

      {/* ─── Empty State for new users ─── */}
      {!isLoading && totalPractices === 0 && (
        <div style={{ padding: '0 20px 16px' }}>
          <EmptyState type="no-practice" />
        </div>
      )}

      {/* ─── Upgrade Banner (free only) ─── */}
      {!isPro && (
        <div className={styles.upgradeBanner}>
          <div className={styles.upgradeBannerInner} onClick={() => router.push('/pricing')}>
            <div>
              <div className={styles.upgradeBannerTitle}>
                <Crown size={16} /> Upgrade to Pro
              </div>
              <div className={styles.upgradeBannerDesc}>
                Unlimited practice &bull; Mock exams &bull; AI feedback
              </div>
            </div>
            <ArrowRight size={18} style={{ color: 'rgba(255,255,255,0.7)' }} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Recharge Timer ─── */
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
  return (
    <span className={styles.rechargeTimer}>
      <Clock size={12} /> {timeLeft}
    </span>
  );
}
