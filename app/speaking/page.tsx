'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Lock, ArrowLeft, Sparkles, Bell } from 'lucide-react';
import styles from '@/styles/ComingSoon.module.scss';

export default function SpeakingPage() {
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

  const tasks = [
    'Task 1: Giving Advice',
    'Task 2: Talking about a Personal Experience',
    'Task 3: Describing a Scene',
    'Task 4: Making Predictions',
    'Task 5: Comparing and Persuading',
    'Task 6: Dealing with a Difficult Situation',
    'Task 7: Expressing Opinions',
    'Task 8: Describing an Unusual Situation'
  ];

  return (
    <div className={styles.comingSoonContainer}>
      <button className={styles.backButton} onClick={() => router.push('/dashboard')}>
        <ArrowLeft size={20} />
        <span>Back to Dashboard</span>
      </button>

      <div className={styles.contentWrapper}>
        <div className={styles.iconWrapper}>
          <div className={styles.iconGlow} style={{ background: 'radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 70%)' }} />
          <div className={styles.iconCircle} style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
            <Mic size={64} />
          </div>
          <div className={styles.lockBadge}>
            <Lock size={18} />
          </div>
        </div>

        <h1 className={styles.title}>
          <span style={{ color: '#ef4444' }}>Speaking</span> is coming!
        </h1>
        
        <p className={styles.description}>
          Get ready! Soon you'll be able to record your answers, 
          get AI feedback and practice all 8 CELPIP Speaking tasks.
        </p>

        <div className={styles.featuresList}>
          <h3>What's coming:</h3>
          <ul>
            {tasks.map((task, idx) => (
              <li key={idx}>
                <Sparkles size={16} />
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.notifyBox}>
          <Bell size={24} />
          <div className={styles.notifyContent}>
            <h4>Be the first to know</h4>
            <p>Get notified when Speaking is released</p>
            
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
            <div className={styles.progressFill} style={{ width: '5%' }} />
          </div>
          <span className={styles.progressPercent}>5%</span>
        </div>
      </div>
    </div>
  );
}
