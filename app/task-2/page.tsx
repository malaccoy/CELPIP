'use client';

import React, { useState } from 'react';
import { Card, Input, Textarea, Button, WordCounter, FeedbackList } from '@/components/Common';
import { Task2State, FeedbackItem, Task2Point } from '@/types';
import { generateTask2Feedback, countWords } from '@/utils/feedback';
import { Save, RefreshCw, Wand2, Trash2, Plus, Minus } from 'lucide-react';
import styles from '@/styles/Pages.module.scss';

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
    localStorage.setItem('celpip_last_session', JSON.stringify({
      lastWordCount: wordCount,
      lastTask: 'TASK_2',
      date: new Date().toISOString()
    }));
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
          <h2>Task 2 — Survey Response</h2>
          <p>Tempo recomendado: 26 minutos</p>
        </div>
        <div className={styles.taskActions}>
          <Button variant="ghost" onClick={handleClear} className={styles.taskDeleteBtn}>
            <Trash2 size={16} /> Limpar
          </Button>
          <Button variant="outline" onClick={() => { }}>
            <Save size={16} /> Salvar Rascunho
          </Button>
        </div>
      </div>

      <div className={styles.taskGrid}>
        {/* Col 1: Context */}
        <div className={styles.taskColumn}>
          <Card title="1. Contexto">
            <Textarea
              label="Enunciado (Survey)"
              placeholder="Cole o enunciado..."
              rows={4}
              value={state.promptText}
              onChange={e => updateState('promptText', e.target.value)}
            />

            <Input
              label="Quem vai ler? (Audience)"
              placeholder="Ex: City Council, HR Department"
              value={state.audience}
              onChange={e => updateState('audience', e.target.value)}
            />

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
              <Input
                label="Tema escolhido (Keywords)"
                placeholder="Ex: building a new park"
                value={state.topic}
                onChange={e => updateState('topic', e.target.value)}
              />
            </div>
          </Card>
        </div>

        {/* Col 2: Planning (PRE) */}
        <div className={styles.taskColumn}>
          <Card title="2. Planejamento (PRE Structure)">
            <Input
              label="Opinion Line (Intro)"
              value={state.opinionLine}
              onChange={e => updateState('opinionLine', e.target.value)}
              suggestions={["I would rather...", "I recommend that...", "I believe option A is better because..."]}
              onSuggestionClick={val => updateState('opinionLine', val)}
            />

            <div style={{ marginTop: '1.5rem' }}>
              <div className={styles.argumentsHeader}>
                <h4 className={styles.argumentsTitle}>Argumentos (Points)</h4>
                <div className={styles.argumentsActions}>
                  <button onClick={addPoint} disabled={state.points.length >= 3} className={styles.argumentsButton}><Plus size={16} /></button>
                  <button onClick={removePoint} disabled={state.points.length <= 1} className={styles.argumentsButton}><Minus size={16} /></button>
                </div>
              </div>

              <div style={{ marginTop: '1rem' }}>
                {state.points.map((p, idx) => (
                  <div key={idx} className={styles.argumentBlock} style={{ marginTop: idx > 0 ? '1rem' : 0 }}>
                    <p className={styles.argumentNumber}>Argumento {idx + 1}</p>
                    <Input
                      label="Point (Idea)"
                      value={p.point}
                      onChange={e => updatePoint(idx, 'point', e.target.value)}
                    />
                    <Textarea
                      label="Reason (Why?)"
                      rows={2}
                      value={p.reason}
                      onChange={e => updatePoint(idx, 'reason', e.target.value)}
                    />
                    <Textarea
                      label="Example (Specific)"
                      rows={2}
                      value={p.example}
                      onChange={e => updatePoint(idx, 'example', e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className={styles.conclusionNote}>
                <span>Conclusão Auto:</span> &ldquo;In conclusion... because [Point 1] and [Point 2].&rdquo;
              </div>
            </div>
          </Card>
        </div>

        {/* Col 3: Writing */}
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
              <Button variant="secondary" onClick={generateStructure} title="Preencher esqueleto">
                <Wand2 size={16} /> Gerar Estrutura
              </Button>
              <Button style={{ flex: 1 }} onClick={handleEvaluate}>
                <RefreshCw size={16} /> Avaliar (Regras)
              </Button>
            </div>
          </Card>

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
