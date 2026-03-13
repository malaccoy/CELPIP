'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, ChevronRight, Check, Lock } from 'lucide-react';
import styles from '../../learn.module.scss';

const LEVEL_COLORS = ['#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#f59e0b'];
const LEVEL_EMOJIS = ['🟢', '🩵', '🔵', '🟣', '🏆'];

export default function LevelPage() {
  const router = useRouter();
  const params = useParams();
  const levelId = parseInt(params.id as string);

  const [level, setLevel] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch level with lessons
    fetch('/api/english/levels')
      .then(r => r.json())
      .then(data => {
        const lvl = data.levels?.find((l: any) => l.id === levelId);
        setLevel(lvl);
        setCompletedIds(new Set(data.completedLessonIds || []));
      })
      .catch(() => {});

    // Fetch lessons for this level
    fetch(`/api/english/levels/${levelId}/lessons`)
      .then(r => r.json())
      .then(data => setLessons(data.lessons || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [levelId]);

  if (loading) return (
    <div className={styles.container}>
      <div className={styles.loading}><p>Loading level...</p></div>
    </div>
  );

  const colorIdx = level ? level.number - 1 : 0;
  const color = LEVEL_COLORS[colorIdx] || '#6b7280';
  const emoji = LEVEL_EMOJIS[colorIdx] || '📚';

  return (
    <div className={styles.container} style={{ '--level-color': color } as React.CSSProperties}>
      <button className={styles.backBtn} onClick={() => router.push('/english')}>
        <ArrowLeft size={18} /> Back to Levels
      </button>

      <div className={styles.levelHero}>
        <div className={styles.heroEmoji}>{emoji}</div>
        <h1 className={styles.heroTitle}>
          Level {level?.number}: {level?.name}
        </h1>
        <p className={styles.heroTheme}>{level?.theme}</p>
      </div>

      <div className={styles.lessonGrid}>
        {lessons.map((lesson, idx) => {
          const isCompleted = completedIds.has(lesson.id);
          const prevCompleted = idx === 0 || completedIds.has(lessons[idx - 1]?.id);
          const isLocked = !prevCompleted && !isCompleted && idx > 0;
          const isCurrent = prevCompleted && !isCompleted;

          return (
            <div
              key={lesson.id}
              className={`${styles.lessonCard} ${isCompleted ? styles.completed : ''} ${isCurrent ? styles.current : ''} ${isLocked ? styles.lessonLocked : ''}`}
              onClick={() => !isLocked && router.push(`/english/lesson/${lesson.id}`)}
            >
              <div className={styles.lessonNumber}>
                {isCompleted ? <Check size={16} /> : lesson.number}
              </div>
              <div className={styles.lessonInfo}>
                <p className={styles.lessonTitle}>{lesson.title}</p>
                <p className={styles.lessonSituation}>{lesson.situation}</p>
              </div>
              <div className={styles.lessonStatus}>
                {isCompleted && <span className={styles.scoreChip}>✓</span>}
                {isLocked && <Lock size={16} color="rgba(255,255,255,0.2)" />}
                {!isCompleted && !isLocked && <ChevronRight size={18} color="rgba(255,255,255,0.3)" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
