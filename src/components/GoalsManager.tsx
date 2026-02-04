'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/Goals.module.scss';

export interface UserGoals {
  weeklyTexts: number;
  targetScore: number;
  examDate: string | null;
  reminderDays: string[];
}

export interface GoalProgress {
  textsThisWeek: number;
  averageScore: number;
  daysUntilExam: number | null;
  streakDays: number;
}

const DEFAULT_GOALS: UserGoals = {
  weeklyTexts: 5,
  targetScore: 9,
  examDate: null,
  reminderDays: ['mon', 'wed', 'fri'],
};

const DAYS = [
  { key: 'mon', label: 'Seg' },
  { key: 'tue', label: 'Ter' },
  { key: 'wed', label: 'Qua' },
  { key: 'thu', label: 'Qui' },
  { key: 'fri', label: 'Sex' },
  { key: 'sat', label: 'Sáb' },
  { key: 'sun', label: 'Dom' },
];

export function loadGoals(): UserGoals {
  if (typeof window === 'undefined') return DEFAULT_GOALS;
  try {
    const saved = localStorage.getItem('celpip_goals');
    return saved ? { ...DEFAULT_GOALS, ...JSON.parse(saved) } : DEFAULT_GOALS;
  } catch {
    return DEFAULT_GOALS;
  }
}

export function saveGoals(goals: UserGoals): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('celpip_goals', JSON.stringify(goals));
}

export function getGoalProgress(): GoalProgress {
  if (typeof window === 'undefined') {
    return { textsThisWeek: 0, averageScore: 0, daysUntilExam: null, streakDays: 0 };
  }
  
  try {
    const stats = localStorage.getItem('celpip_user_stats');
    const goals = loadGoals();
    
    if (!stats) {
      return { textsThisWeek: 0, averageScore: 0, daysUntilExam: null, streakDays: 0 };
    }
    
    const data = JSON.parse(stats);
    const history = data.history || [];
    
    // Calculate texts this week
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const textsThisWeek = history.filter((h: { date: string }) => 
      new Date(h.date) >= weekStart
    ).length;
    
    // Calculate average score
    const scores = history
      .filter((h: { score: number }) => h.score > 0)
      .map((h: { score: number }) => h.score);
    const averageScore = scores.length > 0 
      ? Math.round((scores.reduce((a: number, b: number) => a + b, 0) / scores.length) * 10) / 10
      : 0;
    
    // Days until exam
    let daysUntilExam = null;
    if (goals.examDate) {
      const examDate = new Date(goals.examDate);
      const diffTime = examDate.getTime() - now.getTime();
      daysUntilExam = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    
    // Streak calculation
    const streakDays = data.streakDays || 0;
    
    return { textsThisWeek, averageScore, daysUntilExam, streakDays };
  } catch {
    return { textsThisWeek: 0, averageScore: 0, daysUntilExam: null, streakDays: 0 };
  }
}

interface GoalsManagerProps {
  mode?: 'full' | 'compact';
}

export default function GoalsManager({ mode = 'full' }: GoalsManagerProps) {
  const [goals, setGoals] = useState<UserGoals>(DEFAULT_GOALS);
  const [progress, setProgress] = useState<GoalProgress>({
    textsThisWeek: 0,
    averageScore: 0,
    daysUntilExam: null,
    streakDays: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setGoals(loadGoals());
    setProgress(getGoalProgress());
  }, []);

  const updateGoals = (updates: Partial<UserGoals>) => {
    const newGoals = { ...goals, ...updates };
    setGoals(newGoals);
    saveGoals(newGoals);
  };

  const toggleDay = (day: string) => {
    const newDays = goals.reminderDays.includes(day)
      ? goals.reminderDays.filter(d => d !== day)
      : [...goals.reminderDays, day];
    updateGoals({ reminderDays: newDays });
  };

  if (!mounted) return null;

  // Compact mode for dashboard
  if (mode === 'compact') {
    const weeklyProgress = Math.min((progress.textsThisWeek / goals.weeklyTexts) * 100, 100);
    const scoreProgress = goals.targetScore > 0 
      ? Math.min((progress.averageScore / goals.targetScore) * 100, 100)
      : 0;

    return (
      <div className={styles.compactContainer}>
        <div className={styles.compactHeader}>
          <h4>🎯 Minhas Metas</h4>
          {progress.daysUntilExam !== null && progress.daysUntilExam > 0 && (
            <span className={styles.examBadge}>
              📅 {progress.daysUntilExam} dias para a prova
            </span>
          )}
        </div>
        
        <div className={styles.compactGoals}>
          <div className={styles.compactGoal}>
            <div className={styles.compactGoalHeader}>
              <span>Textos esta semana</span>
              <span className={styles.compactGoalValue}>
                {progress.textsThisWeek}/{goals.weeklyTexts}
              </span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={`${styles.progressFill} ${weeklyProgress >= 100 ? styles.progressComplete : ''}`}
                style={{ width: `${weeklyProgress}%` }}
              />
            </div>
          </div>

          <div className={styles.compactGoal}>
            <div className={styles.compactGoalHeader}>
              <span>Pontuação média</span>
              <span className={styles.compactGoalValue}>
                {progress.averageScore || '-'}/{goals.targetScore}
              </span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={`${styles.progressFill} ${styles.progressScore} ${scoreProgress >= 100 ? styles.progressComplete : ''}`}
                style={{ width: `${scoreProgress}%` }}
              />
            </div>
          </div>
        </div>

        {progress.streakDays > 0 && (
          <div className={styles.streakBadge}>
            🔥 {progress.streakDays} dias seguidos praticando!
          </div>
        )}
      </div>
    );
  }

  // Full mode for settings
  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>📝 Meta Semanal de Textos</h4>
        <p className={styles.sectionDesc}>Quantos textos você quer escrever por semana?</p>
        
        <div className={styles.sliderContainer}>
          <input
            type="range"
            min="1"
            max="14"
            value={goals.weeklyTexts}
            onChange={(e) => updateGoals({ weeklyTexts: parseInt(e.target.value) })}
            className={styles.slider}
          />
          <div className={styles.sliderValue}>
            <span className={styles.sliderNumber}>{goals.weeklyTexts}</span>
            <span className={styles.sliderLabel}>textos/semana</span>
          </div>
        </div>

        <div className={styles.progressPreview}>
          <span>Progresso atual:</span>
          <strong>{progress.textsThisWeek}/{goals.weeklyTexts}</strong>
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>🎯 Pontuação Alvo</h4>
        <p className={styles.sectionDesc}>Qual pontuação você quer alcançar no CELPIP?</p>
        
        <div className={styles.scoreButtons}>
          {[7, 8, 9, 10, 11, 12].map((score) => (
            <button
              key={score}
              className={`${styles.scoreButton} ${goals.targetScore === score ? styles.scoreButtonActive : ''}`}
              onClick={() => updateGoals({ targetScore: score })}
            >
              {score}
            </button>
          ))}
        </div>

        {progress.averageScore > 0 && (
          <div className={styles.progressPreview}>
            <span>Sua média atual:</span>
            <strong className={progress.averageScore >= goals.targetScore ? styles.goalAchieved : ''}>
              {progress.averageScore}
            </strong>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>📅 Data da Prova</h4>
        <p className={styles.sectionDesc}>Quando é sua prova? (opcional)</p>
        
        <input
          type="date"
          value={goals.examDate || ''}
          onChange={(e) => updateGoals({ examDate: e.target.value || null })}
          className={styles.dateInput}
          min={new Date().toISOString().split('T')[0]}
        />

        {progress.daysUntilExam !== null && (
          <div className={`${styles.examCountdown} ${progress.daysUntilExam <= 7 ? styles.examUrgent : ''}`}>
            {progress.daysUntilExam > 0 ? (
              <>
                <span className={styles.countdownNumber}>{progress.daysUntilExam}</span>
                <span className={styles.countdownLabel}>dias até a prova</span>
              </>
            ) : progress.daysUntilExam === 0 ? (
              <span className={styles.examToday}>🎉 Hoje é o dia! Boa sorte!</span>
            ) : (
              <span className={styles.examPassed}>A data da prova já passou</span>
            )}
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>🔔 Practice Days</h4>
        <p className={styles.sectionDesc}>Quais dias você pretende praticar?</p>
        
        <div className={styles.daysGrid}>
          {DAYS.map(({ key, label }) => (
            <button
              key={key}
              className={`${styles.dayButton} ${goals.reminderDays.includes(key) ? styles.dayButtonActive : ''}`}
              onClick={() => toggleDay(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
