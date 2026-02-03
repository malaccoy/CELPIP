'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Lock, ArrowLeft, Sparkles, Bell } from 'lucide-react';
import styles from '@/styles/ComingSoon.module.scss';

export default function ReadingPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log('Notify email:', email);
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 3000);
    }
  };

  const parts = [
    'Part 1: Reading Correspondence',
    'Part 2: Reading to Apply a Diagram',
    'Part 3: Reading for Information',
    'Part 4: Reading for Viewpoints'
  ];

  return (
    <div className={styles.comingSoonContainer}>
      <button className={styles.backButton} onClick={() => router.push('/dashboard')}>
        <ArrowLeft size={20} />
        <span>Back to Dashboard</span>
      </button>

      <div className={styles.contentWrapper}>
        <div className={styles.iconWrapper}>
          <div className={styles.iconGlow} style={{ background: 'radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 70%)' }} />
          <div className={styles.iconCircle} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <BookOpen size={64} />
          </div>
          <div className={styles.lockBadge}>
            <Lock size={18} />
          </div>
        </div>

        <h1 className={styles.title}>
          <span style={{ color: '#f59e0b' }}>Reading</span> is coming!
        </h1>
        
        <p className={styles.description}>
          Soon you'll be able to practice reading comprehension with real texts, 
          diagrams and interactive exercises to master CELPIP Reading.
        </p>

        <div className={styles.featuresList}>
          <h3>What's coming:</h3>
          <ul>
            {parts.map((part, idx) => (
              <li key={idx}>
                <Sparkles size={16} />
                <span>{part}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.notifyBox}>
          <Bell size={24} />
          <div className={styles.notifyContent}>
            <h4>Be the first to know</h4>
            <p>Get notified when Reading is released</p>
            
            {!subscribed ? (
              <form onSubmit={handleNotify} className={styles.notifyForm}>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit">Notify me</button>
              </form>
            ) : (
              <div className={styles.successMessage}>
                ✅ You'll be notified soon!
              </div>
            )}
          </div>
        </div>

        <div className={styles.progressIndicator}>
          <span className={styles.progressLabel}>Development progress:</span>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: '10%' }} />
          </div>
          <span className={styles.progressPercent}>10%</span>
        </div>
      </div>
    </div>
  );
}
