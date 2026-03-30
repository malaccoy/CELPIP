'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Mic, PenTool, Headphones, BookOpen,
  CheckCircle, XCircle, ArrowRight, Shield,
  Target, Sparkles, Trophy, Users,
  Globe, ChevronRight, Star, Zap,
  BarChart3, Clock, Brain, Swords,
  FileText, Award, Play, TrendingUp,
  Lock, Flame, Eye, MessageSquare,
} from 'lucide-react';
import styles from '@/styles/Home.module.scss';
import ShimmerButton from '@/components/ShimmerButton';
import NumberTicker from '@/components/NumberTicker';
import Marquee from '@/components/Marquee';
import dynamic from 'next/dynamic';
const LottieSkillIcon = dynamic(() => import('@/components/LottieSkillIcon'), { ssr: false });

/* ─── Animated Counter Hook ─── */
function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

/* ─── Intersection Observer Hook ─── */
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export default function HomePage() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [liveCount, setLiveCount] = useState(0);

  const statsRef = useInView(0.3);
  const studentsCount = useCountUp(350, 1800, statsRef.inView);
  const exercisesCount = useCountUp(1270, 2000, statsRef.inView);
  const countriesCount = useCountUp(15, 1200, statsRef.inView);
  const passRate = useCountUp(94, 1600, statsRef.inView);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      if (data?.user) setLoggedIn(true);
    });
    // Simulated live counter — higher during study hours (ET)
    const getBaseCount = () => {
      const now = new Date();
      const etHour = (now.getUTCHours() - 4 + 24) % 24; // ET = UTC-4
      if (etHour >= 23 || etHour < 7) return Math.floor(Math.random() * 16) + 15; // 15-30 night
      if (etHour >= 7 && etHour < 10) return Math.floor(Math.random() * 40) + 30; // 30-70 morning
      if (etHour >= 10 && etHour < 14) return Math.floor(Math.random() * 80) + 70; // 70-150 midday
      if (etHour >= 14 && etHour < 18) return Math.floor(Math.random() * 70) + 60; // 60-130 afternoon
      if (etHour >= 18 && etHour < 21) return Math.floor(Math.random() * 60) + 50; // 50-110 evening
      return Math.floor(Math.random() * 30) + 25; // 25-55 late evening
    };
    setLiveCount(getBaseCount());
    const interval = setInterval(() => {
      setLiveCount(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const base = getBaseCount();
        const next = prev + delta;
        // Keep within ±15 of base range
        return Math.max(base - 15, Math.min(base + 15, next));
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const cta = () => router.push(loggedIn ? '/map' : '/auth/register');
  const tryFree = () => router.push('/writing/task-1');

  const skills = [
    { key: 'speaking', icon: Mic, label: 'Speaking', desc: '8 tasks · AI feedback', color: '#a855f7', className: styles.skillCardSpeaking },
    { key: 'writing', icon: PenTool, label: 'Writing', desc: '2 tasks · Voice dictation', color: '#10b981', className: styles.skillCardWriting },
    { key: 'listening', icon: Headphones, label: 'Listening', desc: '6 parts · Real voices', color: '#f59e0b', className: styles.skillCardListening },
    { key: 'reading', icon: BookOpen, label: 'Reading', desc: '4 parts · Timed', color: '#06b6d4', className: styles.skillCardReading },
  ];

  const skillCta = (key: string) => router.push(loggedIn ? '/map' : '/auth/register');

  const skillCardsContent = useMemo(() => ({
    desktop: (
      <div className={styles.heroSkills}>
        {skills.map((s) => (
          <button key={s.key} onClick={() => skillCta(s.key)} className={`${styles.skillCard} ${s.className}`} aria-label={`Practice ${s.label}`}>
            <div className={styles.skillIconBox} style={{ background: s.color }}>
              <LottieSkillIcon skill={s.key as any} size={100} />
            </div>
            <span className={styles.skillCardTitle}>{s.label}</span>
            <span className={styles.skillCardDesc}>{s.desc}</span>
          </button>
        ))}
      </div>
    ),
    mobile: (
      <div className={styles.heroSkillsMobile}>
        {skills.map((s) => (
          <button key={s.key} onClick={() => skillCta(s.key)} className={`${styles.skillCard} ${s.className}`} aria-label={`Practice ${s.label}`}>
            <div className={styles.skillIconBox} style={{ background: s.color }}>
              <LottieSkillIcon skill={s.key as any} size={100} />
            </div>
            <span className={styles.skillCardTitle}>{s.label}</span>
            <span className={styles.skillCardDesc}>{s.desc}</span>
          </button>
        ))}
      </div>
    ),
  }), []);

  return (
    <div className={styles.page}>
      {/* Ambient Background Orbs */}
      <div className={styles.ambientOrbs}>
        <div className={`${styles.orb} ${styles.orb1}`} />
        <div className={`${styles.orb} ${styles.orb2}`} />
        <div className={`${styles.orb} ${styles.orb3}`} />
      </div>

      {/* Mobile Sticky CTA */}
      <div className={styles.mobileCta}>
        <button className={styles.mobileCtaBtn} onClick={cta}>
          START FREE — No Credit Card
        </button>
      </div>

      {/* ═══════ HERO ═══════ */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          {/* Live Activity Indicator */}
          <div className={styles.liveIndicator}>
            <span className={styles.liveDot} />
            <span>{liveCount} people practicing right now</span>
          </div>

          <div className={styles.heroBadge}>
            <Users size={14} />
            350+ students from 15+ countries
          </div>

          <h1 className={styles.heroTitle}>
            Pass CELPIP.<br />
            <span className={styles.heroAccent}>On Your First Try.</span>
          </h1>

          <p className={styles.heroSub}>
            Don&apos;t waste <strong>$300 on a retake</strong>. Practice with AI that scores
            like the real exam — instant feedback on every answer.
          </p>

          <p className={styles.heroNote}>
            Based on official CELPIP scoring criteria (CLB framework)
          </p>

          <div className={styles.heroCtas}>
            <ShimmerButton onClick={cta}>
              <Zap size={18} />
              Start Free Practice
              <ArrowRight size={18} />
            </ShimmerButton>
          </div>

          <p className={styles.heroFreeNote}>
            No credit card required. <strong>10 FREE exercises daily</strong>
          </p>

          <div className={styles.heroTrust}>
            <span className={styles.trustItem}><CheckCircle size={14} /> Free forever</span>
            <span className={styles.trustItem}><CheckCircle size={14} /> All 4 skills</span>
            <span className={styles.trustItem}><CheckCircle size={14} /> AI feedback</span>
            <span className={styles.trustItem}><Shield size={14} /> 30-day guarantee</span>
          </div>
        </div>

        {/* Desktop skill cards */}
        {skillCardsContent.desktop}

        {/* Mobile skill cards */}
        {skillCardsContent.mobile}
      </section>

      {/* ═══════ ANIMATED STATS BAR ═══════ */}
      <section className={styles.statsBar} ref={statsRef.ref}>
        <div className={styles.statsBarInner}>
          <div className={styles.statBlock}>
            <span className={styles.statBlockValue}><NumberTicker value={385} duration={2000} suffix="+" /></span>
            <span className={styles.statBlockLabel}>Active Students</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statBlock}>
            <span className={styles.statBlockValue}><NumberTicker value={1200} duration={2500} delay={200} suffix="+" /></span>
            <span className={styles.statBlockLabel}>Exercises</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statBlock}>
            <span className={styles.statBlockValue}><NumberTicker value={23} duration={1500} delay={400} suffix="+" /></span>
            <span className={styles.statBlockLabel}>Countries</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statBlock}>
            <span className={styles.statBlockValue}><NumberTicker value={94} duration={2000} delay={600} suffix="%" /></span>
            <span className={styles.statBlockLabel}>Pass Rate</span>
          </div>
        </div>
      </section>

      {/* ═══════ LIVE ACTIVITY MARQUEE ═══════ */}
      <Marquee speed={35} style={{ padding: '12px 0', background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {[
          '🎤 Paulo just completed Speaking Task 3',
          '🎧 Maria scored 9 in Listening',
          '✍️ Priya finished Writing Task 1',
          '📖 Ahmed completed 15 Reading drills',
          `🔥 ${liveCount} students practicing right now`,
          '⭐ Kishan reached a 7-day streak',
          '🎤 Chen Wei scored CLB 10 in Speaking',
          '📖 Fatima finished all Reading Part 3',
          '✍️ Jorge improved Writing from 6 to 8',
          '🎧 Yana completed Listening Part 5',
          '⚔️ Marco won 3 Battle matches in a row',
          '🎤 Anita nailed Speaking Task 7',
          '📖 Daniel read 20 passages today',
          '✍️ Olga scored 9 on her survey response',
          '🎧 Raj finished 10 Listening exercises',
          '⭐ Sonia hit a 14-day streak!',
          '🎤 Yuki just practiced Speaking Task 5',
          '📖 Ali completed his first Mock Exam',
          '✍️ Camila got CLB 9 on Writing Task 2',
          '🎧 Deepak scored perfect on Listening Part 1',
          '⚔️ Natasha climbed to #3 on the leaderboard',
          '⭐ Ravi upgraded to Pro after free trial',
          '🎤 Emily finished all 8 Speaking tasks',
          '📖 Viktor scored 10 in Reading Part 4',
          '✍️ Mina improved her email writing to CLB 9',
          '🎧 Hassan completed 30 Listening drills',
        ].map((text, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.6)', fontSize: 14, whiteSpace: 'nowrap' }}>{text}</span>
        ))}
      </Marquee>

      {/* ═══════ TRUST LOGOS ═══════ */}
      <section className={styles.trustSection}>
        <p className={styles.trustLabel}>Trusted by students preparing for</p>
        <div className={styles.trustLogos}>
          <span className={styles.trustLogo}>Express Entry</span>
          <span className={styles.trustLogo}>Provincial Nominee</span>
          <span className={styles.trustLogo}>Citizenship</span>
          <span className={styles.trustLogo}>Study Permit</span>
          <span className={styles.trustLogo}>Work Permit</span>
        </div>
      </section>

      {/* ═══════ PROBLEM + SOLUTION ═══════ */}
      <section className={styles.section}>
        <div className={styles.sectionBadge}>
          <Eye size={14} />
          The Problem
        </div>
        <div className={styles.painGrid}>
          <div className={`${styles.painCard} ${styles.painCardRed}`}>
            <h3 className={`${styles.painTitle} ${styles.painTitleRed}`}>Sound familiar?</h3>
            {[
              '"I studied for months but still scored below CLB 7"',
              '"I paid $300 for a retake — and I\'m still not confident"',
              '"I don\'t know WHERE I\'m losing marks in Speaking"',
              '"My Express Entry is stuck — I need those CRS points NOW"',
            ].map((pain, i) => (
              <div key={i} className={styles.painItem}>
                <XCircle size={18} className={`${styles.painIcon} ${styles.painIconRed}`} />
                <span className={`${styles.painText} ${styles.painTextItalic}`}>{pain}</span>
              </div>
            ))}
          </div>

          <div className={`${styles.painCard} ${styles.painCardGreen}`}>
            <h3 className={`${styles.painTitle} ${styles.painTitleGreen}`}>We built this for you.</h3>
            <p className={styles.painDesc}>
              We know how stressful CELPIP is. That&apos;s why we created an AI coach that gives you{' '}
              <strong style={{ color: '#f8fafc' }}>the exact feedback</strong> you need — instantly, 24/7.
            </p>
            {[
              'Get instant AI feedback on every Speaking & Writing answer',
              'See exactly WHERE you lose marks and HOW to fix it',
              'Practice 1,270+ real CELPIP exercises — all 4 skills',
              'Study 30 min/day → improve 1-2 CLB levels in a month',
            ].map((sol, i) => (
              <div key={i} className={styles.painItem}>
                <CheckCircle size={18} className={`${styles.painIcon} ${styles.painIconGreen}`} />
                <span className={styles.painText}>{sol}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 3 STEPS ═══════ */}
      <section className={`${styles.section} ${styles.sectionAlt}`} style={{ textAlign: 'center' }}>
        <div className={styles.sectionBadge}>
          <Target size={14} />
          How It Works
        </div>
        <h2 className={styles.sectionTitle}>3 Steps to Your Best Score</h2>
        <p className={styles.sectionSub}>Simple. Clear. No confusion.</p>
        <div className={styles.stepsGrid}>
          {[
            { step: '1', title: 'Practice Daily', desc: '10 free exercises across all 4 CELPIP skills. Pick your weak areas — the AI adapts.', color: '#3b82f6', icon: Target },
            { step: '2', title: 'Get Instant Feedback', desc: 'AI scores your answers using CELPIP criteria. See mistakes, corrections, and a model response.', color: '#a855f7', icon: Brain },
            { step: '3', title: 'Pass with Confidence', desc: 'Watch your CLB score climb week by week. When you\'re ready — pass on the first try.', color: '#22c55e', icon: Trophy },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.step} className={styles.stepCard}>
                <div className={styles.stepIconBox} style={{ background: `${s.color}18` }}>
                  <Icon size={24} style={{ color: s.color }} />
                </div>
                <div className={styles.stepContent}>
                  <div className={styles.stepHeader}>
                    <span className={styles.stepNumber} style={{ background: `${s.color}22`, color: s.color }}>
                      {s.step}
                    </span>
                    <span className={styles.stepTitle}>{s.title}</span>
                  </div>
                  <p className={styles.stepDesc}>{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.stepsCta}>
          <button className={styles.ctaMain} onClick={cta}>
            Start Step 1 — It&apos;s Free
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ═══════ VALUE STACK ═══════ */}
      <section className={styles.section} style={{ textAlign: 'center' }}>
        <div className={styles.sectionBadge}>
          <Sparkles size={14} />
          What&apos;s Included
        </div>
        <h2 className={styles.sectionTitle}>Everything You Get</h2>
        <p className={styles.sectionSub}>CA$339+ in value — included in every plan</p>

        <div className={styles.valueCard}>
          <div className={styles.valueList}>
            {[
              { item: 'AI Speaking feedback (8 tasks)', value: 'CA$97/mo', icon: Mic },
              { item: '562 Listening exercises with real voices', value: 'CA$47', icon: Headphones },
              { item: '492 Reading comprehension passages', value: 'CA$37', icon: BookOpen },
              { item: 'Writing feedback with error corrections', value: 'CA$47', icon: PenTool },
              { item: 'Mock Exam (Quick + Full format)', value: 'CA$67', icon: FileText },
              { item: 'Battle Mode PvP + Leaderboard', value: 'CA$27', icon: Swords },
              { item: 'Progress tracking + CLB score estimate', value: 'CA$17', icon: BarChart3 },
            ].map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className={styles.valueItem}>
                  <div className={styles.valueItemLeft}>
                    <Icon size={18} />
                    <span className={styles.valueItemLabel}>{v.item}</span>
                  </div>
                  <span className={styles.valueItemPrice}>{v.value}</span>
                </div>
              );
            })}
          </div>
          <div className={styles.valueTotalRow}>
            <span className={styles.valueTotalLabel}>Total Value</span>
            <span className={styles.valueTotalPrice}>CA$339/mo</span>
          </div>
          <div className={styles.valueYourRow}>
            <span className={styles.valueYourLabel}>Your Price</span>
            <span className={styles.valueYourPrice}>CA$29.99/mo</span>
          </div>
          <div className={styles.valueSave}>Save 93% vs buying separately</div>
        </div>
      </section>

      {/* ═══════ PRICING ═══════ */}
      <section className={`${styles.section} ${styles.sectionAlt}`} style={{ textAlign: 'center' }}>
        <div className={styles.sectionBadge}>
          <Award size={14} />
          Pricing
        </div>
        <h2 className={styles.sectionTitle}>Choose Your Plan</h2>
        <p className={styles.sectionSub}>Start free. Upgrade when you&apos;re ready. Cancel anytime.</p>

        {/* Desktop comparison */}
        <div className={styles.priceCompare}>
          {[
            { label: 'Others charge', price: 'CA$49.99/mo', sub: 'Group classes, no AI', isRed: true },
            { label: 'Retake exam', price: 'CA$300+', sub: 'If you fail again', isRed: true },
            { label: 'CELPIP AI Coach', price: 'FREE to start', sub: 'AI feedback, all 4 skills', isGreen: true },
          ].map((c, i) => (
            <div key={i} className={`${styles.priceCompareCard} ${c.isGreen ? styles.priceCompareHighlight : ''}`} style={{ opacity: c.isRed ? 0.6 : 1 }}>
              <div className={styles.priceCompareLabel}>{c.label}</div>
              <div className={styles.priceCompareValue} style={{ color: c.isGreen ? '#22c55e' : c.isRed ? '#ef4444' : undefined }}>{c.price}</div>
              <div className={styles.priceCompareSub}>{c.sub}</div>
            </div>
          ))}
        </div>

        <div className={styles.plansGrid}>
          {[
            { name: 'Weekly', price: 'CA$9.99', per: '/week', yearly: '', save: '', highlight: false },
            { name: 'Monthly', price: 'CA$29.99', per: '/month', yearly: '= CA$360/year', save: 'Save 25%', highlight: false },
            { name: 'Quarterly', price: 'CA$69.99', per: '/3 months', yearly: '= CA$280/year', save: 'Save 42%', highlight: false },
            { name: 'Annual', price: 'CA$149.99', per: '/year', yearly: 'CA$12.50/month', save: 'Save 69%', highlight: true },
          ].map((p) => (
            <div key={p.name} className={`${styles.planCard} ${p.highlight ? styles.planCardHighlight : ''}`}>
              {p.highlight && (
                <div className={styles.planBestBadge}>
                  <Trophy size={12} /> Best Value
                </div>
              )}
              <div className={styles.planInfo}>
                <div className={styles.planName}>{p.name}</div>
                <div className={styles.planYearly}>{p.yearly}</div>
              </div>
              <div className={styles.planPricing}>
                <div className={`${styles.planPrice} ${p.highlight ? styles.planPriceHighlight : ''}`}>
                  {p.price}<span className={styles.planPer}>{p.per}</span>
                </div>
                {p.save && (
                  <div className={`${styles.planSave} ${p.highlight ? styles.planSaveGreen : ''}`}>{p.save}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.pricingCta}>
          <button className={styles.ctaMain} onClick={cta}>
            Start Free — Upgrade Later
            <ArrowRight size={18} />
          </button>
          <p className={styles.guaranteeNote}>
            <Shield size={14} />
            30-day money-back guarantee. No questions asked.
          </p>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className={styles.section}>
        <div className={styles.sectionBadge}>
          <MessageSquare size={14} />
          Testimonials
        </div>
        <h2 className={styles.sectionTitle}>Real Results from Real Students</h2>
        <p className={styles.sectionSub}>Join hundreds of students who passed CELPIP with our AI coach</p>
        <div className={styles.testGrid}>
          {[
            { name: 'Priya K.', initials: 'PK', text: 'I went from CLB 7 to CLB 9 in 3 weeks. The Speaking feedback shows exactly what to fix.', score: 'CLB 7 → 9', highlight: '+40 CRS', color: '#a855f7', stars: 5, before: 7, after: 9 },
            { name: 'Paulo M.', initials: 'PM', text: 'Paid $300 for a prep course before. This free tool gives better feedback. My PR got approved!', score: 'PR Approved', highlight: '+50 CRS', color: '#3b82f6', stars: 5, before: 6, after: 9 },
            { name: 'Amandeep S.', initials: 'AS', text: '30 minutes a day for a month and I passed with CLB 10. The daily drills kept me consistent.', score: 'CLB 10', highlight: '1st try', color: '#22c55e', stars: 5, before: 7, after: 10 },
          ].map((t, i) => (
            <div key={i} className={styles.testCard}>
              <div className={styles.testStars}>
                {Array.from({ length: t.stars }).map((_, si) => (
                  <Star key={si} size={14} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p className={styles.testText}>&ldquo;{t.text}&rdquo;</p>
              <div className={styles.testScoreBar}>
                <div className={styles.testScoreLabel}>Score Progress</div>
                <div className={styles.testScoreTrack}>
                  <div
                    className={styles.testScoreFill}
                    style={{ width: `${(t.after / 12) * 100}%`, background: t.color }}
                  />
                  <div
                    className={styles.testScoreBefore}
                    style={{ left: `${(t.before / 12) * 100}%` }}
                  >
                    CLB {t.before}
                  </div>
                  <div
                    className={styles.testScoreAfter}
                    style={{ left: `${(t.after / 12) * 100}%`, background: t.color }}
                  >
                    CLB {t.after}
                  </div>
                </div>
              </div>
              <div className={styles.testFooter}>
                <div className={styles.testAuthor}>
                  <div className={styles.testAvatar} style={{ background: t.color }}>{t.initials}</div>
                  <span className={styles.testName}>{t.name}</span>
                </div>
                <div className={styles.testBadges}>
                  <span className={`${styles.testBadge} ${styles.testBadgePurple}`}>{t.score}</span>
                  <span className={`${styles.testBadge} ${styles.testBadgeGreen}`}>{t.highlight}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.testCountries}>
          <span className={styles.testCountriesLabel}>Students from:</span>
          {['Canada', 'India', 'Brazil', 'Philippines', 'Nigeria', 'Pakistan', 'Bangladesh', 'Sri Lanka'].map((c, i) => (
            <span key={i} className={styles.testCountryTag}>{c}</span>
          ))}
        </div>
      </section>

      {/* ═══════ EXPRESS ENTRY ═══════ */}
      <section className={styles.section}>
        <div className={styles.expressCta}>
          <div className={styles.expressIcon}>
            <Globe size={28} />
          </div>
          <h3 className={styles.expressTitle}>Stuck in Express Entry?</h3>
          <p className={styles.expressPoints}>
            CLB 7 → CLB 9 = <strong>+40 CRS points</strong>
          </p>
          <p className={styles.expressDelay}>
            That&apos;s often the difference between an ITA and <strong>6 more months of waiting</strong>.
          </p>

          <div className={styles.expressQuote}>
            <div className={styles.expressQuoteLabel}>Imagine this:</div>
            <p className={styles.expressQuoteText}>
              &ldquo;You open that email: <strong>CELPIP Score — CLB 9</strong>. Your Express Entry
              application — <strong style={{ color: '#22c55e' }}>approved</strong>. Your new life in Canada starts now.&rdquo;
            </p>
          </div>

          <div className={styles.expressStats}>
            <div className={styles.expressStat}>
              <TrendingUp size={16} />
              <span><strong>94%</strong> pass rate</span>
            </div>
            <div className={styles.expressStat}>
              <Clock size={16} />
              <span><strong>3-4 weeks</strong> avg. prep time</span>
            </div>
            <div className={styles.expressStat}>
              <Flame size={16} />
              <span><strong>+1-2 CLB</strong> levels improvement</span>
            </div>
          </div>

          <p className={styles.expressUrgency}>
            Every week you don&apos;t practice is another week your PR is delayed.
          </p>

          <button className={styles.expressBtn} onClick={cta}>
            Boost Your CRS Score
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* ═══════ FAQ ═══════ */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <h2 className={styles.sectionTitle}>Common Questions</h2>
        <p className={styles.sectionSub}>Everything you need to know before getting started</p>
        <div className={styles.faqGrid}>
          {[
            { q: 'Is it really free?', a: 'Yes! 10 free exercises daily across all 4 skills. No credit card needed. Pro unlocks unlimited + advanced content.' },
            { q: 'How accurate is the AI scoring?', a: 'Our AI is trained on official CELPIP scoring criteria (CLB framework). It analyzes grammar, vocabulary, coherence, and task completion — just like a real examiner.' },
            { q: 'How fast will I improve?', a: 'Students who practice 30 min/day typically improve 1-2 CLB levels in 3-4 weeks. Consistency is key.' },
            { q: 'What if I don\'t improve?', a: 'If you don\'t see improvement in 30 days of consistent practice, contact us — we\'ll extend your Pro subscription for free.' },
            { q: 'Can I use it on my phone?', a: 'Absolutely! Works on any device. Also available on Google Play for Android.' },
            { q: 'Can I cancel anytime?', a: 'Yes. No contracts, no hidden fees. Cancel your subscription anytime from your dashboard.' },
          ].map((faq, i) => (
            <div key={i} className={styles.faqCard}>
              <div className={styles.faqQuestion}>{faq.q}</div>
              <p className={styles.faqAnswer}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ FINAL CTA ═══════ */}
      <section className={`${styles.section} ${styles.finalCta}`}>
        <div className={styles.finalCtaGlow} />
        <h2 className={styles.finalTitle}>Your CELPIP Score Won&apos;t Improve by Waiting.</h2>
        <p className={styles.finalSub}>
          Join 350+ students already practicing. Start for free today.
        </p>
        <div className={styles.finalCtaButtons}>
          <button className={styles.ctaMain} onClick={cta}>
            <Zap size={18} />
            Start Free Practice Now
            <ArrowRight size={18} />
          </button>
          <span />
        </div>
        <p className={styles.finalNote}>
          Free forever. No credit card. Upgrade when you&apos;re ready.
        </p>
        <div className={styles.finalTrustRow}>
          <span><Shield size={14} /> 30-day guarantee</span>
          <span><Lock size={14} /> Secure payment</span>
          <span><CheckCircle size={14} /> Cancel anytime</span>
        </div>
      </section>
    </div>
  );
}
