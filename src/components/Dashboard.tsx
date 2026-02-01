'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Clock, FileText, TrendingUp, Calendar,
  Target, Award, Flame, Trash2
} from 'lucide-react';
import GoalsManager from '@/components/GoalsManager';
import ErrorReview from '@/components/ErrorReview';
import DailyChallengeWidget from '@/components/DailyChallenge';
import styles from '@/styles/Dashboard.module.scss';

interface PracticeSession {
  id: string;
  task: 'task1' | 'task2';
  date: string;
  wordCount: number;
  timeUsed: number; // seconds
  completed: boolean;
  examMode: boolean;
}

interface DashboardStats {
  totalSessions: number;
  totalWords: number;
  avgWordsPerSession: number;
  avgTimePerSession: number;
  task1Sessions: number;
  task2Sessions: number;
  examModeSessions: number;
  completionRate: number;
  streak: number;
  lastPractice: string | null;
}

const STORAGE_KEY = 'celpip_practice_history';

export function savePracticeSession(session: Omit<PracticeSession, 'id' | 'date'>) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const sessions: PracticeSession[] = stored ? JSON.parse(stored) : [];
    
    const newSession: PracticeSession = {
      ...session,
      id: `session_${Date.now()}`,
      date: new Date().toISOString(),
    };
    
    sessions.unshift(newSession);
    
    // Keep only last 100 sessions
    const trimmed = sessions.slice(0, 100);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    
    return newSession;
  } catch (e) {
    console.error('Failed to save practice session:', e);
    return null;
  }
}

export default function Dashboard() {
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const loadedSessions: PracticeSession[] = stored ? JSON.parse(stored) : [];
      setSessions(loadedSessions);
      setStats(calculateStats(loadedSessions));
    } catch (e) {
      console.error('Failed to load practice history:', e);
    }
  };

  const calculateStats = (sessions: PracticeSession[]): DashboardStats => {
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        totalWords: 0,
        avgWordsPerSession: 0,
        avgTimePerSession: 0,
        task1Sessions: 0,
        task2Sessions: 0,
        examModeSessions: 0,
        completionRate: 0,
        streak: 0,
        lastPractice: null,
      };
    }

    const totalWords = sessions.reduce((sum, s) => sum + s.wordCount, 0);
    const totalTime = sessions.reduce((sum, s) => sum + s.timeUsed, 0);
    const completed = sessions.filter(s => s.completed).length;
    
    // Calculate streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sortedByDate = [...sessions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    let checkDate = new Date(today);
    for (const session of sortedByDate) {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((checkDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0 || diffDays === 1) {
        streak++;
        checkDate = sessionDate;
      } else {
        break;
      }
    }

    return {
      totalSessions: sessions.length,
      totalWords,
      avgWordsPerSession: Math.round(totalWords / sessions.length),
      avgTimePerSession: Math.round(totalTime / sessions.length),
      task1Sessions: sessions.filter(s => s.task === 'task1').length,
      task2Sessions: sessions.filter(s => s.task === 'task2').length,
      examModeSessions: sessions.filter(s => s.examMode).length,
      completionRate: Math.round((completed / sessions.length) * 100),
      streak,
      lastPractice: sessions[0]?.date || null,
    };
  };

  const clearHistory = () => {
    if (confirm('Tem certeza que deseja apagar todo o histórico de práticas?')) {
      localStorage.removeItem(STORAGE_KEY);
      setSessions([]);
      setStats(calculateStats([]));
    }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatLastPractice = (isoString: string | null) => {
    if (!isoString) return 'Nunca';
    
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return 'Agora há pouco';
    if (diffHours < 24) return `Há ${diffHours}h`;
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `Há ${diffDays} dias`;
    return formatDate(isoString);
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeader}>
        <div className={styles.dashboardTitle}>
          <BarChart3 size={28} />
          <div>
            <h1>Dashboard de Progresso</h1>
            <p>Acompanhe sua evolução no CELPIP Writing</p>
          </div>
        </div>
        <div className={styles.dashboardTabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'overview' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Visão Geral
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'history' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Histórico
          </button>
        </div>
      </div>

      {activeTab === 'overview' && stats && (
        <div className={styles.overviewGrid}>
          {/* Main Stats */}
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FileText />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.totalSessions}</span>
              <span className={styles.statLabel}>Práticas Totais</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statIconPurple}`}>
              <TrendingUp />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.avgWordsPerSession}</span>
              <span className={styles.statLabel}>Média de Palavras</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statIconCyan}`}>
              <Clock />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{formatTime(stats.avgTimePerSession)}</span>
              <span className={styles.statLabel}>Tempo Médio</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statIconGreen}`}>
              <Target />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.completionRate}%</span>
              <span className={styles.statLabel}>Taxa de Conclusão</span>
            </div>
          </div>

          {/* Streak & Last Practice */}
          <div className={styles.highlightCard}>
            <div className={styles.highlightContent}>
              <Flame className={styles.highlightIcon} />
              <div>
                <span className={styles.highlightValue}>{stats.streak}</span>
                <span className={styles.highlightLabel}>Dias de Streak</span>
              </div>
            </div>
            <p className={styles.highlightHint}>
              Pratique todo dia para manter sua sequência!
            </p>
          </div>

          <div className={styles.highlightCard}>
            <div className={styles.highlightContent}>
              <Calendar className={styles.highlightIcon} />
              <div>
                <span className={styles.highlightValue}>{formatLastPractice(stats.lastPractice)}</span>
                <span className={styles.highlightLabel}>Última Prática</span>
              </div>
            </div>
            <p className={styles.highlightHint}>
              {stats.lastPractice ? 'Continue praticando!' : 'Comece sua primeira prática!'}
            </p>
          </div>

          {/* Task Distribution */}
          <div className={styles.distributionCard}>
            <h3><Award size={18} /> Distribuição por Task</h3>
            <div className={styles.distributionBars}>
              <div className={styles.distributionItem}>
                <span className={styles.distributionLabel}>Task 1 (Email)</span>
                <div className={styles.distributionBar}>
                  <div 
                    className={styles.distributionFill}
                    style={{ 
                      width: stats.totalSessions > 0 
                        ? `${(stats.task1Sessions / stats.totalSessions) * 100}%` 
                        : '0%' 
                    }}
                  />
                </div>
                <span className={styles.distributionValue}>{stats.task1Sessions}</span>
              </div>
              <div className={styles.distributionItem}>
                <span className={styles.distributionLabel}>Task 2 (Survey)</span>
                <div className={styles.distributionBar}>
                  <div 
                    className={`${styles.distributionFill} ${styles.distributionFillPurple}`}
                    style={{ 
                      width: stats.totalSessions > 0 
                        ? `${(stats.task2Sessions / stats.totalSessions) * 100}%` 
                        : '0%' 
                    }}
                  />
                </div>
                <span className={styles.distributionValue}>{stats.task2Sessions}</span>
              </div>
              <div className={styles.distributionItem}>
                <span className={styles.distributionLabel}>Modo Exame</span>
                <div className={styles.distributionBar}>
                  <div 
                    className={`${styles.distributionFill} ${styles.distributionFillGreen}`}
                    style={{ 
                      width: stats.totalSessions > 0 
                        ? `${(stats.examModeSessions / stats.totalSessions) * 100}%` 
                        : '0%' 
                    }}
                  />
                </div>
                <span className={styles.distributionValue}>{stats.examModeSessions}</span>
              </div>
            </div>
          </div>

          {/* Total Words */}
          <div className={styles.totalCard}>
            <div className={styles.totalContent}>
              <span className={styles.totalValue}>{stats.totalWords.toLocaleString()}</span>
              <span className={styles.totalLabel}>Palavras Escritas</span>
            </div>
            <p className={styles.totalHint}>
              {stats.totalWords >= 10000 
                ? '🏆 Incrível! Você já escreveu mais de 10.000 palavras!'
                : stats.totalWords >= 5000
                  ? '🌟 Ótimo progresso! Continue assim!'
                  : stats.totalWords >= 1000
                    ? '💪 Bom começo! Continue praticando!'
                    : '✏️ Comece a praticar para ver seu progresso aqui!'}
            </p>
          </div>

          {/* Daily Challenge Widget */}
          <div className={styles.challengeWidget}>
            <DailyChallengeWidget mode="compact" />
          </div>

          {/* Goals Widget */}
          <div className={styles.goalsWidget}>
            <GoalsManager mode="compact" />
          </div>

          {/* Errors Widget */}
          <div className={styles.errorsWidget}>
            <ErrorReview mode="compact" />
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className={styles.historySection}>
          <div className={styles.historyHeader}>
            <span>{sessions.length} práticas registradas</span>
            {sessions.length > 0 && (
              <button className={styles.clearBtn} onClick={clearHistory}>
                <Trash2 size={14} /> Limpar Histórico
              </button>
            )}
          </div>
          
          {sessions.length === 0 ? (
            <div className={styles.emptyHistory}>
              <FileText size={48} />
              <h3>Nenhuma prática registrada</h3>
              <p>Complete uma prática para ver seu histórico aqui.</p>
            </div>
          ) : (
            <div className={styles.historyList}>
              {sessions.map(session => (
                <div key={session.id} className={styles.historyItem}>
                  <div className={styles.historyItemIcon}>
                    {session.task === 'task1' ? '✉️' : '📋'}
                  </div>
                  <div className={styles.historyItemInfo}>
                    <span className={styles.historyItemTitle}>
                      {session.task === 'task1' ? 'Task 1 — Email' : 'Task 2 — Survey'}
                      {session.examMode && <span className={styles.examBadge}>EXAME</span>}
                    </span>
                    <span className={styles.historyItemMeta}>
                      {formatDate(session.date)}
                    </span>
                  </div>
                  <div className={styles.historyItemStats}>
                    <span>{session.wordCount} palavras</span>
                    <span>{formatTime(session.timeUsed)}</span>
                  </div>
                  <div className={`${styles.historyItemStatus} ${session.completed ? styles.completed : styles.incomplete}`}>
                    {session.completed ? '✓' : '✗'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
