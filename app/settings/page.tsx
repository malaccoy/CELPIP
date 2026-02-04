'use client';

import { useState } from 'react';
import { Card, Button } from '@/components/Common';
import DetailedStats from '@/components/DetailedStats';
import GoalsManager from '@/components/GoalsManager';
import ErrorReview from '@/components/ErrorReview';
import Achievements from '@/components/Achievements';
import { useTheme } from '@/components/ThemeProvider';
import styles from '@/styles/Pages.module.scss';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'stats' | 'achievements' | 'goals' | 'errors' | 'preferences' | 'data'>('stats');
  const { theme, setTheme } = useTheme();

  const handleClearStats = () => {
    if (confirm("This will delete ALL your statistics and history. Are you sure?")) {
      localStorage.removeItem('celpip_user_stats');
      localStorage.removeItem('celpip_last_session');
      alert("Data cleared successfully!");
      window.location.reload();
    }
  };

  return (
    <div className={styles.settingsContainer}>
      <h2 className={styles.settingsTitle}>Settings</h2>

      {/* Tabs */}
      <div className={styles.settingsTabs}>
        <button 
          className={`${styles.settingsTab} ${activeTab === 'stats' ? styles.settingsTabActive : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 Statistics
        </button>
        <button 
          className={`${styles.settingsTab} ${activeTab === 'achievements' ? styles.settingsTabActive : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          🏆 Achievements
        </button>
        <button 
          className={`${styles.settingsTab} ${activeTab === 'goals' ? styles.settingsTabActive : ''}`}
          onClick={() => setActiveTab('goals')}
        >
          🎯 Goals
        </button>
        <button 
          className={`${styles.settingsTab} ${activeTab === 'errors' ? styles.settingsTabActive : ''}`}
          onClick={() => setActiveTab('errors')}
        >
          ⚠️ Errors
        </button>
        <button 
          className={`${styles.settingsTab} ${activeTab === 'preferences' ? styles.settingsTabActive : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          ⚙️ Preferences
        </button>
        <button 
          className={`${styles.settingsTab} ${activeTab === 'data' ? styles.settingsTabActive : ''}`}
          onClick={() => setActiveTab('data')}
        >
          💾 Data
        </button>
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <Card title="📊 Your Statistics">
          <DetailedStats />
        </Card>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <Card title="🏆 Achievements">
          <Achievements mode="full" />
        </Card>
      )}

      {/* Goals Tab */}
      {activeTab === 'goals' && (
        <Card title="🎯 My Goals">
          <GoalsManager mode="full" />
        </Card>
      )}

      {/* Errors Tab */}
      {activeTab === 'errors' && (
        <Card title="⚠️ Common Errors">
          <ErrorReview mode="full" />
        </Card>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <>
          <Card title="🎨 Appearance">
            <div className={styles.settingsSection}>
              <div className={styles.settingsRow}>
                <div className={styles.settingsRowContent}>
                  <h4>Theme</h4>
                  <p>Choose between light or dark theme.</p>
                </div>
                <div className={styles.themeSwitcher}>
                  <button 
                    className={`${styles.themeOption} ${theme === 'light' ? styles.themeOptionActive : ''}`}
                    onClick={() => setTheme('light')}
                  >
                    ☀️ Light
                  </button>
                  <button 
                    className={`${styles.themeOption} ${theme === 'dark' ? styles.themeOptionActive : ''}`}
                    onClick={() => setTheme('dark')}
                  >
                    🌙 Dark
                  </button>
                </div>
              </div>
            </div>
          </Card>

          <Card title="📚 Learning Preferences">
            <div className={styles.settingsSection}>
              <div className={styles.settingsRow}>
                <div className={styles.settingsRowContent}>
                  <h4>Interface Language</h4>
                  <p>Language for interface and tips.</p>
                </div>
                <select className={styles.settingsSelect}>
                  <option>English</option>
                </select>
              </div>

              <div className={`${styles.settingsDivider} ${styles.settingsRow}`}>
                <div className={styles.settingsRowContent}>
                  <h4>Feedback Mode</h4>
                  <p>How your text is evaluated.</p>
                </div>
                <div className={styles.settingsModeButtons}>
                  <button className={`${styles.settingsModeButton} ${styles.settingsModeButtonActive}`}>Rules (Default)</button>
                  <button className={`${styles.settingsModeButton} ${styles.settingsModeButtonInactive}`}>AI (Coming Soon)</button>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Data Tab */}
      {activeTab === 'data' && (
        <Card title="Data Management">
          <div className={styles.settingsDataSection}>
            <div className={styles.dataInfoBox}>
              <div className={styles.dataInfoIcon}>💾</div>
              <div className={styles.dataInfoContent}>
                <h4>Local Storage</h4>
                <p>Your drafts and statistics are saved in your browser's local storage. Data stays on your device and is not sent to any server.</p>
              </div>
            </div>

            <div className={styles.dataActions}>
              <div className={styles.dataAction}>
                <div>
                  <h4>🗑️ Clear Statistics</h4>
                  <p>Remove all practice history and scores.</p>
                </div>
                <Button variant="danger" onClick={handleClearStats}>
                  Clear All
                </Button>
              </div>

              <div className={styles.dataAction}>
                <div>
                  <h4>📤 Export Data</h4>
                  <p>Download your statistics in JSON format.</p>
                </div>
                <Button variant="secondary" onClick={() => {
                  const stats = localStorage.getItem('celpip_user_stats');
                  if (stats) {
                    const blob = new Blob([stats], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'celpip_stats_backup.json';
                    a.click();
                    URL.revokeObjectURL(url);
                  } else {
                    alert('No data to export.');
                  }
                }}>
                  Export
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
