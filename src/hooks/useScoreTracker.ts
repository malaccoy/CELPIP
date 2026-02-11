'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface QuizAttempt {
  moduleId: string;
  sectionId: string;
  score: number;
  total: number;
  timestamp: number; // epoch ms
}

export interface SectionStats {
  sectionId: string;
  totalAttempts: number;
  totalCorrect: number;
  totalQuestions: number;
  averagePercent: number;
  bestPercent: number;
  lastAttempt: number; // epoch ms
  moduleStats: Record<string, ModuleStats>;
}

export interface ModuleStats {
  moduleId: string;
  attempts: number;
  bestScore: number;
  bestTotal: number;
  bestPercent: number;
  lastScore: number;
  lastTotal: number;
  lastPercent: number;
  lastAttempt: number;
  history: { score: number; total: number; timestamp: number }[];
}

export interface ScoreData {
  attempts: QuizAttempt[];
  version: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'celpip-score-tracker';
const CURRENT_VERSION = 1;
const MAX_HISTORY_PER_MODULE = 20;

// ─── Local Storage Helpers ────────────────────────────────────────────────────

function loadLocal(): ScoreData {
  if (typeof window === 'undefined') return { attempts: [], version: CURRENT_VERSION };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { attempts: [], version: CURRENT_VERSION };
    return JSON.parse(raw) as ScoreData;
  } catch {
    return { attempts: [], version: CURRENT_VERSION };
  }
}

function saveLocal(data: ScoreData) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage full or blocked
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useScoreTracker() {
  const [data, setData] = useState<ScoreData>({ attempts: [], version: CURRENT_VERSION });
  const [loaded, setLoaded] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const syncedRef = useRef(false);

  // Load data: try API first (if logged in), fallback to localStorage
  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        try {
          const res = await fetch('/api/quiz-scores');
          if (res.ok) {
            const serverData: ScoreData = await res.json();

            // Merge: if localStorage has data not yet synced, push it
            const local = loadLocal();
            if (local.attempts.length > 0 && !syncedRef.current) {
              const merged = mergeAttempts(serverData.attempts, local.attempts);
              const mergedData = { attempts: merged, version: CURRENT_VERSION };

              // Push any local-only attempts to server
              const localOnly = findLocalOnly(local.attempts, serverData.attempts);
              for (const a of localOnly) {
                await fetch('/api/quiz-scores', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(a),
                }).catch(() => {});
              }

              setData(mergedData);
              saveLocal(mergedData);
              syncedRef.current = true;
            } else {
              setData(serverData);
              saveLocal(serverData); // cache locally
            }
            setLoaded(true);
            return;
          }
        } catch {
          // API failed — fall through to localStorage
        }
      }

      // Not logged in or API failed — use localStorage
      setData(loadLocal());
      setLoaded(true);
    }

    init();
  }, []);

  // Record a quiz attempt
  const recordAttempt = useCallback(async (sectionId: string, moduleId: string, score: number, total: number) => {
    const attempt: QuizAttempt = {
      moduleId,
      sectionId,
      score,
      total,
      timestamp: Date.now(),
    };

    setData((prev) => {
      // Trim history per module
      const moduleAttempts = prev.attempts.filter(
        (a) => a.sectionId === sectionId && a.moduleId === moduleId
      );
      let newAttempts = [...prev.attempts, attempt];
      if (moduleAttempts.length >= MAX_HISTORY_PER_MODULE) {
        const oldest = moduleAttempts[0];
        const idx = newAttempts.findIndex(
          (a) => a.timestamp === oldest.timestamp && a.moduleId === oldest.moduleId && a.sectionId === oldest.sectionId
        );
        if (idx !== -1) newAttempts.splice(idx, 1);
      }

      const updated = { ...prev, attempts: newAttempts };
      saveLocal(updated);
      return updated;
    });

    // Sync to server if logged in
    if (userId) {
      try {
        await fetch('/api/quiz-scores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sectionId, moduleId, score, total }),
        });
      } catch {
        // Offline — localStorage has the data, will sync on next load
      }
    }
  }, [userId]);

  // Clear all data
  const clearAll = useCallback(async () => {
    const empty: ScoreData = { attempts: [], version: CURRENT_VERSION };
    setData(empty);
    saveLocal(empty);

    if (userId) {
      try {
        await fetch('/api/quiz-scores', { method: 'DELETE' });
      } catch {}
    }
  }, [userId]);

  // Get stats for a section
  const getSectionStats = useCallback((sectionId: string): SectionStats => {
    const sectionAttempts = data.attempts.filter((a) => a.sectionId === sectionId);

    const moduleMap: Record<string, QuizAttempt[]> = {};
    for (const a of sectionAttempts) {
      if (!moduleMap[a.moduleId]) moduleMap[a.moduleId] = [];
      moduleMap[a.moduleId].push(a);
    }

    const moduleStats: Record<string, ModuleStats> = {};
    let totalCorrect = 0;
    let totalQuestions = 0;

    for (const [moduleId, attempts] of Object.entries(moduleMap)) {
      const sorted = [...attempts].sort((a, b) => a.timestamp - b.timestamp);
      const last = sorted[sorted.length - 1];
      const bestAttempt = sorted.reduce((best, a) => {
        const pct = (a.score / a.total) * 100;
        const bestPct = (best.score / best.total) * 100;
        return pct > bestPct ? a : best;
      }, sorted[0]);

      for (const a of sorted) {
        totalCorrect += a.score;
        totalQuestions += a.total;
      }

      moduleStats[moduleId] = {
        moduleId,
        attempts: sorted.length,
        bestScore: bestAttempt.score,
        bestTotal: bestAttempt.total,
        bestPercent: Math.round((bestAttempt.score / bestAttempt.total) * 100),
        lastScore: last.score,
        lastTotal: last.total,
        lastPercent: Math.round((last.score / last.total) * 100),
        lastAttempt: last.timestamp,
        history: sorted.map((a) => ({ score: a.score, total: a.total, timestamp: a.timestamp })),
      };
    }

    const avgPct = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    const bestPct = Object.values(moduleStats).length > 0
      ? Math.max(...Object.values(moduleStats).map((m) => m.bestPercent))
      : 0;
    const lastAttempt = sectionAttempts.length > 0
      ? Math.max(...sectionAttempts.map((a) => a.timestamp))
      : 0;

    return {
      sectionId,
      totalAttempts: sectionAttempts.length,
      totalCorrect,
      totalQuestions,
      averagePercent: avgPct,
      bestPercent: bestPct,
      lastAttempt,
      moduleStats,
    };
  }, [data]);

  // Get all section IDs that have data
  const getActiveSections = useCallback((): string[] => {
    const sections = new Set(data.attempts.map((a) => a.sectionId));
    return Array.from(sections);
  }, [data]);

  // Get overall stats
  const getOverallStats = useCallback(() => {
    const totalAttempts = data.attempts.length;
    const totalCorrect = data.attempts.reduce((s, a) => s + a.score, 0);
    const totalQuestions = data.attempts.reduce((s, a) => s + a.total, 0);
    const averagePercent = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    // Streak: consecutive days with at least one attempt
    const daySet = new Set(
      data.attempts.map((a) => {
        const d = new Date(a.timestamp);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      })
    );
    const days = Array.from(daySet).sort();
    let streak = 0;
    if (days.length > 0) {
      streak = 1;
      for (let i = days.length - 1; i > 0; i--) {
        const curr = new Date(days[i]);
        const prev = new Date(days[i - 1]);
        const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
        if (diff <= 1) streak++;
        else break;
      }
    }

    return { totalAttempts, totalCorrect, totalQuestions, averagePercent, streak };
  }, [data]);

  return {
    loaded,
    data,
    recordAttempt,
    clearAll,
    getSectionStats,
    getActiveSections,
    getOverallStats,
  };
}

// ─── Merge Helpers ────────────────────────────────────────────────────────────

function mergeAttempts(server: QuizAttempt[], local: QuizAttempt[]): QuizAttempt[] {
  // Combine both, deduplicate by timestamp+module+section
  const map = new Map<string, QuizAttempt>();

  for (const a of server) {
    map.set(`${a.sectionId}:${a.moduleId}:${a.timestamp}`, a);
  }
  for (const a of local) {
    const key = `${a.sectionId}:${a.moduleId}:${a.timestamp}`;
    if (!map.has(key)) {
      map.set(key, a);
    }
  }

  return Array.from(map.values()).sort((a, b) => a.timestamp - b.timestamp);
}

function findLocalOnly(local: QuizAttempt[], server: QuizAttempt[]): QuizAttempt[] {
  const serverKeys = new Set(
    server.map(a => `${a.sectionId}:${a.moduleId}:${a.timestamp}`)
  );
  return local.filter(a => !serverKeys.has(`${a.sectionId}:${a.moduleId}:${a.timestamp}`));
}
