'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Mail, BookOpen, Headphones, PenLine, Mic, Sparkles } from 'lucide-react';
import styles from '@/styles/Footer.module.scss';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      await fetch('/api/email-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer' }),
      });
      setStatus('done');
      localStorage.setItem('celpip-email-subscribed', 'true');
    } catch {
      setStatus('done');
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <h3>CELPIP AI Coach</h3>
            <p>AI-powered CELPIP preparation platform. Free practice tests, personalized feedback, and adaptive learning to help you achieve your target CLB score.</p>
          </div>

          {/* Practice */}
          <div className={styles.linkGroup}>
            <h4>Practice</h4>
            <Link href="/listening"><Headphones size={14} /> Listening</Link>
            <Link href="/reading"><BookOpen size={14} /> Reading</Link>
            <Link href="/writing"><PenLine size={14} /> Writing</Link>
            <Link href="/speaking"><Mic size={14} /> Speaking</Link>
            <Link href="/ai-coach"><Sparkles size={14} /> AI Coach</Link>
          </div>

          {/* Resources */}
          <div className={styles.linkGroup}>
            <h4>Resources</h4>
            <Link href="/listening/technique">Listening Guide</Link>
            <Link href="/reading/technique">Reading Guide</Link>
            <Link href="/writing/mastery">Writing Guide</Link>
            <Link href="/speaking/technique">Speaking Guide</Link>
            <Link href="/mock-exam">Mock Exam</Link>
            <Link href="/tools/score-calculator">CRS Calculator</Link>
            <Link href="/tools/practice-timer">Practice Timer</Link>
            <Link href="/blog">Blog</Link>
          </div>

          {/* Newsletter */}
          <div className={styles.newsletter}>
            <h4>Free Study Plan</h4>
            <p>Get a 14-day CELPIP study plan + weekly tips.</p>
            {status === 'done' ? (
              <p className={styles.done}>✅ Subscribed!</p>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" disabled={status === 'loading'}>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} CELPIP AI Coach. All rights reserved.</span>
          <div className={styles.bottomLinks}>
            <Link href="/pricing">Pricing</Link>
            <span>·</span>
            <Link href="/blog">Blog</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
