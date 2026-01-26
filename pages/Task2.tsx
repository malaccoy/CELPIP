import React, { useState } from 'react';
import { Card, Input, Textarea, Button, WordCounter, FeedbackList } from '../components/Common';
import { Task2State, FeedbackItem, Task2Point } from '../types';
import { generateTask2Feedback, countWords } from '../utils/feedback';
import { Save, RefreshCw, Wand2, Trash2, Plus, Minus } from 'lucide-react';

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

export const Task2: React.FC = () => {
  const [state, setState] = useState<Task2State>(INITIAL_STATE);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  
  const wordCount = countWords(state.content);

  const updateState = (field: keyof Task2State, value: any) => {
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
    if(confirm('Tem certeza que deseja limpar tudo?')) {
        setState(INITIAL_STATE);
        setFeedback([]);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Task 2 — Survey Response</h2>
          <p className="text-slate-500 text-sm">Tempo recomendado: 26 minutos</p>
        </div>
         <div className="flex gap-2">
           <Button variant="ghost" onClick={handleClear} className="text-red-500 hover:text-red-600 hover:bg-red-50">
             <Trash2 size={16} /> Limpar
           </Button>
           <Button variant="outline" onClick={() => {}}>
             <Save size={16} /> Salvar Rascunho
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Col 1: Context */}
        <div className="space-y-6 overflow-y-auto pr-2 pb-10">
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

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Sua Posição</label>
                <div className="flex gap-2 mb-3">
                    <button 
                        onClick={() => updateState('position', 'A_FAVOR')}
                        className={`flex-1 py-2 text-sm font-medium rounded transition-colors ${state.position === 'A_FAVOR' ? 'bg-slate-900 text-white' : 'bg-white border text-slate-600'}`}
                    >
                        Opção A
                    </button>
                    <button 
                        onClick={() => updateState('position', 'CONTRA')}
                        className={`flex-1 py-2 text-sm font-medium rounded transition-colors ${state.position === 'CONTRA' ? 'bg-slate-900 text-white' : 'bg-white border text-slate-600'}`}
                    >
                        Opção B
                    </button>
                </div>
                <Input 
                    label="Tema escolhido (Keywords)"
                    placeholder="Ex: building a new park"
                    value={state.topic}
                    onChange={e => updateState('topic', e.target.value)}
                    className="mb-0"
                />
            </div>
          </Card>
        </div>

        {/* Col 2: Planning (PRE) */}
        <div className="space-y-6 overflow-y-auto pr-2 pb-10">
          <Card title="2. Planejamento (PRE Structure)">
             <Input 
               label="Opinion Line (Intro)"
               value={state.opinionLine}
               onChange={e => updateState('opinionLine', e.target.value)}
               suggestions={["I would rather...", "I recommend that...", "I believe option A is better because..."]}
               onSuggestionClick={val => updateState('opinionLine', val)}
             />

             <div className="space-y-4 mt-6">
                <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-slate-700">Argumentos (Points)</h4>
                    <div className="flex gap-1">
                        <button onClick={addPoint} disabled={state.points.length >= 3} className="p-1 hover:bg-slate-100 rounded text-slate-600 disabled:opacity-30"><Plus size={16}/></button>
                        <button onClick={removePoint} disabled={state.points.length <= 1} className="p-1 hover:bg-slate-100 rounded text-slate-600 disabled:opacity-30"><Minus size={16}/></button>
                    </div>
                </div>

                {state.points.map((p, idx) => (
                    <div key={idx} className="p-3 border border-slate-200 rounded-lg bg-slate-50">
                        <p className="text-xs font-bold text-slate-500 mb-2 uppercase">Argumento {idx + 1}</p>
                        <Input 
                           label="Point (Idea)" 
                           className="bg-white"
                           value={p.point}
                           onChange={e => updatePoint(idx, 'point', e.target.value)}
                        />
                        <Textarea 
                            label="Reason (Why?)" 
                            rows={2} 
                            className="bg-white mb-2"
                            value={p.reason}
                            onChange={e => updatePoint(idx, 'reason', e.target.value)}
                        />
                        <Textarea 
                            label="Example (Specific)" 
                            rows={2} 
                            className="bg-white mb-0"
                            value={p.example}
                            onChange={e => updatePoint(idx, 'example', e.target.value)}
                        />
                    </div>
                ))}
             </div>
             
             <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-xs rounded border border-blue-100">
                <span className="font-bold">Conclusão Auto:</span> "In conclusion... because [Point 1] and [Point 2]."
             </div>
          </Card>
        </div>

        {/* Col 3: Writing */}
        <div className="flex flex-col gap-4 overflow-y-auto pr-2 pb-10">
          <Card className="flex-1 flex flex-col min-h-[500px]">
             <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
               <h3 className="font-semibold text-slate-800">3. Escrita</h3>
               <WordCounter count={wordCount} />
             </div>
             
             <textarea 
               className="flex-1 w-full resize-none outline-none text-slate-800 font-mono text-sm leading-relaxed p-2"
               placeholder="Comece a escrever aqui..."
               value={state.content}
               onChange={e => updateState('content', e.target.value)}
             />

             <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
               <Button variant="secondary" onClick={generateStructure} title="Preencher esqueleto">
                 <Wand2 size={16} /> Gerar Estrutura
               </Button>
               <Button className="flex-1" onClick={handleEvaluate}>
                 <RefreshCw size={16} /> Avaliar (Regras)
               </Button>
             </div>
          </Card>

          {feedback.length > 0 && (
             <Card title="Feedback" className="bg-slate-50 border-slate-200">
               <FeedbackList items={feedback} />
             </Card>
          )}
        </div>

      </div>
    </div>
  );
};