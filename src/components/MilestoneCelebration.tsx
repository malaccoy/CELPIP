'use client';

import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Flame, Trophy, Star, Zap, Crown, Target,
  Award, Rocket, X,
} from 'lucide-react';
import styles from '@/styles/MilestoneCelebration.module.scss';

/* ─── Milestone Definitions ─── */

export interface Milestone {
  id: string;
  icon: typeof Trophy;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  confettiColors?: string[];
}

const MILESTONES: Record<string, Milestone> = {
  streak_3: {
    id: 'streak_3',
    icon: Flame,
    iconColor: '#fbbf24',
    iconBg: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    title: '3-Day Streak!',
    description: 'You\'re on fire! Keep the momentum going.',
    confettiColors: ['#f59e0b', '#ef4444', '#fbbf24'],
  },
  streak_7: {
    id: 'streak_7',
    icon: Flame,
    iconColor: '#ff6b6b',
    iconBg: 'linear-gradient(135deg, #ef4444, #dc2626)',
    title: 'Perfect Week!',
    description: '7 days in a row. Your consistency is paying off.',
    confettiColors: ['#ef4444', '#dc2626', '#ff6b6b'],
  },
  streak_14: {
    id: 'streak_14',
    icon: Zap,
    iconColor: '#a78bfa',
    iconBg: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
    title: 'Two Weeks Strong!',
    description: '14-day streak. You\'re building a powerful habit.',
    confettiColors: ['#8b5cf6', '#6366f1', '#a78bfa'],
  },
  streak_30: {
    id: 'streak_30',
    icon: Crown,
    iconColor: '#fbbf24',
    iconBg: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    title: 'Undefeated Month!',
    description: '30 days of consistent practice. You\'re unstoppable.',
    confettiColors: ['#fbbf24', '#f59e0b', '#22c55e'],
  },
  first_practice: {
    id: 'first_practice',
    icon: Rocket,
    iconColor: '#22c55e',
    iconBg: 'linear-gradient(135deg, #22c55e, #10b981)',
    title: 'First Practice Done!',
    description: 'Welcome to your CELPIP journey. Great start!',
    confettiColors: ['#22c55e', '#10b981', '#6366f1'],
  },
  first_mock: {
    id: 'first_mock',
    icon: Target,
    iconColor: '#06b6d4',
    iconBg: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    title: 'First Mock Exam!',
    description: 'You completed your first full mock exam. Check your results!',
    confettiColors: ['#06b6d4', '#3b82f6', '#22c55e'],
  },
  perfect_score: {
    id: 'perfect_score',
    icon: Star,
    iconColor: '#fbbf24',
    iconBg: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    title: 'Perfect Score!',
    description: 'You scored 12/12. Absolute excellence!',
    confettiColors: ['#fbbf24', '#f59e0b', '#ff6b6b', '#22c55e'],
  },
  level_up: {
    id: 'level_up',
    icon: Award,
    iconColor: '#a78bfa',
    iconBg: 'linear-gradient(135deg, #a855f7, #8b5cf6)',
    title: 'Level Up!',
    description: 'Your skill level has increased. Keep pushing forward!',
    confettiColors: ['#a855f7', '#8b5cf6', '#6366f1'],
  },
  practices_50: {
    id: 'practices_50',
    icon: Trophy,
    iconColor: '#22c55e',
    iconBg: 'linear-gradient(135deg, #22c55e, #10b981)',
    title: '50 Exercises Done!',
    description: 'Half a century of practice. You\'re dedicated.',
    confettiColors: ['#22c55e', '#10b981', '#fbbf24'],
  },
  practices_100: {
    id: 'practices_100',
    icon: Crown,
    iconColor: '#ff3b3b',
    iconBg: 'linear-gradient(135deg, #ff3b3b, #dc2626)',
    title: '100 Exercises!',
    description: 'Triple digits. You\'re a CELPIP warrior.',
    confettiColors: ['#ff3b3b', '#dc2626', '#fbbf24', '#22c55e'],
  },
};

/* ─── Confetti Presets ─── */

function fireConfetti(colors: string[] = ['#ff3b3b', '#fbbf24', '#22c55e', '#6366f1']) {
  const defaults = {
    spread: 360,
    ticks: 100,
    gravity: 0.6,
    decay: 0.94,
    startVelocity: 30,
    colors,
    shapes: ['circle', 'square'] as confetti.Shape[],
    scalar: 1,
    zIndex: 10000,
  };

  // Burst from center
  confetti({
    ...defaults,
    particleCount: 80,
    origin: { x: 0.5, y: 0.4 },
  });

  // Side bursts
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 40,
      origin: { x: 0.2, y: 0.6 },
    });
    confetti({
      ...defaults,
      particleCount: 40,
      origin: { x: 0.8, y: 0.6 },
    });
  }, 200);
}

function fireStarConfetti(colors: string[]) {
  confetti({
    particleCount: 120,
    spread: 100,
    origin: { x: 0.5, y: 0.35 },
    colors,
    shapes: ['circle'] as confetti.Shape[],
    ticks: 120,
    gravity: 0.5,
    scalar: 1.2,
    zIndex: 10000,
  });
}

/* ─── Toast Component ─── */

interface ToastProps {
  milestone: Milestone;
  onDismiss: () => void;
}

function MilestoneToast({ milestone, onDismiss }: ToastProps) {
  const Icon = milestone.icon;

  useEffect(() => {
    const timer = setTimeout(onDismiss, 6000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className={styles.toast}>
      <div className={styles.toastIcon} style={{ background: milestone.iconBg }}>
        <Icon size={20} />
      </div>
      <div className={styles.toastContent}>
        <span className={styles.toastTitle}>{milestone.title}</span>
        <span className={styles.toastDesc}>{milestone.description}</span>
      </div>
      <button className={styles.toastClose} onClick={onDismiss}>
        <X size={14} />
      </button>
    </div>
  );
}

/* ─── Global Celebration Manager ─── */

// Singleton event system
const CELEBRATION_EVENT = 'celpip-milestone-celebration';
const SEEN_KEY = 'celpip_milestones_seen';

export function triggerCelebration(milestoneId: string) {
  // Check if already seen
  try {
    const seen = JSON.parse(localStorage.getItem(SEEN_KEY) || '[]');
    if (seen.includes(milestoneId)) return;
    seen.push(milestoneId);
    localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
  } catch {}

  window.dispatchEvent(new CustomEvent(CELEBRATION_EVENT, { detail: { milestoneId } }));
}

// Check streak milestones
export function checkStreakMilestone(streak: number) {
  if (streak >= 30) triggerCelebration('streak_30');
  else if (streak >= 14) triggerCelebration('streak_14');
  else if (streak >= 7) triggerCelebration('streak_7');
  else if (streak >= 3) triggerCelebration('streak_3');
}

// Check practice count milestones
export function checkPracticeMilestone(totalPractices: number) {
  if (totalPractices === 1) triggerCelebration('first_practice');
  if (totalPractices === 50) triggerCelebration('practices_50');
  if (totalPractices === 100) triggerCelebration('practices_100');
}

/* ─── Provider Component (mount in layout) ─── */

export default function MilestoneCelebration() {
  const [activeToast, setActiveToast] = useState<Milestone | null>(null);

  const handleCelebration = useCallback((e: Event) => {
    const { milestoneId } = (e as CustomEvent).detail;
    const milestone = MILESTONES[milestoneId];
    if (!milestone) return;

    setActiveToast(milestone);

    // Fire confetti
    if (milestoneId === 'perfect_score') {
      fireStarConfetti(milestone.confettiColors || []);
    } else {
      fireConfetti(milestone.confettiColors);
    }
  }, []);

  useEffect(() => {
    window.addEventListener(CELEBRATION_EVENT, handleCelebration);
    return () => window.removeEventListener(CELEBRATION_EVENT, handleCelebration);
  }, [handleCelebration]);

  if (!activeToast) return null;

  return (
    <MilestoneToast
      milestone={activeToast}
      onDismiss={() => setActiveToast(null)}
    />
  );
}
