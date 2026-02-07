'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, ArrowRight, Clock, Target, FileText
} from 'lucide-react';
import { readingParts } from '@content/reading-guide';
import styles from '@/styles/ReadingHub.module.scss';

export default function ReadingHubPage() {
  const router = useRouter();
  
  const totalQuestions = readingParts.reduce((sum, p) => sum + p.questions, 0);

  return (
    <div className={styles.hubContainer}>
      {/* Header */}
      <div className={styles.hubHeader}>
        <div className={styles.hubHeaderContent}>
          <div className={styles.hubIcon}>
            <BookOpen size={32} />
          </div>
          <div className={styles.hubInfo}>
            <h1>Reading Practice</h1>
            <p className={styles.hubSubtitle}>Master the CELPIP Reading test with strategies and practice.</p>
          </div>
        </div>
      </div>

      {/* STEP 1 - Parts 1-2 */}
      <section className={styles.stepSection}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>Step 1</span>
          <span className={styles.stepLabel}>Foundation</span>
        </div>

        {readingParts.slice(0, 2).map((part) => (
          <div 
            key={part.id} 
            className={styles.prepCard}
            onClick={() => router.push(`/reading/practice?part=${part.part}`)}
          >
            <div className={styles.prepCardIcon}>
              <span style={{ fontSize: '1.5rem' }}>{part.icon}</span>
            </div>
            <div className={styles.prepCardContent}>
              <h3>Part {part.part}: {part.title}</h3>
              <p>{part.questions} questions • {part.time}</p>
            </div>
            <div className={styles.prepCardAction}>
              <span>Practice</span>
              <ArrowRight size={16} />
            </div>
          </div>
        ))}
      </section>

      {/* STEP 2 - Parts 3-4 */}
      <section className={styles.stepSection}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>Step 2</span>
          <span className={styles.stepLabel}>Advanced</span>
        </div>

        {readingParts.slice(2).map((part) => (
          <div 
            key={part.id}
            className={styles.examCard}
            onClick={() => router.push(`/reading/practice?part=${part.part}`)}
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
                <span>{part.time}</span>
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
      <div className={styles.guideLink} onClick={() => router.push('/reading/practice')}>
        <FileText size={18} />
        <span>Full Reading Practice • {totalQuestions} questions • ~55 min</span>
        <ArrowRight size={16} />
      </div>
    </div>
  );
}
