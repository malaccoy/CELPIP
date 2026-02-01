'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load saved theme
    const saved = localStorage.getItem('celpip_theme') as Theme | null;
    if (saved) {
      setThemeState(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        setThemeState('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('celpip_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Prevent flash of wrong theme
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Return safe defaults during SSR or when outside provider
    return {
      theme: 'light' as Theme,
      toggleTheme: () => {},
      setTheme: () => {},
    };
  }
  return context;
}

// Theme toggle button component
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button 
      onClick={toggleTheme}
      className={className}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Tema ${theme === 'light' ? 'Escuro' : 'Claro'}`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}

export default ThemeProvider;
