'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Flame, ChevronRight, Sparkles, Star,
  PenLine, Mic, BookOpen, Headphones,
  Zap, Trophy, Check, ArrowRight
} from 'lucide-react';
import styles from '@/styles/Home.module.scss';

interface DailyProgress {
  completed: number;
  goal: number;
  streak: number;
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [dailyProgress, setDailyProgress] = useState<DailyProgress>({
    completed: 0,
    goal: 3,
    streak: 0
  });

  useEffect(() => {
    setMounted(true);
    loadDailyProgress();
  }, []);

  const loadDailyProgress = () => {
    if (typeof window === 'undefined') return;
    
    const today = new Date().toISOString().split('T')[0];
    const allHistory = [
      ...JSON.parse(localStorage.getItem('celpip_practice_history') || '[]'),
      ...JSON.parse(localStorage.getItem('celpip_speaking_history') || '[]'),
      ...JSON.parse(localStorage.getItem('celpip_reading_history') || '[]'),
      ...JSON.parse(localStorage.getItem('celpip_listening_history') || '[]'),
    ];
    
    const todayCount = allHistory.filter((p: { date: string }) => 
      p.date?.startsWith(today)
    ).length;
    
    let streak = 0;
    const dates = [...new Set(allHistory.map((p: { date: string }) => p.date?.split('T')[0]))].sort().reverse();
    const checkDate = new Date();
    
    for (const date of dates) {
      const expected = checkDate.toISOString().split('T')[0];
      if (date === expected) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    setDailyProgress({ completed: todayCount, goal: 3, streak });
  };

  const skills = [
    {
      id: 'writing',
      title: 'Writing',
      desc: 'Email & Survey tasks with AI feedback',
      icon: PenLine,
      color: '#10b981',
      tags: ['2 task types', 'AI scoring', '5+ tools'],
      path: '/writing'
    },
    {
      id: 'speaking',
      title: 'Speaking',
      desc: 'Record & get instant AI analysis',
      icon: Mic,
      color: '#a855f7',
      tags: ['8 parts', 'Whisper AI', 'Score 1-12'],
      path: '/speaking'
    },
    {
      id: 'reading',
      title: 'Reading',
      desc: 'Practice with real exam passages',
      icon: BookOpen,
      color: '#06b6d4',
      tags: ['4 parts', '38+ questions', 'Timed'],
      path: '/reading'
    },
    {
      id: 'listening',
      title: 'Listening',
      desc: 'Audio plays once - like the real test',
      icon: Headphones,
      color: '#f59e0b',
      tags: ['6 parts', 'TTS audio', 'One-play'],
      path: '/listening'
    }
  ];

  return (
    <div className={styles.premiumHome}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <Sparkles size={14} />
          <span>Complete CELPIP Prep</span>
        </div>
        
        <h1 className={styles.heroTitle}>
          Master All<br />
          <span className={styles.heroHighlight}>4 Skills</span>
        </h1>
        
        <p className={styles.heroSubtitle}>
          Writing, Speaking, Reading & Listening — practice with AI feedback and real exam conditions.
        </p>

        {/* Stats Row */}
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>4</span>
            <span className={styles.statLabel}>MODULES</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statValue}>22</span>
            <span className={styles.statLabel}>PARTS</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statValue}>AI</span>
            <span className={styles.statLabel}>POWERED</span>
          </div>
        </div>

        {/* CTA Button */}
        <Link href="/writing/task-1" className={styles.ctaButton}>
          <span>Start Practicing</span>
          <ArrowRight size={20} />
        </Link>
      </section>

      {/* Skills Section */}
      <section className={styles.skillsSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>EXPLORE</span>
          <ChevronRight size={14} className={styles.sectionChevron} />
        </div>
        <h2 className={styles.sectionTitle}>Choose Your Skill</h2>
        <p className={styles.sectionSubtitle}>All modules available. Start anywhere.</p>

        <div className={styles.skillsGrid}>
          {skills.map((skill, index) => {
            const IconComponent = skill.icon;
            return (
              <Link 
                key={skill.id}
                href={skill.path}
                className={styles.skillCard}
                style={{ '--skill-color': skill.color, '--delay': `${index * 0.1}s` } as React.CSSProperties}
              >
                <div className={styles.skillHeader}>
                  <div className={styles.skillIconBox}>
                    <IconComponent size={22} />
                  </div>
                  <div className={styles.readyBadge}>
                    <Check size={12} />
                    <span>READY</span>
                  </div>
                </div>
                
                <h3 className={styles.skillTitle}>{skill.title}</h3>
                <p className={styles.skillDesc}>{skill.desc}</p>
                
                <div className={styles.skillTags}>
                  {skill.tags.map((tag, i) => (
                    <span key={i} className={styles.skillTag}>{tag}</span>
                  ))}
                </div>
                
                <div className={styles.skillAction}>
                  <span>Practice Now</span>
                  <ArrowRight size={16} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
