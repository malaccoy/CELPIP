import React, { useState } from 'react';
import { Card, Input, Textarea, Button, WordCounter, FeedbackList } from '../components/Common';
import { Task1State, FeedbackItem } from '../types';
import { generateTask1Feedback, countWords } from '../utils/feedback';
import { Save, RefreshCw, Wand2, Trash2 } from 'lucide-react';

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

export const Task1: React.FC = () => {
  const [state, setState] = useState<Task1State>(INITIAL_STATE);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  
  const wordCount = countWords(state.content);

  const updateState = (field: keyof Task1State, value: any) => {
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
    
    // Save minimal stats
    localStorage.setItem('celpip_last_session', JSON.stringify({
      lastWordCount: wordCount,
      lastTask: 'TASK_1',
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
          <h2 className="text-2xl font-bold text-slate-900">Task 1 — Email Writing</h2>
          <p className="text-slate-500 text-sm">Tempo recomendado: 27 minutos</p>
        </div>
        <div className="flex gap-2">
           <Button variant="ghost" onClick={handleClear} className="text-red-500 hover:text-red-600 hover:bg-red-50">
             <Trash2 size={16} /> Limpar
           </Button>
           <Button variant="outline" onClick={() => {/* Save draft logic placeholder */}}>
             <Save size={16} /> Salvar Rascunho
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Column 1: Context */}
        <div className="space-y-6 overflow-y-auto pr-2 pb-10">
          <Card title="1. Contexto do Enunciado">
            <Textarea 
              label="Enunciado da Tarefa" 
              placeholder="Cole o enunciado aqui..." 
              rows={4}
              value={state.promptText}
              onChange={e => updateState('promptText', e.target.value)}
            />
            
            <div className="grid grid-cols-2 gap-4 mb-4">
               <Input 
                 label="Destinatário (WHO)" 
                 placeholder="Ex: Manager, Mr. Smith" 
                 value={state.recipient}
                 onChange={e => updateState('recipient', e.target.value)}
               />
               <div className="mb-4">
                 <label className="block text-sm font-medium text-slate-700 mb-1">Formalidade</label>
                 <select 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    value={state.formality}
                    onChange={e => updateState('formality', e.target.value)}
                 >
                   <option value="Formal">Formal</option>
                   <option value="Semi-formal">Semi-formal</option>
                 </select>
               </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Perguntas do Enunciado</label>
              {state.questions.map((q, i) => (
                <input 
                  key={i}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  placeholder={`Pergunta ${i + 1}`}
                  value={q}
                  onChange={e => updateQuestion(i, e.target.value)}
                />
              ))}
            </div>
          </Card>
        </div>

        {/* Column 2: Planning */}
        <div className="space-y-6 overflow-y-auto pr-2 pb-10">
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

            <div className="mb-4">
              <span className="block text-sm font-medium text-slate-700 mb-2">Estrutura do Corpo</span>
              <div className="flex gap-2">
                 {["First", "Second", "Third", "Finally"].map(tag => (
                   <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded border border-slate-200">{tag}</span>
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
               <Button variant="secondary" onClick={generateTemplate} title="Preencher com base no plano">
                 <Wand2 size={16} /> Template
               </Button>
               <Button className="flex-1" onClick={handleEvaluate}>
                 <RefreshCw size={16} /> Avaliar (Regras)
               </Button>
             </div>
          </Card>

          {/* Feedback Panel */}
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