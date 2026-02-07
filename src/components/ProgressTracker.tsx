'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Minus, Target, AlertTriangle, 
  Lightbulb, BarChart3, Loader2, RefreshCw, ChevronRight,
  CheckCircle, XCircle, Sparkles
} from 'lucide-react';
import styles from '@/styles/ProgressTracker.module.scss';

interface WeaknessCategory {
  id: string;
  label: string;
  count: number;
  icon: string;
}

interface Pattern {
  id: string;
  label: string;
  count: number;
  tip: string;
}

interface ProgressPoint {
  date: string;
  score: number;
  taskType: string;
  wordCount: number;
  index: number;
}

interface WeaknessReport {
  hasData: boolean;
  message?: string;
  practiceCount?: number;
  avgScore?: number;
  topWeaknesses?: WeaknessCategory[];
  patterns?: Pattern[];
  aiInsight?: string;
  lastPractice?: string;
}

interface ProgressData {
  hasData: boolean;
  message?: string;
  progress?: ProgressPoint[];
  summary?: {
    totalPractices: number;
    firstScore: number;
    currentScore: number;
    improvement: number;
    averageScore: number;
    trend: 'improving' | 'declining' | 'stable';
  };
}

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sessionId = localStorage.getItem('celpip_session_id');
  if (!sessionId) {
    sessionId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('celpip_session_id', sessionId);
  }
  return sessionId;
}

export default function ProgressTracker() {
  const [activeTab, setActiveTab] = useState<'progress' | 'weakness'>('progress');
  const [isLoading, setIsLoading] = useState(true);
  const [weakness, setWeakness] = useState<WeaknessReport | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    const sessionId = getSessionId();

    try {
      const [weaknessRes, progressRes] = await Promise.all([
        fetch(`/api/writing-progress?sessionId=${sessionId}&action=report`),
        fetch(`/api/writing-progress?sessionId=${sessionId}&action=progress`),
      ]);

      if (weaknessRes.ok) {
        setWeakness(await weaknessRes.json());
      }
      if (progressRes.ok) {
        setProgress(await progressRes.json());
      }
    } catch (err) {
      setError('Failed to load progress data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp size={20} className={styles.trendUp} />;
      case 'declining': return <TrendingDown size={20} className={styles.trendDown} />;
      default: return <Minus size={20} className={styles.trendStable} />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 10) return '#10b981';
    if (score >= 8) return '#34d399';
    if (score >= 6) return '#fbbf24';
    if (score >= 4) return '#fb923c';
    return '#ef4444';
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <Loader2 size={32} className={styles.spinner} />
          <p>Loading your progress...</p>
        </div>
      </div>
    );
  }

  const hasAnyData = (weakness?.hasData || progress?.hasData);

  if (!hasAnyData) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <BarChart3 size={48} />
          <h3>No Data Yet</h3>
          <p>Complete a few writing practices with AI evaluation to see your progress and weaknesses.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2>
          <BarChart3 size={22} />
          Your Progress
        </h2>
        <button className={styles.refreshButton} onClick={fetchData}>
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'progress' ? styles.active : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          <TrendingUp size={16} />
          Progress
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'weakness' ? styles.active : ''}`}
          onClick={() => setActiveTab('weakness')}
        >
          <Target size={16} />
          Weaknesses
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {activeTab === 'progress' && progress?.hasData && progress.summary && (
          <div className={styles.progressSection}>
            {/* Score Summary */}
            <div className={styles.scoreSummary}>
              <div className={styles.scoreCard}>
                <span className={styles.scoreLabel}>First Score</span>
                <span 
                  className={styles.scoreValue}
                  style={{ color: getScoreColor(progress.summary.firstScore) }}
                >
                  {progress.summary.firstScore}/12
                </span>
              </div>
              <div className={styles.arrow}>
                <ChevronRight size={24} />
              </div>
              <div className={styles.scoreCard}>
                <span className={styles.scoreLabel}>Current</span>
                <span 
                  className={styles.scoreValue}
                  style={{ color: getScoreColor(progress.summary.currentScore) }}
                >
                  {progress.summary.currentScore}/12
                </span>
              </div>
              <div className={styles.improvementCard}>
                {getTrendIcon(progress.summary.trend)}
                <span className={`${styles.improvementValue} ${styles[progress.summary.trend]}`}>
                  {progress.summary.improvement > 0 ? '+' : ''}{progress.summary.improvement}
                </span>
              </div>
            </div>

            {/* Stats Row */}
            <div className={styles.statsRow}>
              <div className={styles.stat}>
                <span className={styles.statValue}>{progress.summary.totalPractices}</span>
                <span className={styles.statLabel}>Practices</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{progress.summary.averageScore}</span>
                <span className={styles.statLabel}>Avg Score</span>
              </div>
            </div>

            {/* Mini Chart */}
            {progress.progress && progress.progress.length > 1 && (
              <div className={styles.miniChart}>
                <div className={styles.chartLabel}>Score History</div>
                <div className={styles.chartBars}>
                  {progress.progress.map((point, i) => (
                    <div 
                      key={i}
                      className={styles.chartBar}
                      style={{ 
                        height: `${(point.score / 12) * 100}%`,
                        backgroundColor: getScoreColor(point.score)
                      }}
                      title={`${point.score}/12`}
                    />
                  ))}
                </div>
                <div className={styles.chartLabels}>
                  <span>1st</span>
                  <span>Latest</span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'weakness' && weakness?.hasData && (
          <div className={styles.weaknessSection}>
            {/* AI Insight */}
            {weakness.aiInsight && (
              <div className={styles.aiInsight}>
                <div className={styles.insightHeader}>
                  <Sparkles size={18} />
                  <span>AI Coach Says</span>
                </div>
                <p>{weakness.aiInsight}</p>
              </div>
            )}

            {/* Top Weaknesses */}
            {weakness.topWeaknesses && weakness.topWeaknesses.length > 0 && (
              <div className={styles.weaknessCards}>
                <h4>Top Areas to Improve</h4>
                {weakness.topWeaknesses.map((w) => (
                  <div key={w.id} className={styles.weaknessCard}>
                    <span className={styles.weaknessIcon}>{w.icon}</span>
                    <div className={styles.weaknessInfo}>
                      <span className={styles.weaknessLabel}>{w.label}</span>
                      <span className={styles.weaknessCount}>{w.count} issues found</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Patterns */}
            {weakness.patterns && weakness.patterns.length > 0 && (
              <div className={styles.patterns}>
                <h4>Common Patterns</h4>
                {weakness.patterns.map((p) => (
                  <div key={p.id} className={styles.patternCard}>
                    <div className={styles.patternHeader}>
                      <AlertTriangle size={16} />
                      <span>{p.label}</span>
                      <span className={styles.patternCount}>×{p.count}</span>
                    </div>
                    <div className={styles.patternTip}>
                      <Lightbulb size={14} />
                      <span>{p.tip}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Practice Count */}
            <div className={styles.practiceInfo}>
              <span>Based on {weakness.practiceCount} practice{weakness.practiceCount !== 1 ? 's' : ''}</span>
              <span>•</span>
              <span>Avg: {weakness.avgScore}/12</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Export a hook to save analysis
export function useSaveAnalysis() {
  const saveAnalysis = async (data: {
    taskType: 'task1' | 'task2';
    content: string;
    aiScore: number;
    sentenceFeedback?: any;
    scoreFeedback?: any;
    grammarIssues?: number;
    vocabularyIssues?: number;
    structureIssues?: number;
    contentIssues?: number;
    styleIssues?: number;
    hasContractions?: boolean;
    hasOrgWords?: boolean;
    hasSpecificDetails?: boolean;
    hasProperClosing?: boolean;
  }) => {
    const sessionId = getSessionId();
    
    try {
      await fetch('/api/writing-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          sessionId,
          wordCount: data.content.split(/\s+/).length,
        }),
      });
    } catch (e) {
      console.error('Failed to save analysis:', e);
    }
  };

  return { saveAnalysis };
}
