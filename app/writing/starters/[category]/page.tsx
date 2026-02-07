'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, X, RotateCcw, ChevronRight, PenTool, Copy, CheckCircle, Star } from 'lucide-react';
import { getCategoryById, STARTER_CATEGORIES } from '../../../../content/sentence-starters';
import styles from '@/styles/SentenceStarters.module.scss';

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.category as string;
  const category = getCategoryById(categoryId);

  const [activeTab, setActiveTab] = useState<'learn' | 'practice'>('learn');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [categoryCompleted, setCategoryCompleted] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const currentIndex = STARTER_CATEGORIES.findIndex(c => c.id === categoryId);
  const prevCategory = currentIndex > 0 ? STARTER_CATEGORIES[currentIndex - 1] : null;
  const nextCategory = currentIndex < STARTER_CATEGORIES.length - 1 ? STARTER_CATEGORIES[currentIndex + 1] : null;

  useEffect(() => {
    if (typeof window !== 'undefined' && categoryId) {
      const progress = JSON.parse(localStorage.getItem('startersProgress') || '{}');
      setCategoryCompleted(progress[categoryId] || false);
      const savedFavorites = JSON.parse(localStorage.getItem('startersFavorites') || '[]');
      setFavorites(savedFavorites);
    }
  }, [categoryId]);

  useEffect(() => {
    if (completedQuestions.length === category?.practice.length && category?.practice.length > 0) {
      if (typeof window !== 'undefined') {
        const progress = JSON.parse(localStorage.getItem('startersProgress') || '{}');
        progress[categoryId] = true;
        localStorage.setItem('startersProgress', JSON.stringify(progress));
        setCategoryCompleted(true);
      }
    }
  }, [completedQuestions, category, categoryId]);

  if (!category) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h2>Category not found</h2>
          <Link href="/writing/starters">← Back to Sentence Starters</Link>
        </div>
      </div>
    );
  }

  const question = category.practice[currentQuestion];

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    if (answer === question.answer) {
      setScore(prev => prev + 1);
    }
    setCompletedQuestions(prev => [...prev, currentQuestion]);
  };

  const nextQuestion = () => {
    if (currentQuestion < category.practice.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const resetPractice = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCompletedQuestions([]);
  };

  const copyPhrase = async (phrase: string, index: number) => {
    try {
      await navigator.clipboard.writeText(phrase);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleFavorite = (phraseId: string) => {
    let newFavorites: string[];
    if (favorites.includes(phraseId)) {
      newFavorites = favorites.filter(f => f !== phraseId);
    } else {
      newFavorites = [...favorites, phraseId];
    }
    setFavorites(newFavorites);
    if (typeof window !== 'undefined') {
      localStorage.setItem('startersFavorites', JSON.stringify(newFavorites));
    }
  };

  const getPhraseId = (phrase: string) => `${categoryId}:${phrase}`;
  const allCompleted = completedQuestions.length === category.practice.length;

  return (
    <div className={styles.container}>
      <header className={styles.categoryHeader}>
        <Link href="/writing/starters" className={styles.backButton}>
          <ArrowLeft size={20} />
        </Link>
        <div className={styles.categoryHeaderContent}>
          <div className={styles.categoryIconLarge} style={{ background: category.color }}>
            {category.icon}
          </div>
          <div className={styles.categoryHeaderText}>
            <div className={styles.titleRow}>
              <h1>{category.title}</h1>
              {categoryCompleted && (
                <span className={styles.completedBadge}>
                  <CheckCircle size={16} /> Done
                </span>
              )}
            </div>
            <p className={styles.categorySubtitle}>{category.subtitle}</p>
          </div>
        </div>
      </header>

      <div className={styles.categoryDescription}>
        <p>{category.description}</p>
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'learn' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('learn')}
        >
          📚 Learn Patterns
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'practice' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('practice')}
        >
          ✏️ Practice
        </button>
      </div>

      {activeTab === 'learn' && (
        <div className={styles.learnContent}>
          {category.phrases.map((phrase, index) => {
            const phraseId = getPhraseId(phrase.phrase);
            const isFavorite = favorites.includes(phraseId);
            
            return (
              <article key={index} className={styles.patternCard}>
                <div className={styles.patternHeader}>
                  <div className={styles.patternTags}>
                    {phrase.tags.map((tag, i) => (
                      <span key={i} className={styles.patternTag}>{tag}</span>
                    ))}
                  </div>
                  <button 
                    className={`${styles.favoriteButton} ${isFavorite ? styles.favoriteActive : ''}`}
                    onClick={() => toggleFavorite(phraseId)}
                  >
                    <Star size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <div className={styles.patternPhraseRow}>
                  <div className={styles.patternPhrase}>&quot;{phrase.phrase}&quot;</div>
                  <button className={styles.copyButton} onClick={() => copyPhrase(phrase.phrase, index)}>
                    {copiedIndex === index ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                  </button>
                </div>

                <div className={styles.patternTip}>👉 {phrase.tip}</div>

                <div className={styles.patternExample}>
                  <span className={styles.exampleLabel}>Example</span>
                  <p>&quot;{phrase.example}&quot;</p>
                </div>
              </article>
            );
          })}

          <div className={styles.learnActions}>
            <button className={styles.practiceCtaButton} onClick={() => setActiveTab('practice')}>
              ✏️ Test Your Knowledge <ChevronRight size={18} />
            </button>
            <Link href="/writing/task-1" className={styles.writeCtaButton}>
              <PenTool size={18} /> Use in Writing Task
            </Link>
          </div>

          <div className={styles.categoryNav}>
            {prevCategory ? (
              <Link href={`/writing/starters/${prevCategory.id}`} className={styles.navLink}>
                <ArrowLeft size={16} /> <span>{prevCategory.title}</span>
              </Link>
            ) : <div />}
            {nextCategory ? (
              <Link href={`/writing/starters/${nextCategory.id}`} className={styles.navLinkNext}>
                <span>{nextCategory.title}</span> <ArrowRight size={16} />
              </Link>
            ) : <div />}
          </div>
        </div>
      )}

      {activeTab === 'practice' && (
        <div className={styles.practiceContent}>
          <div className={styles.practiceProgress}>
            <div className={styles.progressDots}>
              {category.practice.map((_, i) => (
                <div key={i} className={`${styles.progressDot} ${
                  completedQuestions.includes(i) ? styles.progressDotComplete : i === currentQuestion ? styles.progressDotCurrent : ''
                }`} />
              ))}
            </div>
            <div className={styles.scoreDisplay}>{score}/{category.practice.length}</div>
          </div>

          {!allCompleted ? (
            <>
              <div className={styles.questionCard}>
                <div className={styles.questionType}>
                  {question.type === 'fill-blank' ? '📝 Fill in the blank' : '🎯 Choose the best option'}
                </div>
                <div className={styles.questionText}>
                  {question.type === 'fill-blank' ? question.question.replace('___', '_______') : question.question}
                </div>
              </div>

              <div className={styles.optionsGrid}>
                {question.options?.map((option, i) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === question.answer;
                  const showCorrect = showResult && isCorrect;
                  const showWrong = showResult && isSelected && !isCorrect;

                  return (
                    <button
                      key={i}
                      className={`${styles.optionButton} ${showCorrect ? styles.optionCorrect : ''} ${showWrong ? styles.optionWrong : ''} ${isSelected && !showResult ? styles.optionSelected : ''}`}
                      onClick={() => handleAnswer(option)}
                      disabled={showResult}
                    >
                      <span className={styles.optionText}>{option}</span>
                      {showCorrect && <Check size={18} className={styles.optionIcon} />}
                      {showWrong && <X size={18} className={styles.optionIcon} />}
                    </button>
                  );
                })}
              </div>

              {showResult && question.explanation && (
                <div className={`${styles.explanation} ${selectedAnswer === question.answer ? styles.explanationCorrect : styles.explanationWrong}`}>
                  <div className={styles.explanationHeader}>
                    {selectedAnswer === question.answer ? '✅ Correct!' : '❌ Not quite'}
                  </div>
                  <p>{question.explanation}</p>
                  {currentQuestion < category.practice.length - 1 && (
                    <button className={styles.nextButton} onClick={nextQuestion}>
                      Next Question <ChevronRight size={18} />
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className={styles.completionCard}>
              <div className={styles.completionEmoji}>
                {score === category.practice.length ? '🎉' : score >= category.practice.length / 2 ? '👍' : '📚'}
              </div>
              <h3>Practice Complete!</h3>
              <p className={styles.finalScore}>
                You got <strong>{score}</strong> out of <strong>{category.practice.length}</strong> correct
              </p>
              {score === category.practice.length && (
                <p className={styles.perfectMessage}>Perfect score! You have mastered these patterns! 🌟</p>
              )}
              <div className={styles.completionActions}>
                <button className={styles.retryButton} onClick={resetPractice}>
                  <RotateCcw size={16} /> Try Again
                </button>
                <Link href="/writing/task-1" className={styles.writeTaskButton}>
                  <PenTool size={16} /> Practice Writing
                </Link>
              </div>
              {nextCategory && (
                <Link href={`/writing/starters/${nextCategory.id}`} className={styles.nextCategoryLink}>
                  Next: {nextCategory.title} <ArrowRight size={16} />
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
