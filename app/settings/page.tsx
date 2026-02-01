'use client';

import { useState } from 'react';
import { Card, Button } from '@/components/Common';
import DetailedStats from '@/components/DetailedStats';
import GoalsManager from '@/components/GoalsManager';
import ErrorReview from '@/components/ErrorReview';
import { useTheme } from '@/components/ThemeProvider';
import styles from '@/styles/Pages.module.scss';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'stats' | 'goals' | 'errors' | 'preferences' | 'data'>('stats');
  const { theme, setTheme } = useTheme();

  const handleClearStats = () => {
    if (confirm("Isso apagará TODAS as suas estatísticas e histórico. Tem certeza?")) {
      localStorage.removeItem('celpip_user_stats');
      localStorage.removeItem('celpip_last_session');
      alert("Dados limpos com sucesso!");
      window.location.reload();
    }
  };

  return (
    <div className={styles.settingsContainer}>
      <h2 className={styles.settingsTitle}>Configurações</h2>

      {/* Tabs */}
      <div className={styles.settingsTabs}>
        <button 
          className={`${styles.settingsTab} ${activeTab === 'stats' ? styles.settingsTabActive : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 Estatísticas
        </button>
        <button 
          className={`${styles.settingsTab} ${activeTab === 'goals' ? styles.settingsTabActive : ''}`}
          onClick={() => setActiveTab('goals')}
        >
          🎯 Metas
        </button>
        <button 
          className={`${styles.settingsTab} ${activeTab === 'errors' ? styles.settingsTabActive : ''}`}
          onClick={() => setActiveTab('errors')}
        >
          ⚠️ Erros
        </button>
        <button 
          className={`${styles.settingsTab} ${activeTab === 'preferences' ? styles.settingsTabActive : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          ⚙️ Preferências
        </button>
        <button 
          className={`${styles.settingsTab} ${activeTab === 'data' ? styles.settingsTabActive : ''}`}
          onClick={() => setActiveTab('data')}
        >
          💾 Dados
        </button>
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <Card title="📊 Suas Estatísticas">
          <DetailedStats />
        </Card>
      )}

      {/* Goals Tab */}
      {activeTab === 'goals' && (
        <Card title="🎯 Minhas Metas">
          <GoalsManager mode="full" />
        </Card>
      )}

      {/* Errors Tab */}
      {activeTab === 'errors' && (
        <Card title="⚠️ Erros Frequentes">
          <ErrorReview mode="full" />
        </Card>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <>
          <Card title="🎨 Aparência">
            <div className={styles.settingsSection}>
              <div className={styles.settingsRow}>
                <div className={styles.settingsRowContent}>
                  <h4>Tema</h4>
                  <p>Escolha entre tema claro ou escuro.</p>
                </div>
                <div className={styles.themeSwitcher}>
                  <button 
                    className={`${styles.themeOption} ${theme === 'light' ? styles.themeOptionActive : ''}`}
                    onClick={() => setTheme('light')}
                  >
                    ☀️ Claro
                  </button>
                  <button 
                    className={`${styles.themeOption} ${theme === 'dark' ? styles.themeOptionActive : ''}`}
                    onClick={() => setTheme('dark')}
                  >
                    🌙 Escuro
                  </button>
                </div>
              </div>
            </div>
          </Card>

          <Card title="📚 Preferências de Aprendizado">
            <div className={styles.settingsSection}>
              <div className={styles.settingsRow}>
                <div className={styles.settingsRowContent}>
                  <h4>Idioma de Instrução</h4>
                  <p>Idioma da interface e dicas.</p>
                </div>
                <select className={styles.settingsSelect}>
                  <option>Português (Brasil)</option>
                  <option disabled>English (Coming Soon)</option>
                </select>
              </div>

              <div className={styles.settingsDivider}>
                <h4 className={styles.settingsSubtitle}>Transição PT → EN</h4>
                <p className={styles.settingsDescription}>Ajuste o quanto de inglês aparece nas instruções de planejamento.</p>
                <input type="range" className={styles.settingsSlider} min="0" max="100" defaultValue="30" />
                <div className={styles.settingsSliderLabels}>
                  <span>100% PT</span>
                  <span>Misto</span>
                  <span>100% EN</span>
                </div>
              </div>

              <div className={`${styles.settingsDivider} ${styles.settingsRow}`}>
                <div className={styles.settingsRowContent}>
                  <h4>Modo de Feedback</h4>
                  <p>Como seu texto é avaliado.</p>
                </div>
                <div className={styles.settingsModeButtons}>
                  <button className={`${styles.settingsModeButton} ${styles.settingsModeButtonActive}`}>Regras (Padrão)</button>
                  <button className={`${styles.settingsModeButton} ${styles.settingsModeButtonInactive}`}>IA (Em breve)</button>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Data Tab */}
      {activeTab === 'data' && (
        <Card title="Gerenciamento de Dados">
          <div className={styles.settingsDataSection}>
            <div className={styles.dataInfoBox}>
              <div className={styles.dataInfoIcon}>💾</div>
              <div className={styles.dataInfoContent}>
                <h4>Armazenamento Local</h4>
                <p>Seus rascunhos e estatísticas são salvos no armazenamento local do navegador. Os dados permanecem no seu dispositivo e não são enviados para nenhum servidor.</p>
              </div>
            </div>

            <div className={styles.dataActions}>
              <div className={styles.dataAction}>
                <div>
                  <h4>🗑️ Limpar Estatísticas</h4>
                  <p>Remove todo o histórico de práticas e pontuações.</p>
                </div>
                <Button variant="danger" onClick={handleClearStats}>
                  Limpar Tudo
                </Button>
              </div>

              <div className={styles.dataAction}>
                <div>
                  <h4>📤 Exportar Dados</h4>
                  <p>Baixe suas estatísticas em formato JSON.</p>
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
                    alert('Nenhum dado para exportar.');
                  }
                }}>
                  Exportar
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
