'use client';

import React, { useState, useCallback } from 'react';
import { Card, Button, WordCounter } from '@/components/Common';
import { evaluateTask1Email, Task1EvaluationResult, EvaluationLevel } from '@lib/rules/task1-evaluation';
import { Send, AlertCircle, AlertTriangle, Lightbulb, CheckCircle } from 'lucide-react';
import styles from '@/styles/Pages.module.scss';
import evaluationStyles from './evaluate.module.scss';

export default function Task1EvaluationPage() {
  const [emailText, setEmailText] = useState('');
  const [result, setResult] = useState<Task1EvaluationResult | null>(null);

  const wordCount = emailText.trim().split(/\s+/).filter(w => w.length > 0).length;

  const handleEvaluate = useCallback(() => {
    if (emailText.trim().length === 0) return;
    
    const evaluationResult = evaluateTask1Email(emailText);
    setResult(evaluationResult);
  }, [emailText]);

  const getLevelBadgeClass = (level: EvaluationLevel): string => {
    switch (level) {
      case 'weak':
        return evaluationStyles.levelBadgeWeak;
      case 'ok':
        return evaluationStyles.levelBadgeOk;
      case 'strong':
        return evaluationStyles.levelBadgeStrong;
      default:
        return '';
    }
  };

  const getLevelLabel = (level: EvaluationLevel): string => {
    switch (level) {
      case 'weak':
        return 'Needs Improvement';
      case 'ok':
        return 'Satisfactory';
      case 'strong':
        return 'Excellent';
      default:
        return '';
    }
  };

  return (
    <div className={styles.taskContainer}>
      <div className={styles.taskHeader}>
        <div className={styles.taskTitle}>
          <h2>Task 1 — Email Evaluation</h2>
          <p>Paste your email below and receive instant feedback</p>
        </div>
      </div>

      <div className={evaluationStyles.evaluationGrid}>
        {/* Email Input Section */}
        <div className={evaluationStyles.inputSection}>
          <Card className={evaluationStyles.inputCard}>
            <div className={evaluationStyles.inputHeader}>
              <h3 className={evaluationStyles.inputTitle}>Your Email</h3>
              <WordCounter count={wordCount} />
            </div>

            <textarea
              className={evaluationStyles.emailTextarea}
              placeholder="Paste or type your email here..."
              value={emailText}
              onChange={e => setEmailText(e.target.value)}
              aria-label="Email text input"
            />

            <div className={evaluationStyles.inputActions}>
              <Button
                onClick={handleEvaluate}
                disabled={emailText.trim().length === 0}
                className={evaluationStyles.evaluateButton}
              >
                <Send size={16} />
                Evaluate Email
              </Button>
            </div>
          </Card>
        </div>

        {/* Results Section */}
        <div className={evaluationStyles.resultsSection}>
          {result ? (
            <>
              {/* Score Card */}
              <Card className={evaluationStyles.scoreCard}>
                <div className={evaluationStyles.scoreContent}>
                  <div className={evaluationStyles.scoreMain}>
                    <span className={evaluationStyles.scoreValue}>{result.score}</span>
                    <span className={evaluationStyles.scoreMax}>/ 12</span>
                  </div>
                  <div className={`${evaluationStyles.levelBadge} ${getLevelBadgeClass(result.level)}`}>
                    {getLevelLabel(result.level)}
                  </div>
                  <div className={evaluationStyles.wordCountResult}>
                    <span className={evaluationStyles.wordCountLabel}>Word Count:</span>
                    <span className={evaluationStyles.wordCountValue}>{result.wordCount}</span>
                    <span className={evaluationStyles.wordCountRange}>(150-200 recommended)</span>
                  </div>
                </div>
              </Card>

              {/* Errors Section */}
              {result.errors.length > 0 && (
                <Card className={evaluationStyles.feedbackCard}>
                  <div className={evaluationStyles.feedbackHeader}>
                    <AlertCircle size={20} className={evaluationStyles.errorIcon} />
                    <h4 className={evaluationStyles.feedbackTitle}>Errors</h4>
                    <span className={evaluationStyles.feedbackCount}>{result.errors.length}</span>
                  </div>
                  <ul className={evaluationStyles.feedbackList}>
                    {result.errors.map((error, index) => (
                      <li key={index} className={evaluationStyles.feedbackItemError}>
                        {error}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Warnings Section */}
              {result.warnings.length > 0 && (
                <Card className={evaluationStyles.feedbackCard}>
                  <div className={evaluationStyles.feedbackHeader}>
                    <AlertTriangle size={20} className={evaluationStyles.warningIcon} />
                    <h4 className={evaluationStyles.feedbackTitle}>Warnings</h4>
                    <span className={evaluationStyles.feedbackCount}>{result.warnings.length}</span>
                  </div>
                  <ul className={evaluationStyles.feedbackList}>
                    {result.warnings.map((warning, index) => (
                      <li key={index} className={evaluationStyles.feedbackItemWarning}>
                        {warning}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Suggestions Section */}
              {result.suggestions.length > 0 && (
                <Card className={evaluationStyles.feedbackCard}>
                  <div className={evaluationStyles.feedbackHeader}>
                    <Lightbulb size={20} className={evaluationStyles.suggestionIcon} />
                    <h4 className={evaluationStyles.feedbackTitle}>Suggestions</h4>
                    <span className={evaluationStyles.feedbackCount}>{result.suggestions.length}</span>
                  </div>
                  <ul className={evaluationStyles.feedbackList}>
                    {result.suggestions.map((suggestion, index) => (
                      <li key={index} className={evaluationStyles.feedbackItemSuggestion}>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* All Clear Message */}
              {result.errors.length === 0 && result.warnings.length === 0 && (
                <Card className={evaluationStyles.successCard}>
                  <div className={evaluationStyles.successContent}>
                    <CheckCircle size={24} className={evaluationStyles.successIcon} />
                    <span>No critical issues found. Great job!</span>
                  </div>
                </Card>
              )}
            </>
          ) : (
            <Card className={evaluationStyles.emptyState}>
              <div className={evaluationStyles.emptyStateContent}>
                <Send size={48} className={evaluationStyles.emptyStateIcon} />
                <h3>Ready to Evaluate</h3>
                <p>Paste your email in the text area and click &quot;Evaluate Email&quot; to receive feedback.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
