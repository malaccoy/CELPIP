'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3, TrendingUp, TrendingDown, Minus, Target,
  BookOpen, PenTool, Headphones, Mic, AlertTriangle,
  CheckCircle, Sparkles, ArrowRight, Loader2, ExternalLink,
  Award, Calendar, Zap, Brain, ChevronDown, ChevronUp
} from 'lucide-react';
import { usePlan } from '@/hooks/usePlan';
import { ProGate } from '@/components/ProGate';
import { getAllTipsForSkill, type PartTip } from '@/lib/technique-tips';
import styles from '@/styles/WeaknessReport.module.scss';

interface SkillAnalysis {
  totalAttempts: number;
  totalPoints: number;
  activeDays: number;
  lastPracticed: string | null;
  trend: 'improving' | 'stable' | 'declining' | 'new';
  weeklyAvg: number;
}

interface ReportData {
  analysis: Record<string, SkillAnalysis>;
  summary: {
    totalPoints: number;
    totalAttempts: number;
    weakest: string | null;
    strongest: string | null;
    neverPracticed: string[];
    activeDays: number;
  };
}

const SECTIONS = [
  { id: 'listening', label: 'Listening', icon: Headphones, color: '#fb923c' },
  { id: 'reading', label: 'Reading', icon: BookOpen, color: '#2dd4bf' },
  { id: 'writing', label: 'Writing', icon: PenTool, color: '#c084fc' },
  { id: 'speaking', label: 'Speaking', icon: Mic, color: '#38bdf8' },
];

function trendIcon(trend: string) {
  if (trend === 'improving') return <TrendingUp size={14} />;
  if (trend === 'declining') return <TrendingDown size={14} />;
  if (trend === 'new') return <Zap size={14} />;
  return <Minus size={14} />;
}

function trendLabel(trend: string) {
  if (trend === 'improving') return 'Improving';
  if (trend === 'declining') return 'Needs attention';
  if (trend === 'new') return 'Just started';
  return 'Stable';
}

function daysAgo(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

export default function WeaknessReportPage() {
  const { isPro, loading: planLoading } = usePlan();
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  useEffect(() => {
    if (!isPro) return;
    fetch('/api/weakness-report')
      .then(res => res.json())
      .then(d => { if (d.analysis) setData(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isPro]);

  if (planLoading) return null;

  if (!isPro) {
    return (
      <div className={styles.container}>
        <ProGate
          feature="Weakness Report"
          description="See your performance trends, identify weak areas, and get AI-powered recommendations with technique guide integration."
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <Loader2 size={28} className={styles.spin} />
          <p>Analyzing your performance...</p>
        </div>
      </div>
    );
  }

  const hasData = data && data.summary.totalAttempts > 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.badge}><BarChart3 size={13} /> Performance Analytics</div>
        <h1 className={styles.title}>Weakness Report</h1>
        <p className={styles.subtitle}>30-day analysis with technique recommendations</p>
      </div>

      {!hasData ? (
        <div className={styles.emptyState}>
          <Target size={40} style={{ color: 'rgba(248,250,252,0.15)' }} />
          <h3>No data yet</h3>
          <p>Complete some exercises in the AI Coach to see your personalized report.</p>
          <a href="/ai-coach" className={styles.ctaLink}>
            <Sparkles size={16} /> Start Practicing <ArrowRight size={14} />
          </a>
        </div>
      ) : (
        <>
          {/* Overview Cards */}
          <div className={styles.overviewGrid}>
            <div className={styles.overviewCard}>
              <span className={styles.overviewLabel}>Total Exercises</span>
              <span className={styles.overviewValue}>{data!.summary.totalAttempts}</span>
            </div>
            <div className={styles.overviewCard}>
              <span className={styles.overviewLabel}>Total Points</span>
              <span className={styles.overviewValue} style={{ color: '#fbbf24' }}>
                {data!.summary.totalPoints}
              </span>
            </div>
            <div className={styles.overviewCard}>
              <span className={styles.overviewLabel}>Active Days</span>
              <span className={styles.overviewValue}>
                <Calendar size={16} style={{ marginRight: 4 }} />
                {data!.summary.activeDays}
              </span>
            </div>
            <div className={styles.overviewCard}>
              <span className={styles.overviewLabel}>Strongest</span>
              <span className={styles.overviewValue} style={{ color: '#34d399', fontSize: '0.85rem' }}>
                {data!.summary.strongest ? data!.summary.strongest.charAt(0).toUpperCase() + data!.summary.strongest.slice(1) : '—'}
              </span>
            </div>
          </div>

          {/* Never practiced alert */}
          {data!.summary.neverPracticed.length > 0 && (
            <div className={styles.alertBanner}>
              <AlertTriangle size={18} />
              <div>
                <strong>Skills not practiced yet:</strong>{' '}
                {data!.summary.neverPracticed.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}
                <p style={{ margin: '4px 0 0', opacity: 0.8, fontSize: '0.85rem' }}>
                  The CELPIP tests all 4 skills. Your overall CLB score equals your <strong>weakest</strong> skill.
                </p>
              </div>
            </div>
          )}

          {/* Section Breakdown */}
          <h2 className={styles.sectionTitle}>
            <Target size={16} /> Skill Breakdown
          </h2>

          <div className={styles.sectionList}>
            {SECTIONS.map(sec => {
              const skill = data!.analysis[sec.id];
              const Icon = sec.icon;
              const tips = getAllTipsForSkill(sec.id);
              const isExpanded = expandedSkill === sec.id;
              const isWeakest = data!.summary.weakest === sec.id;

              return (
                <div key={sec.id} className={`${styles.sectionCard} ${isWeakest ? styles.weakestCard : ''}`}>
                  <div className={styles.sectionHeader}>
                    <Icon size={20} style={{ color: sec.color }} />
                    <span className={styles.sectionName}>{sec.label}</span>
                    {isWeakest && <span className={styles.weakBadge}>⚠️ Weakest</span>}
                    {data!.summary.strongest === sec.id && <span className={styles.strongBadge}>💪 Strongest</span>}
                  </div>

                  {skill.totalAttempts === 0 ? (
                    <div className={styles.noDataSection}>
                      <p>Not practiced yet</p>
                      <a href="/ai-coach" className={styles.miniCta}>
                        Start {sec.label} Practice →
                      </a>
                    </div>
                  ) : (
                    <>
                      {/* Stats row */}
                      <div className={styles.statsRow}>
                        <div className={styles.stat}>
                          <span className={styles.statValue}>{skill.totalAttempts}</span>
                          <span className={styles.statLabel}>exercises</span>
                        </div>
                        <div className={styles.stat}>
                          <span className={styles.statValue}>{skill.totalPoints}</span>
                          <span className={styles.statLabel}>points</span>
                        </div>
                        <div className={styles.stat}>
                          <span className={styles.statValue}>{skill.weeklyAvg}</span>
                          <span className={styles.statLabel}>per week</span>
                        </div>
                        <div className={styles.stat}>
                          <span className={styles.statValue} style={{ fontSize: '0.8rem' }}>{daysAgo(skill.lastPracticed)}</span>
                          <span className={styles.statLabel}>last practiced</span>
                        </div>
                      </div>

                      {/* Trend */}
                      <div className={styles.sectionMeta}>
                        <span className={`${styles.trend} ${styles[skill.trend]}`}>
                          {trendIcon(skill.trend)} {trendLabel(skill.trend)}
                        </span>
                        <span className={styles.activeDays}>{skill.activeDays} active days</span>
                      </div>

                      {/* Technique Guide Integration */}
                      {tips.length > 0 && (
                        <div className={styles.techniqueSection}>
                          <button
                            className={styles.techniqueToggle}
                            onClick={() => setExpandedSkill(isExpanded ? null : sec.id)}
                          >
                            <Brain size={16} style={{ color: sec.color }} />
                            <span>Technique Tips from Guide</span>
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>

                          {isExpanded && (
                            <div className={styles.techniqueContent}>
                              {tips.map((tip, idx) => (
                                <div key={idx} className={styles.tipCard}>
                                  <h4 className={styles.tipTitle}>
                                    <Award size={14} style={{ color: sec.color }} />
                                    {tip.partId} — {tip.label}
                                  </h4>
                                  <div className={styles.tipTechnique}>
                                    <strong>Technique:</strong> {tip.technique}
                                  </div>
                                  <div className={styles.tipQuick}>
                                    💡 {tip.quickTip}
                                  </div>
                                  <div className={styles.tipInsights}>
                                    <strong>Key insights:</strong>
                                    <ul>
                                      {tip.keyInsights.map((ins, i) => (
                                        <li key={i}>{ins}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div className={styles.tipMistakes}>
                                    <strong>Common mistakes:</strong>
                                    <ul>
                                      {tip.commonMistakes.map((m, i) => (
                                        <li key={i}>{m}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              ))}
                              <a href={tips[0].guideLink} className={styles.guideLink}>
                                <ExternalLink size={14} /> Open Full {sec.label} Technique Guide
                              </a>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Smart recommendations */}
                      {isWeakest && skill.totalAttempts > 0 && (
                        <div className={styles.recommendation}>
                          <AlertTriangle size={14} />
                          <span>
                            This is your weakest skill. Review the technique guide above and increase practice frequency.
                            {skill.weeklyAvg < 5 && ' Aim for at least 5 exercises per week.'}
                          </span>
                        </div>
                      )}
                      {skill.trend === 'declining' && (
                        <div className={styles.recommendation}>
                          <TrendingDown size={14} />
                          <span>
                            Practice frequency is declining. Try to maintain a consistent schedule — even 2-3 exercises per day helps.
                          </span>
                        </div>
                      )}
                      {skill.trend === 'improving' && (
                        <div className={styles.recommendationGood}>
                          <CheckCircle size={14} />
                          <span>Great progress! You're practicing more consistently. Keep it up!</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* AI recommendation based on data */}
          {data!.summary.weakest && (
            <div className={styles.aiRecommendation}>
              <Sparkles size={18} style={{ color: '#c084fc' }} />
              <div>
                <h4>Recommended Study Plan</h4>
                <p>Based on your 30-day performance:</p>
                <ol>
                  <li>
                    <strong>Focus on {data!.summary.weakest}</strong> — your weakest skill.
                    Open the technique tips above and review the strategies.
                  </li>
                  {data!.summary.neverPracticed.length > 0 && (
                    <li>
                      <strong>Start {data!.summary.neverPracticed.join(' and ')}</strong> — 
                      untested skills will lower your overall CLB score.
                    </li>
                  )}
                  <li>
                    Practice at least <strong>3-5 exercises daily</strong> across all skills for balanced improvement.
                  </li>
                  <li>
                    Take a <strong>Mock Exam</strong> every 1-2 weeks to test under real conditions.
                  </li>
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
            <a href="/guides" className={styles.actionBtn}>
              <BookOpen size={16} /> Technique Guides
            </a>
          </div>
        </>
      )}
    </div>
  );
}
