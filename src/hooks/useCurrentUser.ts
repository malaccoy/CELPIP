'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

/**
 * useCurrentUser — Centralized authentication hook.
 *
 * Replaces scattered `createClient().auth.getUser()` calls across
 * components like BattleLobby, MobileDashboard, MobileTopBar, and page.tsx.
 *
 * Provides:
 *  - `user`        → Full Supabase User object (or null)
 *  - `userId`      → Shortcut to user.id
 *  - `displayName` → Resolved display name (metadata > email prefix)
 *  - `avatarUrl`   → Avatar from user metadata
 *  - `email`       → User email
 *  - `loading`     → True while initial auth check is in progress
 *  - `isLoggedIn`  → Boolean shortcut
 *  - `logout()`    → Signs out and clears state
 *  - `refresh()`   → Force re-fetch current user
 */

export interface CurrentUser {
  user: User | null;
  userId: string | null;
  displayName: string;
  avatarUrl: string | null;
  email: string | null;
  loading: boolean;
  isLoggedIn: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useCurrentUser(): CurrentUser {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => createClient(), []);

  const fetchUser = useCallback(async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchUser]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, [supabase]);

  const refresh = useCallback(async () => {
    setLoading(true);
    await fetchUser();
  }, [fetchUser]);

  const displayName = useMemo(() => {
    if (!user) return 'Guest';
    return (
      user.user_metadata?.name ||
      user.user_metadata?.full_name ||
      user.email?.split('@')[0] ||
      'Player'
    );
  }, [user]);

  const avatarUrl = useMemo(() => {
    if (!user) return null;
    return user.user_metadata?.avatar_url || user.user_metadata?.picture || null;
  }, [user]);

  return {
    user,
    userId: user?.id ?? null,
    displayName,
    avatarUrl,
    email: user?.email ?? null,
    loading,
    isLoggedIn: !!user,
    logout,
    refresh,
  };
}
