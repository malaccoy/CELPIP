'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';

interface VoiceDictationProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export default function VoiceDictation({ onTranscript, disabled, style }: VoiceDictationProps) {
  const [isListening, setIsListening] = useState(false);
  const [interim, setInterim] = useState('');
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setSupported(false); return; }
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let final = '';
      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) { final += t; }
        else { interimText += t; }
      }
      if (final) onTranscript(final);
      setInterim(interimText);
    };

    recognition.onerror = (e: any) => {
      if (e.error !== 'aborted') setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
      setInterim('');
    };

    recognitionRef.current = recognition;
    return () => { try { recognition.stop(); } catch {} };
  }, [onTranscript]);

  const toggle = useCallback(() => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try { recognitionRef.current.start(); setIsListening(true); }
      catch { setIsListening(false); }
    }
  }, [isListening]);

  if (!supported) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...style }}>
      <button
        onClick={toggle}
        disabled={disabled}
        aria-label={isListening ? 'Stop dictation' : 'Start dictation'}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 16px', borderRadius: 12, border: 'none', cursor: 'pointer',
          fontWeight: 700, fontSize: '0.85rem', transition: 'all 0.2s',
          background: isListening ? '#ff3b3b' : 'rgba(255,59,59,0.12)',
          color: isListening ? '#fff' : '#ff3b3b',
          animation: isListening ? 'dictPulse 1.5s ease-in-out infinite' : 'none',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" y1="19" x2="12" y2="23"/>
          <line x1="8" y1="23" x2="16" y2="23"/>
        </svg>
        {isListening ? 'Listening...' : 'Dictate'}
      </button>

      {isListening && interim && (
        <span style={{
          fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic',
          maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {interim}
        </span>
      )}

      <style>{`
        @keyframes dictPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(255,59,59,0.4); }
          50% { box-shadow: 0 0 0 10px rgba(255,59,59,0); }
        }
      `}</style>
    </div>
  );
}
