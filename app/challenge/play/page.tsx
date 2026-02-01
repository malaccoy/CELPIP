'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Send, RefreshCw } from 'lucide-react';
import { getTodayChallenge, getTodaySubmission, saveTodaySubmission, getTodayLeaderboard, DailyChallenge, ChallengeSubmission, DailyLeaderboardEntry } from '@/components/DailyChallenge';
import { generateTask1Feedback, generateTask2Feedback, countWords, calculateScore } from '@/utils/feedback';
import { recordPractice } from '@/components/DetailedStats';
import { recordErrors } from '@/components/ErrorReview';
import { recordPracticeForAchievements, getUnseenAchievements, markAchievementSeen, ACHIEVEMENTS, Achievement } from '@/components/Achievements';
import { AchievementToast } from '@/components/Achievements';
import { FeedbackItem } from '@/types';
import styles from '@/styles/ChallengePlay.module.scss';

export default function ChallengePlayPage() {
  const router = useRouter();
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [existingSubmission, setExistingSubmission] = useState<ChallengeSubmission | null>(null);
  const [leaderboard, setLeaderboard] = useState<DailyLeaderboardEntry[]>([]);
  const [content, setContent] = useState('');
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<ChallengeSubmission | null>(null);
  const [mounted, setMounted] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  
  // Timer
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const wordCount = countWords(content);

  useEffect(() => {
    setMounted(true);
    const todayChallenge = getTodayChallenge();
    setChallenge(todayChallenge);
    
    const existing = getTodaySubmission();
    if (existing) {
      setExistingSubmission(existing);
      setLeaderboard(getTodayLeaderboard());
    }
  }, []);

  // Start timer when user starts typing
  useEffect(() => {
    if (content.length > 0 && !isTimerRunning && !isSubmitted && !existingSubmission) {
      setIsTimerRunning(true);
      startTimeRef.current = Date.now();
    }
  }, [content, isTimerRunning, isSubmitted, existingSubmission]);

  // Timer tick
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          setTimeElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    if (!challenge || wordCount < 50) return;
    
    // Stop timer
    setIsTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Generate feedback based on task type
    const state = challenge.task === 'task1' 
      ? { content, formality: 'Formal' as const }
      : { content };
    
    const results = challenge.task === 'task1'
      ? generateTask1Feedback(state as any)
      : generateTask2Feedback(state as any);
    
    setFeedback(results);
    
    // Calculate score
    const score = calculateScore(results, wordCount);
    
    // Create submission
    const submission: ChallengeSubmission = {
      date: challenge.date,
      completedAt: new Date().toISOString(),
      wordCount,
      score,
      timeSeconds: timeElapsed,
    };
    
    // Save submission
    saveTodaySubmission(submission);
    setSubmissionResult(submission);
    setIsSubmitted(true);
    
    // Record to stats
    recordPractice(challenge.task, wordCount, score, Math.ceil(timeElapsed / 60));
    
    // Record errors
    const failedIds = results.filter(r => !r.passed).map(r => r.id);
    if (failedIds.length > 0) {
      recordErrors(failedIds);
    }
    
    // Record achievements (isChallenge = true)
    const newlyUnlocked = recordPracticeForAchievements(
      challenge.task,
      wordCount,
      score,
      Math.ceil(timeElapsed / 60),
      true // This is a challenge
    );
    
    // Show achievement toast if unlocked
    if (newlyUnlocked.length > 0) {
      const achievement = ACHIEVEMENTS.find(a => a.id === newlyUnlocked[0]);
      if (achievement) {
        setNewAchievement(achievement);
      }
    }
    
    // Refresh leaderboard
    setTimeout(() => {
      setLeaderboard(getTodayLeaderboard());
    }, 100);
  };

  if (!mounted || !challenge) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Carregando desafio...</p>
      </div>
    );
  }

  // Already completed today
  if (existingSubmission && !isSubmitted) {
    return (
      <div className={styles.container}>
        <div className={styles.alreadyCompleted}>
          <div className={styles.completedIcon}>✅</div>
          <h2>Desafio de Hoje Completo!</h2>
          <p>Você já completou o desafio diário. Volte amanhã para um novo!</p>
          
          <div className={styles.resultCard}>
            <div className={styles.resultStats}>
              <div className={styles.resultStat}>
                <span className={styles.resultValue}>{existingSubmission.score}</span>
                <span className={styles.resultLabel}>Pontuação</span>
              </div>
              <div className={styles.resultStat}>
                <span className={styles.resultValue}>{existingSubmission.wordCount}</span>
                <span className={styles.resultLabel}>Palavras</span>
              </div>
              <div className={styles.resultStat}>
                <span className={styles.resultValue}>{formatTime(existingSubmission.timeSeconds)}</span>
                <span className={styles.resultLabel}>Tempo</span>
              </div>
            </div>
          </div>

          {leaderboard.length > 0 && (
            <div className={styles.leaderboard}>
              <h4>🏆 Ranking do Dia</h4>
              <div className={styles.leaderboardList}>
                {leaderboard.slice(0, 5).map((entry) => (
                  <div 
                    key={entry.rank} 
                    className={`${styles.leaderboardEntry} ${entry.isYou ? styles.isYou : ''}`}
                  >
                    <span className={styles.rank}>
                      {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                    </span>
                    <span className={styles.name}>{entry.name}</span>
                    <span className={styles.score}>{entry.score}/12</span>
                    <span className={styles.time}>{formatTime(entry.timeSeconds)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <button className={styles.backButton} onClick={() => router.push('/dashboard')}>
              <ArrowLeft size={18} />
              Voltar ao Dashboard
            </button>
            <button className={styles.practiceButton} onClick={() => router.push(`/task-${challenge.task.replace('task', '')}`)}>
              Praticar Mais
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Submission result
  if (isSubmitted && submissionResult) {
    return (
      <div className={styles.container}>
        <div className={styles.submissionComplete}>
          <div className={styles.confetti}>🎉</div>
          <h2>Desafio Completo!</h2>
          
          <div className={styles.resultCard}>
            <div className={styles.resultStats}>
              <div className={styles.resultStat}>
                <span className={styles.resultValue}>{submissionResult.score}</span>
                <span className={styles.resultLabel}>Pontuação</span>
              </div>
              <div className={styles.resultStat}>
                <span className={styles.resultValue}>{submissionResult.wordCount}</span>
                <span className={styles.resultLabel}>Palavras</span>
              </div>
              <div className={styles.resultStat}>
                <span className={styles.resultValue}>{formatTime(submissionResult.timeSeconds)}</span>
                <span className={styles.resultLabel}>Tempo</span>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div className={styles.feedbackSection}>
            <h4>📝 Feedback</h4>
            <div className={styles.feedbackList}>
              {feedback.map((item) => (
                <div 
                  key={item.id} 
                  className={`${styles.feedbackItem} ${item.passed ? styles.passed : styles.failed}`}
                >
                  <span className={styles.feedbackIcon}>{item.passed ? '✓' : '✗'}</span>
                  <span>{item.message}</span>
                </div>
              ))}
            </div>
          </div>

          {leaderboard.length > 0 && (
            <div className={styles.leaderboard}>
              <h4>🏆 Ranking do Dia</h4>
              <div className={styles.leaderboardList}>
                {leaderboard.slice(0, 5).map((entry) => (
                  <div 
                    key={entry.rank} 
                    className={`${styles.leaderboardEntry} ${entry.isYou ? styles.isYou : ''}`}
                  >
                    <span className={styles.rank}>
                      {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                    </span>
                    <span className={styles.name}>{entry.name}</span>
                    <span className={styles.score}>{entry.score}/12</span>
                    <span className={styles.time}>{formatTime(entry.timeSeconds)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <button className={styles.backButton} onClick={() => router.push('/dashboard')}>
              <ArrowLeft size={18} />
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Challenge writing mode
  return (
    <div className={styles.container}>
      {/* Achievement Toast */}
      {newAchievement && (
        <AchievementToast 
          achievement={newAchievement} 
          onClose={() => {
            markAchievementSeen(newAchievement.id);
            setNewAchievement(null);
          }} 
        />
      )}

      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.push('/challenge')}>
          <ArrowLeft size={20} />
        </button>
        <div className={styles.headerCenter}>
          <span className={styles.challengeBadge}>🔥 Desafio Diário</span>
          <span className={styles.taskBadge}>
            {challenge.task === 'task1' ? '✉️ Task 1' : '📋 Task 2'}
          </span>
        </div>
        <div className={styles.timer}>
          <Clock size={18} />
          <span>{formatTime(timeElapsed)}</span>
        </div>
      </div>

      {/* Prompt Card */}
      <div className={styles.promptCard}>
        <h2 className={styles.promptTitle}>{challenge.prompt.title}</h2>
        
        <div className={styles.situation}>
          <strong>Situação:</strong>
          <p>{challenge.prompt.situation}</p>
        </div>

        <div className={styles.instructions}>
          <strong>Seu texto deve:</strong>
          <ul>
            {challenge.prompt.instructions.map((inst, i) => (
              <li key={i}>{inst}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Writing Area */}
      <div className={styles.writingArea}>
        <div className={styles.writingHeader}>
          <span>Seu Texto</span>
          <div className={styles.wordCount}>
            <span className={wordCount >= 150 && wordCount <= 200 ? styles.ideal : wordCount < 150 ? styles.low : styles.high}>
              {wordCount}
            </span>
            <span className={styles.wordTarget}>/ 150-200 palavras</span>
          </div>
        </div>
        
        <textarea
          className={styles.textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={challenge.task === 'task1' 
            ? "Dear ...\n\nComece seu email aqui..." 
            : "In my opinion...\n\nComece sua resposta aqui..."}
          autoFocus
        />
      </div>

      {/* Submit Button */}
      <div className={styles.submitArea}>
        <button 
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={wordCount < 50}
        >
          <Send size={20} />
          Enviar Desafio
        </button>
        {wordCount < 50 && (
          <p className={styles.minWords}>Mínimo de 50 palavras para enviar</p>
        )}
      </div>
    </div>
  );
}
