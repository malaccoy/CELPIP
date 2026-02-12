'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3, TrendingUp, TrendingDown, Minus, Target,
  BookOpen, PenTool, Headphones, Mic, AlertTriangle,
  CheckCircle, Sparkles, ArrowRight, Loader2
} from 'lucide-react';
import { usePlan } from '@/hooks/usePlan';
import { useAdaptiveDifficulty, type SectionPerformance, type SkillLevel } from '@/hooks/useAdaptiveDifficulty';
import { ProGate } from '@/components/ProGate';
import styles from '@/styles/WeaknessReport.module.scss';

const SECTIONS = [
  { id: 'listening', label: 'Listening', icon: Headphones, color: '#fb923c' },
  { id: 'reading', label: 'Reading', icon: BookOpen, color: '#2dd4bf' },
  { id: 'writing', label: 'Writing', icon: PenTool, color: '#c084fc' },
  { id: 'speaking', label: 'Speaking', icon: Mic, color: '#38bdf8' },
];

function levelLabel(level: SkillLevel) {
  return level === 'advanced' ? '🏆 Advanced' : level === 'intermediate' ? '🔥 Intermediate' : '🌱 Beginner';
}

function trendIcon(trend: string) {
  if (trend === 'improving') return <TrendingUp size={14} />;
  if (trend === 'declining') return <TrendingDown size={14} />;
  return <Minus size={14} />;
}

function scorePct(score: number) {
  return Math.round(score * 100);
}

export default function WeaknessReportPage() {
  const { isPro, loading: planLoading } = usePlan();
  const { performances, loaded } = useAdaptiveDifficulty();

  if (planLoading || !loaded) return null;

  if (!isPro) {
    return (
      <div className={styles.container}>
        <ProGate
          feature="Weakness Report"
          description="See your performance trends, identify weak areas, and get AI-powered recommendations for improvement."
        />
      </div>
    );
  }

  const hasData = Object.keys(performances).length > 0;

  // Find weakest and strongest
  const sorted = Object.values(performances).sort((a, b) => a.avgScore - b.avgScore);
  const weakest = sorted[0];
  const strongest = sorted[sorted.length - 1];

  // Overall stats
  const totalAttempts = Object.values(performances).reduce((a, p) => a + p.attempts, 0);
  const overallAvg = Object.values(performances).length > 0
    ? Object.values(performances).reduce((a, p) => a + p.avgScore, 0) / Object.values(performances).length
    : 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.badge}><BarChart3 size={13} /> Analytics</div>
        <h1 className={styles.title}>Weakness Report</h1>
        <p className={styles.subtitle}>Your performance across all sections</p>
      </div>

      {!hasData ? (
        <div className={styles.emptyState}>
          <Target size={40} style={{ color: 'rgba(248,250,252,0.15)' }} />
          <h3>No data yet</h3>
          <p>Complete some exercises in the AI Practice Generator to see your report.</p>
          <a href="/ai-coach" className={styles.ctaLink}>
            <Sparkles size={16} /> Start Practicing <ArrowRight size={14} />
          </a>
        </div>
      ) : (
        <>
          {/* Overview Cards */}
          <div className={styles.overviewGrid}>
            <div className={styles.overviewCard}>
              <span className={styles.overviewLabel}>Total Attempts</span>
              <span className={styles.overviewValue}>{totalAttempts}</span>
            </div>
            <div className={styles.overviewCard}>
              <span className={styles.overviewLabel}>Avg Score</span>
              <span className={styles.overviewValue} style={{ color: overallAvg >= 0.7 ? '#34d399' : overallAvg >= 0.5 ? '#fbbf24' : '#f87171' }}>
                {scorePct(overallAvg)}%
              </span>
            </div>
            <div className={styles.overviewCard}>
              <span className={styles.overviewLabel}>Strongest</span>
              <span className={styles.overviewValue} style={{ color: '#34d399', fontSize: '0.85rem' }}>
                {strongest?.section || '—'}
              </span>
            </div>
            <div className={styles.overviewCard}>
              <span className={styles.overviewLabel}>Weakest</span>
              <span className={styles.overviewValue} style={{ color: '#f87171', fontSize: '0.85rem' }}>
                {weakest?.section || '—'}
              </span>
            </div>
          </div>

          {/* Section Breakdown */}
          <h2 className={styles.sectionTitle}>
            <Target size={16} /> Section Breakdown
          </h2>

          <div className={styles.sectionList}>
            {SECTIONS.map(sec => {
              const perf = performances[sec.id];
              const Icon = sec.icon;

              if (!perf) {
                return (
                  <div key={sec.id} className={styles.sectionCard}>
                    <div className={styles.sectionHeader}>
                      <Icon size={20} style={{ color: sec.color }} />
                      <span className={styles.sectionName}>{sec.label}</span>
                    </div>
                    <p className={styles.noData}>No attempts yet</p>
                  </div>
                );
              }

              return (
                <div key={sec.id} className={styles.sectionCard}>
                  <div className={styles.sectionHeader}>
                    <Icon size={20} style={{ color: sec.color }} />
                    <span className={styles.sectionName}>{sec.label}</span>
                    <span className={styles.levelBadge}>{levelLabel(perf.level)}</span>
                  </div>

                  {/* Score bar */}
                  <div className={styles.scoreBar}>
                    <div className={styles.scoreBarTrack}>
                      <div
                        className={styles.scoreBarFill}
                        style={{
                          width: `${scorePct(perf.avgScore)}%`,
                          background: sec.color,
                        }}
                      />
                    </div>
                    <span className={styles.scoreBarValue} style={{ color: sec.color }}>
                      {scorePct(perf.avgScore)}%
                    </span>
                  </div>

                  {/* Meta */}
                  <div className={styles.sectionMeta}>
                    <span className={`${styles.trend} ${styles[perf.trend]}`}>
                      {trendIcon(perf.trend)} {perf.trend}
                    </span>
                    <span className={styles.attempts}>{perf.attempts} attempts</span>
                  </div>

                  {/* Recommendation */}
                  {perf.avgScore < 0.6 && (
                    <div className={styles.recommendation}>
                      <AlertTriangle size={14} />
                      <span>
                        Focus area — consider reviewing the {sec.label} Technique Guide and practice at a lower difficulty.
                      </span>
                    </div>
                  )}
                  {perf.avgScore >= 0.8 && (
                    <div className={styles.recommendationGood}>
                      <CheckCircle size={14} />
                      <span>
                        Strong performance! Try advanced difficulty to keep improving.
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* AI recommendation */}
          {weakest && weakest.avgScore < 0.65 && (
            <div className={styles.aiRecommendation}>
              <Sparkles size={18} style={{ color: '#c084fc' }} />
              <div>
                <h4>Recommended Next Steps</h4>
                <p>
                  Your <strong>{weakest.section}</strong> section needs the most work 
                  ({scorePct(weakest.avgScore)}% avg). We recommend:
                </p>
                <ol>
                  <li>Review the {weakest.section} Technique Guide for strategies</li>
                  <li>Practice 3-5 exercises at {weakest.level === 'beginner' ? 'beginner' : 'intermediate'} difficulty</li>
                  <li>Take a mock exam to test under pressure</li>
                </ol>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className={styles.actions}>
            <a href="/ai-coach" className={styles.actionBtn}>
              <Sparkles size={16} /> Practice Now
            </a>
            <a href="/mock-exam" className={styles.actionBtn}>
              <Target size={16} /> Mock Exam
            </a>
          </div>
        </>
      )}
    </div>
  );
}
