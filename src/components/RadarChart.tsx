'use client';

import React from 'react';
import { PenTool, BookOpen, Mic, Headphones } from 'lucide-react';
import styles from '@/styles/RadarChart.module.scss';

interface SkillScore {
  writing: number;
  reading: number;
  speaking: number;
  listening: number;
}

interface RadarChartProps {
  scores: SkillScore;
  maxScore?: number;
}

export default function RadarChart({ scores, maxScore = 12 }: RadarChartProps) {
  // Center of the chart
  const cx = 150;
  const cy = 150;
  const radius = 85;
  
  // Calculate points for each skill (4 points = diamond shape)
  // Order: Writing (top), Reading (right), Listening (bottom), Speaking (left)
  const skills = [
    { key: 'writing', label: 'Writing', Icon: PenTool, color: '#10b981', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', shadow: '0 4px 16px rgba(16, 185, 129, 0.3), 0 0 20px rgba(16, 185, 129, 0.2)', angle: -90 },
    { key: 'reading', label: 'Reading', Icon: BookOpen, color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', shadow: '0 4px 16px rgba(6, 182, 212, 0.3), 0 0 20px rgba(6, 182, 212, 0.2)', angle: 0 },
    { key: 'listening', label: 'Listening', Icon: Headphones, color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', shadow: '0 4px 16px rgba(245, 158, 11, 0.3), 0 0 20px rgba(245, 158, 11, 0.2)', angle: 90 },
    { key: 'speaking', label: 'Speaking', Icon: Mic, color: '#a855f7', gradient: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)', shadow: '0 4px 16px rgba(168, 85, 247, 0.3), 0 0 20px rgba(168, 85, 247, 0.2)', angle: 180 },
  ];

  // Convert angle and distance to x,y coordinates
  const polarToCartesian = (angle: number, distance: number) => {
    const radians = (angle * Math.PI) / 180;
    return {
      x: cx + distance * Math.cos(radians),
      y: cy + distance * Math.sin(radians),
    };
  };

  // Generate grid lines (background)
  const gridLevels = [0.25, 0.5, 0.75, 1];
  
  // Calculate the polygon points for the scores
  const scorePoints = skills.map(skill => {
    const score = scores[skill.key as keyof SkillScore] || 0;
    const normalizedScore = Math.max(Math.min(score / maxScore, 1), 0.08); // Min 8% to show something
    const point = polarToCartesian(skill.angle, radius * normalizedScore);
    return point;
  });

  const scorePolygonPath = scorePoints.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ') + ' Z';

  // Calculate overall percentage
  const validScores = [scores.writing, scores.reading, scores.speaking, scores.listening].filter(s => s > 0);
  const avgScore = validScores.length > 0 
    ? validScores.reduce((a, b) => a + b, 0) / validScores.length 
    : 0;
  const overallPercent = Math.round((avgScore / maxScore) * 100);

  const getLevel = (percent: number) => {
    if (percent >= 83) return 'Expert';
    if (percent >= 67) return 'Advanced';
    if (percent >= 50) return 'Intermediate';
    if (percent >= 33) return 'Developing';
    if (percent > 0) return 'Beginner';
    return 'Not Started';
  };

  return (
    <div className={styles.radarContainer}>
      {/* Header with overall score */}
      <div className={styles.header}>
        <div className={styles.levelInfo}>
          <span className={styles.levelLabel}>YOUR LEVEL</span>
          <span className={styles.levelValue}>{getLevel(overallPercent)}</span>
          <span className={styles.poweredBy}>
            <span className={styles.bolt}>⚡</span>
            POWERED BY AI
          </span>
        </div>
        <div className={styles.percentCircle}>
          <svg viewBox="0 0 100 100">
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>
            <circle
              className={styles.bgCircle}
              cx="50"
              cy="50"
              r="42"
              fill="none"
              strokeWidth="6"
            />
            <circle
              className={styles.progressCircle}
              cx="50"
              cy="50"
              r="42"
              fill="none"
              strokeWidth="6"
              strokeDasharray={`${overallPercent * 2.64} 264`}
              strokeLinecap="round"
              stroke="url(#progressGradient)"
            />
          </svg>
          <span className={styles.percentValue}>{overallPercent}%</span>
        </div>
      </div>

      {/* Radar Chart */}
      <div className={styles.chartWrapper}>
        <svg viewBox="0 0 300 300" className={styles.chart}>
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Grid levels (diamond shapes) */}
          {gridLevels.map((level, i) => {
            const points = skills.map(skill => 
              polarToCartesian(skill.angle, radius * level)
            );
            const path = points.map((p, j) => 
              `${j === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
            ).join(' ') + ' Z';
            
            return (
              <path
                key={i}
                d={path}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
                className={styles.gridLine}
              />
            );
          })}

          {/* Axis lines */}
          {skills.map((skill, i) => {
            const end = polarToCartesian(skill.angle, radius);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={end.x}
                y2={end.y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
            );
          })}

          {/* Score polygon with glow */}
          <path
            d={scorePolygonPath}
            fill="url(#radarFill)"
            stroke="url(#radarStroke)"
            strokeWidth="2.5"
            filter="url(#glow)"
            className={styles.scorePath}
          />

          {/* Score points with glow */}
          {scorePoints.map((point, i) => (
            <g key={i} filter="url(#softGlow)">
              <circle
                cx={point.x}
                cy={point.y}
                r="6"
                fill={skills[i].color}
                className={styles.scorePoint}
              />
              <circle
                cx={point.x}
                cy={point.y}
                r="3"
                fill="#ffffff"
                opacity="0.9"
              />
            </g>
          ))}
        </svg>

        {/* Skill labels positioned around the chart */}
        {skills.map((skill) => {
          const labelPos = polarToCartesian(skill.angle, radius + 55);
          const score = scores[skill.key as keyof SkillScore] || 0;
          const Icon = skill.Icon;
          
          return (
            <div
              key={skill.key}
              className={styles.skillLabel}
              style={{
                left: `${(labelPos.x / 300) * 100}%`,
                top: `${(labelPos.y / 300) * 100}%`,
              }}
            >
              <div 
                className={styles.skillIcon}
                style={{ 
                  background: skill.gradient,
                  boxShadow: skill.shadow
                }}
              >
                <Icon size={20} strokeWidth={2.5} />
              </div>
              <span className={styles.skillName}>{skill.label}</span>
              <span className={styles.skillScore}>
                {score > 0 ? `${score.toFixed(1)}` : '—'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <p className={styles.disclaimer}>
        Based on your practice performance. Not an official CELPIP score.
      </p>
    </div>
  );
}
