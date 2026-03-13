'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Trophy, Flame, Star, Lock, ChevronRight, Zap } from 'lucide-react';
import styles from './learn.module.scss';

interface Level {
  id: number; number: number; name: string; theme: string;
  cefr: string; clb: string; certName: string; totalLessons: number;
  isFree: boolean; lessonsCount: number; locked: boolean;
}

interface Progress {
  currentLevel: number; currentLesson: number; totalXp: number;
  streakDays: number; wordsLearned: number; lessonsCompleted: number;
}

const LEVEL_COLORS = ['#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#f59e0b'];
const LEVEL_EMOJIS = ['🟢', '🩵', '🔵', '🟣', '🏆'];

export default function LearnPage() {
  const router = useRouter();
  const [levels, setLevels] = useState<Level[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/english/levels')
      .then(r => r.json())
      .then(data => {
        setLevels(data.levels || []);
        setProgress(data.progress);
        setCompletedIds(data.completedLessonIds || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className={styles.container}>
      <div className={styles.loading}>
        <BookOpen size={48} className={styles.loadingIcon} />
        <p>Loading your journey...</p>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {/* Hero Stats */}
      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <Flame size={20} color="#f59e0b" />
          <span className={styles.statValue}>{progress?.streakDays || 0}</span>
          <span className={styles.statLabel}>day streak</span>
        </div>
        <div className={styles.stat}>
          <Zap size={20} color="#8b5cf6" />
          <span className={styles.statValue}>{progress?.totalXp || 0}</span>
          <span className={styles.statLabel}>XP</span>
        </div>
        <div className={styles.stat}>
          <Star size={20} color="#22c55e" />
          <span className={styles.statValue}>{progress?.lessonsCompleted || 0}</span>
          <span className={styles.statLabel}>lessons</span>
        </div>
        <div className={styles.stat}>
          <BookOpen size={20} color="#06b6d4" />
          <span className={styles.statValue}>{progress?.wordsLearned || 0}</span>
          <span className={styles.statLabel}>words</span>
        </div>
      </div>

      {/* Level Map */}
      {/* Brand Header */}
      <div className={styles.brandHeader}>
        <div className={styles.brandLogo}>🍁</div>
        <h1 className={styles.title}>English for Citizenship</h1>
        <p className={styles.subtitle}>
          Prepare for your Canadian Citizenship Test — based on the official Discover Canada guide.
        </p>
      </div>

      <div className={styles.levelMap}>
        {levels.map((level, idx) => {
          const color = LEVEL_COLORS[idx] || '#6b7280';
          const emoji = LEVEL_EMOJIS[idx] || '📚';
          const isActive = level.number === (progress?.currentLevel || 1);
          const isCompleted = (progress?.currentLevel || 1) > level.number;
          const isLocked = level.number > (progress?.currentLevel || 1) + 1;

          return (
            <div
              key={level.id}
              className={`${styles.levelCard} ${isActive ? styles.active : ''} ${isLocked ? styles.locked : ''}`}
              style={{ '--level-color': color } as React.CSSProperties}
              onClick={() => !isLocked && router.push(`/english/level/${level.id}`)}
            >
              <div className={styles.levelHeader}>
                <span className={styles.levelEmoji}>{emoji}</span>
                <div className={styles.levelInfo}>
                  <h2 className={styles.levelName}>Level {level.number}: {level.name}</h2>
                  <p className={styles.levelTheme}>{level.theme}</p>
                </div>
                {isLocked ? (
                  <Lock size={24} className={styles.lockIcon} />
                ) : (
                  <ChevronRight size={24} className={styles.chevron} />
                )}
              </div>

              <div className={styles.levelMeta}>
                <span className={styles.badge}>{level.cefr}</span>
                <span className={styles.badge}>{level.clb}</span>
                <span className={styles.badge}>{level.totalLessons} lessons</span>
                {level.isFree && <span className={styles.freeBadge}>FREE</span>}
              </div>

              {isActive && (
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${Math.min(100, ((progress?.currentLesson || 1) - 1) / level.totalLessons * 100)}%` }}
                  />
                </div>
              )}

              {isCompleted && (
                <div className={styles.completedBadge}>
                  <Trophy size={16} /> {level.certName} ✓
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
