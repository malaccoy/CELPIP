'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Zap, Trophy, Crown, Mic, ChevronRight } from 'lucide-react';
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
};

export default function SpeakingCoursePage() {
  const { isPro, loading: planLoading } = usePlan();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [dailyUsed, setDailyUsed] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(10);

  useEffect(() => {
    fetch('/data/courses/speaking.json').then(r => r.json()).then(setCourse);
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

  if (planLoading || !course) return <div style={{ minHeight: '100vh', background: T.bg }} />;

  const unit = course.units?.[0];
  const totalExercises = unit?.exercises?.length || 0;

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text, padding: '0 1rem 6rem', maxWidth: 600, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 0' }}>
        <Link href="/drills" style={{ color: T.textMuted, display: 'flex' }}>
          <ArrowLeft size={22} />
        </Link>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.6rem' }}>🎤</span> Speaking Drills
          </h1>
          <p style={{ color: T.textMuted, fontSize: '0.8rem', margin: 0 }}>
            {totalExercises} exercises · CLB 7+
          </p>
        </div>
      </div>

      {/* Info Card */}
      <div style={{
        background: `linear-gradient(135deg, rgba(139,92,246,0.1), rgba(59,130,246,0.06))`,
        borderRadius: 20,
        padding: '1.25rem',
        marginBottom: '1.25rem',
        border: '1px solid rgba(139,92,246,0.15)',
      }}>
        <p style={{ color: T.textSoft, fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
          Practice all <strong>8 CELPIP Speaking tasks</strong> with interactive exercises. Each drill trains you to understand, apply, and speak — building real test-day confidence.
        </p>
      </div>

      {/* Daily free counter (free users) */}
      {!isPro && (
        <div style={{
          background: `linear-gradient(135deg, rgba(34,197,94,0.1), rgba(59,130,246,0.08))`,
          borderRadius: 16,
          padding: '1rem 1.25rem',
          marginBottom: '1.25rem',
          border: '1px solid rgba(34,197,94,0.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={16} color={T.green} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: T.text }}>Daily Free Exercises</span>
            </div>
            <Link href="/pricing" style={{
              background: `linear-gradient(135deg, ${T.purple}, ${T.red})`,
              color: '#fff', fontWeight: 700, fontSize: '0.7rem',
              padding: '0.3rem 0.75rem', borderRadius: 8, textDecoration: 'none',
            }}>
              ⚡ Upgrade
            </Link>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
            {Array.from({ length: dailyLimit }).map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 8, borderRadius: 4,
                background: i < dailyUsed
                  ? `linear-gradient(90deg, ${T.green}, #4ade80)`
                  : 'rgba(255,255,255,0.08)',
                transition: 'background 0.3s ease',
              }} />
            ))}
          </div>
          <span style={{ fontSize: '0.75rem', color: T.textMuted }}>
            {dailyUsed}/{dailyLimit} used today · Resets daily
          </span>
        </div>
      )}

      {/* Single Start Card */}
      <button
        onClick={() => router.push('/drills/speaking/0')}
        style={{
          width: '100%',
          padding: '1.5rem',
          background: T.surface,
          borderRadius: 20,
          border: '2px solid rgba(139,92,246,0.25)',
          color: T.text,
          cursor: 'pointer',
          textAlign: 'left',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow */}
        <div style={{
          position: 'absolute', top: -30, right: -30, width: 100, height: 100,
          background: 'rgba(139,92,246,0.08)', borderRadius: '50%',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
          <div style={{
            width: 60, height: 60, borderRadius: 18,
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(139,92,246,0.3)',
            flexShrink: 0,
          }}>
            <Mic size={28} color="#fff" />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.2rem' }}>
              Start Practice
            </div>
            <div style={{ fontSize: '0.82rem', color: T.textSoft, marginBottom: '0.35rem' }}>
              All 8 CELPIP tasks · CLB 7+
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '0.65rem', background: 'rgba(139,92,246,0.15)', color: '#a78bfa',
                padding: '0.2rem 0.5rem', borderRadius: 6, fontWeight: 600,
              }}>{totalExercises} exercises</span>
              <span style={{
                fontSize: '0.65rem', background: 'rgba(34,197,94,0.15)', color: T.green,
                padding: '0.2rem 0.5rem', borderRadius: 6, fontWeight: 600,
              }}>Choose → Apply → Speak</span>
            </div>
          </div>

          <ChevronRight size={22} color={T.purple} style={{ flexShrink: 0 }} />
        </div>
      </button>

      {/* Task Overview */}
      <div style={{ marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: T.textSoft, marginBottom: '0.75rem' }}>
          Tasks Covered
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          {[
            { task: 'T1', name: 'Giving Advice', time: '90s' },
            { task: 'T2', name: 'Personal Experience', time: '60s' },
            { task: 'T3', name: 'Describe a Scene', time: '60s' },
            { task: 'T4', name: 'Making Predictions', time: '60s' },
            { task: 'T5', name: 'Compare & Persuade', time: '60s' },
            { task: 'T6', name: 'Difficult Situation', time: '60s' },
            { task: 'T7', name: 'Expressing Opinions', time: '90s' },
            { task: 'T8', name: 'Unusual Situation', time: '60s' },
          ].map(t => (
            <div key={t.task} style={{
              background: T.surface,
              borderRadius: 12,
              padding: '0.6rem 0.8rem',
              border: `1px solid ${T.border}`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <span style={{
                fontSize: '0.65rem', fontWeight: 800, color: T.purple,
                background: 'rgba(139,92,246,0.12)', padding: '0.15rem 0.4rem', borderRadius: 5,
              }}>{t.task}</span>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: T.text }}>{t.name}</div>
                <div style={{ fontSize: '0.6rem', color: T.textMuted }}>{t.time} speak</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade CTA */}
      {!isPro && (
        <Link href="/pricing" style={{ textDecoration: 'none' }}>
          <div style={{
            marginTop: '1.5rem',
            background: `linear-gradient(135deg, rgba(139,92,246,0.15), rgba(255,59,59,0.1))`,
            borderRadius: 20,
            padding: '1.25rem',
            border: '1px solid rgba(139,92,246,0.2)',
            textAlign: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Crown size={20} color={T.gold} />
              <span style={{ fontWeight: 800, fontSize: '1rem', color: T.text }}>Unlimited Practice</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: T.textMuted, margin: 0 }}>
              Remove daily limits and practice as much as you want
            </p>
            <div style={{
              marginTop: '0.75rem',
              background: `linear-gradient(135deg, ${T.purple}, ${T.red})`,
              borderRadius: 12,
              padding: '0.6rem 1.5rem',
              display: 'inline-block',
              fontWeight: 700,
              fontSize: '0.85rem',
              color: '#fff',
            }}>
              Upgrade to Pro →
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}
