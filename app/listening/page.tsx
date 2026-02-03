'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Headphones, Lock, ArrowLeft, Sparkles, Bell } from 'lucide-react';
import styles from '@/styles/ComingSoon.module.scss';

export default function ListeningPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // TODO: Save to database or send to backend
      console.log('Notify email:', email);
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 3000);
    }
  };

  const parts = [
    'Part 1: Listening to Problem Solving',
    'Part 2: Listening to a Daily Life Conversation',
    'Part 3: Listening for Information',
    'Part 4: Listening to a News Item',
    'Part 5: Listening to a Discussion',
    'Part 6: Listening to Viewpoints'
  ];

  return (
    <div className={styles.comingSoonContainer}>
      <button className={styles.backButton} onClick={() => router.push('/dashboard')}>
        <ArrowLeft size={20} />
        <span>Back to Dashboard</span>
      </button>

      <div className={styles.contentWrapper}>
        <div className={styles.iconWrapper}>
          <div className={styles.iconGlow} style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)' }} />
          <div className={styles.iconCircle} style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
            <Headphones size={64} />
          </div>
          <div className={styles.lockBadge}>
            <Lock size={18} />
          </div>
        </div>

        <h1 className={styles.title}>
          <span style={{ color: '#3b82f6' }}>Listening</span> is coming!
        </h1>
        
        <p className={styles.description}>
          We're building an amazing experience for you to practice 
          your listening comprehension skills with real audio and instant feedback.
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
            <p>Get notified when Listening is released</p>
            
            {!subscribed ? (
              <form onSubmit={handleNotify} className={styles.notifyForm}>
                <input
                  type="email"
                  placeholder="your@email.com"
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
            <div className={styles.progressFill} style={{ width: '15%' }} />
          </div>
          <span className={styles.progressPercent}>15%</span>
        </div>
      </div>
    </div>
  );
}
