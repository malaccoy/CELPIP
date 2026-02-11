'use client';

import { useEffect, useCallback } from 'react';

const STORAGE_KEY = 'celpip_practice_history';
const LAST_SYNC_KEY = 'celpip_last_sync';

interface PracticeEntry {
  task: 'task1' | 'task2';
  score: number;
  wordCount: number;
  timeMinutes: number;
  timestamp: string;
}

// Sync local progress to cloud
export async function syncProgressToCloud(): Promise<boolean> {
  try {
    const localData = localStorage.getItem(STORAGE_KEY);
    if (!localData) return true;

    const practiceHistory: PracticeEntry[] = JSON.parse(localData);
    if (practiceHistory.length === 0) return true;

    const response = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ practiceHistory }),
    });

    if (response.ok) {
      localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
      console.log('✅ Progress synced to cloud');
      return true;
    }
    
    // 401 = not logged in, that's ok
    if (response.status === 401) {
      return true;
    }

    console.error('Failed to sync progress');
    return false;
  } catch (error) {
    console.error('Sync error:', error);
    return false;
  }
}

// Fetch progress from cloud and merge with local
export async function fetchProgressFromCloud(): Promise<PracticeEntry[] | null> {
  try {
    const response = await fetch('/api/progress');
    
    if (!response.ok) {
      if (response.status === 401) return null; // Not logged in
      return null;
    }

    const { data } = await response.json();
    return data as PracticeEntry[];
  } catch (error) {
    console.error('Fetch progress error:', error);
    return null;
  }
}

// Merge cloud and local data (cloud takes priority for same timestamps)
export function mergeProgress(local: PracticeEntry[], cloud: PracticeEntry[]): PracticeEntry[] {
  const merged = new Map<string, PracticeEntry>();
  
  // Add local entries
  for (const entry of local) {
    const key = `${entry.task}-${entry.timestamp}`;
    merged.set(key, entry);
  }
  
  // Cloud entries override local (same key) or add new
  for (const entry of cloud) {
    const key = `${entry.task}-${entry.timestamp}`;
    merged.set(key, entry);
  }
  
  // Sort by timestamp descending
  return Array.from(merged.values()).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

// Full sync: fetch from cloud, merge, save locally, push merged to cloud
export async function fullSync(): Promise<void> {
  try {
    // Get cloud data
    const cloudData = await fetchProgressFromCloud();
    if (cloudData === null) return; // Not logged in or error

    // Get local data
    const localData: PracticeEntry[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    );

    // Merge
    const merged = mergeProgress(localData, cloudData);

    // Save merged locally
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));

    // Push merged to cloud
    await syncProgressToCloud();

    console.log('✅ Full sync complete:', merged.length, 'entries');
  } catch (error) {
    console.error('Full sync error:', error);
  }
}

// Hook to auto-sync on login/page load
export function useProgressSync(isLoggedIn: boolean) {
  const sync = useCallback(async () => {
    if (isLoggedIn) {
      await fullSync();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    sync();
  }, [sync]);

  return { sync, syncToCloud: syncProgressToCloud };
}
