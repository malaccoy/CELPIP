'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Trophy, TrendingUp, Target, Flame,
  Headphones, PenTool, BookOpen, Mic, ChevronRight,
  BarChart3, Clock, Star, Zap, RotateCcw
} from 'lucide-react';
import { useScoreTracker, type SectionStats, type ModuleStats } from '@/hooks/useScoreTracker';
import styles from '@/styles/Progress.module.scss';

const SECTION_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode; path: string }> = {
  listening: { label: 'Listening', color: '#f97316', icon: <Headphones size={18} />, path: '/listening/technique' },
  writing: { label: 'Writing', color: '#8b5cf6', icon: <PenTool size={18} />, path: '/writing/mastery' },
  reading: { label: 'Reading', color: '#14b8a6', icon: <BookOpen size={18} />, path: '/reading/technique' },
  speaking: { label: 'Speaking', color: '#3b82f6', icon: <Mic size={18} />, path: '/speaking/technique' },
};

const MODULE_LABELS: Record<string, string> = {
  'task-1': 'Task 1', 'task-2': 'Task 2', 'task-3': 'Task 3', 'task-4': 'Task 4',
  'task-5': 'Task 5', 'task-6': 'Task 6', 'task-7': 'Task 7', 'task-8': 'Task 8',
  'csf': 'CSF Framework', 'creativity': 'Creativity', 'truth-trio': 'Truth Trio',
};

function formatDate(ts: number) {
  if (!ts) return '—';
  const d = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - ts;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ProgressPage() {
  const router = useRouter();
  const { loaded, getOverallStats, getSectionStats, clearAll, data } = useScoreTracker();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showClear, setShowClear] = useState(false);

  if (!loaded) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  const overall = getOverallStats();
  const sections = ['listening', 'writing', 'reading', 'speaking'];
  const sectionStats = sections.map((s) => getSectionStats(s));
  const hasData = overall.totalAttempts > 0;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.push('/')}>
          <ArrowLeft size={18} />
        </button>
        <div className={styles.headerInfo}>
          <h1>Progress Tracker</h1>
          <p>Your quiz performance across all sections</p>
        </div>
      </div>

      {!hasData ? (
        <div className={styles.emptyState}>
          <BarChart3 size={48} />
          <h2>No quiz data yet</h2>
          <p>Complete a Quick Quiz in any technique guide to start tracking your progress.</p>
          <div className={styles.emptyLinks}>
            {sections.map((s) => {
              const cfg = SECTION_CONFIG[s];
              return (
                <button
                  key={s}
                  className={styles.emptyLink}
                  style={{ '--section-color': cfg.color } as React.CSSProperties}
                  onClick={() => router.push(cfg.path)}
                >
                  {cfg.icon}
                  <span>{cfg.label}</span>
                  <ChevronRight size={14} />
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          {/* Overall Stats */}
          <div className={styles.overallGrid}>
            <div className={styles.statCard}>
              <Trophy size={20} className={styles.statIconGold} />
              <div className={styles.statValue}>{overall.averagePercent}%</div>
              <div className={styles.statLabel}>Average Score</div>
            </div>
            <div className={styles.statCard}>
              <Target size={20} className={styles.statIconBlue} />
              <div className={styles.statValue}>{overall.totalAttempts}</div>
              <div className={styles.statLabel}>Quizzes Taken</div>
            </div>
            <div className={styles.statCard}>
              <Zap size={20} className={styles.statIconGreen} />
              <div className={styles.statValue}>{overall.totalCorrect}/{overall.totalQuestions}</div>
              <div className={styles.statLabel}>Questions Right</div>
            </div>
            <div className={styles.statCard}>
              <Flame size={20} className={styles.statIconOrange} />
              <div className={styles.statValue}>{overall.streak}</div>
              <div className={styles.statLabel}>Day Streak</div>
            </div>
          </div>

          {/* Section Breakdown */}
          <div className={styles.sectionsBlock}>
            <h2 className={styles.blockTitle}>
              <BarChart3 size={16} />
              <span>By Section</span>
            </h2>

            {sections.map((sectionId) => {
              const stats = getSectionStats(sectionId);
              const cfg = SECTION_CONFIG[sectionId];
              const isExpanded = expandedSection === sectionId;
              const hasStats = stats.totalAttempts > 0;

              return (
                <div key={sectionId} className={styles.sectionCard} style={{ '--section-color': cfg.color } as React.CSSProperties}>
                  <button
                    className={styles.sectionHeader}
                    onClick={() => setExpandedSection(isExpanded ? null : sectionId)}
                  >
                    <div className={styles.sectionIcon}>{cfg.icon}</div>
                    <div className={styles.sectionInfo}>
                      <span className={styles.sectionName}>{cfg.label}</span>
                      {hasStats ? (
                        <span className={styles.sectionMeta}>
                          {stats.averagePercent}% avg • {stats.totalAttempts} attempts • {formatDate(stats.lastAttempt)}
                        </span>
                      ) : (
                        <span className={styles.sectionMeta}>No quizzes taken yet</span>
                      )}
                    </div>
                    {hasStats && (
                      <div className={styles.sectionScore}>
                        <div className={styles.scoreRing} style={{ '--pct': `${stats.averagePercent}%` } as React.CSSProperties}>
                          <span>{stats.averagePercent}%</span>
                        </div>
                      </div>
                    )}
                    <ChevronRight size={16} className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`} />
                  </button>

                  {isExpanded && hasStats && (
                    <div className={styles.sectionDetail}>
                      {Object.values(stats.moduleStats)
                        .sort((a, b) => a.moduleId.localeCompare(b.moduleId))
                        .map((mod) => (
                          <ModuleRow key={mod.moduleId} mod={mod} sectionColor={cfg.color} />
                        ))}
                      <button
                        className={styles.practiceBtn}
                        onClick={() => router.push(cfg.path)}
                      >
                        Practice {cfg.label}
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  )}

                  {isExpanded && !hasStats && (
                    <div className={styles.sectionDetail}>
                      <p className={styles.noData}>Take a quiz to see your stats here.</p>
                      <button
                        className={styles.practiceBtn}
                        onClick={() => router.push(cfg.path)}
                      >
                        Start {cfg.label}
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Recent Activity */}
          <div className={styles.recentBlock}>
            <h2 className={styles.blockTitle}>
              <Clock size={16} />
              <span>Recent Activity</span>
            </h2>
            <div className={styles.recentList}>
              {[...data.attempts]
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, 10)
                .map((attempt, i) => {
                  const cfg = SECTION_CONFIG[attempt.sectionId];
                  const pct = Math.round((attempt.score / attempt.total) * 100);
                  return (
                    <div key={i} className={styles.recentItem} style={{ '--section-color': cfg?.color || '#666' } as React.CSSProperties}>
                      <div className={styles.recentIcon}>{cfg?.icon}</div>
                      <div className={styles.recentInfo}>
                        <span className={styles.recentTitle}>
                          {cfg?.label} — {MODULE_LABELS[attempt.moduleId] || attempt.moduleId}
                        </span>
                        <span className={styles.recentTime}>{formatDate(attempt.timestamp)}</span>
                      </div>
                      <div className={`${styles.recentScore} ${pct >= 70 ? styles.good : pct >= 50 ? styles.ok : styles.low}`}>
                        {attempt.score}/{attempt.total}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Clear Data */}
          <div className={styles.clearSection}>
            {!showClear ? (
              <button className={styles.clearBtn} onClick={() => setShowClear(true)}>
                <RotateCcw size={14} />
                <span>Reset Progress</span>
              </button>
            ) : (
              <div className={styles.clearConfirm}>
                <p>Delete all quiz history? This can't be undone.</p>
                <div className={styles.clearActions}>
                  <button className={styles.clearCancel} onClick={() => setShowClear(false)}>Cancel</button>
                  <button className={styles.clearConfirmBtn} onClick={() => { clearAll(); setShowClear(false); }}>
                    Delete All
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ModuleRow({ mod, sectionColor }: { mod: ModuleStats; sectionColor: string }) {
  const label = MODULE_LABELS[mod.moduleId] || mod.moduleId;
  return (
    <div className={styles.moduleRow}>
      <div className={styles.moduleInfo}>
        <span className={styles.moduleName}>{label}</span>
        <span className={styles.moduleMeta}>
          {mod.attempts} attempt{mod.attempts !== 1 ? 's' : ''} • Best: {mod.bestPercent}%
        </span>
      </div>
      <div className={styles.moduleBar}>
        <div
          className={styles.moduleBarFill}
          style={{ width: `${mod.lastPercent}%`, background: sectionColor }}
        />
      </div>
      <span className={styles.moduleScore}>{mod.lastPercent}%</span>
    </div>
  );
}
