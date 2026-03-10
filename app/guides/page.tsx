'use client';

import React from 'react';
import Link from 'next/link';
import {
  Mic, BookOpen, Headphones, PenTool,
  ArrowRight, Star, Clock, Layers, Target,
} from 'lucide-react';

const guides = [
  {
    title: 'Speaking Technique',
    subtitle: 'CSF Framework + 8 Task Formulas',
    description: 'Master the Context-Skill-Formula technique for every speaking task. Learn exact step-by-step formulas, advice expressions, and location words.',
    href: '/speaking/technique',
    icon: Mic,
    color: '#8b5cf6',
    highlights: ['CSF Framework', '8 Task Formulas', 'Advice Expressions', 'Score Band Guide'],
    modules: 12,
    readTime: '45 min',
  },
  {
    title: 'Listening Technique',
    subtitle: 'Strategies for All 6 Parts',
    description: 'Learn how to predict answers, identify key information, and manage your time across all listening parts.',
    href: '/listening/technique',
    icon: Headphones,
    color: '#3b82f6',
    highlights: ['6 Part Strategies', 'Note-Taking Tips', 'Prediction Skills', 'Trap Answer Guide'],
    modules: 10,
    readTime: '35 min',
  },
  {
    title: 'Reading Technique',
    subtitle: 'Speed Reading + Answer Strategies',
    description: 'Techniques for scanning passages, identifying viewpoints, and answering inference questions accurately.',
    href: '/reading/technique',
    icon: BookOpen,
    color: '#10b981',
    highlights: ['4 Part Strategies', 'Skimming Techniques', 'Viewpoint Analysis', 'Time Management'],
    modules: 8,
    readTime: '30 min',
  },
  {
    title: 'Writing Mastery',
    subtitle: 'Email Templates + Essay Structure',
    description: 'Complete guide to Task 1 emails and Task 2 survey responses. Includes templates, vocabulary banks, and scoring criteria.',
    href: '/writing/mastery',
    icon: PenTool,
    color: '#f59e0b',
    highlights: ['Email Templates', 'Essay Structure', 'Vocabulary Banks', 'Scoring Criteria'],
    modules: 10,
    readTime: '40 min',
  },
];

export default function GuidesPage() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem 4rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(139,92,246,0.1)',
          border: '1px solid rgba(139,92,246,0.2)',
          borderRadius: 20,
          padding: '0.4rem 1rem',
          marginBottom: '1rem',
          fontSize: '0.85rem',
          color: '#a78bfa',
        }}>
          <Star size={14} />
          Exclusive Study Material
        </div>
        <h1 style={{
          color: 'var(--text-primary)',
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          marginBottom: '0.75rem',
          fontWeight: 700,
        }}>
          Study Guides 📚
        </h1>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '1rem',
          lineHeight: 1.6,
          maxWidth: 600,
          margin: '0 auto',
        }}>
          Expert techniques and formulas for every section of the CELPIP test. 
          Learn the strategies that take you from a 7 to a 10+.
        </p>
      </div>

      {/* Guide Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {guides.map((guide) => {
          const Icon = guide.icon;
          return (
            <Link
              key={guide.href}
              href={guide.href}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 16,
                padding: '1.5rem',
                transition: 'all 0.2s',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = guide.color;
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-default)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'none';
                }}
              >
                {/* Subtle gradient accent */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: `linear-gradient(90deg, ${guide.color}, transparent)`,
                }} />

                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  {/* Icon */}
                  <div style={{
                    background: `${guide.color}15`,
                    borderRadius: 12,
                    padding: '0.75rem',
                    flexShrink: 0,
                  }}>
                    <Icon size={24} style={{ color: guide.color }} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.25rem' }}>
                      <h2 style={{
                        color: 'var(--text-primary)',
                        fontSize: '1.15rem',
                        fontWeight: 600,
                        margin: 0,
                      }}>
                        {guide.title}
                      </h2>
                      <ArrowRight size={16} style={{ color: guide.color, flexShrink: 0 }} />
                    </div>
                    
                    <p style={{
                      color: guide.color,
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      marginBottom: '0.5rem',
                    }}>
                      {guide.subtitle}
                    </p>

                    <p style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.88rem',
                      lineHeight: 1.5,
                      marginBottom: '0.75rem',
                    }}>
                      {guide.description}
                    </p>

                    {/* Highlights */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.5rem' }}>
                      {guide.highlights.map((h) => (
                        <span key={h} style={{
                          background: `${guide.color}10`,
                          border: `1px solid ${guide.color}25`,
                          color: guide.color,
                          borderRadius: 6,
                          padding: '0.2rem 0.5rem',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                        }}>
                          {h}
                        </span>
                      ))}
                    </div>

                    {/* Meta */}
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Layers size={12} /> {guide.modules} modules
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} /> {guide.readTime} read
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div style={{
        textAlign: 'center',
        marginTop: '2rem',
        padding: '1.5rem',
        background: 'rgba(139,92,246,0.05)',
        border: '1px solid rgba(139,92,246,0.15)',
        borderRadius: 16,
      }}>
        <Target size={20} style={{ color: '#a78bfa', marginBottom: '0.5rem' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
          These guides are based on proven CELPIP preparation techniques. 
          Study the guides first, then practice with our AI-powered exercises.
        </p>
      </div>
    </div>
  );
}
