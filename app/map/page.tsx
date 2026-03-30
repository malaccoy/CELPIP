'use client';

import { useState, useEffect, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { BookOpen, Headphones, Mic, PenTool, Lock, Check, Star, Trophy } from 'lucide-react';
import MobileTopBar from '@/components/MobileTopBar';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

/* ─── Sandy Mascot (inline next to skill banner) ─── */
function SandyMascot() {
  const [data, setData] = useState<object | null>(null);
  useEffect(() => {
    fetch('/lottie/sandy-timer.json').then(r => r.json()).then(setData).catch(() => {});
  }, []);
  if (!data) return null;
  return (
    <div style={{ width: 78, height: 78 }}>
      <Lottie animationData={data} loop style={{ width: 78, height: 78 }} />
    </div>
  );
}

/* ─── Types ─── */
type NodeState = 'completed' | 'active' | 'locked';

interface TaskNode {
  id: string;
  label: string;
  state: NodeState;
  xp?: number; // practice count for this task
}

interface SkillSection {
  skill: string;
  icon: typeof BookOpen;
  lottie?: string;
  sideDecor?: string;
  color: string;
  gradient: string;
  tasks: TaskNode[];
}

/* ─── Full Map Data (all skills in sequence) ─── */
function getFullMap(): SkillSection[] {
  return [
    {
      skill: 'Reading', icon: BookOpen, lottie: '/lottie/reading.json', color: '#22c55e', gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
      tasks: [
        { id: 'r1', label: 'Task 1', state: 'completed', xp: 45 },
        { id: 'r2', label: 'Task 2', state: 'completed', xp: 18 },
        { id: 'r3', label: 'Task 3', state: 'completed', xp: 18 },
        { id: 'r4', label: 'Task 4', state: 'completed', xp: 5 },
      ],
    },
    {
      skill: 'Listening', icon: Headphones, lottie: '/lottie/listening-boy.json', color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      tasks: [
        { id: 'l1', label: 'Task 1', state: 'completed', xp: 5 },
        { id: 'l2', label: 'Task 2', state: 'completed', xp: 5 },
        { id: 'l3', label: 'Task 3', state: 'completed', xp: 5 },
        { id: 'l4', label: 'Task 4', state: 'completed', xp: 5 },
        { id: 'l5', label: 'Task 5', state: 'completed', xp: 5 },
        { id: 'l6', label: 'Task 6', state: 'completed', xp: 5 },
      ],
    },
    {
      skill: 'Writing', icon: PenTool, lottie: '/lottie/developer.json', color: '#a855f7', gradient: 'linear-gradient(135deg, #a855f7, #9333ea)',
      tasks: [
        { id: 'w1', label: 'Task 1', state: 'completed', xp: 5 },
        { id: 'w2', label: 'Task 2', state: 'completed', xp: 5 },
      ],
    },
    {
      skill: 'Speaking', icon: Mic, lottie: '/lottie/speaking-man.json', color: '#f97316', gradient: 'linear-gradient(135deg, #f97316, #ea580c)',
      tasks: [
        { id: 's1', label: 'Task 1', state: 'completed', xp: 5 },
        { id: 's2', label: 'Task 2', state: 'completed', xp: 5 },
        { id: 's3', label: 'Task 3', state: 'completed', xp: 5 },
        { id: 's4', label: 'Task 4', state: 'completed', xp: 5 },
        { id: 's5', label: 'Task 5', state: 'completed', xp: 5 },
        { id: 's6', label: 'Task 6', state: 'completed', xp: 5 },
        { id: 's7', label: 'Task 7', state: 'completed', xp: 5 },
        { id: 's8', label: 'Task 8', state: 'completed', xp: 5 },
      ],
    },
  ];
}

/* ─── Zigzag offsets ─── */
const OFFSETS = [0, 50, 70, 50, 0, -50, -70, -50];

/* ─── Skill Separator ─── */
function SkillBanner({ section }: { section: SkillSection }) {
  const Icon = section.icon;
  const completedCount = section.tasks.filter(t => t.state === 'completed').length;
  const pct = Math.round((completedCount / section.tasks.length) * 100);
  const [lottieData, setLottieData] = useState<object | null>(null);
  const [sideDecorData, setSideDecorData] = useState<object | null>(null);
  useEffect(() => {
    if (section.lottie) fetch(section.lottie).then(r => r.json()).then(setLottieData).catch(() => {});
    if (section.sideDecor) fetch(section.sideDecor).then(r => r.json()).then(setSideDecorData).catch(() => {});
  }, [section.lottie, section.sideDecor]);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 8, padding: '4px 0 8px', position: 'relative',
    }}>
      {/* Side decoration (e.g. cat fishing) — right corner */}
      {sideDecorData && (
        <div style={{ position: 'absolute', right: -16, top: -10, width: 88, height: 88, opacity: 0.9 }}>
          <Lottie animationData={sideDecorData} loop style={{ width: 88, height: 88 }} />
        </div>
      )}
      {/* Icon — Lottie (pure, no bg) or fallback circle */}
      {lottieData ? (
        <div style={{ width: 110, height: 110 }}>
          <Lottie animationData={lottieData} loop style={{ width: 110, height: 110 }} />
        </div>
      ) : (
        <div style={{
          width: 56, height: 56,
          borderRadius: '50%',
          background: section.gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 4px 20px ${section.color}40`,
        }}>
          <Icon size={26} color="#fff" />
        </div>
      )}

      {/* Skill name */}
      <div style={{
        fontSize: 18, fontWeight: 900, letterSpacing: 1.5,
        color: section.color, textTransform: 'uppercase',
      }}>
        {section.skill}
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 80, height: 5, borderRadius: 3,
          background: 'rgba(255,255,255,0.08)', overflow: 'hidden',
        }}>
          <div style={{
            width: `${pct}%`, height: '100%', borderRadius: 3,
            background: section.color, transition: 'width 0.5s ease',
          }} />
        </div>
        <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>
          {completedCount}/{section.tasks.length}
        </span>
      </div>

      {/* Divider lines */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, width: '100%', maxWidth: 200,
      }}>
        <div style={{ flex: 1, height: 1, background: `${section.color}30` }} />
        <Star size={10} color={section.color} fill={section.color} />
        <div style={{ flex: 1, height: 1, background: `${section.color}30` }} />
      </div>
    </div>
  );
}

/* ─── Inline Lottie helper ─── */
function InlineLottie({ src, size }: { src: string; size: number }) {
  const [data, setData] = useState<object | null>(null);
  useEffect(() => { fetch(src).then(r => r.json()).then(setData).catch(() => {}); }, [src]);
  if (!data) return null;
  return <Lottie animationData={data} loop autoplay style={{ width: size, height: size }} />;
}

/* ─── Level System ─── */
const LEVELS = [
  { name: 'Beginner', minXp: 0, maxXp: 10, color: '#6b7280' },    // gray
  { name: 'Learner', minXp: 10, maxXp: 30, color: '#3b82f6' },     // blue
  { name: 'Skilled', minXp: 30, maxXp: 60, color: '#22c55e' },      // green
  { name: 'Expert', minXp: 60, maxXp: 100, color: '#f59e0b' },      // gold
  { name: 'Master', minXp: 100, maxXp: Infinity, color: '#a855f7' }, // purple
];
function getLevel(xp: number) {
  const level = [...LEVELS].reverse().find(l => xp >= l.minXp) || LEVELS[0];
  const next = LEVELS[LEVELS.indexOf(level) + 1];
  const pct = next ? Math.min(100, ((xp - level.minXp) / (next.minXp - level.minXp)) * 100) : 100;
  return { ...level, pct };
}

/* ─── Node Component — Duolingo 3D style ─── */
function TaskCircle({ node, color, skill }: { node: TaskNode; color: string; skill: string }) {
  const isCompleted = node.state === 'completed';
  const isActive = node.state === 'active';
  const isLocked = node.state === 'locked';

  const size = 86;
  const depth = 11; // thick bottom edge like Duolingo

  const darken = (hex: string, amt: number) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, (num >> 16) - amt);
    const g = Math.max(0, ((num >> 8) & 0x00FF) - amt);
    const b = Math.max(0, (num & 0x0000FF) - amt);
    return `rgb(${r},${g},${b})`;
  };

  const faceColor = isLocked ? '#4a4a5e' : color;
  const edgeColor = isLocked ? '#2e2e3e' : darken(color, 70);
  const iconColor = isLocked ? '#666' : '#fff';

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      opacity: isLocked ? 0.45 : 1,
    }}>
      {/* Button wrapper */}
      <div style={{
        position: 'relative',
        width: size, height: size + depth,
        cursor: isLocked ? 'default' : 'pointer',
      }}
      onClick={() => {
        if (isLocked) return;
        const taskNum = node.id.replace(/[a-z]/g, '');
        const skillKey = skill.toLowerCase();
        window.location.href = `/map/${skillKey}/${taskNum}`;
      }}
      >
        {/* Pulse ring for active */}
        {isActive && (
          <div style={{
            position: 'absolute',
            top: -8, left: -8,
            width: size + 16, height: size + 16,
            borderRadius: '50%',
            border: `3px solid ${color}`,
            animation: 'mapPulse 2s infinite',
          }} />
        )}

        {/* Bottom cylinder edge — the thick 3D base */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0,
          width: size, height: size,
          borderRadius: '50%',
          background: edgeColor,
        }} />

        {/* Top face — main circle */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0,
          width: size, height: size,
          borderRadius: '50%',
          background: faceColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {isCompleted ? (
            <Check size={32} color={iconColor} strokeWidth={3} />
          ) : isLocked ? (
            <Lock size={26} color={iconColor} />
          ) : (
            <Star size={32} color={iconColor} fill="rgba(255,255,255,0.3)" />
          )}
        </div>
      </div>

      {/* Level progress */}
      {node.xp !== undefined && node.xp > 0 && (() => {
        const lvl = getLevel(node.xp);
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: size + 10 }}>
            {/* Mini progress bar */}
            <div style={{ width: '100%', height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
              <div style={{ width: `${lvl.pct}%`, height: '100%', borderRadius: 3, background: lvl.color, transition: 'width 0.5s ease' }} />
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, color: lvl.color, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {lvl.name} · {node.xp}
            </span>
          </div>
        );
      })()}

      {/* Label */}
      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
        color: isLocked ? '#555' : '#cbd5e1',
      }}>
        {node.label}
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function MapPage() {
  const router = useRouter();
  const sections = getFullMap();

  // Remove layout padding — same approach as MobileDashboard
  useLayoutEffect(() => {
    const mainContainer = document.querySelector('[class*="container"]') as HTMLElement;
    const mainContent = document.querySelector('main') as HTMLElement;
    if (mainContainer) { mainContainer.style.padding = '0'; mainContainer.style.margin = '0'; }
    if (mainContent) { mainContent.style.padding = '0'; mainContent.style.margin = '0'; mainContent.style.maxWidth = '100%'; }
    return () => {
      if (mainContainer) { mainContainer.style.padding = ''; mainContainer.style.margin = ''; }
      if (mainContent) { mainContent.style.padding = ''; mainContent.style.margin = ''; mainContent.style.maxWidth = ''; }
    };
  }, []);

    // Scroll to active node on mount
  useEffect(() => {
    setTimeout(() => {
      const el = document.getElementById('active-node');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }, []);

  // Global index for zigzag continuity across sections
  let globalIdx = 0;

  return (
    <div id="map-page" style={{
      minHeight: '100vh',
      color: '#fff',
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      {/* Top Bar */}
      <MobileTopBar />

      {/* Map — continuous scroll */}
      <div style={{
        maxWidth: 480, margin: '0 auto',
        padding: '0px 20px 120px',
      }}>
        {sections.map((section, idx) => (
          <div key={section.skill} id={`section-${section.skill}`}>
            {/* Skill separator banner */}
            <SkillBanner section={section} />

            {/* Task nodes — zigzag */}
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 28,
              padding: '16px 0',
            }}>
              {section.tasks.map((task) => {
                const offset = OFFSETS[globalIdx % OFFSETS.length];
                const isActive = task.state === 'active';
                globalIdx++;
                return (
                  <div
                    key={task.id}
                    id={isActive ? 'active-node' : undefined}
                    style={{
                      transform: `translateX(${offset}px)`,
                      transition: 'transform 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    {task.id === 'r3' && (
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        transform: `translateY(-50%) translateX(calc(-50vw + 44px - ${offset}px))`,
                      }}>
                        <InlineLottie src="/lottie/sandy-timer.json" size={80} />
                      </div>
                    )}
                    {task.id === 'l3' && (
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        right: 0,
                        transform: `translateY(-50%) translateX(calc(50vw - 44px - ${offset}px))`,
                      }}>
                        <InlineLottie src="/lottie/cat-fishing.json" size={87} />
                      </div>
                    )}
                    {task.id === 'l6' && (
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        transform: `translateY(-50%) translateX(calc(-50vw + 44px - ${offset}px))`,
                      }}>
                        <InlineLottie src="/lottie/ai-animation.json" size={67} />
                      </div>
                    )}
                    {task.id === 's4' && (
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        right: 0,
                        transform: `translateY(-50%) translateX(calc(50vw - 44px - ${offset}px))`,
                      }}>
                        <InlineLottie src="/lottie/star-ai.json" size={67} />
                      </div>
                    )}
                    <TaskCircle node={task} color={section.color} skill={section.skill} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes mapPulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        /* Remove layout padding on map page */
        body:has(#map-page) [class*="container"],
        body:has(#map-page) main {
          padding: 0 !important;
          margin: 0 !important;
          padding-top: env(safe-area-inset-top, 0px) !important;
          max-width: 100% !important;
        }
        body:has(#map-page) [class*="Layout_container"] {
          padding-top: env(safe-area-inset-top, 0px) !important;
          padding-bottom: 0 !important;
          margin-top: 0 !important;
        }
        body:has(#map-page) [class*="Layout_main"],
        body:has(#map-page) [class*="Layout_mainContent"] {
          padding-top: 0 !important;
          margin-top: 0 !important;
        }
      `}</style>
    </div>
  );
}
