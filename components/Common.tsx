import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { FeedbackItem } from '../types';

// --- Card ---
export const Card: React.FC<{ title?: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col ${className}`}>
    {title && (
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>
    )}
    <div className="p-6 flex-1">
      {children}
    </div>
  </div>
);

// --- Inputs ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  suggestions?: string[];
  onSuggestionClick?: (val: string) => void;
}

export const Input: React.FC<InputProps> = ({ label, helperText, suggestions, onSuggestionClick, className, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    <input
      className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all text-sm ${className}`}
      {...props}
    />
    {suggestions && suggestions.length > 0 && (
      <div className="mt-2 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSuggestionClick && onSuggestionClick(s)}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded-full border border-slate-200 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    )}
    {helperText && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
  </div>
);

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }> = ({ label, className, ...props }) => (
  <div className="mb-4 flex flex-col h-full">
    {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
    <textarea
      className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all text-sm resize-none flex-1 ${className}`}
      {...props}
    />
  </div>
);

// --- Buttons ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClass = "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800",
    secondary: "bg-slate-200 text-slate-800 hover:bg-slate-300",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50",
    ghost: "text-slate-600 hover:bg-slate-100",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
  };

  return (
    <button className={`${baseClass} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- Word Counter Badge ---
export const WordCounter: React.FC<{ count: number }> = ({ count }) => {
  let color = 'bg-slate-100 text-slate-600';
  let text = 'Abaixo do mínimo';
  
  if (count >= 150 && count <= 200) {
    color = 'bg-emerald-100 text-emerald-700 border-emerald-200';
    text = 'Ideal';
  } else if (count > 200) {
    color = 'bg-amber-100 text-amber-700 border-amber-200';
    text = 'Acima do recomendado';
  } else {
    color = 'bg-red-50 text-red-600 border-red-200';
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${color}`}>
      <span>{count} palavras</span>
      <span className="w-1 h-1 bg-current rounded-full opacity-50"></span>
      <span>{text}</span>
    </div>
  );
};

// --- Feedback List ---
export const FeedbackList: React.FC<{ items: FeedbackItem[] }> = ({ items }) => {
  if (items.length === 0) return null;

  const severityLabels = {
    BLOCKER: { label: 'Bloqueador', color: 'text-red-600 bg-red-50 border-red-100' },
    IMPORTANT: { label: 'Importante', color: 'text-amber-600 bg-amber-50 border-amber-100' },
    POLISH: { label: 'Polimento', color: 'text-blue-600 bg-blue-50 border-blue-100' },
  };

  return (
    <div className="space-y-3 mt-4">
      {items.map((item) => (
        <div key={item.id} className={`p-3 rounded-lg border text-sm flex items-start gap-3 ${item.passed ? 'bg-green-50 border-green-100 text-green-800' : 'bg-white border-slate-200'}`}>
          <div className="mt-0.5 shrink-0">
             {item.passed ? <CheckCircle size={16} className="text-green-600" /> : <AlertCircle size={16} className={severityLabels[item.severity].color.split(' ')[0]} />}
          </div>
          <div className="flex-1">
             {!item.passed && (
               <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase mr-2 mb-1 ${severityLabels[item.severity].color}`}>
                 {severityLabels[item.severity].label}
               </span>
             )}
             <span className={item.passed ? 'line-through opacity-75' : ''}>{item.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
};