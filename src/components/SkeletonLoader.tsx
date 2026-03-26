'use client';

import React from 'react';
import styles from '@/styles/SkeletonLoader.module.scss';

/* ─── Skeleton Primitives ─── */

export function SkeletonBox({
  width,
  height,
  radius = 8,
  className = '',
}: {
  width?: string | number;
  height?: string | number;
  radius?: number;
  className?: string;
}) {
  return (
    <div
      className={`${styles.shimmer} ${className}`}
      style={{
        width: width ?? '100%',
        height: height ?? 16,
        borderRadius: radius,
      }}
    />
  );
}

export function SkeletonCircle({ size = 40 }: { size?: number }) {
  return (
    <div
      className={styles.shimmer}
      style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0 }}
    />
  );
}

export function SkeletonText({
  lines = 3,
  gap = 8,
}: {
  lines?: number;
  gap?: number;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBox
          key={i}
          height={12}
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
}

/* ─── Dashboard Skeleton Presets ─── */

export function DashboardSkeleton() {
  return (
    <div className={styles.dashboardSkeleton}>
      {/* Greeting */}
      <div className={styles.greetingRow}>
        <div>
          <SkeletonBox width={200} height={28} radius={8} />
          <SkeletonBox width={140} height={14} radius={6} />
        </div>
      </div>

      {/* Main Cards */}
      <div className={styles.mainCardsRow}>
        <SkeletonBox height={120} radius={16} />
        <SkeletonBox height={80} radius={16} />
      </div>

      {/* Skills Grid */}
      <div className={styles.sectionLabel}>
        <SkeletonBox width={120} height={16} radius={6} />
      </div>
      <div className={styles.skillsGrid}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={styles.skillCard}>
            <SkeletonCircle size={40} />
            <SkeletonBox width={80} height={14} radius={6} />
            <SkeletonBox width={60} height={10} radius={4} />
          </div>
        ))}
      </div>

      {/* Quick Access */}
      <div className={styles.sectionLabel}>
        <SkeletonBox width={100} height={16} radius={6} />
      </div>
      <div className={styles.quickList}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={styles.quickItem}>
            <SkeletonCircle size={36} />
            <div style={{ flex: 1 }}>
              <SkeletonBox width={120} height={14} radius={6} />
              <SkeletonBox width={80} height={10} radius={4} />
            </div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className={styles.sectionLabel}>
        <SkeletonBox width={110} height={16} radius={6} />
      </div>
      <div className={styles.progressGrid}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={styles.progressCard}>
            <div className={styles.progressTop}>
              <SkeletonCircle size={32} />
              <SkeletonBox width={80} height={14} radius={6} />
            </div>
            <SkeletonBox height={8} radius={4} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Analytics Skeleton ─── */

export function AnalyticsSkeleton() {
  return (
    <div className={styles.analyticsSkeleton}>
      <SkeletonBox width={160} height={20} radius={8} />
      <div className={styles.analyticsGrid}>
        <div className={styles.radarPlaceholder}>
          <SkeletonCircle size={200} />
        </div>
        <div className={styles.statsColumn}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={styles.statRow}>
              <SkeletonCircle size={28} />
              <div style={{ flex: 1 }}>
                <SkeletonBox width={100} height={14} radius={6} />
                <SkeletonBox width={60} height={10} radius={4} />
              </div>
              <SkeletonBox width={40} height={20} radius={6} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
