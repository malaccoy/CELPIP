'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Sparkles } from 'lucide-react';

const T = {
  bg: '#1b1f2a',
  surface: '#232733',
  border: 'rgba(255,255,255,0.06)',
  text: '#ffffff',
  textMuted: 'rgba(255,255,255,0.5)',
  textSoft: 'rgba(255,255,255,0.7)',
  red: '#ff3b3b',
  green: '#22c55e',
  purple: '#8b5cf6',
  gold: '#f59e0b',
};

const courses = [
  {
    id: 'speaking',
    title: 'Speaking Drills',
    subtitle: 'Practice all 8 speaking tasks',
    icon: '🎤',
    units: 3,
    exercises: 300,
    gradient: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
    glow: 'rgba(139,92,246,0.25)',
    ready: true,
  },
  {
    id: 'writing',
    title: 'Writing Drills',
    subtitle: 'Master CELPIP email writing',
    icon: '✉️',
    units: 2,
    exercises: 60,
    gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
    glow: 'rgba(245,158,11,0.25)',
    ready: true,
  },
  {
    id: 'listening',
    title: 'Listening Drills',
    subtitle: 'All 6 tasks · 7 Secret Steps',
    icon: '🎧',
    units: 2,
    exercises: 90,
    gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    glow: 'rgba(59,130,246,0.25)',
    ready: true,
  },
  {
    id: 'reading',
    title: 'Reading Drills',
    subtitle: 'All 4 tasks · Paragraph technique',
    icon: '📖',
    units: 2,
    exercises: 90,
    gradient: 'linear-gradient(135deg, #10b981, #14b8a6)',
    glow: 'rgba(16,185,129,0.25)',
    ready: true,
  },
];

export default function CoursesPage() {
  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text, padding: '0 1rem 6rem', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 0' }}>
        <Link href="/dashboard" style={{ color: T.textMuted, display: 'flex' }}>
          <ArrowLeft size={22} />
        </Link>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={24} color={T.gold} /> Skill Drills
          </h1>
          <p style={{ color: T.textMuted, fontSize: '0.85rem', margin: 0 }}>
            Practice → Improve → Master
          </p>
        </div>
      </div>

      {/* Description */}
      <div style={{
        background: `linear-gradient(135deg, rgba(255,59,59,0.08), rgba(139,92,246,0.06))`,
        borderRadius: 16,
        padding: '1rem 1.25rem',
        border: '1px solid rgba(255,59,59,0.1)',
        marginBottom: '1.25rem',
      }}>
        <p style={{ color: T.textSoft, fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
          Interactive drills to sharpen your CELPIP skills — no theory, just practice. Build muscle memory for test day.
        </p>
      </div>

      {/* Course cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        {courses.map(course => (
          <Link
            key={course.id}
            href={course.ready ? `/drills/${course.id}` : '#'}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '1.5rem 1rem',
              background: T.surface,
              borderRadius: 20,
              border: course.ready ? '1px solid rgba(139,92,246,0.2)' : `1px solid ${T.border}`,
              textDecoration: 'none',
              color: T.text,
              opacity: course.ready ? 1 : 0.5,
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Glow effect for ready cards */}
            {course.ready && (
              <div style={{
                position: 'absolute', top: -20, right: -20, width: 80, height: 80,
                background: course.glow, borderRadius: '50%', filter: 'blur(30px)',
              }} />
            )}

            {/* Icon */}
            <div style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background: course.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              marginBottom: '0.75rem',
              boxShadow: course.ready ? `0 8px 24px ${course.glow}` : 'none',
              position: 'relative',
            }}>
              {course.icon}
            </div>

            {/* Info */}
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem', position: 'relative' }}>
              {course.title}
            </div>
            <div style={{ color: T.textMuted, fontSize: '0.75rem', marginBottom: '0.4rem', position: 'relative' }}>
              {course.subtitle}
            </div>

            {course.ready ? (
              <div style={{
                background: 'rgba(34,197,94,0.15)', color: T.green,
                fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.6rem',
                borderRadius: 8, position: 'relative',
              }}>
                {course.exercises} exercises
              </div>
            ) : (
              <div style={{
                background: 'rgba(245,158,11,0.15)', color: T.gold,
                fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.6rem',
                borderRadius: 8, position: 'relative',
              }}>
                Coming soon
              </div>
            )}

            {course.ready && (
              <ChevronRight size={16} color={T.textMuted} style={{
                position: 'absolute', top: 12, right: 12,
              }} />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
