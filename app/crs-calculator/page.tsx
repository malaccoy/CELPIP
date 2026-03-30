'use client';

import React, { useState } from 'react';
import { Calculator, ArrowRight, Target, Info, ExternalLink } from 'lucide-react';

const clbPoints: Record<number, number> = {
  4: 6, 5: 6, 6: 9, 7: 17, 8: 23, 9: 31, 10: 34, 11: 34, 12: 34,
};

const clbDescriptions: Record<number, string> = {
  4: 'Basic', 5: 'Basic+', 6: 'Intermediate', 7: 'Upper Intermediate',
  8: 'Adequate Proficiency', 9: 'Above Adequate', 10: 'Advanced', 11: 'Advanced+', 12: 'Expert',
};

const celpipToCLB: Record<number, number> = {
  1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12,
};

export default function CRSCalculatorPage() {
  const [scores, setScores] = useState({ listening: 7, reading: 7, writing: 7, speaking: 7 });

  const updateScore = (skill: string, value: number) => {
    setScores(prev => ({ ...prev, [skill]: Math.max(1, Math.min(12, value)) }));
  };

  const totalCRS = Object.values(scores).reduce((sum, s) => sum + (clbPoints[Math.min(s, 12)] || 0), 0);
  const minCLB = Math.min(...Object.values(scores));
  const avgScore = (Object.values(scores).reduce((a, b) => a + b, 0) / 4).toFixed(1);

  const expressEntryEligible = minCLB >= 7;
  const cecEligible = minCLB >= 5;
  const fswEligible = minCLB >= 7;

  const getColor = (s: number) => s >= 9 ? '#22c55e' : s >= 7 ? '#3b82f6' : s >= 5 ? '#f59e0b' : '#ef4444';
  const getPct = (s: number) => (s / 12) * 100;

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', color: '#e2e8f0', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%)',
        padding: '32px 20px 28px', textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px',
          background: 'rgba(139,92,246,0.2)', borderRadius: 20, marginBottom: 12,
          fontSize: '0.75rem', color: '#a78bfa', fontWeight: 600,
        }}>
          <Calculator size={12} /> Free Tool
        </div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>
          CELPIP → CRS Points
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
          See how your CELPIP scores translate to Express Entry CRS points
        </p>
      </div>

      {/* Live Score sticky */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(15,17,23,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Language CRS Points</div>
          <div style={{ color: '#64748b', fontSize: '0.7rem' }}>out of 136 max</div>
        </div>
        <span style={{
          fontSize: '2.2rem', fontWeight: 900,
          color: totalCRS >= 120 ? '#22c55e' : totalCRS >= 80 ? '#3b82f6' : totalCRS >= 50 ? '#f59e0b' : '#f87171',
        }}>{totalCRS}</span>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 16px' }}>
        {/* Score inputs */}
        <div style={{ background: '#1a1a2e', borderRadius: 16, padding: '20px 16px', marginBottom: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ color: '#a78bfa', fontSize: '0.85rem', fontWeight: 700, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Your CELPIP Scores
          </h3>
          {(['listening', 'reading', 'writing', 'speaking'] as const).map(skill => {
            const s = scores[skill];
            const pts = clbPoints[Math.min(s, 12)] || 0;
            return (
              <div key={skill} style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.9rem', textTransform: 'capitalize' }}>{skill}</span>
                  <span style={{ color: getColor(s), fontWeight: 700, fontSize: '0.85rem' }}>{pts} pts</span>
                </div>
                {/* Score control */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button onClick={() => updateScore(skill, s - 1)} style={{
                    width: 36, height: 36, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', fontSize: '1.2rem',
                    fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>−</button>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 4, marginBottom: 4,
                    }}>
                      <span style={{ fontSize: '1.6rem', fontWeight: 800, color: getColor(s) }}>{s}</span>
                      <span style={{ color: '#64748b', fontSize: '0.75rem' }}>/ 12</span>
                    </div>
                    {/* Progress bar */}
                    <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 4, height: 5, overflow: 'hidden' }}>
                      <div style={{
                        width: `${getPct(s)}%`, height: '100%', borderRadius: 4,
                        background: getColor(s), transition: 'width 0.3s, background 0.3s',
                      }} />
                    </div>
                    <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.7rem', marginTop: 3 }}>
                      CLB {s} — {clbDescriptions[Math.min(s, 12)] || ''}
                    </div>
                  </div>
                  <button onClick={() => updateScore(skill, s + 1)} style={{
                    width: 36, height: 36, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', fontSize: '1.2rem',
                    fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>+</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Eligibility */}
        <div style={{ background: '#1a1a2e', borderRadius: 16, padding: '20px 16px', marginBottom: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ color: '#22c55e', fontSize: '0.85rem', fontWeight: 700, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Eligibility Check
          </h3>
          {[
            { label: 'Express Entry (FSW)', ok: fswEligible, req: 'Min CLB 7 in all skills' },
            { label: 'Canadian Experience Class', ok: cecEligible, req: 'Min CLB 5 in all skills' },
            { label: 'Provincial Nominee (PNP)', ok: minCLB >= 4, req: 'Min CLB 4 in all skills' },
          ].map(item => (
            <div key={item.label} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: item.ok ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.85rem',
              }}>
                {item.ok ? '✅' : '❌'}
              </div>
              <div>
                <div style={{ color: item.ok ? '#22c55e' : '#f87171', fontWeight: 600, fontSize: '0.9rem' }}>{item.label}</div>
                <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{item.req}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Points breakdown */}
        <div style={{ background: '#1a1a2e', borderRadius: 16, padding: '20px 16px', marginBottom: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ color: '#f59e0b', fontSize: '0.85rem', fontWeight: 700, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Points Breakdown
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '6px 12px', alignItems: 'center' }}>
            {(['listening', 'reading', 'writing', 'speaking'] as const).map(skill => {
              const s = scores[skill];
              const pts = clbPoints[Math.min(s, 12)] || 0;
              return (
                <React.Fragment key={skill}>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem', textTransform: 'capitalize' }}>{skill}</span>
                  <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 3, height: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${(pts / 34) * 100}%`, height: '100%', background: getColor(s), borderRadius: 3 }} />
                  </div>
                  <span style={{ color: getColor(s), fontWeight: 700, fontSize: '0.85rem', textAlign: 'right' }}>{pts}</span>
                </React.Fragment>
              );
            })}
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', gridColumn: '1 / 3' }}>Total</span>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '1rem', textAlign: 'right' }}>{totalCRS}/136</span>
          </div>

          <div style={{
            marginTop: 16, padding: '10px 12px', borderRadius: 10,
            background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)',
          }}>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0, lineHeight: 1.5 }}>
              <strong style={{ color: '#60a5fa' }}>Tip:</strong> Each CLB level increase adds <strong>6-14 CRS points</strong>. 
              Going from CLB 7→9 adds <strong>+56 points</strong> total across 4 skills!
            </p>
          </div>
        </div>

        {/* Official link */}
        <a
          href="https://ircc.canada.ca/english/immigrate/skilled/crs-tool.asp"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', padding: '14px', borderRadius: 12,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none',
            marginBottom: 16,
          }}
        >
          <ExternalLink size={16} />
          Full CRS Calculator — IRCC Official Site
        </a>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: 12, lineHeight: 1.5 }}>
            Want to score higher on CELPIP and boost your CRS?
          </p>
          <button onClick={() => window.location.href = '/map'} style={{
            width: '100%', padding: '14px', borderRadius: 12,
            background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
            color: '#fff', fontWeight: 700, fontSize: '1rem', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            Start Practicing CELPIP <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
