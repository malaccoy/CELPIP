'use client';

import React, { useState, useEffect } from 'react';
import { Card, Input, Textarea, Button, WordCounter, FeedbackList } from '@/components/Common';
import ContextSelector, { ContextItem } from '@/components/ContextSelector';
import { Task2State, FeedbackItem, Task2Point } from '@/types';
import { generateTask2Feedback, countWords } from '@/utils/feedback';
import { Save, RefreshCw, Wand2, Trash2, Plus, Minus, FileText, PenTool, MessageSquare, Clock, CheckCircle, AlertCircle, AlertTriangle, Info, ClipboardList } from 'lucide-react';
import styles from '@/styles/TaskPages.module.scss';
import TaskHelpPanel from '@/components/TaskHelpPanel';

const INITIAL_POINT: Task2Point = { point: '', reason: '', example: '' };

const INITIAL_STATE: Task2State = {
  promptText: '',
  audience: '',
  providedArgs: ['', ''],
  position: 'A_FAVOR',
  topic: '',
  opinionLine: '',
  points: [{ ...INITIAL_POINT }, { ...INITIAL_POINT }],
  content: ''
};

export default function Task2Page() {
  const [state, setState] = useState<Task2State>(INITIAL_STATE);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [contexts, setContexts] = useState<ContextItem[]>([]);
  const [selectedContextId, setSelectedContextId] = useState<string | null>(null);

  // Load contexts from JSON
  useEffect(() => {
    fetch('/content/contexts.json')
      .then(res => res.json())
      .then(data => {
        if (data.task2) {
          setContexts(data.task2);
        }
      })
      .catch(err => console.error('Failed to load contexts:', err));
  }, []);

  const handleContextSelect = (context: ContextItem) => {
    setSelectedContextId(context.id);
    if (context.category !== 'custom') {
      updateState('promptText', context.content);
    }
  };

  const wordCount = countWords(state.content);

  const updateState = (field: keyof Task2State, value: Task2State[keyof Task2State]) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const updatePoint = (index: number, field: keyof Task2Point, value: string) => {
    const newPoints = [...state.points];
    newPoints[index] = { ...newPoints[index], [field]: value };
    updateState('points', newPoints);
  };

  const addPoint = () => {
    if (state.points.length < 3) {
      updateState('points', [...state.points, { ...INITIAL_POINT }]);
    }
  };

  const removePoint = () => {
    if (state.points.length > 1) {
      const newPoints = [...state.points];
      newPoints.pop();
      updateState('points', newPoints);
    }
  };

  const generateStructure = () => {
    const intro = `In my opinion, regarding the ${state.topic || 'survey topic'}, I would rather ${state.opinionLine || 'choose option...'}. I believe this is the best choice for several reasons.`;

    let body = '';
    const connectors = ['First', 'Second', 'Finally'];

    state.points.forEach((p, i) => {
      const connector = connectors[i] || 'Additionally';
      body += `\n\n${connector}, ${p.point || '[Point]'}. This is because ${p.reason || '[Reason]'}. For example, ${p.example || '[Example]'}.`;
    });

    const conclusion = `\n\nIn conclusion, considering these reasons, I am convinced that this is the superior option.`;

    updateState('content', intro + body + conclusion);
  };

  const handleEvaluate = () => {
    const results = generateTask2Feedback(state);
    setFeedback(results);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('celpip_last_session', JSON.stringify({
          lastWordCount: wordCount,
          lastTask: 'TASK_2',
          date: new Date().toISOString()
        }));
      } catch {
        // Silently fail
      }
    }
  };

  const handleClear = () => {
    if (confirm('Tem certeza que deseja limpar tudo?')) {
      setState(INITIAL_STATE);
      setFeedback([]);
    }
  };

  const getWordCounterClass = () => {
    if (wordCount < 150) return styles.wordCounterLow;
    if (wordCount <= 200) return styles.wordCounterGood;
    return styles.wordCounterHigh;
  };

  // Map severity + passed to visual type
  const getFeedbackItemClass = (item: FeedbackItem) => {
    if (item.passed) return styles.feedbackItemSuccess;
    switch (item.severity) {
      case 'BLOCKER': return styles.feedbackItemError;
      case 'IMPORTANT': return styles.feedbackItemWarning;
      case 'POLISH': return styles.feedbackItemInfo;
      default: return styles.feedbackItemInfo;
    }
  };

  const getFeedbackIcon = (item: FeedbackItem) => {
    if (item.passed) return <CheckCircle size={16} className="text-green-600" />;
    switch (item.severity) {
      case 'BLOCKER': return <AlertCircle size={16} className="text-red-600" />;
      case 'IMPORTANT': return <AlertTriangle size={16} className="text-amber-600" />;
      case 'POLISH': return <Info size={16} className="text-blue-600" />;
      default: return <Info size={16} className="text-blue-600" />;
    }
  };

  return (
    <div className={styles.taskPageContainer}>
      {/* Mini Hero Section */}
      <div className={styles.miniHero}>
        <div className={styles.miniHeroContent}>
          <div className={styles.miniHeroLeft}>
            <div className={styles.miniHeroIcon}>
              <ClipboardList />
            </div>
            <div className={styles.miniHeroTitle}>
              <h1>Task 2 — <span>Survey Response</span></h1>
              <p><Clock size={14} style={{ display: 'inline', marginRight: 4 }} /> Tempo recomendado: 26 minutos</p>
            </div>
          </div>
          <div className={styles.miniHeroActions}>
            <button onClick={handleClear} className={`${styles.heroBtn} ${styles.heroBtnDanger}`}>
              <Trash2 size={16} /> Limpar
            </button>
            <button className={`${styles.heroBtn} ${styles.heroBtnPrimary}`}>
              <Save size={16} /> Salvar Rascunho
            </button>
          </div>
        </div>
      </div>

      {/* Task Grid */}
      <div className={styles.taskGrid}>
        {/* Column 1: Context */}
        <div className={styles.taskColumn}>
          <div className={styles.glassCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <FileText />
              </div>
              <h3 className={styles.cardTitle}>1. Contexto</h3>
            </div>

            {/* Context Selector Dropdown */}
            {contexts.length > 0 && (
              <ContextSelector
                contexts={contexts}
                selectedId={selectedContextId}
                onSelect={handleContextSelect}
                placeholder="Escolha um tema pronto ou crie o seu..."
              />
            )}

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Enunciado (Survey)</label>
              <textarea
                className={styles.formTextarea}
                placeholder="Cole o enunciado ou selecione um tema acima..."
                rows={4}
                value={state.promptText}
                onChange={e => updateState('promptText', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Quem vai ler? (Audience)</label>
              <input
                className={styles.formInput}
                placeholder="Ex: City Council, HR Department"
                value={state.audience}
                onChange={e => updateState('audience', e.target.value)}
              />
            </div>

            <div className={styles.positionBox}>
              <label className={styles.positionLabel}>Sua Posição</label>
              <div className={styles.positionButtons}>
                <button
                  onClick={() => updateState('position', 'A_FAVOR')}
                  className={`${styles.positionButton} ${state.position === 'A_FAVOR' ? styles.positionButtonActive : styles.positionButtonInactive}`}
                >
                  Opção A
                </button>
                <button
                  onClick={() => updateState('position', 'CONTRA')}
                  className={`${styles.positionButton} ${state.position === 'CONTRA' ? styles.positionButtonActive : styles.positionButtonInactive}`}
                >
                  Opção B
                </button>
              </div>
              <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                <label className={styles.formLabel}>Tema escolhido (Keywords)</label>
                <input
                  className={styles.formInput}
                  placeholder="Ex: building a new park"
                  value={state.topic}
                  onChange={e => updateState('topic', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Planning (PRE) */}
        <div className={styles.taskColumn}>
          <div className={styles.glassCard}>
            <div className={styles.cardHeader}>
              <div className={`${styles.cardIcon} ${styles.cardIconPurple}`}>
                <PenTool />
              </div>
              <h3 className={styles.cardTitle}>2. Planejamento (PRE Structure)</h3>
              <TaskHelpPanel defaultTab="task2" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Opinion Line (Intro)</label>
              <input
                className={styles.formInput}
                placeholder="I would rather..."
                value={state.opinionLine}
                onChange={e => updateState('opinionLine', e.target.value)}
              />
              <div className={styles.tagGroup}>
                {["I would rather...", "I recommend that...", "I believe option A is better because..."].map(suggestion => (
                  <button
                    key={suggestion}
                    className={styles.tag}
                    onClick={() => updateState('opinionLine', suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <div className={styles.argumentsHeader}>
                <h4 className={styles.argumentsTitle}>Argumentos (Points)</h4>
                <div className={styles.argumentsActions}>
                  <button onClick={addPoint} disabled={state.points.length >= 3} className={styles.argumentsButton}>
                    <Plus />
                  </button>
                  <button onClick={removePoint} disabled={state.points.length <= 1} className={styles.argumentsButton}>
                    <Minus />
                  </button>
                </div>
              </div>

              <div style={{ marginTop: '0.75rem' }}>
                {state.points.map((p, idx) => (
                  <div key={idx} className={styles.argumentBlock}>
                    <span className={styles.argumentNumber}>Argumento {idx + 1}</span>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Point (Idea)</label>
                      <input
                        className={styles.formInput}
                        placeholder="Main point..."
                        value={p.point}
                        onChange={e => updatePoint(idx, 'point', e.target.value)}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Reason (Why?)</label>
                      <textarea
                        className={styles.formTextarea}
                        style={{ minHeight: '60px' }}
                        placeholder="Because..."
                        value={p.reason}
                        onChange={e => updatePoint(idx, 'reason', e.target.value)}
                      />
                    </div>
                    <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                      <label className={styles.formLabel}>Example (Specific)</label>
                      <textarea
                        className={styles.formTextarea}
                        style={{ minHeight: '60px' }}
                        placeholder="For example..."
                        value={p.example}
                        onChange={e => updatePoint(idx, 'example', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.conclusionNote}>
                <span>Conclusão Auto:</span> &ldquo;In conclusion... because [Point 1] and [Point 2].&rdquo;
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Writing */}
        <div className={styles.taskColumn}>
          <div className={`${styles.glassCard} ${styles.writingCard}`}>
            <div className={styles.writingHeader}>
              <div className={styles.writingTitleGroup}>
                <div className={`${styles.cardIcon} ${styles.cardIconCyan}`}>
                  <PenTool />
                </div>
                <h3 className={styles.writingTitle}>3. Escrita</h3>
              </div>
              <div className={`${styles.wordCounter} ${getWordCounterClass()}`}>
                <span className={styles.wordCounterIcon}>✍️</span>
                <span>{wordCount} palavras</span>
              </div>
            </div>

            <textarea
              className={styles.writingTextarea}
              placeholder="Comece a escrever aqui..."
              value={state.content}
              onChange={e => updateState('content', e.target.value)}
            />

            <div className={styles.writingActions}>
              <button className={`${styles.actionBtn} ${styles.actionBtnSecondary}`} onClick={generateStructure}>
                <Wand2 /> Gerar Estrutura
              </button>
              <button className={`${styles.actionBtn} ${styles.actionBtnPrimary}`} onClick={handleEvaluate}>
                <RefreshCw /> Avaliar (Regras)
              </button>
            </div>
          </div>

          {/* Feedback Panel */}
          {feedback.length > 0 && (
            <div className={styles.feedbackPanel}>
              <div className={styles.feedbackHeader}>
                <div className={styles.feedbackIcon}>
                  <MessageSquare />
                </div>
                <h3 className={styles.feedbackTitle}>Feedback</h3>
              </div>
              <div className={styles.feedbackList}>
                {feedback.map((item, index) => (
                  <div key={index} className={`${styles.feedbackItem} ${getFeedbackItemClass(item)}`}>
                    <div className={styles.feedbackItemIcon}>
                      {getFeedbackIcon(item)}
                    </div>
                    <div className={styles.feedbackItemContent}>
                      <p>{item.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
