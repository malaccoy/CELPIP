'use client';

import React, { useState, useEffect, useRef } from 'react';
import ContextSelector, { ContextItem } from '@/components/ContextSelector';
import ExamTimer from '@/components/ExamTimer';
import DraftManager from '@/components/DraftManager';
import ExamMode from '@/components/ExamMode';
import SpellCheckTextarea from '@/components/SpellCheckTextarea';
import { Task1State, FeedbackItem } from '@/types';
import { generateTask1Feedback, countWords, calculateScore } from '@/utils/feedback';
import { recordPractice } from '@/components/DetailedStats';
import { recordErrors } from '@/components/ErrorReview';
import { recordPracticeForAchievements, ACHIEVEMENTS, Achievement, AchievementToast, markAchievementSeen } from '@/components/Achievements';
import { 
  Save, RefreshCw, Wand2, Trash2, Mail, FileText, PenTool, 
  MessageSquare, Clock, CheckCircle, AlertCircle, AlertTriangle, 
  Info, ArrowRight, ArrowLeft, ChevronRight, Sparkles, Bot, SpellCheck, Mic
} from 'lucide-react';
import TaskHelpPanel from '@/components/TaskHelpPanel';
import AIEvaluationResult, { AIEvaluationLoading } from '@/components/AIEvaluationResult';
import AIFeedback from '@/components/AIFeedback';
import SentenceFeedback from '@/components/SentenceFeedback';
import UpgradeTrigger from '@/components/UpgradeTrigger';
import ExerciseGate, { markExerciseDone } from '@/components/ExerciseGate';
import { analytics } from '@/lib/analytics';
import { FREE_LIMITS } from '@/lib/free-limits';
import VoiceDictation from '@/components/VoiceDictation';
import { useContentAccess } from '@/hooks/useContentAccess';

/* ── Theme ── */
const T = {
  bg: '#0a0e1a',
  surface: '#151929',
  surfaceHover: '#1c2137',
  border: 'rgba(255,255,255,0.06)',
  text: '#f1f5f9',
  muted: '#94a3b8',
  accent: '#ff3b3b',
  purple: '#a78bfa',
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#f59e0b',
};

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

/** Strip "In your email/response: • point • point" from theme text */
const themeText = (text?: string) => {
  if (!text) return '';
  const cut = text.search(/\s*(In your (email|response|letter|survey)[:\s]|•|\*)/i);
  return cut > 0 ? text.slice(0, cut).trim() : text;
};

const STEPS = [
  { id: 1, title: 'Context', icon: FileText, color: T.blue },
  { id: 2, title: 'Plan', icon: PenTool, color: T.purple },
  { id: 3, title: 'Write', icon: Mail, color: T.accent },
];

/* ── Reusable styles ── */
const card: React.CSSProperties = { background: T.surface, borderRadius: 16, padding: '20px', marginBottom: 14, border: `1px solid ${T.border}` };
const label: React.CSSProperties = { fontSize: 13, fontWeight: 700, color: T.muted, marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' };
const input: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${T.border}`, borderRadius: 10, padding: '10px 14px', color: T.text, fontSize: 15, outline: 'none', boxSizing: 'border-box' };
const textarea: React.CSSProperties = { ...input, minHeight: 80, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 };
const chip: React.CSSProperties = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '6px 14px', fontSize: 13, color: T.muted, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' };
const btnPrimary: React.CSSProperties = { background: `linear-gradient(135deg, ${T.accent}, #cc2f2f)`, color: '#fff', border: 'none', borderRadius: 12, padding: '12px 28px', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 };
const btnSecondary: React.CSSProperties = { background: 'rgba(255,255,255,0.06)', color: T.text, border: `1px solid ${T.border}`, borderRadius: 12, padding: '12px 28px', fontWeight: 600, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 };

export default function Task1Page() {
  const [currentStep, setCurrentStep] = useState(1);
  const [state, setState] = useState<Task1State>(INITIAL_STATE);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [transferMessage, setTransferMessage] = useState<string>('');
  const [contexts, setContexts] = useState<ContextItem[]>([]);
  const [selectedContextId, setSelectedContextId] = useState<string | null>(null);
  const [examModeActive, setExamModeActive] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [aiEvaluation, setAiEvaluation] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [spellCheckEnabled, setSpellCheckEnabled] = useState(false);
  const writingTextareaRef = useRef<HTMLTextAreaElement>(null);
  const { isPro } = useContentAccess();

  const selectedContext = contexts.find(c => c.id === selectedContextId);

  useEffect(() => {
    analytics.exerciseStart('writing', 'task-1');
    fetch('/content/contexts.json')
      .then(res => res.json())
      .then(data => {
        if (data.task1) {
          setContexts(data.task1);
          try {
            const stored = localStorage.getItem('celpip_ai_writing_prompt');
            if (stored) {
              const parsed = JSON.parse(stored);
              if (parsed.task === 1) {
                localStorage.removeItem('celpip_ai_writing_prompt');
                const themes = data.task1.filter((c: ContextItem) => c.category !== 'custom');
                if (themes.length > 0) {
                  const random = themes[Math.floor(Math.random() * themes.length)];
                  handleContextSelect(random);
                }
              }
            }
          } catch {}
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
    markExerciseDone();
    const score = calculateScore(results, wordCount);
    const estimatedMinutes = Math.max(5, Math.round(wordCount / 15));
    if (typeof window !== 'undefined') {
      try {
        recordPractice('task1', wordCount, score, estimatedMinutes);
        const failedIds = results.filter(r => !r.passed).map(r => r.id);
        if (failedIds.length > 0) recordErrors(failedIds);
        const newlyUnlocked = recordPracticeForAchievements('task1', wordCount, score, estimatedMinutes, false);
        if (newlyUnlocked.length > 0) {
          const achievement = ACHIEVEMENTS.find(a => a.id === newlyUnlocked[0]);
          if (achievement) setNewAchievement(achievement);
        }
        localStorage.setItem('celpip_last_session', JSON.stringify({
          lastWordCount: wordCount, lastTask: 'TASK_1', lastScore: score, date: new Date().toISOString()
        }));
      } catch {}
    }
  };

  const handleAIEvaluate = async () => {
    if (wordCount < 50) { setAiError('Write at least 50 words for AI evaluation.'); return; }
    analytics.aiFeedbackRequest('writing');
    setAiLoading(true); setAiError(null); setAiEvaluation(null);
    try {
      const response = await fetch('/api/evaluate/ai', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'task1', text: state.content, prompt: state.promptText,
          context: { formality: state.formality.toLowerCase(), recipient: state.recipient, situation: selectedContext?.title || '' }
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Evaluation error');
      setAiEvaluation(data.evaluation);
    } catch (err: any) { setAiError(err.message || 'Error connecting to AI'); }
    finally { setAiLoading(false); }
  };

  const handleClear = () => {
    if (confirm('Clear everything?')) {
      setState(INITIAL_STATE); setFeedback([]); setAiEvaluation(null); setAiError(null); setSelectedContextId(null); setCurrentStep(1);
    }
  };

  const handleTransferPlanning = () => {
    const parts: string[] = [];
    if (state.opening?.trim()) parts.push(state.opening.trim());
    if (state.whoAmI?.trim()) parts.push(state.whoAmI.trim());
    if (state.whyWriting?.trim()) parts.push(state.whyWriting.trim());
    state.bodyStructureNotes.forEach(n => { if (n?.trim()) parts.push(n.trim()); });
    if (state.cta?.trim()) parts.push(state.cta.trim());
    if (state.pleaseLetMeKnow?.trim()) parts.push(state.pleaseLetMeKnow.trim());
    if (state.signOff?.trim()) parts.push(state.signOff.trim());
    if (parts.length === 0) { setTransferMessage('⚠️ No planning to transfer.'); setTimeout(() => setTransferMessage(''), 3000); return; }
    const transferred = parts.join('\n\n');
    updateState('content', state.content.trim() ? `${state.content.trim()}\n\n${transferred}` : transferred);
    setTransferMessage('✅ Planning transferred!');
    setTimeout(() => setTransferMessage(''), 3000);
  };

  const goToStep = (step: number) => { if (step >= 1 && step <= 3) { setCurrentStep(step); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
  const nextStep = () => goToStep(currentStep + 1);
  const prevStep = () => goToStep(currentStep - 1);

  const stepHasContent = (step: number) => {
    switch (step) {
      case 1: return !!state.promptText.trim();
      case 2: return !!state.opening.trim() || state.bodyStructureNotes.some(n => n.trim());
      case 3: return !!state.content.trim();
      default: return false;
    }
  };

  const wcColor = wordCount < 150 ? T.yellow : wordCount <= 200 ? T.green : T.accent;

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text, fontFamily: "'Inter','Segoe UI',sans-serif", paddingBottom: 100 }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .step-animate { animation: fadeIn 0.3s ease; }
        .chip-btn:hover { background: rgba(255,255,255,0.12) !important; color: #fff !important; }
        .writing-input:focus { border-color: ${T.purple} !important; box-shadow: 0 0 0 2px ${T.purple}30 !important; }
        textarea.writing-input:focus { border-color: ${T.purple} !important; box-shadow: 0 0 0 2px ${T.purple}30 !important; }
      `}</style>

      <ExerciseGate section="Writing" />
      {newAchievement && <AchievementToast achievement={newAchievement} onClose={() => { markAchievementSeen(newAchievement.id); setNewAchievement(null); }} />}

      {/* ── Header ── */}
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: '16px 20px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `${T.accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={20} color={T.accent} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Task 1 — Email</h1>
              <p style={{ margin: 0, fontSize: 13, color: T.muted, display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> 27 min</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <ExamMode taskType="task1" totalMinutes={27} isActive={examModeActive} onStart={() => setCurrentStep(3)} onEnd={(c, t) => console.log('Exam:', { c, t })} onToggle={setExamModeActive} />
            {!examModeActive && <ExamTimer totalMinutes={27} warningMinutes={5} />}
            <DraftManager task="task1" currentData={state as unknown as Record<string, unknown>} wordCount={wordCount} onLoad={(d) => setState(d as unknown as Task1State)} scenarioTitle={selectedContext?.title || 'Email'} />
            <button onClick={handleClear} style={{ ...btnSecondary, padding: '8px 14px', fontSize: 13, color: T.accent, borderColor: `${T.accent}30` }}><Trash2 size={14} /></button>
          </div>
        </div>
      </div>

      {/* ── Step Progress ── */}
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {STEPS.map((step, i) => {
            const active = currentStep === step.id;
            const done = currentStep > step.id || stepHasContent(step.id);
            const Icon = step.icon;
            return (
              <React.Fragment key={step.id}>
                <button onClick={() => goToStep(step.id)} style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '12px 8px', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  background: active ? `${step.color}15` : 'transparent',
                  borderBottom: `3px solid ${active ? step.color : done ? `${step.color}40` : T.border}`,
                  borderRadius: 0,
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: active ? `${step.color}25` : done ? `${step.color}15` : 'rgba(255,255,255,0.04)',
                  }}>
                    {done && !active ? <CheckCircle size={16} color={step.color} /> : <Icon size={16} color={active ? step.color : T.muted} />}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: active ? 700 : 500, color: active ? step.color : T.muted }}>{step.title}</span>
                </button>
                {i < STEPS.length - 1 && <div style={{ width: 1, height: 20, background: T.border }} />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── Step Content ── */}
      <div className="step-animate" key={currentStep} style={{ maxWidth: 700, margin: '0 auto', padding: '20px' }}>

        {/* ═══ STEP 1: CONTEXT ═══ */}
        {currentStep === 1 && (
          <>
            <div style={card}>
              <label style={label}>Choose a theme</label>
              {contexts.length > 0 && (
                <ContextSelector contexts={contexts} selectedId={selectedContextId} onSelect={handleContextSelect}
                  placeholder="Select a theme or create your own..." freeLimit={FREE_LIMITS.writing.task1} isPro={isPro} />
              )}
            </div>

            <div style={card}>
              <label style={label}>Task Prompt</label>
              <textarea className="writing-input" style={{ ...textarea, minHeight: 120 }}
                placeholder="Paste the prompt here or select a theme above..."
                value={state.promptText} onChange={e => updateState('promptText', e.target.value)} />
            </div>

            <div style={{ ...card, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={label}>Recipient</label>
                <input className="writing-input" style={input} placeholder="Ex: Manager, Mr. Smith"
                  value={state.recipient} onChange={e => updateState('recipient', e.target.value)} />
              </div>
              <div>
                <label style={label}>Formality</label>
                <select className="writing-input" style={{ ...input, cursor: 'pointer' }} value={state.formality}
                  onChange={e => updateState('formality', e.target.value as 'Formal' | 'Semi-formal')}>
                  <option value="Formal">Formal</option>
                  <option value="Semi-formal">Semi-formal</option>
                </select>
              </div>
            </div>

            {state.questions.length > 0 && (
              <div style={card}>
                <label style={label}>Points to Address</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {state.questions.map((q, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ width: 24, height: 24, borderRadius: 8, background: `${T.blue}20`, color: T.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
                      <input className="writing-input" style={input} value={q} onChange={e => {
                        const nq = [...state.questions]; nq[i] = e.target.value; updateState('questions', nq);
                      }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button onClick={nextStep} style={btnPrimary}>Next: Plan <ArrowRight size={18} /></button>
            </div>
          </>
        )}

        {/* ═══ STEP 2: PLANNING ═══ */}
        {currentStep === 2 && (
          <>
            {selectedContext && (
              <div style={{ ...card, background: `${T.blue}08`, borderColor: `${T.blue}20` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: T.blue, textTransform: 'uppercase' }}>Theme</span>
                  <button onClick={() => setCurrentStep(1)} style={{ background: 'none', border: 'none', color: T.blue, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Change</button>
                </div>
                <p style={{ margin: 0, fontSize: 14, color: T.muted, lineHeight: 1.5 }}>{themeText(selectedContext.content)}</p>
              </div>
            )}

            {/* Opening — chips + editable */}
            <div style={card}>
              <label style={label}>Opening Greeting</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                {["Dear Mr./Ms. [Name],", "Dear Manager,", "Dear Sir/Madam,", "To Whom It May Concern,", "Dear Hiring Committee,"].map(s => (
                  <button key={s} className="chip-btn" style={{ ...chip, ...(state.opening === s ? { background: `${T.blue}20`, borderColor: T.blue, color: T.blue } : {}) }}
                    onClick={() => updateState('opening', s)}>{s}</button>
                ))}
              </div>
              <input className="writing-input" style={input} placeholder="Or type your own..." value={state.opening} onChange={e => updateState('opening', e.target.value)} />
            </div>

            {/* Who I am — chips + editable */}
            <div style={card}>
              <label style={label}>Who I am</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                {["I am a resident of...", "I am a long-time customer of...", "I am an employee at...", "I am a parent of a student at...", "I am a concerned citizen who..."].map(s => (
                  <button key={s} className="chip-btn" style={{ ...chip, ...(state.whoAmI === s ? { background: `${T.purple}20`, borderColor: T.purple, color: T.purple } : {}) }}
                    onClick={() => updateState('whoAmI', s)}>{s}</button>
                ))}
              </div>
              <input className="writing-input" style={input} placeholder="Or type your own..." value={state.whoAmI} onChange={e => updateState('whoAmI', e.target.value)} />
            </div>

            {/* Why writing — chips + editable */}
            <div style={card}>
              <label style={label}>Why I&apos;m writing</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                {["to complain about...", "to request information about...", "to inform you that...", "to suggest a change to...", "to express my concern about...", "to follow up on..."].map(s => (
                  <button key={s} className="chip-btn" style={{ ...chip, ...(state.whyWriting === s ? { background: `${T.green}20`, borderColor: T.green, color: T.green } : {}) }}
                    onClick={() => updateState('whyWriting', s)}>{s}</button>
                ))}
              </div>
              <input className="writing-input" style={input} placeholder="Or type your own..." value={state.whyWriting} onChange={e => updateState('whyWriting', e.target.value)} />
            </div>

            {/* Body Ideas — sentence starters + editable */}
            <div style={card}>
              <label style={label}>Paragraph Ideas</label>
              <p style={{ margin: '0 0 12px', fontSize: 13, color: T.muted }}>Tap a starter, then complete the sentence. These are notes — they won&apos;t count toward words.</p>
              {[
                { num: '1', lbl: 'First point', color: T.blue, starters: ["The main issue is...", "First of all, I would like to mention...", "To begin with,..."] },
                { num: '2', lbl: 'Second point', color: T.purple, starters: ["In addition to this,...", "Furthermore,...", "Another concern is...", "This has caused..."] },
                { num: '3', lbl: 'Third (optional)', color: T.muted, starters: ["Moreover,...", "As a result,...", "I have also noticed that..."] },
                { num: '✓', lbl: 'Closing', color: T.green, starters: ["I would appreciate it if you could...", "I kindly request that...", "Could you please..."] },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: 14, paddingBottom: i < 3 ? 14 : 0, borderBottom: i < 3 ? `1px solid ${T.border}` : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ width: 24, height: 24, borderRadius: 6, background: `${item.color}15`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, flexShrink: 0 }}>{item.num}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{item.lbl}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                    {item.starters.map(s => (
                      <button key={s} className="chip-btn" style={{ ...chip, fontSize: 12 }}
                        onClick={() => updateBodyNote(i, state.bodyStructureNotes[i] ? state.bodyStructureNotes[i] + ' ' + s : s)}>{s}</button>
                    ))}
                  </div>
                  <input className="writing-input" style={input} placeholder="Tap a starter above or type your idea..."
                    value={state.bodyStructureNotes[i]} onChange={e => updateBodyNote(i, e.target.value)} />
                </div>
              ))}
            </div>

            {/* Closing + Sign-off — chips + editable */}
            <div style={card}>
              <div style={{ marginBottom: 14 }}>
                <label style={label}>Closing Line</label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                  {["Please let me know if you have any questions.", "I look forward to hearing from you.", "Thank you for your time and attention.", "I would appreciate a prompt response."].map(s => (
                    <button key={s} className="chip-btn" style={{ ...chip, fontSize: 12, ...(state.pleaseLetMeKnow === s ? { background: `${T.green}20`, borderColor: T.green, color: T.green } : {}) }}
                      onClick={() => updateState('pleaseLetMeKnow', s)}>{s}</button>
                  ))}
                </div>
                <input className="writing-input" style={input} value={state.pleaseLetMeKnow} onChange={e => updateState('pleaseLetMeKnow', e.target.value)} />
              </div>
              <div>
                <label style={label}>Sign-off</label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                  {["Sincerely,\n[Your Name]", "Regards,\n[Your Name]", "Best regards,\n[Your Name]", "Yours faithfully,\n[Your Name]"].map(s => (
                    <button key={s} className="chip-btn" style={{ ...chip, fontSize: 12, ...(state.signOff === s ? { background: `${T.purple}20`, borderColor: T.purple, color: T.purple } : {}) }}
                      onClick={() => updateState('signOff', s)}>{s.split('\n')[0]}</button>
                  ))}
                </div>
                <input className="writing-input" style={input} placeholder="Or type your own..." value={state.signOff} onChange={e => updateState('signOff', e.target.value)} />
              </div>
            </div>

            <TaskHelpPanel defaultTab="task1" />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <button onClick={prevStep} style={btnSecondary}><ArrowLeft size={18} /> Back</button>
              <button onClick={nextStep} style={btnPrimary}>Next: Write <ArrowRight size={18} /></button>
            </div>
          </>
        )}

        {/* ═══ STEP 3: WRITING ═══ */}
        {currentStep === 3 && (
          <>
            {/* Word Counter Bar */}
            <div style={{ ...card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: wcColor }}>{wordCount}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>words</div>
                  <div style={{ fontSize: 11, color: T.muted }}>Target: 150-200</div>
                </div>
              </div>
              <div style={{ width: 120, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 3, background: wcColor, width: `${Math.min((wordCount / 200) * 100, 100)}%`, transition: 'width 0.3s' }} />
              </div>
            </div>

            {/* Compact prompt reminder */}
            {selectedContext && (
              <div style={{ ...card, padding: '12px 16px', background: `${T.blue}06` }}>
                <p style={{ margin: 0, fontSize: 13, color: T.muted, lineHeight: 1.5 }}><strong style={{ color: T.blue }}>Prompt:</strong> {themeText(selectedContext.content)}</p>
              </div>
            )}

            {/* Writing Area */}
            <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
              {/* Toolbar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: `1px solid ${T.border}`, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <VoiceDictation
                    onTranscript={(text) => updateState('content', state.content + (state.content && !state.content.endsWith(' ') ? ' ' : '') + text)}
                  />
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, color: T.muted }}>
                    <input type="checkbox" checked={spellCheckEnabled} onChange={e => setSpellCheckEnabled(e.target.checked)}
                      style={{ width: 16, height: 16, accentColor: T.purple }} />
                    <SpellCheck size={14} /> Spell Check
                  </label>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={handleTransferPlanning} className="chip-btn" style={{ ...chip, fontSize: 12 }}><ArrowRight size={12} /> Transfer Plan</button>
                  <button onClick={generateTemplate} className="chip-btn" style={{ ...chip, fontSize: 12 }}><Wand2 size={12} /> Template</button>
                </div>
              </div>

              {/* Textarea */}
              <div style={{ padding: '0 16px 16px' }}>
                <SpellCheckTextarea
                  value={state.content}
                  onChange={(value) => updateState('content', value)}
                  placeholder="Start writing your email here... or tap Dictate to speak!"
                  spellCheckEnabled={spellCheckEnabled}
                  className=""
                  minHeight="300px"
                />
              </div>
            </div>

            {transferMessage && (
              <div style={{ padding: '10px 16px', borderRadius: 10, background: transferMessage.includes('⚠️') ? `${T.yellow}15` : `${T.green}15`, color: transferMessage.includes('⚠️') ? T.yellow : T.green, fontSize: 14, fontWeight: 600, marginBottom: 14 }}>
                {transferMessage}
              </div>
            )}

            {/* Single AI button */}
            <div style={{ ...card, textAlign: 'center' }}>
              <button onClick={handleAIEvaluate} disabled={aiLoading || wordCount < 50}
                style={{ ...btnPrimary, width: '100%', justifyContent: 'center', padding: '16px 28px', fontSize: 16, opacity: (aiLoading || wordCount < 50) ? 0.5 : 1 }}>
                <Bot size={20} /> {aiLoading ? 'Analyzing your writing...' : 'Get AI Feedback'}
              </button>
              {wordCount < 50 && <p style={{ margin: '8px 0 0', fontSize: 12, color: T.muted }}>Write at least 50 words to unlock</p>}
              {aiError && <p style={{ margin: '8px 0 0', fontSize: 13, color: T.accent }}>{aiError}</p>}
            </div>

            {aiLoading && <AIEvaluationLoading />}
            {aiEvaluation && (
              <AIEvaluationResult evaluation={aiEvaluation} originalText={state.content} />
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <button onClick={prevStep} style={btnSecondary}><ArrowLeft size={18} /> Back</button>
              <div />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
