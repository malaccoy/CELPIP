'use client';

import React, { useState, useEffect, useRef } from 'react';
import ContextSelector, { ContextItem } from '@/components/ContextSelector';
import ExamTimer from '@/components/ExamTimer';
import DraftManager from '@/components/DraftManager';
import ExamMode from '@/components/ExamMode';
import SpellCheckTextarea from '@/components/SpellCheckTextarea';
import { Task2State, FeedbackItem, Task2Point } from '@/types';
import { generateTask2Feedback, countWords, calculateScore } from '@/utils/feedback';
import { recordPractice } from '@/components/DetailedStats';
import { recordErrors } from '@/components/ErrorReview';
import { recordPracticeForAchievements, ACHIEVEMENTS, Achievement, AchievementToast, markAchievementSeen } from '@/components/Achievements';
import { 
  Save, RefreshCw, Wand2, Trash2, Plus, Minus, FileText, PenTool, 
  MessageSquare, Clock, CheckCircle, AlertCircle, AlertTriangle, 
  Info, ArrowRight, ArrowLeft, ChevronRight, ClipboardList, Sparkles, Bot, SpellCheck
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
  bg: '#0a0e1a', surface: '#151929', surfaceHover: '#1c2137',
  border: 'rgba(255,255,255,0.06)', text: '#f1f5f9', muted: '#94a3b8',
  accent: '#ff3b3b', purple: '#a78bfa', blue: '#3b82f6', green: '#22c55e', yellow: '#f59e0b',
};

const INITIAL_POINT: Task2Point = { point: '', reason: '', example: '' };
const INITIAL_STATE: Task2State = {
  promptText: '', audience: '', providedArgs: ['', ''], position: 'A_FAVOR',
  topic: '', opinionLine: '', points: [{ ...INITIAL_POINT }, { ...INITIAL_POINT }], content: ''
};

const themeText = (text?: string) => {
  if (!text) return '';
  const cut = text.search(/\s*(In your (email|response|letter|survey)[:\s]|•|\*)/i);
  return cut > 0 ? text.slice(0, cut).trim() : text;
};

const STEPS = [
  { id: 1, title: 'Context', icon: FileText, color: T.blue },
  { id: 2, title: 'Plan', icon: PenTool, color: T.purple },
  { id: 3, title: 'Write', icon: ClipboardList, color: T.accent },
];

const card: React.CSSProperties = { background: T.surface, borderRadius: 16, padding: '20px', marginBottom: 14, border: `1px solid ${T.border}` };
const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 700, color: T.muted, marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' };
const inputStyle: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${T.border}`, borderRadius: 10, padding: '10px 14px', color: T.text, fontSize: 15, outline: 'none', boxSizing: 'border-box' };
const textareaStyle: React.CSSProperties = { ...inputStyle, minHeight: 60, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 };
const chip: React.CSSProperties = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '6px 14px', fontSize: 13, color: T.muted, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' };
const btnPrimary: React.CSSProperties = { background: `linear-gradient(135deg, ${T.accent}, #cc2f2f)`, color: '#fff', border: 'none', borderRadius: 12, padding: '12px 28px', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 };
const btnSecondary: React.CSSProperties = { background: 'rgba(255,255,255,0.06)', color: T.text, border: `1px solid ${T.border}`, borderRadius: 12, padding: '12px 28px', fontWeight: 600, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 };

export default function Task2Page() {
  const [currentStep, setCurrentStep] = useState(1);
  const [state, setState] = useState<Task2State>(INITIAL_STATE);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [contexts, setContexts] = useState<ContextItem[]>([]);
  const [selectedContextId, setSelectedContextId] = useState<string | null>(null);
  const [examModeActive, setExamModeActive] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [aiEvaluation, setAiEvaluation] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [spellCheckEnabled, setSpellCheckEnabled] = useState(false);
  const [transferMessage, setTransferMessage] = useState('');
  const writingTextareaRef = useRef<HTMLTextAreaElement>(null);
  const { isPro } = useContentAccess();

  const selectedContext = contexts.find(c => c.id === selectedContextId);

  useEffect(() => {
    analytics.exerciseStart('writing', 'task-2');
    fetch('/content/contexts.json').then(r => r.json()).then(data => {
      if (data.task2) {
        setContexts(data.task2);
        try {
          const stored = localStorage.getItem('celpip_ai_writing_prompt');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.task === 2) {
              localStorage.removeItem('celpip_ai_writing_prompt');
              const themes = data.task2.filter((c: ContextItem) => c.category !== 'custom');
              if (themes.length > 0) handleContextSelect(themes[Math.floor(Math.random() * themes.length)]);
            }
          }
        } catch {}
      }
    }).catch(() => {});
  }, []);

  const handleContextSelect = (context: ContextItem) => {
    setSelectedContextId(context.id);
    if (context.category !== 'custom') updateState('promptText', context.content);
  };

  const wordCount = countWords(state.content);
  const updateState = (field: keyof Task2State, value: Task2State[keyof Task2State]) => setState(prev => ({ ...prev, [field]: value }));
  const updatePoint = (i: number, field: keyof Task2Point, value: string) => {
    const np = [...state.points]; np[i] = { ...np[i], [field]: value }; updateState('points', np);
  };
  const addPoint = () => { if (state.points.length < 3) updateState('points', [...state.points, { ...INITIAL_POINT }]); };
  const removePoint = () => { if (state.points.length > 1) { const np = [...state.points]; np.pop(); updateState('points', np); } };

  const transferPlanning = () => {
    const parts: string[] = [];
    if (state.opinionLine?.trim()) parts.push(`In my opinion, I would rather ${state.opinionLine.trim()}. I believe this is the best choice for several reasons.`);
    const connectors = ['First', 'Second', 'Finally'];
    state.points.forEach((p, i) => {
      const segs: string[] = [];
      if (p.point?.trim()) segs.push(`${connectors[i] || 'Additionally'}, ${p.point.trim()}.`);
      if (p.reason?.trim()) segs.push(`This is because ${p.reason.trim()}.`);
      if (p.example?.trim()) segs.push(`For example, ${p.example.trim()}.`);
      if (segs.length) parts.push(segs.join(' '));
    });
    if (!parts.length) { setTransferMessage('⚠️ No planning to transfer.'); setTimeout(() => setTransferMessage(''), 3000); return; }
    parts.push('In conclusion, considering these reasons, I am convinced that this is the superior option.');
    const t = parts.join('\n\n');
    updateState('content', state.content.trim() ? `${state.content.trim()}\n\n${t}` : t);
    setTransferMessage('✅ Planning transferred!'); setTimeout(() => setTransferMessage(''), 3000);
  };

  const generateStructure = () => {
    const intro = `In my opinion, regarding the ${state.topic || 'survey topic'}, I would rather ${state.opinionLine || 'choose option...'}. I believe this is the best choice for several reasons.`;
    let body = '';
    const conn = ['First', 'Second', 'Finally'];
    state.points.forEach((p, i) => { body += `\n\n${conn[i] || 'Additionally'}, ${p.point || '[Point]'}. This is because ${p.reason || '[Reason]'}. For example, ${p.example || '[Example]'}.`; });
    updateState('content', intro + body + '\n\nIn conclusion, considering these reasons, I am convinced that this is the superior option.');
  };

  const handleAIEvaluate = async () => {
    if (wordCount < 50) { setAiError('Write at least 50 words.'); return; }
    analytics.aiFeedbackRequest('writing');
    setAiLoading(true); setAiError(null); setAiEvaluation(null);
    try {
      const r = await fetch('/api/evaluate/ai', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: 'task2', text: state.content, prompt: state.promptText, context: { situation: selectedContext?.title || state.topic || '', audience: state.audience } })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Evaluation error');
      setAiEvaluation(d.evaluation);
    } catch (e: any) { setAiError(e.message); } finally { setAiLoading(false); }
  };

  const handleClear = () => {
    if (confirm('Clear everything?')) { setState(INITIAL_STATE); setFeedback([]); setAiEvaluation(null); setAiError(null); setSelectedContextId(null); setCurrentStep(1); }
  };

  const goToStep = (s: number) => { if (s >= 1 && s <= 3) { setCurrentStep(s); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
  const nextStep = () => goToStep(currentStep + 1);
  const prevStep = () => goToStep(currentStep - 1);
  const stepHasContent = (s: number) => {
    if (s === 1) return !!state.promptText.trim();
    if (s === 2) return !!state.opinionLine.trim() || state.points.some(p => p.point.trim());
    return !!state.content.trim();
  };

  const wcColor = wordCount < 150 ? T.yellow : wordCount <= 200 ? T.green : T.accent;
  const preColors: Record<string, string> = { P: T.blue, R: T.purple, E: T.green };

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text, fontFamily: "'Inter','Segoe UI',sans-serif", paddingBottom: 100 }}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .step-animate { animation: fadeIn 0.3s ease; }
        .chip-btn:hover { background: rgba(255,255,255,0.12) !important; color: #fff !important; }
        .writing-input:focus { border-color: ${T.purple} !important; box-shadow: 0 0 0 2px ${T.purple}30 !important; }
      `}</style>

      <ExerciseGate section="Writing" />
      {newAchievement && <AchievementToast achievement={newAchievement} onClose={() => { markAchievementSeen(newAchievement.id); setNewAchievement(null); }} />}

      {/* ── Header ── */}
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: '16px 20px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `${T.purple}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ClipboardList size={20} color={T.purple} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Task 2 — Survey</h1>
              <p style={{ margin: 0, fontSize: 13, color: T.muted, display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> 26 min</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <ExamMode taskType="task2" totalMinutes={26} isActive={examModeActive} onStart={() => setCurrentStep(3)} onEnd={() => {}} onToggle={setExamModeActive} />
            {!examModeActive && <ExamTimer totalMinutes={26} warningMinutes={5} />}
            <DraftManager task="task2" currentData={state as unknown as Record<string, unknown>} wordCount={wordCount} onLoad={(d) => setState(d as unknown as Task2State)} scenarioTitle={selectedContext?.title || 'Survey'} />
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
                  borderBottom: `3px solid ${active ? step.color : done ? `${step.color}40` : T.border}`, borderRadius: 0,
                }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? `${step.color}25` : done ? `${step.color}15` : 'rgba(255,255,255,0.04)' }}>
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

      {/* ── Content ── */}
      <div className="step-animate" key={currentStep} style={{ maxWidth: 700, margin: '0 auto', padding: '20px' }}>

        {/* ═══ STEP 1 ═══ */}
        {currentStep === 1 && (
          <>
            <div style={card}>
              <label style={labelStyle}>Choose a theme</label>
              {contexts.length > 0 && <ContextSelector contexts={contexts} selectedId={selectedContextId} onSelect={handleContextSelect} placeholder="Select a theme..." freeLimit={FREE_LIMITS.writing.task2} isPro={isPro} />}
            </div>

            <div style={card}>
              <label style={labelStyle}>Survey Prompt</label>
              <textarea className="writing-input" style={{ ...textareaStyle, minHeight: 120 }} placeholder="Paste the prompt here..." value={state.promptText} onChange={e => updateState('promptText', e.target.value)} />
            </div>

            <div style={{ ...card, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={labelStyle}>Audience</label>
                <input className="writing-input" style={inputStyle} placeholder="City Council, HR..." value={state.audience} onChange={e => updateState('audience', e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Topic Keywords</label>
                <input className="writing-input" style={inputStyle} placeholder="building a park, remote work..." value={state.topic} onChange={e => updateState('topic', e.target.value)} />
              </div>
            </div>

            <div style={card}>
              <label style={labelStyle}>Your Position</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {(['A_FAVOR', 'CONTRA'] as const).map((pos, i) => (
                  <button key={pos} onClick={() => updateState('position', pos)} style={{
                    flex: 1, padding: '14px 16px', borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s',
                    background: state.position === pos ? `${[T.blue, T.purple][i]}15` : 'rgba(255,255,255,0.03)',
                    border: `2px solid ${state.position === pos ? [T.blue, T.purple][i] : T.border}`,
                    color: state.position === pos ? [T.blue, T.purple][i] : T.muted,
                    fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <span style={{ width: 28, height: 28, borderRadius: 8, background: `${[T.blue, T.purple][i]}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14 }}>
                      {['A', 'B'][i]}
                    </span>
                    Option {['A', 'B'][i]}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button onClick={nextStep} style={btnPrimary}>Next: Plan <ArrowRight size={18} /></button>
            </div>
          </>
        )}

        {/* ═══ STEP 2 ═══ */}
        {currentStep === 2 && (
          <>
            {selectedContext && (
              <div style={{ ...card, background: `${T.blue}08`, borderColor: `${T.blue}20` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: T.blue, textTransform: 'uppercase' }}>Theme</span>
                  <button onClick={() => setCurrentStep(1)} style={{ background: 'none', border: 'none', color: T.blue, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Change</button>
                </div>
                <p style={{ margin: 0, fontSize: 14, color: T.muted }}>{themeText(selectedContext.content)}</p>
              </div>
            )}

            {/* Opinion — chips first, then editable */}
            <div style={card}>
              <label style={labelStyle}>Opinion Line</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                {["I would rather choose option A because...", "I strongly believe that...", "In my opinion, the best approach is...", "I recommend that the committee...", "I am convinced that option B is better because..."].map(s => (
                  <button key={s} className="chip-btn" style={{ ...chip, fontSize: 12, ...(state.opinionLine === s ? { background: `${T.blue}20`, borderColor: T.blue, color: T.blue } : {}) }}
                    onClick={() => updateState('opinionLine', s)}>{s}</button>
                ))}
              </div>
              <input className="writing-input" style={inputStyle} placeholder="Or type your own opinion line..." value={state.opinionLine} onChange={e => updateState('opinionLine', e.target.value)} />
            </div>

            {/* Arguments PRE — with sentence starter chips */}
            <div style={{ ...card, padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <label style={{ ...labelStyle, margin: 0 }}>Arguments (PRE)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button onClick={removePoint} disabled={state.points.length <= 1} style={{ ...chip, padding: '4px 10px', opacity: state.points.length <= 1 ? 0.3 : 1 }}><Minus size={14} /></button>
                  <span style={{ fontSize: 13, fontWeight: 700, color: T.muted }}>{state.points.length}/3</span>
                  <button onClick={addPoint} disabled={state.points.length >= 3} style={{ ...chip, padding: '4px 10px', opacity: state.points.length >= 3 ? 0.3 : 1 }}><Plus size={14} /></button>
                </div>
              </div>

              {state.points.map((p, idx) => {
                const pointStarters = [
                  ["it promotes better health...", "it saves time and money...", "it benefits the community..."],
                  ["it creates more opportunities...", "it improves quality of life...", "it is more environmentally friendly..."],
                  ["it encourages social interaction...", "it reduces long-term costs...", "it has proven results..."],
                ];
                const reasonStarters = ["This is important because...", "The reason is that...", "This matters since..."];
                const exampleStarters = ["For instance,...", "A good example is...", "In my experience,..."];
                return (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: 16, marginBottom: 12, border: `1px solid ${T.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{ width: 24, height: 24, borderRadius: 6, background: `${T.purple}20`, color: T.purple, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900 }}>{idx + 1}</span>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{['First', 'Second', 'Third'][idx]} Argument</span>
                  </div>

                  {/* P — Point */}
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <span style={{ width: 22, height: 22, borderRadius: 6, background: `${T.blue}20`, color: T.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900 }}>P</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: T.muted }}>Point</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                      {(pointStarters[idx] || pointStarters[0]).map(s => (
                        <button key={s} className="chip-btn" style={{ ...chip, fontSize: 11 }}
                          onClick={() => updatePoint(idx, 'point', p.point ? p.point + ' ' + s : s)}>{s}</button>
                      ))}
                    </div>
                    <input className="writing-input" style={inputStyle} placeholder="Tap a starter or type your point..." value={p.point} onChange={e => updatePoint(idx, 'point', e.target.value)} />
                  </div>

                  {/* R — Reason */}
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <span style={{ width: 22, height: 22, borderRadius: 6, background: `${T.purple}20`, color: T.purple, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900 }}>R</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: T.muted }}>Reason</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                      {reasonStarters.map(s => (
                        <button key={s} className="chip-btn" style={{ ...chip, fontSize: 11 }}
                          onClick={() => updatePoint(idx, 'reason', p.reason ? p.reason + ' ' + s : s)}>{s}</button>
                      ))}
                    </div>
                    <input className="writing-input" style={inputStyle} placeholder="Tap a starter or type your reason..." value={p.reason} onChange={e => updatePoint(idx, 'reason', e.target.value)} />
                  </div>

                  {/* E — Example */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <span style={{ width: 22, height: 22, borderRadius: 6, background: `${T.green}20`, color: T.green, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900 }}>E</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: T.muted }}>Example</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                      {exampleStarters.map(s => (
                        <button key={s} className="chip-btn" style={{ ...chip, fontSize: 11 }}
                          onClick={() => updatePoint(idx, 'example', p.example ? p.example + ' ' + s : s)}>{s}</button>
                      ))}
                    </div>
                    <input className="writing-input" style={inputStyle} placeholder="Tap a starter or type your example..." value={p.example} onChange={e => updatePoint(idx, 'example', e.target.value)} />
                  </div>
                </div>
                );
              })}

              <div style={{ background: `${T.green}08`, borderRadius: 10, padding: '10px 14px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 16 }}>💡</span>
                <p style={{ margin: 0, fontSize: 13, color: T.muted }}>
                  <strong style={{ color: T.text }}>Conclusion</strong> (auto-generated): &ldquo;In conclusion, considering these reasons, I am convinced...&rdquo;
                </p>
              </div>
            </div>

            <TaskHelpPanel defaultTab="task2" />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <button onClick={prevStep} style={btnSecondary}><ArrowLeft size={18} /> Back</button>
              <button onClick={nextStep} style={btnPrimary}>Next: Write <ArrowRight size={18} /></button>
            </div>
          </>
        )}

        {/* ═══ STEP 3 ═══ */}
        {currentStep === 3 && (
          <>
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

            {selectedContext && (
              <div style={{ ...card, padding: '12px 16px', background: `${T.blue}06` }}>
                <p style={{ margin: 0, fontSize: 13, color: T.muted }}><strong style={{ color: T.blue }}>Prompt:</strong> {themeText(selectedContext.content)}</p>
              </div>
            )}

            <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: `1px solid ${T.border}`, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <VoiceDictation onTranscript={(text) => updateState('content', state.content + (state.content && !state.content.endsWith(' ') ? ' ' : '') + text)} />
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, color: T.muted }}>
                    <input type="checkbox" checked={spellCheckEnabled} onChange={e => setSpellCheckEnabled(e.target.checked)} style={{ width: 16, height: 16, accentColor: T.purple }} />
                    <SpellCheck size={14} /> Spell Check
                  </label>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={transferPlanning} className="chip-btn" style={{ ...chip, fontSize: 12 }}><ArrowRight size={12} /> Transfer Plan</button>
                  <button onClick={generateStructure} className="chip-btn" style={{ ...chip, fontSize: 12 }}><Wand2 size={12} /> Structure</button>
                </div>
              </div>
              <div style={{ padding: '0 16px 16px' }}>
                <SpellCheckTextarea value={state.content} onChange={(v) => updateState('content', v)}
                  placeholder="Start writing your response... or tap Dictate to speak!" spellCheckEnabled={spellCheckEnabled} className="" minHeight="300px" />
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
