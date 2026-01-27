'use client';

import { useRouter } from 'next/navigation';
import { Card, Button } from '@/components/Common';
import { guideMainContent } from '@content/pt/guide-main';
import { ArrowRight, BookOpen, Lightbulb, CheckCircle, Mail, PenTool } from 'lucide-react';
import styles from '@/styles/Guide.module.scss';

export default function GuidePage() {
  const router = useRouter();
  const content = guideMainContent;

  return (
    <div className={styles.guideContainer}>
      <div className={styles.guideHeader}>
        <h1>{content.pageTitle}</h1>
        <p>{content.pageSubtitle}</p>
      </div>

      {/* Intro Section */}
      <Card title={content.intro.title}>
        <p className={styles.introDescription}>{content.intro.description}</p>
        <ul className={styles.contentList}>
          {content.intro.tips.map((tip, index) => (
            <li key={index} className={styles.contentItem}>{tip}</li>
          ))}
        </ul>
      </Card>

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

              <Button onClick={() => router.push(task.link)} className={styles.guideTaskButton}>
                {task.buttonText} <ArrowRight size={16} />
              </Button>
            </div>
          );
        })}
      </div>

      {/* General Tips */}
      <Card title={content.generalTips.title}>
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
      </Card>

      {/* CTA Section */}
      <div className={styles.guideCta}>
        <BookOpen size={24} />
        <p>Escolha uma das tasks acima para começar a estudar!</p>
      </div>
    </div>
  );
}
