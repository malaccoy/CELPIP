'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Sparkles, Mic, PenTool, Headphones, BookOpen } from 'lucide-react';
import styles from '@/styles/DrillExercise.module.scss';

const courses = [
  {
    id: 'speaking',
    title: 'Speaking Drills',
    subtitle: 'Practice all 8 speaking tasks',
    icon: Mic,
    exercises: 300,
    gradient: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
    glow: 'rgba(139,92,246,0.25)',
    ready: true,
  },
  {
    id: 'writing',
    title: 'Writing Drills',
    subtitle: 'Master CELPIP email writing',
    icon: PenTool,
    exercises: 60,
    gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
    glow: 'rgba(245,158,11,0.25)',
    ready: true,
  },
  {
    id: 'listening',
    title: 'Listening Drills',
    subtitle: 'All 6 tasks · 7 Secret Steps',
    icon: Headphones,
    exercises: 418,
    gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    glow: 'rgba(59,130,246,0.25)',
    ready: true,
  },
  {
    id: 'reading',
    title: 'Reading Drills',
    subtitle: 'All 4 tasks · Paragraph technique',
    icon: BookOpen,
    exercises: 492,
    gradient: 'linear-gradient(135deg, #10b981, #14b8a6)',
    glow: 'rgba(16,185,129,0.25)',
    ready: true,
  },
];

export default function CoursesPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <Link href="/dashboard" className={styles.backLink}>
          <ArrowLeft size={22} />
        </Link>
        <div>
          <h1 className={styles.pageTitle}>
            <Sparkles size={24} color="#f59e0b" /> Skill Drills
          </h1>
          <p className={styles.pageSubtitle}>
            Practice → Improve → Master
          </p>
        </div>
      </div>

      <div className={styles.infoBannerRed}>
        <p>
          Interactive drills to sharpen your CELPIP skills — no theory, just practice. Build muscle memory for test day.
        </p>
      </div>

      <div className={styles.courseGrid}>
        {courses.map(course => {
          const Icon = course.icon;
          return (
            <Link
              key={course.id}
              href={course.ready ? `/drills/${course.id}` : '#'}
              className={course.ready ? styles.courseCard : styles.courseCardDisabled}
            >
              {course.ready && (
                <div className={styles.courseCardGlow} style={{ background: course.glow }} />
              )}

              <div
                className={styles.courseCardIcon}
                style={{
                  background: course.gradient,
                  boxShadow: course.ready ? `0 8px 24px ${course.glow}` : 'none',
                }}
              >
                <Icon size={28} />
              </div>

              <div className={styles.courseCardTitle}>{course.title}</div>
              <div className={styles.courseCardSubtitle}>{course.subtitle}</div>

              {course.ready ? (
                <div className={styles.courseCardBadgeReady}>∞ exercises</div>
              ) : (
                <div className={styles.courseCardBadgeSoon}>Coming soon</div>
              )}

              {course.ready && (
                <ChevronRight size={16} className={styles.courseCardChevron} />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
