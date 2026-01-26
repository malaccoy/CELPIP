'use client';

import { Card, Button } from '@/components/Common';
import styles from '@/styles/Pages.module.scss';

export default function SettingsPage() {
  return (
    <div className={styles.settingsContainer}>
      <h2 className={styles.settingsTitle}>Configurações</h2>

      <Card title="Preferências de Aprendizado">
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
            <h4 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#0f172a', marginBottom: '0.5rem' }}>Transição PT → EN</h4>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>Ajuste o quanto de inglês aparece nas instruções de planejamento.</p>
            <input type="range" className={styles.settingsSlider} min="0" max="100" />
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

      <Card title="Dados">
        <div className={styles.settingsDataSection}>
          <p className={styles.settingsDataDescription}>Seus rascunhos são salvos no armazenamento local do navegador.</p>
          <Button variant="danger" onClick={() => {
            if (confirm("Isso apagará seu histórico de estatísticas. Confirmar?")) {
              localStorage.removeItem('celpip_last_session');
              alert("Dados limpos.");
            }
          }}>
            Limpar Estatísticas Locais
          </Button>
        </div>
      </Card>
    </div>
  );
}
