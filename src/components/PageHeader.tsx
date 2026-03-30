'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import styles from '@/styles/PageHeader.module.scss';

export type PageHeaderVariant = 'default' | 'purple' | 'blue' | 'green' | 'amber' | 'red';

interface PageHeaderProps {
  /** Page title */
  title: string;
  /** Optional subtitle / description */
  subtitle?: string;
  /** Badge text (e.g., "Free Tool", "Pro Feature") */
  badge?: string;
  /** Optional icon to show in the badge */
  badgeIcon?: React.ReactNode;
  /** Color variant — affects gradient background and badge color */
  variant?: PageHeaderVariant;
  /** Show a back button */
  showBack?: boolean;
  /** Custom back URL (defaults to router.back()) */
  backUrl?: string;
  /** Optional children rendered below the subtitle */
  children?: React.ReactNode;
}

const variantMap: Record<PageHeaderVariant, string> = {
  default: styles.variantDefault,
  purple: styles.variantPurple,
  blue: styles.variantBlue,
  green: styles.variantGreen,
  amber: styles.variantAmber,
  red: styles.variantRed,
};

const badgeMap: Record<PageHeaderVariant, string> = {
  default: styles.badgeDefault,
  purple: styles.badgePurple,
  blue: styles.badgeBlue,
  green: styles.badgeGreen,
  amber: styles.badgeAmber,
  red: styles.badgeRed,
};

/**
 * PageHeader — Standardized page header component.
 *
 * Ensures consistent typography, spacing, and gradient backgrounds
 * across all internal pages (CRS Calculator, Drills, AI Coach, etc.).
 *
 * Usage:
 * ```tsx
 * <PageHeader
 *   title="CELPIP → CRS Points"
 *   subtitle="See how your scores translate to Express Entry CRS points"
 *   badge="Free Tool"
 *   badgeIcon={<Calculator size={12} />}
 *   variant="purple"
 * />
 * ```
 */
export default function PageHeader({
  title,
  subtitle,
  badge,
  badgeIcon,
  variant = 'default',
  showBack = false,
  backUrl,
  children,
}: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  return (
    <div className={`${styles.header} ${variantMap[variant]}`}>
      {showBack && (
        <button onClick={handleBack} className={styles.backBtn}>
          <ArrowLeft size={14} />
          Back
        </button>
      )}

      {badge && (
        <div className={`${styles.badge} ${badgeMap[variant]}`}>
          {badgeIcon}
          {badge}
        </div>
      )}

      <h1 className={styles.title}>{title}</h1>

      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

      {children}
    </div>
  );
}
