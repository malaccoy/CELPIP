'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PenTool, Headphones, BookOpen, Mic, 
  TrendingUp, Clock, Award, Lock,
  ArrowRight, Sparkles, CheckCircle
} from 'lucide-react';
import styles from '@/styles/Dashboard.module.scss';

interface SkillProgress {
  completed: number;
  total: number;
  percentage: number;
  lastPractice?: string;
}

interface DashboardStats {
  writing: SkillProgress;
  listening: SkillProgress;
  reading: SkillProgress;
  speaking: SkillProgress;
  totalPractices: number;
  currentStreak: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    writing: { completed: 0, total: 75, percentage: 0 },
    listening: { completed: 0, total: 38, percentage: 0 },
    reading: { completed: 0, total: 35, percentage: 0 },
    speaking: { completed: 0, total: 40, percentage: 0 },
    totalPractices: 0,
    currentStreak: 0
  });

  useEffect(() => {
    // Load stats from localStorage
    if (typeof window !== 'undefined') {
      try {
        // Count writing practices (legacy + new format)
        const detailedStatsStr = localStorage.getItem('celpip_detailed_stats');
        let writingCount = 0;
        
        if (detailedStatsStr) {
          const detailedStats = JSON.parse(detailedStatsStr);
          writingCount = (detailedStats.task1?.length || 0) + (detailedStats.task2?.length || 0);
        }

        setStats(prev => ({
          ...prev,
          writing: {
            ...prev.writing,
            completed: writingCount,
            percentage: Math.min(100, Math.round((writingCount / prev.writing.total) * 100))
          },
          totalPractices: writingCount
        }));
      } catch (err) {
        console.error('Failed to load stats:', err);
      }
    }
  }, []);

  const skills = [
    {
      id: 'writing',
      title: 'Writing',
      icon: PenTool,
      color: '#10b981',
      description: 'Email Writing & Survey Response',
      tasks: ['Task 1: Email', 'Task 2: Survey'],
      status: 'active',
      route: '/writing',
      progress: stats.writing
    },
    {
      id: 'listening',
      title: 'Listening',
      icon: Headphones,
      color: '#3b82f6',
      description: '6 Parts: Problem Solving to Viewpoints',
      tasks: ['Part 1-6: Audio comprehension'],
      status: 'coming-soon',
      route: '/listening',
      progress: stats.listening
    },
    {
      id: 'reading',
      title: 'Reading',
      icon: BookOpen,
      color: '#f59e0b',
      description: '4 Parts: Correspondence to Viewpoints',
      tasks: ['Part 1-4: Reading comprehension'],
      status: 'coming-soon',
      route: '/reading',
      progress: stats.reading
    },
    {
      id: 'speaking',
      title: 'Speaking',
      icon: Mic,
      color: '#ef4444',
      description: '8 Tasks: Advice to Unusual Situations',
      tasks: ['Task 1-8: Speaking practice'],
      status: 'coming-soon',
      route: '/speaking',
      progress: stats.speaking
    }
  ];

  const handleSkillClick = (skill: typeof skills[0]) => {
    if (skill.status === 'active') {
      router.push(skill.route);
    } else {
      // Coming soon notification
      alert(`${skill.title} is under development! 🚀\n\nYou'll soon be able to practice this skill.`);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <div className={styles.headerLeft}>
          <h1>Study Dashboard</h1>
          <p>Continue your journey to master CELPIP</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.statBadge}>
            <Award size={18} />
            <div>
              <span className={styles.statValue}>{stats.totalPractices}</span>
              <span className={styles.statLabel}>Practices</span>
            </div>
          </div>
          <div className={styles.statBadge}>
            <Clock size={18} />
            <div>
              <span className={styles.statValue}>{stats.currentStreak}</span>
              <span className={styles.statLabel}>Day Streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className={styles.skillsGrid}>
        {skills.map((skill) => {
          const Icon = skill.icon;
          const isLocked = skill.status === 'coming-soon';
          
          return (
            <article 
              key={skill.id}
              className={`${styles.skillCard} ${isLocked ? styles.skillCardLocked : ''}`}
              onClick={() => handleSkillClick(skill)}
              style={{ '--skill-color': skill.color } as React.CSSProperties}
            >
              {/* Lock Badge */}
              {isLocked && (
                <div className={styles.lockBadge}>
                  <Lock size={14} />
                  <span>Coming Soon</span>
                </div>
              )}

              {/* Card Content */}
              <div className={styles.skillCardHeader}>
                <div className={styles.skillIcon}>
                  <Icon size={32} />
                </div>
                <div className={styles.skillInfo}>
                  <h3>{skill.title}</h3>
                  <p>{skill.description}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className={styles.progressSection}>
                <div className={styles.progressHeader}>
                  <span className={styles.progressLabel}>Progress</span>
                  <span className={styles.progressValue}>
                    {skill.progress.completed} / {skill.progress.total}
                  </span>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ width: `${skill.progress.percentage}%` }}
                  />
                </div>
                <div className={styles.progressPercentage}>
                  {skill.progress.percentage}% complete
                </div>
              </div>

              {/* Tasks List */}
              <div className={styles.tasksList}>
                {skill.tasks.map((task, idx) => (
                  <div key={idx} className={styles.taskItem}>
                    <CheckCircle size={14} />
                    <span>{task}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button 
                className={styles.skillCardButton}
                disabled={isLocked}
              >
                {isLocked ? (
                  <>
                    <Lock size={16} />
                    <span>In Development</span>
                  </>
                ) : (
                  <>
                    <span>Start</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              {/* Glow Effect */}
              {!isLocked && <div className={styles.skillCardGlow} />}
            </article>
          );
        })}
      </div>

      {/* Quick Stats Section */}
      <div className={styles.quickStats}>
        <div className={styles.quickStatsHeader}>
          <TrendingUp size={20} />
          <h2>Quick Stats</h2>
        </div>
        <div className={styles.quickStatsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statCardIcon} style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <PenTool size={24} />
            </div>
            <div className={styles.statCardContent}>
              <span className={styles.statCardValue}>{stats.writing.completed}</span>
              <span className={styles.statCardLabel}>Writing completed</span>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statCardIcon} style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
              <Sparkles size={24} />
            </div>
            <div className={styles.statCardContent}>
              <span className={styles.statCardValue}>AI</span>
              <span className={styles.statCardLabel}>Smart feedback</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statCardIcon} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
              <Award size={24} />
            </div>
            <div className={styles.statCardContent}>
              <span className={styles.statCardValue}>MVP</span>
              <span className={styles.statCardLabel}>Beta Version</span>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <div className={styles.comingSoonBanner}>
        <div className={styles.bannerContent}>
          <Sparkles size={32} />
          <div>
            <h3>More features coming soon</h3>
            <p>Listening, Reading and Speaking will be launched in the next updates!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
