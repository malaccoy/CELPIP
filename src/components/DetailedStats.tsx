'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/Stats.module.scss';

interface UserStats {
  totalTexts: number;
  totalWords: number;
  totalTimeMinutes: number;
  task1Count: number;
  task2Count: number;
  bestScoreTask1: number;
  bestScoreTask2: number;
  averageScore: number;
  streakDays: number;
  lastPracticeDate: string | null;
  weeklyTexts: number[];
  scoreHistory: { date: string; score: number; task: string }[];
}

const DEFAULT_STATS: UserStats = {
  totalTexts: 0,
  totalWords: 0,
  totalTimeMinutes: 0,
  task1Count: 0,
  task2Count: 0,
  bestScoreTask1: 0,
  bestScoreTask2: 0,
  averageScore: 0,
  streakDays: 0,
  lastPracticeDate: null,
  weeklyTexts: [0, 0, 0, 0, 0, 0, 0],
  scoreHistory: [],
};

export function loadStats(): UserStats {
  if (typeof window === 'undefined') return DEFAULT_STATS;
  try {
    const saved = localStorage.getItem('celpip_user_stats');
    if (saved) {
      return { ...DEFAULT_STATS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to load stats:', e);
  }
  return DEFAULT_STATS;
}

export function saveStats(stats: UserStats): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('celpip_user_stats', JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats:', e);
  }
}

export function recordPractice(task: 'task1' | 'task2', wordCount: number, score: number, timeMinutes: number): void {
  const stats = loadStats();
  const today = new Date().toISOString().split('T')[0];
  const dayOfWeek = new Date().getDay();
  
  // Update totals
  stats.totalTexts++;
  stats.totalWords += wordCount;
  stats.totalTimeMinutes += timeMinutes;
  
  // Update task counts
  if (task === 'task1') {
    stats.task1Count++;
    stats.bestScoreTask1 = Math.max(stats.bestScoreTask1, score);
  } else {
    stats.task2Count++;
    stats.bestScoreTask2 = Math.max(stats.bestScoreTask2, score);
  }
  
  // Update average score
  const totalScores = stats.scoreHistory.length > 0 
    ? stats.scoreHistory.reduce((sum, s) => sum + s.score, 0) + score
    : score;
  stats.averageScore = Math.round((totalScores / (stats.scoreHistory.length + 1)) * 10) / 10;
  
  // Update streak
  if (stats.lastPracticeDate) {
    const lastDate = new Date(stats.lastPracticeDate);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      stats.streakDays++;
    } else if (diffDays > 1) {
      stats.streakDays = 1;
    }
  } else {
    stats.streakDays = 1;
  }
  stats.lastPracticeDate = today;
  
  // Update weekly texts
  stats.weeklyTexts[dayOfWeek]++;
  
  // Add to history (keep last 30)
  stats.scoreHistory.push({ date: today, score, task });
  if (stats.scoreHistory.length > 30) {
    stats.scoreHistory = stats.scoreHistory.slice(-30);
  }
  
  saveStats(stats);
}

export function DetailedStats() {
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStats(loadStats());
  }, []);

  if (!mounted) {
    return <div className={styles.statsLoading}>Carregando estatísticas...</div>;
  }

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const maxWeekly = Math.max(...stats.weeklyTexts, 1);
  
  const avgTimePerText = stats.totalTexts > 0 
    ? Math.round(stats.totalTimeMinutes / stats.totalTexts) 
    : 0;

  return (
    <div className={styles.statsContainer}>
      {/* Overview Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📝</div>
          <div className={styles.statValue}>{stats.totalTexts}</div>
          <div className={styles.statLabel}>Textos Escritos</div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📖</div>
          <div className={styles.statValue}>{stats.totalWords.toLocaleString()}</div>
          <div className={styles.statLabel}>Palavras Totais</div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏱️</div>
          <div className={styles.statValue}>{avgTimePerText}min</div>
          <div className={styles.statLabel}>Tempo Médio/Texto</div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🔥</div>
          <div className={styles.statValue}>{stats.streakDays}</div>
          <div className={styles.statLabel}>Dias Seguidos</div>
        </div>
      </div>

      {/* Best Scores */}
      <div className={styles.scoresSection}>
        <h4 className={styles.sectionTitle}>🏆 Melhores Pontuações</h4>
        <div className={styles.scoresGrid}>
          <div className={styles.scoreCard}>
            <div className={styles.scoreTask}>Task 1</div>
            <div className={styles.scoreValue}>
              {stats.bestScoreTask1 > 0 ? stats.bestScoreTask1 : '-'}
              {stats.bestScoreTask1 > 0 && <span>/12</span>}
            </div>
            <div className={styles.scoreCount}>{stats.task1Count} textos</div>
          </div>
          
          <div className={styles.scoreCard}>
            <div className={styles.scoreTask}>Task 2</div>
            <div className={styles.scoreValue}>
              {stats.bestScoreTask2 > 0 ? stats.bestScoreTask2 : '-'}
              {stats.bestScoreTask2 > 0 && <span>/12</span>}
            </div>
            <div className={styles.scoreCount}>{stats.task2Count} textos</div>
          </div>
          
          <div className={styles.scoreCard}>
            <div className={styles.scoreTask}>Média Geral</div>
            <div className={styles.scoreValue}>
              {stats.averageScore > 0 ? stats.averageScore : '-'}
              {stats.averageScore > 0 && <span>/12</span>}
            </div>
            <div className={styles.scoreCount}>últimos 30 textos</div>
          </div>
        </div>
      </div>

      {/* Weekly Activity */}
      <div className={styles.weeklySection}>
        <h4 className={styles.sectionTitle}>📊 Atividade da Semana</h4>
        <div className={styles.weeklyChart}>
          {stats.weeklyTexts.map((count, index) => (
            <div key={index} className={styles.weeklyBar}>
              <div 
                className={styles.weeklyBarFill} 
                style={{ height: `${(count / maxWeekly) * 100}%` }}
              >
                {count > 0 && <span className={styles.weeklyBarValue}>{count}</span>}
              </div>
              <div className={styles.weeklyBarLabel}>{weekDays[index]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent History */}
      {stats.scoreHistory.length > 0 && (
        <div className={styles.historySection}>
          <h4 className={styles.sectionTitle}>📈 Histórico Recente</h4>
          <div className={styles.historyList}>
            {stats.scoreHistory.slice(-10).reverse().map((entry, index) => (
              <div key={index} className={styles.historyItem}>
                <div className={styles.historyDate}>
                  {new Date(entry.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                </div>
                <div className={styles.historyTask}>
                  {entry.task === 'task1' ? 'Task 1' : 'Task 2'}
                </div>
                <div className={styles.historyScore}>
                  <span className={entry.score >= 9 ? styles.scoreHigh : entry.score >= 7 ? styles.scoreMid : styles.scoreLow}>
                    {entry.score}/12
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.totalTexts === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📊</div>
          <p>Nenhuma estatística ainda!</p>
          <p className={styles.emptyHint}>Complete sua primeira prática para começar a acompanhar seu progresso.</p>
        </div>
      )}
    </div>
  );
}

export default DetailedStats;
