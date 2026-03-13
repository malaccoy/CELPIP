'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/ErrorReview.module.scss';

// Error tracking data structure
export interface ErrorStats {
  errorCounts: Record<string, number>;  // feedbackId -> count of failures
  totalEvaluations: number;
  lastUpdated: string;
}

// Tips for each common error
const ERROR_TIPS: Record<string, { title: string; tips: string[]; examples?: string[] }> = {
  // Task 1 errors
  'dear-check': {
    title: 'Greeting with "Dear"',
    tips: [
      'Every CELPIP email must start with "Dear" followed by a name/title',
      'Use "Dear Sir/Madam" when you don\'t know the name',
      'Use "Dear Mr./Ms./Mrs. [Last Name]" for formal emails',
      'Use "Dear [First Name]" for informal/semi-formal emails',
    ],
    examples: ['Dear Mr. Johnson,', 'Dear Hiring Manager,', 'Dear Sarah,'],
  },
  'intro-check': {
    title: 'Introduction and Purpose',
    tips: [
      'The first sentence should explain who you are and why you are writing',
      'Use "I am writing to..." or "I am a resident of..."',
      'Be direct and clear about the purpose of your email',
    ],
    examples: [
      'I am writing to express my concern about...',
      'My name is [X] and I am a long-time customer of your store.',
      'I am writing to request information about...',
    ],
  },
  'connectors-check': {
    title: 'Sequence Connectors',
    tips: [
      'Use connectors to organize your ideas clearly',
      'Distribute: First/Firstly, Second/Secondly, Third, Finally',
      'Other useful ones: Additionally, Moreover, Furthermore',
      'They help the reader follow your logic',
    ],
    examples: [
      'First, I would like to address the issue of...',
      'Additionally, I believe that...',
      'Finally, I hope you will consider...',
    ],
  },
  'contractions-check': {
    title: 'Avoid Contractions (Formal)',
    tips: [
      'In formal emails, write out the full words',
      "don't → do not | can't → cannot | won't → will not",
      "it's → it is | I'm → I am | shouldn't → should not",
      'Contractions are only OK in informal emails',
    ],
  },
  'word-count-check': {
    title: 'Word Count',
    tips: [
      'The ideal range is 150-200 words',
      'Under 150: you may lose points for insufficient content',
      'Over 200: OK, but be mindful of time',
      'Practice to hit the right length naturally',
    ],
  },
  'closing-check': {
    title: 'Email Closing',
    tips: [
      'Formal: "Sincerely," or "Yours faithfully,"',
      'Semi-formal: "Best regards," or "Kind regards,"',
      'Always sign with your name on the next line',
      'Don\'t forget the comma after the closing!',
    ],
    examples: [
      'Sincerely,\nJohn Smith',
      'Best regards,\nMaria Santos',
    ],
  },
  'request-check': {
    title: 'Clear Request/Action',
    tips: [
      'End with a specific request or action',
      'Use phrases like "I would appreciate if..."',
      '"Please let me know..." or "I look forward to..."',
      'Make it clear what you expect from the recipient',
    ],
    examples: [
      'I would appreciate it if you could look into this matter.',
      'Please let me know if you need any further information.',
      'I look forward to hearing from you soon.',
    ],
  },
  // Task 2 errors
  'opinion-check': {
    title: 'Opinion Statement',
    tips: [
      'Your introduction MUST clearly state your opinion',
      'Use: "I believe...", "In my opinion...", "I strongly recommend..."',
      'Don\'t be ambiguous about which side you chose',
      'Take a clear position and defend it',
    ],
    examples: [
      'In my opinion, working from home is more beneficial than working in an office.',
      'I strongly believe that public transportation should be free for everyone.',
    ],
  },
  'conclusion-check': {
    title: 'Conclusion Paragraph',
    tips: [
      'Start with "In conclusion," or "To summarize,"',
      'Restate your main opinion',
      'Briefly summarize your arguments',
      'You can add a strong final sentence',
    ],
    examples: [
      'In conclusion, I firmly believe that [restate opinion] because [brief summary of reasons].',
      'To summarize, the benefits of [X] clearly outweigh the drawbacks.',
    ],
  },
  'example-check': {
    title: 'Use Concrete Examples',
    tips: [
      'Each argument should have an example or evidence',
      'Use "For example,", "For instance,", "such as"',
      'Personal or hypothetical examples are valid',
      'Makes your argument more convincing',
    ],
    examples: [
      'For example, my neighbor started working remotely and reported a 50% reduction in stress.',
      'For instance, studies have shown that...',
    ],
  },
  'rhetorical-check': {
    title: 'Avoid Rhetorical Questions',
    tips: [
      'In the CELPIP, avoid using questions as arguments',
      'Instead of "Why is this important?", state: "This is important because..."',
      'Questions may make it seem like you are unsure',
      'Make direct and confident statements',
    ],
  },
};

const STORAGE_KEY = 'celpip_error_stats';

export function loadErrorStats(): ErrorStats {
  if (typeof window === 'undefined') {
    return { errorCounts: {}, totalEvaluations: 0, lastUpdated: '' };
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { errorCounts: {}, totalEvaluations: 0, lastUpdated: '' };
  } catch {
    return { errorCounts: {}, totalEvaluations: 0, lastUpdated: '' };
  }
}

export function saveErrorStats(stats: ErrorStats): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function recordErrors(failedIds: string[]): void {
  const stats = loadErrorStats();
  stats.totalEvaluations++;
  stats.lastUpdated = new Date().toISOString();
  
  for (const id of failedIds) {
    stats.errorCounts[id] = (stats.errorCounts[id] || 0) + 1;
  }
  
  saveErrorStats(stats);
}

export function getTopErrors(limit: number = 5): Array<{ id: string; count: number; percentage: number }> {
  const stats = loadErrorStats();
  if (stats.totalEvaluations === 0) return [];
  
  return Object.entries(stats.errorCounts)
    .map(([id, count]) => ({
      id,
      count,
      percentage: Math.round((count / stats.totalEvaluations) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

interface ErrorReviewProps {
  mode?: 'full' | 'compact';
}

export default function ErrorReview({ mode = 'full' }: ErrorReviewProps) {
  const [stats, setStats] = useState<ErrorStats | null>(null);
  const [topErrors, setTopErrors] = useState<Array<{ id: string; count: number; percentage: number }>>([]);
  const [expandedError, setExpandedError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadedStats = loadErrorStats();
    setStats(loadedStats);
    setTopErrors(getTopErrors(mode === 'compact' ? 3 : 10));
  }, [mode]);

  if (!mounted) return null;

  if (!stats || stats.totalEvaluations === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📝</div>
        <h4>Nenhum erro registrado ainda</h4>
        <p>Complete algumas avaliações para ver seus erros mais frequentes aqui.</p>
      </div>
    );
  }

  if (mode === 'compact') {
    return (
      <div className={styles.compactContainer}>
        <div className={styles.compactHeader}>
          <h4>⚠️ Erros Frequentes</h4>
          <span className={styles.evalCount}>{stats.totalEvaluations} avaliações</span>
        </div>
        
        {topErrors.length === 0 ? (
          <p className={styles.noErrors}>🎉 Nenhum erro frequente! Continue assim!</p>
        ) : (
          <div className={styles.compactList}>
            {topErrors.map((error) => {
              const tip = ERROR_TIPS[error.id];
              return (
                <div key={error.id} className={styles.compactItem}>
                  <div className={styles.compactItemHeader}>
                    <span className={styles.compactItemTitle}>
                      {tip?.title || error.id}
                    </span>
                    <span className={styles.compactItemPercent}>{error.percentage}%</span>
                  </div>
                  <div className={styles.compactItemBar}>
                    <div 
                      className={styles.compactItemFill}
                      style={{ width: `${error.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Full mode
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <span className={styles.evalCount}>📊 {stats.totalEvaluations} avaliações analisadas</span>
        </div>
      </div>

      {topErrors.length === 0 ? (
        <div className={styles.perfectScore}>
          <div className={styles.perfectIcon}>🏆</div>
          <h4>Perfeito!</h4>
          <p>You haven't made frequent errors. Keep practicing!</p>
        </div>
      ) : (
        <div className={styles.errorList}>
          {topErrors.map((error, index) => {
            const tip = ERROR_TIPS[error.id];
            const isExpanded = expandedError === error.id;
            
            return (
              <div 
                key={error.id} 
                className={`${styles.errorCard} ${isExpanded ? styles.errorCardExpanded : ''}`}
              >
                <div 
                  className={styles.errorCardHeader}
                  onClick={() => setExpandedError(isExpanded ? null : error.id)}
                >
                  <div className={styles.errorRank}>#{index + 1}</div>
                  <div className={styles.errorInfo}>
                    <h4>{tip?.title || error.id}</h4>
                    <span className={styles.errorMeta}>
                      Falhou {error.count}x ({error.percentage}% das avaliações)
                    </span>
                  </div>
                  <div className={styles.errorPercentage}>
                    <div className={styles.percentCircle}>
                      <svg viewBox="0 0 36 36">
                        <path
                          className={styles.percentBg}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className={styles.percentFill}
                          strokeDasharray={`${error.percentage}, 100`}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span>{error.percentage}%</span>
                    </div>
                  </div>
                  <div className={styles.expandIcon}>
                    {isExpanded ? '−' : '+'}
                  </div>
                </div>

                {isExpanded && tip && (
                  <div className={styles.errorCardBody}>
                    <div className={styles.tipSection}>
                      <h5>💡 Dicas para melhorar:</h5>
                      <ul>
                        {tip.tips.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>

                    {tip.examples && tip.examples.length > 0 && (
                      <div className={styles.exampleSection}>
                        <h5>📝 Exemplos:</h5>
                        <div className={styles.examples}>
                          {tip.examples.map((ex, i) => (
                            <code key={i}>{ex}</code>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className={styles.clearSection}>
        <button 
          className={styles.clearBtn}
          onClick={() => {
            if (confirm('Limpar histórico de erros?')) {
              localStorage.removeItem(STORAGE_KEY);
              setStats({ errorCounts: {}, totalEvaluations: 0, lastUpdated: '' });
              setTopErrors([]);
            }
          }}
        >
          🗑️ Limpar Histórico
        </button>
      </div>
    </div>
  );
}
