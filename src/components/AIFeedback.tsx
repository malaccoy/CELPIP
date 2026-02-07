'use client';

import { useState } from 'react';
import { Sparkles, Target, TrendingUp, AlertCircle, Lightbulb, ChevronDown, ChevronUp, Loader2, X, MapPin, User, Hash, Calendar, FileText } from 'lucide-react';
import styles from '@/styles/AIFeedback.module.scss';

interface ScoreFeedback {
  score: number;
  maxScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  nextLevelTip: string;
}

interface MakeItRealSuggestion {
  category: 'name' | 'place' | 'number' | 'date' | 'detail';
  original: string;
  suggestion: string;
  explanation: string;
}

interface AIFeedbackProps {
  task: 'task1' | 'task2';
  text: string;
  onApplySuggestion?: (original: string, replacement: string) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  name: <User size={16} />,
  place: <MapPin size={16} />,
  number: <Hash size={16} />,
  date: <Calendar size={16} />,
  detail: <FileText size={16} />,
};

const categoryColors: Record<string, string> = {
  name: '#818cf8',
  place: '#34d399',
  number: '#fbbf24',
  date: '#f472b6',
  detail: '#60a5fa',
};

export default function AIFeedback({ task, text, onApplySuggestion }: AIFeedbackProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'score' | 'make-it-real'>('score');
  const [scoreFeedback, setScoreFeedback] = useState<ScoreFeedback | null>(null);
  const [suggestions, setSuggestions] = useState<MakeItRealSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Get or create session ID for anonymous tracking
  const getSessionId = (): string => {
    if (typeof window === 'undefined') return '';
    let sessionId = localStorage.getItem('celpip_session_id');
    if (!sessionId) {
      sessionId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('celpip_session_id', sessionId);
    }
    return sessionId;
  };

  // Save analysis for progress tracking
  const saveAnalysisToProgress = async (score: ScoreFeedback, makeItReal?: MakeItRealSuggestion[]) => {
    try {
      await fetch('/api/writing-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: getSessionId(),
          taskType: task,
          content: text,
          aiScore: score.score,
          wordCount: text.split(/\s+/).length,
          scoreFeedback: score,
          // Detect patterns
          hasContractions: /\b(don't|can't|won't|isn't|aren't|I'm|I'll|we're|they're|it's|that's|there's|couldn't|wouldn't|shouldn't)\b/i.test(text),
          hasOrgWords: /\b(first|second|third|finally|furthermore|moreover|additionally|however|therefore|consequently)\b/i.test(text),
          hasSpecificDetails: makeItReal ? makeItReal.length < 3 : false, // fewer suggestions = more details already
          hasProperClosing: /please let me know|if you (have any|require|need)/i.test(text),
        }),
      });
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  };

  const fetchFeedback = async (action: 'score' | 'make-it-real' | 'full') => {
    if (text.trim().length < 50) {
      setError('Write at least 50 words to get AI feedback.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, text, action }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to get feedback');
      }

      const data = await response.json();
      
      if (data.score) {
        setScoreFeedback(data.score);
        
        // Save analysis for progress tracking
        saveAnalysisToProgress(data.score, data.makeItReal);
      }
      if (data.makeItReal) {
        setSuggestions(data.makeItReal);
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
      fetchFeedback('full');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
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

  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  const isDisabled = wordCount < 50;

  if (!isOpen) {
    return (
      <button 
        className={styles.triggerButton} 
        onClick={handleOpen}
        disabled={isDisabled}
      >
        <Sparkles size={18} />
        <span>AI Score & Feedback</span>
      </button>
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
          Score Predictor
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'make-it-real' ? styles.active : ''}`}
          onClick={() => setActiveTab('make-it-real')}
        >
          <Lightbulb size={16} />
          Make It Real
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
            <button onClick={() => fetchFeedback('full')}>Try Again</button>
          </div>
        ) : activeTab === 'score' && scoreFeedback ? (
          <div className={styles.scoreSection}>
            {/* Score Circle */}
            <div className={styles.scoreCircle} style={{ borderColor: getScoreColor(scoreFeedback.score) }}>
              <span className={styles.scoreNumber} style={{ color: getScoreColor(scoreFeedback.score) }}>
                {scoreFeedback.score}
              </span>
              <span className={styles.scoreMax}>/ {scoreFeedback.maxScore}</span>
            </div>
            <p className={styles.scoreLabel} style={{ color: getScoreColor(scoreFeedback.score) }}>
              {getScoreLabel(scoreFeedback.score)}
            </p>
            <p className={styles.scoreSummary}>{scoreFeedback.summary}</p>

            {/* Strengths */}
            <div className={styles.feedbackSection}>
              <h4>
                <span className={styles.greenDot} />
                Strengths
              </h4>
              <ul>
                {scoreFeedback.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div className={styles.feedbackSection}>
              <h4>
                <span className={styles.yellowDot} />
                Areas to Improve
              </h4>
              <ul>
                {scoreFeedback.improvements.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Next Level Tip */}
            <div className={styles.nextLevelTip}>
              <TrendingUp size={18} />
              <div>
                <span className={styles.tipLabel}>To reach {Math.min(scoreFeedback.score + 1, 12)}/12:</span>
                <p>{scoreFeedback.nextLevelTip}</p>
              </div>
            </div>
          </div>
        ) : activeTab === 'make-it-real' ? (
          <div className={styles.makeItRealSection}>
            {suggestions.length === 0 ? (
              <div className={styles.noSuggestions}>
                <Lightbulb size={32} />
                <p>Your text already has good specific details!</p>
                <span>Or write more content to get suggestions.</span>
              </div>
            ) : (
              <>
                <p className={styles.sectionIntro}>
                  Make your writing more realistic with specific details:
                </p>
                <div className={styles.suggestionsList}>
                  {suggestions.map((suggestion, index) => (
                    <div 
                      key={index} 
                      className={styles.suggestionCard}
                      style={{ borderLeftColor: categoryColors[suggestion.category] }}
                    >
                      <div className={styles.suggestionHeader}>
                        <span 
                          className={styles.categoryBadge}
                          style={{ 
                            backgroundColor: `${categoryColors[suggestion.category]}20`,
                            color: categoryColors[suggestion.category] 
                          }}
                        >
                          {categoryIcons[suggestion.category]}
                          {suggestion.category}
                        </span>
                      </div>
                      
                      <div className={styles.suggestionChange}>
                        <span className={styles.originalText}>"{suggestion.original}"</span>
                        <span className={styles.arrow}>→</span>
                        <span className={styles.newText}>"{suggestion.suggestion}"</span>
                      </div>
                      
                      <p className={styles.explanation}>{suggestion.explanation}</p>
                      
                      {onApplySuggestion && (
                        <button 
                          className={styles.applyButton}
                          onClick={() => onApplySuggestion(suggestion.original, suggestion.suggestion)}
                        >
                          Apply
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>Click "Analyze" to get AI feedback on your writing.</p>
            <button onClick={() => fetchFeedback('full')}>Analyze My Writing</button>
          </div>
        )}
      </div>

      {/* Refresh Button */}
      {(scoreFeedback || suggestions.length > 0) && !isLoading && (
        <button className={styles.refreshButton} onClick={() => fetchFeedback('full')}>
          <Loader2 size={14} />
          Re-analyze
        </button>
      )}
    </div>
  );
}
