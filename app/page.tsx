'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, Zap, Target, Trophy, ChevronDown } from 'lucide-react';
import styles from '@/styles/Home.module.scss';

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={styles.homePage}>
      {/* Cursor follower */}
      <div 
        className={styles.cursorGlow}
        style={{ 
          left: mousePos.x, 
          top: mousePos.y,
          opacity: mounted ? 1 : 0 
        }}
      />

      {/* Floating elements */}
      <div className={styles.floatingElements}>
        <div className={styles.floatCircle1} />
        <div className={styles.floatCircle2} />
        <div className={styles.floatCircle3} />
        <div className={styles.gridLines} />
      </div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>
            <Sparkles size={14} />
            <span>Treinamento Inteligente</span>
          </div>
          
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleLine1}>Domine a</span>
            <span className={styles.heroTitleLine2}>Escrita do</span>
            <span className={styles.heroTitleAccent}>CELPIP</span>
          </h1>
          
          <p className={styles.heroSubtitle}>
            Pratique com feedback em tempo real, templates profissionais 
            e simulados cronometrados. Sua aprovação começa aqui.
          </p>

          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>43+</span>
              <span className={styles.heroStatLabel}>Prompts Task 1</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>32+</span>
              <span className={styles.heroStatLabel}>Prompts Task 2</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>∞</span>
              <span className={styles.heroStatLabel}>Práticas</span>
            </div>
          </div>

          <div className={styles.heroCTA}>
            <button 
              className={styles.ctaPrimary}
              onClick={() => router.push('/task-1')}
            >
              Começar Agora
              <ArrowRight size={18} />
            </button>
            <button 
              className={styles.ctaSecondary}
              onClick={() => router.push('/guide')}
            >
              Ver Guia Completo
            </button>
          </div>
        </div>

        <div className={styles.scrollIndicator}>
          <span>Explorar</span>
          <ChevronDown size={20} />
        </div>
      </section>

      {/* Tasks Section */}
      <section className={styles.tasksSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Escolha sua prática</span>
          <h2 className={styles.sectionTitle}>Duas Tasks,<br />Um Objetivo</h2>
        </div>

        <div className={styles.tasksGrid}>
          {/* Task 1 Card */}
          <article 
            className={styles.taskCard}
            onClick={() => router.push('/task-1')}
          >
            <div className={styles.taskCardNumber}>01</div>
            <div className={styles.taskCardContent}>
              <div className={styles.taskCardIcon}>✉️</div>
              <h3 className={styles.taskCardTitle}>Email Writing</h3>
              <p className={styles.taskCardDesc}>
                Emails formais e semi-formais. Reclamações, pedidos, 
                agradecimentos. 150-200 palavras em 27 minutos.
              </p>
              <ul className={styles.taskCardFeatures}>
                <li><Zap size={14} /> Feedback instantâneo</li>
                <li><Target size={14} /> Contador de palavras</li>
                <li><Trophy size={14} /> Modo exame</li>
              </ul>
            </div>
            <div className={styles.taskCardArrow}>
              <ArrowRight size={24} />
            </div>
            <div className={styles.taskCardGlow} />
          </article>

          {/* Task 2 Card */}
          <article 
            className={styles.taskCard}
            onClick={() => router.push('/task-2')}
          >
            <div className={styles.taskCardNumber}>02</div>
            <div className={styles.taskCardContent}>
              <div className={styles.taskCardIcon}>📋</div>
              <h3 className={styles.taskCardTitle}>Survey Response</h3>
              <p className={styles.taskCardDesc}>
                Pesquisas de opinião. Argumentação PRE: Point, Reason, 
                Example. 150-200 palavras em 26 minutos.
              </p>
              <ul className={styles.taskCardFeatures}>
                <li><Zap size={14} /> Templates PRE</li>
                <li><Target size={14} /> Estrutura guiada</li>
                <li><Trophy size={14} /> Simulado real</li>
              </ul>
            </div>
            <div className={styles.taskCardArrow}>
              <ArrowRight size={24} />
            </div>
            <div className={styles.taskCardGlow} />
          </article>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h4>Feedback Inteligente</h4>
            <p>Análise automática de estrutura, tom e gramática</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⏱️</div>
            <h4>Timer Real</h4>
            <p>Simule as condições exatas do exame</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <h4>Progresso</h4>
            <p>Acompanhe sua evolução ao longo do tempo</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>💾</div>
            <h4>Rascunhos</h4>
            <p>Salve e retome suas práticas a qualquer momento</p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={styles.bottomCTA}>
        <div className={styles.bottomCTAContent}>
          <h3>Pronto para começar?</h3>
          <p>Sua jornada para dominar o CELPIP Writing começa com um clique.</p>
          <button 
            className={styles.ctaPrimary}
            onClick={() => router.push('/task-1')}
          >
            Iniciar Prática Gratuita
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
