'use client';

import { useRouter } from 'next/navigation';
import { guideMainContent } from '@content/pt/guide-main';
import { ArrowRight, BookOpen, Lightbulb, CheckCircle, Mail, PenTool, Sparkles } from 'lucide-react';
import styles from '@/styles/Guide.module.scss';

export default function GuidePage() {
  const router = useRouter();
  const content = guideMainContent;

  return (
    <div className={styles.guideContainer}>
      {/* Hero Header */}
      <div className={styles.guideHeader}>
        <h1>📚 {content.pageTitle}</h1>
        <p>{content.pageSubtitle}</p>
      </div>

      {/* Intro Section */}
      <div className={styles.guideCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardIcon}>
            <Sparkles size={18} />
          </div>
          <h3 className={styles.cardTitle}>{content.intro.title}</h3>
        </div>
        <p className={styles.introDescription}>{content.intro.description}</p>
        <ul className={styles.contentList}>
          {content.intro.tips.map((tip, index) => (
            <li key={index} className={styles.contentItem}>{tip}</li>
          ))}
        </ul>
      </div>

      {/* Task Cards */}
      <div className={styles.guideCardsGrid}>
        {content.tasks.map((task) => {
          const IconComponent = task.id === 'task-1' ? Mail : PenTool;
          const iconColorClass = task.id === 'task-1' ? styles.taskIconBlue : styles.taskIconPurple;
          
          return (
            <div key={task.id} className={styles.guideTaskCard}>
              <div className={`${styles.guideTaskIcon} ${iconColorClass}`}>
                <IconComponent size={28} />
              </div>
              <h3 className={styles.guideTaskTitle}>{task.title}</h3>
              <p className={styles.guideTaskDescription}>{task.description}</p>
              
              <ul className={styles.guideTaskFeatures}>
                {task.features.map((feature, index) => (
                  <li key={index}>
                    <CheckCircle size={14} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button onClick={() => router.push(task.link)} className={styles.guideTaskButton}>
                {task.buttonText} <ArrowRight size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {/* General Tips */}
      <div className={styles.guideCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardIcon} style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)' }}>
            <Lightbulb size={18} />
          </div>
          <h3 className={styles.cardTitle}>{content.generalTips.title}</h3>
        </div>
        <div className={styles.generalTipsGrid}>
          {content.generalTips.tips.map((tip, index) => (
            <div key={index} className={styles.generalTipItem}>
              <div className={styles.generalTipHeader}>
                <Lightbulb size={16} />
                <h4>{tip.title}</h4>
              </div>
              <p>{tip.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className={styles.guideCta}>
        <BookOpen size={24} />
        <p>Escolha uma das tasks acima para começar a estudar!</p>
      </div>
    </div>
  );
}
