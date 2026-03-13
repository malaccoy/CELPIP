'use client';

import { useState } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb, 
  Award, 
  BookOpen,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Copy,
  Check,
  Loader2
} from 'lucide-react';
import styles from '@/styles/AIEvaluation.module.scss';

interface GrammarError {
  original: string;
  correction: string;
  explanation: string;
  type: 'grammar' | 'spelling' | 'punctuation' | 'style' | 'vocabulary';
}

interface AIEvaluationData {
  overallScore: number;
  scores: {
    content: number;
    vocabulary: number;
    grammar: number;
    structure: number;
  };
  grammarErrors: GrammarError[];
  strengths: string[];
  improvements: string[];
  correctedText: string;
  feedback: string;
}

interface AIEvaluationResultProps {
  evaluation: AIEvaluationData;
  originalText: string;
}

function ScoreGauge({ score, label }: { score: number; label: string }) {
  const percentage = ((score - 4) / 8) * 100; // 4-12 scale to 0-100%
  const getColor = (s: number) => {
    if (s >= 10) return '#10b981'; // green
    if (s >= 8) return '#6366f1'; // indigo
    if (s >= 6) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  return (
    <div className={styles.scoreGauge}>
      <div className={styles.gaugeLabel}>{label}</div>
      <div className={styles.gaugeBar}>
        <div 
          className={styles.gaugeFill} 
          style={{ 
            width: `${percentage}%`,
            backgroundColor: getColor(score)
          }} 
        />
      </div>
      <div className={styles.gaugeScore} style={{ color: getColor(score) }}>
        {score}/12
      </div>
    </div>
  );
}

function GrammarErrorCard({ error }: { error: GrammarError }) {
  const typeIcons: Record<string, string> = {
    grammar: '📝',
    spelling: '🔤',
    punctuation: '✏️',
    style: '🎨',
    vocabulary: '📚'
  };

  const typeLabels: Record<string, string> = {
    grammar: 'Gramática',
    spelling: 'Ortografia',
    punctuation: 'Pontuação',
    style: 'Estilo',
    vocabulary: 'Vocabulário'
  };

  return (
    <div className={styles.errorCard}>
      <div className={styles.errorHeader}>
        <span className={styles.errorType}>
          {typeIcons[error.type]} {typeLabels[error.type]}
        </span>
      </div>
      <div className={styles.errorContent}>
        <div className={styles.errorOriginal}>
          <span className={styles.label}>Original:</span>
          <span className={styles.wrongText}>{error.original}</span>
        </div>
        <div className={styles.errorCorrection}>
          <span className={styles.label}>Correção:</span>
          <span className={styles.correctText}>{error.correction}</span>
        </div>
        <div className={styles.errorExplanation}>
          <Lightbulb size={14} />
          <span>{error.explanation}</span>
        </div>
      </div>
    </div>
  );
}

export default function AIEvaluationResult({ evaluation, originalText }: AIEvaluationResultProps) {
  const [showCorrected, setShowCorrected] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    grammar: true,
    strengths: true,
    improvements: true,
    feedback: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const getScoreLabel = (score: number) => {
    if (score >= 11) return { label: 'Excelente!', emoji: '🏆' };
    if (score >= 9) return { label: 'Muito Bom', emoji: '⭐' };
    if (score >= 7) return { label: 'Bom', emoji: '👍' };
    if (score >= 5) return { label: 'Regular', emoji: '📈' };
    return { label: 'Precisa Melhorar', emoji: '💪' };
  };

  const { label: scoreLabel, emoji: scoreEmoji } = getScoreLabel(evaluation.overallScore);

  return (
    <div className={styles.container}>
      {/* Overall Score */}
      <div className={styles.overallScore}>
        <div className={styles.scoreCircle}>
          <span className={styles.scoreNumber}>{evaluation.overallScore}</span>
          <span className={styles.scoreMax}>/12</span>
        </div>
        <div className={styles.scoreInfo}>
          <span className={styles.scoreEmoji}>{scoreEmoji}</span>
          <span className={styles.scoreLabel}>{scoreLabel}</span>
        </div>
      </div>

      {/* Detailed Scores */}
      <div className={styles.scoresGrid}>
        <ScoreGauge score={evaluation.scores.content} label="Conteúdo" />
        <ScoreGauge score={evaluation.scores.vocabulary} label="Vocabulário" />
        <ScoreGauge score={evaluation.scores.grammar} label="Gramática" />
        <ScoreGauge score={evaluation.scores.structure} label="Estrutura" />
      </div>

      {/* Grammar Errors Section */}
      {evaluation.grammarErrors.length > 0 && (
        <div className={styles.section}>
          <button 
            className={styles.sectionHeader}
            onClick={() => toggleSection('grammar')}
          >
            <div className={styles.sectionTitle}>
              <AlertTriangle size={18} className={styles.iconWarning} />
              <span>Correções Gramaticais ({evaluation.grammarErrors.length})</span>
            </div>
            {expandedSections.grammar ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {expandedSections.grammar && (
            <div className={styles.sectionContent}>
              <div className={styles.errorsGrid}>
                {evaluation.grammarErrors.map((error, index) => (
                  <GrammarErrorCard key={index} error={error} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Strengths Section */}
      {evaluation.strengths.length > 0 && (
        <div className={styles.section}>
          <button 
            className={styles.sectionHeader}
            onClick={() => toggleSection('strengths')}
          >
            <div className={styles.sectionTitle}>
              <Award size={18} className={styles.iconSuccess} />
              <span>Pontos Fortes ({evaluation.strengths.length})</span>
            </div>
            {expandedSections.strengths ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {expandedSections.strengths && (
            <div className={styles.sectionContent}>
              <ul className={styles.strengthsList}>
                {evaluation.strengths.map((strength, index) => (
                  <li key={index}>
                    <CheckCircle size={16} className={styles.iconSuccess} />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Improvements Section */}
      {evaluation.improvements.length > 0 && (
        <div className={styles.section}>
          <button 
            className={styles.sectionHeader}
            onClick={() => toggleSection('improvements')}
          >
            <div className={styles.sectionTitle}>
              <Lightbulb size={18} className={styles.iconTip} />
              <span>Sugestões de Melhoria ({evaluation.improvements.length})</span>
            </div>
            {expandedSections.improvements ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {expandedSections.improvements && (
            <div className={styles.sectionContent}>
              <ul className={styles.improvementsList}>
                {evaluation.improvements.map((improvement, index) => (
                  <li key={index}>
                    <span className={styles.improvementNumber}>{index + 1}</span>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Feedback Section */}
      <div className={styles.section}>
        <button 
          className={styles.sectionHeader}
          onClick={() => toggleSection('feedback')}
        >
          <div className={styles.sectionTitle}>
            <BookOpen size={18} className={styles.iconPrimary} />
            <span>Feedback do Professor</span>
          </div>
          {expandedSections.feedback ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.feedback && (
          <div className={styles.sectionContent}>
            <div className={styles.feedbackBox}>
              {evaluation.feedback.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Corrected Text Section */}
      <div className={styles.correctedSection}>
        <button 
          className={styles.correctedToggle}
          onClick={() => setShowCorrected(!showCorrected)}
        >
          <Sparkles size={18} />
          <span>{showCorrected ? 'Esconder' : 'Ver'} Texto Corrigido</span>
          {showCorrected ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        
        {showCorrected && (
          <div className={styles.correctedContent}>
            <div className={styles.correctedHeader}>
              <span>Texto com correções aplicadas:</span>
              <button 
                className={styles.copyButton}
                onClick={() => copyToClipboard(evaluation.correctedText)}
              >
                {copiedText ? <Check size={16} /> : <Copy size={16} />}
                {copiedText ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
            <div className={styles.correctedText}>
              {evaluation.correctedText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Loading component for when evaluation is in progress
export function AIEvaluationLoading() {
  return (
    <div className={styles.loadingContainer}>
      <Loader2 className={styles.loadingSpinner} size={48} />
      <h3>Analisando seu texto...</h3>
      <p>The AI is evaluating grammar, structure, and content.</p>
      <p className={styles.loadingTip}>This may take a few seconds.</p>
    </div>
  );
}
