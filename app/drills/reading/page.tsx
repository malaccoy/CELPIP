'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Crown, BookOpen, Sparkles } from 'lucide-react';
import { usePlan } from '@/hooks/usePlan';

const T = {
  bg: '#1b1f2a', surface: '#232733', border: 'rgba(255,255,255,0.06)',
  text: '#ffffff', textMuted: 'rgba(255,255,255,0.5)', textSoft: 'rgba(255,255,255,0.7)',
  green: '#22c55e', purple: '#8b5cf6', blue: '#3b82f6', gold: '#f59e0b', red: '#ff3b3b',
  teal: '#14b8a6',
};

interface Unit { id: number; title: string; subtitle: string; icon: string; level: string; exercises: unknown[] }

export default function ReadingDrillsPage() {
  const router = useRouter();
  const { isPro, loading: planLoading } = usePlan();
  const [units, setUnits] = useState<Unit[]>([]);
  const [dailyUsed, setDailyUsed] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(10);

  useEffect(() => {
    fetch('/data/courses/reading.json').then(r => r.json()).then(setUnits).catch(() => {});
    fetch('/api/daily-usage?category=drills').then(r => r.json()).then(data => {
      setDailyUsed(data.used || 0);
      setDailyLimit(data.limit || 10);
    }).catch(() => {});
  }, []);

  if (planLoading) return <div style={{ minHeight: '100vh', background: T.bg }} />;

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text, padding: '0 1rem 6rem', maxWidth: 600, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 0' }}>
        <button onClick={() => router.push('/drills')} style={{ background: 'none', border: 'none', color: T.textMuted, cursor: 'pointer', display: 'flex' }}>
          <ArrowLeft size={22} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>📖 Reading Drills</h1>
          <p style={{ fontSize: '0.8rem', color: T.textMuted, margin: 0 }}>CELPIP Reading Tasks 1-4</p>
        </div>
      </div>

      {/* Daily counter */}
      {!isPro && (
        <div style={{
          background: T.surface, borderRadius: 16, padding: '1rem 1.25rem',
          marginBottom: '1rem', border: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: T.textMuted }}>Daily free exercises</span>
            <div style={{ display: 'flex', gap: '4px', marginTop: '0.4rem' }}>
              {Array(dailyLimit).fill(0).map((_, i) => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: i < dailyUsed ? T.teal : 'rgba(255,255,255,0.1)',
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: dailyUsed >= dailyLimit ? T.red : T.teal }}>
            {dailyUsed}/{dailyLimit}
          </span>
        </div>
      )}

      {/* Tip card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(20,184,166,0.12), rgba(59,130,246,0.08))',
        borderRadius: 20, padding: '1.25rem', marginBottom: '1.25rem',
        border: '1px solid rgba(20,184,166,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <BookOpen size={18} color={T.teal} />
          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Golden Rule</span>
        </div>
        <p style={{ fontSize: '0.8rem', color: T.textSoft, margin: 0, lineHeight: 1.5 }}>
          🚫 Never select what you did not read. Only choose answers supported by the text — not your knowledge!
        </p>
      </div>

      {/* Units */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {units.map(unit => (
          <button
            key={unit.id}
            onClick={() => router.push(`/drills/reading/${unit.id}`)}
            style={{
              width: '100%', background: T.surface, borderRadius: 20, padding: '1.25rem',
              border: `1px solid ${T.border}`, cursor: 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: '1rem',
              transition: 'transform 0.15s',
            }}
          >
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: `linear-gradient(135deg, ${T.teal}22, ${T.blue}22)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', flexShrink: 0,
            }}>
              {unit.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: T.text }}>{unit.title}</div>
              <div style={{ fontSize: '0.8rem', color: T.textMuted, marginTop: '0.15rem' }}>{unit.subtitle}</div>
              <div style={{ fontSize: '0.75rem', color: T.teal, fontWeight: 600, marginTop: '0.3rem' }}>
                {unit.exercises.length} exercises
              </div>
            </div>
            <ChevronRight size={20} color={T.textMuted} />
          </button>
        ))}
      </div>

      {/* Pro upsell */}
      {!isPro && (
        <Link href="/pricing" style={{
          display: 'block', marginTop: '1.5rem', background: `linear-gradient(135deg, ${T.teal}18, ${T.blue}18)`,
          borderRadius: 20, padding: '1.25rem', border: `1px solid ${T.teal}33`,
          textDecoration: 'none', textAlign: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Sparkles size={18} color={T.gold} />
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: T.text }}>Unlock Unlimited Practice</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: T.textMuted, margin: 0 }}>
            Remove daily limits · All levels · Track progress
          </p>
        </Link>
      )}
    </div>
  );
}
