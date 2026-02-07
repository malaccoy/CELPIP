'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Copy, Check, ChevronRight, Sparkles } from 'lucide-react';
import styles from '@/styles/ClosingBuilder.module.scss';
import { closingCategories, type ClosingPhrase } from '@content/writing-tools';

export default function ClosingBuilderPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const currentCategory = closingCategories.find(c => c.id === selectedCategory);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/writing" className={styles.backButton}>
          <ArrowLeft size={20} />
        </Link>
        <div className={styles.headerContent}>
          <h1>"Please Let Me Know If..."</h1>
          <p>Generate the perfect closing for your email</p>
        </div>
      </header>

      {/* Info Box */}
      <div className={styles.infoBox}>
        <Sparkles size={20} />
        <p>
          <strong>Pro Tip:</strong> Every formal email should end with "Please let me know if..." 
          This makes your email polite and professional. Choose a category below to find the perfect closing!
        </p>
      </div>

      {!selectedCategory ? (
        /* Category Selection */
        <div className={styles.categoryGrid}>
          {closingCategories.map((category) => (
            <button
              key={category.id}
              className={styles.categoryCard}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className={styles.categoryIcon}>{category.icon}</span>
              <div className={styles.categoryInfo}>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
              </div>
              <ChevronRight size={20} className={styles.chevron} />
            </button>
          ))}
        </div>
      ) : (
        /* Closing Phrases */
        <div className={styles.phrasesSection}>
          <button 
            className={styles.backToCategories}
            onClick={() => setSelectedCategory(null)}
          >
            <ArrowLeft size={16} />
            <span>All Categories</span>
          </button>

          <div className={styles.categoryHeader}>
            <span className={styles.bigIcon}>{currentCategory?.icon}</span>
            <div>
              <h2>{currentCategory?.title}</h2>
              <p>{currentCategory?.description}</p>
            </div>
          </div>

          <div className={styles.phrasesList}>
            {currentCategory?.closings.map((closing) => (
              <div key={closing.id} className={styles.phraseCard}>
                <div className={styles.phraseContext}>
                  <span className={styles.contextLabel}>When to use:</span>
                  <span>{closing.context}</span>
                </div>
                
                <div className={styles.phraseTemplate}>
                  <p>{closing.template}</p>
                </div>

                <div className={styles.phraseExample}>
                  <span className={styles.exampleLabel}>Example:</span>
                  <p>"{closing.example}"</p>
                </div>

                <button
                  className={`${styles.copyButton} ${copiedId === closing.id ? styles.copied : ''}`}
                  onClick={() => handleCopy(closing.example, closing.id)}
                >
                  {copiedId === closing.id ? (
                    <>
                      <Check size={16} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className={styles.bottomNav}>
        <Link href="/writing/contraction-spotter" className={styles.nextFeature}>
          <span>Try Contraction Spotter</span>
          <ChevronRight size={18} />
        </Link>
      </div>
    </div>
  );
}
