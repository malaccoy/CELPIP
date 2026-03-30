'use client';

import React, { useState } from 'react';
import { Calculator, ArrowRight, ExternalLink } from 'lucide-react';
import styles from '@/styles/CRSCalculator.module.scss';

const clbPoints: Record<number, number> = {
  4: 6, 5: 6, 6: 9, 7: 17, 8: 23, 9: 31, 10: 34, 11: 34, 12: 34,
};

const clbDescriptions: Record<number, string> = {
  4: 'Basic', 5: 'Basic+', 6: 'Intermediate', 7: 'Upper Intermediate',
  8: 'Adequate Proficiency', 9: 'Above Adequate', 10: 'Advanced', 11: 'Advanced+', 12: 'Expert',
};

function getColorClass(s: number) {
  if (s >= 9) return styles.colorGreen;
  if (s >= 7) return styles.colorBlue;
  if (s >= 5) return styles.colorAmber;
  return styles.colorRed;
}

function getColorHex(s: number) {
  if (s >= 9) return '#22c55e';
  if (s >= 7) return '#3b82f6';
  if (s >= 5) return '#f59e0b';
  return '#ef4444';
}

export default function CRSCalculatorPage() {
  const [scores, setScores] = useState({ listening: 7, reading: 7, writing: 7, speaking: 7 });

  const updateScore = (skill: string, value: number) => {
    setScores(prev => ({ ...prev, [skill]: Math.max(1, Math.min(12, value)) }));
  };

  const totalCRS = Object.values(scores).reduce((sum, s) => sum + (clbPoints[Math.min(s, 12)] || 0), 0);
  const minCLB = Math.min(...Object.values(scores));
  const fswEligible = minCLB >= 7;
  const cecEligible = minCLB >= 5;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerBadge}>
          <Calculator size={12} /> Free Tool
        </div>
        <h1 className={styles.headerTitle}>CELPIP → CRS Points</h1>
        <p className={styles.headerSub}>
          See how your CELPIP scores translate to Express Entry CRS points
        </p>
      </div>

      {/* Live Score sticky */}
      <div className={styles.stickyScore}>
        <div>
          <div className={styles.stickyLabel}>Language CRS Points</div>
          <div className={styles.stickySub}>out of 136 max</div>
        </div>
        <span className={`${styles.stickyValue} ${totalCRS >= 120 ? styles.colorGreen : totalCRS >= 80 ? styles.colorBlue : totalCRS >= 50 ? styles.colorAmber : styles.colorRed}`}>
          {totalCRS}
        </span>
      </div>

      <div className={styles.content}>
        {/* Score inputs */}
        <div className={styles.card}>
          <h3 className={`${styles.cardTitle} ${styles.cardTitlePurple}`}>
            Your CELPIP Scores
          </h3>
          {(['listening', 'reading', 'writing', 'speaking'] as const).map(skill => {
            const s = scores[skill];
            const pts = clbPoints[Math.min(s, 12)] || 0;
            const color = getColorHex(s);
            return (
              <div key={skill} className={styles.skillRow}>
                <div className={styles.skillHeader}>
                  <span className={styles.skillName}>{skill}</span>
                  <span className={`${styles.skillPts} ${getColorClass(s)}`}>{pts} pts</span>
                </div>
                <div className={styles.skillControl}>
                  <button onClick={() => updateScore(skill, s - 1)} className={styles.scoreBtn}>−</button>
                  <div className={styles.scoreDisplay}>
                    <div className={styles.scoreValue}>
                      <span className={styles.scoreNumber} style={{ color }}>{s}</span>
                      <span className={styles.scoreMax}>/ 12</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${(s / 12) * 100}%`, background: color }} />
                    </div>
                    <div className={styles.scoreMeta}>
                      CLB {s} — {clbDescriptions[Math.min(s, 12)] || ''}
                    </div>
                  </div>
                  <button onClick={() => updateScore(skill, s + 1)} className={styles.scoreBtn}>+</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Eligibility */}
        <div className={styles.card}>
          <h3 className={`${styles.cardTitle} ${styles.cardTitleGreen}`}>
            Eligibility Check
          </h3>
          {[
            { label: 'Express Entry (FSW)', ok: fswEligible, req: 'Min CLB 7 in all skills' },
            { label: 'Canadian Experience Class', ok: cecEligible, req: 'Min CLB 5 in all skills' },
            { label: 'Provincial Nominee (PNP)', ok: minCLB >= 4, req: 'Min CLB 4 in all skills' },
          ].map(item => (
            <div key={item.label} className={styles.eligibilityRow}>
              <div className={`${styles.eligibilityIcon} ${item.ok ? styles.eligibilityIconOk : styles.eligibilityIconNo}`}>
                {item.ok ? '✅' : '❌'}
              </div>
              <div>
                <div className={`${styles.eligibilityLabel} ${item.ok ? styles.eligibilityLabelOk : styles.eligibilityLabelNo}`}>
                  {item.label}
                </div>
                <div className={styles.eligibilityReq}>{item.req}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Points breakdown */}
        <div className={styles.card}>
          <h3 className={`${styles.cardTitle} ${styles.cardTitleAmber}`}>
            Points Breakdown
          </h3>
          <div className={styles.breakdownGrid}>
            {(['listening', 'reading', 'writing', 'speaking'] as const).map(skill => {
              const s = scores[skill];
              const pts = clbPoints[Math.min(s, 12)] || 0;
              const color = getColorHex(s);
              return (
                <React.Fragment key={skill}>
                  <span className={styles.breakdownSkill}>{skill}</span>
                  <div className={styles.breakdownBar}>
                    <div className={styles.breakdownFill} style={{ width: `${(pts / 34) * 100}%`, background: color }} />
                  </div>
                  <span className={styles.breakdownPts} style={{ color }}>{pts}</span>
                </React.Fragment>
              );
            })}
            <span className={styles.breakdownTotalLabel}>Total</span>
            <span className={styles.breakdownTotalValue}>{totalCRS}/136</span>
          </div>

          <div className={styles.tipBox}>
            <p className={styles.tipText}>
              <strong>Tip:</strong> Each CLB level increase adds <strong>6-14 CRS points</strong>.
              Going from CLB 7→9 adds <strong>+56 points</strong> total across 4 skills!
            </p>
          </div>
        </div>

        {/* Official link */}
        <a
          href="https://ircc.canada.ca/english/immigrate/skilled/crs-tool.asp"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.externalLink}
        >
          <ExternalLink size={16} />
          Full CRS Calculator — IRCC Official Site
        </a>

        {/* CTA */}
        <div className={styles.ctaSection}>
          <p className={styles.ctaText}>
            Want to score higher on CELPIP and boost your CRS?
          </p>
          <button onClick={() => window.location.href = '/map'} className={styles.ctaButton}>
            Start Practicing CELPIP <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
