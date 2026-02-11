'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Save, FolderOpen, Trash2, X, Clock, FileText, ChevronDown, Tag } from 'lucide-react';
import styles from '@/styles/DraftManager.module.scss';

export interface Draft {
  id: string;
  name: string;
  description?: string;
  task: 'task1' | 'task2';
  data: Record<string, unknown>;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

interface DraftManagerProps {
  task: 'task1' | 'task2';
  currentData: Record<string, unknown>;
  wordCount: number;
  onLoad: (data: Record<string, unknown>) => void;
  scenarioTitle?: string; // Título do tema selecionado
}

const STORAGE_KEY = 'celpip_drafts';

export default function DraftManager({ task, currentData, wordCount, onLoad, scenarioTitle }: DraftManagerProps) {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [draftDescription, setDraftDescription] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load drafts from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const allDrafts: Draft[] = JSON.parse(stored);
        setDrafts(allDrafts.filter(d => d.task === task));
      }
    } catch (e) {
      console.error('Failed to load drafts:', e);
    }
  }, [task]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Pre-fill name with scenario title when opening save modal
  const openSaveModal = () => {
    setDraftName(scenarioTitle || '');
    setDraftDescription('');
    setShowSaveModal(true);
  };

  const saveDraft = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allDrafts: Draft[] = stored ? JSON.parse(stored) : [];
      
      // Build name: tema + descrição opcional
      let finalName = draftName.trim() || scenarioTitle || `Rascunho ${new Date().toLocaleDateString('pt-BR')}`;
      if (draftDescription.trim()) {
        finalName = `${finalName} - ${draftDescription.trim()}`;
      }
      
      const newDraft: Draft = {
        id: `draft_${Date.now()}`,
        name: finalName,
        description: draftDescription.trim() || undefined,
        task,
        data: currentData,
        wordCount,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      allDrafts.unshift(newDraft);
      
      // Keep only last 20 drafts total
      const trimmed = allDrafts.slice(0, 20);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      setDrafts(trimmed.filter(d => d.task === task));
      
      setSaveMessage('✅ Salvo!');
      setTimeout(() => setSaveMessage(''), 2000);
      setShowSaveModal(false);
      setDraftName('');
      setDraftDescription('');
    } catch (e) {
      console.error('Failed to save draft:', e);
      setSaveMessage('❌ Erro');
      setTimeout(() => setSaveMessage(''), 2000);
    }
  };

  const loadDraft = (draft: Draft) => {
    // Load immediately without confirm for better UX
    try {
      console.log('Loading draft:', draft.name, draft.data);
      onLoad(draft.data);
      setIsOpen(false);
      setSaveMessage('✅ Carregado!');
      setTimeout(() => setSaveMessage(''), 2000);
    } catch (e) {
      console.error('Failed to load draft:', e);
      setSaveMessage('❌ Erro ao carregar');
      setTimeout(() => setSaveMessage(''), 2000);
    }
  };

  const deleteDraft = (draftId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Excluir este rascunho?')) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const allDrafts: Draft[] = stored ? JSON.parse(stored) : [];
        const filtered = allDrafts.filter(d => d.id !== draftId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        setDrafts(filtered.filter(d => d.task === task));
      } catch (e) {
        console.error('Failed to delete draft:', e);
      }
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.draftManager} ref={dropdownRef}>
      {/* Save Button - Opens Modal */}
      <button 
        className={styles.saveBtn}
        onClick={openSaveModal}
        title="Salvar rascunho"
      >
        <Save size={16} />
        {saveMessage || 'Save'}
      </button>

      {/* Load Button with Dropdown */}
      <div className={styles.loadWrapper}>
        <button 
          className={styles.loadBtn}
          onClick={() => setIsOpen(!isOpen)}
          title="Carregar rascunho"
        >
          <FolderOpen size={16} />
          <ChevronDown size={14} className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} />
        </button>

        {isOpen && (
          <div className={styles.dropdown}>
            <div className={styles.dropdownHeader}>
              <span>Rascunhos Salvos</span>
              <span className={styles.dropdownCount}>{drafts.length}</span>
            </div>
            
            {drafts.length === 0 ? (
              <div className={styles.emptyState}>
                <FileText size={24} />
                <p>Nenhum rascunho salvo</p>
              </div>
            ) : (
              <div className={styles.draftList}>
                {drafts.map(draft => (
                  <div 
                    key={draft.id} 
                    className={styles.draftItem}
                    onClick={() => loadDraft(draft)}
                  >
                    <div className={styles.draftInfo}>
                      <span className={styles.draftName}>{draft.name}</span>
                      <div className={styles.draftMeta}>
                        <Clock size={12} />
                        <span>{formatDate(draft.updatedAt)}</span>
                        <span className={styles.draftWords}>{draft.wordCount} palavras</span>
                      </div>
                    </div>
                    <button 
                      className={styles.deleteBtn}
                      onClick={(e) => deleteDraft(draft.id, e)}
                      title="Excluir"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Save Modal with Theme Name */}
      {showSaveModal && (
        <div className={styles.modalOverlay} onClick={() => setShowSaveModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>💾 Salvar Rascunho</h3>
              <button onClick={() => setShowSaveModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <label className={styles.inputLabel}>
                <Tag size={14} />
                <span>Tema</span>
              </label>
              <input
                type="text"
                placeholder="Nome do tema"
                value={draftName}
                onChange={e => setDraftName(e.target.value)}
                autoFocus
                className={styles.themeInput}
              />
              
              <label className={styles.inputLabel}>
                <FileText size={14} />
                <span>Descrição (opcional)</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Tentativa 2, Versão formal, etc."
                value={draftDescription}
                onChange={e => setDraftDescription(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveDraft()}
                className={styles.descriptionInput}
              />
              
              <div className={styles.previewName}>
                <span>Será salvo como:</span>
                <strong>
                  {draftName.trim() || scenarioTitle || 'Rascunho'}{draftDescription.trim() ? ` - ${draftDescription.trim()}` : ''}
                </strong>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button onClick={() => setShowSaveModal(false)} className={styles.cancelBtn}>
                Cancelar
              </button>
              <button onClick={saveDraft} className={styles.confirmBtn}>
                <Save size={16} /> Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
