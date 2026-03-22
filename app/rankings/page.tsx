'use client';

import { useState, useEffect } from 'react';
import { Trophy, Flame, Users, TrendingUp, Zap, BookOpen, Headphones, Pencil, Mic } from 'lucide-react';
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

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Trophy size={32} style={{ color: '#fbbf24' }} />
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

  const Avatar = ({ entry, size = 48 }: { entry: RankEntry; size?: number }) => (
    entry.avatar ? (
      <div style={{
        width: size, height: size, borderRadius: '50%',
        backgroundImage: `url(${entry.avatar})`, backgroundSize: 'cover', backgroundPosition: 'center',
        border: entry.rank === 1 ? '3px solid #fbbf24' : entry.rank === 2 ? '3px solid #94a3b8' : entry.rank === 3 ? '3px solid #d97706' : '2px solid rgba(255,255,255,0.1)',
        flexShrink: 0,
      }} />
    ) : (
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: entry.rank === 1 ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : entry.rank === 2 ? 'linear-gradient(135deg, #94a3b8, #cbd5e1)' : entry.rank === 3 ? 'linear-gradient(135deg, #d97706, #f59e0b)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.4, fontWeight: 800, color: '#fff',
        border: entry.rank <= 3 ? `3px solid ${entry.rank === 1 ? '#fde68a' : entry.rank === 2 ? '#e2e8f0' : '#fbbf24'}` : '2px solid rgba(255,255,255,0.1)',
        flexShrink: 0,
      }}>
        {entry.displayName.charAt(0).toUpperCase()}
      </div>
    )
  );

  const rankColors: Record<number, string> = { 1: '#fbbf24', 2: '#94a3b8', 3: '#d97706' };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.hero}>
        <h1 className={styles.title}>
          <Trophy size={28} style={{ color: '#fbbf24', verticalAlign: 'middle', marginRight: 8 }} />
          Leaderboard
        </h1>
        {data.totalLearners > 0 && (
          <p className={styles.subtitle}>
            <Users size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            {data.totalLearners} learner{data.totalLearners !== 1 ? 's' : ''} this month
          </p>
        )}
      </div>

      {/* Podium - Top 3 */}
      {top3.length >= 3 && (
        <div className={styles.podium}>
          {podiumOrder.map((entry) => {
            const heights: Record<number, number> = { 1: 100, 2: 70, 3: 50 };
            return (
              <div key={entry.rank} className={styles.podiumSlot}>
                <div className={styles.podiumCrown}>
                  {entry.rank === 1 && <span style={{ fontSize: 28 }}>👑</span>}
                </div>
                <Avatar entry={entry} size={entry.rank === 1 ? 64 : 52} />
                <span className={styles.podiumName}>{entry.displayName.length > 10 ? entry.displayName.slice(0, 10) + '…' : entry.displayName}</span>
                <span className={styles.podiumPoints} style={{ color: rankColors[entry.rank] || '#fbbf24' }}>
                  {entry.points} pts
                </span>
                <div className={styles.podiumBar} style={{
                  height: heights[entry.rank],
                  background: entry.rank === 1
                    ? 'linear-gradient(180deg, #fbbf24, #f59e0b)'
                    : entry.rank === 2
                      ? 'linear-gradient(180deg, #94a3b8, #64748b)'
                      : 'linear-gradient(180deg, #d97706, #b45309)',
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
        {(top3.length < 3 ? data.top10 : rest).map((entry) => (
          <div
            key={entry.rank}
            className={`${styles.rankRow} ${entry.isCurrentUser ? styles.myRow : ''}`}
          >
            <span className={styles.rankNum}>{entry.rank}</span>
            <Avatar entry={entry} size={40} />
            <div className={styles.rankInfo}>
              <span className={styles.rankName}>
                {entry.displayName}
                {entry.isCurrentUser && <span className={styles.youBadge}>YOU</span>}
              </span>
            </div>
            <div className={styles.rankPoints}>
              <Zap size={14} style={{ color: '#fbbf24' }} />
              {entry.points.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Your Stats */}
      <div className={styles.myStats}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <TrendingUp size={18} style={{ color: '#60a5fa' }} />
            <div className={styles.statValue}>{data.myRank ? `#${data.myRank}` : '—'}</div>
            <div className={styles.statLabel}>Rank</div>
          </div>
          <div className={styles.statCard}>
            <Zap size={18} style={{ color: '#fbbf24' }} />
            <div className={styles.statValue}>{data.myPoints.toLocaleString()}</div>
            <div className={styles.statLabel}>Points</div>
          </div>
          <div className={styles.statCard}>
            <Flame size={18} style={{ color: '#f97316' }} />
            <div className={styles.statValue}>{data.myStreak}d</div>
            <div className={styles.statLabel}>Streak</div>
          </div>
        </div>
      </div>

      {/* Scoring */}
      <div className={styles.scoringGuide}>
        <h3>How Points Work</h3>
        <div className={styles.scoringGrid}>
          <div className={styles.scoringItem}><BookOpen size={14} style={{ color: '#34d399' }} /><span>Reading = 1pt</span></div>
          <div className={styles.scoringItem}><Headphones size={14} style={{ color: '#60a5fa' }} /><span>Listening = 1pt</span></div>
          <div className={styles.scoringItem}><Pencil size={14} style={{ color: '#a78bfa' }} /><span>Writing = 3pts</span></div>
          <div className={styles.scoringItem}><Mic size={14} style={{ color: '#f97316' }} /><span>Speaking = 2pts</span></div>
        </div>
      </div>
    </div>
  );
}
