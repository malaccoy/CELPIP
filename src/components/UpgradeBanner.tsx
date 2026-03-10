'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock, Sparkles, ArrowRight, X, Crown, Zap, BarChart3, Brain, CheckCircle } from 'lucide-react';
import styles from '@/styles/UpgradeBanner.module.scss';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  context?: string; // e.g. "writing prompts", "reading passages"
}

const PRO_FEATURES = [
  { icon: Brain, text: 'AI Writing Tutor with detailed feedback' },
  { icon: Zap, text: 'Unlimited practice exercises' },
  { icon: BarChart3, text: 'Weakness reports & progress tracking' },
  { icon: Sparkles, text: 'AI Speaking Coach with transcription' },
];

export function UpgradeModal({ isOpen, onClose, context }: UpgradeModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`${styles.overlay} ${visible ? styles.overlayVisible : ''}`} onClick={onClose}>
      <div className={`${styles.modal} ${visible ? styles.modalVisible : ''}`} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={20} />
        </button>

        <div className={styles.modalIcon}>
          <Crown size={36} />
        </div>

        <h2 className={styles.modalTitle}>
          Unlock All {context || 'Content'}
        </h2>

        <p className={styles.modalSubtitle}>
          You&apos;ve explored the free content — upgrade to Pro and get everything you need to ace the CELPIP test.
        </p>

        <div className={styles.featureList}>
          {PRO_FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div key={i} className={styles.featureItem}>
                <Icon size={18} className={styles.featureIcon} />
                <span>{feat.text}</span>
              </div>
            );
          })}
        </div>

        <Link href="/pricing" className={styles.upgradeBtn} onClick={onClose}>
          <Sparkles size={18} />
          <span>View Pro Plans</span>
          <ArrowRight size={16} />
        </Link>

        <button className={styles.dismissBtn} onClick={onClose}>
          Maybe later
        </button>
      </div>
    </div>
  );
}

interface UpgradeInlineBannerProps {
  totalItems: number;
  freeItems: number;
  context?: string;
}

export function UpgradeInlineBanner({ totalItems, freeItems, context }: UpgradeInlineBannerProps) {
  const lockedCount = totalItems - freeItems;

  return (
    <div className={styles.inlineBanner}>
      <div className={styles.bannerLeft}>
        <div className={styles.bannerIcon}>
          <Lock size={18} />
        </div>
        <div className={styles.bannerText}>
          <p className={styles.bannerTitle}>
            <strong>{lockedCount} more {context || 'items'}</strong> available with Pro
          </p>
          <p className={styles.bannerSubtext}>
            Unlock all content + AI feedback
          </p>
        </div>
      </div>
      <Link href="/pricing" className={styles.bannerBtn}>
        <Crown size={14} />
        <span>Upgrade</span>
      </Link>
    </div>
  );
}
