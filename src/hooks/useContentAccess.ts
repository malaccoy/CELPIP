'use client';

import { useState, useEffect } from 'react';

interface ContentAccess {
  loading: boolean;
  isAuthenticated: boolean;
  isPro: boolean;
}

/**
 * Hook to check user plan status.
 * Returns loading, isAuthenticated, isPro.
 * Non-authenticated users get free limits.
 * Authenticated free users also get free limits.
 * Pro users get everything.
 */
export function useContentAccess(): ContentAccess {
  const [state, setState] = useState<ContentAccess>({
    loading: true,
    isAuthenticated: false,
    isPro: false,
  });

  useEffect(() => {
    fetch('/api/plan')
      .then(async (res) => {
        if (!res.ok) {
          // Not authenticated
          setState({ loading: false, isAuthenticated: false, isPro: false });
          return;
        }
        const data = await res.json();
        setState({
          loading: false,
          isAuthenticated: true,
          isPro: !!data.isPro,
        });
      })
      .catch(() => {
        setState({ loading: false, isAuthenticated: false, isPro: false });
      });
  }, []);

  return state;
}
