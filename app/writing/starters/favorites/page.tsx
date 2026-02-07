'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, Trash2, Copy, Check } from 'lucide-react';
import { STARTER_CATEGORIES, getCategoryById } from '../../../../content/sentence-starters';
import styles from '@/styles/SentenceStarters.module.scss';

interface FavoritePhrase {
  categoryId: string;
  phrase: string;
  example: string;
  tip: string;
  categoryTitle: string;
  categoryIcon: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [copiedPhrase, setCopiedPhrase] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const saved = JSON.parse(localStorage.getItem('startersFavorites') || '[]');
      setFavorites(saved);
    }
  }, []);

  const getFavoritePhrases = (): FavoritePhrase[] => {
    const phrases: FavoritePhrase[] = [];
    
    favorites.forEach(favId => {
      const [categoryId, phraseText] = favId.split(':');
      const category = getCategoryById(categoryId);
      if (category) {
        const phrase = category.phrases.find(p => p.phrase === phraseText);
        if (phrase) {
          phrases.push({
            categoryId,
            phrase: phrase.phrase,
            example: phrase.example,
            tip: phrase.tip,
            categoryTitle: category.title,
            categoryIcon: category.icon
          });
        }
      }
    });
    
    return phrases;
  };

  const removeFavorite = (phraseId: string) => {
    const newFavorites = favorites.filter(f => f !== phraseId);
    setFavorites(newFavorites);
    if (typeof window !== 'undefined') {
      localStorage.setItem('startersFavorites', JSON.stringify(newFavorites));
    }
  };

  const copyPhrase = async (phrase: string) => {
    try {
      await navigator.clipboard.writeText(phrase);
      setCopiedPhrase(phrase);
      setTimeout(() => setCopiedPhrase(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const clearAllFavorites = () => {
    if (confirm('Remove all favorites?')) {
      setFavorites([]);
      if (typeof window !== 'undefined') {
        localStorage.setItem('startersFavorites', JSON.stringify([]));
      }
    }
  };

  const favoritePhrases = mounted ? getFavoritePhrases() : [];

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/writing/starters" className={styles.backButton}>
          <ArrowLeft size={20} />
        </Link>
        <div className={styles.headerContent}>
          <h1>⭐ My Favorites</h1>
          <p>Your saved sentence starters for quick reference</p>
        </div>
      </header>

      {/* Content */}
      {!mounted ? (
        <div className={styles.loadingState}>Loading...</div>
      ) : favoritePhrases.length === 0 ? (
        <div className={styles.emptyState}>
          <Star size={48} className={styles.emptyIcon} />
          <h3>No favorites yet</h3>
          <p>Tap the ⭐ icon on any phrase to save it here for quick access.</p>
          <Link href="/writing/starters" className={styles.browseButton}>
            Browse Sentence Starters
          </Link>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className={styles.favoritesSummary}>
            <span>{favoritePhrases.length} saved phrase{favoritePhrases.length !== 1 ? 's' : ''}</span>
            <button className={styles.clearAllButton} onClick={clearAllFavorites}>
              <Trash2 size={14} /> Clear all
            </button>
          </div>

          {/* Favorites List */}
          <div className={styles.learnContent}>
            {favoritePhrases.map((fav, index) => (
              <article key={index} className={styles.patternCard}>
                {/* Category Badge */}
                <div className={styles.favoriteCategoryBadge}>
                  <span>{fav.categoryIcon}</span>
                  <span>{fav.categoryTitle}</span>
                </div>

                {/* Phrase */}
                <div className={styles.patternPhraseRow}>
                  <div className={styles.patternPhrase}>
                    "{fav.phrase}"
                  </div>
                  <div className={styles.favoriteActions}>
                    <button 
                      className={styles.copyButton}
                      onClick={() => copyPhrase(fav.phrase)}
                    >
                      {copiedPhrase === fav.phrase ? (
                        <><Check size={14} /></>
                      ) : (
                        <><Copy size={14} /></>
                      )}
                    </button>
                    <button 
                      className={styles.removeButton}
                      onClick={() => removeFavorite(`${fav.categoryId}:${fav.phrase}`)}
                      title="Remove from favorites"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Tip */}
                <div className={styles.patternTip}>
                  👉 {fav.tip}
                </div>

                {/* Example */}
                <div className={styles.patternExample}>
                  <span className={styles.exampleLabel}>Example</span>
                  <p>"{fav.example}"</p>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
