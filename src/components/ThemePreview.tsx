'use client';

import React, { useState, useMemo } from 'react';
import { Eye, Check, FileText } from 'lucide-react';
import Modal from '@/components/Modal';
import styles from '@/styles/ThemePreview.module.scss';

export interface ThemeData {
  id: string;
  title: string;
  content: string;
  category: string;
  recipient?: string;
  formality?: 'Formal' | 'Semi-formal';
  questions?: string[];
}

interface ThemePreviewProps {
  theme: ThemeData | null;
  onApply: (theme: ThemeData) => void;
}

const EXCERPT_LENGTH = 250;

export default function ThemePreview({ theme, onApply }: ThemePreviewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Create short excerpt with ellipsis
  const excerpt = useMemo(() => {
    if (!theme || !theme.content) return '';
    
    if (theme.content.length <= EXCERPT_LENGTH) {
      return theme.content;
    }
    
    // Find a good break point (end of word or sentence)
    const truncated = theme.content.slice(0, EXCERPT_LENGTH);
    const lastSpace = truncated.lastIndexOf(' ');
    const breakPoint = lastSpace > 180 ? lastSpace : EXCERPT_LENGTH;
    
    return theme.content.slice(0, breakPoint) + '...';
  }, [theme]);

  // Parse questions from content if not explicitly provided
  const questions = useMemo(() => {
    if (!theme) return [];
    
    // If questions are explicitly provided, use them
    if (theme.questions && theme.questions.length > 0) {
      return theme.questions;
    }
    
    // Otherwise, try to extract bullet points from content
    const bulletRegex = /[•\-\*]\s*(.+?)(?=\n|$)/g;
    const matches = [...theme.content.matchAll(bulletRegex)];
    return matches.map(m => m[1].trim()).slice(0, 4);
  }, [theme]);

  const handleApply = () => {
    if (theme) {
      onApply(theme);
      setIsModalOpen(false);
    }
  };

  if (!theme || theme.category === 'custom') {
    return null;
  }

  return (
    <>
      <div className={styles.previewCard}>
        <div className={styles.previewHeader}>
          <div className={styles.previewIcon}>
            <FileText size={16} />
          </div>
          <span className={styles.previewLabel}>Preview of Prompt</span>
        </div>

        <h4 className={styles.previewTitle}>{theme.title}</h4>
        
        <div className={styles.previewExcerpt}>
          <p>{excerpt}</p>
        </div>

        {questions.length > 0 && (
          <div className={styles.previewQuestions}>
            <span className={styles.questionsLabel}>Questions:</span>
            <ul>
              {questions.slice(0, 3).map((q, i) => (
                <li key={i}>{q}</li>
              ))}
              {questions.length > 3 && (
                <li className={styles.moreQuestions}>+{questions.length - 3} more</li>
              )}
            </ul>
          </div>
        )}

        <div className={styles.previewActions}>
          <button 
            type="button"
            className={styles.viewFullBtn}
            onClick={() => setIsModalOpen(true)}
          >
            <Eye size={16} />
            View full
          </button>
          <button 
            type="button"
            className={styles.applyBtn}
            onClick={handleApply}
          >
            <Check size={16} />
            Use this prompt
          </button>
        </div>
      </div>

      {/* Full Content Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={theme.title}
        size="md"
      >
        <div className={styles.modalContent}>
          <div className={styles.fullPrompt}>
            <h5 className={styles.sectionTitle}>Full Prompt</h5>
            <p className={styles.promptText}>{theme.content}</p>
          </div>

          {questions.length > 0 && (
            <div className={styles.fullQuestions}>
              <h5 className={styles.sectionTitle}>Questions to Address</h5>
              <ul>
                {questions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          )}

          {(theme.recipient || theme.formality) && (
            <div className={styles.metaInfo}>
              {theme.recipient && (
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Recipient:</span>
                  <span className={styles.metaValue}>{theme.recipient}</span>
                </div>
              )}
              {theme.formality && (
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Formality:</span>
                  <span className={styles.metaValue}>{theme.formality}</span>
                </div>
              )}
            </div>
          )}

          <button 
            type="button"
            className={styles.modalApplyBtn}
            onClick={handleApply}
          >
            <Check size={18} />
            Use this prompt
          </button>
        </div>
      </Modal>
    </>
  );
}
