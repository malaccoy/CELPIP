'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Card, Button, WordCounter } from '@/components/Common';
import { evaluateTask1Email, parseTask1Prompt, Task1EvaluationResult, EvaluationLevel } from '@lib/rules/task1-evaluation';
import { Send, AlertCircle, AlertTriangle, Lightbulb, CheckCircle, History, ClipboardList } from 'lucide-react';
import styles from '@/styles/Pages.module.scss';
import evaluationStyles from './evaluate.module.scss';
import { Task1HistoryEntry } from '@/types';
import { loadTask1History, saveTask1HistoryEntry, generateHistoryId } from '@/utils/history';

export default function Task1EvaluationPage() {
  const [emailText, setEmailText] = useState('');
  const [promptText, setPromptText] = useState('');
  const [result, setResult] = useState<Task1EvaluationResult | null>(null);
  const [history, setHistory] = useState<Task1HistoryEntry[]>([]);

  const wordCount = emailText.trim().split(/\s+/).filter(w => w.length > 0).length;

  // Parse the prompt to show detected requirements in real-time
  const parsedPrompt = useMemo(() => {
    if (!promptText.trim()) return null;
    return parseTask1Prompt(promptText);
  }, [promptText]);

  // Load history on mount
  useEffect(() => {
    setHistory(loadTask1History());
  }, []);

  const handleEvaluate = useCallback(() => {
    if (emailText.trim().length === 0) return;
    
    // Pass promptText to the evaluation function
    const evaluationResult = evaluateTask1Email(emailText, {
      promptText: promptText.trim() || undefined,
    });
    setResult(evaluationResult);

    // Save to history
    const historyEntry: Task1HistoryEntry = {
      id: generateHistoryId(),
      dateISO: new Date().toISOString(),
      wordCount: evaluationResult.wordCount,
      score: evaluationResult.score,
      level: evaluationResult.level,
      errorsCount: evaluationResult.errors.length,
      warningsCount: evaluationResult.warnings.length,
      suggestionsCount: evaluationResult.suggestions.length,
      emailText: emailText,
    };
    saveTask1HistoryEntry(historyEntry);
    // Update state directly instead of reloading from localStorage
    setHistory(prev => [historyEntry, ...prev].slice(0, 30));
  }, [emailText, promptText]);

  const handleHistoryItemClick = useCallback((entry: Task1HistoryEntry) => {
    if (entry.emailText) {
      setEmailText(entry.emailText);
      // Re-evaluate to restore the result (without promptText from history)
      const evaluationResult = evaluateTask1Email(entry.emailText, {
        promptText: promptText.trim() || undefined,
      });
      setResult(evaluationResult);
    }
  }, [promptText]);

  const formatDate = (dateISO: string): string => {
    const date = new Date(dateISO);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
          {/* Prompt Text Card */}
          <Card className={evaluationStyles.promptCard}>
            <div className={evaluationStyles.inputHeader}>
              <h3 className={evaluationStyles.inputTitle}>Task Prompt (optional)</h3>
            </div>
            <textarea
              className={evaluationStyles.promptTextarea}
              placeholder="Paste the CELPIP task prompt here to check if you addressed all requirements..."
              value={promptText}
              onChange={e => setPromptText(e.target.value)}
              aria-label="Task prompt input"
            />
            {/* Detected Requirements */}
            {parsedPrompt && parsedPrompt.bullets.length > 0 && (
              <div className={evaluationStyles.detectedRequirements}>
                <div className={evaluationStyles.detectedHeader}>
                  <ClipboardList size={16} className={evaluationStyles.detectedIcon} />
                  <span className={evaluationStyles.detectedTitle}>Detected Requirements</span>
                  {parsedPrompt.audienceHint && (
                    <span className={evaluationStyles.audienceHint}>
                      Audience: {parsedPrompt.audienceHint}
                    </span>
                  )}
                </div>
                <ul className={evaluationStyles.detectedList}>
                  {parsedPrompt.bullets.map((bullet, index) => (
                    <li key={index} className={evaluationStyles.detectedItem}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>

          {/* Email Text Card */}
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

          {/* History Section */}
          {history.length > 0 && (
            <Card className={evaluationStyles.historyCard}>
              <div className={evaluationStyles.historyHeader}>
                <History size={20} className={evaluationStyles.historyIcon} />
                <h4 className={evaluationStyles.historyTitle}>History</h4>
                <span className={evaluationStyles.feedbackCount}>{history.length}</span>
              </div>
              <ul className={evaluationStyles.historyList}>
                {history.map((entry) => (
                  <li
                    key={entry.id}
                    className={evaluationStyles.historyItem}
                    onClick={() => handleHistoryItemClick(entry)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleHistoryItemClick(entry);
                      }
                    }}
                  >
                    <span className={evaluationStyles.historyDate}>{formatDate(entry.dateISO)}</span>
                    <span className={evaluationStyles.historyScore}>Score: {entry.score}/12</span>
                    <span className={evaluationStyles.historyWordCount}>{entry.wordCount} words</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
