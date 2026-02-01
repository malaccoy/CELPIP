'use client';

import React, { useState, useEffect, useRef } from 'react';
import ContextSelector, { ContextItem } from '@/components/ContextSelector';
import ExamTimer from '@/components/ExamTimer';
import DraftManager from '@/components/DraftManager';
import ExamMode from '@/components/ExamMode';
import { Task1State, FeedbackItem } from '@/types';
import { generateTask1Feedback, countWords, calculateScore } from '@/utils/feedback';
import { recordPractice } from '@/components/DetailedStats';
import { recordErrors } from '@/components/ErrorReview';
import { 
  Save, RefreshCw, Wand2, Trash2, Mail, FileText, PenTool, 
  MessageSquare, Clock, CheckCircle, AlertCircle, AlertTriangle, 
  Info, ArrowRight, ArrowLeft, ChevronRight
} from 'lucide-react';
import styles from '@/styles/TaskWizard.module.scss';
import TaskHelpPanel from '@/components/TaskHelpPanel';

const INITIAL_STATE: Task1State = {
  promptText: '',
  recipient: '',
  formality: 'Formal',
  questions: [],
  opening: '',
  whoAmI: '',
  whyWriting: '',
  bodyStructure: ['First', 'Second', 'Third'],
  bodyStructureNotes: ['', '', '', ''],
  cta: '',
  pleaseLetMeKnow: 'Please let me know if you require any further information.',
  signOff: '',
  content: ''
};

const STEPS = [
  { id: 1, title: 'Contexto', icon: FileText, description: 'Entenda o enunciado' },
  { id: 2, title: 'Planejamento', icon: PenTool, description: 'Organize suas ideias' },
  { id: 3, title: 'Escrita', icon: Mail, description: 'Escreva seu email' },
];

export default function Task1Page() {
  const [currentStep, setCurrentStep] = useState(1);
  const [state, setState] = useState<Task1State>(INITIAL_STATE);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [transferMessage, setTransferMessage] = useState<string>('');
  const [contexts, setContexts] = useState<ContextItem[]>([]);
  const [selectedContextId, setSelectedContextId] = useState<string | null>(null);
  const [examModeActive, setExamModeActive] = useState(false);
  const writingTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Load contexts from JSON
  useEffect(() => {
    fetch('/content/contexts.json')
      .then(res => res.json())
      .then(data => {
        if (data.task1) {
          setContexts(data.task1);
        }
      })
      .catch(err => console.error('Failed to load contexts:', err));
  }, []);

  const handleContextSelect = (context: ContextItem) => {
    setSelectedContextId(context.id);
    if (context.category !== 'custom') {
      updateState('promptText', context.content);
      if (context.recipient) updateState('recipient', context.recipient);
      if (context.formality) updateState('formality', context.formality);
      if (context.questions) updateState('questions', context.questions);
    }
  };

  const wordCount = countWords(state.content);

  const updateState = (field: keyof Task1State, value: Task1State[keyof Task1State]) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const updateBodyNote = (index: number, value: string) => {
    const newNotes = [...state.bodyStructureNotes];
    newNotes[index] = value;
    updateState('bodyStructureNotes', newNotes);
  };

  const generateTemplate = () => {
    const template = `Dear ${state.recipient || '[Name]'},

I am writing to ${state.whyWriting || '[reason]'}. My name is ${state.whoAmI || '[Name]'} and I am a resident/customer...

First of all, regarding the first point, I would like to say...

Secondly, ...

Thirdly, ...

${state.cta ? state.cta + '.' : ''} ${state.pleaseLetMeKnow}

${state.signOff || 'Regards,\n[My Name]'}`;

    updateState('content', template);
  };

  const handleEvaluate = () => {
    const results = generateTask1Feedback(state);
    setFeedback(results);
    
    // Calculate score and record practice
    const score = calculateScore(results, wordCount);
    
    // Estimate time (could be improved with actual timer tracking)
    const estimatedMinutes = Math.max(5, Math.round(wordCount / 15));

    if (typeof window !== 'undefined') {
      try {
        // Record to detailed stats
        recordPractice('task1', wordCount, score, estimatedMinutes);
        
        // Record failed checks for error tracking
        const failedIds = results.filter(r => !r.passed).map(r => r.id);
        if (failedIds.length > 0) {
          recordErrors(failedIds);
        }
        
        // Keep legacy session storage for backwards compatibility
        localStorage.setItem('celpip_last_session', JSON.stringify({
          lastWordCount: wordCount,
          lastTask: 'TASK_1',
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

  const handleTransferPlanning = () => {
    const parts: string[] = [];
    const notes = state.bodyStructureNotes;
    
    // Opening (Dear...) - só o que foi digitado
    if (state.opening?.trim()) {
      parts.push(state.opening.trim());
    }
    
    // Who I am - só o que foi digitado
    if (state.whoAmI?.trim()) {
      parts.push(state.whoAmI.trim());
    }
    
    // Why I'm writing - só o que foi digitado
    if (state.whyWriting?.trim()) {
      parts.push(state.whyWriting.trim());
    }
    
    // Body paragraphs - só o texto digitado, sem prefixos
    if (notes[0]?.trim()) {
      parts.push(notes[0].trim());
    }
    if (notes[1]?.trim()) {
      parts.push(notes[1].trim());
    }
    if (notes[2]?.trim()) {
      parts.push(notes[2].trim());
    }
    
    // Conclusion - só o que foi digitado
    if (notes[3]?.trim()) {
      parts.push(notes[3].trim());
    }
    
    // CTA - só o que foi digitado
    if (state.cta?.trim()) {
      parts.push(state.cta.trim());
    }
    
    // Closing Line - só o que foi digitado
    if (state.pleaseLetMeKnow?.trim()) {
      parts.push(state.pleaseLetMeKnow.trim());
    }
    
    // Sign off - só o que foi digitado
    if (state.signOff?.trim()) {
      parts.push(state.signOff.trim());
    }
    
    if (parts.length === 0) {
      setTransferMessage('⚠️ Nenhum planejamento preenchido para transferir.');
      setTimeout(() => setTransferMessage(''), 3000);
      return;
    }
    
    const transferredContent = parts.join('\n\n');
    const currentContent = state.content.trim();
    const newContent = currentContent 
      ? `${currentContent}\n\n${transferredContent}` 
      : transferredContent;
    
    updateState('content', newContent);
    setTransferMessage('✅ Planejamento transferido!');
    setTimeout(() => setTransferMessage(''), 3000);
    
    setTimeout(() => {
      writingTextareaRef.current?.focus();
      if (writingTextareaRef.current) {
        writingTextareaRef.current.selectionStart = writingTextareaRef.current.value.length;
        writingTextareaRef.current.selectionEnd = writingTextareaRef.current.value.length;
      }
    }, 100);
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
      case 1: return !!state.promptText.trim();
      case 2: return !!state.opening.trim() || state.bodyStructureNotes.some(n => n.trim());
      case 3: return !!state.content.trim();
      default: return false;
    }
  };

  return (
    <div className={styles.wizardContainer}>
      {/* Hero Header */}
      <div className={styles.wizardHero}>
        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            <div className={styles.heroIcon}>
              <Mail />
            </div>
            <div className={styles.heroTitle}>
              <h1>Task 1 — <span>Email Writing</span></h1>
              <p><Clock size={14} /> 27 minutos recomendados</p>
            </div>
          </div>
          <div className={styles.heroCenter}>
            <ExamMode
              taskType="task1"
              totalMinutes={27}
              isActive={examModeActive}
              onStart={() => setCurrentStep(3)}
              onEnd={(completed, timeUsed) => {
                console.log('Exam ended:', { completed, timeUsed, words: wordCount });
              }}
              onToggle={setExamModeActive}
            />
            {!examModeActive && <ExamTimer totalMinutes={27} warningMinutes={5} />}
          </div>
          <div className={styles.heroActions}>
            <button onClick={handleClear} className={styles.heroBtnDanger}>
              <Trash2 size={16} /> Limpar Tudo
            </button>
            <DraftManager 
              task="task1"
              currentData={state as unknown as Record<string, unknown>}
              wordCount={wordCount}
              onLoad={(data) => setState(data as unknown as Task1State)}
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
                <h2>Contexto do Enunciado</h2>
                <p>Leia e entenda o enunciado da tarefa. Identifique o destinatário e os pontos que precisa abordar.</p>
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
                <label className={styles.formLabel}>Enunciado da Tarefa</label>
                <textarea
                  className={styles.formTextareaLarge}
                  placeholder="Cole o enunciado aqui ou selecione um tema acima..."
                  rows={6}
                  value={state.promptText}
                  onChange={e => updateState('promptText', e.target.value)}
                />
              </div>

              {/* Recipient & Formality */}
              <div className={styles.formRow}>
                <div className={styles.formSection}>
                  <label className={styles.formLabel}>Destinatário (WHO)</label>
                  <input
                    className={styles.formInput}
                    placeholder="Ex: Manager, Mr. Smith, Customer Service"
                    value={state.recipient}
                    onChange={e => updateState('recipient', e.target.value)}
                  />
                </div>
                <div className={styles.formSection}>
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

              {/* Questions */}
              {state.questions.length > 0 && (
                <div className={styles.formSection}>
                  <label className={styles.formLabel}>Pontos a Abordar</label>
                  <div className={styles.questionsList}>
                    {state.questions.map((question, index) => (
                      <div key={index} className={styles.questionItem}>
                        <span className={styles.questionBullet}>{index + 1}</span>
                        <input
                          className={styles.formInput}
                          placeholder={`Ponto ${index + 1}`}
                          value={question}
                          onChange={e => {
                            const newQuestions = [...state.questions];
                            newQuestions[index] = e.target.value;
                            updateState('questions', newQuestions);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                <h2>Planejamento</h2>
                <p>Organize suas ideias antes de escrever. Defina a abertura, estrutura e fechamento.</p>
              </div>
              <TaskHelpPanel defaultTab="task1" />
            </div>

            <div className={styles.stepBody}>
              {/* Opening */}
              <div className={styles.formSection}>
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

              {/* Who Am I & Why Writing */}
              <div className={styles.formRow}>
                <div className={styles.formSection}>
                  <label className={styles.formLabel}>Quem sou eu (1 frase)</label>
                  <input
                    className={styles.formInput}
                    placeholder="Ex: I am a resident of building B."
                    value={state.whoAmI}
                    onChange={e => updateState('whoAmI', e.target.value)}
                  />
                </div>
                <div className={styles.formSection}>
                  <label className={styles.formLabel}>Por que estou escrevendo</label>
                  <input
                    className={styles.formInput}
                    placeholder="Ex: I am writing to complain about..."
                    value={state.whyWriting}
                    onChange={e => updateState('whyWriting', e.target.value)}
                  />
                </div>
              </div>

              {/* Body Structure Notes */}
              <div className={styles.formSection}>
                <label className={styles.formLabel}>
                  <span>💡</span> Ideias para os Parágrafos
                </label>
                <p className={styles.formHint}>
                  Anote suas ideias para cada parágrafo. Isso não afeta a contagem de palavras.
                </p>
                
                <div className={styles.planningGrid}>
                  <div className={styles.planningItem}>
                    <div className={styles.planningLabel}>
                      <span className={styles.planningBadge}>1º</span> Primeiro parágrafo
                    </div>
                    <textarea
                      className={styles.planningTextarea}
                      placeholder="Ex: Apresentar o problema, mencionar quando começou..."
                      value={state.bodyStructureNotes[0]}
                      onChange={e => updateBodyNote(0, e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className={styles.planningItem}>
                    <div className={styles.planningLabel}>
                      <span className={styles.planningBadge}>2º</span> Segundo parágrafo
                    </div>
                    <textarea
                      className={styles.planningTextarea}
                      placeholder="Ex: Detalhar impactos, dar exemplos específicos..."
                      value={state.bodyStructureNotes[1]}
                      onChange={e => updateBodyNote(1, e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className={styles.planningItem}>
                    <div className={styles.planningLabel}>
                      <span className={`${styles.planningBadge} ${styles.planningBadgeOptional}`}>3º</span> 
                      Terceiro parágrafo
                      <span className={styles.optionalTag}>opcional</span>
                    </div>
                    <textarea
                      className={styles.planningTextarea}
                      placeholder="Ex: Argumento adicional ou contexto extra..."
                      value={state.bodyStructureNotes[2]}
                      onChange={e => updateBodyNote(2, e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className={styles.planningItem}>
                    <div className={styles.planningLabel}>
                      <span className={`${styles.planningBadge} ${styles.planningBadgeFinal}`}>✓</span> 
                      Fechamento / CTA
                    </div>
                    <textarea
                      className={styles.planningTextarea}
                      placeholder="Ex: Pedido de ação, agradecimento, expectativa de resposta..."
                      value={state.bodyStructureNotes[3]}
                      onChange={e => updateBodyNote(3, e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* CTA & Closing */}
              <div className={styles.formRow}>
                <div className={styles.formSection}>
                  <label className={styles.formLabel}>CTA / Pedido (Opcional)</label>
                  <input
                    className={styles.formInput}
                    placeholder="I would suggest that..."
                    value={state.cta}
                    onChange={e => updateState('cta', e.target.value)}
                  />
                </div>
                <div className={styles.formSection}>
                  <label className={styles.formLabel}>Assinatura</label>
                  <input
                    className={styles.formInput}
                    placeholder="Regards, [Full Name]"
                    value={state.signOff}
                    onChange={e => updateState('signOff', e.target.value)}
                  />
                </div>
              </div>

              {/* Closing Line */}
              <div className={styles.formSection}>
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
              <Mail className={styles.stepHeaderIcon} />
              <div>
                <h2>Escrita Final</h2>
                <p>Escreva seu email completo. Use o botão de transferir para trazer suas ideias do planejamento.</p>
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
                  placeholder="Comece a escrever seu email aqui..."
                  value={state.content}
                  onChange={e => updateState('content', e.target.value)}
                />
                
                {transferMessage && (
                  <div className={styles.transferMessage}>
                    {transferMessage}
                  </div>
                )}

                <div className={styles.writingActions}>
                  <button className={styles.btnTransfer} onClick={handleTransferPlanning}>
                    <ArrowRight size={16} /> Transferir Planejamento
                  </button>
                  <button className={styles.btnTemplate} onClick={generateTemplate}>
                    <Wand2 size={16} /> Gerar Template
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
