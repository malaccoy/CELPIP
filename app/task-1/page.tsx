'use client';

import React, { useState } from 'react';
import { Card, Input, Textarea, Button, WordCounter, FeedbackList } from '@/components/Common';
import { Task1State, FeedbackItem } from '@/types';
import { generateTask1Feedback, countWords } from '@/utils/feedback';
import { Save, RefreshCw, Wand2, Trash2 } from 'lucide-react';
import styles from '@/styles/Pages.module.scss';

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

    // Save minimal stats (guard for SSR safety)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('celpip_last_session', JSON.stringify({
          lastWordCount: wordCount,
          lastTask: 'TASK_1',
          date: new Date().toISOString()
        }));
      } catch {
        // Silently fail if localStorage is not available
      }
    }
  };

  const handleClear = () => {
    if (confirm('Tem certeza que deseja limpar tudo?')) {
      setState(INITIAL_STATE);
      setFeedback([]);
    }
  };

  return (
    <div className={styles.taskContainer}>
      <div className={styles.taskHeader}>
        <div className={styles.taskTitle}>
          <h2>Task 1 — Email Writing</h2>
          <p>Tempo recomendado: 27 minutos</p>
        </div>
        <div className={styles.taskActions}>
          <Button variant="ghost" onClick={handleClear} className={styles.taskDeleteBtn}>
            <Trash2 size={16} /> Limpar
          </Button>
          <Button variant="outline" onClick={() => { /* Save draft logic placeholder */ }}>
            <Save size={16} /> Salvar Rascunho
          </Button>
        </div>
      </div>

      <div className={styles.taskGrid}>
        {/* Column 1: Context */}
        <div className={styles.taskColumn}>
          <Card title="1. Contexto do Enunciado">
            <Textarea
              label="Enunciado da Tarefa"
              placeholder="Cole o enunciado aqui..."
              rows={4}
              value={state.promptText}
              onChange={e => updateState('promptText', e.target.value)}
            />

            <div className={styles.formGrid}>
              <Input
                label="Destinatário (WHO)"
                placeholder="Ex: Manager, Mr. Smith"
                value={state.recipient}
                onChange={e => updateState('recipient', e.target.value)}
              />
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.25rem' }}>Formalidade</label>
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

            <div className={styles.questionsContainer}>
              <label className={styles.questionsLabel}>Perguntas do Enunciado</label>
              {state.questions.map((q, i) => (
                <input
                  key={i}
                  className={styles.questionInput}
                  placeholder={`Pergunta ${i + 1}`}
                  value={q}
                  onChange={e => updateQuestion(i, e.target.value)}
                />
              ))}
            </div>
          </Card>
        </div>

        {/* Column 2: Planning */}
        <div className={styles.taskColumn}>
          <Card title="2. Planejamento">
            <Input
              label="Abertura (Dear...)"
              value={state.opening}
              onChange={e => updateState('opening', e.target.value)}
              suggestions={["Dear Mr. Silva,", "Dear Manager,", "To Whom It May Concern,"]}
              onSuggestionClick={val => updateState('opening', val)}
            />

            <Input
              label="Quem sou eu (1 frase)"
              placeholder="Ex: I am a resident of building B."
              value={state.whoAmI}
              onChange={e => updateState('whoAmI', e.target.value)}
            />

            <Input
              label="Por que estou escrevendo (Purpose)"
              placeholder="Ex: I am writing to complain about..."
              value={state.whyWriting}
              onChange={e => updateState('whyWriting', e.target.value)}
            />

            <div className={styles.bodyStructure}>
              <span>Estrutura do Corpo</span>
              <div className={styles.bodyStructureTags}>
                {["First", "Second", "Third", "Finally"].map(tag => (
                  <span key={tag} className={styles.bodyStructureTag}>{tag}</span>
                ))}
              </div>
            </div>

            <Input
              label="CTA / Pedido / Sugestão (Opcional)"
              placeholder="I would suggest that..."
              value={state.cta}
              onChange={e => updateState('cta', e.target.value)}
            />

            <Input
              label="Closing Line (Obrigatório)"
              value={state.pleaseLetMeKnow}
              onChange={e => updateState('pleaseLetMeKnow', e.target.value)}
              suggestions={[
                "Please let me know if you have any questions.",
                "I look forward to hearing from you."
              ]}
              onSuggestionClick={val => updateState('pleaseLetMeKnow', val)}
            />

            <Input
              label="Assinatura"
              placeholder="Regards, [Full Name]"
              value={state.signOff}
              onChange={e => updateState('signOff', e.target.value)}
            />
          </Card>
        </div>

        {/* Column 3: Writing & Feedback */}
        <div className={styles.taskColumnFlex}>
          <Card className={styles.writingCard}>
            <div className={styles.writingHeader}>
              <h3 className={styles.writingTitle}>3. Escrita</h3>
              <WordCounter count={wordCount} />
            </div>

            <textarea
              className={styles.writingTextarea}
              placeholder="Comece a escrever aqui..."
              value={state.content}
              onChange={e => updateState('content', e.target.value)}
            />

            <div className={styles.writingActions}>
              <Button variant="secondary" onClick={generateTemplate} title="Preencher com base no plano">
                <Wand2 size={16} /> Template
              </Button>
              <Button style={{ flex: 1 }} onClick={handleEvaluate}>
                <RefreshCw size={16} /> Avaliar (Regras)
              </Button>
            </div>
          </Card>

          {/* Feedback Panel */}
          {feedback.length > 0 && (
            <Card title="Feedback" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
              <FeedbackList items={feedback} />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
