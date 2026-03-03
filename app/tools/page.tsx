'use client';

import Link from 'next/link';
import { Calculator, Timer, Wrench, ArrowRight } from 'lucide-react';
import styles from '@/styles/Tools.module.scss';

const tools = [
  {
    title: 'CRS Score Calculator',
    desc: 'Calculate your Express Entry CRS points from CELPIP scores. Check eligibility for FSW, CEC, and citizenship.',
    icon: Calculator,
    path: '/tools/score-calculator',
    color: '#ff6b6b',
  },
  {
    title: 'Practice Timer',
    desc: 'Simulate real CELPIP exam timing. 16 presets for every section and task with audio alerts.',
    icon: Timer,
    path: '/tools/practice-timer',
    color: '#22c55e',
  },
];

export default function ToolsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.badge}>
          <Wrench size={14} />
          <span>Free Tools</span>
        </div>
        <h1>CELPIP Preparation Tools</h1>
        <p>Free interactive tools to help you prepare smarter</p>
      </div>

      <div className={styles.grid}>
        {tools.map((tool, i) => {
          const Icon = tool.icon;
          return (
            <Link key={i} href={tool.path} className={styles.card}>
              <div className={styles.cardIcon} style={{ background: `${tool.color}15`, color: tool.color }}>
                <Icon size={28} />
              </div>
              <h2>{tool.title}</h2>
              <p>{tool.desc}</p>
              <span className={styles.cardLink}>
                Open tool <ArrowRight size={14} />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
