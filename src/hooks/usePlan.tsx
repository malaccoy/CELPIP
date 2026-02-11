'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface PlanState {
  plan: 'free' | 'pro';
  isPro: boolean;
  loading: boolean;
}

const PlanContext = createContext<PlanState>({
  plan: 'free',
  isPro: false,
  loading: true,
});

export function PlanProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlanState>({
    plan: 'free',
    isPro: false,
    loading: true,
  });

  useEffect(() => {
    fetch('/api/plan')
      .then(res => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then(data => {
        setState({
          plan: data.plan,
          isPro: data.isPro,
          loading: false,
        });
      })
      .catch(() => {
        setState({
          plan: 'free',
          isPro: false,
          loading: false,
        });
      });
  }, []);

  return (
    <PlanContext.Provider value={state}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  return useContext(PlanContext);
}
