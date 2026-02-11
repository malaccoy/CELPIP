'use client';

import React from 'react';
import { Lock, Sparkles, Zap } from 'lucide-react';
import styles from '@/styles/ProGate.module.scss';

interface ProGateProps {
  feature?: string;
  description?: string;
  compact?: boolean;
}

/**
 * Full card shown when a Pro feature is locked.
 * Use inside pages where the AI feature would normally render.
 */
export function ProGate({ feature, description, compact }: ProGateProps) {
  if (compact) {
    return (
      <div className={styles.compactGate}>
        <Lock size={16} />
        <span>{feature || 'Pro feature'} — upgrade to unlock</span>
      </div>
    );
  }

  return (
    <div className={styles.proGate}>
      <div className={styles.iconWrap}>
        <Lock size={32} />
      </div>
      <h3 className={styles.title}>
        <Sparkles size={18} />
        {feature || 'Pro Feature'}
      </h3>
      <p className={styles.description}>
        {description || 'This feature requires a Pro subscription. Upgrade to get AI-powered feedback, detailed scoring, and personalized recommendations.'}
      </p>
      <button className={styles.upgradeBtn}>
        <Zap size={16} />
        Upgrade to Pro
      </button>
    </div>
  );
}

/**
 * Inline badge for buttons/sections that are Pro-only.
 * Wrap around existing UI: <ProBadge>AI Feedback</ProBadge>
 */
export function ProBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className={styles.proBadge}>
      {children}
      <span className={styles.badgeTag}>
        <Lock size={10} />
        PRO
      </span>
    </span>
  );
}
