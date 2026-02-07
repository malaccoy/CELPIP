'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ClipboardList, ArrowRight, Clock, Target, Sparkles, Gamepad2, MessageSquareText, BookOpen, GraduationCap, MessageCircle, SearchX, BarChart3 } from 'lucide-react';
import styles from '@/styles/WritingHub.module.scss';
import ProgressTracker from '@/components/ProgressTracker';

export default function WritingHubPage() {
  const router = useRouter();

  return (
    <div className={styles.writingHubContainer}>
      {/* Header */}
      <div className={styles.hubHeader}>
        <div className={styles.hubHeaderContent}>
          <div className={styles.hubIcon}>
            <Sparkles size={32} />
          </div>
          <div className={styles.hubInfo}>
            <h1>Writing Practice</h1>
            <p className={styles.hubSubtitle}>Follow the steps below to prepare and practice for the CELPIP Writing test.</p>
          </div>
        </div>
      </div>

      {/* STEP 1 - Preparation */}
      <section className={styles.stepSection}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>Step 1</span>
          <span className={styles.stepLabel}>Preparation</span>
        </div>

        {/* Mastery Guide - NEW */}
        <div className={styles.guideCard} onClick={() => router.push('/writing/guide')}>
          <div className={styles.guideCardIcon}>
            <GraduationCap size={24} />
          </div>
          <div className={styles.guideCardContent}>
            <h3>Mastery Guide</h3>
            <p>Learn the CSF framework, PRE technique, and score-boosting formulas</p>
          </div>
          <div className={styles.guideCardBadge}>
            <span>Essential</span>
          </div>
        </div>

        <div className={styles.prepCard} onClick={() => router.push('/writing/starters')}>
          <div className={styles.prepCardIcon}>
            <MessageSquareText size={24} />
          </div>
          <div className={styles.prepCardContent}>
            <h3>Sentence Starters</h3>
            <p>Learn what to say before you write</p>
          </div>
          <div className={styles.prepCardAction}>
            <span>Start</span>
            <ArrowRight size={16} />
          </div>
        </div>

        <div className={styles.prepCard} onClick={() => router.push('/writing/closing-builder')}>
          <div className={styles.prepCardIcon}>
            <MessageCircle size={24} />
          </div>
          <div className={styles.prepCardContent}>
            <h3>Closing Builder</h3>
            <p>"Please let me know if..." generator</p>
          </div>
          <div className={styles.prepCardAction}>
            <span>Build</span>
            <ArrowRight size={16} />
          </div>
        </div>

        <div className={styles.prepCard} onClick={() => router.push('/writing/contraction-spotter')}>
          <div className={styles.prepCardIcon}>
            <SearchX size={24} />
          </div>
          <div className={styles.prepCardContent}>
            <h3>Contraction Spotter</h3>
            <p>Find and avoid contractions</p>
          </div>
          <div className={styles.prepCardAction}>
            <span>Play</span>
            <ArrowRight size={16} />
          </div>
        </div>

        <div className={styles.prepCard} onClick={() => router.push('/writing/game')}>
          <div className={styles.prepCardIcon}>
            <Gamepad2 size={24} />
          </div>
          <div className={styles.prepCardContent}>
            <h3>Word Game</h3>
            <p>Practice vocabulary with hangman</p>
          </div>
          <div className={styles.prepCardAction}>
            <span>Play</span>
            <ArrowRight size={16} />
          </div>
        </div>
      </section>

      {/* STEP 2 - Practice */}
      <section className={styles.stepSection}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>Step 2</span>
          <span className={styles.stepLabel}>Practice Mode</span>
        </div>

        {/* Task 1 */}
        <div 
          className={styles.examCard}
          onClick={() => router.push('/writing/task-1')}
        >
          <div className={styles.examCardHeader}>
            <div className={styles.examCardIcon}>
              <Mail size={28} />
            </div>
            <div className={styles.examCardTitle}>
              <span className={styles.taskBadge}>Task 1</span>
              <h3>Email Writing</h3>
            </div>
          </div>
          
          <p className={styles.examCardDesc}>
            Write formal and semi-formal emails: complaints, requests, and thanks.
          </p>

          <div className={styles.examCardMeta}>
            <div className={styles.metaChip}>
              <Target size={14} />
              <span>150-200 words</span>
            </div>
            <div className={styles.metaChip}>
              <Clock size={14} />
              <span>27 min</span>
            </div>
          </div>

          <div className={styles.examCardCta}>
            <span>Start Practice</span>
            <ArrowRight size={18} />
          </div>
        </div>

        {/* Task 2 */}
        <div 
          className={styles.examCard}
          onClick={() => router.push('/writing/task-2')}
        >
          <div className={styles.examCardHeader}>
            <div className={styles.examCardIcon}>
              <ClipboardList size={28} />
            </div>
            <div className={styles.examCardTitle}>
              <span className={styles.taskBadge}>Task 2</span>
              <h3>Survey Response</h3>
            </div>
          </div>
          
          <p className={styles.examCardDesc}>
            Respond to opinion surveys with structured argumentation.
          </p>

          <div className={styles.examCardMeta}>
            <div className={styles.metaChip}>
              <Target size={14} />
              <span>150-200 words</span>
            </div>
            <div className={styles.metaChip}>
              <Clock size={14} />
              <span>26 min</span>
            </div>
          </div>

          <div className={styles.examCardCta}>
            <span>Start Practice</span>
            <ArrowRight size={18} />
          </div>
        </div>
      </section>

      {/* STEP 3 - Your Progress */}
      <section className={styles.stepSection}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>Step 3</span>
          <span className={styles.stepLabel}>Your Progress</span>
        </div>
        
        <ProgressTracker />
      </section>

      {/* Study Guide Link */}
      <div className={styles.guideLink} onClick={() => router.push('/writing/guide')}>
        <BookOpen size={18} />
        <span>Read the complete Writing Guide</span>
        <ArrowRight size={16} />
      </div>
    </div>
  );
}
