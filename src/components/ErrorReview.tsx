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
    title: 'Saudação com "Dear"',
    tips: [
      'Todo email no CELPIP deve começar com "Dear" seguido do nome/título',
      'Use "Dear Sir/Madam" quando não souber o nome',
      'Use "Dear Mr./Ms./Mrs. [Sobrenome]" para formal',
      'Use "Dear [Nome]" para informal/semi-formal',
    ],
    examples: ['Dear Mr. Johnson,', 'Dear Hiring Manager,', 'Dear Sarah,'],
  },
  'intro-check': {
    title: 'Introdução e Propósito',
    tips: [
      'A primeira frase deve explicar quem você é e por que está escrevendo',
      'Use "I am writing to..." ou "I am a resident of..."',
      'Seja direto e claro sobre o objetivo do email',
    ],
    examples: [
      'I am writing to express my concern about...',
      'My name is [X] and I am a long-time customer of your store.',
      'I am writing to request information about...',
    ],
  },
  'connectors-check': {
    title: 'Conectores de Sequência',
    tips: [
      'Use conectores para organizar suas ideias claramente',
      'Distribua: First/Firstly, Second/Secondly, Third, Finally',
      'Outros úteis: Additionally, Moreover, Furthermore',
      'Ajudam o leitor a seguir sua lógica',
    ],
    examples: [
      'First, I would like to address the issue of...',
      'Additionally, I believe that...',
      'Finally, I hope you will consider...',
    ],
  },
  'contractions-check': {
    title: 'Evitar Contrações (Formal)',
    tips: [
      'Em emails formais, escreva as palavras completas',
      "don't → do not | can't → cannot | won't → will not",
      "it's → it is | I'm → I am | shouldn't → should not",
      'Contrações são OK apenas em emails informais',
    ],
  },
  'word-count-check': {
    title: 'Contagem de Palavras',
    tips: [
      'O ideal é entre 150-200 palavras',
      'Menos de 150: pode perder pontos por falta de conteúdo',
      'Mais de 200: OK, mas cuidado com o tempo',
      'Pratique para acertar o tamanho naturalmente',
    ],
  },
  'closing-check': {
    title: 'Encerramento do Email',
    tips: [
      'Formal: "Sincerely," ou "Yours faithfully,"',
      'Semi-formal: "Best regards," ou "Kind regards,"',
      'Sempre assine com seu nome na linha seguinte',
      'Não esqueça a vírgula após o encerramento!',
    ],
    examples: [
      'Sincerely,\nJohn Smith',
      'Best regards,\nMaria Santos',
    ],
  },
  'request-check': {
    title: 'Pedido/Ação Clara',
    tips: [
      'Termine com um pedido ou ação específica',
      'Use frases como "I would appreciate if..."',
      '"Please let me know..." ou "I look forward to..."',
      'Deixe claro o que você espera do destinatário',
    ],
    examples: [
      'I would appreciate it if you could look into this matter.',
      'Please let me know if you need any further information.',
      'I look forward to hearing from you soon.',
    ],
  },
  // Task 2 errors
  'opinion-check': {
    title: 'Declaração de Opinião',
    tips: [
      'A introdução DEVE ter sua opinião claramente',
      'Use: "I believe...", "In my opinion...", "I strongly recommend..."',
      'Não deixe ambíguo qual lado você escolheu',
      'Tome uma posição clara e defenda-a',
    ],
    examples: [
      'In my opinion, working from home is more beneficial than working in an office.',
      'I strongly believe that public transportation should be free for everyone.',
    ],
  },
  'conclusion-check': {
    title: 'Parágrafo de Conclusão',
    tips: [
      'Comece com "In conclusion," ou "To summarize,"',
      'Reafirme sua opinião principal',
      'Resuma brevemente seus argumentos',
      'Pode adicionar uma frase final forte',
    ],
    examples: [
      'In conclusion, I firmly believe that [restate opinion] because [brief summary of reasons].',
      'To summarize, the benefits of [X] clearly outweigh the drawbacks.',
    ],
  },
  'example-check': {
    title: 'Usar Exemplos Concretos',
    tips: [
      'Cada argumento deve ter um exemplo ou evidência',
      'Use "For example,", "For instance,", "such as"',
      'Exemplos pessoais ou hipotéticos são válidos',
      'Torna seu argumento mais convincente',
    ],
    examples: [
      'For example, my neighbor started working remotely and reported a 50% reduction in stress.',
      'For instance, studies have shown that...',
    ],
  },
  'rhetorical-check': {
    title: 'Evitar Perguntas Retóricas',
    tips: [
      'No CELPIP, evite perguntas como argumentos',
      'Em vez de "Why is this important?", afirme: "This is important because..."',
      'Perguntas podem parecer que você não tem certeza',
      'Faça afirmações diretas e confiantes',
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
          <p>Você não cometeu erros frequentes. Continue praticando!</p>
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
