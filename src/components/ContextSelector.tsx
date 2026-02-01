'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ChevronDown, FileText, Search, X } from 'lucide-react';
import styles from '@/styles/ContextSelector.module.scss';

export interface ContextItem {
  id: string;
  title: string;
  content: string;
  category: string;
  recipient?: string;
  formality?: 'Formal' | 'Semi-formal';
  questions?: string[];
}

interface ContextSelectorProps {
  contexts: ContextItem[];
  selectedId: string | null;
  onSelect: (context: ContextItem) => void;
  placeholder?: string;
}

// Categorias com labels em português
const categoryLabels: Record<string, string> = {
  custom: '✨ Personalizado',
  complaint: '😤 Reclamações',
  request: '📝 Solicitações',
  thanks: '🙏 Agradecimentos',
  apology: '😔 Desculpas',
  information: 'ℹ️ Informações',
  suggestion: '💡 Sugestões',
  invitation: '💌 Convites',
  // Task 2 categories
  community: '🏘️ Comunidade',
  work: '💼 Trabalho',
  education: '📚 Educação',
  lifestyle: '🌟 Estilo de Vida',
  environment: '🌱 Meio Ambiente',
  technology: '💻 Tecnologia'
};

// Detect touch device
function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export default function ContextSelector({
  contexts,
  selectedId,
  onSelect,
  placeholder = 'Selecione um tema ou crie o seu próprio'
}: ContextSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  // Use clickedContextId for click-based preview (replaces hover-based preview)
  const [clickedContextId, setClickedContextId] = useState<string | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const previewPanelRef = useRef<HTMLDivElement>(null);

  // Get the actual preview context based on clicked item
  const previewContext = useMemo(() => {
    if (!clickedContextId) return null;
    const context = contexts.find(c => c.id === clickedContextId);
    return context?.category !== 'custom' ? context : null;
  }, [clickedContextId, contexts]);

  const selectedContext = contexts.find(c => c.id === selectedId);

  // Detect touch device on mount
  useEffect(() => {
    setIsTouch(isTouchDevice());
  }, []);

  // Group contexts by category - memoized to prevent re-computation
  const groupedContexts = useMemo(() => {
    return contexts.reduce((acc, ctx) => {
      if (!acc[ctx.category]) acc[ctx.category] = [];
      acc[ctx.category].push(ctx);
      return acc;
    }, {} as Record<string, ContextItem[]>);
  }, [contexts]);

  // Filter by search term - memoized
  const filteredGroups = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return Object.entries(groupedContexts).reduce((acc, [category, items]) => {
      const filtered = items.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.content.toLowerCase().includes(searchLower)
      );
      if (filtered.length > 0) acc[category] = filtered;
      return acc;
    }, {} as Record<string, ContextItem[]>);
  }, [groupedContexts, searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setClickedContextId(null);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current && !isTouch) {
      // Small delay to ensure the dropdown is rendered
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }
  }, [isOpen, isTouch]);

  // Reset clicked state when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setClickedContextId(null);
    }
  }, [isOpen]);

  // Scroll preview into view on mobile when it becomes visible
  useEffect(() => {
    if (previewContext && previewPanelRef.current && isTouch) {
      // Small delay to allow the transition to start
      const timer = setTimeout(() => {
        previewPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [previewContext, isTouch]);

  const handleSelect = useCallback((context: ContextItem) => {
    onSelect(context);
    setIsOpen(false);
    setClickedContextId(null);
    setSearchTerm('');
  }, [onSelect]);

  // Click handler - first click shows preview, second click selects
  const handleItemClick = useCallback((context: ContextItem) => {
    // Custom contexts select immediately (no preview needed)
    if (context.category === 'custom') {
      handleSelect(context);
      return;
    }
    
    // If already previewing this item, select it
    if (clickedContextId === context.id) {
      handleSelect(context);
    } else {
      // First click - show preview
      setClickedContextId(context.id);
    }
  }, [clickedContextId, handleSelect]);

  // Close preview handler
  const handleClosePreview = useCallback(() => {
    setClickedContextId(null);
  }, []);

  return (
    <div className={styles.contextSelector} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        className={`${styles.selectorTrigger} ${isOpen ? styles.selectorTriggerOpen : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className={styles.triggerIcon}>
          <FileText size={18} />
        </div>
        <span className={styles.triggerText}>
          {selectedContext ? selectedContext.title : placeholder}
        </span>
        <ChevronDown 
          size={18} 
          className={`${styles.triggerChevron} ${isOpen ? styles.triggerChevronOpen : ''}`} 
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className={styles.dropdownPanel}>
          {/* Search Input */}
          <div className={styles.searchContainer}>
            <Search size={16} className={styles.searchIcon} />
            <input
              ref={searchInputRef}
              type="text"
              className={styles.searchInput}
              placeholder="Buscar tema..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className={styles.searchClear}
                onClick={() => setSearchTerm('')}
                type="button"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className={styles.dropdownBody}>
            {/* Options List */}
            <div className={styles.optionsList}>
              {Object.entries(filteredGroups).map(([category, items]) => (
                <div key={category} className={styles.categoryGroup}>
                  <div className={styles.categoryHeader}>
                    {categoryLabels[category] || category}
                  </div>
                  {items.map((item) => {
                    const isActive = clickedContextId === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`${styles.optionItem} ${
                          selectedId === item.id ? styles.optionItemSelected : ''
                        } ${item.category === 'custom' ? styles.optionItemCustom : ''} ${
                          isActive ? styles.optionItemActive : ''
                        }`}
                        onClick={() => handleItemClick(item)}
                        aria-selected={selectedId === item.id}
                      >
                        <span className={styles.optionTitle}>{item.title}</span>
                        {item.category !== 'custom' && (
                          <span className={styles.optionPreviewHint}>
                            {isActive ? '✓' : '👁️'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}

              {Object.keys(filteredGroups).length === 0 && (
                <div className={styles.noResults}>
                  <span>🔍</span>
                  <p>Nenhum tema encontrado</p>
                </div>
              )}
            </div>

            {/* Preview Panel - key forces remount when theme changes for proper layout calculation */}
            <div 
              ref={previewPanelRef}
              key={previewContext?.id ?? 'no-preview'}
              className={`${styles.previewPanel} ${previewContext ? styles.previewPanelVisible : ''}`}
            >
              {previewContext ? (
                <div className={styles.previewInner}>
                  <div className={styles.previewHeader}>
                    <span className={styles.previewLabel}>Prévia do Enunciado</span>
                    <button
                      type="button"
                      className={styles.previewCloseBtn}
                      onClick={handleClosePreview}
                      aria-label="Fechar prévia"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className={styles.previewContent}>
                    <h4>{previewContext.title}</h4>
                    <p>{previewContext.content}</p>
                  </div>
                  <div className={styles.previewFooter}>
                    <button
                      type="button"
                      className={styles.previewSelectBtn}
                      onClick={() => handleSelect(previewContext)}
                    >
                      Usar este tema
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.previewPlaceholder}>
                  <span>👆</span>
                  <p>Clique em um tema para ver a prévia</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
