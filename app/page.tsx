'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Mail, PenTool, BarChart3, ArrowRight, Sparkles } from 'lucide-react';
import { Card, Button } from '@/components/Common';
import { SessionStats } from '@/types';
import styles from '@/styles/Pages.module.scss';

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = React.useState<SessionStats | null>(null);

  React.useEffect(() => {
    // Mock loading stats from local storage
    const saved = localStorage.getItem('celpip_last_session');
    if (saved) {
      setStats(JSON.parse(saved));
    }
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <span className={styles.heroEmoji}>🚀</span>
          <h1 className={styles.heroTitle}>
            Domine a <span>Escrita do CELPIP</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Pratique com feedback inteligente, melhore sua estrutura e conquiste a pontuação que você merece.
          </p>
        </div>
      </section>

      <div className={styles.dashboardHeader}>
        <h2>Escolha sua <span>Prática</span></h2>
        <p>Selecione uma tarefa abaixo para começar a treinar.</p>
      </div>

      <div className={styles.dashboardCards}>
        <div className={styles.taskCard}>
          <div className={`${styles.taskCardIcon} ${styles.taskCardIconBlue}`}>
            <Mail size={32} />
          </div>
          <h3 className={styles.taskCardTitle}>Task 1 — Email</h3>
          <p className={styles.taskCardDescription}>Pratique emails formais e semi-formais. 150-200 palavras. Foco em tom, estrutura e solicitações.</p>
          <Button onClick={() => router.push('/task-1')} className={styles.taskCardButton}>
            Praticar Task 1 <ArrowRight size={16} />
          </Button>
        </div>

        <div className={styles.taskCard}>
          <div className={`${styles.taskCardIcon} ${styles.taskCardIconPurple}`}>
            <PenTool size={32} />
          </div>
          <h3 className={styles.taskCardTitle}>Task 2 — Survey</h3>
          <p className={styles.taskCardDescription}>Responda a pesquisas de opinião. Estrutura PRE (Point-Reason-Example). Argumentação sólida.</p>
          <Button onClick={() => router.push('/task-2')} className={styles.taskCardButton}>
            Praticar Task 2 <ArrowRight size={16} />
          </Button>
        </div>
      </div>

      <div className={styles.sessionStatsContainer}>
        <Card title="📊 Sessão Atual">
          {stats ? (
            <div className={styles.sessionStatsContent}>
              <div className={styles.sessionStatsInfo}>
                <div className={styles.sessionStatsIcon}>
                  <BarChart3 size={20} />
                </div>
                <div>
                  <p className={styles.sessionStatsLabel}>Última prática</p>
                  <p className={styles.sessionStatsValue}>{stats.lastTask === 'TASK_1' ? 'Email Task' : 'Survey Task'}</p>
                </div>
              </div>

              <div className={styles.sessionStatsWords}>
                <p className={styles.sessionStatsWordsLabel}>Palavras</p>
                <p className={styles.sessionStatsWordsValue}>{stats.lastWordCount}</p>
              </div>

              <div className={styles.sessionStatsDate}>
                <p className={styles.sessionStatsDateValue}>{new Date(stats.date).toLocaleDateString()}</p>
                <span className={`${styles.sessionStatsBadge} ${
                  stats.lastWordCount >= 150 && stats.lastWordCount <= 200 ? styles.sessionStatsBadgeIdeal : styles.sessionStatsBadgeOutside
                }`}>
                  {stats.lastWordCount >= 150 && stats.lastWordCount <= 200 ? '✓ Faixa Ideal' : '⚠ Fora da faixa'}
                </span>
              </div>
            </div>
          ) : (
            <div className={styles.sessionStatsEmpty}>
              <p>✨ Nenhuma sessão registrada ainda.</p>
              <p>Complete um exercício para ver suas estatísticas aqui.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
