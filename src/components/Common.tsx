'use client';

import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { FeedbackItem } from '@/types';
import styles from '@/styles/Common.module.scss';

// --- Card ---
export const Card: React.FC<{ title?: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({ title, children, className = '', style }) => (
  <div className={`${styles.card} ${className}`} style={style}>
    {title && (
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{title}</h3>
      </div>
    )}
    <div className={styles.cardBody}>
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
  <div className={styles.inputWrapper}>
    <label className={styles.inputLabel}>{label}</label>
    <input
      className={`${styles.input} ${className || ''}`}
      {...props}
    />
    {suggestions && suggestions.length > 0 && (
      <div className={styles.suggestions}>
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSuggestionClick && onSuggestionClick(s)}
            className={styles.suggestionBtn}
          >
            {s}
          </button>
        ))}
      </div>
    )}
    {helperText && <p className={styles.helperText}>{helperText}</p>}
  </div>
);

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }> = ({ label, className, ...props }) => (
  <div className={styles.textareaWrapper}>
    {label && <label className={styles.inputLabel}>{label}</label>}
    <textarea
      className={`${styles.textarea} ${className || ''}`}
      {...props}
    />
  </div>
);

// --- Buttons ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const variantClass = {
    primary: styles.buttonPrimary,
    secondary: styles.buttonSecondary,
    outline: styles.buttonOutline,
    ghost: styles.buttonGhost,
    danger: styles.buttonDanger
  }[variant];

  return (
    <button className={`${styles.button} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- Word Counter Badge ---
export const WordCounter: React.FC<{ count: number }> = ({ count }) => {
  let colorClass = styles.wordCounterDefault;
  let text = 'Abaixo do mínimo';

  if (count >= 150 && count <= 200) {
    colorClass = styles.wordCounterIdeal;
    text = 'Ideal';
  } else if (count > 200) {
    colorClass = styles.wordCounterAbove;
    text = 'Acima do recomendado';
  }

  return (
    <div className={`${styles.wordCounter} ${colorClass}`}>
      <span>{count} palavras</span>
      <span className={styles.wordCounterDot}></span>
      <span>{text}</span>
    </div>
  );
};

// --- Feedback List ---
export const FeedbackList: React.FC<{ items: FeedbackItem[] }> = ({ items }) => {
  if (items.length === 0) return null;

  const severityClasses = {
    BLOCKER: styles.feedbackBadgeBlocker,
    IMPORTANT: styles.feedbackBadgeImportant,
    POLISH: styles.feedbackBadgePolish,
  };

  const severityLabels = {
    BLOCKER: 'Bloqueador',
    IMPORTANT: 'Importante',
    POLISH: 'Polimento',
  };

  return (
    <div className={styles.feedbackList}>
      {items.map((item) => (
        <div key={item.id} className={`${styles.feedbackItem} ${item.passed ? styles.feedbackItemPassed : styles.feedbackItemFailed}`}>
          <div className={styles.feedbackIcon}>
            {item.passed ? <CheckCircle size={16} color="#16a34a" /> : <AlertCircle size={16} color={item.severity === 'BLOCKER' ? '#dc2626' : item.severity === 'IMPORTANT' ? '#d97706' : '#2563eb'} />}
          </div>
          <div className={styles.feedbackContent}>
            {!item.passed && (
              <span className={`${styles.feedbackBadge} ${severityClasses[item.severity]}`}>
                {severityLabels[item.severity]}
              </span>
            )}
            <span className={item.passed ? styles.feedbackMessagePassed : ''}>{item.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
