'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, ArrowRight, Play, Pause, RotateCcw,
  Volume2, VolumeX, CheckCircle, XCircle, Clock,
  AlertCircle, Loader2, Trophy, Target, Lock
} from 'lucide-react';
import { listeningParts, listeningPassages, ListeningPassage } from '@content/listening-guide';
import { usePlan } from '@/hooks/usePlan';
import styles from '@/styles/ListeningPractice.module.scss';

type Phase = 'intro' | 'listening' | 'questions' | 'results';

export default function ListeningPracticePage() {
  const params = useParams();
  const partId = params?.partId as string;
  const { isPro } = usePlan();
  
  const part = listeningParts.find(p => p.id === partId);
  const passages = listeningPassages.filter(p => 
    part ? p.part === part.part : true
  );
  
  const [currentPassageIndex, setCurrentPassageIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('intro');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<Map<string, { selected: number; correct: boolean }>>(new Map());
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const passage = passages[currentPassageIndex];

  // Generate TTS audio
  const generateAudio = async () => {
    if (!passage) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/listening-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: passage.audioScript,
          passageId: passage.id
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        if (data.code === 'PRO_REQUIRED') {
          setError('This audio requires a Pro subscription to generate. Upgrade to unlock all listening passages.');
        } else {
          throw new Error('Failed to generate audio');
        }
        return;
      }

      const data = await response.json();
      setAudioUrl(data.audioUrl);
    } catch (err) {
      setError('Failed to load audio. Please try again.');
      console.error('Audio generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = async () => {
    if (!audioUrl) {
      await generateAudio();
    }
    setPhase('listening');
  };

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setHasPlayed(true);
  };

  const startQuestions = () => {
    setPhase('questions');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleSelectAnswer = (optionIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(optionIndex);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null || !passage) return;
    
    const question = passage.questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === question.correct;
    const key = `${passage.id}-${question.id}`;
    
    setAnswers(prev => new Map(prev).set(key, { selected: selectedAnswer, correct: isCorrect }));
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (!passage) return;
    
    if (currentQuestionIndex < passage.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setPhase('results');
    }
  };

  const restartPassage = () => {
    setPhase('intro');
    setHasPlayed(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    // Clear answers for this passage
    const newAnswers = new Map(answers);
    passage?.questions.forEach(q => {
      newAnswers.delete(`${passage.id}-${q.id}`);
    });
    setAnswers(newAnswers);
  };

  const getAnswerClass = (optionIndex: number) => {
    if (!showResult) {
      return selectedAnswer === optionIndex ? styles.selected : '';
    }
    
    const question = passage?.questions[currentQuestionIndex];
    if (!question) return '';
    
    if (optionIndex === question.correct) {
      return styles.correct;
    }
    if (optionIndex === selectedAnswer && selectedAnswer !== question.correct) {
      return styles.incorrect;
    }
    return styles.disabled;
  };

  const getPassageScore = () => {
    if (!passage) return { correct: 0, total: 0 };
    let correct = 0;
    passage.questions.forEach(q => {
      const answer = answers.get(`${passage.id}-${q.id}`);
      if (answer?.correct) correct++;
    });
    return { correct, total: passage.questions.length };
  };

  if (!part && !partId) {
    // Show all passages for full practice
  }

  if (passages.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <AlertCircle size={48} />
          <h2>No passages available</h2>
          <Link href="/listening" className={styles.backBtn}>
            <ArrowLeft size={18} /> Back to Listening
          </Link>
        </div>
      </div>
    );
  }

  const question = passage?.questions[currentQuestionIndex];

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/listening" className={styles.backBtn}>
          <ArrowLeft size={18} /> Back
        </Link>
        <div className={styles.headerInfo}>
          {part && <span className={styles.partBadge}>Part {part.part}</span>}
          <h1>{part?.title || 'Listening Practice'}</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Intro Phase */}
        {phase === 'intro' && passage && (
          <div className={styles.introCard}>
            <div className={styles.passageInfo}>
              <span className={styles.passageIcon}>{part?.icon || '🎧'}</span>
              <h2>{passage.title}</h2>
              <p className={styles.context}>{passage.context}</p>
            </div>
            
            <div className={styles.instructions}>
              <h3>Instructions:</h3>
              <ol>
                <li>Click "Play Audio" to listen to the passage</li>
                <li>The audio will play <strong>only once</strong> (like the real test)</li>
                <li>After listening, answer the questions</li>
              </ol>
            </div>

            <div className={styles.introMeta}>
              <span><Target size={16} /> {passage.questions.length} questions</span>
              <span><Clock size={16} /> {part?.duration || '~5 min'}</span>
            </div>

            {error && (
              <div className={styles.errorMsg}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <button 
              onClick={startListening}
              className={styles.startBtn}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className={styles.spinner} />
                  Loading Audio...
                </>
              ) : (
                <>
                  <Volume2 size={20} /> Start Listening
                </>
              )}
            </button>
          </div>
        )}

        {/* Listening Phase */}
        {phase === 'listening' && passage && (
          <div className={styles.listeningCard}>
            <div className={styles.audioSection}>
              <div className={styles.audioVisual}>
                <div className={`${styles.audioWave} ${isPlaying ? styles.playing : ''}`}>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={styles.waveBar} />
                  ))}
                </div>
              </div>

              <h2>{passage.title}</h2>
              <p className={styles.listeningHint}>
                {hasPlayed 
                  ? 'Audio has been played. Click "Answer Questions" when ready.'
                  : 'Listen carefully. The audio plays only once.'}
              </p>

              {audioUrl && (
                <audio 
                  ref={audioRef}
                  src={audioUrl}
                  onEnded={handleAudioEnd}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              )}

              <div className={styles.audioControls}>
                <button 
                  onClick={playAudio}
                  className={styles.playBtn}
                  disabled={hasPlayed || !audioUrl}
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  <span>{isPlaying ? 'Playing...' : hasPlayed ? 'Already Played' : 'Play Audio'}</span>
                </button>
              </div>

              {hasPlayed && (
                <button onClick={startQuestions} className={styles.continueBtn}>
                  Answer Questions <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Questions Phase */}
        {phase === 'questions' && passage && question && (
          <div className={styles.questionCard}>
            <div className={styles.questionProgress}>
              <span>Question {currentQuestionIndex + 1} of {passage.questions.length}</span>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${((currentQuestionIndex + 1) / passage.questions.length) * 100}%` }}
                />
              </div>
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

            {showResult && (
              <div className={`${styles.resultFeedback} ${selectedAnswer === question.correct ? styles.correct : styles.incorrect}`}>
                {selectedAnswer === question.correct ? (
                  <><CheckCircle size={18} /> Correct!</>
                ) : (
                  <><XCircle size={18} /> Incorrect. The correct answer is {String.fromCharCode(65 + question.correct)}.</>
                )}
              </div>
            )}

            <div className={styles.questionActions}>
              {!showResult ? (
                <button 
                  onClick={handleCheckAnswer}
                  className={styles.checkBtn}
                  disabled={selectedAnswer === null}
                >
                  Check Answer
                </button>
              ) : (
                <button onClick={handleNextQuestion} className={styles.nextBtn}>
                  {currentQuestionIndex < passage.questions.length - 1 ? (
                    <>Next Question <ArrowRight size={18} /></>
                  ) : (
                    <>See Results <Trophy size={18} /></>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results Phase */}
        {phase === 'results' && passage && (
          <div className={styles.resultsCard}>
            <div className={styles.resultsIcon}>
              <Trophy size={48} />
            </div>
            
            <h2>Practice Complete!</h2>
            
            <div className={styles.scoreCircle}>
              <span className={styles.scoreValue}>{getPassageScore().correct}</span>
              <span className={styles.scoreMax}>/{getPassageScore().total}</span>
            </div>
            
            <p className={styles.scorePercent}>
              {Math.round((getPassageScore().correct / getPassageScore().total) * 100)}% Correct
            </p>

            <div className={styles.resultsActions}>
              <button onClick={restartPassage} className={styles.retryBtn}>
                <RotateCcw size={18} /> Try Again
              </button>
              <Link href="/listening" className={styles.backToListBtn}>
                Back to Listening
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
