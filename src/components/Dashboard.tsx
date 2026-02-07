'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, Clock, TrendingUp, Flame, Calendar,
  PenLine, Mic, BookOpen, Headphones, ArrowRight,
  Target, Trophy, Sparkles
} from 'lucide-react';
import styles from '@/styles/Dashboard.module.scss';

interface ModuleStats {
  sessions: number;
  lastPractice: string | null;
  avgScore?: number;
}

interface DashboardData {
  writing: ModuleStats;
  speaking: ModuleStats;
  reading: ModuleStats;
  listening: ModuleStats;
  totalSessions: number;
  streak: number;
  lastPractice: string | null;
}

const STORAGE_KEYS = {
  writing: 'celpip_practice_history',
  speaking: 'celpip_speaking_history',
  reading: 'celpip_reading_history',
  listening: 'celpip_listening_history',
};

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    try {
      const writing = loadModuleData('writing');
      const speaking = loadModuleData('speaking');
      const reading = loadModuleData('reading');
      const listening = loadModuleData('listening');

      const allDates = [
        writing.lastPractice,
        speaking.lastPractice,
        reading.lastPractice,
        listening.lastPractice,
      ].filter(Boolean).sort((a, b) => 
        new Date(b!).getTime() - new Date(a!).getTime()
      );

      setData({
        writing,
        speaking,
        reading,
        listening,
        totalSessions: writing.sessions + speaking.sessions + reading.sessions + listening.sessions,
        streak: calculateStreak(),
        lastPractice: allDates[0] || null,
      });
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
    }
  };

  const loadModuleData = (module: keyof typeof STORAGE_KEYS): ModuleStats => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS[module]);
      if (!stored) return { sessions: 0, lastPractice: null };
      
      const sessions = JSON.parse(stored);
      if (!Array.isArray(sessions) || sessions.length === 0) {
        return { sessions: 0, lastPractice: null };
      }

      return {
        sessions: sessions.length,
        lastPractice: sessions[0]?.date || null,
        avgScore: sessions[0]?.score,
      };
    } catch {
      return { sessions: 0, lastPractice: null };
    }
  };

  const calculateStreak = (): number => {
    // Simplified streak calculation
    try {
      const allSessions: { date: string }[] = [];
      
      Object.values(STORAGE_KEYS).forEach(key => {
        const stored = localStorage.getItem(key);
        if (stored) {
          const sessions = JSON.parse(stored);
          if (Array.isArray(sessions)) {
            allSessions.push(...sessions);
          }
        }
      });

      if (allSessions.length === 0) return 0;

      const sortedDates = allSessions
        .map(s => new Date(s.date).toDateString())
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = 0; i < sortedDates.length; i++) {
        const sessionDate = new Date(sortedDates[i]);
        sessionDate.setHours(0, 0, 0, 0);
        
        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - i);
        
        if (sessionDate.getTime() === expectedDate.getTime()) {
          streak++;
        } else {
          break;
        }
      }

      return streak;
    } catch {
      return 0;
    }
  };

  const formatLastPractice = (date: string | null): string => {
    if (!date) return 'Never';
    
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString();
  };

  const modules = [
    {
      id: 'writing',
      title: 'Writing',
      icon: PenLine,
      color: '#10b981',
      path: '/writing',
      stats: data?.writing,
    },
    {
      id: 'speaking',
      title: 'Speaking',
      icon: Mic,
      color: '#a855f7',
      path: '/speaking',
      stats: data?.speaking,
    },
    {
      id: 'reading',
      title: 'Reading',
      icon: BookOpen,
      color: '#06b6d4',
      path: '/reading',
      stats: data?.reading,
    },
    {
      id: 'listening',
      title: 'Listening',
      icon: Headphones,
      color: '#f59e0b',
      path: '/listening',
      stats: data?.listening,
    },
  ];

  if (!data) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <BarChart3 size={28} />
          </div>
          <div className={styles.headerInfo}>
            <h1>Your Progress</h1>
            <p>Track your CELPIP preparation across all skills</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className={styles.quickStats}>
        <div className={styles.quickStat}>
          <div className={styles.quickStatIcon}>
            <Target size={20} />
          </div>
          <div className={styles.quickStatInfo}>
            <span className={styles.quickStatValue}>{data.totalSessions}</span>
            <span className={styles.quickStatLabel}>Total Practices</span>
          </div>
        </div>

        <div className={styles.quickStat}>
          <div className={`${styles.quickStatIcon} ${styles.iconFlame}`}>
            <Flame size={20} />
          </div>
          <div className={styles.quickStatInfo}>
            <span className={styles.quickStatValue}>{data.streak}</span>
            <span className={styles.quickStatLabel}>Day Streak</span>
          </div>
        </div>

        <div className={styles.quickStat}>
          <div className={`${styles.quickStatIcon} ${styles.iconCalendar}`}>
            <Calendar size={20} />
          </div>
          <div className={styles.quickStatInfo}>
            <span className={styles.quickStatValue}>{formatLastPractice(data.lastPractice)}</span>
            <span className={styles.quickStatLabel}>Last Practice</span>
          </div>
        </div>
      </div>

      {/* Module Cards */}
      <div className={styles.modulesSection}>
        <h2 className={styles.sectionTitle}>Practice by Skill</h2>
        
        <div className={styles.modulesGrid}>
          {modules.map((mod) => {
            const IconComponent = mod.icon;
            const sessions = mod.stats?.sessions || 0;
            
            return (
              <div 
                key={mod.id}
                className={styles.moduleCard}
                onClick={() => router.push(mod.path)}
                style={{ '--module-color': mod.color } as React.CSSProperties}
              >
                <div className={styles.moduleCardHeader}>
                  <div className={styles.moduleIcon}>
                    <IconComponent size={24} />
                  </div>
                  {sessions > 0 && (
                    <div className={styles.moduleProgress}>
                      <Trophy size={12} />
                      <span>{sessions}</span>
                    </div>
                  )}
                </div>

                <h3 className={styles.moduleTitle}>{mod.title}</h3>
                
                <p className={styles.moduleStatus}>
                  {sessions > 0 
                    ? `${sessions} practice${sessions > 1 ? 's' : ''} completed`
                    : 'Not started yet'
                  }
                </p>

                <div className={styles.moduleCta}>
                  <span>{sessions > 0 ? 'Continue' : 'Start'}</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Motivation Section */}
      {data.totalSessions === 0 && (
        <div className={styles.motivationCard}>
          <Sparkles size={24} />
          <div className={styles.motivationContent}>
            <h3>Ready to start?</h3>
            <p>Pick any skill above and begin your CELPIP preparation journey!</p>
          </div>
        </div>
      )}

      {data.totalSessions > 0 && data.streak === 0 && (
        <div className={styles.motivationCard}>
          <Flame size={24} />
          <div className={styles.motivationContent}>
            <h3>Start a new streak!</h3>
            <p>Practice today to begin building your daily streak.</p>
          </div>
        </div>
      )}

      {data.streak >= 3 && (
        <div className={`${styles.motivationCard} ${styles.motivationSuccess}`}>
          <Trophy size={24} />
          <div className={styles.motivationContent}>
            <h3>🔥 {data.streak} day streak!</h3>
            <p>Amazing consistency! Keep it going!</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Export for backward compatibility
export function savePracticeSession(session: { task: string; wordCount: number; timeUsed: number; completed: boolean; examMode: boolean }) {
  try {
    const stored = localStorage.getItem('celpip_practice_history');
    const sessions = stored ? JSON.parse(stored) : [];
    
    const newSession = {
      ...session,
      id: `session_${Date.now()}`,
      date: new Date().toISOString(),
    };
    
    sessions.unshift(newSession);
    localStorage.setItem('celpip_practice_history', JSON.stringify(sessions.slice(0, 100)));
    
    return newSession;
  } catch (e) {
    console.error('Failed to save practice session:', e);
    return null;
  }
}
