import React from 'react';
import { Card } from '../components/Common';

const Section = ({ title, items }: { title: string, items: string[] }) => (
    <Card title={title} className="h-full">
        <ul className="space-y-2">
            {items.map((it, i) => (
                <li key={i} className="text-sm text-slate-600 pb-2 border-b border-slate-100 last:border-0 last:pb-0">{it}</li>
            ))}
        </ul>
    </Card>
);

export const Library: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Biblioteca de Recursos</h2>
      <p className="text-slate-500">Frases úteis e estruturas para aumentar sua nota no CELPIP.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Section 
            title="Conectores de Sequência" 
            items={[
                "First of all / Firstly / To begin with",
                "Secondly / Moreover / Furthermore",
                "Thirdly / Additionally / In addition",
                "Finally / Lastly"
            ]} 
        />
        <Section 
            title="Task 1: Aberturas Formais" 
            items={[
                "Dear Mr. Smith,",
                "Dear Hiring Manager,",
                "To Whom It May Concern, (somente se não souber o cargo)",
                "Dear Resident,"
            ]} 
        />
         <Section 
            title="Task 1: Closing Lines" 
            items={[
                "I look forward to hearing from you soon.",
                "Please let me know if you require any further information.",
                "I would appreciate your immediate attention to this matter.",
                "Please contact me at 555-0199 if you have questions."
            ]} 
        />
         <Section 
            title="Task 2: Opinion Lines" 
            items={[
                "In my opinion, I would rather [Option A].",
                "I strongly recommend that we choose [Option B].",
                "I am convinced that [Option A] is the superior choice.",
                "It seems to me that [Option B] would be more beneficial."
            ]} 
        />
         <Section 
            title="Task 2: Giving Examples" 
            items={[
                "For example, last year the city built...",
                "For instance, consider the case of...",
                "A clear example of this is...",
                "Specifically, recent studies show..."
            ]} 
        />
        <Section 
            title="Task 2: Conclusão" 
            items={[
                "In conclusion, considering the reasons mentioned above...",
                "To summarize, I believe...",
                "All in all, despite the benefits of Option A, Option B is better."
            ]} 
        />
      </div>
    </div>
  );
};