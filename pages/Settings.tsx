import React from 'react';
import { Card, Button } from '../components/Common';

export const Settings: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
       <h2 className="text-2xl font-bold text-slate-900">Configurações</h2>
       
       <Card title="Preferências de Aprendizado">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-medium text-slate-900">Idioma de Instrução</h4>
                    <p className="text-xs text-slate-500">Idioma da interface e dicas.</p>
                </div>
                <select className="bg-slate-50 border border-slate-300 text-sm rounded-lg p-2">
                    <option>Português (Brasil)</option>
                    <option disabled>English (Coming Soon)</option>
                </select>
            </div>

            <div className="border-t border-slate-100 pt-6">
                 <h4 className="text-sm font-medium text-slate-900 mb-2">Transição PT → EN</h4>
                 <p className="text-xs text-slate-500 mb-4">Ajuste o quanto de inglês aparece nas instruções de planejamento.</p>
                 <input type="range" className="w-full accent-slate-900" min="0" max="100" />
                 <div className="flex justify-between text-xs text-slate-400 mt-1">
                     <span>100% PT</span>
                     <span>Misto</span>
                     <span>100% EN</span>
                 </div>
            </div>

            <div className="border-t border-slate-100 pt-6 flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-medium text-slate-900">Modo de Feedback</h4>
                    <p className="text-xs text-slate-500">Como seu texto é avaliado.</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button className="px-3 py-1 bg-white shadow-sm rounded text-xs font-medium text-slate-900">Regras (Padrão)</button>
                    <button className="px-3 py-1 text-xs font-medium text-slate-400 cursor-not-allowed">IA (Em breve)</button>
                </div>
            </div>
          </div>
       </Card>

       <Card title="Dados">
           <div className="space-y-4">
               <p className="text-sm text-slate-600">Seus rascunhos são salvos no armazenamento local do navegador.</p>
               <Button variant="danger" onClick={() => {
                   if(confirm("Isso apagará seu histórico de estatísticas. Confirmar?")) {
                       localStorage.removeItem('celpip_last_session');
                       alert("Dados limpos.");
                   }
               }}>
                   Limpar Estatísticas Locais
               </Button>
           </div>
       </Card>
    </div>
  );
};