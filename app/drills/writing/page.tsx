'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Zap, Crown, PenTool, ChevronRight, Clock, FileText, Target, BookOpen } from 'lucide-react';
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
  orange: '#f97316',
};

export default function WritingDrillsPage() {
  const { isPro, loading: planLoading } = usePlan();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [dailyUsed, setDailyUsed] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(10);

  useEffect(() => {
    fetch('/data/courses/writing.json').then(r => r.json()).then(setCourse);
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

  const units = course.units || [];
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
            <span style={{ fontSize: '1.6rem' }}>✉️</span> Writing Drills
          </h1>
          <p style={{ color: T.textMuted, fontSize: '0.8rem', margin: 0 }}>
            {totalExercises} exercises · Email & Survey mastery
          </p>
        </div>
      </div>

      {/* Writing Overview */}
      <div style={{
        background: `linear-gradient(135deg, rgba(249,115,22,0.12), rgba(245,158,11,0.06))`,
        borderRadius: 20,
        padding: '1.25rem',
        marginBottom: '1.25rem',
        border: '1px solid rgba(249,115,22,0.2)',
      }}>
        <p style={{ color: T.textSoft, fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
          The CELPIP Writing test has <strong>2 tasks</strong> in <strong>53 minutes</strong>. 
          Practice structuring emails and survey responses — opening, body, and closing — to score high on all 4 criteria.
        </p>
      </div>

      {/* Test at a Glance */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem',
        marginBottom: '1.25rem',
      }}>
        {[
          { icon: <Clock size={16} color={T.orange} />, label: 'Total Time', value: '53 min' },
          { icon: <FileText size={16} color={T.orange} />, label: 'Word Count', value: '150-200/task' },
          { icon: <Target size={16} color={T.orange} />, label: 'Tasks', value: '2 tasks' },
          { icon: <BookOpen size={16} color={T.orange} />, label: 'Format', value: 'Computer-based' },
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
        {units.map((unit: any, idx: number) => {
          const unitExercises = unit.exercises?.length || 0;
          const isEmail = idx === 0;
          const color = isEmail ? T.orange : T.gold;
          const icon = isEmail ? '✉️' : '📋';
          const label = isEmail ? 'Task 1' : 'Task 2';
          return (
            <button
              key={unit.id}
              onClick={() => router.push(`/drills/writing/${unit.id}`)}
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
                  background: `linear-gradient(135deg, ${color}, ${isEmail ? T.gold : T.orange})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 8px 24px ${color}4D`, flexShrink: 0, fontSize: '1.6rem',
                }}>
                  {icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{
                      fontSize: '0.6rem', fontWeight: 800, color, background: `${color}1F`,
                      padding: '0.15rem 0.4rem', borderRadius: 5,
                    }}>{label}</span>
                    <span style={{ fontWeight: 800, fontSize: '1rem' }}>{unit.title?.replace(/^Task \d: /, '')}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: T.textSoft, marginBottom: '0.35rem' }}>
                    {unit.subtitle}
                  </div>
                  <span style={{
                    fontSize: '0.65rem', background: `${color}1F`, color,
                    padding: '0.2rem 0.5rem', borderRadius: 6, fontWeight: 600,
                  }}>{unitExercises} exercises</span>
                </div>
                <ChevronRight size={22} color={color} style={{ flexShrink: 0 }} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Two Writing Tasks */}
      <div style={{ marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: T.textSoft, marginBottom: '0.75rem' }}>
          CELPIP Writing Tasks
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {/* Task 1 */}
          <div style={{
            background: T.surface, borderRadius: 16, padding: '1rem 1.25rem',
            border: `1px solid ${T.border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
              <span style={{
                fontSize: '0.7rem', fontWeight: 800, color: T.orange,
                background: 'rgba(249,115,22,0.12)', padding: '0.2rem 0.5rem', borderRadius: 6,
              }}>Task 1</span>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Write an Email</span>
              <span style={{ fontSize: '0.7rem', color: T.textMuted, marginLeft: 'auto' }}>~27 min</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.78rem', color: T.textSoft, lineHeight: 1.7 }}>
              <li>Write to a real reader (manager, neighbor, etc.)</li>
              <li>Cover all bullet points in the prompt</li>
              <li>Keep a polite, neutral tone</li>
              <li>Aim for 150–200 words</li>
            </ul>
          </div>

          {/* Task 2 */}
          <div style={{
            background: T.surface, borderRadius: 16, padding: '1rem 1.25rem',
            border: `1px solid ${T.border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
              <span style={{
                fontSize: '0.7rem', fontWeight: 800, color: T.gold,
                background: 'rgba(245,158,11,0.12)', padding: '0.2rem 0.5rem', borderRadius: 6,
              }}>Task 2</span>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Survey Response</span>
              <span style={{ fontSize: '0.7rem', color: T.textMuted, marginLeft: 'auto' }}>~26 min</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.78rem', color: T.textSoft, lineHeight: 1.7 }}>
              <li>Choose one option in your first line</li>
              <li>Give 2–3 clear reasons with examples</li>
              <li>No email format needed</li>
              <li>Aim for 150–200 words</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Scoring Criteria */}
      <div style={{ marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: T.textSoft, marginBottom: '0.75rem' }}>
          4 Scoring Criteria
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          {[
            { name: 'Content & Coherence', desc: 'Clear ideas, logical order', color: T.green },
            { name: 'Vocabulary', desc: 'Natural, precise words', color: T.blue },
            { name: 'Readability', desc: 'Paragraphs, transitions', color: T.purple },
            { name: 'Task Fulfillment', desc: 'All points, right tone', color: T.orange },
          ].map((c, i) => (
            <div key={i} style={{
              background: T.surface, borderRadius: 12, padding: '0.7rem 0.8rem',
              border: `1px solid ${T.border}`, borderLeft: `3px solid ${c.color}`,
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: T.text, marginBottom: '0.15rem' }}>{c.name}</div>
              <div style={{ fontSize: '0.65rem', color: T.textMuted }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Time Plan */}
      <div style={{ marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: T.textSoft, marginBottom: '0.75rem' }}>
          ⏱️ Recommended Time Plan
        </h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { phase: 'Plan', time: '4-5 min', pct: 18 },
            { phase: 'Write', time: '18-20 min', pct: 72 },
            { phase: 'Check', time: '3 min', pct: 10 },
          ].map((p, i) => (
            <div key={i} style={{
              flex: p.pct, background: T.surface, borderRadius: 12, padding: '0.6rem',
              border: `1px solid ${T.border}`, textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: T.orange }}>{p.phase}</div>
              <div style={{ fontSize: '0.65rem', color: T.textMuted }}>{p.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade CTA */}
      {!isPro && (
        <Link href="/pricing" style={{ textDecoration: 'none' }}>
          <div style={{
            marginTop: '1.5rem',
            background: `linear-gradient(135deg, rgba(249,115,22,0.15), rgba(245,158,11,0.1))`,
            borderRadius: 20, padding: '1.25rem',
            border: '1px solid rgba(249,115,22,0.2)', textAlign: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Crown size={20} color={T.gold} />
              <span style={{ fontWeight: 800, fontSize: '1rem' }}>Unlimited Practice</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: T.textMuted, margin: 0 }}>
              Remove daily limits and access all writing exercises
            </p>
            <div style={{
              marginTop: '0.75rem',
              background: `linear-gradient(135deg, ${T.orange}, ${T.gold})`,
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
