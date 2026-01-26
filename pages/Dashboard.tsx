import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, PenTool, BarChart3, ArrowRight } from 'lucide-react';
import { Card, Button } from '../components/Common';
import { SessionStats } from '../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = React.useState<SessionStats | null>(null);

  React.useEffect(() => {
    // Mock loading stats from local storage
    const saved = localStorage.getItem('celpip_last_session');
    if (saved) {
      setStats(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-slate-500">Bem-vindo ao seu treinador de escrita CELPIP.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col items-center text-center hover:border-slate-300 transition-colors group">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Mail size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Task 1 — Email</h3>
          <p className="text-slate-500 mb-6 text-sm">Pratique emails formais e semi-formais. 150-200 palavras. Foco em tom, estrutura e solicitações.</p>
          <Button onClick={() => navigate('/task-1')} className="w-full justify-center">
            Praticar Task 1 <ArrowRight size={16} />
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col items-center text-center hover:border-slate-300 transition-colors group">
          <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <PenTool size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Task 2 — Survey</h3>
          <p className="text-slate-500 mb-6 text-sm">Responda a pesquisas de opinião. Estrutura PRE (Point-Reason-Example). Argumentação sólida.</p>
          <Button onClick={() => navigate('/task-2')} className="w-full justify-center">
             Praticar Task 2 <ArrowRight size={16} />
          </Button>
        </div>
      </div>

      <Card title="Sessão Atual" className="md:w-2/3 mx-auto">
        {stats ? (
           <div className="flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex items-center gap-4">
               <div className="p-3 bg-slate-100 rounded-lg">
                 <BarChart3 className="text-slate-600" />
               </div>
               <div>
                 <p className="text-sm text-slate-500">Última prática</p>
                 <p className="font-semibold text-slate-900">{stats.lastTask === 'TASK_1' ? 'Email Task' : 'Survey Task'}</p>
               </div>
             </div>
             
             <div className="text-center md:text-left">
                <p className="text-sm text-slate-500">Palavras</p>
                <p className="font-bold text-2xl text-slate-900">{stats.lastWordCount}</p>
             </div>

             <div className="text-center md:text-right">
                <p className="text-xs text-slate-400">{new Date(stats.date).toLocaleDateString()}</p>
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                    stats.lastWordCount >= 150 && stats.lastWordCount <= 200 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {stats.lastWordCount >= 150 && stats.lastWordCount <= 200 ? 'Faixa Ideal' : 'Fora da faixa'}
                </span>
             </div>
           </div>
        ) : (
          <div className="text-center py-6 text-slate-400">
            <p>Nenhuma sessão registrada ainda.</p>
            <p className="text-xs mt-1">Complete um exercício para ver suas estatísticas aqui.</p>
          </div>
        )}
      </Card>
    </div>
  );
};