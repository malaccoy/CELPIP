'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PenTool, Headphones, BookOpen, Mic, 
  TrendingUp, Clock, Award, ArrowRight, 
  Sparkles, Target, Flame, BarChart3
} from 'lucide-react';
import styles from '@/styles/Dashboard.module.scss';

interface SkillProgress {
  sessions: number;
  lastPractice: string | null;
}

interface DashboardStats {
  writing: SkillProgress;
  listening: SkillProgress;
  reading: SkillProgress;
  speaking: SkillProgress;
  totalPractices: number;
  currentStreak: number;
}

const STORAGE_KEYS = {
  writing: 'celpip_practice_history',
  speaking: 'celpip_speaking_history',
  reading: 'celpip_reading_history',
  listening: 'celpip_listening_history',
};

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    writing: { sessions: 0, lastPractice: null },
    listening: { sessions: 0, lastPractice: null },
    reading: { sessions: 0, lastPractice: null },
    speaking: { sessions: 0, lastPractice: null },
    totalPractices: 0,
    currentStreak: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    if (typeof window === 'undefined') return;
    
    try {
      const writing = loadModuleStats('writing');
      const speaking = loadModuleStats('speaking');
      const reading = loadModuleStats('reading');
      const listening = loadModuleStats('listening');
      
      const total = writing.sessions + speaking.sessions + reading.sessions + listening.sessions;
      
      setStats({
        writing,
        speaking,
        reading,
        listening,
        totalPractices: total,
        currentStreak: calculateStreak()
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const loadModuleStats = (module: keyof typeof STORAGE_KEYS): SkillProgress => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS[module]);
      if (!stored) return { sessions: 0, lastPractice: null };
      
      const sessions = JSON.parse(stored);
      if (!Array.isArray(sessions) || sessions.length === 0) {
        return { sessions: 0, lastPractice: null };
      }

      return {
        sessions: sessions.length,
        lastPractice: sessions[0]?.date || null
      };
    } catch {
      return { sessions: 0, lastPractice: null };
    }
  };

  const calculateStreak = (): number => {
    try {
      const allSessions: { date?: string; timestamp?: string }[] = [];
      
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

      // Get unique dates in YYYY-MM-DD format, sorted descending
      const dates = [...new Set(
        allSessions
          .map(s => (s.date || s.timestamp)?.split('T')[0])
          .filter((d): d is string => !!d)
      )].sort().reverse();

      if (dates.length === 0) return 0;

      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      // Streak only counts if last practice was today or yesterday
      if (dates[0] !== today && dates[0] !== yesterday) return 0;

      let streak = 1;
      for (let i = 1; i < dates.length; i++) {
        const curr = new Date(dates[i - 1]);
        const prev = new Date(dates[i]);
        const diff = (curr.getTime() - prev.getTime()) / 86400000;
        if (diff === 1) {
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

  const skills = [
    {
      id: 'writing',
      title: 'Writing',
      icon: PenTool,
      color: '#10b981',
      description: 'Email & Survey Response',
      route: '/writing',
      sessions: stats.writing.sessions
    },
    {
      id: 'speaking',
      title: 'Speaking',
      icon: Mic,
      color: '#a855f7',
      description: '8 Speaking Tasks',
      route: '/speaking',
      sessions: stats.speaking.sessions
    },
    {
      id: 'reading',
      title: 'Reading',
      icon: BookOpen,
      color: '#06b6d4',
      description: '4 Reading Parts',
      route: '/reading',
      sessions: stats.reading.sessions
    },
    {
      id: 'listening',
      title: 'Listening',
      icon: Headphones,
      color: '#f59e0b',
      description: '6 Listening Parts',
      route: '/listening',
      sessions: stats.listening.sessions
    }
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerIcon}>
          <BarChart3 size={28} />
        </div>
        <div className={styles.headerText}>
          <h1>Your Progress</h1>
          <p>Track your CELPIP preparation across all skills</p>
        </div>
      </header>

      {/* Quick Stats */}
      <div className={styles.quickStats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Target size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.totalPractices}</span>
            <span className={styles.statLabel}>Total Practices</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.flame}`}>
            <Flame size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.currentStreak}</span>
            <span className={styles.statLabel}>Day Streak</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.modules}`}>
            <Sparkles size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>4</span>
            <span className={styles.statLabel}>Skills Ready</span>
          </div>
        </div>
      </div>

      {/* AI Coach CTA */}
      <article
        className={styles.aiCoachCard}
        onClick={() => router.push('/ai-coach')}
      >
        <div className={styles.aiCoachIcon}>
          <Sparkles size={22} />
        </div>
        <div className={styles.aiCoachContent}>
          <h3>AI Practice Generator</h3>
          <p>Unlimited exercises — Reading, Writing, Listening &amp; Speaking</p>
        </div>
        <ArrowRight size={18} className={styles.aiCoachArrow} />
      </article>

      {/* Skills Section */}
      <section className={styles.skillsSection}>
        <h2 className={styles.sectionTitle}>Practice by Skill</h2>
        
        <div className={styles.skillsGrid}>
          {skills.map((skill) => {
            const Icon = skill.icon;
            
            return (
              <article 
                key={skill.id}
                className={`${styles.skillCard} ${styles[skill.id]}`}
                onClick={() => router.push(skill.route)}
                style={{ '--skill-color': skill.color } as React.CSSProperties}
              >
                <div className={styles.skillHeader}>
                  <div className={styles.skillIconBox}>
                    <Icon size={24} />
                  </div>
                  {skill.sessions > 0 && (
                    <div className={styles.sessionBadge}>
                      <Award size={12} />
                      <span>{skill.sessions}</span>
                    </div>
                  )}
                </div>

                <h3 className={styles.skillName}>{skill.title}</h3>
                <p className={styles.skillDesc}>{skill.description}</p>

                <div className={styles.skillAction}>
                  <span>{skill.sessions > 0 ? 'Continue' : 'Start'}</span>
                  <ArrowRight size={16} />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Motivation */}
      {stats.totalPractices === 0 && (
        <div className={styles.motivationCard}>
          <Sparkles size={24} />
          <div className={styles.motivationText}>
            <h3>Ready to start?</h3>
            <p>Pick any skill above and begin your CELPIP preparation!</p>
          </div>
        </div>
      )}

      {stats.currentStreak >= 3 && (
        <div className={`${styles.motivationCard} ${styles.success}`}>
          <Flame size={24} />
          <div className={styles.motivationText}>
            <h3>🔥 {stats.currentStreak} day streak!</h3>
            <p>Amazing consistency! Keep it going!</p>
          </div>
        </div>
      )}
    </div>
  );
}
