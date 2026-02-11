'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  AlertCircle,
  BookOpen,
  Target,
  Sparkles,
  Mail,
  PenLine,
  FileText,
  AlertTriangle,
  Zap,
  Send,
  RotateCcw,
  Check,
  X
} from 'lucide-react';
import styles from '@/styles/LessonPage.module.scss';

// ============================================
// LESSON DATA
// ============================================

interface ContentBlock {
  type: 'text' | 'heading' | 'tip' | 'warning' | 'example' | 'list' | 'comparison' | 'formula';
  content: string;
  items?: string[];
  good?: string;
  bad?: string;
}

interface PracticeExercise {
  id: string;
  type: 'micro' | 'rewrite' | 'choice' | 'fill';
  prompt: string;
  hint?: string;
  correctAnswer?: string;
  options?: string[];
  rubric?: string[];
}

interface LessonData {
  id: string;
  title: string;
  unitNumber: number;
  lessonNumber: number;
  objective: string;
  duration: string;
  icon: React.ReactNode;
  content: ContentBlock[];
  practice: PracticeExercise[];
}

const lessonsData: Record<string, LessonData> = {
  'csf-framework': {
    id: 'csf-framework',
    title: 'The CSF Framework',
    unitNumber: 1,
    lessonNumber: 1,
    objective: 'Plan any CELPIP writing response in under 2 minutes',
    duration: '5 min',
    icon: <Target size={24} />,
    content: [
      {
        type: 'text',
        content: 'Before writing anything, you need to understand three things: Context, Skill, and Formula. This is the CSF Framework.'
      },
      {
        type: 'heading',
        content: 'C - Context: What do I need to know?'
      },
      {
        type: 'list',
        content: 'From the question, identify:',
        items: [
          'THE WHAT: What is the problem or situation?',
          'THE WHY: Why are you writing this?',
          'THE WHO: Who are you writing to?'
        ]
      },
      {
        type: 'example',
        content: '"You attended a community picnic. Some people have allergies but no one listed ingredients." → WHAT: Allergy problem. WHY: Suggest listing ingredients. WHO: Picnic organizer.'
      },
      {
        type: 'heading',
        content: 'S - Skill: What does the examiner want?'
      },
      {
        type: 'list',
        content: 'The examiner looks for:',
        items: [
          'Clear purpose in your opening',
          'Specific details (names, dates, places)',
          'Appropriate tone for the audience',
          'Logical flow between paragraphs'
        ]
      },
      {
        type: 'heading',
        content: 'F - Formula: What\'s my structure?'
      },
      {
        type: 'formula',
        content: 'Opening → Problem/Context → Solution/Request → Closing'
      },
      {
        type: 'tip',
        content: 'Spend 2 minutes on CSF before writing. This planning saves time and improves your score.'
      }
    ],
    practice: [
      {
        id: 'csf-micro-1',
        type: 'micro',
        prompt: 'Read this prompt and identify THE WHAT, THE WHY, and THE WHO:\n\n"Your neighbor plays loud music every night. Write an email to your building manager."',
        hint: 'Think about the problem, your purpose, and the recipient.',
        rubric: ['Identifies problem: loud music at night', 'Purpose: complain or request action', 'Recipient: building manager (formal tone)']
      },
      {
        id: 'csf-choice-1',
        type: 'choice',
        prompt: 'Which opening is better for a formal email to a building manager?',
        options: [
          'Hey, I need to talk to you about something annoying.',
          'I am writing to bring to your attention an ongoing noise disturbance in our building.',
          'So there\'s this guy who keeps playing music really loud...'
        ],
        correctAnswer: 'I am writing to bring to your attention an ongoing noise disturbance in our building.'
      }
    ]
  },
  'tone-formality': {
    id: 'tone-formality',
    title: 'Tone & Formality',
    unitNumber: 1,
    lessonNumber: 2,
    objective: 'Match your writing tone to any audience',
    duration: '4 min',
    icon: <Sparkles size={24} />,
    content: [
      {
        type: 'text',
        content: 'Your tone depends on WHO you\'re writing to. Getting this wrong can cost you 2-3 band scores.'
      },
      {
        type: 'heading',
        content: 'Formal (Manager, Official, Stranger)'
      },
      {
        type: 'list',
        content: 'Use when writing to:',
        items: [
          'Your boss or supervisor',
          'A company or organization',
          'Someone you don\'t know',
          'Official complaints or requests'
        ]
      },
      {
        type: 'example',
        content: '"I am writing to express my concern regarding..." / "I would appreciate it if you could..."'
      },
      {
        type: 'heading',
        content: 'Semi-formal (Colleague, Acquaintance)'
      },
      {
        type: 'example',
        content: '"I wanted to reach out about..." / "Would you be able to...?"'
      },
      {
        type: 'heading',
        content: 'Informal (Friend, Family)'
      },
      {
        type: 'example',
        content: '"Hey! I was thinking..." / "Can you help me out with...?"'
      },
      {
        type: 'comparison',
        content: 'Same request, different tones:',
        bad: 'Yo, can you cover my shift tomorrow?',
        good: 'I am writing to request coverage for my shift on Tuesday, March 15th.'
      },
      {
        type: 'warning',
        content: 'Never use "Hey" or "Hi there" in formal emails. Use "Dear Mr./Ms. [Name]" or "Dear [Title]".'
      }
    ],
    practice: [
      {
        id: 'tone-micro-1',
        type: 'micro',
        prompt: 'Rewrite this informal sentence for a FORMAL email to your manager:\n\n"Hey, I need next Friday off for a thing."',
        hint: 'Include polite language, specific details, and a proper request format.'
      },
      {
        id: 'tone-choice-1',
        type: 'choice',
        prompt: 'You\'re writing to a friend about visiting next week. Which greeting is appropriate?',
        options: [
          'Dear Sir/Madam,',
          'Hey Sarah!',
          'To Whom It May Concern,'
        ],
        correctAnswer: 'Hey Sarah!'
      }
    ]
  },
  'make-it-real': {
    id: 'make-it-real',
    title: 'Make It Real',
    unitNumber: 2,
    lessonNumber: 3,
    objective: 'Add specific details that boost your score',
    duration: '5 min',
    icon: <Sparkles size={24} />,
    content: [
      {
        type: 'text',
        content: 'Generic responses get low scores. The secret to band 10+ is SPECIFICITY.'
      },
      {
        type: 'heading',
        content: 'The Problem with Generic Writing'
      },
      {
        type: 'comparison',
        content: '',
        bad: 'I had a problem with my order recently.',
        good: 'On March 15th, I ordered a blue wool sweater (Order #45892) which arrived with a torn sleeve.'
      },
      {
        type: 'heading',
        content: 'What to Add'
      },
      {
        type: 'list',
        content: 'Make it real with:',
        items: [
          'NAMES: "My colleague Sarah" not "someone at work"',
          'DATES: "Last Tuesday, March 12th" not "recently"',
          'NUMBERS: "Order #45892" or "3 items" not "my order"',
          'PLACES: "The downtown branch on Oak Street" not "the store"'
        ]
      },
      {
        type: 'tip',
        content: 'You can INVENT these details! The examiner doesn\'t know if "Sarah" is real. What matters is that your writing feels authentic.'
      },
      {
        type: 'example',
        content: 'Generic: "The food was bad and service was slow."\nReal: "The pasta carbonara was cold when served, and we waited 45 minutes despite the restaurant being half-empty."'
      }
    ],
    practice: [
      {
        id: 'real-micro-1',
        type: 'micro',
        prompt: 'Rewrite this generic sentence with specific details:\n\n"I bought something from your store and it was broken."',
        hint: 'Add: what item, when, where, order number, what was broken.',
        rubric: ['Includes specific item name', 'Includes date or order number', 'Describes the specific problem']
      },
      {
        id: 'real-rewrite-1',
        type: 'rewrite',
        prompt: 'Add specific details to make this more vivid:\n\n"The event was fun and I enjoyed it."',
        hint: 'What event? Where? When? What specifically did you enjoy?'
      }
    ]
  },
  'email-structure': {
    id: 'email-structure',
    title: 'Email Structure',
    unitNumber: 2,
    lessonNumber: 1,
    objective: 'Write perfectly structured Task 1 emails',
    duration: '6 min',
    icon: <Mail size={24} />,
    content: [
      {
        type: 'text',
        content: 'Every high-scoring email follows the same structure. Learn it once, use it every time.'
      },
      {
        type: 'heading',
        content: 'The 4-Part Email Formula'
      },
      {
        type: 'formula',
        content: '1. GREETING + PURPOSE (1-2 sentences)\n2. CONTEXT/PROBLEM (2-3 sentences)\n3. REQUEST/SOLUTION (2-3 sentences)\n4. CLOSING (1-2 sentences)'
      },
      {
        type: 'heading',
        content: 'Part 1: Greeting + Purpose'
      },
      {
        type: 'example',
        content: 'Dear Mr. Thompson,\n\nI am writing to request a replacement for a defective product I purchased last week.'
      },
      {
        type: 'heading',
        content: 'Part 2: Context/Problem'
      },
      {
        type: 'example',
        content: 'On Tuesday, March 12th, I bought a Bluetooth speaker (Model XB-200) from your downtown store. When I tried to use it at home, I discovered that the right speaker produces no sound at all.'
      },
      {
        type: 'heading',
        content: 'Part 3: Request/Solution'
      },
      {
        type: 'example',
        content: 'I would appreciate it if you could arrange for a replacement or provide a full refund. I have attached the receipt and can bring the defective unit to your store at your convenience.'
      },
      {
        type: 'heading',
        content: 'Part 4: Closing'
      },
      {
        type: 'example',
        content: 'Thank you for your attention to this matter. I look forward to hearing from you soon.\n\nSincerely,\n[Your name]'
      },
      {
        type: 'tip',
        content: 'Aim for 150-200 words total. Each part should be roughly 25-50 words.'
      }
    ],
    practice: [
      {
        id: 'structure-micro-1',
        type: 'micro',
        prompt: 'Write ONLY the opening (greeting + purpose) for this prompt:\n\n"Write an email to your gym manager about broken equipment."',
        hint: 'Start with "Dear..." and state your purpose clearly in 1-2 sentences.'
      }
    ]
  },
  'opening-lines': {
    id: 'opening-lines',
    title: 'Opening Lines',
    unitNumber: 2,
    lessonNumber: 2,
    objective: 'Start every email with impact',
    duration: '5 min',
    icon: <PenLine size={24} />,
    content: [
      {
        type: 'text',
        content: 'Your first sentence tells the examiner everything. A weak opening = a weak score.'
      },
      {
        type: 'heading',
        content: 'The Purpose Statement Formula'
      },
      {
        type: 'formula',
        content: '"I am writing to [VERB] + [WHAT/WHY]"'
      },
      {
        type: 'list',
        content: 'Power verbs for openings:',
        items: [
          'request / inquire about / express concern about',
          'bring to your attention / inform you about',
          'follow up on / provide feedback on',
          'apologize for / thank you for'
        ]
      },
      {
        type: 'comparison',
        content: '',
        bad: 'Hi, I want to talk about something.',
        good: 'I am writing to request a refund for a defective product I purchased on March 15th.'
      },
      {
        type: 'heading',
        content: 'Opening Templates by Situation'
      },
      {
        type: 'list',
        content: '',
        items: [
          'COMPLAINT: "I am writing to express my concern regarding..."',
          'REQUEST: "I am writing to request..."',
          'INFORMATION: "I am writing to inform you that..."',
          'FEEDBACK: "I am writing to provide feedback on..."'
        ]
      },
      {
        type: 'warning',
        content: 'Never start with "My name is..." or "How are you?" — get to the point immediately.'
      }
    ],
    practice: [
      {
        id: 'opening-micro-1',
        type: 'micro',
        prompt: 'Write the opening line for this prompt:\n\n"Your flight was delayed 5 hours and you missed a connection. Email the airline."',
        hint: 'Use "I am writing to..." and mention the specific issue.'
      },
      {
        id: 'opening-choice-1',
        type: 'choice',
        prompt: 'Which opening is strongest for a complaint email?',
        options: [
          'Hello, my name is John and I had a bad experience.',
          'I am writing to express my dissatisfaction with the service I received at your restaurant on Saturday evening.',
          'I want to complain about something that happened.'
        ],
        correctAnswer: 'I am writing to express my dissatisfaction with the service I received at your restaurant on Saturday evening.'
      }
    ]
  },
  'closing-strong': {
    id: 'closing-strong',
    title: 'Closing Strong',
    unitNumber: 2,
    lessonNumber: 4,
    objective: 'End every email with a clear call to action',
    duration: '4 min',
    icon: <CheckCircle2 size={24} />,
    content: [
      {
        type: 'text',
        content: 'A weak ending leaves the reader confused. A strong ending gets results.'
      },
      {
        type: 'heading',
        content: 'The Closing Formula'
      },
      {
        type: 'formula',
        content: '[ACTION REQUEST] + [GRATITUDE] + [SIGN-OFF]'
      },
      {
        type: 'heading',
        content: 'Action Request Examples'
      },
      {
        type: 'list',
        content: '',
        items: [
          '"I would appreciate a response by Friday, March 20th."',
          '"Please let me know if you require any additional information."',
          '"I look forward to hearing from you at your earliest convenience."'
        ]
      },
      {
        type: 'heading',
        content: 'Gratitude + Sign-off'
      },
      {
        type: 'example',
        content: 'Thank you for your time and consideration.\n\nSincerely,\nJohn Smith'
      },
      {
        type: 'comparison',
        content: '',
        bad: 'Thanks, bye!',
        good: 'Thank you for your attention to this matter. I look forward to your response.\n\nBest regards,\nSarah Chen'
      },
      {
        type: 'tip',
        content: 'Match your sign-off to your tone: "Sincerely" for formal, "Best regards" for semi-formal, "Cheers" for informal.'
      }
    ],
    practice: [
      {
        id: 'closing-micro-1',
        type: 'micro',
        prompt: 'Write a closing paragraph for a formal complaint email about a late delivery.',
        hint: 'Include: what action you want, timeline if possible, thank you, and sign-off.'
      }
    ]
  },
  'common-mistakes': {
    id: 'common-mistakes',
    title: 'Common Mistakes',
    unitNumber: 4,
    lessonNumber: 1,
    objective: 'Avoid the errors that cost 2-3 band scores',
    duration: '6 min',
    icon: <AlertTriangle size={24} />,
    content: [
      {
        type: 'text',
        content: 'These 5 mistakes are responsible for most low scores in CELPIP Writing.'
      },
      {
        type: 'heading',
        content: 'Mistake #1: Being Too Generic'
      },
      {
        type: 'comparison',
        content: '',
        bad: 'I had a problem with my order.',
        good: 'The blue sweater I ordered (Order #12345) arrived with a broken zipper.'
      },
      {
        type: 'heading',
        content: 'Mistake #2: Wrong Tone'
      },
      {
        type: 'comparison',
        content: 'Writing to your manager:',
        bad: 'Hey boss, I need Friday off ok?',
        good: 'I am writing to request a day of leave on Friday, April 5th.'
      },
      {
        type: 'heading',
        content: 'Mistake #3: No Clear Structure'
      },
      {
        type: 'text',
        content: 'Jumping between topics confuses the reader. Use clear paragraphs: Opening → Problem → Solution → Closing.'
      },
      {
        type: 'heading',
        content: 'Mistake #4: Repeating the Same Words'
      },
      {
        type: 'comparison',
        content: '',
        bad: 'The product was bad. The service was bad. Everything was bad.',
        good: 'The product was defective, the service was disappointing, and the overall experience was frustrating.'
      },
      {
        type: 'heading',
        content: 'Mistake #5: Weak Opening'
      },
      {
        type: 'comparison',
        content: '',
        bad: 'Hi, I want to talk about something.',
        good: 'I am writing to request a refund for a defective product.'
      },
      {
        type: 'warning',
        content: 'Read your response once before submitting. Most mistakes are easy to catch!'
      }
    ],
    practice: [
      {
        id: 'mistakes-rewrite-1',
        type: 'rewrite',
        prompt: 'Fix all the mistakes in this sentence:\n\n"The thing I bought was bad and I want you to fix it thanks bye"',
        hint: 'Add specifics, proper structure, formal tone, and a real closing.'
      }
    ]
  }
};

// ============================================
// COMPONENT
// ============================================

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.lessonId as string;
  
  const [currentStep, setCurrentStep] = useState<'learn' | 'practice' | 'complete'>('learn');
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [aiFeedback, setAiFeedback] = useState<{good: string[], improve: string[], next: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const lesson = lessonsData[lessonId];

  useEffect(() => {
    // Reset state when lesson changes
    setCurrentStep('learn');
    setPracticeIndex(0);
    setUserAnswer('');
    setShowFeedback(false);
    setIsCorrect(null);
    setAiFeedback(null);
  }, [lessonId]);

  if (!lesson) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h2>Lesson not found</h2>
          <Link href="/writing/guide">Back to Guide</Link>
        </div>
      </div>
    );
  }

  const currentPractice = lesson.practice[practiceIndex];
  const totalPractices = lesson.practice.length;

  const markLessonComplete = () => {
    const saved = localStorage.getItem('celpip_writing_guide_progress');
    const completed = saved ? new Set(JSON.parse(saved)) : new Set();
    completed.add(lesson.id);
    localStorage.setItem('celpip_writing_guide_progress', JSON.stringify([...completed]));
    setCurrentStep('complete');
  };

  const handlePracticeSubmit = async () => {
    if (!userAnswer.trim()) return;
    
    setIsLoading(true);
    
    // For choice questions, check immediately
    if (currentPractice.type === 'choice' && currentPractice.correctAnswer) {
      setIsCorrect(userAnswer === currentPractice.correctAnswer);
      setShowFeedback(true);
      setIsLoading(false);
      return;
    }
    
    // For open-ended questions, simulate AI feedback
    // In production, this would call the OpenAI API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setAiFeedback({
      good: [
        'You addressed the prompt directly',
        'Your language is appropriate for the context'
      ],
      improve: [
        'Add more specific details (dates, names, numbers)',
        'Consider using more formal vocabulary'
      ],
      next: 'Try rewriting with at least 2 specific details.'
    });
    setShowFeedback(true);
    setIsLoading(false);
  };

  const handleNextPractice = () => {
    if (practiceIndex < totalPractices - 1) {
      setPracticeIndex(prev => prev + 1);
      setUserAnswer('');
      setShowFeedback(false);
      setIsCorrect(null);
      setAiFeedback(null);
    } else {
      markLessonComplete();
    }
  };

  const handleRetry = () => {
    setUserAnswer('');
    setShowFeedback(false);
    setIsCorrect(null);
    setAiFeedback(null);
  };

  const renderContentBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case 'heading':
        return <h3 key={index} className={styles.contentHeading}>{block.content}</h3>;
      
      case 'text':
        return <p key={index} className={styles.contentText}>{block.content}</p>;
      
      case 'tip':
        return (
          <div key={index} className={styles.tipBox}>
            <Lightbulb size={20} />
            <p>{block.content}</p>
          </div>
        );
      
      case 'warning':
        return (
          <div key={index} className={styles.warningBox}>
            <AlertCircle size={20} />
            <p>{block.content}</p>
          </div>
        );
      
      case 'example':
        return (
          <div key={index} className={styles.exampleBox}>
            <BookOpen size={18} />
            <p>{block.content}</p>
          </div>
        );
      
      case 'formula':
        return (
          <pre key={index} className={styles.formulaBox}>
            {block.content}
          </pre>
        );
      
      case 'list':
        return (
          <div key={index} className={styles.listBlock}>
            {block.content && <p className={styles.listIntro}>{block.content}</p>}
            <ul>
              {block.items?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        );
      
      case 'comparison':
        return (
          <div key={index} className={styles.comparisonBox}>
            {block.content && <p className={styles.comparisonIntro}>{block.content}</p>}
            <div className={styles.comparisonGrid}>
              <div className={styles.badExample}>
                <span className={styles.label}><X size={16} /> Wrong</span>
                <p>{block.bad}</p>
              </div>
              <div className={styles.goodExample}>
                <span className={styles.label}><Check size={16} /> Correct</span>
                <p>{block.good}</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/writing/guide" className={styles.backButton}>
          <ArrowLeft size={20} />
        </Link>
        <div className={styles.headerInfo}>
          <span className={styles.breadcrumb}>Unit {lesson.unitNumber} • Lesson {lesson.lessonNumber}</span>
          <h1>{lesson.title}</h1>
        </div>
        <div className={styles.headerIcon}>
          {lesson.icon}
        </div>
      </header>

      {/* Progress Bar */}
      <div className={styles.progressContainer}>
        <div className={styles.progressSteps}>
          <div className={`${styles.step} ${currentStep === 'learn' ? styles.active : ''} ${currentStep !== 'learn' ? styles.done : ''}`}>
            <BookOpen size={16} />
            <span>Learn</span>
          </div>
          <div className={styles.stepLine} />
          <div className={`${styles.step} ${currentStep === 'practice' ? styles.active : ''} ${currentStep === 'complete' ? styles.done : ''}`}>
            <PenLine size={16} />
            <span>Practice</span>
          </div>
          <div className={styles.stepLine} />
          <div className={`${styles.step} ${currentStep === 'complete' ? styles.active : ''}`}>
            <CheckCircle2 size={16} />
            <span>Done</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className={styles.main}>
        {/* LEARN STEP */}
        {currentStep === 'learn' && (
          <div className={styles.learnSection}>
            {/* Objective */}
            <div className={styles.objectiveCard}>
              <Target size={18} />
              <div>
                <span className={styles.objectiveLabel}>AFTER THIS LESSON, YOU WILL:</span>
                <p className={styles.objectiveText}>{lesson.objective}</p>
              </div>
            </div>

            {/* Content */}
            <div className={styles.contentArea}>
              {lesson.content.map((block, index) => renderContentBlock(block, index))}
            </div>

            {/* CTA to Practice */}
            <div className={styles.ctaSection}>
              <button 
                className={styles.ctaButton}
                onClick={() => setCurrentStep('practice')}
              >
                <Zap size={20} />
                Practice This Now
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* PRACTICE STEP */}
        {currentStep === 'practice' && currentPractice && (
          <div className={styles.practiceSection}>
            <div className={styles.practiceHeader}>
              <span className={styles.practiceCount}>Exercise {practiceIndex + 1} of {totalPractices}</span>
              <span className={styles.practiceType}>{currentPractice.type.toUpperCase()}</span>
            </div>

            <div className={styles.practiceCard}>
              <p className={styles.practicePrompt}>{currentPractice.prompt}</p>
              
              {currentPractice.hint && !showFeedback && (
                <p className={styles.practiceHint}>💡 {currentPractice.hint}</p>
              )}

              {/* Choice Options */}
              {currentPractice.type === 'choice' && currentPractice.options && !showFeedback && (
                <div className={styles.choiceOptions}>
                  {currentPractice.options.map((option, i) => (
                    <button
                      key={i}
                      className={`${styles.choiceOption} ${userAnswer === option ? styles.selected : ''}`}
                      onClick={() => setUserAnswer(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {/* Text Input */}
              {currentPractice.type !== 'choice' && !showFeedback && (
                <textarea
                  className={styles.practiceInput}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Write your answer here..."
                  rows={5}
                />
              )}

              {/* Submit Button */}
              {!showFeedback && (
                <button
                  className={styles.submitButton}
                  onClick={handlePracticeSubmit}
                  disabled={!userAnswer.trim() || isLoading}
                >
                  {isLoading ? (
                    <>Analyzing...</>
                  ) : (
                    <>
                      <Send size={18} />
                      Submit Answer
                    </>
                  )}
                </button>
              )}

              {/* Feedback */}
              {showFeedback && (
                <div className={styles.feedbackSection}>
                  {/* Choice Feedback */}
                  {currentPractice.type === 'choice' && (
                    <div className={`${styles.choiceFeedback} ${isCorrect ? styles.correct : styles.incorrect}`}>
                      {isCorrect ? (
                        <>
                          <CheckCircle2 size={24} />
                          <span>Correct!</span>
                        </>
                      ) : (
                        <>
                          <X size={24} />
                          <span>Not quite. The correct answer is: "{currentPractice.correctAnswer}"</span>
                        </>
                      )}
                    </div>
                  )}

                  {/* AI Feedback */}
                  {aiFeedback && (
                    <div className={styles.aiFeedback}>
                      <div className={styles.feedbackGood}>
                        <h4><CheckCircle2 size={18} /> What you did well</h4>
                        <ul>
                          {aiFeedback.good.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.feedbackImprove}>
                        <h4><AlertCircle size={18} /> What to improve</h4>
                        <ul>
                          {aiFeedback.improve.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.feedbackNext}>
                        <h4><Target size={18} /> Next Action</h4>
                        <p>{aiFeedback.next}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className={styles.feedbackActions}>
                    <button className={styles.retryButton} onClick={handleRetry}>
                      <RotateCcw size={18} />
                      Try Again
                    </button>
                    <button className={styles.nextButton} onClick={handleNextPractice}>
                      {practiceIndex < totalPractices - 1 ? 'Next Exercise' : 'Complete Lesson'}
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* COMPLETE STEP */}
        {currentStep === 'complete' && (
          <div className={styles.completeSection}>
            <div className={styles.completeIcon}>
              <CheckCircle2 size={48} />
            </div>
            <h2>Lesson Complete!</h2>
            <p>You&apos;ve mastered: {lesson.title}</p>
            
            <div className={styles.completeActions}>
              <button 
                className={styles.nextLessonButton}
                onClick={() => router.push('/writing/guide')}
              >
                Back to Guide
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
