'use client';

import { useState, useEffect, useCallback } from 'react';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface SectionPerformance {
  section: string;
  level: SkillLevel;
  avgScore: number; // 0-1
  attempts: number;
  trend: 'improving' | 'stable' | 'declining';
  lastAttempt?: string;
}

interface StoredAttempt {
  sectionId: string;
  moduleId: string;
  score: number;
  total: number;
  timestamp: number;
}

const STORAGE_KEY = 'celpip-adaptive-difficulty';
const RECENT_WINDOW = 10; // last N attempts per section

function computeLevel(avgScore: number, attempts: number): SkillLevel {
  if (attempts < 3) return 'intermediate'; // default until enough data
  if (avgScore >= 0.8) return 'advanced';
  if (avgScore >= 0.55) return 'intermediate';
  return 'beginner';
}

function computeTrend(scores: number[]): 'improving' | 'stable' | 'declining' {
  if (scores.length < 4) return 'stable';
  const half = Math.floor(scores.length / 2);
  const firstHalf = scores.slice(0, half);
  const secondHalf = scores.slice(half);
  const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  const diff = avgSecond - avgFirst;
  if (diff > 0.08) return 'improving';
  if (diff < -0.08) return 'declining';
  return 'stable';
}

export function useAdaptiveDifficulty() {
  const [performances, setPerformances] = useState<Record<string, SectionPerformance>>({});
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const attempts: StoredAttempt[] = JSON.parse(raw);
        const perf = computePerformances(attempts);
        setPerformances(perf);
      }
    } catch {}
    setLoaded(true);
  }, []);

  // Also try server sync
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/quiz-scores');
        if (!res.ok) return;
        const data = await res.json();
        if (data.scores?.length) {
          const serverAttempts: StoredAttempt[] = data.scores.map((s: any) => ({
            sectionId: s.sectionId,
            moduleId: s.moduleId || '',
            score: s.score,
            total: s.total,
            timestamp: new Date(s.createdAt).getTime(),
          }));
          // Merge with localStorage
          const localRaw = localStorage.getItem(STORAGE_KEY);
          const localAttempts: StoredAttempt[] = localRaw ? JSON.parse(localRaw) : [];
          const merged = mergeAttempts(localAttempts, serverAttempts);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          setPerformances(computePerformances(merged));
        }
      } catch {}
    })();
  }, []);

  const recordAttempt = useCallback((sectionId: string, moduleId: string, score: number, total: number) => {
    const attempt: StoredAttempt = {
      sectionId,
      moduleId,
      score,
      total,
      timestamp: Date.now(),
    };

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const attempts: StoredAttempt[] = raw ? JSON.parse(raw) : [];
      attempts.push(attempt);
      // Keep last 100 attempts total
      const trimmed = attempts.slice(-100);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      setPerformances(computePerformances(trimmed));
    } catch {}
  }, []);

  const getLevelForSection = useCallback((section: string): SkillLevel => {
    return performances[section]?.level || 'intermediate';
  }, [performances]);

  const getDifficultyForAPI = useCallback((section: string): string => {
    const level = getLevelForSection(section);
    // Map to API difficulty names
    return level;
  }, [getLevelForSection]);

  return {
    performances,
    loaded,
    recordAttempt,
    getLevelForSection,
    getDifficultyForAPI,
  };
}

// ─── Helpers ─────────────────────────────────────

function computePerformances(attempts: StoredAttempt[]): Record<string, SectionPerformance> {
  const bySection: Record<string, StoredAttempt[]> = {};
  for (const a of attempts) {
    if (!bySection[a.sectionId]) bySection[a.sectionId] = [];
    bySection[a.sectionId].push(a);
  }

  const result: Record<string, SectionPerformance> = {};
  for (const [section, sAttempts] of Object.entries(bySection)) {
    const recent = sAttempts
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, RECENT_WINDOW);

    const scores = recent.map(a => a.total > 0 ? a.score / a.total : 0);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    result[section] = {
      section,
      level: computeLevel(avgScore, recent.length),
      avgScore,
      attempts: sAttempts.length,
      trend: computeTrend(scores.reverse()), // oldest → newest for trend
      lastAttempt: recent[0] ? new Date(recent[0].timestamp).toISOString() : undefined,
    };
  }

  return result;
}

function mergeAttempts(local: StoredAttempt[], server: StoredAttempt[]): StoredAttempt[] {
  const all = [...local, ...server];
  // Deduplicate by timestamp + section (rough)
  const seen = new Set<string>();
  const unique: StoredAttempt[] = [];
  for (const a of all.sort((x, y) => x.timestamp - y.timestamp)) {
    const key = `${a.sectionId}-${a.timestamp}-${a.score}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(a);
    }
  }
  return unique.slice(-100);
}
