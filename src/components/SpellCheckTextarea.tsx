'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from '@/styles/SpellCheck.module.scss';

interface SpellCheckTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  spellCheckEnabled: boolean;
  className?: string;
  minHeight?: string;
}

interface MisspelledWord {
  word: string;
  start: number;
  end: number;
  suggestions: string[];
}

export default function SpellCheckTextarea({
  value,
  onChange,
  placeholder,
  spellCheckEnabled,
  className,
  minHeight = '300px',
}: SpellCheckTextareaProps) {
  const [typo, setTypo] = useState<any>(null);
  const [misspelled, setMisspelled] = useState<MisspelledWord[]>([]);
  const [selectedWord, setSelectedWord] = useState<MisspelledWord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Load Typo.js dictionary
  useEffect(() => {
    if (!spellCheckEnabled || typo) return;

    const loadDictionary = async () => {
      setIsLoading(true);
      try {
        const TypoModule = (await import('typo-js')).default;
        
        const [affResponse, dicResponse] = await Promise.all([
          fetch('/dictionaries/en_US.aff'),
          fetch('/dictionaries/en_US.dic'),
        ]);

        const affData = await affResponse.text();
        const dicData = await dicResponse.text();

        const typoInstance = new TypoModule('en_US', affData, dicData);
        setTypo(typoInstance);
      } catch (error) {
        console.error('Failed to load spell check dictionary:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDictionary();
  }, [spellCheckEnabled, typo]);

  // Check spelling when text changes
  const checkSpelling = useCallback(() => {
    if (!typo || !spellCheckEnabled || !value) {
      setMisspelled([]);
      return;
    }

    const wordRegex = /[a-zA-Z']+/g;
    const words: MisspelledWord[] = [];
    let match;

    while ((match = wordRegex.exec(value)) !== null) {
      const word = match[0];
      if (word.length < 2) continue;
      
      const cleanWord = word.replace(/^'+|'+$/g, '');
      if (cleanWord.length < 2) continue;
      
      const isCapitalized = cleanWord[0] === cleanWord[0].toUpperCase() && cleanWord[0] !== cleanWord[0].toLowerCase();
      
      // Skip proper nouns: capitalized words NOT at sentence start
      if (isCapitalized) {
        const textBefore = value.slice(0, match.index);
        const trimmedBefore = textBefore.trimEnd();
        
        // It's a sentence start if:
        // - Beginning of text
        // - After . ! ? followed by space(s)
        // - After newline
        const isStartOfText = trimmedBefore.length === 0;
        const isAfterPunctuation = /[.!?]$/.test(trimmedBefore);
        const isAfterNewline = /\n\s*$/.test(textBefore);
        
        const isSentenceStart = isStartOfText || isAfterPunctuation || isAfterNewline;
        
        // If capitalized but NOT sentence start → proper noun, skip it
        if (!isSentenceStart) {
          continue;
        }
      }

      if (!typo.check(cleanWord) && !typo.check(cleanWord.toLowerCase())) {
        const suggestions = typo.suggest(cleanWord, 5);
        words.push({
          word: cleanWord,
          start: match.index + word.indexOf(cleanWord),
          end: match.index + word.indexOf(cleanWord) + cleanWord.length,
          suggestions,
        });
      }
    }

    setMisspelled(words);
    
    // Clear selection if the word was fixed
    if (selectedWord && !words.find(w => w.start === selectedWord.start)) {
      setSelectedWord(null);
    }
  }, [typo, spellCheckEnabled, value, selectedWord]);

  // Debounce spell checking
  useEffect(() => {
    const timer = setTimeout(checkSpelling, 300);
    return () => clearTimeout(timer);
  }, [checkSpelling]);

  // Sync scroll between textarea and overlay
  const handleScroll = () => {
    if (textareaRef.current && overlayRef.current) {
      overlayRef.current.scrollTop = textareaRef.current.scrollTop;
      overlayRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // Apply suggestion
  const applySuggestion = (suggestion: string) => {
    if (!selectedWord) return;
    
    const newValue = value.slice(0, selectedWord.start) + suggestion + value.slice(selectedWord.end);
    onChange(newValue);
    setSelectedWord(null);
    textareaRef.current?.focus();
  };

  // Render highlighted text with underlines
  const renderHighlightedText = () => {
    if (!spellCheckEnabled || misspelled.length === 0) {
      return <span>{value}</span>;
    }

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    misspelled.forEach((word, index) => {
      if (word.start > lastIndex) {
        parts.push(<span key={`text-${index}`}>{value.slice(lastIndex, word.start)}</span>);
      }
      
      parts.push(
        <span key={`word-${index}`} className={styles.underlinedWord}>
          {value.slice(word.start, word.end)}
        </span>
      );
      
      lastIndex = word.end;
    });

    if (lastIndex < value.length) {
      parts.push(<span key="text-end">{value.slice(lastIndex)}</span>);
    }

    return parts;
  };

  // Get unique misspelled words for the correction panel
  const uniqueMisspelled = misspelled.reduce((acc, word) => {
    const existing = acc.find(w => w.word.toLowerCase() === word.word.toLowerCase());
    if (!existing) {
      acc.push(word);
    }
    return acc;
  }, [] as MisspelledWord[]);

  return (
    <div className={`${styles.spellCheckContainer} ${className || ''}`}>
      <div className={styles.editorWrapper} style={{ minHeight }}>
        {/* Highlight overlay - shows underlines */}
        <div
          ref={overlayRef}
          className={styles.highlightOverlay}
          aria-hidden="true"
        >
          <div className={styles.highlightContent}>
            {renderHighlightedText()}
          </div>
        </div>

        {/* Actual textarea */}
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          placeholder={placeholder}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>

      {/* Loading indicator */}
      {isLoading && spellCheckEnabled && (
        <div className={styles.loadingIndicator}>
          Loading dictionary...
        </div>
      )}

      {/* Correction panel - mobile friendly buttons */}
      {spellCheckEnabled && uniqueMisspelled.length > 0 && (
        <div className={styles.correctionPanel}>
          <div className={styles.correctionHeader}>
            ⚠️ {uniqueMisspelled.length} word{uniqueMisspelled.length > 1 ? 's' : ''} to check
          </div>
          <div className={styles.correctionList}>
            {uniqueMisspelled.map((word, index) => (
              <div key={index} className={styles.correctionItem}>
                <span className={styles.wrongWord}>{word.word}</span>
                
                {word.suggestions.length > 0 ? (
                  <div className={styles.suggestionsRow}>
                    <span className={styles.arrow}>→</span>
                    {word.suggestions.slice(0, 3).map((suggestion, i) => (
                      <button
                        key={i}
                        className={styles.suggestionChip}
                        onClick={() => {
                          // Replace all occurrences
                          const regex = new RegExp(`\\b${word.word}\\b`, 'g');
                          const newValue = value.replace(regex, suggestion);
                          onChange(newValue);
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className={styles.noSuggestion}>no suggestions</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All clear */}
      {spellCheckEnabled && !isLoading && typo && misspelled.length === 0 && value.trim().length > 10 && (
        <div className={styles.allClear}>
          ✓ No spelling issues
        </div>
      )}
    </div>
  );
}
