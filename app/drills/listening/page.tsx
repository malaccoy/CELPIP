'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Zap, Crown, ChevronRight, Clock, Target, BookOpen, Headphones } from 'lucide-react';
import { usePlan } from '@/hooks/usePlan';

const T = {
  bg: '#1b1f2a',
  surface: '#232733',
  border: 'rgba(255,255,255,0.06)',
  text: '#ffffff',
  textMuted: 'rgba(255,255,255,0.5)',
  textSoft: 'rgba(255,255,255,0.7)',
  green: '#22c55e',
  purple: '#8b5cf6',
  blue: '#3b82f6',
  gold: '#f59e0b',
  red: '#ff3b3b',
  cyan: '#06b6d4',
};

export default function ListeningDrillsPage() {
  const { isPro, loading: planLoading } = usePlan();
  const router = useRouter();
  const [units, setUnits] = useState<any[]>([]);
  const [dailyUsed, setDailyUsed] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(10);

  useEffect(() => {
    fetch('/data/courses/listening.json').then(r => r.json()).then(setUnits);
    fetch('/api/daily-usage?category=drills')
      .then(r => r.json())
      .then(data => {
        if (!data.isPro) {
          setDailyUsed(data.used || 0);
          setDailyLimit(data.limit || 10);
        }
      })
      .catch(() => {});
  }, []);

  if (planLoading || units.length === 0) return <div style={{ minHeight: '100vh', background: T.bg }} />;

  const totalExercises = units.reduce((sum: number, u: any) => sum + (u.exercises?.length || 0), 0);

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text, padding: '0 1rem 6rem', maxWidth: 600, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 0' }}>
        <Link href="/drills" style={{ color: T.textMuted, display: 'flex' }}>
          <ArrowLeft size={22} />
        </Link>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.6rem' }}>🎧</span> Listening Drills
          </h1>
          <p style={{ color: T.textMuted, fontSize: '0.8rem', margin: 0 }}>
            ∞ exercises · All 6 listening tasks
          </p>
        </div>
      </div>

      {/* Overview */}
      <div style={{
        background: `linear-gradient(135deg, rgba(59,130,246,0.12), rgba(99,102,241,0.06))`,
        borderRadius: 20, padding: '1.25rem', marginBottom: '1.25rem',
        border: '1px solid rgba(59,130,246,0.2)',
      }}>
        <p style={{ color: T.textSoft, fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
          🎧 <strong>Listen, don't read!</strong> Each exercise plays audio — just like the real CELPIP test. 
          Use the <strong>7 Secret Steps</strong> to identify problems, track feelings, spot fake solutions, and predict future outcomes.
        </p>
      </div>

      {/* Test at a Glance */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem',
        marginBottom: '1.25rem',
      }}>
        {[
          { icon: <Clock size={16} color={T.blue} />, label: 'Duration', value: '~47-55 min' },
          { icon: <Target size={16} color={T.blue} />, label: 'Questions', value: '38 total' },
          { icon: <Headphones size={16} color={T.blue} />, label: 'Parts', value: '6 tasks' },
          { icon: <BookOpen size={16} color={T.blue} />, label: 'Replay', value: 'NO replay!' },
        ].map((s, i) => (
          <div key={i} style={{
            background: T.surface, borderRadius: 14, padding: '0.75rem',
            border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: '0.6rem',
          }}>
            {s.icon}
            <div>
              <div style={{ fontSize: '0.65rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: T.text }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Daily free counter */}
      {!isPro && (
        <div style={{
          background: `linear-gradient(135deg, rgba(34,197,94,0.1), rgba(59,130,246,0.08))`,
          borderRadius: 16, padding: '1rem 1.25rem', marginBottom: '1.25rem',
          border: '1px solid rgba(34,197,94,0.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={16} color={T.green} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Daily Free Exercises</span>
            </div>
            <Link href="/pricing" style={{
              background: `linear-gradient(135deg, ${T.purple}, ${T.red})`,
              color: '#fff', fontWeight: 700, fontSize: '0.7rem',
              padding: '0.3rem 0.75rem', borderRadius: 8, textDecoration: 'none',
            }}>⚡ Upgrade</Link>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
            {Array.from({ length: dailyLimit }).map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 8, borderRadius: 4,
                background: i < dailyUsed ? `linear-gradient(90deg, ${T.green}, #4ade80)` : 'rgba(255,255,255,0.08)',
              }} />
            ))}
          </div>
          <span style={{ fontSize: '0.75rem', color: T.textMuted }}>
            {dailyUsed}/{dailyLimit} used today · Resets daily
          </span>
        </div>
      )}

      {/* Unit Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {units.map((unit: any) => {
          const isEasier = unit.id === 0;
          const color = isEasier ? T.blue : T.purple;
          const gradient = isEasier
            ? 'linear-gradient(135deg, #3b82f6, #06b6d4)'
            : 'linear-gradient(135deg, #8b5cf6, #6366f1)';
          return (
            <button
              key={unit.id}
              onClick={() => router.push(`/drills/listening/${unit.id}`)}
              style={{
                width: '100%', padding: '1.25rem', background: T.surface,
                borderRadius: 20, border: `2px solid ${color}33`,
                color: T.text, cursor: 'pointer', textAlign: 'left',
                position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute', top: -30, right: -30, width: 100, height: 100,
                background: `${color}14`, borderRadius: '50%',
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 8px 24px ${color}4D`, flexShrink: 0, fontSize: '1.6rem',
                }}>
                  {unit.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{
                      fontSize: '0.6rem', fontWeight: 800, color, background: `${color}1F`,
                      padding: '0.15rem 0.4rem', borderRadius: 5,
                    }}>{isEasier ? 'EASIER' : 'HARDER'}</span>
                    <span style={{ fontWeight: 800, fontSize: '1rem' }}>{unit.title}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: T.textSoft, marginBottom: '0.35rem' }}>
                    {unit.subtitle}
                  </div>
                  <span style={{
                    fontSize: '0.65rem', background: `${color}1F`, color,
                    padding: '0.2rem 0.5rem', borderRadius: 6, fontWeight: 600,
                  }}>∞ exercises</span>
                </div>
                <ChevronRight size={22} color={color} style={{ flexShrink: 0 }} />
              </div>
            </button>
          );
        })}
      </div>

      {/* 7 Secret Steps */}
      <div style={{ marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: T.textSoft, marginBottom: '0.75rem' }}>
          🔑 7 Secret Steps
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {[
            { step: 1, text: 'Identify the Problem / WHY', color: T.red },
            { step: 2, text: 'Real vs Fake Solution', color: '#f97316' },
            { step: 3, text: 'Follow the Flow / Choices', color: T.gold },
            { step: 4, text: 'Feelings & Questions', color: T.green },
            { step: 5, text: 'Time Frame (not exact dates)', color: T.cyan },
            { step: 6, text: 'Details & Descriptions', color: T.blue },
            { step: 7, text: 'Future Outcomes (ALWAYS!)', color: T.purple },
          ].map(s => (
            <div key={s.step} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              background: T.surface, borderRadius: 12, padding: '0.65rem 1rem',
              border: `1px solid ${T.border}`, borderLeft: `3px solid ${s.color}`,
            }}>
              <span style={{
                width: 24, height: 24, borderRadius: 8,
                background: `${s.color}22`, color: s.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '0.75rem', flexShrink: 0,
              }}>{s.step}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: T.textSoft }}>{s.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Score Table */}
      <div style={{ marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: T.textSoft, marginBottom: '0.75rem' }}>
          📊 Score Guide (out of 38 questions)
        </h3>
        <div style={{
          background: T.surface, borderRadius: 16, padding: '1rem',
          border: `1px solid ${T.border}`,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {[
              { score: '7', correct: '23-26', color: T.gold },
              { score: '8', correct: '27-30', color: T.green },
              { score: '9', correct: '31-33', color: T.blue },
              { score: '10', correct: '34-35', color: T.purple },
              { score: '11', correct: '36-37', color: '#ec4899' },
              { score: '12', correct: '38/38', color: T.red },
            ].map(s => (
              <div key={s.score} style={{
                background: `${s.color}14`, borderRadius: 10, padding: '0.5rem',
                textAlign: 'center', border: `1px solid ${s.color}33`,
              }}>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: s.color }}>{s.score}</div>
                <div style={{ fontSize: '0.65rem', color: T.textMuted }}>{s.correct}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upgrade CTA */}
      {!isPro && (
        <Link href="/pricing" style={{ textDecoration: 'none' }}>
          <div style={{
            marginTop: '1.5rem',
            background: `linear-gradient(135deg, rgba(59,130,246,0.15), rgba(99,102,241,0.1))`,
            borderRadius: 20, padding: '1.25rem',
            border: '1px solid rgba(59,130,246,0.2)', textAlign: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Crown size={20} color={T.gold} />
              <span style={{ fontWeight: 800, fontSize: '1rem' }}>Unlimited Listening Practice</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: T.textMuted, margin: 0 }}>
              Remove daily limits and sharpen your ear for the real test
            </p>
            <div style={{
              marginTop: '0.75rem',
              background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`,
              borderRadius: 12, padding: '0.6rem 1.5rem', display: 'inline-block',
              fontWeight: 700, fontSize: '0.85rem', color: '#fff',
            }}>
              Upgrade to Pro →
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}
