'use client';

import { useState } from 'react';
import { MessageSquare, CheckCircle, AlertCircle, AlertTriangle, Loader2, X, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { usePlan } from '@/hooks/usePlan';
import { ProGate } from './ProGate';
import styles from '@/styles/SentenceFeedback.module.scss';

interface SentenceFeedback {
  sentence: string;
  status: 'good' | 'improve' | 'warning';
  feedback: string;
  category?: 'structure' | 'vocabulary' | 'grammar' | 'content' | 'style';
}

interface SentenceFeedbackProps {
  task: 'task1' | 'task2';
  text: string;
}

const statusIcons = {
  good: <CheckCircle size={16} />,
  improve: <AlertCircle size={16} />,
  warning: <AlertTriangle size={16} />,
};

const statusLabels = {
  good: 'Good',
  improve: 'Improve',
  warning: 'Issue',
};

const categoryLabels: Record<string, string> = {
  structure: 'Structure',
  vocabulary: 'Vocabulary', 
  grammar: 'Grammar',
  content: 'Content',
  style: 'Style',
};

export default function SentenceFeedbackPanel({ task, text }: SentenceFeedbackProps) {
  const { isPro, loading: planLoading } = usePlan();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sentences, setSentences] = useState<SentenceFeedback[]>([]);
  const [summary, setSummary] = useState<{ good: number; improve: number; warning: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'good' | 'improve' | 'warning'>('all');

  const fetchFeedback = async () => {
    if (text.trim().length < 30) {
      setError('Write at least a few sentences to get feedback.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/sentence-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, text }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to get feedback');
      }

      const data = await response.json();
      setSentences(data.sentences || []);
      setSummary(data.summary || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (sentences.length === 0 && !isLoading) {
      fetchFeedback();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const filteredSentences = filter === 'all' 
    ? sentences 
    : sentences.filter(s => s.status === filter);

  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  const isDisabled = wordCount < 50;

  if (!isOpen) {
    return (
      <button 
        className={`${styles.triggerButton} ${!isPro && !planLoading ? styles.lockedButton : ''}`}
        onClick={handleOpen}
        disabled={isDisabled}
      >
        {isPro ? <MessageSquare size={18} /> : <Lock size={18} />}
        <span>Sentence-by-Sentence</span>
        {!isPro && !planLoading && <span className={styles.proBadge}>PRO</span>}
      </button>
    );
  }

  if (!isPro) {
    return (
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <div className={styles.panelTitle}>
            <MessageSquare size={20} />
            <span>Sentence Feedback</span>
          </div>
          <button className={styles.closeButton} onClick={handleClose}>
            <X size={18} />
          </button>
        </div>
        <ProGate 
          feature="Sentence Analysis" 
          description="Get AI-powered feedback on every sentence — grammar, vocabulary, structure, and style. Upgrade to Pro to unlock."
        />
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      {/* Header */}
      <div className={styles.panelHeader}>
        <div className={styles.panelTitle}>
          <MessageSquare size={20} />
          <span>Sentence Feedback</span>
        </div>
        <button className={styles.closeButton} onClick={handleClose}>
          <X size={18} />
        </button>
      </div>

      {/* Summary Bar */}
      {summary && !isLoading && (
        <div className={styles.summaryBar}>
          <button 
            className={`${styles.summaryItem} ${styles.good} ${filter === 'good' ? styles.active : ''}`}
            onClick={() => setFilter(filter === 'good' ? 'all' : 'good')}
          >
            <CheckCircle size={14} />
            <span>{summary.good}</span>
          </button>
          <button 
            className={`${styles.summaryItem} ${styles.improve} ${filter === 'improve' ? styles.active : ''}`}
            onClick={() => setFilter(filter === 'improve' ? 'all' : 'improve')}
          >
            <AlertCircle size={14} />
            <span>{summary.improve}</span>
          </button>
          <button 
            className={`${styles.summaryItem} ${styles.warning} ${filter === 'warning' ? styles.active : ''}`}
            onClick={() => setFilter(filter === 'warning' ? 'all' : 'warning')}
          >
            <AlertTriangle size={14} />
            <span>{summary.warning}</span>
          </button>
          {filter !== 'all' && (
            <button className={styles.clearFilter} onClick={() => setFilter('all')}>
              Show All
            </button>
          )}
        </div>
      )}

      {/* Content */}
      <div className={styles.panelContent}>
        {isLoading ? (
          <div className={styles.loadingState}>
            <Loader2 size={28} className={styles.spinner} />
            <p>Analyzing each sentence...</p>
          </div>
        ) : error ? (
          <div className={styles.errorState}>
            <AlertCircle size={24} />
            <p>{error}</p>
            <button onClick={fetchFeedback}>Try Again</button>
          </div>
        ) : filteredSentences.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No sentences match this filter.</p>
          </div>
        ) : (
          <div className={styles.sentenceList}>
            {filteredSentences.map((item, index) => (
              <div 
                key={index} 
                className={`${styles.sentenceCard} ${styles[item.status]}`}
              >
                <div 
                  className={styles.sentenceHeader}
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                >
                  <div className={styles.statusIcon}>
                    {statusIcons[item.status]}
                  </div>
                  <div className={styles.sentencePreview}>
                    <p className={styles.sentenceText}>
                      {item.sentence.length > 80 && expandedIndex !== index
                        ? `${item.sentence.substring(0, 80)}...`
                        : item.sentence}
                    </p>
                  </div>
                  {item.sentence.length > 80 && (
                    <button className={styles.expandButton}>
                      {expandedIndex === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  )}
                </div>
                
                <div className={styles.feedbackRow}>
                  <span className={`${styles.statusBadge} ${styles[item.status]}`}>
                    {statusLabels[item.status]}
                  </span>
                  {item.category && (
                    <span className={styles.categoryBadge}>
                      {categoryLabels[item.category] || item.category}
                    </span>
                  )}
                  <p className={styles.feedbackText}>{item.feedback}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Refresh Button */}
      {sentences.length > 0 && !isLoading && (
        <button className={styles.refreshButton} onClick={fetchFeedback}>
          <Loader2 size={14} />
          Re-analyze
        </button>
      )}
    </div>
  );
}
