'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, PenLine, Mic, BookOpen, Headphones,
  ArrowRight, Zap, Target, TrendingUp
} from 'lucide-react';
import styles from '@/styles/Home.module.scss';

/*
┌─────────────────────────────────────────────────┐
│              CELPIP Coach                       │
│              Master All 4 Skills                │
│                                                 │
│   ┌─────┐  ┌─────┐  ┌─────┐                    │
│   │ 4   │  │ AI  │  │ 12  │                    │
│   │MOD  │  │FEED │  │SCORE│                    │
│   └─────┘  └─────┘  └─────┘                    │
│                                                 │
│         [ Start Practicing → ]                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────┐  ┌──────────┐                    │
│  │ Writing  │  │ Speaking │                    │
│  │ ✍️       │  │ 🎤       │                    │
│  └──────────┘  └──────────┘                    │
│                                                 │
│  ┌──────────┐  ┌──────────┐                    │
│  │ Reading  │  │Listening │                    │
│  │ 📖       │  │ 🎧       │                    │
│  └──────────┘  └──────────┘                    │
│                                                 │
└─────────────────────────────────────────────────┘
*/

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
      desc: 'Email & Survey responses with real-time AI feedback',
      icon: PenLine,
      gradient: 'from-emerald-500 to-teal-600',
      stats: '2 Tasks • AI Scoring',
      path: '/writing'
    },
    {
      id: 'speaking',
      title: 'Speaking',
      desc: 'Record yourself and get instant pronunciation analysis',
      icon: Mic,
      gradient: 'from-violet-500 to-purple-600',
      stats: '8 Parts • Whisper AI',
      path: '/speaking'
    },
    {
      id: 'reading',
      title: 'Reading',
      desc: 'Timed passages with authentic exam-style questions',
      icon: BookOpen,
      gradient: 'from-cyan-500 to-blue-600',
      stats: '4 Parts • 38 Questions',
      path: '/reading'
    },
    {
      id: 'listening',
      title: 'Listening',
      desc: 'One-play audio — just like the real CELPIP test',
      icon: Headphones,
      gradient: 'from-amber-500 to-orange-600',
      stats: '6 Parts • TTS Audio',
      path: '/listening'
    }
  ];

  const features = [
    { icon: Target, label: '4 Modules', desc: 'Complete coverage' },
    { icon: Zap, label: 'AI Powered', desc: 'Smart feedback' },
    { icon: TrendingUp, label: 'Score 1-12', desc: 'CELPIP scale' },
  ];

  return (
    <main className={styles.home}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          {/* Badge */}
          <div className={styles.badge}>
            <Sparkles size={14} />
            <span>Complete CELPIP Preparation</span>
          </div>

          {/* Title */}
          <h1 className={styles.title}>
            Master All
            <span className={styles.titleAccent}> 4 Skills</span>
          </h1>

          {/* Subtitle */}
          <p className={styles.subtitle}>
            Practice Writing, Speaking, Reading & Listening with AI-powered feedback. 
            Built to match real exam conditions.
          </p>

          {/* Feature Pills */}
          <div className={styles.features}>
            {features.map((feature, i) => (
              <div key={i} className={styles.featurePill}>
                <feature.icon size={16} />
                <div className={styles.featureText}>
                  <span className={styles.featureLabel}>{feature.label}</span>
                  <span className={styles.featureDesc}>{feature.desc}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link href="/writing/task-1" className={styles.cta}>
            <span>Start Practicing</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Skills Grid */}
      <section className={styles.skillsSection}>
        <div className={styles.skillsHeader}>
          <h2>Choose Your Focus</h2>
          <p>All modules unlocked. Start anywhere you want.</p>
        </div>

        <div className={styles.skillsGrid}>
          {skills.map((skill, index) => {
            const IconComponent = skill.icon;
            return (
              <Link 
                key={skill.id}
                href={skill.path}
                className={styles.skillCard}
                style={{ '--delay': `${index * 80}ms` } as React.CSSProperties}
              >
                <div className={`${styles.skillIcon} ${styles[skill.id]}`}>
                  <IconComponent size={24} strokeWidth={2} />
                </div>
                
                <div className={styles.skillContent}>
                  <h3>{skill.title}</h3>
                  <p>{skill.desc}</p>
                  <span className={styles.skillStats}>{skill.stats}</span>
                </div>

                <div className={styles.skillArrow}>
                  <ArrowRight size={18} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Daily Progress (if has activity) */}
      {mounted && dailyProgress.streak > 0 && (
        <section className={styles.progressSection}>
          <div className={styles.progressCard}>
            <div className={styles.streakBadge}>
              🔥 {dailyProgress.streak} day streak
            </div>
            <p>Keep practicing daily to maintain your streak!</p>
          </div>
        </section>
      )}
    </main>
  );
}
