'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Target, Zap } from 'lucide-react';
import { usePlan } from '@/hooks/usePlan';
import { analytics } from '@/lib/analytics';
import styles from '@/styles/UpgradeTrigger.module.scss';

interface UpgradeTriggerProps {
  /** What the user just completed */
  context?: 'writing' | 'speaking';
}

/**
 * Shows after a free user completes a Writing or Speaking exercise.
 * Hidden for Pro users.
 */
export default function UpgradeTrigger({ context = 'writing' }: UpgradeTriggerProps) {
  const { isPro, loading } = usePlan();

  if (loading || isPro) return null;

  const messages = {
    writing: {
      title: 'Your response was saved! ✅',
      subtitle: 'Want to know your estimated CLB score and exactly what to improve?',
      features: [
        'AI scores your writing on the 1-12 CELPIP scale',
        'Pinpoints grammar, vocabulary & structure issues',
        'Suggests specific improvements for higher CLB',
      ],
    },
    speaking: {
      title: 'Your recording was saved! ✅',
      subtitle: 'Want AI analysis of your pronunciation, fluency & coherence?',
      features: [
        'AI transcribes and analyzes your speaking',
        'Feedback on pronunciation & fluency',
        'Specific tips to reach your target CLB',
      ],
    },
  };

  const msg = messages[context];

  return (
    <div className={styles.trigger}>
      <div className={styles.header}>
        <Sparkles size={20} className={styles.icon} />
        <div>
          <h4 className={styles.title}>{msg.title}</h4>
          <p className={styles.subtitle}>{msg.subtitle}</p>
        </div>
      </div>

      <ul className={styles.features}>
        {msg.features.map((f, i) => (
          <li key={i}>
            <Target size={14} />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Link href="/pricing" className={styles.cta} onClick={() => analytics.beginCheckout()}>
        <Zap size={16} />
        <span>Unlock AI Feedback — Start 3-Day Free Trial</span>
        <ArrowRight size={16} />
      </Link>

      <p className={styles.reassurance}>No charge for 3 days. Cancel anytime.</p>
    </div>
  );
}
