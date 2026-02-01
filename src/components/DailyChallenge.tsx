'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/DailyChallenge.module.scss';

// Daily challenge data
export interface DailyChallenge {
  date: string; // YYYY-MM-DD
  task: 'task1' | 'task2';
  promptId: string;
  prompt: {
    title: string;
    situation: string;
    instructions: string[];
  };
}

export interface ChallengeSubmission {
  date: string;
  completedAt: string;
  wordCount: number;
  score: number;
  timeSeconds: number;
}

export interface DailyLeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  wordCount: number;
  timeSeconds: number;
  isYou?: boolean;
}

// Seeded random for consistent daily prompts
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getDateSeed(dateStr: string): number {
  const [year, month, day] = dateStr.split('-').map(Number);
  return year * 10000 + month * 100 + day;
}

// Task 1 prompts pool
const TASK1_PROMPTS = [
  {
    id: 't1_neighbor_noise',
    title: 'Reclamação ao Vizinho',
    situation: 'Your neighbor has been playing loud music late at night for the past week.',
    instructions: [
      'Explain the problem',
      'Describe how it affects you',
      'Suggest a solution',
    ],
  },
  {
    id: 't1_gym_cancel',
    title: 'Cancelamento de Academia',
    situation: 'You want to cancel your gym membership but the company is making it difficult.',
    instructions: [
      'State your request clearly',
      'Explain why you want to cancel',
      'Request confirmation of cancellation',
    ],
  },
  {
    id: 't1_job_application',
    title: 'Candidatura a Emprego',
    situation: 'You saw a job posting for your dream position at a local company.',
    instructions: [
      'Introduce yourself and your qualifications',
      'Explain why you are interested in this position',
      'Request an interview',
    ],
  },
  {
    id: 't1_landlord_repair',
    title: 'Pedido de Reparo',
    situation: 'The heating system in your apartment has been broken for two weeks.',
    instructions: [
      'Describe the problem in detail',
      'Explain the urgency of the repair',
      'Request immediate action',
    ],
  },
  {
    id: 't1_thank_coworker',
    title: 'Agradecimento a Colega',
    situation: 'A coworker helped you complete an important project while you were sick.',
    instructions: [
      'Express your gratitude',
      'Mention specifically what they did',
      'Offer to return the favor',
    ],
  },
  {
    id: 't1_restaurant_complaint',
    title: 'Reclamação de Restaurante',
    situation: 'You had a terrible dining experience at a restaurant last weekend.',
    instructions: [
      'Describe what happened',
      'Explain how it affected your experience',
      'State what you expect as compensation',
    ],
  },
  {
    id: 't1_school_absence',
    title: 'Justificativa de Ausência',
    situation: 'Your child will miss school next week for a family trip.',
    instructions: [
      'Inform about the absence dates',
      'Explain the reason',
      'Ask about makeup work',
    ],
  },
];

// Task 2 prompts pool
const TASK2_PROMPTS = [
  {
    id: 't2_remote_work',
    title: 'Trabalho Remoto',
    situation: 'Your company is surveying employees about permanent remote work options.',
    instructions: [
      'State your opinion clearly',
      'Give two reasons with examples',
      'Conclude with a recommendation',
    ],
  },
  {
    id: 't2_public_transport',
    title: 'Transporte Público Gratuito',
    situation: 'The city is considering making public transportation free for all residents.',
    instructions: [
      'State whether you support or oppose this',
      'Provide reasons for your position',
      'Address potential counterarguments',
    ],
  },
  {
    id: 't2_social_media_age',
    title: 'Idade Mínima para Redes Sociais',
    situation: 'A new law proposes raising the minimum age for social media to 16.',
    instructions: [
      'Share your opinion on this proposal',
      'Explain the benefits or drawbacks',
      'Suggest any modifications',
    ],
  },
  {
    id: 't2_four_day_week',
    title: 'Semana de 4 Dias',
    situation: 'Your workplace is considering switching to a 4-day work week.',
    instructions: [
      'State your position',
      'Discuss productivity implications',
      'Consider work-life balance',
    ],
  },
  {
    id: 't2_plastic_ban',
    title: 'Proibição de Plásticos',
    situation: 'The government wants to ban all single-use plastics within 2 years.',
    instructions: [
      'Express your opinion',
      'Discuss environmental vs economic factors',
      'Propose alternatives if any',
    ],
  },
];

// Get today's challenge
export function getTodayChallenge(): DailyChallenge {
  const today = new Date().toISOString().split('T')[0];
  const seed = getDateSeed(today);
  
  // Alternate between task1 and task2 based on day
  const isTask1 = Math.floor(seed) % 2 === 0;
  const prompts = isTask1 ? TASK1_PROMPTS : TASK2_PROMPTS;
  
  // Pick prompt based on seed
  const promptIndex = Math.floor(seededRandom(seed) * prompts.length);
  const prompt = prompts[promptIndex];
  
  return {
    date: today,
    task: isTask1 ? 'task1' : 'task2',
    promptId: prompt.id,
    prompt: {
      title: prompt.title,
      situation: prompt.situation,
      instructions: prompt.instructions,
    },
  };
}

// Storage keys
const SUBMISSION_KEY = 'celpip_daily_submission';
const LEADERBOARD_KEY = 'celpip_daily_leaderboard';

export function getTodaySubmission(): ChallengeSubmission | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(SUBMISSION_KEY);
    if (!saved) return null;
    const submission = JSON.parse(saved);
    const today = new Date().toISOString().split('T')[0];
    return submission.date === today ? submission : null;
  } catch {
    return null;
  }
}

export function saveTodaySubmission(submission: ChallengeSubmission): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SUBMISSION_KEY, JSON.stringify(submission));
  
  // Also update leaderboard with this submission
  updateLeaderboard(submission);
}

function updateLeaderboard(submission: ChallengeSubmission): void {
  try {
    const saved = localStorage.getItem(LEADERBOARD_KEY);
    let leaderboard: Record<string, DailyLeaderboardEntry[]> = saved ? JSON.parse(saved) : {};
    
    if (!leaderboard[submission.date]) {
      leaderboard[submission.date] = [];
    }
    
    // Add or update user's entry
    const existingIndex = leaderboard[submission.date].findIndex(e => e.isYou);
    const entry: DailyLeaderboardEntry = {
      rank: 0,
      name: 'Você',
      score: submission.score,
      wordCount: submission.wordCount,
      timeSeconds: submission.timeSeconds,
      isYou: true,
    };
    
    if (existingIndex >= 0) {
      leaderboard[submission.date][existingIndex] = entry;
    } else {
      leaderboard[submission.date].push(entry);
    }
    
    // Add some simulated competitors for fun
    if (leaderboard[submission.date].length === 1) {
      const simulatedScores = [
        { name: 'Maria S.', score: 8, wordCount: 175, timeSeconds: 1200 },
        { name: 'João P.', score: 9, wordCount: 168, timeSeconds: 1100 },
        { name: 'Ana L.', score: 7, wordCount: 182, timeSeconds: 1350 },
        { name: 'Pedro M.', score: 10, wordCount: 195, timeSeconds: 1000 },
        { name: 'Carla R.', score: 8, wordCount: 160, timeSeconds: 1250 },
      ];
      leaderboard[submission.date].push(...simulatedScores.map(s => ({ ...s, rank: 0 })));
    }
    
    // Sort by score (desc), then by time (asc)
    leaderboard[submission.date].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.timeSeconds - b.timeSeconds;
    });
    
    // Update ranks
    leaderboard[submission.date].forEach((e, i) => {
      e.rank = i + 1;
    });
    
    // Keep only last 7 days
    const dates = Object.keys(leaderboard).sort().reverse().slice(0, 7);
    const trimmed: Record<string, DailyLeaderboardEntry[]> = {};
    dates.forEach(d => { trimmed[d] = leaderboard[d]; });
    
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(trimmed));
  } catch {
    // Silently fail
  }
}

export function getTodayLeaderboard(): DailyLeaderboardEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem(LEADERBOARD_KEY);
    if (!saved) return [];
    const leaderboard = JSON.parse(saved);
    return leaderboard[today] || [];
  } catch {
    return [];
  }
}

interface DailyChallengeWidgetProps {
  mode?: 'full' | 'compact';
}

export default function DailyChallengeWidget({ mode = 'compact' }: DailyChallengeWidgetProps) {
  const router = useRouter();
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [submission, setSubmission] = useState<ChallengeSubmission | null>(null);
  const [leaderboard, setLeaderboard] = useState<DailyLeaderboardEntry[]>([]);
  const [mounted, setMounted] = useState(false);
  const [timeUntilReset, setTimeUntilReset] = useState('');

  useEffect(() => {
    setMounted(true);
    setChallenge(getTodayChallenge());
    setSubmission(getTodaySubmission());
    setLeaderboard(getTodayLeaderboard());
    
    // Update countdown every minute
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeUntilReset(`${hours}h ${minutes}m`);
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted || !challenge) return null;

  const handleStartChallenge = () => {
    // Redirect to dedicated challenge play page
    router.push('/challenge/play');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (mode === 'compact') {
    return (
      <div className={styles.compactContainer}>
        <div className={styles.compactHeader}>
          <div className={styles.compactTitle}>
            <span className={styles.fireEmoji}>🔥</span>
            <h4>Desafio Diário</h4>
          </div>
          <span className={styles.resetTimer}>⏰ {timeUntilReset}</span>
        </div>

        <div className={styles.compactChallenge}>
          <span className={styles.taskBadge}>
            {challenge.task === 'task1' ? '✉️ Task 1' : '📋 Task 2'}
          </span>
          <h5>{challenge.prompt.title}</h5>
        </div>

        {submission ? (
          <div className={styles.compactCompleted}>
            <div className={styles.completedBadge}>✅ Completo!</div>
            <div className={styles.completedStats}>
              <span>🎯 {submission.score}/12</span>
              <span>📝 {submission.wordCount} palavras</span>
              <span>⏱️ {formatTime(submission.timeSeconds)}</span>
            </div>
            {leaderboard.length > 0 && (
              <div className={styles.yourRank}>
                Sua posição: <strong>#{leaderboard.find(e => e.isYou)?.rank || '-'}</strong> de {leaderboard.length}
              </div>
            )}
          </div>
        ) : (
          <button className={styles.startButton} onClick={handleStartChallenge}>
            🚀 Começar Desafio
          </button>
        )}
      </div>
    );
  }

  // Full mode
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.fireEmoji}>🔥</span>
          <div>
            <h3>Desafio Diário</h3>
            <p>Novo desafio em {timeUntilReset}</p>
          </div>
        </div>
        <div className={styles.dateBadge}>
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' })}
        </div>
      </div>

      <div className={styles.challengeCard}>
        <div className={styles.challengeHeader}>
          <span className={styles.taskBadge}>
            {challenge.task === 'task1' ? '✉️ Task 1 — Email' : '📋 Task 2 — Survey'}
          </span>
        </div>
        
        <h4 className={styles.challengeTitle}>{challenge.prompt.title}</h4>
        
        <div className={styles.situation}>
          <strong>Situação:</strong>
          <p>{challenge.prompt.situation}</p>
        </div>

        <div className={styles.instructions}>
          <strong>Instruções:</strong>
          <ul>
            {challenge.prompt.instructions.map((inst, i) => (
              <li key={i}>{inst}</li>
            ))}
          </ul>
        </div>

        {submission ? (
          <div className={styles.submissionResult}>
            <div className={styles.resultHeader}>
              <span className={styles.completedIcon}>✅</span>
              <span>Desafio Completo!</span>
            </div>
            <div className={styles.resultStats}>
              <div className={styles.resultStat}>
                <span className={styles.resultValue}>{submission.score}</span>
                <span className={styles.resultLabel}>Pontuação</span>
              </div>
              <div className={styles.resultStat}>
                <span className={styles.resultValue}>{submission.wordCount}</span>
                <span className={styles.resultLabel}>Palavras</span>
              </div>
              <div className={styles.resultStat}>
                <span className={styles.resultValue}>{formatTime(submission.timeSeconds)}</span>
                <span className={styles.resultLabel}>Tempo</span>
              </div>
            </div>
          </div>
        ) : (
          <button className={styles.startButtonLarge} onClick={handleStartChallenge}>
            🚀 Começar Desafio
          </button>
        )}
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
    </div>
  );
}
