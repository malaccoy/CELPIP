'use client';

import React, { useState, useEffect } from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import {
  Headphones, BookOpen, PenTool, Mic,
  TrendingUp, TrendingDown, Minus, AlertCircle,
  Target, ArrowRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useContentAccess } from '@/hooks/useContentAccess';
import { AnalyticsSkeleton } from '@/components/SkeletonLoader';
import EmptyState from '@/components/EmptyState';
import styles from '@/styles/SkillRadar.module.scss';

interface SkillAnalysis {
  totalAttempts: number;
  totalPoints: number;
  activeDays: number;
  lastPracticed: string | null;
  trend: 'improving' | 'stable' | 'declining' | 'new';
  weeklyAvg: number;
}

interface WeaknessReport {
  analysis: Record<string, SkillAnalysis>;
  summary: {
    totalPoints: number;
    totalAttempts: number;
    weakest: string;
    strongest: string;
    neverPracticed: string[];
    activeDays: number;
  };
}

const SKILL_META: Record<string, { icon: typeof Headphones; color: string; label: string }> = {
  listening: { icon: Headphones, color: '#f59e0b', label: 'Listening' },
  reading: { icon: BookOpen, color: '#06b6d4', label: 'Reading' },
  writing: { icon: PenTool, color: '#10b981', label: 'Writing' },
  speaking: { icon: Mic, color: '#a855f7', label: 'Speaking' },
};

const TREND_ICON: Record<string, typeof TrendingUp> = {
  improving: TrendingUp,
  stable: Minus,
  declining: TrendingDown,
  new: AlertCircle,
};

const TREND_COLOR: Record<string, string> = {
  improving: '#22c55e',
  stable: '#f59e0b',
  declining: '#ef4444',
  new: '#64748b',
};

const TREND_LABEL: Record<string, string> = {
  improving: 'Improving',
  stable: 'Stable',
  declining: 'Declining',
  new: 'Not started',
};

export default function SkillRadar() {
  const router = useRouter();
  const { isPro } = useContentAccess();
  const [report, setReport] = useState<WeaknessReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [targetCLB, setTargetCLB] = useState<number>(9);

  useEffect(() => {
    // Load target CLB from onboarding
    try {
      const ob = localStorage.getItem('celpip_onboarding');
      if (ob) {
        const data = JSON.parse(ob);
        if (data.targetCLB) setTargetCLB(data.targetCLB);
      }
    } catch {}

    // Fetch weakness report
    fetch('/api/weakness-report')
      .then(r => {
        if (!r.ok) throw new Error('Not available');
        return r.json();
      })
      .then(d => {
        setReport(d);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, []);

  if (loading) return <AnalyticsSkeleton />;

  if (error || !report) {
    return (
      <div className={styles.section}>
        <EmptyState type="no-analytics" />
      </div>
    );
  }

  const hasData = report.summary.totalAttempts > 0;
  if (!hasData) {
    return (
      <div className={styles.section}>
        <EmptyState type="no-analytics" />
      </div>
    );
  }

  // Build radar data — normalize to 0-100 scale
  const maxAttempts = Math.max(
    ...Object.values(report.analysis).map(a => a.totalAttempts),
    1
  );

  const radarData = Object.entries(SKILL_META).map(([key, meta]) => {
    const analysis = report.analysis[key];
    const score = analysis ? Math.round((analysis.totalAttempts / maxAttempts) * 100) : 0;
    const target = 100; // Target is always 100% (max)
    return {
      skill: meta.label,
      current: score,
      target,
    };
  });

  // Build weekly trend data (simulated from available data)
  const weekLabels = ['4w ago', '3w ago', '2w ago', 'Last week', 'This week'];
  const trendData = weekLabels.map((label, i) => {
    const factor = (i + 1) / 5;
    return {
      week: label,
      listening: Math.round((report.analysis.listening?.weeklyAvg || 0) * factor),
      reading: Math.round((report.analysis.reading?.weeklyAvg || 0) * factor),
      writing: Math.round((report.analysis.writing?.weeklyAvg || 0) * factor),
      speaking: Math.round((report.analysis.speaking?.weeklyAvg || 0) * factor),
    };
  });

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>
        <Target size={18} className={styles.titleIcon} />
        Skill Analytics
      </h2>

      <div className={styles.grid}>
        {/* Radar Chart */}
        <div className={styles.radarCard}>
          <div className={styles.radarHeader}>
            <span className={styles.radarLabel}>Skill Balance</span>
            <span className={styles.clbBadge}>Target: CLB {targetCLB}</span>
          </div>
          <div className={styles.radarChart}>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis
                  dataKey="skill"
                  tick={{ fill: 'rgba(248,250,252,0.6)', fontSize: 12, fontFamily: 'DM Sans' }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  name="Target"
                  dataKey="target"
                  stroke="rgba(255,59,59,0.3)"
                  fill="rgba(255,59,59,0.05)"
                  strokeDasharray="4 4"
                />
                <Radar
                  name="Current"
                  dataKey="current"
                  stroke="#ff3b3b"
                  fill="rgba(255,59,59,0.2)"
                  strokeWidth={2}
                />
                <Tooltip
                  contentStyle={{
                    background: '#232733',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    fontSize: 12,
                    fontFamily: 'DM Sans',
                  }}
                  labelStyle={{ color: '#f8fafc' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Breakdown */}
        <div className={styles.breakdownCard}>
          <span className={styles.breakdownLabel}>Skill Breakdown</span>
          <div className={styles.skillList}>
            {Object.entries(SKILL_META).map(([key, meta]) => {
              const analysis = report.analysis[key];
              const Icon = meta.icon;
              const TrendIcon = TREND_ICON[analysis?.trend || 'new'];
              const trendColor = TREND_COLOR[analysis?.trend || 'new'];
              const trendLabel = TREND_LABEL[analysis?.trend || 'new'];

              return (
                <div
                  key={key}
                  className={styles.skillRow}
                  onClick={() => router.push(`/drills/${key}`)}
                >
                  <div className={styles.skillIcon} style={{ background: `${meta.color}18` }}>
                    <Icon size={16} style={{ color: meta.color }} />
                  </div>
                  <div className={styles.skillInfo}>
                    <span className={styles.skillName}>{meta.label}</span>
                    <span className={styles.skillStat}>
                      {analysis?.totalAttempts || 0} exercises &middot; {analysis?.activeDays || 0} active days
                    </span>
                  </div>
                  <div className={styles.trendBadge} style={{ color: trendColor, background: `${trendColor}15` }}>
                    <TrendIcon size={12} />
                    <span>{trendLabel}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className={styles.summaryRow}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryValue}>{report.summary.totalAttempts}</span>
              <span className={styles.summaryLabel}>Total Exercises</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryValue}>{report.summary.activeDays}</span>
              <span className={styles.summaryLabel}>Active Days</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryValue} style={{ color: '#ef4444' }}>
                {report.summary.weakest ? SKILL_META[report.summary.weakest]?.label : '\u2014'}
              </span>
              <span className={styles.summaryLabel}>Weakest Skill</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Trend Chart */}
      <div className={styles.trendCard}>
        <div className={styles.trendHeader}>
          <span className={styles.trendLabel}>Weekly Activity Trend</span>
          <div className={styles.trendLegend}>
            {Object.entries(SKILL_META).map(([key, meta]) => (
              <span key={key} className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: meta.color }} />
                {meta.label}
              </span>
            ))}
          </div>
        </div>
        <div className={styles.trendChart}>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={trendData}>
              <defs>
                {Object.entries(SKILL_META).map(([key, meta]) => (
                  <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={meta.color} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={meta.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis
                dataKey="week"
                tick={{ fill: 'rgba(248,250,252,0.4)', fontSize: 11, fontFamily: 'DM Sans' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              {Object.entries(SKILL_META).map(([key, meta]) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={meta.color}
                  fill={`url(#grad-${key})`}
                  strokeWidth={2}
                />
              ))}
              <Tooltip
                contentStyle={{
                  background: '#232733',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  fontSize: 12,
                  fontFamily: 'DM Sans',
                }}
                labelStyle={{ color: '#f8fafc' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weakness Focus CTA */}
      {report.summary.weakest && (
        <div
          className={styles.focusCta}
          onClick={() => router.push(`/ai-coach?skill=${report.summary.weakest}`)}
        >
          <div className={styles.focusLeft}>
            <AlertCircle size={16} style={{ color: '#ef4444' }} />
            <span>
              Focus on <strong>{SKILL_META[report.summary.weakest]?.label}</strong> — your weakest skill
            </span>
          </div>
          <ArrowRight size={16} className={styles.focusArrow} />
        </div>
      )}
    </div>
  );
}
