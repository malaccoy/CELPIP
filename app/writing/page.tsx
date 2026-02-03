'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ClipboardList, ArrowRight, Clock, Target, Sparkles } from 'lucide-react';
import styles from '@/styles/WritingHub.module.scss';

export default function WritingHubPage() {
  const router = useRouter();

  const tasks = [
    {
      id: 'task-1',
      number: '01',
      title: 'Email Writing',
      icon: Mail,
      description: 'Write formal and semi-formal emails. Complaints, requests, thanks.',
      wordCount: '150-200 words',
      time: '27 minutes',
      features: [
        'Guided structure (5 elements)',
        'PRE planning',
        'AI evaluation',
        'Instant feedback'
      ],
      route: '/writing/task-1',
      color: '#10b981'
    },
    {
      id: 'task-2',
      number: '02',
      title: 'Survey Response',
      icon: ClipboardList,
      description: 'Respond to opinion surveys with structured argumentation.',
      wordCount: '150-200 words',
      time: '26 minutes',
      features: [
        'PRE structure (Point-Reason-Example)',
        'Argument planning',
        'AI evaluation',
        'Professional templates'
      ],
      route: '/writing/task-2',
      color: '#3b82f6'
    }
  ];

  return (
    <div className={styles.writingHubContainer}>
      {/* Header */}
      <div className={styles.hubHeader}>
        <div className={styles.hubHeaderContent}>
          <div className={styles.hubIcon}>
            <Sparkles size={32} />
          </div>
          <div className={styles.hubInfo}>
            <h1>Writing Tasks</h1>
            <p>Practice both CELPIP writing tasks with real-time feedback</p>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className={styles.tasksGrid}>
        {tasks.map((task) => {
          const Icon = task.icon;
          
          return (
            <article 
              key={task.id}
              className={styles.taskCard}
              onClick={() => router.push(task.route)}
              style={{ '--task-color': task.color } as React.CSSProperties}
            >
              <div className={styles.taskCardNumber}>{task.number}</div>
              
              <div className={styles.taskCardHeader}>
                <div className={styles.taskIcon}>
                  <Icon size={40} />
                </div>
                <div className={styles.taskInfo}>
                  <h2>{task.title}</h2>
                  <p>{task.description}</p>
                </div>
              </div>

              <div className={styles.taskMeta}>
                <div className={styles.metaItem}>
                  <Target size={16} />
                  <span>{task.wordCount}</span>
                </div>
                <div className={styles.metaItem}>
                  <Clock size={16} />
                  <span>{task.time}</span>
                </div>
              </div>

              <div className={styles.featuresList}>
                {task.features.map((feature, idx) => (
                  <div key={idx} className={styles.featureItem}>
                    <div className={styles.featureDot} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button className={styles.taskCardButton}>
                <span>Start Practice</span>
                <ArrowRight size={18} />
              </button>

              <div className={styles.taskCardGlow} />
            </article>
          );
        })}
      </div>

      {/* Tips Section */}
      <div className={styles.tipsSection}>
        <h3>💡 Practice Tips</h3>
        <div className={styles.tipsGrid}>
          <div className={styles.tipCard}>
            <span className={styles.tipEmoji}>⏱️</span>
            <p><strong>Use the timer:</strong> Simulate real exam conditions</p>
          </div>
          <div className={styles.tipCard}>
            <span className={styles.tipEmoji}>📝</span>
            <p><strong>Plan first:</strong> Organize your ideas before writing</p>
          </div>
          <div className={styles.tipCard}>
            <span className={styles.tipEmoji}>✨</span>
            <p><strong>Use AI:</strong> Get detailed feedback and improve</p>
          </div>
          <div className={styles.tipCard}>
            <span className={styles.tipEmoji}>💾</span>
            <p><strong>Save drafts:</strong> Continue where you left off</p>
          </div>
        </div>
      </div>
    </div>
  );
}
