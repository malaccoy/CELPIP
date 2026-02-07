'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trophy, RotateCcw, ChevronRight, Zap, Target, AlertCircle } from 'lucide-react';
import styles from '@/styles/ContractionSpotter.module.scss';
import { contractionChallenges, commonContractions, type ContractionChallenge } from '@content/writing-tools';

type Difficulty = 'easy' | 'medium' | 'hard';

interface WordState {
  word: string;
  isContraction: boolean;
  correction: string;
  found: boolean;
  index: number;
}

export default function ContractionSpotterPage() {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [words, setWords] = useState<WordState[]>([]);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [foundCount, setFoundCount] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showCorrection, setShowCorrection] = useState<{ word: string; correction: string } | null>(null);
  const [wrongClick, setWrongClick] = useState<number | null>(null);

  // Filter challenges by difficulty
  const challengesByDifficulty = useMemo(() => {
    return {
      easy: contractionChallenges.filter(c => c.difficulty === 'easy'),
      medium: contractionChallenges.filter(c => c.difficulty === 'medium'),
      hard: contractionChallenges.filter(c => c.difficulty === 'hard')
    };
  }, []);

  const currentChallenges = difficulty ? challengesByDifficulty[difficulty] : [];
  const currentChallenge = currentChallenges[currentChallengeIndex];
  const totalContractions = currentChallenge?.contractions.length || 0;

  // Initialize words when challenge changes
  useEffect(() => {
    if (currentChallenge) {
      const wordList = currentChallenge.text.split(/\s+/);
      const contractionWords = new Set(currentChallenge.contractions.map(c => c.word.toLowerCase()));
      const contractionMap = new Map(currentChallenge.contractions.map(c => [c.word.toLowerCase(), c.correction]));
      
      const newWords: WordState[] = wordList.map((word, index) => {
        // Clean word for comparison (remove punctuation at end)
        const cleanWord = word.replace(/[.,!?;:]$/, '');
        const isContraction = contractionWords.has(cleanWord.toLowerCase());
        
        return {
          word,
          isContraction,
          correction: isContraction ? (contractionMap.get(cleanWord.toLowerCase()) || '') : '',
          found: false,
          index
        };
      });
      
      setWords(newWords);
      setFoundCount(0);
    }
  }, [currentChallenge]);

  const handleWordClick = (wordState: WordState, index: number) => {
    if (wordState.found) return;

    if (wordState.isContraction) {
      // Correct!
      setWords(prev => prev.map((w, i) => 
        i === index ? { ...w, found: true } : w
      ));
      setScore(prev => prev + (difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20));
      setFoundCount(prev => prev + 1);
      setShowCorrection({ word: wordState.word, correction: wordState.correction });
      
      setTimeout(() => setShowCorrection(null), 2000);

      // Check if all found
      const newFoundCount = foundCount + 1;
      if (newFoundCount >= totalContractions) {
        // Move to next challenge or show results
        setTimeout(() => {
          if (currentChallengeIndex < currentChallenges.length - 1) {
            setCurrentChallengeIndex(prev => prev + 1);
          } else {
            setShowResults(true);
          }
        }, 1500);
      }
    } else {
      // Wrong!
      setMistakes(prev => prev + 1);
      setWrongClick(index);
      setTimeout(() => setWrongClick(null), 500);
    }
  };

  const startGame = (diff: Difficulty) => {
    setDifficulty(diff);
    setCurrentChallengeIndex(0);
    setScore(0);
    setMistakes(0);
    setShowResults(false);
  };

  const resetGame = () => {
    setDifficulty(null);
    setCurrentChallengeIndex(0);
    setScore(0);
    setMistakes(0);
    setShowResults(false);
    setWords([]);
  };

  // Calculate accuracy
  const totalClicks = (foundCount + mistakes) || 1;
  const accuracy = Math.round((foundCount / totalClicks) * 100);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/writing" className={styles.backButton}>
          <ArrowLeft size={20} />
        </Link>
        <div className={styles.headerContent}>
          <h1>Contraction <span>Spotter</span></h1>
          <p>Find and tap all the contractions</p>
        </div>
      </header>

      {!difficulty ? (
        /* Difficulty Selection */
        <div className={styles.difficultySection}>
          <div className={styles.infoBox}>
            <AlertCircle size={20} />
            <p>
              <strong>Remember:</strong> Never use contractions in CELPIP writing! 
              Practice spotting them so you can avoid them in your exam.
            </p>
          </div>

          <h2>Select Difficulty</h2>
          
          <div className={styles.difficultyGrid}>
            <button className={styles.difficultyCard} onClick={() => startGame('easy')}>
              <span className={styles.diffIcon}>🟢</span>
              <div>
                <h3>Easy</h3>
                <p>1-2 contractions per text</p>
              </div>
            </button>
            
            <button className={styles.difficultyCard} onClick={() => startGame('medium')}>
              <span className={styles.diffIcon}>🟡</span>
              <div>
                <h3>Medium</h3>
                <p>3-4 contractions per text</p>
              </div>
            </button>
            
            <button className={styles.difficultyCard} onClick={() => startGame('hard')}>
              <span className={styles.diffIcon}>🔴</span>
              <div>
                <h3>Hard</h3>
                <p>5+ contractions, tricky ones</p>
              </div>
            </button>
          </div>

          {/* Common Contractions Reference */}
          <div className={styles.referenceSection}>
            <h3>Common Contractions to Avoid</h3>
            <div className={styles.contractionGrid}>
              {Object.entries(commonContractions).slice(0, 12).map(([contraction, expansion]) => (
                <div key={contraction} className={styles.contractionItem}>
                  <span className={styles.contraction}>{contraction}</span>
                  <span className={styles.arrow}>→</span>
                  <span className={styles.expansion}>{expansion}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : showResults ? (
        /* Results Screen */
        <div className={styles.resultsSection}>
          <div className={styles.trophy}>
            <Trophy size={64} />
          </div>
          <h2>Round Complete!</h2>
          
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <Zap size={24} />
              <span className={styles.statValue}>{score}</span>
              <span className={styles.statLabel}>Points</span>
            </div>
            <div className={styles.statCard}>
              <Target size={24} />
              <span className={styles.statValue}>{accuracy}%</span>
              <span className={styles.statLabel}>Accuracy</span>
            </div>
          </div>

          <div className={styles.resultMessage}>
            {accuracy >= 90 ? (
              <p>🌟 Excellent! You have a great eye for contractions!</p>
            ) : accuracy >= 70 ? (
              <p>👍 Good job! Keep practicing to improve your accuracy.</p>
            ) : (
              <p>💪 Keep practicing! You'll get better at spotting contractions.</p>
            )}
          </div>

          <div className={styles.resultActions}>
            <button className={styles.playAgainBtn} onClick={() => startGame(difficulty)}>
              <RotateCcw size={18} />
              Play Again
            </button>
            <button className={styles.changeDiffBtn} onClick={resetGame}>
              Change Difficulty
            </button>
          </div>
        </div>
      ) : (
        /* Game Screen */
        <div className={styles.gameSection}>
          {/* Progress */}
          <div className={styles.progressBar}>
            <div className={styles.progressInfo}>
              <span>Challenge {currentChallengeIndex + 1} of {currentChallenges.length}</span>
              <span className={styles.scoreDisplay}>Score: {score}</span>
            </div>
            <div className={styles.progressTrack}>
              <div 
                className={styles.progressFill}
                style={{ width: `${((currentChallengeIndex) / currentChallenges.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Found Counter */}
          <div className={styles.foundCounter}>
            <Target size={18} />
            <span>Found: {foundCount} / {totalContractions}</span>
          </div>

          {/* Text Area */}
          <div className={styles.textArea}>
            <p className={styles.instruction}>Tap each contraction you find:</p>
            <div className={styles.textContent}>
              {words.map((wordState, index) => (
                <button
                  key={index}
                  className={`${styles.word} ${wordState.found ? styles.found : ''} ${wrongClick === index ? styles.wrong : ''}`}
                  onClick={() => handleWordClick(wordState, index)}
                  disabled={wordState.found}
                >
                  {wordState.word}
                </button>
              ))}
            </div>
          </div>

          {/* Correction Popup */}
          {showCorrection && (
            <div className={styles.correctionPopup}>
              <span className={styles.correctionWord}>{showCorrection.word}</span>
              <span className={styles.correctionArrow}>→</span>
              <span className={styles.correctionText}>{showCorrection.correction}</span>
            </div>
          )}

          {/* Mistakes Counter */}
          {mistakes > 0 && (
            <div className={styles.mistakesCounter}>
              Mistakes: {mistakes}
            </div>
          )}
        </div>
      )}

      {/* Bottom Navigation */}
      {!difficulty && (
        <div className={styles.bottomNav}>
          <Link href="/writing/closing-builder" className={styles.navLink}>
            <span>Try Closing Builder</span>
            <ChevronRight size={18} />
          </Link>
        </div>
      )}
    </div>
  );
}
