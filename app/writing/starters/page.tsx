'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Lightbulb, CheckCircle, Star } from 'lucide-react';
import { STARTER_CATEGORIES } from '../../../content/sentence-starters';
import styles from '@/styles/SentenceStarters.module.scss';

export default function SentenceStartersPage() {
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const savedProgress = JSON.parse(localStorage.getItem('startersProgress') || '{}');
      setProgress(savedProgress);
      
      const savedFavorites = JSON.parse(localStorage.getItem('startersFavorites') || '[]');
      setFavoritesCount(savedFavorites.length);
    }
  }, []);

  const completedCount = Object.values(progress).filter(Boolean).length;
  const totalCategories = STARTER_CATEGORIES.length;

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/writing" className={styles.backButton}>
          <ArrowLeft size={20} />
        </Link>
        <div className={styles.headerContent}>
          <h1>Sentence Starters</h1>
          <p>Learn what to say before you worry about how to write it.</p>
        </div>
      </header>

      {/* Favorites Link */}
      {mounted && favoritesCount > 0 && (
        <Link href="/writing/starters/favorites" className={styles.favoritesLink}>
          <Star size={18} />
          <span>My Favorites</span>
          <span className={styles.favoritesCount}>{favoritesCount}</span>
          <ArrowRight size={16} />
        </Link>
      )}

      {/* Progress Bar */}
      {mounted && completedCount > 0 && (
        <div className={styles.progressCard}>
          <div className={styles.progressInfo}>
            <span className={styles.progressText}>
              <CheckCircle size={16} /> {completedCount}/{totalCategories} completed
            </span>
            {completedCount === totalCategories && (
              <span className={styles.progressComplete}>🎉 All done!</span>
            )}
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${(completedCount / totalCategories) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Intro Card */}
      <div className={styles.introCard}>
        <Lightbulb className={styles.introIcon} />
        <div className={styles.introContent}>
          <h3>Why Sentence Starters?</h3>
          <p>
            Most CELPIP candidates don't fail because of bad English — they fail because 
            they don't know <strong>how to start</strong>. Learn these patterns and 
            you'll write faster, clearer, and with the right tone.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className={styles.categoriesGrid}>
        {STARTER_CATEGORIES.map((category) => {
          const isCompleted = mounted && progress[category.id];
          
          return (
            <Link 
              key={category.id} 
              href={`/writing/starters/${category.id}`}
              className={`${styles.categoryCard} ${isCompleted ? styles.categoryCardCompleted : ''}`}
              style={{ '--accent-color': category.color } as React.CSSProperties}
            >
              <div className={styles.categoryIcon}>{category.icon}</div>
              <div className={styles.categoryContent}>
                <div className={styles.categoryTitleRow}>
                  <h3>{category.title}</h3>
                  {isCompleted && <CheckCircle size={16} className={styles.categoryCheck} />}
                </div>
                <p>{category.description}</p>
                <div className={styles.categoryMeta}>
                  <span>{category.phrases.length} phrases</span>
                  <span>•</span>
                  <span>{category.practice.length} exercises</span>
                </div>
              </div>
              <ArrowRight className={styles.categoryArrow} size={20} />
            </Link>
          );
        })}
      </div>

      {/* Progress hint */}
      <div className={styles.progressHint}>
        <p>💡 <strong>Tip:</strong> Master 2-3 phrases from each category. That's all you need for the exam!</p>
      </div>
    </div>
  );
}
