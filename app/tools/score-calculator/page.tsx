'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calculator, ArrowRight, Target, Info } from 'lucide-react';
import styles from '@/styles/ScoreCalculator.module.scss';

const clbPoints: Record<number, number> = {
  4: 6, 5: 6, 6: 9, 7: 17, 8: 23, 9: 31, 10: 34, 11: 34, 12: 34,
};

const clbDescriptions: Record<number, string> = {
  4: 'Basic',
  5: 'Basic+',
  6: 'Intermediate',
  7: 'Upper Intermediate',
  8: 'Adequate Proficiency',
  9: 'Above Adequate',
  10: 'Advanced',
  11: 'Advanced+',
  12: 'Expert',
};

export default function ScoreCalculatorPage() {
  const [scores, setScores] = useState({ listening: 7, reading: 7, writing: 7, speaking: 7 });

  const updateScore = (skill: string, value: number) => {
    setScores(prev => ({ ...prev, [skill]: Math.max(4, Math.min(12, value)) }));
  };

  const totalCRS = Object.values(scores).reduce((sum, s) => sum + (clbPoints[s] || 0), 0);
  const minCLB = Math.min(...Object.values(scores));
  const avgCLB = (Object.values(scores).reduce((a, b) => a + b, 0) / 4).toFixed(1);

  const expressEntryEligible = minCLB >= 7;
  const cecEligible = minCLB >= 5;
  const citizenshipEligible = scores.listening >= 4 && scores.speaking >= 4;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.badge}>
          <Calculator size={14} />
          <span>Free Tool</span>
        </div>
        <h1>CELPIP CRS Score Calculator</h1>
        <p>See how your CELPIP scores translate to CRS points for Express Entry</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.inputSection}>
          <h2>Your CELPIP Scores</h2>
          {(['listening', 'reading', 'writing', 'speaking'] as const).map(skill => (
            <div key={skill} className={styles.skillRow}>
              <label>{skill.charAt(0).toUpperCase() + skill.slice(1)}</label>
              <div className={styles.scoreControl}>
                <button onClick={() => updateScore(skill, scores[skill] - 1)}>−</button>
                <span className={styles.scoreValue}>{scores[skill]}</span>
                <button onClick={() => updateScore(skill, scores[skill] + 1)}>+</button>
              </div>
              <span className={styles.clbLabel}>CLB {scores[skill]} — {clbDescriptions[scores[skill]]}</span>
              <span className={styles.crsPoints}>{clbPoints[scores[skill]]} CRS pts</span>
            </div>
          ))}
        </div>

        <div className={styles.resultSection}>
          <div className={styles.totalCard}>
            <span className={styles.totalLabel}>Total Language CRS Points</span>
            <span className={styles.totalValue}>{totalCRS}</span>
            <span className={styles.totalMax}>out of 136 maximum</span>
          </div>

          <div className={styles.eligibility}>
            <h3>Eligibility Check</h3>
            <div className={`${styles.eligItem} ${expressEntryEligible ? styles.eligible : styles.notEligible}`}>
              <span>{expressEntryEligible ? '✅' : '❌'}</span>
              <div>
                <strong>Express Entry (FSW)</strong>
                <span>Requires CLB 7+ in all skills</span>
              </div>
            </div>
            <div className={`${styles.eligItem} ${cecEligible ? styles.eligible : styles.notEligible}`}>
              <span>{cecEligible ? '✅' : '❌'}</span>
              <div>
                <strong>Canadian Experience Class</strong>
                <span>Requires CLB 5+ in all skills (TEER 2/3)</span>
              </div>
            </div>
            <div className={`${styles.eligItem} ${citizenshipEligible ? styles.eligible : styles.notEligible}`}>
              <span>{citizenshipEligible ? '✅' : '❌'}</span>
              <div>
                <strong>Canadian Citizenship</strong>
                <span>Requires CLB 4+ in Listening & Speaking</span>
              </div>
            </div>
          </div>

          <div className={styles.tip}>
            <Info size={16} />
            <p>
              {minCLB < 9
                ? `Raising your lowest skill (CLB ${minCLB}) to CLB 9 would add ${(clbPoints[9] - clbPoints[minCLB])} CRS points!`
                : 'Great scores! You\'re maximizing your language CRS points.'}
            </p>
          </div>

          <Link href="/pricing" className={styles.cta}>
            <span>Practice to Improve Your Score</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
