'use client';

import React, { useState, useCallback } from 'react';
import {
  Sparkles, Send, BarChart3, Wand2, FileCheck, AlertTriangle,
  Loader2, ChevronDown, ChevronUp, ArrowRight, Copy, Check,
  BookOpen, Target, TrendingUp, Lightbulb, Clock, FileText
} from 'lucide-react';
import { usePlan } from '@/hooks/usePlan';
import { ProGate } from '@/components/ProGate';
import styles from '@/styles/AIWritingTutor.module.scss';

type TaskType = 'task1' | 'task2';
type AnalysisAction = 'full-enhanced';

interface ScoreFeedback {
  score: number;
  maxScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  nextLevelTip: string;
}

interface MakeItRealSuggestion {
  category: string;
  original: string;
  suggestion: string;
  explanation: string;
}

interface GrammarError {
  sentence: string;
  error: string;
  correction: string;
  explanation: string;
}

interface AnalysisResult {
  score?: ScoreFeedback;
  makeItReal?: MakeItRealSuggestion[];
  correctedText?: string;
  grammarErrors?: GrammarError[];
}

const CATEGORY_ICONS: Record<string, string> = {
  name: '👤',
  place: '📍',
  number: '🔢',
  date: '📅',
  detail: '🎯',
};

export default function AIWritingTutorPage() {
  const { isPro, loading: planLoading } = usePlan();

  const [taskType, setTaskType] = useState<TaskType>('task1');
  const [text, setText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Collapsible sections
  const [openSections, setOpenSections] = useState({
    score: true,
    grammar: true,
    makeItReal: true,
    corrected: false,
  });

  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const copyText = useCallback((t: string) => {
    navigator.clipboard.writeText(t);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const analyze = async () => {
    if (text.trim().length < 50) {
      setError('Write at least 50 words before analyzing.');
      return;
    }

    setAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/ai-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: taskType,
          text,
          action: 'full-enhanced' as AnalysisAction,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed (${res.status})`);
      }

      const data: AnalysisResult = await res.json();
      setResult(data);
      setOpenSections({ score: true, grammar: true, makeItReal: true, corrected: false });
    } catch (err: any) {
      setError(err.message || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  if (planLoading) return null;

  if (!isPro) {
    return (
      <div className={styles.container}>
        <ProGate
          feature="AI Writing Tutor"
          description="Get AI-powered scoring (1-12), grammar correction, 'Make It Real' suggestions, and a model answer — all in one click."
        />
      </div>
    );
  }

  const scoreColor = result?.score
    ? result.score.score >= 10 ? '#34d399'
      : result.score.score >= 7 ? '#fbbf24'
        : '#f87171'
    : '#6366f1';

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.badge}>
          <Sparkles size={13} />
          AI Coach
        </div>
        <h1 className={styles.title}>Writing Tutor</h1>
        <p className={styles.subtitle}>
          Full AI analysis — score, grammar, specificity tips, and a model answer
        </p>
      </div>

      {/* Task Type Toggle */}
      <div className={styles.taskToggle}>
        <button
          className={`${styles.taskBtn} ${taskType === 'task1' ? styles.taskBtnActive : ''}`}
          onClick={() => setTaskType('task1')}
        >
          <FileText size={15} />
          Task 1 — Email
        </button>
        <button
          className={`${styles.taskBtn} ${taskType === 'task2' ? styles.taskBtnActive : ''}`}
          onClick={() => setTaskType('task2')}
        >
          <BookOpen size={15} />
          Task 2 — Opinion
        </button>
      </div>

      {/* Input */}
      <div className={styles.inputCard}>
        <div className={styles.inputHeader}>
          <span className={styles.inputLabel}>Your {taskType === 'task1' ? 'Email' : 'Essay'}</span>
          <span className={styles.wordCount} style={{ color: wordCount >= 150 && wordCount <= 200 ? '#34d399' : wordCount > 0 ? '#fbbf24' : undefined }}>
            {wordCount} words
          </span>
        </div>
        <textarea
          className={styles.textarea}
          placeholder={taskType === 'task1'
            ? 'Paste or type your email here...\n\nDear Mr. Johnson,\n\nI am writing to...'
            : 'Paste or type your essay here...\n\nIn my opinion...'}
          value={text}
          onChange={e => setText(e.target.value)}
          rows={10}
        />
        <button
          className={analyzing ? styles.analyzeLoading : styles.analyzeBtn}
          onClick={analyze}
          disabled={analyzing || wordCount < 10}
        >
          {analyzing ? (
            <>
              <Loader2 size={18} className={styles.spinner} />
              Analyzing with AI...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Analyze My Writing
            </>
          )}
        </button>
      </div>

      {error && (
        <div className={styles.errorMsg}>{error}</div>
      )}

      {/* ─── Results ─── */}
      {result && (
        <div className={styles.results}>

          {/* 1. SCORE */}
          {result.score && (
            <div className={styles.section}>
              <button className={styles.sectionHeader} onClick={() => toggleSection('score')}>
                <div className={styles.sectionHeaderLeft}>
                  <Target size={18} style={{ color: scoreColor }} />
                  <span className={styles.sectionTitle}>Score Prediction</span>
                </div>
                {openSections.score ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openSections.score && (
                <div className={styles.sectionBody}>
                  {/* Big score */}
                  <div className={styles.scoreCircle} style={{ '--score-color': scoreColor } as React.CSSProperties}>
                    <span className={styles.scoreNum}>{result.score.score}</span>
                    <span className={styles.scoreMax}>/ 12</span>
                  </div>
                  <p className={styles.scoreSummary}>{result.score.summary}</p>

                  {/* Strengths */}
                  {result.score.strengths.length > 0 && (
                    <div className={styles.feedbackGroup}>
                      <h4 className={styles.feedbackLabel}>
                        <Check size={15} style={{ color: '#34d399' }} /> Strengths
                      </h4>
                      <ul className={styles.feedbackList}>
                        {result.score.strengths.map((s, i) => (
                          <li key={i} className={styles.strengthItem}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Improvements */}
                  {result.score.improvements.length > 0 && (
                    <div className={styles.feedbackGroup}>
                      <h4 className={styles.feedbackLabel}>
                        <TrendingUp size={15} style={{ color: '#fbbf24' }} /> Areas to Improve
                      </h4>
                      <ul className={styles.feedbackList}>
                        {result.score.improvements.map((s, i) => (
                          <li key={i} className={styles.improvementItem}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Next Level Tip */}
                  {result.score.nextLevelTip && (
                    <div className={styles.tipCard}>
                      <Lightbulb size={16} style={{ color: '#a78bfa', flexShrink: 0 }} />
                      <span>{result.score.nextLevelTip}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 2. GRAMMAR ERRORS */}
          {result.grammarErrors && result.grammarErrors.length > 0 && (
            <div className={styles.section}>
              <button className={styles.sectionHeader} onClick={() => toggleSection('grammar')}>
                <div className={styles.sectionHeaderLeft}>
                  <AlertTriangle size={18} style={{ color: '#f87171' }} />
                  <span className={styles.sectionTitle}>Grammar Issues</span>
                  <span className={styles.countBadge}>{result.grammarErrors.length}</span>
                </div>
                {openSections.grammar ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openSections.grammar && (
                <div className={styles.sectionBody}>
                  {result.grammarErrors.map((err, i) => (
                    <div key={i} className={styles.grammarItem}>
                      <div className={styles.grammarOriginal}>
                        <span className={styles.grammarLabel}>Original:</span>
                        <span className={styles.grammarText}>{err.sentence}</span>
                      </div>
                      <div className={styles.grammarCorrected}>
                        <span className={styles.grammarLabel}>Corrected:</span>
                        <span className={styles.grammarText}>{err.correction}</span>
                      </div>
                      <div className={styles.grammarExplanation}>
                        {err.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. MAKE IT REAL */}
          {result.makeItReal && result.makeItReal.length > 0 && (
            <div className={styles.section}>
              <button className={styles.sectionHeader} onClick={() => toggleSection('makeItReal')}>
                <div className={styles.sectionHeaderLeft}>
                  <Wand2 size={18} style={{ color: '#c084fc' }} />
                  <span className={styles.sectionTitle}>Make It Real</span>
                  <span className={styles.countBadge}>{result.makeItReal.length}</span>
                </div>
                {openSections.makeItReal ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openSections.makeItReal && (
                <div className={styles.sectionBody}>
                  <p className={styles.sectionDesc}>
                    Replace generic phrases with specific details to boost your score.
                  </p>
                  {result.makeItReal.map((s, i) => (
                    <div key={i} className={styles.realItem}>
                      <span className={styles.realCategory}>
                        {CATEGORY_ICONS[s.category] || '✨'} {s.category}
                      </span>
                      <div className={styles.realComparison}>
                        <div className={styles.realBefore}>
                          <span className={styles.realLabel}>Before:</span>
                          <span>{s.original}</span>
                        </div>
                        <ArrowRight size={14} className={styles.realArrow} />
                        <div className={styles.realAfter}>
                          <span className={styles.realLabel}>After:</span>
                          <span>{s.suggestion}</span>
                        </div>
                      </div>
                      <p className={styles.realExplanation}>{s.explanation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. CORRECTED TEXT */}
          {result.correctedText && (
            <div className={styles.section}>
              <button className={styles.sectionHeader} onClick={() => toggleSection('corrected')}>
                <div className={styles.sectionHeaderLeft}>
                  <FileCheck size={18} style={{ color: '#34d399' }} />
                  <span className={styles.sectionTitle}>Model Answer (11-12)</span>
                </div>
                {openSections.corrected ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openSections.corrected && (
                <div className={styles.sectionBody}>
                  <p className={styles.sectionDesc}>
                    Your text rewritten to score 11-12. Compare with yours to learn.
                  </p>
                  <div className={styles.modelAnswer}>
                    <pre className={styles.modelText}>{result.correctedText}</pre>
                    <button
                      className={styles.copyBtn}
                      onClick={() => copyText(result.correctedText!)}
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Try Again */}
          <button
            className={styles.tryAgainBtn}
            onClick={() => { setResult(null); setText(''); }}
          >
            Try Another Text
          </button>
        </div>
      )}
    </div>
  );
}
