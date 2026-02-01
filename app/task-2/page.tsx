'use client';

import React, { useState, useEffect, useRef } from 'react';
import ContextSelector, { ContextItem } from '@/components/ContextSelector';
import ExamTimer from '@/components/ExamTimer';
import DraftManager from '@/components/DraftManager';
import ExamMode from '@/components/ExamMode';
import { Task2State, FeedbackItem, Task2Point } from '@/types';
import { generateTask2Feedback, countWords, calculateScore } from '@/utils/feedback';
import { recordPractice } from '@/components/DetailedStats';
import { recordErrors } from '@/components/ErrorReview';
import { recordPracticeForAchievements, ACHIEVEMENTS, Achievement, AchievementToast, markAchievementSeen } from '@/components/Achievements';
import { 
  Save, RefreshCw, Wand2, Trash2, Plus, Minus, FileText, PenTool, 
  MessageSquare, Clock, CheckCircle, AlertCircle, AlertTriangle, 
  Info, ArrowRight, ArrowLeft, ChevronRight, ClipboardList
} from 'lucide-react';
import styles from '@/styles/TaskWizard.module.scss';
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

const STEPS = [
  { id: 1, title: 'Contexto', icon: FileText, description: 'Entenda a pesquisa' },
  { id: 2, title: 'Planejamento', icon: PenTool, description: 'Estruture seus argumentos' },
  { id: 3, title: 'Escrita', icon: ClipboardList, description: 'Escreva sua resposta' },
];

export default function Task2Page() {
  const [currentStep, setCurrentStep] = useState(1);
  const [state, setState] = useState<Task2State>(INITIAL_STATE);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [contexts, setContexts] = useState<ContextItem[]>([]);
  const [selectedContextId, setSelectedContextId] = useState<string | null>(null);
  const [examModeActive, setExamModeActive] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const writingTextareaRef = useRef<HTMLTextAreaElement>(null);

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
    
    // Calculate score and record practice
    const score = calculateScore(results, wordCount);
    
    // Estimate time (could be improved with actual timer tracking)
    const estimatedMinutes = Math.max(5, Math.round(wordCount / 15));

    if (typeof window !== 'undefined') {
      try {
        // Record to detailed stats
        recordPractice('task2', wordCount, score, estimatedMinutes);
        
        // Record failed checks for error tracking
        const failedIds = results.filter(r => !r.passed).map(r => r.id);
        if (failedIds.length > 0) {
          recordErrors(failedIds);
        }
        
        // Record achievements
        const newlyUnlocked = recordPracticeForAchievements('task2', wordCount, score, estimatedMinutes, false);
        if (newlyUnlocked.length > 0) {
          const achievement = ACHIEVEMENTS.find(a => a.id === newlyUnlocked[0]);
          if (achievement) {
            setNewAchievement(achievement);
          }
        }
        
        // Keep legacy session storage for backwards compatibility
        localStorage.setItem('celpip_last_session', JSON.stringify({
          lastWordCount: wordCount,
          lastTask: 'TASK_2',
          lastScore: score,
          date: new Date().toISOString()
        }));
      } catch {
        // Silently fail
      }
    }
  };

  const handleClear = () => {
    if (confirm('Tem certeza que deseja limpar tudo e voltar ao início?')) {
      setState(INITIAL_STATE);
      setFeedback([]);
      setSelectedContextId(null);
      setCurrentStep(1);
    }
  };

  const getWordCounterClass = () => {
    if (wordCount < 150) return styles.wordCounterLow;
    if (wordCount <= 200) return styles.wordCounterGood;
    return styles.wordCounterHigh;
  };

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
    if (item.passed) return <CheckCircle size={16} />;
    switch (item.severity) {
      case 'BLOCKER': return <AlertCircle size={16} />;
      case 'IMPORTANT': return <AlertTriangle size={16} />;
      case 'POLISH': return <Info size={16} />;
      default: return <Info size={16} />;
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 3) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const nextStep = () => goToStep(currentStep + 1);
  const prevStep = () => goToStep(currentStep - 1);

  // Check if step has content (for progress indication)
  const stepHasContent = (step: number): boolean => {
    switch (step) {
      case 1: return !!state.promptText.trim() || !!state.topic.trim();
      case 2: return !!state.opinionLine.trim() || state.points.some(p => p.point.trim());
      case 3: return !!state.content.trim();
      default: return false;
    }
  };

  return (
    <div className={styles.wizardContainer}>
      {/* Achievement Toast */}
      {newAchievement && (
        <AchievementToast 
          achievement={newAchievement} 
          onClose={() => {
            markAchievementSeen(newAchievement.id);
            setNewAchievement(null);
          }} 
        />
      )}

      {/* Hero Header */}
      <div className={styles.wizardHero}>
        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            <div className={styles.heroIcon}>
              <ClipboardList />
            </div>
            <div className={styles.heroTitle}>
              <h1>Task 2 — <span>Survey Response</span></h1>
              <p><Clock size={14} /> 26 minutos recomendados</p>
            </div>
          </div>
          <div className={styles.heroCenter}>
            <ExamMode
              taskType="task2"
              totalMinutes={26}
              isActive={examModeActive}
              onStart={() => setCurrentStep(3)}
              onEnd={(completed, timeUsed) => {
                console.log('Exam ended:', { completed, timeUsed, words: wordCount });
              }}
              onToggle={setExamModeActive}
            />
            {!examModeActive && <ExamTimer totalMinutes={26} warningMinutes={5} />}
          </div>
          <div className={styles.heroActions}>
            <button onClick={handleClear} className={styles.heroBtnDanger}>
              <Trash2 size={16} /> Limpar Tudo
            </button>
            <DraftManager 
              task="task2"
              currentData={state as unknown as Record<string, unknown>}
              wordCount={wordCount}
              onLoad={(data) => setState(data as unknown as Task2State)}
            />
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className={styles.progressContainer}>
        <div className={styles.progressSteps}>
          {STEPS.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id || stepHasContent(step.id);
            
            return (
              <React.Fragment key={step.id}>
                <button
                  className={`${styles.progressStep} ${isActive ? styles.progressStepActive : ''} ${isCompleted ? styles.progressStepCompleted : ''}`}
                  onClick={() => goToStep(step.id)}
                >
                  <div className={styles.stepCircle}>
                    {isCompleted && !isActive ? (
                      <CheckCircle size={20} />
                    ) : (
                      <StepIcon size={20} />
                    )}
                  </div>
                  <div className={styles.stepInfo}>
                    <span className={styles.stepTitle}>{step.title}</span>
                    <span className={styles.stepDesc}>{step.description}</span>
                  </div>
                </button>
                {index < STEPS.length - 1 && (
                  <div className={`${styles.progressLine} ${currentStep > step.id ? styles.progressLineActive : ''}`}>
                    <ChevronRight size={20} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className={styles.stepContent}>
        {/* Step 1: Context */}
        {currentStep === 1 && (
          <div className={styles.stepPanel}>
            <div className={styles.stepHeader}>
              <FileText className={styles.stepHeaderIcon} />
              <div>
                <h2>Contexto da Pesquisa</h2>
                <p>Leia o enunciado e identifique as opções. Escolha sua posição (Opção A ou B).</p>
              </div>
            </div>

            <div className={styles.stepBody}>
              {/* Context Selector */}
              {contexts.length > 0 && (
                <div className={styles.formSection}>
                  <label className={styles.formLabel}>Escolha um tema</label>
                  <ContextSelector
                    contexts={contexts}
                    selectedId={selectedContextId}
                    onSelect={handleContextSelect}
                    placeholder="Selecione um tema pronto ou crie o seu..."
                  />
                </div>
              )}

              {/* Prompt Text */}
              <div className={styles.formSection}>
                <label className={styles.formLabel}>Enunciado (Survey)</label>
                <textarea
                  className={styles.formTextareaLarge}
                  placeholder="Cole o enunciado aqui ou selecione um tema acima..."
                  rows={6}
                  value={state.promptText}
                  onChange={e => updateState('promptText', e.target.value)}
                />
              </div>

              {/* Audience */}
              <div className={styles.formSection}>
                <label className={styles.formLabel}>Quem vai ler? (Audience)</label>
                <input
                  className={styles.formInput}
                  placeholder="Ex: City Council, HR Department, School Board"
                  value={state.audience}
                  onChange={e => updateState('audience', e.target.value)}
                />
              </div>

              {/* Position Selection */}
              <div className={styles.formSection}>
                <label className={styles.formLabel}>Sua Posição</label>
                <div className={styles.positionButtons}>
                  <button
                    type="button"
                    onClick={() => updateState('position', 'A_FAVOR')}
                    className={`${styles.positionBtn} ${state.position === 'A_FAVOR' ? styles.positionBtnActive : ''}`}
                  >
                    <span className={styles.positionBtnLetter}>A</span>
                    <span>Opção A</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateState('position', 'CONTRA')}
                    className={`${styles.positionBtn} ${state.position === 'CONTRA' ? styles.positionBtnActive : ''}`}
                  >
                    <span className={styles.positionBtnLetter}>B</span>
                    <span>Opção B</span>
                  </button>
                </div>
              </div>

              {/* Topic Keywords */}
              <div className={styles.formSection}>
                <label className={styles.formLabel}>Tema escolhido (Keywords)</label>
                <input
                  className={styles.formInput}
                  placeholder="Ex: building a new park, remote work policy"
                  value={state.topic}
                  onChange={e => updateState('topic', e.target.value)}
                />
                <p className={styles.formHint}>
                  Palavras-chave que resumem sua escolha. Serão usadas na introdução.
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className={styles.stepNav}>
              <div></div>
              <button className={styles.btnNext} onClick={nextStep}>
                Próximo: Planejamento <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Planning */}
        {currentStep === 2 && (
          <div className={styles.stepPanel}>
            <div className={styles.stepHeader}>
              <PenTool className={styles.stepHeaderIcon} />
              <div>
                <h2>Planejamento (Estrutura PRE)</h2>
                <p>Use a estrutura <strong>P</strong>oint → <strong>R</strong>eason → <strong>E</strong>xample para cada argumento.</p>
              </div>
              <TaskHelpPanel defaultTab="task2" />
            </div>

            <div className={styles.stepBody}>
              {/* Opinion Line */}
              <div className={styles.formSection}>
                <label className={styles.formLabel}>Opinion Line (Introdução)</label>
                <input
                  className={styles.formInput}
                  placeholder="I would rather... / I recommend that..."
                  value={state.opinionLine}
                  onChange={e => updateState('opinionLine', e.target.value)}
                />
                <div className={styles.tagGroup}>
                  {[
                    "I would rather...",
                    "I recommend that...",
                    "I believe option A is better because..."
                  ].map(suggestion => (
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

              {/* Arguments Header */}
              <div className={styles.formSection}>
                <div className={styles.argumentsHeader}>
                  <label className={styles.formLabel}>
                    <span>📝</span> Argumentos (PRE Structure)
                  </label>
                  <div className={styles.argumentsActions}>
                    <button 
                      type="button"
                      onClick={removePoint} 
                      disabled={state.points.length <= 1}
                      className={styles.argumentsBtn}
                      title="Remover argumento"
                    >
                      <Minus size={16} />
                    </button>
                    <span className={styles.argumentsCount}>{state.points.length}/3</span>
                    <button 
                      type="button"
                      onClick={addPoint} 
                      disabled={state.points.length >= 3}
                      className={styles.argumentsBtn}
                      title="Adicionar argumento"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                <p className={styles.formHint}>
                  Mínimo 2 argumentos. Cada um deve ter Point, Reason e Example.
                </p>
              </div>

              {/* Arguments Grid */}
              <div className={styles.argumentsGrid}>
                {state.points.map((p, idx) => (
                  <div key={idx} className={styles.argumentCard}>
                    <div className={styles.argumentCardHeader}>
                      <span className={styles.argumentBadge}>
                        {idx === 0 ? 'First' : idx === 1 ? 'Second' : 'Finally'}
                      </span>
                      <span className={styles.argumentTitle}>Argumento {idx + 1}</span>
                    </div>
                    
                    <div className={styles.argumentField}>
                      <label className={styles.argumentFieldLabel}>
                        <span className={styles.preBadge}>P</span> Point (Ideia principal)
                      </label>
                      <input
                        className={styles.formInput}
                        placeholder="Ex: parks provide health benefits..."
                        value={p.point}
                        onChange={e => updatePoint(idx, 'point', e.target.value)}
                      />
                    </div>
                    
                    <div className={styles.argumentField}>
                      <label className={styles.argumentFieldLabel}>
                        <span className={styles.preBadge}>R</span> Reason (Por quê?)
                      </label>
                      <textarea
                        className={styles.planningTextarea}
                        placeholder="Ex: because people can exercise outdoors..."
                        value={p.reason}
                        onChange={e => updatePoint(idx, 'reason', e.target.value)}
                        rows={2}
                      />
                    </div>
                    
                    <div className={styles.argumentField}>
                      <label className={styles.argumentFieldLabel}>
                        <span className={styles.preBadge}>E</span> Example (Exemplo específico)
                      </label>
                      <textarea
                        className={styles.planningTextarea}
                        placeholder="Ex: for instance, my neighbor started jogging..."
                        value={p.example}
                        onChange={e => updatePoint(idx, 'example', e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Conclusion Note */}
              <div className={styles.conclusionNote}>
                <span className={styles.conclusionIcon}>💡</span>
                <div>
                  <strong>Conclusão (auto-gerada):</strong>
                  <p>"In conclusion, considering these reasons, I am convinced that this is the superior option."</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className={styles.stepNav}>
              <button className={styles.btnPrev} onClick={prevStep}>
                <ArrowLeft size={18} /> Voltar
              </button>
              <button className={styles.btnNext} onClick={nextStep}>
                Próximo: Escrita <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Writing */}
        {currentStep === 3 && (
          <div className={styles.stepPanel}>
            <div className={styles.stepHeader}>
              <ClipboardList className={styles.stepHeaderIcon} />
              <div>
                <h2>Escrita Final</h2>
                <p>Escreva sua resposta completa. Use "Gerar Estrutura" para criar um rascunho baseado no planejamento.</p>
              </div>
              <div className={`${styles.wordCounter} ${getWordCounterClass()}`}>
                ✍️ {wordCount} palavras
              </div>
            </div>

            <div className={styles.stepBody}>
              {/* Writing Area */}
              <div className={styles.writingSection}>
                <textarea
                  ref={writingTextareaRef}
                  className={styles.writingTextarea}
                  placeholder="Comece a escrever sua resposta aqui..."
                  value={state.content}
                  onChange={e => updateState('content', e.target.value)}
                />

                <div className={styles.writingActions}>
                  <button className={styles.btnTemplate} onClick={generateStructure}>
                    <Wand2 size={16} /> Gerar Estrutura
                  </button>
                  <button className={styles.btnEvaluate} onClick={handleEvaluate}>
                    <RefreshCw size={16} /> Avaliar
                  </button>
                </div>
              </div>

              {/* Feedback Panel */}
              {feedback.length > 0 && (
                <div className={styles.feedbackPanel}>
                  <div className={styles.feedbackHeader}>
                    <MessageSquare size={20} />
                    <h3>Feedback</h3>
                  </div>
                  <div className={styles.feedbackList}>
                    {feedback.map((item, index) => (
                      <div key={index} className={`${styles.feedbackItem} ${getFeedbackItemClass(item)}`}>
                        <div className={styles.feedbackItemIcon}>
                          {getFeedbackIcon(item)}
                        </div>
                        <p>{item.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className={styles.stepNav}>
              <button className={styles.btnPrev} onClick={prevStep}>
                <ArrowLeft size={18} /> Voltar ao Planejamento
              </button>
              <button className={styles.btnFinish}>
                <CheckCircle size={18} /> Finalizar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
