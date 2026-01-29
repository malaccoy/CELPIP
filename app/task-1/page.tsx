'use client';

import React, { useState } from 'react';
import { Card, Input, Textarea, Button, WordCounter, FeedbackList } from '@/components/Common';
import { Task1State, FeedbackItem } from '@/types';
import { generateTask1Feedback, countWords } from '@/utils/feedback';
import { Save, RefreshCw, Wand2, Trash2, Mail, FileText, PenTool, MessageSquare, Clock, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import styles from '@/styles/TaskPages.module.scss';

const INITIAL_STATE: Task1State = {
  promptText: '',
  recipient: '',
  formality: 'Formal',
  questions: ['', '', '', ''],
  opening: '',
  whoAmI: '',
  whyWriting: '',
  bodyStructure: ['First', 'Second', 'Third'],
  cta: '',
  pleaseLetMeKnow: 'Please let me know if you require any further information.',
  signOff: '',
  content: ''
};

export default function Task1Page() {
  const [state, setState] = useState<Task1State>(INITIAL_STATE);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);

  const wordCount = countWords(state.content);

  const updateState = (field: keyof Task1State, value: Task1State[keyof Task1State]) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const updateQuestion = (index: number, value: string) => {
    const newQuestions = [...state.questions];
    newQuestions[index] = value;
    updateState('questions', newQuestions);
  };

  const generateTemplate = () => {
    const template = `Dear ${state.recipient || '[Name]'},

I am writing to ${state.whyWriting || '[reason]'}. My name is ${state.whoAmI || '[Name]'} and I am a resident/customer...

First of all, regarding ${state.questions[0] || 'the first point'}, I would like to say...

Secondly, ${state.questions[1] ? `about ${state.questions[1]}, ` : ''}...

Thirdly, ${state.questions[2] ? `concerning ${state.questions[2]}, ` : ''}...

${state.cta ? state.cta + '.' : ''} ${state.pleaseLetMeKnow}

${state.signOff || 'Regards,\n[My Name]'}`;

    updateState('content', template);
  };

  const handleEvaluate = () => {
    const results = generateTask1Feedback(state);
    setFeedback(results);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('celpip_last_session', JSON.stringify({
          lastWordCount: wordCount,
          lastTask: 'TASK_1',
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
              <Mail />
            </div>
            <div className={styles.miniHeroTitle}>
              <h1>Task 1 — <span>Email Writing</span></h1>
              <p><Clock size={14} style={{ display: 'inline', marginRight: 4 }} /> Tempo recomendado: 27 minutos</p>
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
              <h3 className={styles.cardTitle}>1. Contexto do Enunciado</h3>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Enunciado da Tarefa</label>
              <textarea
                className={styles.formTextarea}
                placeholder="Cole o enunciado aqui..."
                rows={4}
                value={state.promptText}
                onChange={e => updateState('promptText', e.target.value)}
              />
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Destinatário (WHO)</label>
                <input
                  className={styles.formInput}
                  placeholder="Ex: Manager, Mr. Smith"
                  value={state.recipient}
                  onChange={e => updateState('recipient', e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Formalidade</label>
                <select
                  className={styles.formSelect}
                  value={state.formality}
                  onChange={e => updateState('formality', e.target.value as 'Formal' | 'Semi-formal')}
                >
                  <option value="Formal">Formal</option>
                  <option value="Semi-formal">Semi-formal</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Perguntas do Enunciado</label>
              {state.questions.map((q, i) => (
                <input
                  key={i}
                  className={styles.formInput}
                  style={{ marginTop: i > 0 ? '0.5rem' : 0 }}
                  placeholder={`Pergunta ${i + 1}`}
                  value={q}
                  onChange={e => updateQuestion(i, e.target.value)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Planning */}
        <div className={styles.taskColumn}>
          <div className={styles.glassCard}>
            <div className={styles.cardHeader}>
              <div className={`${styles.cardIcon} ${styles.cardIconPurple}`}>
                <PenTool />
              </div>
              <h3 className={styles.cardTitle}>2. Planejamento</h3>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Abertura (Dear...)</label>
              <input
                className={styles.formInput}
                placeholder="Dear Mr. Silva,"
                value={state.opening}
                onChange={e => updateState('opening', e.target.value)}
              />
              <div className={styles.tagGroup}>
                {["Dear Mr. Silva,", "Dear Manager,", "To Whom It May Concern,"].map(suggestion => (
                  <button
                    key={suggestion}
                    className={styles.tag}
                    onClick={() => updateState('opening', suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Quem sou eu (1 frase)</label>
              <input
                className={styles.formInput}
                placeholder="Ex: I am a resident of building B."
                value={state.whoAmI}
                onChange={e => updateState('whoAmI', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Por que estou escrevendo (Purpose)</label>
              <input
                className={styles.formInput}
                placeholder="Ex: I am writing to complain about..."
                value={state.whyWriting}
                onChange={e => updateState('whyWriting', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Estrutura do Corpo</label>
              <div className={styles.tagGroup}>
                {["First", "Second", "Third", "Finally"].map(tag => (
                  <span key={tag} className={`${styles.tag} ${styles.tagActive}`}>{tag}</span>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>CTA / Pedido / Sugestão (Opcional)</label>
              <input
                className={styles.formInput}
                placeholder="I would suggest that..."
                value={state.cta}
                onChange={e => updateState('cta', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Closing Line (Obrigatório)</label>
              <input
                className={styles.formInput}
                value={state.pleaseLetMeKnow}
                onChange={e => updateState('pleaseLetMeKnow', e.target.value)}
              />
              <div className={styles.tagGroup}>
                {[
                  "Please let me know if you have any questions.",
                  "I look forward to hearing from you."
                ].map(suggestion => (
                  <button
                    key={suggestion}
                    className={styles.tag}
                    onClick={() => updateState('pleaseLetMeKnow', suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Assinatura</label>
              <input
                className={styles.formInput}
                placeholder="Regards, [Full Name]"
                value={state.signOff}
                onChange={e => updateState('signOff', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Column 3: Writing & Feedback */}
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
              <button className={`${styles.actionBtn} ${styles.actionBtnSecondary}`} onClick={generateTemplate}>
                <Wand2 /> Template
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
