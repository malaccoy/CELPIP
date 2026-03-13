'use client';

import { useState, useEffect } from 'react';
import { Trophy, Flame, Users, TrendingUp, Medal, Crown, Zap, BookOpen, Headphones, Pencil, Mic } from 'lucide-react';
import styles from '@/styles/Rankings.module.scss';

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

  useEffect(() => {
    fetch(`/api/rankings?_=${Date.now()}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown size={20} style={{ color: '#fbbf24' }} />;
    if (rank === 2) return <Medal size={20} style={{ color: '#c0c0c0' }} />;
    if (rank === 3) return <Medal size={20} style={{ color: '#cd7f32' }} />;
    return <span style={{ fontSize: 16, fontWeight: 700, color: 'rgba(248,250,252,0.5)', width: 20, textAlign: 'center', display: 'inline-block' }}>{rank}</span>;
  };

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Trophy size={32} style={{ color: '#fbbf24', animation: 'pulse 1.5s infinite' }} />
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

  return (
    <div className={styles.container}>
      {/* Hero */}
      <div className={styles.hero}>
        <Trophy size={40} style={{ color: '#fbbf24' }} />
        <h1 className={styles.title}>Top Learners This Month</h1>
        <p className={styles.subtitle}>
          See who&apos;s practicing the hardest. Your score resets on the 1st of each month.
        </p>
        {data.totalLearners > 0 && (
          <div className={styles.learnerCount}>
            <Users size={16} />
            <span>{data.totalLearners.toLocaleString()} learner{data.totalLearners !== 1 ? 's' : ''} competing</span>
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <div className={styles.leaderboard}>
        {data.top10.length === 0 ? (
          <div className={styles.emptyBoard}>
            <p>No activity this month yet. Be the first! 🚀</p>
          </div>
        ) : (
          data.top10.map((entry) => (
            <div
              key={entry.rank}
              className={`${styles.rankRow} ${entry.isCurrentUser ? styles.myRow : ''} ${entry.rank <= 3 ? styles.topThree : ''} ${entry.rank === 1 ? styles.champion : ''}`}
            >
              <div className={styles.rankBadge}>
                {getRankIcon(entry.rank)}
              </div>
              {entry.avatar ? (
                <div 
                  className={styles.avatar} 
                  style={{ backgroundImage: `url(${entry.avatar})` }}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {entry.displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className={styles.rankInfo}>
                <span className={styles.rankName}>
                  {getRankEmoji(entry.rank)} {entry.displayName}
                  {entry.isCurrentUser && <span className={styles.youBadge}>You</span>}
                </span>
              </div>
              <div className={styles.rankPoints}>
                {entry.points.toLocaleString()} pts
              </div>
            </div>
          ))
        )}
      </div>

      {/* Your Stats */}
      <div className={styles.myStats}>
        <h2 className={styles.myStatsTitle}>Your Stats</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <TrendingUp size={20} style={{ color: '#60a5fa' }} />
            <div className={styles.statValue}>
              {data.myRank ? `#${data.myRank}` : '—'}
            </div>
            <div className={styles.statLabel}>Your Rank</div>
          </div>
          <div className={styles.statCard}>
            <Zap size={20} style={{ color: '#fbbf24' }} />
            <div className={styles.statValue}>
              {data.myPoints.toLocaleString()}
            </div>
            <div className={styles.statLabel}>Points</div>
          </div>
          <div className={styles.statCard}>
            <Flame size={20} style={{ color: '#f97316' }} />
            <div className={styles.statValue}>
              {data.myStreak} day{data.myStreak !== 1 ? 's' : ''}
            </div>
            <div className={styles.statLabel}>Streak</div>
          </div>
        </div>
      </div>

      {/* Scoring Guide */}
      <div className={styles.scoringGuide}>
        <h3>How Points Work</h3>
        <div className={styles.scoringGrid}>
          <div className={styles.scoringItem}>
            <BookOpen size={16} style={{ color: '#34d399' }} />
            <span>Reading question = 1 pt</span>
          </div>
          <div className={styles.scoringItem}>
            <Headphones size={16} style={{ color: '#60a5fa' }} />
            <span>Listening question = 1 pt</span>
          </div>
          <div className={styles.scoringItem}>
            <Pencil size={16} style={{ color: '#a78bfa' }} />
            <span>Writing submission = 3 pts</span>
          </div>
          <div className={styles.scoringItem}>
            <Mic size={16} style={{ color: '#f97316' }} />
            <span>Speaking submission = 2 pts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
