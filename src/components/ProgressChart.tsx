'use client';

import React, { useEffect, useState, useMemo } from 'react';
import styles from '@/styles/ProgressChart.module.scss';

interface DataPoint {
  date: string;
  clb: number;
  skill?: string;
}

interface ProgressChartProps {
  /** API endpoint to fetch progress data from */
  endpoint?: string;
  /** Fallback data if no endpoint provided */
  data?: DataPoint[];
  /** Chart height in pixels */
  height?: number;
  /** Show skill breakdown lines */
  showSkills?: boolean;
}

const SKILL_COLORS: Record<string, string> = {
  listening: '#3b82f6',
  reading: '#22c55e',
  writing: '#f59e0b',
  speaking: '#8b5cf6',
  overall: '#60a5fa',
};

/**
 * ProgressChart — SVG-based CLB score evolution chart.
 *
 * Lightweight alternative to Recharts for the dashboard.
 * Shows the user's estimated CLB score over time with
 * optional per-skill breakdown lines.
 */
export default function ProgressChart({
  endpoint = '/api/progress-history',
  data: externalData,
  height = 200,
  showSkills = false,
}: ProgressChartProps) {
  const [data, setData] = useState<DataPoint[]>(externalData || []);
  const [loading, setLoading] = useState(!externalData);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (externalData) return;
    fetch(endpoint)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.history) setData(d.history);
        else if (Array.isArray(d)) setData(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [endpoint, externalData]);

  const chartData = useMemo(() => {
    if (data.length === 0) return null;

    const padding = 40;
    const width = 360;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const minCLB = Math.max(1, Math.min(...data.map(d => d.clb)) - 1);
    const maxCLB = Math.min(12, Math.max(...data.map(d => d.clb)) + 1);
    const range = maxCLB - minCLB || 1;

    const points = data.map((d, i) => ({
      x: padding + (i / Math.max(data.length - 1, 1)) * chartWidth,
      y: padding + chartHeight - ((d.clb - minCLB) / range) * chartHeight,
      clb: d.clb,
      date: d.date,
    }));

    const pathD = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ');

    const areaD = pathD + ` L ${points[points.length - 1].x} ${padding + chartHeight} L ${points[0].x} ${padding + chartHeight} Z`;

    // Y-axis labels
    const yLabels = [];
    const step = range <= 4 ? 1 : 2;
    for (let v = minCLB; v <= maxCLB; v += step) {
      yLabels.push({
        value: v,
        y: padding + chartHeight - ((v - minCLB) / range) * chartHeight,
      });
    }

    return { points, pathD, areaD, yLabels, width, minCLB, maxCLB, padding, chartHeight };
  }, [data, height]);

  if (loading) {
    return (
      <div className={styles.container} style={{ height }}>
        <div className={styles.skeleton} />
      </div>
    );
  }

  if (!chartData || data.length < 2) {
    return (
      <div className={styles.container} style={{ height }}>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📈</div>
          <p className={styles.emptyText}>
            Complete a few exercises to see your progress chart
          </p>
        </div>
      </div>
    );
  }

  const { points, pathD, areaD, yLabels, width, padding, chartHeight } = chartData;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4 className={styles.title}>CLB Score Evolution</h4>
        {hoveredIndex !== null && (
          <div className={styles.tooltip}>
            <span className={styles.tooltipValue}>CLB {points[hoveredIndex].clb}</span>
            <span className={styles.tooltipDate}>{points[hoveredIndex].date}</span>
          </div>
        )}
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={styles.svg}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {/* Grid lines */}
        {yLabels.map(label => (
          <g key={label.value}>
            <line
              x1={padding}
              y1={label.y}
              x2={width - padding}
              y2={label.y}
              className={styles.gridLine}
            />
            <text
              x={padding - 8}
              y={label.y + 4}
              className={styles.yLabel}
            >
              {label.value}
            </text>
          </g>
        ))}

        {/* Area fill */}
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#chartGradient)" />

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke="#60a5fa"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={hoveredIndex === i ? 6 : 4}
              className={`${styles.dot} ${hoveredIndex === i ? styles.dotActive : ''}`}
              onMouseEnter={() => setHoveredIndex(i)}
            />
            {/* Invisible larger hit area */}
            <circle
              cx={p.x}
              cy={p.y}
              r={15}
              fill="transparent"
              onMouseEnter={() => setHoveredIndex(i)}
            />
          </g>
        ))}

        {/* X-axis date labels (first and last) */}
        {points.length > 0 && (
          <>
            <text x={points[0].x} y={height - 8} className={styles.xLabel}>
              {points[0].date}
            </text>
            <text x={points[points.length - 1].x} y={height - 8} className={`${styles.xLabel} ${styles.xLabelEnd}`}>
              {points[points.length - 1].date}
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
