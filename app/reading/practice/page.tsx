'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, ArrowRight, CheckCircle, XCircle, 
  Clock, Target, RotateCcw, Trophy, BookOpen
} from 'lucide-react';
import { readingPassages, ReadingPassage, ReadingQuestion } from '@content/reading-practice';
import styles from '@/styles/ReadingPractice.module.scss';

const PART_NAMES: Record<number, string> = {
  1: 'Reading Correspondence',
  2: 'Reading to Apply a Diagram',
  3: 'Reading for Information',
  4: 'Reading for Viewpoints',
};

export default function ReadingPracticePage() {
  return (
    <Suspense fallback={<div className={styles.container}><p>Loading...</p></div>}>
      <ReadingPracticeContent />
    </Suspense>
  );
}

function ReadingPracticeContent() {
  const searchParams = useSearchParams();
  const partFilter = searchParams.get('part') ? Number(searchParams.get('part')) : null;

  const filteredPassages = useMemo(() => {
    if (partFilter && partFilter >= 1 && partFilter <= 4) {
      return readingPassages.filter(p => p.part === partFilter);
    }
    return readingPassages;
  }, [partFilter]);

  const [currentPassageIndex, setCurrentPassageIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<Map<string, { selected: number; correct: boolean }>>(new Map());
  const [showPassageList, setShowPassageList] = useState(true);

  const passage = filteredPassages[currentPassageIndex];
  const question = passage?.questions[currentQuestionIndex];
  const totalQuestions = filteredPassages.reduce((sum, p) => sum + p.questions.length, 0);
  const answeredQuestions = answers.size;
  const correctAnswers = Array.from(answers.values()).filter(a => a.correct).length;

  const handleSelectPassage = (index: number) => {
    setCurrentPassageIndex(index);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowPassageList(false);
  };

  const handleSelectAnswer = (optionIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(optionIndex);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === question.correct;
    const key = `${passage.id}-${question.id}`;
    
    setAnswers(prev => new Map(prev).set(key, { selected: selectedAnswer, correct: isCorrect }));
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < passage.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (currentPassageIndex < filteredPassages.length - 1) {
      setCurrentPassageIndex(prev => prev + 1);
      setCurrentQuestionIndex(0);
    }
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (currentPassageIndex > 0) {
      setCurrentPassageIndex(prev => prev - 1);
      setCurrentQuestionIndex(filteredPassages[currentPassageIndex - 1].questions.length - 1);
    }
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleRestart = () => {
    setCurrentPassageIndex(0);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers(new Map());
    setShowPassageList(true);
  };

  const getAnswerClass = (optionIndex: number) => {
    if (!showResult) {
      return selectedAnswer === optionIndex ? styles.selected : '';
    }
    
    if (optionIndex === question.correct) {
      return styles.correct;
    }
    if (optionIndex === selectedAnswer && selectedAnswer !== question.correct) {
      return styles.incorrect;
    }
    return styles.disabled;
  };

  // Passage List View
  if (showPassageList) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/reading" className={styles.backBtn}>
            <ArrowLeft size={18} /> Back to Reading
          </Link>
          <h1>{partFilter ? `Part ${partFilter}: ${PART_NAMES[partFilter]}` : 'Reading Practice'}</h1>
          <p>{partFilter ? `${filteredPassages.length} passages available` : 'Choose a passage to practice'}</p>
        </header>

        <div className={styles.passageList}>
          {filteredPassages.map((p, index) => {
            const passageAnswers = p.questions.filter(q => 
              answers.has(`${p.id}-${q.id}`)
            ).length;
            const passageCorrect = p.questions.filter(q => 
              answers.get(`${p.id}-${q.id}`)?.correct
            ).length;
            
            return (
              <button
                key={p.id}
                className={styles.passageCard}
                onClick={() => handleSelectPassage(index)}
              >
                <div className={styles.passageCardHeader}>
                  <span className={styles.partBadge}>Part {p.part}</span>
                  <span className={styles.passageType}>{p.partName}</span>
                </div>
                <h3>{p.title}</h3>
                <div className={styles.passageCardMeta}>
                  <span><Target size={14} /> {p.questions.length} questions</span>
                  {passageAnswers > 0 && (
                    <span className={styles.progress}>
                      <CheckCircle size={14} /> {passageCorrect}/{passageAnswers} correct
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {answers.size > 0 && (
          <div className={styles.overallProgress}>
            <Trophy size={20} />
            <span>Overall: {correctAnswers}/{answeredQuestions} correct ({Math.round(correctAnswers/answeredQuestions*100)}%)</span>
            <button onClick={handleRestart} className={styles.resetBtn}>
              <RotateCcw size={16} /> Reset All
            </button>
          </div>
        )}
      </div>
    );
  }

  // Practice View
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.practiceHeader}>
        <button onClick={() => setShowPassageList(true)} className={styles.backBtn}>
          <ArrowLeft size={18} /> All Passages
        </button>
        <div className={styles.progressInfo}>
          <span className={styles.partBadge}>Part {passage.part}</span>
          <span>Question {currentQuestionIndex + 1} of {passage.questions.length}</span>
        </div>
      </header>

      <div className={styles.practiceLayout}>
        {/* Passage Panel */}
        <div className={styles.passagePanel}>
          <div className={styles.passageHeader}>
            <BookOpen size={18} />
            <h2>{passage.title}</h2>
          </div>
          {passage.context && (
            <p className={styles.passageContext}>{passage.context}</p>
          )}
          <div className={styles.passageContent}>
            {passage.content.split('\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Question Panel */}
        <div className={styles.questionPanel}>
          <div className={styles.questionNumber}>
            Question {currentQuestionIndex + 1}
          </div>
          <h3 className={styles.questionText}>{question.question}</h3>

          <div className={styles.options}>
            {question.options.map((option, idx) => (
              <button
                key={idx}
                className={`${styles.option} ${getAnswerClass(idx)}`}
                onClick={() => handleSelectAnswer(idx)}
                disabled={showResult}
              >
                <span className={styles.optionLetter}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className={styles.optionText}>{option}</span>
                {showResult && idx === question.correct && (
                  <CheckCircle size={18} className={styles.correctIcon} />
                )}
                {showResult && idx === selectedAnswer && idx !== question.correct && (
                  <XCircle size={18} className={styles.incorrectIcon} />
                )}
              </button>
            ))}
          </div>

          {/* Explanation */}
          {showResult && (
            <div className={`${styles.explanation} ${selectedAnswer === question.correct ? styles.correct : styles.incorrect}`}>
              <div className={styles.explanationHeader}>
                {selectedAnswer === question.correct ? (
                  <><CheckCircle size={18} /> Correct!</>
                ) : (
                  <><XCircle size={18} /> Incorrect</>
                )}
              </div>
              <p>{question.explanation}</p>
            </div>
          )}

          {/* Actions */}
          <div className={styles.actions}>
            <button 
              onClick={handlePrevQuestion}
              className={styles.navBtn}
              disabled={currentPassageIndex === 0 && currentQuestionIndex === 0}
            >
              <ArrowLeft size={18} /> Previous
            </button>

            {!showResult ? (
              <button 
                onClick={handleCheckAnswer}
                className={styles.checkBtn}
                disabled={selectedAnswer === null}
              >
                Check Answer
              </button>
            ) : (
              <button 
                onClick={handleNextQuestion}
                className={styles.nextBtn}
                disabled={
                  currentPassageIndex === filteredPassages.length - 1 && 
                  currentQuestionIndex === passage.questions.length - 1
                }
              >
                Next <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
