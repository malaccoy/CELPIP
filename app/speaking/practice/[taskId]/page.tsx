'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Mic, MicOff, Play, Pause, RotateCcw,
  Clock, CheckCircle, Loader2, AlertCircle, Sparkles,
  ThumbsUp, AlertTriangle, Target, Volume2
} from 'lucide-react';
import { speakingTasks, getRandomPrompt, SpeakingPrompt } from '@content/speaking-guide';
import styles from '@/styles/SpeakingPractice.module.scss';

type Phase = 'intro' | 'prep' | 'recording' | 'review' | 'feedback';

interface AIFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  transcript: string;
  detailedFeedback: {
    content: { score: number; comment: string };
    vocabulary: { score: number; comment: string };
    fluency: { score: number; comment: string };
    structure: { score: number; comment: string };
  };
  overallComment: string;
}

export default function SpeakingPracticePage() {
  const params = useParams();
  const taskId = params?.taskId as string;
  
  const task = speakingTasks.find(t => t.id === taskId);
  const [currentPrompt, setCurrentPrompt] = useState<SpeakingPrompt | null>(null);
  
  const [phase, setPhase] = useState<Phase>('intro');
  const [prepTimeLeft, setPrepTimeLeft] = useState(0);
  const [speakTimeLeft, setSpeakTimeLeft] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speakTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize prompt
  useEffect(() => {
    if (task) {
      const prompt = getRandomPrompt(task.id);
      setCurrentPrompt(prompt || null);
      setPrepTimeLeft(task.prepTime);
      setSpeakTimeLeft(task.speakTime);
    }
  }, [task]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (prepTimerRef.current) clearInterval(prepTimerRef.current);
      if (speakTimerRef.current) clearInterval(speakTimerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startPrep = () => {
    setPhase('prep');
    setPrepTimeLeft(task!.prepTime);
    
    prepTimerRef.current = setInterval(() => {
      setPrepTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(prepTimerRef.current!);
          startRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setPhase('recording');
      setSpeakTimeLeft(task!.speakTime);

      speakTimerRef.current = setInterval(() => {
        setSpeakTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(speakTimerRef.current!);
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError('Could not access microphone. Please allow microphone access.');
      console.error('Microphone error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (speakTimerRef.current) clearInterval(speakTimerRef.current);
      setPhase('review');
    }
  };

  const playAudio = () => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const analyzeRecording = async () => {
    if (!audioBlob) return;
    
    setIsAnalyzing(true);
    setError(null);
    setPhase('feedback');

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('taskType', task!.id);
      formData.append('taskPart', task!.part.toString());
      formData.append('prompt', currentPrompt?.prompt || '');

      const response = await fetch('/api/speaking-feedback', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze recording');
      }

      const data = await response.json();
      setFeedback(data);
    } catch (err) {
      setError('Failed to analyze your recording. Please try again.');
      console.error('Analysis error:', err);
      setPhase('review');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const restart = () => {
    if (prepTimerRef.current) clearInterval(prepTimerRef.current);
    if (speakTimerRef.current) clearInterval(speakTimerRef.current);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    
    setPhase('intro');
    setAudioBlob(null);
    setAudioUrl(null);
    setFeedback(null);
    setError(null);
    setPrepTimeLeft(task?.prepTime || 0);
    setSpeakTimeLeft(task?.speakTime || 0);
    
    const prompt = getRandomPrompt(task!.id);
    setCurrentPrompt(prompt || null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 10) return '#4ade80';
    if (score >= 7) return '#fbbf24';
    return '#f87171';
  };

  if (!task) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <AlertCircle size={48} />
          <h2>Task not found</h2>
          <Link href="/speaking" className={styles.backBtn}>
            <ArrowLeft size={18} /> Back to Speaking
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/speaking" className={styles.backBtn}>
          <ArrowLeft size={18} /> Back
        </Link>
        <div className={styles.headerInfo}>
          <span className={styles.partBadge}>Part {task.part}</span>
          <h1>{task.title}</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Prompt Card */}
        <div className={styles.promptCard}>
          <div className={styles.promptHeader}>
            <span className={styles.promptIcon}>{task.icon}</span>
            <h2>Your Task</h2>
          </div>
          
          {currentPrompt && (
            <div className={styles.promptContent}>
              <p className={styles.scenario}>{currentPrompt.scenario}</p>
              <p className={styles.prompt}>{currentPrompt.prompt}</p>
              
              {currentPrompt.bulletPoints && (
                <div className={styles.bulletPoints}>
                  <span>Consider these points:</span>
                  <ul>
                    {currentPrompt.bulletPoints.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {currentPrompt.context && (
                <p className={styles.context}>{currentPrompt.context}</p>
              )}
            </div>
          )}
        </div>

        {/* Control Panel */}
        <div className={styles.controlPanel}>
          {/* Intro Phase */}
          {phase === 'intro' && (
            <div className={styles.introPhase}>
              <div className={styles.timeInfo}>
                <div className={styles.timeBlock}>
                  <Clock size={20} />
                  <span>Preparation: {task.prepTime}s</span>
                </div>
                <div className={styles.timeBlock}>
                  <Mic size={20} />
                  <span>Speaking: {task.speakTime}s</span>
                </div>
              </div>
              <button onClick={startPrep} className={styles.startBtn}>
                <Play size={20} /> Start Practice
              </button>
            </div>
          )}

          {/* Prep Phase */}
          {phase === 'prep' && (
            <div className={styles.prepPhase}>
              <div className={styles.timerCircle}>
                <span className={styles.timerLabel}>PREPARATION</span>
                <span className={styles.timerValue}>{formatTime(prepTimeLeft)}</span>
              </div>
              <p className={styles.phaseHint}>
                Read the prompt and prepare your response. Recording will start automatically.
              </p>
              <button onClick={startRecording} className={styles.skipBtn}>
                Skip to Recording
              </button>
            </div>
          )}

          {/* Recording Phase */}
          {phase === 'recording' && (
            <div className={styles.recordingPhase}>
              <div className={`${styles.timerCircle} ${styles.recording}`}>
                <div className={styles.recordingIndicator}>
                  <Mic size={24} />
                  <span className={styles.recordingDot} />
                </div>
                <span className={styles.timerValue}>{formatTime(speakTimeLeft)}</span>
              </div>
              <p className={styles.phaseHint}>
                Speak clearly into your microphone. Recording will stop automatically.
              </p>
              <button onClick={stopRecording} className={styles.stopBtn}>
                <MicOff size={20} /> Stop Recording
              </button>
            </div>
          )}

          {/* Review Phase */}
          {phase === 'review' && (
            <div className={styles.reviewPhase}>
              <div className={styles.audioPlayer}>
                <button onClick={playAudio} className={styles.playBtn}>
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <span>Listen to your recording</span>
                <audio 
                  ref={audioRef} 
                  src={audioUrl || ''} 
                  onEnded={() => setIsPlaying(false)} 
                />
              </div>
              
              {error && (
                <div className={styles.errorMsg}>
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}
              
              <div className={styles.reviewActions}>
                <button onClick={restart} className={styles.retryBtn}>
                  <RotateCcw size={18} /> Try Again
                </button>
                <button onClick={analyzeRecording} className={styles.analyzeBtn}>
                  <Sparkles size={18} /> Get AI Feedback
                </button>
              </div>
            </div>
          )}

          {/* Feedback Phase */}
          {phase === 'feedback' && (
            <div className={styles.feedbackPhase}>
              {isAnalyzing ? (
                <div className={styles.analyzing}>
                  <Loader2 size={32} className={styles.spinner} />
                  <span>Analyzing your response...</span>
                  <p>Transcribing audio and evaluating your speaking...</p>
                </div>
              ) : feedback ? (
                <div className={styles.feedbackContent}>
                  {/* Score */}
                  <div className={styles.scoreSection}>
                    <div 
                      className={styles.scoreCircle}
                      style={{ borderColor: getScoreColor(feedback.score) }}
                    >
                      <span 
                        className={styles.scoreValue}
                        style={{ color: getScoreColor(feedback.score) }}
                      >
                        {feedback.score}
                      </span>
                      <span className={styles.scoreMax}>/12</span>
                    </div>
                    <p className={styles.overallComment}>{feedback.overallComment}</p>
                  </div>

                  {/* Transcript */}
                  <div className={styles.transcriptSection}>
                    <h4><Volume2 size={16} /> Your Response (Transcript)</h4>
                    <p>{feedback.transcript}</p>
                  </div>

                  {/* Detailed Scores */}
                  <div className={styles.detailedScores}>
                    {Object.entries(feedback.detailedFeedback).map(([key, value]) => (
                      <div key={key} className={styles.scoreItem}>
                        <div className={styles.scoreItemHeader}>
                          <span className={styles.scoreItemName}>
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </span>
                          <span 
                            className={styles.scoreItemValue}
                            style={{ color: getScoreColor(value.score) }}
                          >
                            {value.score}/12
                          </span>
                        </div>
                        <p className={styles.scoreItemComment}>{value.comment}</p>
                      </div>
                    ))}
                  </div>

                  {/* Strengths & Improvements */}
                  <div className={styles.feedbackColumns}>
                    <div className={styles.strengthsColumn}>
                      <h4><ThumbsUp size={16} /> Strengths</h4>
                      <ul>
                        {feedback.strengths.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className={styles.improvementsColumn}>
                      <h4><Target size={16} /> To Improve</h4>
                      <ul>
                        {feedback.improvements.map((i, idx) => (
                          <li key={idx}>{i}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className={styles.feedbackActions}>
                    <button onClick={playAudio} className={styles.listenBtn}>
                      <Volume2 size={18} /> Listen Again
                    </button>
                    <button onClick={restart} className={styles.tryAgainBtn}>
                      <RotateCcw size={18} /> Try Another Prompt
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Tips Sidebar */}
      <aside className={styles.tipsSidebar}>
        <h3>💡 Tips for Part {task.part}</h3>
        <ul>
          {task.tips.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
