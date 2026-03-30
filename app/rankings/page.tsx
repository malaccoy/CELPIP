'use client';

import { useState, useEffect, useRef } from 'react';
import { Trophy, Flame, Users, TrendingUp, Zap, BookOpen, Headphones, Pencil, Mic, Medal, Crown, Target, ArrowUp } from 'lucide-react';
import styles from '@/styles/Rankings.module.scss';
import dynamic from 'next/dynamic';
const RiveIcon = dynamic(() => import('@/components/RiveIcon'), { ssr: false });

interface RankEntry {
  rank: number;
  displayName: string;
  avatar: string | null;
  points: number;
  isCurrentUser: boolean;
}

interface RankingsData {
  top10: RankEntry[];
  totalLearners: number;
  myRank: number | null;
  myPoints: number;
  myStreak: number;
}

export default function RankingsPage() {
  const [data, setData] = useState<RankingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [animatedStats, setAnimatedStats] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/rankings?_=${Date.now()}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Animate stats on scroll into view
  useEffect(() => {
    if (!statsRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimatedStats(true); },
      { threshold: 0.3 }
    );
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [data]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.loadingIcon}>
            <Trophy size={32} />
          </div>
          <p>Loading rankings...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <Trophy size={48} style={{ color: 'rgba(248,250,252,0.2)' }} />
          <h2>Rankings coming soon!</h2>
          <p>Start practicing to appear on the leaderboard.</p>
        </div>
      </div>
    );
  }

  const top3 = data.top10.slice(0, 3);
  const rest = data.top10.slice(3);
  // Podium order: 2nd, 1st, 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);

  const rankMedals: Record<number, { bg: string; border: string; glow: string; icon: React.ReactNode }> = {
    1: { bg: 'linear-gradient(135deg, #fbbf24, #f59e0b)', border: '#fde68a', glow: 'rgba(251, 191, 36, 0.3)', icon: <RiveIcon artboard="21_Crown" size={22} /> },
    2: { bg: 'linear-gradient(135deg, #94a3b8, #cbd5e1)', border: '#e2e8f0', glow: 'rgba(148, 163, 184, 0.2)', icon: <RiveIcon artboard="01_Star" size={20} /> },
    3: { bg: 'linear-gradient(135deg, #d97706, #f59e0b)', border: '#fbbf24', glow: 'rgba(217, 119, 6, 0.25)', icon: <RiveIcon artboard="01_Star" size={20} /> },
  };

  const Avatar = ({ entry, size = 48 }: { entry: RankEntry; size?: number }) => {
    const medal = rankMedals[entry.rank];
    return entry.avatar ? (
      <div className={styles.avatarWrap} style={{ width: size, height: size }}>
        <div style={{
          width: size, height: size, borderRadius: '50%',
          backgroundImage: `url(${entry.avatar})`, backgroundSize: 'cover', backgroundPosition: 'center',
          border: medal ? `3px solid ${medal.border}` : '2px solid rgba(255,255,255,0.1)',
          boxShadow: medal ? `0 0 16px ${medal.glow}` : 'none',
          flexShrink: 0,
        }} />
      </div>
    ) : (
      <div className={styles.avatarWrap} style={{ width: size, height: size }}>
        <div style={{
          width: size, height: size, borderRadius: '50%',
          background: medal ? medal.bg : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: size * 0.4, fontWeight: 800, color: '#fff',
          border: medal ? `3px solid ${medal.border}` : '2px solid rgba(255,255,255,0.1)',
          boxShadow: medal ? `0 0 16px ${medal.glow}` : 'none',
          flexShrink: 0,
        }}>
          {entry.displayName.charAt(0).toUpperCase()}
        </div>
      </div>
    );
  };

  const rankColors: Record<number, string> = { 1: '#fbbf24', 2: '#94a3b8', 3: '#d97706' };

  return (
    <div className={styles.container}>
      {/* Ambient background orbs */}
      <div className={styles.ambientOrb1} />
      <div className={styles.ambientOrb2} />

      {/* Header */}
      <div className={styles.hero}>
        <div className={styles.heroBadge}>
          <Trophy size={14} />
          <span>Leaderboard</span>
        </div>
        <h1 className={styles.title}>Top Performers</h1>
        {data.totalLearners > 0 && (
          <p className={styles.subtitle}>
            <Users size={13} />
            <span>{data.totalLearners} learner{data.totalLearners !== 1 ? 's' : ''} competing this month</span>
          </p>
        )}
      </div>

      {/* Podium - Top 3 */}
      {top3.length >= 3 && (
        <div className={styles.podium}>
          {podiumOrder.map((entry, idx) => {
            const heights: Record<number, number> = { 1: 110, 2: 78, 3: 56 };
            const medal = rankMedals[entry.rank];
            return (
              <div key={entry.rank} className={`${styles.podiumSlot} ${entry.rank === 1 ? styles.podiumFirst : ''}`}>
                <div className={styles.podiumCrown}>
                  {entry.rank === 1 && <span className={styles.crownEmoji}>👑</span>}
                </div>
                <Avatar entry={entry} size={entry.rank === 1 ? 68 : 54} />
                <span className={styles.podiumName}>
                  {entry.displayName.length > 10 ? entry.displayName.slice(0, 10) + '…' : entry.displayName}
                  {entry.isCurrentUser && <span className={styles.podiumYou}>YOU</span>}
                </span>
                <span className={styles.podiumPoints} style={{ color: rankColors[entry.rank] || '#fbbf24' }}>
                  <Zap size={12} /> {entry.points} pts
                </span>
                <div className={styles.podiumBar} style={{
                  height: heights[entry.rank],
                  background: medal?.bg || 'linear-gradient(180deg, #6366f1, #4f46e5)',
                }}>
                  <span className={styles.podiumRank}>{entry.rank}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rest of leaderboard */}
      <div className={styles.leaderboard}>
        <div className={styles.leaderboardHeader}>
          <span>Rank</span>
          <span>Player</span>
          <span>Points</span>
        </div>
        {(top3.length < 3 ? data.top10 : rest).map((entry, idx) => (
          <div
            key={entry.rank}
            className={`${styles.rankRow} ${entry.isCurrentUser ? styles.myRow : ''}`}
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <span className={styles.rankNum}>
              {entry.rank <= 10 ? (
                <span className={styles.rankBadge}>{entry.rank}</span>
              ) : entry.rank}
            </span>
            <Avatar entry={entry} size={40} />
            <div className={styles.rankInfo}>
              <span className={styles.rankName}>
                {entry.displayName}
                {entry.isCurrentUser && <span className={styles.youBadge}>YOU</span>}
              </span>
            </div>
            <div className={styles.rankPoints}>
              <Zap size={13} />
              <span>{entry.points.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Your Stats */}
      <div className={styles.myStats} ref={statsRef}>
        <h3 className={styles.myStatsTitle}>Your Stats</h3>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIconBox} style={{ background: 'rgba(96, 165, 250, 0.12)' }}>
              <TrendingUp size={18} style={{ color: '#60a5fa' }} />
            </div>
            <div className={styles.statValue}>{data.myRank ? `#${data.myRank}` : '—'}</div>
            <div className={styles.statLabel}>Your Rank</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIconBox} style={{ background: 'rgba(251, 191, 36, 0.12)' }}>
              <Zap size={18} style={{ color: '#fbbf24' }} />
            </div>
            <div className={styles.statValue}>{data.myPoints.toLocaleString()}</div>
            <div className={styles.statLabel}>Points</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIconBox} style={{ background: 'rgba(249, 115, 22, 0.12)' }}>
              <Flame size={18} style={{ color: '#f97316' }} />
            </div>
            <div className={styles.statValue}>{data.myStreak}d</div>
            <div className={styles.statLabel}>Streak</div>
          </div>
        </div>
      </div>

      {/* Scoring */}
      <div className={styles.scoringGuide}>
        <h3>How Points Work</h3>
        <div className={styles.scoringGrid}>
          <div className={styles.scoringItem}>
            <div className={styles.scoringIcon} style={{ background: 'rgba(52, 211, 153, 0.1)' }}><BookOpen size={14} style={{ color: '#34d399' }} /></div>
            <div className={styles.scoringText}>
              <span className={styles.scoringSkill}>Reading</span>
              <span className={styles.scoringPts}>1 pt / exercise</span>
            </div>
          </div>
          <div className={styles.scoringItem}>
            <div className={styles.scoringIcon} style={{ background: 'rgba(96, 165, 250, 0.1)' }}><Headphones size={14} style={{ color: '#60a5fa' }} /></div>
            <div className={styles.scoringText}>
              <span className={styles.scoringSkill}>Listening</span>
              <span className={styles.scoringPts}>1 pt / exercise</span>
            </div>
          </div>
          <div className={styles.scoringItem}>
            <div className={styles.scoringIcon} style={{ background: 'rgba(167, 139, 250, 0.1)' }}><Pencil size={14} style={{ color: '#a78bfa' }} /></div>
            <div className={styles.scoringText}>
              <span className={styles.scoringSkill}>Writing</span>
              <span className={styles.scoringPts}>3 pts / exercise</span>
            </div>
          </div>
          <div className={styles.scoringItem}>
            <div className={styles.scoringIcon} style={{ background: 'rgba(249, 115, 22, 0.1)' }}><Mic size={14} style={{ color: '#f97316' }} /></div>
            <div className={styles.scoringText}>
              <span className={styles.scoringSkill}>Speaking</span>
              <span className={styles.scoringPts}>2 pts / exercise</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
