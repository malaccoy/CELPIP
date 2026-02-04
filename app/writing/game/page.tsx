'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trophy, Target, Flame, RefreshCw, Lightbulb } from 'lucide-react';
import HangmanCanvas from '@/components/HangmanCanvas';
import styles from '@/styles/HangmanGame.module.scss';

// Word categories for CELPIP Writing
const WORD_CATEGORIES = {
  greetings: {
    name: 'Greetings & Closings',
    words: [
      { word: 'DEAR', hint: 'Start a formal email with this word', example: '___ Mr. Smith,' },
      { word: 'SINCERELY', hint: 'Formal way to end a letter', example: '___, John' },
      { word: 'REGARDS', hint: 'Common email closing', example: 'Best ___,' },
      { word: 'RESPECTFULLY', hint: 'Very formal closing', example: '___ yours,' },
      { word: 'CORDIALLY', hint: 'Warm but professional closing', example: 'Yours ___,' },
    ]
  },
  connectors: {
    name: 'Connectors & Transitions',
    words: [
      { word: 'FURTHERMORE', hint: 'Adding more information', example: '___,I believe...' },
      { word: 'HOWEVER', hint: 'Introducing a contrast', example: '___, I disagree...' },
      { word: 'THEREFORE', hint: 'Showing result/conclusion', example: '___, I request...' },
      { word: 'MOREOVER', hint: 'Adding to your point', example: '___, this affects...' },
      { word: 'NEVERTHELESS', hint: 'Despite what was said', example: '___, I will attend.' },
      { word: 'CONSEQUENTLY', hint: 'As a result of', example: '___, we need to act.' },
      { word: 'MEANWHILE', hint: 'At the same time', example: '___, I have been...' },
      { word: 'ADDITIONALLY', hint: 'In addition to', example: '___, I would like...' },
    ]
  },
  opinions: {
    name: 'Expressing Opinions',
    words: [
      { word: 'BELIEVE', hint: 'Express your thought', example: 'I ___ that...' },
      { word: 'OPINION', hint: 'Your personal view', example: 'In my ___,...' },
      { word: 'STRONGLY', hint: 'With emphasis', example: 'I ___ feel that...' },
      { word: 'CONVINCED', hint: 'Fully certain', example: 'I am ___ that...' },
      { word: 'PERSPECTIVE', hint: 'Point of view', example: 'From my ___,...' },
      { word: 'STANDPOINT', hint: 'Position on an issue', example: 'From this ___,...' },
    ]
  },
  requests: {
    name: 'Polite Requests',
    words: [
      { word: 'APPRECIATE', hint: 'Show gratitude', example: 'I would ___ if...' },
      { word: 'KINDLY', hint: 'Politely asking', example: 'Could you ___ help...' },
      { word: 'GRATEFUL', hint: 'Thankful', example: 'I would be ___ if...' },
      { word: 'REQUEST', hint: 'Ask formally', example: 'I would like to ___...' },
      { word: 'INQUIRE', hint: 'Ask about something', example: 'I am writing to ___...' },
      { word: 'ASSISTANCE', hint: 'Help', example: 'I need your ___...' },
    ]
  },
  complaints: {
    name: 'Complaints & Problems',
    words: [
      { word: 'UNFORTUNATELY', hint: 'Sad to say', example: '___, the service was...' },
      { word: 'DISAPPOINTED', hint: 'Let down feeling', example: 'I am ___ with...' },
      { word: 'INCONVENIENCE', hint: 'Trouble caused', example: 'This has caused ___.' },
      { word: 'UNACCEPTABLE', hint: 'Not okay', example: 'This situation is ___.' },
      { word: 'DISSATISFIED', hint: 'Not happy with', example: 'I am ___ with the...' },
      { word: 'CONCERNED', hint: 'Worried about', example: 'I am ___ about...' },
      { word: 'FRUSTRATING', hint: 'Causing annoyance', example: 'This is very ___.' },
    ]
  },
  formal_phrases: {
    name: 'Formal Phrases',
    words: [
      { word: 'REGARDING', hint: 'About/concerning', example: '___ your email,...' },
      { word: 'ACCORDANCE', hint: 'In agreement with', example: 'In ___ with the rules...' },
      { word: 'CIRCUMSTANCES', hint: 'Conditions/situation', example: 'Under these ___,...' },
      { word: 'ACKNOWLEDGE', hint: 'Recognize/admit', example: 'I ___ that...' },
      { word: 'APOLOGIZE', hint: 'Say sorry formally', example: 'I ___ for the delay.' },
      { word: 'APPROPRIATE', hint: 'Suitable/proper', example: 'The ___ action would be...' },
    ]
  },
  actions: {
    name: 'Action Words',
    words: [
      { word: 'RECOMMEND', hint: 'Suggest strongly', example: 'I ___ that you...' },
      { word: 'PROPOSE', hint: 'Put forward an idea', example: 'I ___ a meeting...' },
      { word: 'SUGGEST', hint: 'Offer an idea', example: 'I ___ we discuss...' },
      { word: 'CONSIDER', hint: 'Think about', example: 'Please ___ my request.' },
      { word: 'RESOLVE', hint: 'Fix/solve', example: 'We need to ___ this issue.' },
      { word: 'ADDRESS', hint: 'Deal with', example: 'I would like to ___ this...' },
    ]
  }
};

// Storage keys
const STATS_KEY = 'celpip_hangman_stats';

interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  bestStreak: number;
  wordsLearned: string[];
  lastPlayed: string;
}

function getStats(): GameStats {
  if (typeof window === 'undefined') {
    return { gamesPlayed: 0, gamesWon: 0, currentStreak: 0, bestStreak: 0, wordsLearned: [], lastPlayed: '' };
  }
  try {
    const saved = localStorage.getItem(STATS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { gamesPlayed: 0, gamesWon: 0, currentStreak: 0, bestStreak: 0, wordsLearned: [], lastPlayed: '' };
}

function saveStats(stats: GameStats) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export default function HangmanGamePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<GameStats>(getStats());
  
  // Game state
  const [category, setCategory] = useState<string | null>(null);
  const [currentWord, setCurrentWord] = useState<{ word: string; hint: string; example: string } | null>(null);
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [showHint, setShowHint] = useState(false);
  const [usedHint, setUsedHint] = useState(false);

  const MAX_ERRORS = 6;
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  useEffect(() => {
    setMounted(true);
    setStats(getStats());
  }, []);

  const selectRandomWord = useCallback((cat: string) => {
    const words = WORD_CATEGORIES[cat as keyof typeof WORD_CATEGORIES].words;
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  }, []);

  const startGame = (cat: string) => {
    setCategory(cat);
    setCurrentWord(selectRandomWord(cat));
    setGuessedLetters(new Set());
    setErrors(0);
    setGameStatus('playing');
    setShowHint(false);
    setUsedHint(false);
  };

  const handleGuess = (letter: string) => {
    if (gameStatus !== 'playing' || guessedLetters.has(letter)) return;

    const newGuessed = new Set(guessedLetters);
    newGuessed.add(letter);
    setGuessedLetters(newGuessed);

    if (!currentWord?.word.includes(letter)) {
      const newErrors = errors + 1;
      setErrors(newErrors);
      
      if (newErrors >= MAX_ERRORS) {
        // Lost
        setGameStatus('lost');
        const newStats = {
          ...stats,
          gamesPlayed: stats.gamesPlayed + 1,
          currentStreak: 0,
          lastPlayed: new Date().toISOString(),
        };
        setStats(newStats);
        saveStats(newStats);
      }
    } else {
      // Check if won
      const wordLetters = new Set(currentWord.word.split(''));
      const allGuessed = [...wordLetters].every(l => newGuessed.has(l));
      
      if (allGuessed) {
        setGameStatus('won');
        const newStreak = stats.currentStreak + 1;
        const wordsLearned = stats.wordsLearned.includes(currentWord.word) 
          ? stats.wordsLearned 
          : [...stats.wordsLearned, currentWord.word];
        
        const newStats = {
          ...stats,
          gamesPlayed: stats.gamesPlayed + 1,
          gamesWon: stats.gamesWon + 1,
          currentStreak: newStreak,
          bestStreak: Math.max(stats.bestStreak, newStreak),
          wordsLearned,
          lastPlayed: new Date().toISOString(),
        };
        setStats(newStats);
        saveStats(newStats);
      }
    }
  };

  const useHint = () => {
    if (usedHint || gameStatus !== 'playing') return;
    setShowHint(true);
    setUsedHint(true);
    // Penalty: add 1 error for using hint
    setErrors(Math.min(errors + 1, MAX_ERRORS - 1));
  };

  const playAgain = () => {
    if (category) {
      startGame(category);
    }
  };

  const backToCategories = () => {
    setCategory(null);
    setCurrentWord(null);
    setGameStatus('playing');
  };

  const renderWord = () => {
    if (!currentWord) return null;
    return currentWord.word.split('').map((letter, i) => (
      <span key={i} className={styles.letterBox}>
        {guessedLetters.has(letter) || gameStatus === 'lost' ? letter : '_'}
      </span>
    ));
  };

  if (!mounted) return null;

  // Category selection screen
  if (!category) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => router.push('/writing')}>
            <ArrowLeft size={20} />
          </button>
          <h1>📝 Word Game</h1>
          <div className={styles.statsPreview}>
            <Flame size={18} />
            <span>{stats.currentStreak}</span>
          </div>
        </div>

        <div className={styles.intro}>
          <h2>Learn CELPIP Writing Vocabulary! 🎯</h2>
          <p>Master essential words and phrases for Task 1 & Task 2 emails</p>
        </div>

        <div className={styles.statsCard}>
          <div className={styles.stat}>
            <Trophy size={20} />
            <span>{stats.gamesWon}</span>
            <label>Won</label>
          </div>
          <div className={styles.stat}>
            <Target size={20} />
            <span>{stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0}%</span>
            <label>Win Rate</label>
          </div>
          <div className={styles.stat}>
            <Flame size={20} />
            <span>{stats.bestStreak}</span>
            <label>Best Streak</label>
          </div>
        </div>

        <div className={styles.categories}>
          <h3>Choose a Category</h3>
          <div className={styles.categoryGrid}>
            {Object.entries(WORD_CATEGORIES).map(([key, cat]) => (
              <button
                key={key}
                className={styles.categoryCard}
                onClick={() => startGame(key)}
              >
                <span className={styles.categoryName}>{cat.name}</span>
                <span className={styles.wordCount}>{cat.words.length} words</span>
              </button>
            ))}
          </div>
        </div>

        {stats.wordsLearned.length > 0 && (
          <div className={styles.learnedSection}>
            <h4>Words Learned: {stats.wordsLearned.length}</h4>
            <div className={styles.learnedWords}>
              {stats.wordsLearned.slice(-10).map(word => (
                <span key={word} className={styles.learnedWord}>{word}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Game screen
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={backToCategories}>
          <ArrowLeft size={20} />
        </button>
        <div className={styles.categoryLabel}>
          {WORD_CATEGORIES[category as keyof typeof WORD_CATEGORIES].name}
        </div>
        <div className={styles.streakBadge}>
          <Flame size={16} />
          <span>{stats.currentStreak}</span>
        </div>
      </div>

      <div className={styles.gameArea}>
        {/* Hangman Drawing */}
        <div className={styles.hangmanContainer}>
          <HangmanCanvas 
            wrongGuesses={errors}
            width={180}
            height={220}
            strokeColor="#e2e8f0"
            lineWidth={5}
          />
          {/* Lives Bar */}
          <div className={styles.livesContainer}>
            <div className={styles.livesBar}>
              {[...Array(MAX_ERRORS)].map((_, i) => (
                <div 
                  key={i} 
                  className={`${styles.lifeSegment} ${i < MAX_ERRORS - errors ? styles.lifeActive : styles.lifeLost}`}
                />
              ))}
            </div>
            <span className={`${styles.livesText} ${errors >= 5 ? styles.livesCritical : ''}`}>
              {MAX_ERRORS - errors} {MAX_ERRORS - errors === 1 ? 'life' : 'lives'} left
            </span>
          </div>
        </div>

        {/* Word Display */}
        <div className={styles.wordDisplay}>
          {renderWord()}
        </div>

        {/* Hint Section */}
        {currentWord && (
          <div className={styles.hintSection}>
            {showHint ? (
              <div className={styles.hintRevealed}>
                <Lightbulb size={16} />
                <span>{currentWord.hint}</span>
              </div>
            ) : (
              <button 
                className={styles.hintButton} 
                onClick={useHint}
                disabled={usedHint || gameStatus !== 'playing'}
              >
                <Lightbulb size={16} />
                Use Hint (-1 life)
              </button>
            )}
          </div>
        )}

        {/* Game Result */}
        {gameStatus !== 'playing' && (
          <div className={`${styles.resultOverlay} ${styles[gameStatus]}`}>
            <div className={styles.resultCard}>
              {gameStatus === 'won' ? (
                <>
                  {/* Confetti Effect */}
                  <div className={styles.confettiContainer}>
                    {[...Array(20)].map((_, i) => (
                      <div key={i} className={styles.confetti} style={{ '--i': i } as React.CSSProperties} />
                    ))}
                  </div>
                  <div className={`${styles.resultIcon} ${styles.victoryPulse}`}>🎉</div>
                  <h2>You Won!</h2>
                  <p className={styles.revealedWord}>{currentWord?.word}</p>
                  <p className={styles.example}>{currentWord?.example.replace('___', currentWord.word)}</p>
                  <div className={styles.streakInfo}>
                    <Flame size={20} />
                    <span>{stats.currentStreak} streak!</span>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.resultIcon}>😵</div>
                  <h2>Game Over</h2>
                  <p>The word was:</p>
                  <p className={styles.revealedWord}>{currentWord?.word}</p>
                  <p className={styles.example}>{currentWord?.example.replace('___', currentWord?.word || '')}</p>
                </>
              )}
              
              <div className={styles.resultActions}>
                <button className={styles.playAgainBtn} onClick={playAgain}>
                  <RefreshCw size={18} />
                  Play Again
                </button>
                <button className={styles.categoriesBtn} onClick={backToCategories}>
                  Categories
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Keyboard */}
        {gameStatus === 'playing' && (
          <div className={styles.keyboard}>
            {ALPHABET.map(letter => {
              const isGuessed = guessedLetters.has(letter);
              const isCorrect = currentWord?.word.includes(letter);
              return (
                <button
                  key={letter}
                  className={`${styles.key} ${isGuessed ? (isCorrect ? styles.correct : styles.wrong) : ''}`}
                  onClick={() => handleGuess(letter)}
                  disabled={isGuessed}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
