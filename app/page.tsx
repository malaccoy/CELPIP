'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, Zap, Target, Trophy, ChevronDown, PenLine, Mic, BookOpen, Headphones } from 'lucide-react';
import styles from '@/styles/Home.module.scss';

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={styles.homePage}>
      {/* Cursor follower */}
      <div 
        className={styles.cursorGlow}
        style={{ 
          left: mousePos.x, 
          top: mousePos.y,
          opacity: mounted ? 1 : 0 
        }}
      />

      {/* Floating elements */}
      <div className={styles.floatingElements}>
        <div className={styles.floatCircle1} />
        <div className={styles.floatCircle2} />
        <div className={styles.floatCircle3} />
        <div className={styles.gridLines} />
      </div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>
            <Sparkles size={14} />
            <span>CELPIP Preparation</span>
          </div>
          
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleLine1}>Prepare for the</span>
            <span className={styles.heroTitleLine2}>CELPIP</span>
            <span className={styles.heroTitleAccent}>Exam</span>
          </h1>
          
          <p className={styles.heroSubtitle}>
            Practice with real exam-style questions, official timing, 
            and AI-powered feedback to boost your score.
          </p>

          <div className={styles.heroCTA}>
            <button 
              className={styles.ctaPrimary}
              onClick={() => router.push('/dashboard')}
            >
              Start Practicing Now
              <ArrowRight size={18} />
            </button>
            <button 
              className={styles.ctaSecondary}
              onClick={() => router.push('/guide')}
            >
              View Study Guide
            </button>
          </div>
        </div>

        <div className={styles.scrollIndicator}>
          <span>Explore</span>
          <ChevronDown size={20} />
        </div>
      </section>

      {/* Modules Overview Section */}
      <section className={styles.modulesSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Complete Preparation</span>
          <h2 className={styles.sectionTitle}>All Four Skills</h2>
        </div>

        <div className={styles.modulesGrid}>
          <article 
            className={`${styles.moduleCard} ${styles.moduleActive}`}
            onClick={() => router.push('/writing')}
          >
            <div className={styles.moduleIcon}>
              <PenLine size={28} />
            </div>
            <h3 className={styles.moduleTitle}>Writing</h3>
            <p className={styles.moduleDesc}>Real tasks · Timer · AI Feedback</p>
            <div className={styles.moduleBadge}>Available</div>
          </article>

          <article 
            className={`${styles.moduleCard} ${styles.moduleComingSoon}`}
            onClick={() => router.push('/speaking')}
          >
            <div className={styles.moduleIcon}>
              <Mic size={28} />
            </div>
            <h3 className={styles.moduleTitle}>Speaking</h3>
            <p className={styles.moduleDesc}>Practice prompts · Recording</p>
            <div className={styles.moduleBadge}>Coming Soon</div>
          </article>

          <article 
            className={`${styles.moduleCard} ${styles.moduleComingSoon}`}
            onClick={() => router.push('/reading')}
          >
            <div className={styles.moduleIcon}>
              <BookOpen size={28} />
            </div>
            <h3 className={styles.moduleTitle}>Reading</h3>
            <p className={styles.moduleDesc}>Exam-style questions</p>
            <div className={styles.moduleBadge}>Coming Soon</div>
          </article>

          <article 
            className={`${styles.moduleCard} ${styles.moduleComingSoon}`}
            onClick={() => router.push('/listening')}
          >
            <div className={styles.moduleIcon}>
              <Headphones size={28} />
            </div>
            <h3 className={styles.moduleTitle}>Listening</h3>
            <p className={styles.moduleDesc}>Audio practice</p>
            <div className={styles.moduleBadge}>Coming Soon</div>
          </article>
        </div>
      </section>

      {/* Writing Tasks Section */}
      <section className={styles.tasksSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Writing Module</span>
          <h2 className={styles.sectionTitle}>Two Tasks,<br />One Goal</h2>
        </div>

        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <span className={styles.heroStatNumber}>43+</span>
            <span className={styles.heroStatLabel}>Task 1 Prompts</span>
          </div>
          <div className={styles.heroStatDivider} />
          <div className={styles.heroStat}>
            <span className={styles.heroStatNumber}>32+</span>
            <span className={styles.heroStatLabel}>Task 2 Prompts</span>
          </div>
          <div className={styles.heroStatDivider} />
          <div className={styles.heroStat}>
            <span className={styles.heroStatNumber}>∞</span>
            <span className={styles.heroStatLabel}>Practices</span>
          </div>
        </div>

        <div className={styles.tasksGrid}>
          {/* Task 1 Card */}
          <article 
            className={styles.taskCard}
            onClick={() => router.push('/writing/task-1')}
          >
            <div className={styles.taskCardNumber}>01</div>
            <div className={styles.taskCardContent}>
              <div className={styles.taskCardIcon}>✉️</div>
              <h3 className={styles.taskCardTitle}>Email Writing</h3>
              <p className={styles.taskCardDesc}>
                Formal and semi-formal emails. Complaints, requests, 
                thank you notes. 150-200 words in 27 minutes.
              </p>
              <ul className={styles.taskCardFeatures}>
                <li><Zap size={14} /> Instant feedback</li>
                <li><Target size={14} /> Word counter</li>
                <li><Trophy size={14} /> Exam mode</li>
              </ul>
            </div>
            <div className={styles.taskCardArrow}>
              <ArrowRight size={24} />
            </div>
            <div className={styles.taskCardGlow} />
          </article>

          {/* Task 2 Card */}
          <article 
            className={styles.taskCard}
            onClick={() => router.push('/writing/task-2')}
          >
            <div className={styles.taskCardNumber}>02</div>
            <div className={styles.taskCardContent}>
              <div className={styles.taskCardIcon}>📋</div>
              <h3 className={styles.taskCardTitle}>Survey Response</h3>
              <p className={styles.taskCardDesc}>
                Opinion surveys. PRE argumentation: Point, Reason, 
                Example. 150-200 words in 26 minutes.
              </p>
              <ul className={styles.taskCardFeatures}>
                <li><Zap size={14} /> PRE templates</li>
                <li><Target size={14} /> Guided structure</li>
                <li><Trophy size={14} /> Real mock test</li>
              </ul>
            </div>
            <div className={styles.taskCardArrow}>
              <ArrowRight size={24} />
            </div>
            <div className={styles.taskCardGlow} />
          </article>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h4>Smart Feedback</h4>
            <p>AI-powered analysis of structure, tone and grammar</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⏱️</div>
            <h4>Real Timer</h4>
            <p>Simulate exact exam conditions</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <h4>Progress</h4>
            <p>Track your evolution over time</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>💾</div>
            <h4>Drafts</h4>
            <p>Save and resume your practices anytime</p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={styles.bottomCTA}>
        <div className={styles.bottomCTAContent}>
          <h3>Ready to start?</h3>
          <p>Your journey to CELPIP success starts with one click.</p>
          <button 
            className={styles.ctaPrimary}
            onClick={() => router.push('/dashboard')}
          >
            Start Free Practice
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
