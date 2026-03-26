'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Zap, Crown, ChevronRight, Clock, Target, BookOpen, Headphones, Key, BarChart3 } from 'lucide-react';
import { usePlan } from '@/hooks/usePlan';
import styles from '@/styles/DrillExercise.module.scss';

export default function ListeningDrillsPage() {
  const { isPro, loading: planLoading } = usePlan();
  const router = useRouter();
  const [units, setUnits] = useState<any[]>([]);
  const [dailyUsed, setDailyUsed] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(10);

  useEffect(() => {
    fetch('/data/courses/listening.json').then(r => r.json()).then(setUnits);
    fetch('/api/daily-usage?category=drills')
      .then(r => r.json())
      .then(data => {
        if (!data.isPro) {
          setDailyUsed(data.used || 0);
          setDailyLimit(data.limit || 10);
        }
      })
      .catch(() => {});
  }, []);

  if (planLoading || units.length === 0) return <div className={styles.skeletonPage} />;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <Link href="/drills" className={styles.backLink}>
          <ArrowLeft size={22} />
        </Link>
        <div style={{ flex: 1 }}>
          <h1 className={styles.pageTitle}>
            <Headphones size={24} color="#3b82f6" /> Listening Drills
          </h1>
          <p className={styles.pageSubtitle}>
            ∞ exercises · All 6 listening tasks
          </p>
        </div>
      </div>

      {/* Overview */}
      <div className={styles.infoBannerBlue}>
        <p>
          <strong>Listen, don't read!</strong> Each exercise plays audio — just like the real CELPIP test.
          Use the <strong>7 Secret Steps</strong> to identify problems, track feelings, spot fake solutions, and predict future outcomes.
        </p>
      </div>

      {/* Test at a Glance */}
      <div className={styles.statsGrid}>
        {[
          { icon: <Clock size={16} color="#3b82f6" />, label: 'Duration', value: '~47-55 min' },
          { icon: <Target size={16} color="#3b82f6" />, label: 'Questions', value: '38 total' },
          { icon: <Headphones size={16} color="#3b82f6" />, label: 'Parts', value: '6 tasks' },
          { icon: <BookOpen size={16} color="#3b82f6" />, label: 'Replay', value: 'NO replay!' },
        ].map((s, i) => (
          <div key={i} className={styles.statCard}>
            {s.icon}
            <div>
              <div className={styles.statLabel}>{s.label}</div>
              <div className={styles.statValue}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Daily free counter */}
      {!isPro && (
        <div className={styles.dailyCounter}>
          <div className={styles.dailyCounterHeader}>
            <div className={styles.dailyCounterLabel}>
              <Zap size={16} color="#22c55e" />
              <span>Daily Free Exercises</span>
            </div>
            <Link href="/pricing" className={styles.dailyCounterUpgrade}>
              <Zap size={12} /> Upgrade
            </Link>
          </div>
          <div className={styles.dailyDots}>
            {Array.from({ length: dailyLimit }).map((_, i) => (
              <div key={i} className={i < dailyUsed ? styles.dailyDotActive : styles.dailyDotInactive} />
            ))}
          </div>
          <span className={styles.dailyCounterText}>
            {dailyUsed}/{dailyLimit} used today · Resets daily
          </span>
        </div>
      )}

      {/* Unit Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {units.map((unit: any) => {
          const isEasier = unit.id === 0;
          const color = isEasier ? '#3b82f6' : '#8b5cf6';
          const gradient = isEasier
            ? 'linear-gradient(135deg, #3b82f6, #06b6d4)'
            : 'linear-gradient(135deg, #8b5cf6, #6366f1)';
          return (
            <button
              key={unit.id}
              onClick={() => router.push(`/drills/listening/${unit.id}`)}
              className={styles.unitCard}
              style={{ borderColor: `${color}33` }}
            >
              <div className={styles.unitCardDecor} style={{ background: `${color}14` }} />
              <div className={styles.unitCardInner}>
                <div
                  className={styles.unitCardIcon}
                  style={{ background: gradient, boxShadow: `0 8px 24px ${color}4D` }}
                >
                  <Headphones size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span className={styles.unitCardDiffBadge} style={{ color, background: `${color}1F` }}>
                      {isEasier ? 'EASIER' : 'HARDER'}
                    </span>
                    <span className={styles.unitCardTitle}>{unit.title}</span>
                  </div>
                  <div className={styles.unitCardSubtitle}>{unit.subtitle}</div>
                  <span className={styles.unitCardExercises} style={{ background: `${color}1F`, color }}>
                    ∞ exercises
                  </span>
                </div>
                <ChevronRight size={22} color={color} style={{ flexShrink: 0 }} />
              </div>
            </button>
          );
        })}
      </div>

      {/* 7 Secret Steps */}
      <div style={{ marginTop: '1.5rem' }}>
        <h3 className={styles.stepsTitle}>
          <Key size={16} color="#f59e0b" /> 7 Secret Steps
        </h3>
        <div className={styles.stepsList}>
          {[
            { step: 1, text: 'Identify the Problem / WHY', color: '#ff3b3b' },
            { step: 2, text: 'Real vs Fake Solution', color: '#f97316' },
            { step: 3, text: 'Follow the Flow / Choices', color: '#f59e0b' },
            { step: 4, text: 'Feelings & Questions', color: '#22c55e' },
            { step: 5, text: 'Time Frame (not exact dates)', color: '#06b6d4' },
            { step: 6, text: 'Details & Descriptions', color: '#3b82f6' },
            { step: 7, text: 'Future Outcomes (ALWAYS!)', color: '#8b5cf6' },
          ].map(s => (
            <div key={s.step} className={styles.stepItem} style={{ borderLeftColor: s.color }}>
              <span className={styles.stepNumber} style={{ background: `${s.color}22`, color: s.color }}>
                {s.step}
              </span>
              <span className={styles.stepText}>{s.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Score Table */}
      <div style={{ marginTop: '1.5rem' }}>
        <h3 className={styles.stepsTitle}>
          <BarChart3 size={16} color="#3b82f6" /> Score Guide (out of 38 questions)
        </h3>
        <div className={styles.scoreGuide}>
          <div className={styles.scoreGrid}>
            {[
              { score: '7', correct: '23-26', color: '#f59e0b' },
              { score: '8', correct: '27-30', color: '#22c55e' },
              { score: '9', correct: '31-33', color: '#3b82f6' },
              { score: '10', correct: '34-35', color: '#8b5cf6' },
              { score: '11', correct: '36-37', color: '#ec4899' },
              { score: '12', correct: '38/38', color: '#ff3b3b' },
            ].map(s => (
              <div key={s.score} className={styles.scoreCell} style={{ background: `${s.color}14`, borderColor: `${s.color}33` }}>
                <div className={styles.scoreCellValue} style={{ color: s.color }}>{s.score}</div>
                <div className={styles.scoreCellLabel}>{s.correct}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upgrade CTA */}
      {!isPro && (
        <Link href="/pricing" className={styles.upgradeBanner} style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(99,102,241,0.1))',
          borderColor: 'rgba(59,130,246,0.2)',
        }}>
          <div className={styles.upgradeBannerTitle}>
            <Crown size={20} color="#f59e0b" />
            <span>Unlimited Listening Practice</span>
          </div>
          <p className={styles.upgradeBannerDesc}>
            Remove daily limits and sharpen your ear for the real test
          </p>
          <div className={styles.upgradeBannerBtn} style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            Upgrade to Pro →
          </div>
        </Link>
      )}
    </div>
  );
}
