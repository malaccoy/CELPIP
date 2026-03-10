'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ChevronDown, FileText, Search, X, Lock } from 'lucide-react';
import { UpgradeModal, UpgradeInlineBanner } from '@/components/UpgradeBanner';
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
  /** Max free items (0-based). Items beyond this are locked for non-pro users. -1 = no limit */
  freeLimit?: number;
  /** Whether user has pro access */
  isPro?: boolean;
}

// Categories with English labels
const categoryLabels: Record<string, string> = {
  custom: '✨ PERSONALIZED',
  complaint: '😤 COMPLAINTS',
  request: '📝 REQUESTS',
  thanks: '🙏 THANKS',
  apology: '😔 APOLOGIES',
  information: 'ℹ️ INFORMATION',
  suggestion: '💡 SUGGESTIONS',
  invitation: '💌 INVITATIONS',
  // Task 2 categories
  community: '🏘️ COMMUNITY',
  work: '💼 WORK',
  education: '📚 EDUCATION',
  lifestyle: '🌟 LIFESTYLE',
  environment: '🌱 ENVIRONMENT',
  technology: '💻 TECHNOLOGY'
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
  placeholder = 'Select a theme or create your own',
  freeLimit = -1,
  isPro = true,
}: ContextSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [clickedContextId, setClickedContextId] = useState<string | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
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

  // Build a set of locked item IDs (non-custom items beyond freeLimit)
  const lockedIds = useMemo(() => {
    if (isPro || freeLimit < 0) return new Set<string>();
    const locked = new Set<string>();
    let freeCount = 0;
    for (const ctx of contexts) {
      if (ctx.category === 'custom') continue;
      if (freeCount >= freeLimit) {
        locked.add(ctx.id);
      } else {
        freeCount++;
      }
    }
    return locked;
  }, [contexts, freeLimit, isPro]);

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
              placeholder="Search theme..."
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
                    const isLocked = lockedIds.has(item.id);
                    
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`${styles.optionItem} ${
                          selectedId === item.id ? styles.optionItemSelected : ''
                        } ${item.category === 'custom' ? styles.optionItemCustom : ''} ${
                          isActive ? styles.optionItemActive : ''
                        } ${isLocked ? styles.optionItemLocked : ''}`}
                        onClick={() => isLocked ? setShowUpgradeModal(true) : handleItemClick(item)}
                        aria-selected={selectedId === item.id}
                        disabled={isLocked}
                      >
                        <span className={styles.optionTitle}>
                          {isLocked && <Lock size={13} className={styles.lockIcon} />}
                          {item.title}
                        </span>
                        {isLocked ? (
                          <span className={styles.proBadge}>PRO</span>
                        ) : item.category !== 'custom' ? (
                          <span className={styles.optionPreviewHint}>
                            {isActive ? '✓' : '👁️'}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              ))}

              {Object.keys(filteredGroups).length === 0 && (
                <div className={styles.noResults}>
                  <span>🔍</span>
                  <p>No themes found</p>
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
                    <span className={styles.previewLabel}>Prompt Preview</span>
                    <button
                      type="button"
                      className={styles.previewCloseBtn}
                      onClick={handleClosePreview}
                      aria-label="Close preview"
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
                      Use this theme
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.previewPlaceholder}>
                  <span>👆</span>
                  <p>Click on a theme to preview</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Inline Banner - shows below selector when there are locked items */}
      {lockedIds.size > 0 && (
        <UpgradeInlineBanner
          totalItems={contexts.filter(c => c.category !== 'custom').length}
          freeItems={contexts.filter(c => c.category !== 'custom').length - lockedIds.size}
          context="prompts"
        />
      )}

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        context="Writing Prompts"
      />
    </div>
  );
}
