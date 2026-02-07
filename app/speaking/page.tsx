'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Mic, ArrowRight, Clock, Sparkles
} from 'lucide-react';
import { speakingTasks } from '@content/speaking-guide';
import styles from '@/styles/SpeakingHub.module.scss';

export default function SpeakingHubPage() {
  const router = useRouter();
  
  const totalTime = speakingTasks.reduce((sum, t) => sum + t.prepTime + t.speakTime, 0);

  return (
    <div className={styles.hubContainer}>
      {/* Header */}
      <div className={styles.hubHeader}>
        <div className={styles.hubHeaderContent}>
          <div className={styles.hubIcon}>
            <Mic size={32} />
          </div>
          <div className={styles.hubInfo}>
            <h1>Speaking Practice</h1>
            <p className={styles.hubSubtitle}>Practice all 8 parts of the CELPIP Speaking test with AI feedback.</p>
          </div>
        </div>
      </div>

      {/* STEP 1 - Parts 1-4 */}
      <section className={styles.stepSection}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>Step 1</span>
          <span className={styles.stepLabel}>Foundation Tasks</span>
        </div>

        {speakingTasks.slice(0, 4).map((task) => (
          <div 
            key={task.id} 
            className={styles.prepCard}
            onClick={() => router.push(`/speaking/practice/${task.id}`)}
          >
            <div className={styles.prepCardIcon}>
              <span style={{ fontSize: '1.5rem' }}>{task.icon}</span>
            </div>
            <div className={styles.prepCardContent}>
              <h3>Part {task.part}: {task.title}</h3>
              <p>{task.prepTime}s prep • {task.speakTime}s speak</p>
            </div>
            <div className={styles.prepCardAction}>
              <span>Practice</span>
              <ArrowRight size={16} />
            </div>
          </div>
        ))}
      </section>

      {/* STEP 2 - Parts 5-8 */}
      <section className={styles.stepSection}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>Step 2</span>
          <span className={styles.stepLabel}>Advanced Tasks</span>
        </div>

        {speakingTasks.slice(4).map((task) => (
          <div 
            key={task.id}
            className={styles.examCard}
            onClick={() => router.push(`/speaking/practice/${task.id}`)}
          >
            <div className={styles.examCardHeader}>
              <div className={styles.examCardIcon}>
                <span style={{ fontSize: '1.75rem' }}>{task.icon}</span>
              </div>
              <div className={styles.examCardTitle}>
                <span className={styles.taskBadge}>Part {task.part}</span>
                <h3>{task.title}</h3>
              </div>
            </div>
            
            <p className={styles.examCardDesc}>{task.description}</p>

            <div className={styles.examCardMeta}>
              <div className={styles.metaChip}>
                <Clock size={14} />
                <span>{task.prepTime}s prep</span>
              </div>
              <div className={styles.metaChip}>
                <Mic size={14} />
                <span>{task.speakTime}s speak</span>
              </div>
            </div>

            <div className={styles.examCardCta}>
              <span>Start Practice</span>
              <ArrowRight size={18} />
            </div>
          </div>
        ))}
      </section>

      {/* AI Feature Notice */}
      <div className={styles.guideLink} onClick={() => router.push('/speaking/practice/giving-advice')}>
        <Sparkles size={18} />
        <span>Full Speaking Test • ~{Math.round(totalTime / 60)} min • AI Feedback</span>
        <ArrowRight size={16} />
      </div>
    </div>
  );
}
