'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/Achievements.module.scss';

// Achievement definitions
export interface Achievement {
  id: string;
  icon: string;
  name: string;
  description: string;
  category: 'practice' | 'streak' | 'score' | 'challenge' | 'special';
  requirement: number;
  secret?: boolean;
}

export interface UserAchievement {
  id: string;
  unlockedAt: string;
  seen: boolean;
}

export interface AchievementProgress {
  textsWritten: number;
  task1Count: number;
  task2Count: number;
  perfectScores: number;
  currentStreak: number;
  longestStreak: number;
  challengesCompleted: number;
  totalWords: number;
  nightOwlSessions: number;
  earlyBirdSessions: number;
  speedRuns: number; // completed under 10 min
}

// All achievements
export const ACHIEVEMENTS: Achievement[] = [
  // Practice achievements
  { id: 'first_text', icon: '✍️', name: 'First Steps', description: 'Complete your first text', category: 'practice', requirement: 1 },
  { id: 'texts_10', icon: '📝', name: 'Beginner Writer', description: 'Complete 10 texts', category: 'practice', requirement: 10 },
  { id: 'texts_25', icon: '📚', name: 'Dedicated Writer', description: 'Complete 25 texts', category: 'practice', requirement: 25 },
  { id: 'texts_50', icon: '🎓', name: 'Experienced Writer', description: 'Complete 50 texts', category: 'practice', requirement: 50 },
  { id: 'texts_100', icon: '👑', name: 'Writing Master', description: 'Complete 100 texts', category: 'practice', requirement: 100 },
  
  // Task specific
  { id: 'task1_master', icon: '✉️', name: 'Email Master', description: 'Complete 20 Task 1', category: 'practice', requirement: 20 },
  { id: 'task2_master', icon: '📋', name: 'Survey Master', description: 'Complete 20 Task 2', category: 'practice', requirement: 20 },
  
  // Streak achievements
  { id: 'streak_3', icon: '🔥', name: 'On Fire', description: 'Maintain a 3-day streak', category: 'streak', requirement: 3 },
  { id: 'streak_7', icon: '🔥', name: 'Perfect Week', description: 'Maintain a 7-day streak', category: 'streak', requirement: 7 },
  { id: 'streak_14', icon: '💪', name: 'Two Weeks Strong', description: 'Maintain a 14-day streak', category: 'streak', requirement: 14 },
  { id: 'streak_30', icon: '🏆', name: 'Undefeated Month', description: 'Maintain a 30-day streak', category: 'streak', requirement: 30 },
  
  // Score achievements
  { id: 'perfect_1', icon: '⭐', name: 'Perfection', description: 'Score 12/12', category: 'score', requirement: 1 },
  { id: 'perfect_5', icon: '🌟', name: 'Consistency', description: 'Score 12/12 five times', category: 'score', requirement: 5 },
  { id: 'perfect_10', icon: '💫', name: 'Excellence', description: 'Score 12/12 ten times', category: 'score', requirement: 10 },
  
  // Challenge achievements
  { id: 'challenge_1', icon: '🎯', name: 'Challenger', description: 'Complete your first daily challenge', category: 'challenge', requirement: 1 },
  { id: 'challenge_7', icon: '🗓️', name: 'Challenge Week', description: 'Complete 7 daily challenges', category: 'challenge', requirement: 7 },
  { id: 'challenge_30', icon: '🏅', name: 'Monthly Champion', description: 'Complete 30 daily challenges', category: 'challenge', requirement: 30 },
  
  // Special achievements
  { id: 'words_10k', icon: '📖', name: 'Prolific', description: 'Write 10,000 words total', category: 'special', requirement: 10000 },
  { id: 'words_50k', icon: '📕', name: 'Novelist', description: 'Write 50,000 words total', category: 'special', requirement: 50000 },
  { id: 'night_owl', icon: '🦉', name: 'Night Owl', description: 'Practice 5 times after midnight', category: 'special', requirement: 5 },
  { id: 'early_bird', icon: '🐦', name: 'Madrugador', description: 'Pratique 5 vezes antes das 7h', category: 'special', requirement: 5 },
  { id: 'speed_demon', icon: '⚡', name: 'Velocista', description: 'Complete 5 textos em menos de 10 min', category: 'special', requirement: 5 },
  
  // Secret achievements
  { id: 'secret_perfectweek', icon: '🌈', name: 'Arco-Íris', description: 'Semana perfeita: 7 dias + todos 12/12', category: 'special', requirement: 1, secret: true },
];

const STORAGE_KEY = 'celpip_achievements';
const PROGRESS_KEY = 'celpip_achievement_progress';

// Get user achievements
export function getUserAchievements(): UserAchievement[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Get achievement progress
export function getAchievementProgress(): AchievementProgress {
  if (typeof window === 'undefined') {
    return {
      textsWritten: 0,
      task1Count: 0,
      task2Count: 0,
      perfectScores: 0,
      currentStreak: 0,
      longestStreak: 0,
      challengesCompleted: 0,
      totalWords: 0,
      nightOwlSessions: 0,
      earlyBirdSessions: 0,
      speedRuns: 0,
    };
  }
  try {
    const saved = localStorage.getItem(PROGRESS_KEY);
    if (saved) return JSON.parse(saved);
    
    // Try to initialize from existing stats
    const stats = localStorage.getItem('celpip_detailed_stats');
    if (stats) {
      const parsed = JSON.parse(stats);
      return {
        textsWritten: (parsed.task1?.totalSessions || 0) + (parsed.task2?.totalSessions || 0),
        task1Count: parsed.task1?.totalSessions || 0,
        task2Count: parsed.task2?.totalSessions || 0,
        perfectScores: 0,
        currentStreak: parsed.currentStreak || 0,
        longestStreak: parsed.longestStreak || 0,
        challengesCompleted: 0,
        totalWords: (parsed.task1?.totalWords || 0) + (parsed.task2?.totalWords || 0),
        nightOwlSessions: 0,
        earlyBirdSessions: 0,
        speedRuns: 0,
      };
    }
    return {
      textsWritten: 0,
      task1Count: 0,
      task2Count: 0,
      perfectScores: 0,
      currentStreak: 0,
      longestStreak: 0,
      challengesCompleted: 0,
      totalWords: 0,
      nightOwlSessions: 0,
      earlyBirdSessions: 0,
      speedRuns: 0,
    };
  } catch {
    return {
      textsWritten: 0,
      task1Count: 0,
      task2Count: 0,
      perfectScores: 0,
      currentStreak: 0,
      longestStreak: 0,
      challengesCompleted: 0,
      totalWords: 0,
      nightOwlSessions: 0,
      earlyBirdSessions: 0,
      speedRuns: 0,
    };
  }
}

// Save progress
function saveProgress(progress: AchievementProgress): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

// Unlock achievement
export function unlockAchievement(id: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const achievements = getUserAchievements();
  if (achievements.find(a => a.id === id)) return false;
  
  achievements.push({
    id,
    unlockedAt: new Date().toISOString(),
    seen: false,
  });
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
  return true;
}

// Mark achievement as seen
export function markAchievementSeen(id: string): void {
  if (typeof window === 'undefined') return;
  
  const achievements = getUserAchievements();
  const achievement = achievements.find(a => a.id === id);
  if (achievement) {
    achievement.seen = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
  }
}

// Check and unlock achievements based on progress
export function checkAchievements(progress: AchievementProgress): string[] {
  const newlyUnlocked: string[] = [];
  
  // Practice achievements
  if (progress.textsWritten >= 1 && unlockAchievement('first_text')) newlyUnlocked.push('first_text');
  if (progress.textsWritten >= 10 && unlockAchievement('texts_10')) newlyUnlocked.push('texts_10');
  if (progress.textsWritten >= 25 && unlockAchievement('texts_25')) newlyUnlocked.push('texts_25');
  if (progress.textsWritten >= 50 && unlockAchievement('texts_50')) newlyUnlocked.push('texts_50');
  if (progress.textsWritten >= 100 && unlockAchievement('texts_100')) newlyUnlocked.push('texts_100');
  
  // Task specific
  if (progress.task1Count >= 20 && unlockAchievement('task1_master')) newlyUnlocked.push('task1_master');
  if (progress.task2Count >= 20 && unlockAchievement('task2_master')) newlyUnlocked.push('task2_master');
  
  // Streak
  if (progress.longestStreak >= 3 && unlockAchievement('streak_3')) newlyUnlocked.push('streak_3');
  if (progress.longestStreak >= 7 && unlockAchievement('streak_7')) newlyUnlocked.push('streak_7');
  if (progress.longestStreak >= 14 && unlockAchievement('streak_14')) newlyUnlocked.push('streak_14');
  if (progress.longestStreak >= 30 && unlockAchievement('streak_30')) newlyUnlocked.push('streak_30');
  
  // Score
  if (progress.perfectScores >= 1 && unlockAchievement('perfect_1')) newlyUnlocked.push('perfect_1');
  if (progress.perfectScores >= 5 && unlockAchievement('perfect_5')) newlyUnlocked.push('perfect_5');
  if (progress.perfectScores >= 10 && unlockAchievement('perfect_10')) newlyUnlocked.push('perfect_10');
  
  // Challenge
  if (progress.challengesCompleted >= 1 && unlockAchievement('challenge_1')) newlyUnlocked.push('challenge_1');
  if (progress.challengesCompleted >= 7 && unlockAchievement('challenge_7')) newlyUnlocked.push('challenge_7');
  if (progress.challengesCompleted >= 30 && unlockAchievement('challenge_30')) newlyUnlocked.push('challenge_30');
  
  // Special
  if (progress.totalWords >= 10000 && unlockAchievement('words_10k')) newlyUnlocked.push('words_10k');
  if (progress.totalWords >= 50000 && unlockAchievement('words_50k')) newlyUnlocked.push('words_50k');
  if (progress.nightOwlSessions >= 5 && unlockAchievement('night_owl')) newlyUnlocked.push('night_owl');
  if (progress.earlyBirdSessions >= 5 && unlockAchievement('early_bird')) newlyUnlocked.push('early_bird');
  if (progress.speedRuns >= 5 && unlockAchievement('speed_demon')) newlyUnlocked.push('speed_demon');
  
  return newlyUnlocked;
}

// Record a practice session and check achievements
export function recordPracticeForAchievements(
  task: 'task1' | 'task2',
  wordCount: number,
  score: number,
  timeMinutes: number,
  isChallenge: boolean = false
): string[] {
  const progress = getAchievementProgress();
  const hour = new Date().getHours();
  
  // Update counts
  progress.textsWritten += 1;
  if (task === 'task1') progress.task1Count += 1;
  if (task === 'task2') progress.task2Count += 1;
  progress.totalWords += wordCount;
  
  // Perfect score
  if (score === 12) {
    progress.perfectScores += 1;
  }
  
  // Challenge
  if (isChallenge) {
    progress.challengesCompleted += 1;
  }
  
  // Time-based
  if (hour >= 0 && hour < 5) {
    progress.nightOwlSessions += 1;
  }
  if (hour >= 5 && hour < 7) {
    progress.earlyBirdSessions += 1;
  }
  
  // Speed run
  if (timeMinutes < 10 && wordCount >= 150) {
    progress.speedRuns += 1;
  }
  
  // Update streak from detailed stats
  try {
    const stats = localStorage.getItem('celpip_detailed_stats');
    if (stats) {
      const parsed = JSON.parse(stats);
      progress.currentStreak = parsed.currentStreak || 0;
      progress.longestStreak = Math.max(progress.longestStreak, parsed.longestStreak || 0);
    }
  } catch {}
  
  saveProgress(progress);
  return checkAchievements(progress);
}

// Get unseen achievements
export function getUnseenAchievements(): Achievement[] {
  const userAchievements = getUserAchievements();
  const unseen = userAchievements.filter(ua => !ua.seen);
  return unseen
    .map(ua => ACHIEVEMENTS.find(a => a.id === ua.id))
    .filter((a): a is Achievement => a !== undefined);
}

// Component props
interface AchievementsProps {
  mode?: 'full' | 'compact';
  onNewAchievement?: (achievement: Achievement) => void;
}

export default function Achievements({ mode = 'full' }: AchievementsProps) {
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [progress, setProgress] = useState<AchievementProgress | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUserAchievements(getUserAchievements());
    setProgress(getAchievementProgress());
  }, []);

  if (!mounted) return null;

  const unlockedIds = new Set(userAchievements.map(a => a.id));
  const unlockedCount = userAchievements.length;
  const totalCount = ACHIEVEMENTS.filter(a => !a.secret).length;

  const categories = [
    { id: 'all', label: 'Todas', icon: '🏆' },
    { id: 'practice', label: 'Practice', icon: '✍️' },
    { id: 'streak', label: 'Streaks', icon: '🔥' },
    { id: 'score', label: 'Pontuação', icon: '⭐' },
    { id: 'challenge', label: 'Challenges', icon: '🎯' },
    { id: 'special', label: 'Especiais', icon: '💎' },
  ];

  const filteredAchievements = ACHIEVEMENTS.filter(a => {
    if (a.secret && !unlockedIds.has(a.id)) return false;
    if (selectedCategory === 'all') return true;
    return a.category === selectedCategory;
  });

  if (mode === 'compact') {
    const recentUnlocked = userAchievements
      .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
      .slice(0, 3);
    
    return (
      <div className={styles.compactContainer}>
        <div className={styles.compactHeader}>
          <h4>🏆 Conquistas</h4>
          <span className={styles.count}>{unlockedCount}/{totalCount}</span>
        </div>
        
        <div className={styles.compactProgress}>
          <div 
            className={styles.compactProgressBar}
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
        
        <div className={styles.compactBadges}>
          {recentUnlocked.length > 0 ? (
            recentUnlocked.map(ua => {
              const achievement = ACHIEVEMENTS.find(a => a.id === ua.id);
              if (!achievement) return null;
              return (
                <div key={ua.id} className={styles.compactBadge} title={achievement.name}>
                  {achievement.icon}
                </div>
              );
            })
          ) : (
            <span className={styles.noBadges}>Nenhuma conquista ainda</span>
          )}
          {unlockedCount > 3 && (
            <span className={styles.moreBadges}>+{unlockedCount - 3}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h3>🏆 Conquistas</h3>
          <span className={styles.subtitle}>
            {unlockedCount} de {totalCount} desbloqueadas
          </span>
        </div>
        <div className={styles.progressCircle}>
          <svg viewBox="0 0 36 36">
            <path
              className={styles.progressBg}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={styles.progressFill}
              strokeDasharray={`${(unlockedCount / totalCount) * 100}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className={styles.progressText}>
            {Math.round((unlockedCount / totalCount) * 100)}%
          </span>
        </div>
      </div>

      {/* Category Filter */}
      <div className={styles.categories}>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`${styles.categoryBtn} ${selectedCategory === cat.id ? styles.active : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className={styles.grid}>
        {filteredAchievements.map(achievement => {
          const isUnlocked = unlockedIds.has(achievement.id);
          const userAchievement = userAchievements.find(a => a.id === achievement.id);
          
          return (
            <div 
              key={achievement.id}
              className={`${styles.achievementCard} ${isUnlocked ? styles.unlocked : styles.locked}`}
            >
              <div className={styles.achievementIcon}>
                {isUnlocked ? achievement.icon : '🔒'}
              </div>
              <div className={styles.achievementInfo}>
                <h4>{isUnlocked ? achievement.name : '???'}</h4>
                <p>{isUnlocked ? achievement.description : 'Continue praticando para desbloquear'}</p>
                {isUnlocked && userAchievement && (
                  <span className={styles.unlockedDate}>
                    Desbloqueado em {new Date(userAchievement.unlockedAt).toLocaleDateString('pt-BR')}
                  </span>
                )}
              </div>
              {isUnlocked && (
                <div className={styles.checkmark}>✓</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Stats */}
      {progress && (
        <div className={styles.statsSection}>
          <h4>📊 Seu Progresso</h4>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{progress.textsWritten}</span>
              <span className={styles.statLabel}>Textos</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{progress.totalWords.toLocaleString()}</span>
              <span className={styles.statLabel}>Palavras</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{progress.perfectScores}</span>
              <span className={styles.statLabel}>Notas 12</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{progress.longestStreak}</span>
              <span className={styles.statLabel}>Maior Streak</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{progress.challengesCompleted}</span>
              <span className={styles.statLabel}>Challenges</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{progress.speedRuns}</span>
              <span className={styles.statLabel}>Speed Runs</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Achievement Toast Notification Component
export function AchievementToast({ achievement, onClose }: { achievement: Achievement; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={styles.toast} onClick={onClose}>
      <div className={styles.toastIcon}>{achievement.icon}</div>
      <div className={styles.toastContent}>
        <span className={styles.toastTitle}>🎉 Conquista Desbloqueada!</span>
        <span className={styles.toastName}>{achievement.name}</span>
        <span className={styles.toastDesc}>{achievement.description}</span>
      </div>
    </div>
  );
}
