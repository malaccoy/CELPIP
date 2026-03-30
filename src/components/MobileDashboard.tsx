'use client';

import Image from 'next/image';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Headphones, BookOpen, PenTool, Mic,
  ArrowRight, Sparkles, FileText, GraduationCap,
  Calculator, MessageCircle, Crown, Swords, ChevronRight,
  Flame, Zap, Trophy, Star, Clock, Target,
  TrendingUp, Play, Shield, Lock, Award,
} from 'lucide-react';
import { useContentAccess } from '@/hooks/useContentAccess';
import NotificationBell from '@/components/NotificationBell';
import SkillRadar from '@/components/SkillRadar';
import dynamic from 'next/dynamic';
const RiveIcon = dynamic(() => import('@/components/RiveIcon'), { ssr: false });
const LottieSkillIcon = dynamic(() => import('@/components/LottieSkillIcon'), { ssr: false });
import { DashboardSkeleton } from '@/components/SkeletonLoader';
import EmptyState from '@/components/EmptyState';
import { checkStreakMilestone, checkPracticeMilestone } from '@/components/MilestoneCelebration';
import styles from '@/styles/MobileDashboard.module.scss';
import ReferralCard from '@/components/ReferralCard';

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

/* ─── Animated Counter Hook ─── */
function useCountUp(target: number, duration: number = 1200) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!ref.current || started.current || target === 0) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

/* ─── Circular Progress Component ─── */
function CircularProgress({ pct, color, size = 52, strokeWidth = 4 }: { pct: number; color: string; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <svg width={size} height={size} className={styles.circularProgress}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{
          transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: 'rotate(-90deg)',
          transformOrigin: '50% 50%',
          filter: `drop-shadow(0 0 4px ${color}60)`,
        }}
      />
    </svg>
  );
}

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

  // Motivational message based on user state
  const getMotivation = () => {
    if (totalPractices === 0) return 'Start your first practice and begin your journey!';
    if (atRisk) return 'Your streak is at risk! Practice now to keep it alive.';
    if (streak >= 7) return `${streak}-day streak! You're building a powerful habit.`;
    if (streak > 0) return `${streak}-day streak! Keep the momentum going.`;
    if (totalPractices > 50) return 'Great progress! Push for the next level.';
    return 'Every practice brings you closer to your target CLB.';
  };

  // Estimated CLB based on total practice
  const getEstimatedCLB = () => {
    if (totalPractices >= 200) return 10;
    if (totalPractices >= 100) return 9;
    if (totalPractices >= 50) return 8;
    if (totalPractices >= 20) return 7;
    if (totalPractices >= 5) return 6;
    return 5;
  };

  const skills = [
    { icon: Headphones, title: 'Listening', gradient: G.blue, color: '#60a5fa', sessions: listening, href: '/ai-coach?skill=listening' },
    { icon: BookOpen, title: 'Reading', gradient: G.green, color: '#34d399', sessions: reading, href: '/ai-coach?skill=reading' },
    { icon: PenTool, title: 'Writing', gradient: G.amber, color: '#fbbf24', sessions: writing, href: '/ai-coach?skill=writing' },
    { icon: Mic, title: 'Speaking', gradient: G.red, color: '#f87171', sessions: speaking, href: '/ai-coach?skill=speaking' },
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

  // Animated counters for stats
  const totalCounter = useCountUp(totalPractices);
  const streakCounter = useCountUp(streak);
  const xpCounter = useCountUp(xp);

  // Find weakest skill for recommendation
  const skillSessions = [
    { name: 'Listening', sessions: listening, href: '/ai-coach?skill=listening' },
    { name: 'Reading', sessions: reading, href: '/ai-coach?skill=reading' },
    { name: 'Writing', sessions: writing, href: '/ai-coach?skill=writing' },
    { name: 'Speaking', sessions: speaking, href: '/ai-coach?skill=speaking' },
  ];
  const weakestSkill = skillSessions.reduce((a, b) => a.sessions <= b.sessions ? a : b);

  return (
    <div className={`${styles.page} ${desktop ? styles.pageDesktop : ''}`}>
      {/* ─── Ambient Background Orbs ─── */}
      <div className={styles.ambientOrb1} />
      <div className={styles.ambientOrb2} />

      {/* ─── Top Bar ─── */}
      {!desktop && (
        <div className={styles.topBar}>
          <div className={styles.topBarLogo} onClick={() => router.push('/map')}>
            <Image src="/logo-leaf.png" alt="CELPIP" width={40} height={40} />
          </div>

          <div className={styles.topBarChips}>
            <div className={`${styles.statChip} ${streak > 0 ? styles.statChipActive : ''}`} style={{ background: 'rgba(251,191,36,0.08)' }}>
              <RiveIcon artboard="26_Fire" size={32} />
              <span className={styles.statChipValue} style={{ color: '#fbbf24' }}>{streak}</span>
            </div>
            <div className={styles.statChip} style={{ background: 'rgba(167,139,250,0.08)' }}>
              <RiveIcon artboard="03_Flash" size={32} />
              <span className={styles.statChipValue} style={{ color: '#a78bfa' }}>{xp}</span>
            </div>
            <div className={styles.statChip} style={{ background: 'rgba(52,211,153,0.08)', cursor: 'pointer' }} onClick={() => router.push('/rankings')}>
              <RiveIcon artboard="21_Crown" size={32} />
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

      {/* ─── Welcome Banner (replaces plain greeting) ─── */}
      <div className={desktop ? styles.welcomeBannerDesktop : styles.welcomeBanner}>
        <div className={styles.welcomeLeft}>
          <div className={styles.welcomeGreeting}>
            <h1 className={styles.welcomeTitle}>
              {greeting()}{userName ? `, ${userName}` : ''}
            </h1>
            {isPro && (
              <span className={styles.proBadge}>
                <Crown size={12} /> PRO
              </span>
            )}
          </div>
          <p className={styles.welcomeMotivation}>
            {getMotivation()}
          </p>
          {/* Stats row removed — V2 redesign */}
        </div>
        {/* Streak Visual (right side on desktop) */}
        {streak > 0 && (
          <div className={styles.streakVisual}>
            <div className={styles.streakFlame}>
              <RiveIcon artboard="26_Fire" size={56} />
            </div>
            <span className={styles.streakNumber}>{streak}</span>
            <span className={styles.streakLabel}>day{streak !== 1 ? 's' : ''}</span>
          </div>
        )}
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
            <button className={styles.upgradeChip} onClick={() => router.push('/pricing')}>
              <Crown size={10} /> Upgrade
            </button>
          </div>
        </div>
      )}

      {/* ─── Practice by Skill (with progress rings) ─── */}
      <div className={styles.skillsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Practice by Skill</h2>
          <button className={styles.sectionLink} onClick={() => router.push('/drills')}>
            View all <ChevronRight size={14} />
          </button>
        </div>
        <div className={styles.skillsGrid}>
          {skills.map(s => {
            const Icon = s.icon;
            const { lvl, pct, tierLabel } = getLevel(s.sessions);
            return (
              <div key={s.title} className={styles.skillCard} onClick={() => { window.location.href = s.href; }}>
                <div className={styles.skillCardGlow} style={{ background: `${s.color}10` }} />
                <div className={styles.skillCardTop}>
                  <div className={styles.skillIconWrapper}>
                    <CircularProgress pct={pct} color={s.color} size={76} strokeWidth={3} />
                    <div className={styles.skillIconInner} style={{ background: s.gradient }}>
                      <LottieSkillIcon skill={s.title.toLowerCase() as any} size={52} />
                    </div>
                  </div>
                  <div className={styles.skillLevelBadge} style={{ color: s.color, background: `${s.color}15` }}>
                    Lvl {lvl}
                  </div>
                </div>
                <div className={styles.skillCardTitle}>{s.title}</div>
                <div className={styles.skillCardMeta}>
                  <span className={styles.skillCardSessions}>{s.sessions} exercises</span>
                  <span className={styles.skillCardTier}>{tierLabel}</span>
                </div>
                <div className={styles.skillCardAction}>
                  <Play size={12} fill={s.color} style={{ color: s.color }} />
                  <span style={{ color: s.color }}>Practice</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── AI Recommendation Card ─── */}
      {totalPractices > 0 && (
        <div className={styles.aiRecommendation}>
          <div className={styles.aiRecCard} onClick={() => { window.location.href = weakestSkill.href; }}>
            <div className={styles.aiRecIcon}>
              <Sparkles size={18} />
            </div>
            <div className={styles.aiRecContent}>
              <span className={styles.aiRecTitle}>AI Recommendation</span>
              <span className={styles.aiRecText}>
                Focus on <strong>{weakestSkill.name}</strong> — it&apos;s your area with the most room for growth.
              </span>
            </div>
            <ArrowRight size={16} className={styles.aiRecArrow} />
          </div>
        </div>
      )}

      {/* ─── Main Action Cards ─── */}
      <div className={styles.mainCards}>
        <div className={styles.mainCardsGrid}>
          {/* PRIMARY: Start Practice — Full width, dominant */}
          <div className={styles.practiceCard} onClick={() => router.push('/drills')}>
            <div className={styles.practiceCardDecor1} />
            <div className={styles.practiceCardDecor2} />
            <div className={styles.practiceCardDecor3} />
            <div className={styles.practiceCardContent}>
              <div className={styles.practiceCardHeader}>
                <div className={styles.practiceCardIconBox}>
                  <Play size={20} fill="white" />
                </div>
                <div>
                  <span className={styles.practiceCardTitle}>Start Practice</span>
                  <p className={styles.practiceCardDesc}>
                    Continue your personalized daily drill
                  </p>
                </div>
              </div>
              <div className={styles.practiceCardCta}>
                <span>Begin Session</span>
                <ArrowRight size={16} />
              </div>
            </div>
          </div>

          {/* SECONDARY: Battle Mode — Smaller, intriguing */}
          <div className={styles.battleCard} onClick={() => router.push('/battle')}>
            <div className={styles.battleIconBox}>
              <Swords size={20} />
            </div>
            <div className={styles.battleContent}>
              <span className={styles.battleTitle}>Battle Mode</span>
              <p className={styles.battleDesc}>Challenge students in real-time PvP</p>
            </div>
            <ChevronRight size={16} style={{ color: 'rgba(255,255,255,0.5)' }} />
          </div>
        </div>
      </div>

      {/* ─── Referral Card ─── */}
      <div style={{ padding: '0 16px' }}>
        <ReferralCard />
      </div>

      {/* ─── Quick Access (redesigned with unique visuals) ─── */}
      <div className={styles.quickSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Quick Access</h2>
        </div>
        <div className={styles.quickGrid}>
          {[
            { icon: FileText, gradient: G.purple, color: '#a78bfa', label: 'Mock Exams', sub: 'Full test simulation', badge: !isPro ? 'PRO' : undefined, onClick: () => router.push('/mock-exam') },
            { icon: GraduationCap, gradient: G.green, color: '#34d399', label: 'Study Guides', sub: 'Techniques & strategies', badge: !isPro ? 'PRO' : undefined, onClick: () => router.push('/guides') },
            { icon: Calculator, gradient: G.cyan, color: '#38bdf8', label: 'CRS Calculator', sub: 'Check your score', onClick: () => router.push('/tools/score-calculator') },
            { icon: MessageCircle, gradient: G.slate, color: '#94a3b8', label: 'Community', sub: 'Join 200+ learners', onClick: () => window.open('https://t.me/+YcO9MfUHIjQyYjAx', '_blank') },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className={styles.quickCard} onClick={item.onClick}>
                <div className={styles.quickCardIcon} style={{ background: item.gradient }}>
                  <Icon size={18} />
                </div>
                <div className={styles.quickCardInfo}>
                  <div className={styles.quickCardLabel}>
                    {item.label}
                    {item.badge && (
                      <span className={styles.quickBadge}>
                        <Lock size={8} /> {item.badge}
                      </span>
                    )}
                  </div>
                  <div className={styles.quickCardSub}>{item.sub}</div>
                </div>
                <ChevronRight size={14} className={styles.quickCardArrow} />
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Your Progress (elevated with better visualization) ─── */}
      <div className={styles.progressSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Your Progress</h2>
          <button className={styles.sectionLink} onClick={() => router.push('/profile')}>
            Full stats <ChevronRight size={14} />
          </button>
        </div>

        {/* Overall Stats Summary */}
        <div className={styles.overallStats} ref={totalCounter.ref}>
          <div className={styles.overallStatItem}>
            <div className={styles.overallStatIcon} style={{ background: 'rgba(251,191,36,0.1)' }}>
              <RiveIcon artboard="26_Fire" size={34} />
            </div>
            <span className={styles.overallStatValue}>{streakCounter.count}</span>
            <span className={styles.overallStatLabel}>Day Streak</span>
          </div>
          <div className={styles.overallStatItem}>
            <div className={styles.overallStatIcon} style={{ background: 'rgba(167,139,250,0.1)' }}>
              <RiveIcon artboard="03_Flash" size={34} />
            </div>
            <span className={styles.overallStatValue}>{xpCounter.count}</span>
            <span className={styles.overallStatLabel}>Total XP</span>
          </div>
          <div className={styles.overallStatItem}>
            <div className={styles.overallStatIcon} style={{ background: 'rgba(52,211,153,0.1)' }}>
              <Award size={18} style={{ color: '#34d399' }} />
            </div>
            <span className={styles.overallStatValue}>{totalCounter.count}</span>
            <span className={styles.overallStatLabel}>Exercises</span>
          </div>
          <div className={styles.overallStatItem}>
            <div className={styles.overallStatIcon} style={{ background: 'rgba(56,189,248,0.1)' }}>
              <RiveIcon artboard="21_Crown" size={34} />
            </div>
            <span className={styles.overallStatValue}>{myRank ? `#${myRank}` : '—'}</span>
            <span className={styles.overallStatLabel}>Rank</span>
          </div>
        </div>

        {/* Per-skill progress cards */}
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
                      <LottieSkillIcon skill={p.label.toLowerCase() as any} size={36} />
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

      {/* ─── Upgrade Banner (free only) — Premium redesign ─── */}
      {!isPro && (
        <div className={styles.upgradeBanner}>
          <div className={styles.upgradeBannerInner} onClick={() => router.push('/pricing')}>
            <div className={styles.upgradeBannerGlow} />
            <div className={styles.upgradeBannerContent}>
              <div className={styles.upgradeBannerIcon}>
                <Crown size={20} />
              </div>
              <div>
                <div className={styles.upgradeBannerTitle}>
                  Unlock Unlimited Practice
                </div>
                <div className={styles.upgradeBannerDesc}>
                  Unlimited drills &bull; Mock exams &bull; AI feedback &bull; No daily limits
                </div>
              </div>
            </div>
            <div className={styles.upgradeBannerCta}>
              Upgrade <ArrowRight size={14} />
            </div>
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
