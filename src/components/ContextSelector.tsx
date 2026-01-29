'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ChevronDown, FileText, Search, X } from 'lucide-react';
import styles from '@/styles/ContextSelector.module.scss';

export interface ContextItem {
  id: string;
  title: string;
  content: string;
  category: string;
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

// Debounce delay for hover events (ms)
const HOVER_DEBOUNCE_DELAY = 150;

// Custom hook for debounced value
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

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
  const [hoveredContextId, setHoveredContextId] = useState<string | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [tappedContextId, setTappedContextId] = useState<string | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced hovered context for smooth preview transitions
  const debouncedHoveredId = useDebouncedValue(hoveredContextId, HOVER_DEBOUNCE_DELAY);
  
  // Get the actual preview context based on debounced hover or tap
  const previewContext = useMemo(() => {
    const previewId = isTouch ? tappedContextId : debouncedHoveredId;
    if (!previewId) return null;
    const context = contexts.find(c => c.id === previewId);
    return context?.category !== 'custom' ? context : null;
  }, [isTouch, tappedContextId, debouncedHoveredId, contexts]);

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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHoveredContextId(null);
        setTappedContextId(null);
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

  // Reset hover states when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setHoveredContextId(null);
      setTappedContextId(null);
    }
  }, [isOpen]);

  const handleSelect = useCallback((context: ContextItem) => {
    onSelect(context);
    setIsOpen(false);
    setHoveredContextId(null);
    setTappedContextId(null);
    setSearchTerm('');
  }, [onSelect]);

  // Debounced hover handler with cleanup
  const handleMouseEnter = useCallback((contextId: string, isCustom: boolean) => {
    if (isTouch || isCustom) return;
    
    // Clear any pending timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    setHoveredContextId(contextId);
  }, [isTouch]);

  const handleMouseLeave = useCallback(() => {
    if (isTouch) return;
    
    // Clear any pending timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Debounce the leave to prevent flickering when moving between items
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredContextId(null);
    }, 100);
  }, [isTouch]);

  // Touch handler for mobile - tap to preview, tap again to select
  const handleTouchStart = useCallback((context: ContextItem, e: React.TouchEvent) => {
    if (!isTouch) return;
    
    e.preventDefault();
    
    if (context.category === 'custom') {
      // Custom contexts select immediately
      handleSelect(context);
      return;
    }
    
    if (tappedContextId === context.id) {
      // Second tap - select
      handleSelect(context);
    } else {
      // First tap - show preview
      setTappedContextId(context.id);
    }
  }, [isTouch, tappedContextId, handleSelect]);

  // Click handler - for non-touch or when preview is already shown
  const handleItemClick = useCallback((context: ContextItem) => {
    if (isTouch && context.category !== 'custom' && tappedContextId !== context.id) {
      // On touch, first tap shows preview
      setTappedContextId(context.id);
      return;
    }
    handleSelect(context);
  }, [isTouch, tappedContextId, handleSelect]);

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
                    const isHovered = !isTouch && hoveredContextId === item.id;
                    const isTapped = isTouch && tappedContextId === item.id;
                    const isActive = isHovered || isTapped;
                    
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
                        onMouseEnter={() => handleMouseEnter(item.id, item.category === 'custom')}
                        onMouseLeave={handleMouseLeave}
                        onTouchStart={(e) => handleTouchStart(item, e)}
                        aria-selected={selectedId === item.id}
                      >
                        <span className={styles.optionTitle}>{item.title}</span>
                        {item.category !== 'custom' && (
                          <span className={styles.optionPreviewHint}>
                            {isTouch ? (isTapped ? '✓' : '👁️') : '👁️'}
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

            {/* Preview Panel */}
            <div className={`${styles.previewPanel} ${previewContext ? styles.previewPanelVisible : ''}`}>
              {previewContext ? (
                <>
                  <div className={styles.previewHeader}>
                    <span className={styles.previewLabel}>Prévia do Enunciado</span>
                  </div>
                  <div className={styles.previewContent}>
                    <h4>{previewContext.title}</h4>
                    <p>{previewContext.content}</p>
                  </div>
                  <button
                    type="button"
                    className={styles.previewSelectBtn}
                    onClick={() => handleSelect(previewContext)}
                  >
                    {isTouch ? 'Toque novamente para usar' : 'Usar este tema'}
                  </button>
                </>
              ) : (
                <div className={styles.previewPlaceholder}>
                  <span>👆</span>
                  <p>{isTouch ? 'Toque em um tema para ver a prévia' : 'Passe o mouse sobre um tema para ver a prévia'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
