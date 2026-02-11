'use client';

import React, { useState } from 'react';
import { evaluateTask1Email, Task1EvaluationResult, EvaluationLevel } from '@lib/rules/task1-evaluation';
import { ClipboardCheck, AlertCircle, AlertTriangle, Lightbulb, CheckCircle, Loader2 } from 'lucide-react';
import styles from '@/styles/RuleEvaluation.module.scss';

interface RuleEvaluationProps {
  task: 'task1' | 'task2';
  text: string;
  promptText?: string;
}

export default function RuleEvaluation({ task, text, promptText }: RuleEvaluationProps) {
  const [result, setResult] = useState<Task1EvaluationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleEvaluate = () => {
    if (!text.trim()) return;
    
    setLoading(true);
    
    // Simulate slight delay for UX
    setTimeout(() => {
      const evaluationResult = evaluateTask1Email(text, { promptText });
      setResult(evaluationResult);
      setLoading(false);
      setIsOpen(true);
    }, 500);
  };

  const getLevelLabel = (level: EvaluationLevel): string => {
    switch (level) {
      case 'weak': return 'Needs Improvement';
      case 'ok': return 'Satisfactory';
      case 'strong': return 'Excellent';
      default: return '';
    }
  };

  const getLevelClass = (level: EvaluationLevel): string => {
    switch (level) {
      case 'weak': return styles.levelWeak;
      case 'ok': return styles.levelOk;
      case 'strong': return styles.levelStrong;
      default: return '';
    }
  };

  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  const isDisabled = wordCount < 50;

  return (
    <div className={styles.ruleEvaluation}>
      <button
        className={`${styles.evaluateBtn} ${isDisabled ? styles.disabled : ''}`}
        onClick={handleEvaluate}
        disabled={isDisabled || loading}
      >
        {loading ? (
          <>
            <Loader2 size={18} className={styles.spinner} />
            Checking...
          </>
        ) : (
          <>
            <ClipboardCheck size={18} />
            Rule Check
          </>
        )}
      </button>

      {result && isOpen && (
        <div className={styles.resultPanel}>
          <div className={styles.resultHeader}>
            <div className={styles.scoreSection}>
              <div className={styles.scoreCircle}>
                <span className={styles.scoreValue}>{result.score}</span>
                <span className={styles.scoreMax}>/12</span>
              </div>
              <div className={`${styles.levelBadge} ${getLevelClass(result.level)}`}>
                {getLevelLabel(result.level)}
              </div>
            </div>
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className={styles.wordCountInfo}>
            <span>Word Count: <strong>{result.wordCount}</strong></span>
            <span className={styles.wordCountHint}>(150-200 recommended)</span>
          </div>

          {/* Errors */}
          {result.errors.length > 0 && (
            <div className={`${styles.feedbackSection} ${styles.errors}`}>
              <div className={styles.sectionHeader}>
                <AlertCircle size={16} />
                <span>Errors</span>
                <span className={styles.count}>{result.errors.length}</span>
              </div>
              <ul className={styles.feedbackList}>
                {result.errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className={`${styles.feedbackSection} ${styles.warnings}`}>
              <div className={styles.sectionHeader}>
                <AlertTriangle size={16} />
                <span>Warnings</span>
                <span className={styles.count}>{result.warnings.length}</span>
              </div>
              <ul className={styles.feedbackList}>
                {result.warnings.map((warning, i) => (
                  <li key={i}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <div className={`${styles.feedbackSection} ${styles.suggestions}`}>
              <div className={styles.sectionHeader}>
                <Lightbulb size={16} />
                <span>Suggestions</span>
                <span className={styles.count}>{result.suggestions.length}</span>
              </div>
              <ul className={styles.feedbackList}>
                {result.suggestions.map((suggestion, i) => (
                  <li key={i}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Success */}
          {result.errors.length === 0 && result.warnings.length === 0 && (
            <div className={`${styles.feedbackSection} ${styles.success}`}>
              <div className={styles.successContent}>
                <CheckCircle size={20} />
                <span>No critical issues found. Great job!</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
