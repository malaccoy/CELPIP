'use client';

import React, { useEffect, useState, useMemo } from 'react';
import styles from '@/styles/ActivityHeatmap.module.scss';

interface ActivityDay {
  date: string; // YYYY-MM-DD
  count: number;
}

interface ActivityHeatmapProps {
  /** API endpoint to fetch activity data */
  endpoint?: string;
  /** Fallback data */
  data?: ActivityDay[];
  /** Number of weeks to show */
  weeks?: number;
}

/**
 * ActivityHeatmap — GitHub-style activity heatmap.
 *
 * Shows daily practice activity over the past N weeks.
 * Each cell represents one day, colored by activity intensity.
 */
export default function ActivityHeatmap({
  endpoint = '/api/activity-heatmap',
  data: externalData,
  weeks = 13,
}: ActivityHeatmapProps) {
  const [data, setData] = useState<ActivityDay[]>(externalData || []);
  const [loading, setLoading] = useState(!externalData);

  useEffect(() => {
    if (externalData) return;
    fetch(endpoint)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.activity) setData(d.activity);
        else if (Array.isArray(d)) setData(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [endpoint, externalData]);

  const { grid, months, totalDays, activeDays, maxCount } = useMemo(() => {
    const today = new Date();
    const totalDays = weeks * 7;
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - totalDays + 1);

    // Build a lookup map
    const countMap = new Map<string, number>();
    data.forEach(d => countMap.set(d.date, d.count));

    // Build grid (columns = weeks, rows = days of week)
    const grid: { date: string; count: number; dayOfWeek: number }[][] = [];
    let currentWeek: typeof grid[0] = [];
    let activeDays = 0;
    let maxCount = 0;

    for (let i = 0; i < totalDays; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const count = countMap.get(dateStr) || 0;
      const dayOfWeek = date.getDay();

      if (dayOfWeek === 0 && currentWeek.length > 0) {
        grid.push(currentWeek);
        currentWeek = [];
      }

      currentWeek.push({ date: dateStr, count, dayOfWeek });
      if (count > 0) activeDays++;
      if (count > maxCount) maxCount = count;
    }
    if (currentWeek.length > 0) grid.push(currentWeek);

    // Month labels
    const months: { label: string; col: number }[] = [];
    let lastMonth = -1;
    grid.forEach((week, colIdx) => {
      const firstDay = new Date(week[0].date);
      const month = firstDay.getMonth();
      if (month !== lastMonth) {
        months.push({
          label: firstDay.toLocaleDateString('en', { month: 'short' }),
          col: colIdx,
        });
        lastMonth = month;
      }
    });

    return { grid, months, totalDays, activeDays, maxCount };
  }, [data, weeks]);

  const getIntensity = (count: number): string => {
    if (count === 0) return styles.cellEmpty;
    if (maxCount <= 1) return styles.cellHigh;
    const ratio = count / maxCount;
    if (ratio >= 0.75) return styles.cellHigh;
    if (ratio >= 0.5) return styles.cellMedium;
    if (ratio >= 0.25) return styles.cellLow;
    return styles.cellMinimal;
  };

  if (loading) {
    return <div className={styles.container}><div className={styles.skeleton} /></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4 className={styles.title}>Practice Activity</h4>
        <span className={styles.summary}>
          {activeDays} active days in the last {weeks} weeks
        </span>
      </div>

      <div className={styles.heatmapWrapper}>
        {/* Month labels */}
        <div className={styles.monthRow}>
          {months.map((m, i) => (
            <span
              key={i}
              className={styles.monthLabel}
              style={{ gridColumn: m.col + 2 }}
            >
              {m.label}
            </span>
          ))}
        </div>

        {/* Day labels */}
        <div className={styles.grid}>
          <div className={styles.dayLabels}>
            <span></span>
            <span className={styles.dayLabel}>Mon</span>
            <span></span>
            <span className={styles.dayLabel}>Wed</span>
            <span></span>
            <span className={styles.dayLabel}>Fri</span>
            <span></span>
          </div>

          {grid.map((week, colIdx) => (
            <div key={colIdx} className={styles.weekCol}>
              {week.map((day) => (
                <div
                  key={day.date}
                  className={`${styles.cell} ${getIntensity(day.count)}`}
                  title={`${day.date}: ${day.count} exercise${day.count !== 1 ? 's' : ''}`}
                  style={{ gridRow: day.dayOfWeek + 1 }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <span className={styles.legendLabel}>Less</span>
        <div className={`${styles.legendCell} ${styles.cellEmpty}`} />
        <div className={`${styles.legendCell} ${styles.cellMinimal}`} />
        <div className={`${styles.legendCell} ${styles.cellLow}`} />
        <div className={`${styles.legendCell} ${styles.cellMedium}`} />
        <div className={`${styles.legendCell} ${styles.cellHigh}`} />
        <span className={styles.legendLabel}>More</span>
      </div>
    </div>
  );
}
