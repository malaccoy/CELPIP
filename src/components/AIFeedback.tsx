'use client';

import { useState } from 'react';
import { Sparkles, Target, Lightbulb, AlertCircle, AlertTriangle, CheckCircle, Loader2, X, Copy, Check, FileEdit, ClipboardCheck, RefreshCw, Lock } from 'lucide-react';
import { evaluateTask1Email, Task1EvaluationResult } from '@lib/rules/task1-evaluation';
import { recordPractice } from './DetailedStats';
import { usePlan } from '@/hooks/usePlan';
import { ProGate } from './ProGate';
import styles from '@/styles/AIFeedback.module.scss';

interface ScoreFeedback {
  score: number;
  maxScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  grammarErrors?: GrammarError[];
}

interface GrammarError {
  sentence: string;
  error: string;
  correction: string;
  explanation: string;
}

interface AIFeedbackProps {
  task: 'task1' | 'task2';
  text: string;
  promptText?: string;
  onApplySuggestion?: (original: string, replacement: string) => void;
}

export default function AIFeedback({ task, text, promptText, onApplySuggestion }: AIFeedbackProps) {
  const { isPro, loading: planLoading } = usePlan();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'score' | 'rules' | 'grammar' | 'corrected'>('score');
  const [scoreFeedback, setScoreFeedback] = useState<ScoreFeedback | null>(null);
  const [ruleResult, setRuleResult] = useState<Task1EvaluationResult | null>(null);
  const [grammarErrors, setGrammarErrors] = useState<GrammarError[]>([]);
  const [correctedText, setCorrectedText] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedback = async () => {
    if (text.trim().length < 50) {
      setError('Write at least 50 words to get AI feedback.');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Run rule check immediately (no API needed)
    const ruleEvaluation = evaluateTask1Email(text, { promptText });
    setRuleResult(ruleEvaluation);

    try {
      const response = await fetch('/api/ai-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, text, action: 'full-enhanced' }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to get feedback');
      }

      const data = await response.json();
      
      if (data.score) {
        setScoreFeedback(data.score);
        
        // Save score to profile stats
        const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        recordPractice(task, wordCount, data.score.score, 5);
      }
      
      if (data.grammarErrors) {
        setGrammarErrors(data.grammarErrors);
      }
      
      if (data.correctedText) {
        setCorrectedText(data.correctedText);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (!scoreFeedback && !isLoading) {
      fetchFeedback();
    }
  };

  const handleClose = () => setIsOpen(false);

  const handleReanalyze = () => {
    setScoreFeedback(null);
    setRuleResult(null);
    setGrammarErrors([]);
    setCorrectedText('');
    fetchFeedback();
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(correctedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyCorrection = (original: string, correction: string) => {
    if (onApplySuggestion) {
      onApplySuggestion(original, correction);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 10) return '#10b981';
    if (score >= 8) return '#34d399';
    if (score >= 6) return '#fbbf24';
    if (score >= 4) return '#fb923c';
    return '#ef4444';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 11) return 'Excellent!';
    if (score >= 9) return 'Very Good';
    if (score >= 7) return 'Good';
    if (score >= 5) return 'Developing';
    return 'Needs Work';
  };

  const getLevelClass = (level: string) => {
    if (level === 'strong') return styles.levelStrong;
    if (level === 'ok') return styles.levelOk;
    return styles.levelWeak;
  };

  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  const isDisabled = wordCount < 50;

  // Combined score (average of AI + Rules)
  const getCombinedScore = () => {
    if (scoreFeedback && ruleResult) {
      return Math.round((scoreFeedback.score + ruleResult.score) / 2);
    }
    return scoreFeedback?.score || ruleResult?.score || 0;
  };

  if (!isOpen) {
    return (
      <button 
        className={`${styles.triggerButton} ${!isPro && !planLoading ? styles.lockedButton : ''}`}
        onClick={handleOpen}
        disabled={isDisabled}
      >
        {isPro ? <Sparkles size={18} /> : <Lock size={18} />}
        <span>AI Score & Feedback</span>
        {!isPro && !planLoading && <span className={styles.proBadge}>PRO</span>}
      </button>
    );
  }

  if (!isPro) {
    return (
      <div className={styles.feedbackPanel}>
        <div className={styles.panelHeader}>
          <div className={styles.panelTitle}>
            <Sparkles size={20} />
            <span>AI Writing Coach</span>
          </div>
          <button className={styles.closeButton} onClick={handleClose}>
            <X size={18} />
          </button>
        </div>
        <ProGate 
          feature="AI Writing Coach" 
          description="Get detailed AI-powered scoring, grammar correction, model answers, and personalized improvement tips. Upgrade to Pro to unlock."
        />
      </div>
    );
  }

  return (
    <div className={styles.feedbackPanel}>
      {/* Header */}
      <div className={styles.panelHeader}>
        <div className={styles.panelTitle}>
          <Sparkles size={20} />
          <span>AI Writing Coach</span>
        </div>
        <button className={styles.closeButton} onClick={handleClose}>
          <X size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'score' ? styles.active : ''}`}
          onClick={() => setActiveTab('score')}
        >
          <Target size={16} />
          Score
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'rules' ? styles.active : ''}`}
          onClick={() => setActiveTab('rules')}
        >
          <ClipboardCheck size={16} />
          Structure
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'grammar' ? styles.active : ''}`}
          onClick={() => setActiveTab('grammar')}
        >
          <AlertCircle size={16} />
          Grammar
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'corrected' ? styles.active : ''}`}
          onClick={() => setActiveTab('corrected')}
        >
          <FileEdit size={16} />
          Model
        </button>
      </div>

      {/* Content */}
      <div className={styles.panelContent}>
        {isLoading ? (
          <div className={styles.loadingState}>
            <Loader2 size={32} className={styles.spinner} />
            <p>Analyzing your writing...</p>
          </div>
        ) : error ? (
          <div className={styles.errorState}>
            <AlertCircle size={24} />
            <p>{error}</p>
            <button onClick={handleReanalyze}>Try Again</button>
          </div>
        ) : activeTab === 'score' ? (
          <div className={styles.scoreSection}>
            {/* Combined Score */}
            <div className={styles.scoreHeader}>
              <div className={styles.scoreCircle} style={{ borderColor: getScoreColor(getCombinedScore()) }}>
                <span className={styles.scoreNumber} style={{ color: getScoreColor(getCombinedScore()) }}>
                  {getCombinedScore()}
                </span>
                <span className={styles.scoreMax}>/ 12</span>
              </div>
              <div className={styles.scoreInfo}>
                <p className={styles.scoreLabel} style={{ color: getScoreColor(getCombinedScore()) }}>
                  {getScoreLabel(getCombinedScore())}
                </p>
                {scoreFeedback && (
                  <p className={styles.scoreSummary}>{scoreFeedback.summary}</p>
                )}
              </div>
            </div>

            {/* Word Count */}
            <div className={styles.wordCountBar}>
              <span>Word Count: <strong>{wordCount}</strong></span>
              <span className={styles.wordCountHint}>(150-200 recommended)</span>
            </div>

            {/* Strengths */}
            {scoreFeedback && scoreFeedback.strengths.length > 0 && (
              <div className={`${styles.feedbackBox} ${styles.successBox}`}>
                <div className={styles.boxHeader}>
                  <CheckCircle size={16} />
                  <span>Strengths</span>
                  <span className={styles.count}>{scoreFeedback.strengths.length}</span>
                </div>
                <ul className={styles.feedbackList}>
                  {scoreFeedback.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Areas to Improve */}
            {scoreFeedback && scoreFeedback.improvements.length > 0 && (
              <div className={`${styles.feedbackBox} ${styles.warningBox}`}>
                <div className={styles.boxHeader}>
                  <Lightbulb size={16} />
                  <span>Areas to Improve</span>
                  <span className={styles.count}>{scoreFeedback.improvements.length}</span>
                </div>
                <ul className={styles.feedbackList}>
                  {scoreFeedback.improvements.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Re-analyze button */}
            <button className={styles.reanalyzeBtn} onClick={handleReanalyze}>
              <RefreshCw size={16} />
              Re-analyze
            </button>
          </div>
        ) : activeTab === 'rules' && ruleResult ? (
          <div className={styles.rulesSection}>
            {/* Rule Score */}
            <div className={styles.ruleScoreHeader}>
              <div className={styles.ruleScoreBox}>
                <span className={styles.ruleScoreValue}>{ruleResult.score}</span>
                <span className={styles.ruleScoreMax}>/12</span>
              </div>
              <span className={`${styles.levelBadge} ${getLevelClass(ruleResult.level)}`}>
                {ruleResult.level === 'strong' ? 'Excellent' : ruleResult.level === 'ok' ? 'Satisfactory' : 'Needs Improvement'}
              </span>
            </div>

            {/* Errors */}
            {ruleResult.errors.length > 0 && (
              <div className={`${styles.feedbackBox} ${styles.errorBox}`}>
                <div className={styles.boxHeader}>
                  <AlertCircle size={16} />
                  <span>Errors</span>
                  <span className={styles.count}>{ruleResult.errors.length}</span>
                </div>
                <ul className={styles.feedbackList}>
                  {ruleResult.errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warnings */}
            {ruleResult.warnings.length > 0 && (
              <div className={`${styles.feedbackBox} ${styles.warningBox}`}>
                <div className={styles.boxHeader}>
                  <AlertTriangle size={16} />
                  <span>Warnings</span>
                  <span className={styles.count}>{ruleResult.warnings.length}</span>
                </div>
                <ul className={styles.feedbackList}>
                  {ruleResult.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {ruleResult.suggestions.length > 0 && (
              <div className={`${styles.feedbackBox} ${styles.infoBox}`}>
                <div className={styles.boxHeader}>
                  <Lightbulb size={16} />
                  <span>Suggestions</span>
                  <span className={styles.count}>{ruleResult.suggestions.length}</span>
                </div>
                <ul className={styles.feedbackList}>
                  {ruleResult.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* All Good */}
            {ruleResult.errors.length === 0 && ruleResult.warnings.length === 0 && (
              <div className={`${styles.feedbackBox} ${styles.successBox}`}>
                <div className={styles.successContent}>
                  <CheckCircle size={20} />
                  <span>Great structure! No critical issues found.</span>
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'grammar' ? (
          <div className={styles.grammarSection}>
            {grammarErrors.length === 0 ? (
              <div className={styles.noErrors}>
                <CheckCircle size={32} />
                <p>No grammar errors detected!</p>
                <span>Your writing looks grammatically correct.</span>
              </div>
            ) : (
              <div className={styles.grammarList}>
                {grammarErrors.map((err, i) => (
                  <div key={i} className={styles.grammarItem}>
                    <div className={styles.grammarOriginal}>
                      <span className={styles.grammarLabel}>Original:</span>
                      <p className={styles.errorText}>{err.sentence}</p>
                    </div>
                    <div className={styles.grammarError}>
                      <AlertCircle size={14} />
                      <span>{err.error}</span>
                    </div>
                    <div className={styles.grammarCorrection}>
                      <span className={styles.grammarLabel}>Correction:</span>
                      <p className={styles.correctionText}>{err.correction}</p>
                      {onApplySuggestion && (
                        <button 
                          className={styles.applyBtn}
                          onClick={() => handleApplyCorrection(err.sentence, err.correction)}
                        >
                          Apply
                        </button>
                      )}
                    </div>
                    <p className={styles.grammarExplanation}>{err.explanation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'corrected' ? (
          <div className={styles.correctedSection}>
            {correctedText ? (
              <>
                <div className={styles.correctedHeader}>
                  <h4>Model Answer</h4>
                  <button 
                    className={styles.copyButton}
                    onClick={handleCopyText}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className={styles.correctedText}>
                  {correctedText}
                </div>
              </>
            ) : (
              <div className={styles.noCorrection}>
                <FileEdit size={32} />
                <p>Model answer will appear here</p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
