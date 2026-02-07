'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Headphones, ArrowRight, Clock, Target, Volume2,
  Lightbulb, AlertCircle
} from 'lucide-react';
import { listeningParts, listeningStrategies } from '@content/listening-guide';
import styles from '@/styles/ListeningHub.module.scss';

export default function ListeningHubPage() {
  const router = useRouter();
  
  const totalQuestions = listeningParts.reduce((sum, p) => sum + p.questions, 0);

  return (
    <div className={styles.hubContainer}>
      {/* Header */}
      <div className={styles.hubHeader}>
        <div className={styles.hubHeaderContent}>
          <div className={styles.hubIcon}>
            <Headphones size={32} />
          </div>
          <div className={styles.hubInfo}>
            <h1>Listening Practice</h1>
            <p className={styles.hubSubtitle}>Practice all 6 parts of the CELPIP Listening test.</p>
          </div>
        </div>
      </div>

      {/* STEP 1 - Understand the Format */}
      <section className={styles.stepSection}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>Step 1</span>
          <span className={styles.stepLabel}>Understand the Format</span>
        </div>

        {/* Important Notice */}
        <div className={styles.noticeCard}>
          <AlertCircle size={20} />
          <p>
            <strong>Important:</strong> In the real CELPIP test, each audio plays only ONCE. 
            Practice listening carefully the first time!
          </p>
        </div>

        {/* Parts Overview */}
        {listeningParts.slice(0, 3).map((part) => (
          <div 
            key={part.id} 
            className={styles.prepCard}
            onClick={() => router.push(`/listening/practice/${part.id}`)}
          >
            <div className={styles.prepCardIcon}>
              <span style={{ fontSize: '1.5rem' }}>{part.icon}</span>
            </div>
            <div className={styles.prepCardContent}>
              <h3>Part {part.part}: {part.title}</h3>
              <p>{part.questions} questions • {part.duration}</p>
            </div>
            <div className={styles.prepCardAction}>
              <span>Practice</span>
              <ArrowRight size={16} />
            </div>
          </div>
        ))}
      </section>

      {/* STEP 2 - More Parts */}
      <section className={styles.stepSection}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>Step 2</span>
          <span className={styles.stepLabel}>Advanced Parts</span>
        </div>

        {listeningParts.slice(3).map((part) => (
          <div 
            key={part.id}
            className={styles.examCard}
            onClick={() => router.push(`/listening/practice/${part.id}`)}
          >
            <div className={styles.examCardHeader}>
              <div className={styles.examCardIcon}>
                <span style={{ fontSize: '1.75rem' }}>{part.icon}</span>
              </div>
              <div className={styles.examCardTitle}>
                <span className={styles.taskBadge}>Part {part.part}</span>
                <h3>{part.title}</h3>
              </div>
            </div>
            
            <p className={styles.examCardDesc}>{part.description}</p>

            <div className={styles.examCardMeta}>
              <div className={styles.metaChip}>
                <Target size={14} />
                <span>{part.questions} questions</span>
              </div>
              <div className={styles.metaChip}>
                <Clock size={14} />
                <span>{part.duration}</span>
              </div>
            </div>

            <div className={styles.examCardCta}>
              <span>Start Practice</span>
              <ArrowRight size={18} />
            </div>
          </div>
        ))}
      </section>

      {/* Full Practice Link */}
      <div className={styles.guideLink} onClick={() => router.push('/listening/practice')}>
        <Headphones size={18} />
        <span>Full Listening Practice • {totalQuestions} questions • ~47 min</span>
        <ArrowRight size={16} />
      </div>
    </div>
  );
}
