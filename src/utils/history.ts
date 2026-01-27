import { Task1HistoryEntry } from '@/types';

const STORAGE_KEY = 'celpip_task1_history';
const MAX_ENTRIES = 30;

/**
 * Validate that an object has the required Task1HistoryEntry properties
 */
function isValidHistoryEntry(entry: unknown): entry is Task1HistoryEntry {
  if (typeof entry !== 'object' || entry === null) return false;
  const e = entry as Record<string, unknown>;
  return (
    typeof e.id === 'string' &&
    typeof e.dateISO === 'string' &&
    typeof e.wordCount === 'number' &&
    typeof e.score === 'number' &&
    typeof e.level === 'string' &&
    typeof e.errorsCount === 'number' &&
    typeof e.warningsCount === 'number' &&
    typeof e.suggestionsCount === 'number'
  );
}

/**
 * Load history entries from localStorage
 */
export function loadTask1History(): Task1HistoryEntry[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    
    // Filter to only valid entries
    return parsed.filter(isValidHistoryEntry);
  } catch {
    return [];
  }
}

/**
 * Save a new history entry to localStorage
 * Keeps only the latest MAX_ENTRIES entries
 */
export function saveTask1HistoryEntry(entry: Task1HistoryEntry): void {
  if (typeof window === 'undefined') return;
  
  try {
    const existing = loadTask1History();
    const updated = [entry, ...existing].slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Silently fail if localStorage is not available
  }
}

/**
 * Generate a unique ID for a history entry
 */
export function generateHistoryId(): string {
  // Use crypto.randomUUID if available, fallback to timestamp + random
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
