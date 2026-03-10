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
import { FREE_LIMITS } from '@/lib/free-limits';
import { analytics } from '@/lib/analytics';
import ExerciseGate, { markExerciseDone } from '@/components/ExerciseGate';
import styles from '@/styles/ListeningPractice.module.scss';

type Phase = 'intro' | 'listening' | 'questions' | 'results';

export default function ListeningPracticePage() {
  const params = useParams();
  const partId = params?.partId as string;
  const { isPro } = usePlan();
  
  const part = listeningParts.find(p => p.id === partId);

  useEffect(() => {
    if (partId) analytics.exerciseStart('listening', partId);
  }, [partId]);

  const allPassages = listeningPassages.filter(p => 
    part ? p.part === part.part : true
  );
  
  const passages = isPro ? allPassages : allPassages.slice(0, FREE_LIMITS.listening.perPart);
  
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

  // Clip-based state (for Part 1)
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  const [clipQuestionIndex, setClipQuestionIndex] = useState(0);

  // Verbal question narration (Parts 1-3)
  const isVerbal = !!(part?.verbal);
  const [verbalPlayed, setVerbalPlayed] = useState(false);

  useEffect(() => {
    if (phase !== 'questions' || !isVerbal || !question) return;
    setVerbalPlayed(false);
    
    // Use Web Speech API to narrate question + options
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const letters = ['A', 'B', 'C', 'D'];
      const text = `${question.question} ... ${question.options.map((opt, i) => `${letters[i]}: ${opt}`).join(' ... ')}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.onend = () => setVerbalPlayed(true);
      // Small delay so UI renders first
      setTimeout(() => window.speechSynthesis.speak(utterance), 300);
    } else {
      setVerbalPlayed(true); // fallback: show text immediately
    }
    
    return () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentQuestionIndex, clipQuestionIndex, currentClipIndex, isVerbal]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const passage = passages[currentPassageIndex];

  // Check if this passage uses clips
  const hasClips = !!(passage?.clips && passage.clips.length > 0);
  const currentClip = hasClips ? passage!.clips![currentClipIndex] : null;

  // Get all questions (flat list or from clips)
  const getAllQuestions = () => {
    if (!passage) return [];
    if (hasClips) {
      return passage.clips!.flatMap(c => c.questions);
    }
    return passage.questions;
  };

  // Get current clip's questions
  const getClipQuestions = () => {
    if (!currentClip) return [];
    return currentClip.questions;
  };

  // Generate TTS audio (for single-clip passages)
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
      setAudioUrl(data.audioUrl + '?v=' + Date.now());
    } catch (err) {
      setError('Failed to load audio. Please try again.');
      console.error('Audio generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load clip audio (pre-generated static files)
  const loadClipAudio = (clipIdx: number) => {
    if (!passage) return;
    const url = `/audio/listening/${passage.id}-clip${clipIdx + 1}.mp3?v=1`;
    setAudioUrl(url);
    setHasPlayed(false);
    setIsPlaying(false);
  };

  const startListening = async () => {
    if (hasClips) {
      loadClipAudio(0);
      setCurrentClipIndex(0);
      setClipQuestionIndex(0);
    } else if (passage) {
      // Try pre-generated static audio first
      const staticUrl = `/audio/listening/${passage.id}.mp3?v=1`;
      setAudioUrl(staticUrl);
    }
    setPhase('listening');
  };

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.load();
        audioRef.current.play().catch(err => {
          console.error('Play error:', err);
          setError('Could not play audio. Try again.');
        });
      }
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setHasPlayed(true);
  };

  const startQuestions = () => {
    setPhase('questions');
    if (hasClips) {
      setClipQuestionIndex(0);
    } else {
      setCurrentQuestionIndex(0);
    }
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleSelectAnswer = (optionIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(optionIndex);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null || !passage) return;
    
    let question;
    if (hasClips) {
      question = getClipQuestions()[clipQuestionIndex];
    } else {
      question = passage.questions[currentQuestionIndex];
    }
    if (!question) return;
    
    const isCorrect = selectedAnswer === question.correct;
    const key = `${passage.id}-${question.id}`;
    
    setAnswers(prev => new Map(prev).set(key, { selected: selectedAnswer, correct: isCorrect }));
    setShowResult(true);

    // Log activity for leaderboard
    fetch('/api/log-activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'listening', count: 1 }),
    }).catch(() => {});
  };

  const handleNextQuestion = () => {
    if (!passage) return;
    
    if (hasClips) {
      const clipQs = getClipQuestions();
      if (clipQuestionIndex < clipQs.length - 1) {
        // Next question in same clip
        setClipQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else if (currentClipIndex < passage.clips!.length - 1) {
        // Move to next clip
        const nextClip = currentClipIndex + 1;
        setCurrentClipIndex(nextClip);
        setClipQuestionIndex(0);
        setSelectedAnswer(null);
        setShowResult(false);
        loadClipAudio(nextClip);
        setPhase('listening');
      } else {
        // All clips done
        setPhase('results');
        markExerciseDone();
      }
    } else {
      if (currentQuestionIndex < passage.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setPhase('results');
        markExerciseDone();
      }
    }
  };

  const restartPassage = () => {
    setPhase('intro');
    setHasPlayed(false);
    setCurrentQuestionIndex(0);
    setCurrentClipIndex(0);
    setClipQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAudioUrl(null);
    const newAnswers = new Map(answers);
    const allQs = getAllQuestions();
    allQs.forEach(q => {
      newAnswers.delete(`${passage?.id}-${q.id}`);
    });
    setAnswers(newAnswers);
  };

  const getAnswerClass = (optionIndex: number) => {
    if (!showResult) {
      return selectedAnswer === optionIndex ? styles.selected : '';
    }
    
    let question;
    if (hasClips) {
      question = getClipQuestions()[clipQuestionIndex];
    } else {
      question = passage?.questions[currentQuestionIndex];
    }
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
    const allQs = getAllQuestions();
    let correct = 0;
    allQs.forEach(q => {
      const answer = answers.get(`${passage.id}-${q.id}`);
      if (answer?.correct) correct++;
    });
    return { correct, total: allQs.length };
  };

  // Current question (works for both clip and non-clip modes)
  const question = hasClips 
    ? getClipQuestions()[clipQuestionIndex] 
    : passage?.questions[currentQuestionIndex];

  // Total questions for progress calculation
  const totalQuestions = getAllQuestions().length;
  const answeredSoFar = hasClips
    ? passage?.clips!.slice(0, currentClipIndex).reduce((sum, c) => sum + c.questions.length, 0)! + clipQuestionIndex + 1
    : currentQuestionIndex + 1;

  // Is this the last question overall?
  const isLastQuestion = hasClips
    ? (currentClipIndex === (passage?.clips?.length || 1) - 1 && clipQuestionIndex === getClipQuestions().length - 1)
    : (currentQuestionIndex === (passage?.questions.length || 1) - 1);

  // Is this the last question in the current clip (but not the last clip)?
  const isLastClipQuestion = hasClips && clipQuestionIndex === getClipQuestions().length - 1 && currentClipIndex < (passage?.clips?.length || 1) - 1;

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

  return (
    <div className={styles.container}>
      <ExerciseGate section="Listening" />
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
              {hasClips ? (
                <ol>
                  <li>You will hear <strong>{passage.clips!.length} audio clips</strong></li>
                  <li>After each clip, answer 2–3 questions about what you heard</li>
                  <li>Each clip plays <strong>only once</strong> (like the real CELPIP test)</li>
                  <li>Listen carefully — the audio will not repeat</li>
                </ol>
              ) : (
                <ol>
                  <li>Click &quot;Play Audio&quot; to listen to the passage</li>
                  <li>The audio will play <strong>only once</strong> (like the real test)</li>
                  <li>After listening, answer the questions</li>
                </ol>
              )}
            </div>

            <div className={styles.introMeta}>
              <span><Target size={16} /> {totalQuestions} questions</span>
              <span><Clock size={16} /> {part?.duration || '~5 min'}</span>
              {hasClips && <span>🎧 {passage.clips!.length} clips</span>}
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
              {hasClips && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.3rem 0.8rem',
                  background: 'rgba(99, 102, 241, 0.15)',
                  borderRadius: '999px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#6366f1',
                  marginBottom: '0.5rem'
                }}>
                  🎧 Clip {currentClipIndex + 1} of {passage.clips!.length}
                </div>
              )}
              <p className={styles.listeningHint}>
                {hasPlayed 
                  ? 'Audio has been played. Click "Answer Questions" when ready.'
                  : 'Listen carefully. The audio plays only once.'}
              </p>

              {audioUrl && (
                <audio 
                  ref={audioRef}
                  src={audioUrl}
                  preload="auto"
                  playsInline
                  onEnded={handleAudioEnd}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onCanPlay={() => setIsLoading(false)}
                  onError={() => {
                    // Fallback to API-generated audio if static file missing
                    if (audioUrl && !audioUrl.includes('/api/')) {
                      generateAudio();
                    }
                  }}
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
              <span>Question {answeredSoFar} of {totalQuestions}</span>
              {hasClips && (
                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}> (Clip {currentClipIndex + 1})</span>
              )}
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${(answeredSoFar / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            <h3 className={styles.questionText}>
              {isVerbal && !verbalPlayed && !showResult ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Volume2 size={20} style={{ animation: 'pulse 1s infinite' }} />
                  Listen to the question...
                </span>
              ) : question.question}
            </h3>

            <div className={styles.options}>
              {question.options.map((option, idx) => (
                <button
                  key={idx}
                  className={`${styles.option} ${getAnswerClass(idx)}`}
                  onClick={() => handleSelectAnswer(idx)}
                  disabled={showResult || (isVerbal && !verbalPlayed)}
                >
                  <span className={styles.optionLetter}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className={styles.optionText}>
                    {isVerbal && !showResult ? '' : option}
                  </span>
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
                  {isLastQuestion ? (
                    <>See Results <Trophy size={18} /></>
                  ) : isLastClipQuestion ? (
                    <>Next Clip 🎧 <ArrowRight size={18} /></>
                  ) : (
                    <>Next Question <ArrowRight size={18} /></>
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
