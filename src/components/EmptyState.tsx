'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen, Headphones, PenTool, Mic,
  Sparkles, Target, Trophy, BarChart3,
  ArrowRight, Rocket,
} from 'lucide-react';
import styles from '@/styles/EmptyState.module.scss';

interface EmptyStateProps {
  type: 'no-practice' | 'no-analytics' | 'no-mock' | 'no-streak' | 'no-achievements';
  compact?: boolean;
}

const EMPTY_CONFIGS = {
  'no-practice': {
    icon: Sparkles,
    iconGradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    title: 'Start Your First Practice',
    description: 'Choose a skill below and complete your first exercise. Your progress will appear here.',
    cta: 'Go to Practice',
    href: '/drills',
  },
  'no-analytics': {
    icon: BarChart3,
    iconGradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    title: 'No Analytics Data Yet',
    description: 'Complete a few exercises to unlock your personalized skill radar and progress charts.',
    cta: 'Start Practicing',
    href: '/drills',
  },
  'no-mock': {
    icon: Target,
    iconGradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    title: 'No Mock Exams Taken',
    description: 'Take a full mock exam to see your estimated CLB score and detailed skill breakdown.',
    cta: 'Take Mock Exam',
    href: '/mock-exam',
  },
  'no-streak': {
    icon: Rocket,
    iconGradient: 'linear-gradient(135deg, #22c55e, #10b981)',
    title: 'Build Your Streak',
    description: 'Practice every day to build a streak. Consistency is the key to reaching your target CLB score.',
    cta: 'Practice Now',
    href: '/drills',
  },
  'no-achievements': {
    icon: Trophy,
    iconGradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    title: 'No Achievements Yet',
    description: 'Complete exercises, maintain streaks, and score high to unlock achievements and earn badges.',
    cta: 'Start Earning',
    href: '/drills',
  },
};

export default function EmptyState({ type, compact = false }: EmptyStateProps) {
  const router = useRouter();
  const config = EMPTY_CONFIGS[type];
  const Icon = config.icon;

  if (compact) {
    return (
      <div className={styles.compactContainer}>
        <div className={styles.compactIcon} style={{ background: config.iconGradient }}>
          <Icon size={18} />
        </div>
        <div className={styles.compactContent}>
          <span className={styles.compactTitle}>{config.title}</span>
          <span className={styles.compactDesc}>{config.description}</span>
        </div>
        <button className={styles.compactCta} onClick={() => router.push(config.href)}>
          {config.cta} <ArrowRight size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.iconBox} style={{ background: config.iconGradient }}>
        <Icon size={32} />
      </div>
      <h3 className={styles.title}>{config.title}</h3>
      <p className={styles.description}>{config.description}</p>
      <button className={styles.ctaButton} onClick={() => router.push(config.href)}>
        {config.cta} <ArrowRight size={16} />
      </button>

      {/* Decorative skill icons */}
      <div className={styles.decorIcons}>
        <Headphones size={16} className={styles.decorIcon} style={{ animationDelay: '0s' }} />
        <BookOpen size={16} className={styles.decorIcon} style={{ animationDelay: '0.5s' }} />
        <PenTool size={16} className={styles.decorIcon} style={{ animationDelay: '1s' }} />
        <Mic size={16} className={styles.decorIcon} style={{ animationDelay: '1.5s' }} />
      </div>
    </div>
  );
}
