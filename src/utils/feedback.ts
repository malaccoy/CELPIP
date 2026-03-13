import { FeedbackItem, Task1State, Task2State } from "@/types";

export const countWords = (text: string) => {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
};

export const generateTask1Feedback = (state: Task1State): FeedbackItem[] => {
  const text = state.content;
  const lowerText = text.toLowerCase();
  const feedback: FeedbackItem[] = [];

  // 1. Check for "Dear"
  feedback.push({
    id: 'dear-check',
    message: 'Your email should start with "Dear ..."',
    severity: 'BLOCKER',
    passed: /^\s*dear/i.test(text)
  });

  // 2. Introduction check
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  const introProbablyExists = lines.length > 0 && lines[0].length > 20;
  feedback.push({
    id: 'intro-check',
    message: 'The first sentence should explain who you are and why you are writing (Purpose).',
    severity: 'IMPORTANT',
    passed: introProbablyExists && (lowerText.includes('writing to') || lowerText.includes('name is') || lowerText.includes('resident of') || lowerText.includes('customer'))
  });

  // 3. Connectors
  const connectors = ['first', 'second', 'third', 'finally', 'additionally', 'moreover', 'furthermore'];
  const foundConnectors = connectors.filter(c => lowerText.includes(c));
  feedback.push({
    id: 'connectors-check',
    message: 'Use ordering connectors (First, Second, Third, Finally).',
    severity: 'IMPORTANT',
    passed: foundConnectors.length >= 2
  });

  // 4. Contractions
  const contractions = ["don't", "can't", "i'm", "it's", "won't", "shouldn't"];
  const foundContractions = contractions.filter(c => lowerText.includes(c));
  const isFormal = state.formality === 'Formal';
  if (isFormal) {
    feedback.push({
      id: 'contractions-check',
      message: 'In formal emails, avoid contractions (don\'t → do not).',
      severity: 'POLISH',
      passed: foundContractions.length === 0
    });
  }

  // 5. Specific CTA
  feedback.push({
    id: 'cta-check',
    message: 'Use a specific closing phrase, such as "Please let me know if...".',
    severity: 'IMPORTANT',
    passed: lowerText.includes('let me know') || lowerText.includes('look forward') || lowerText.includes('waiting for')
  });

  // 6. Sign-off
  feedback.push({
    id: 'signoff-check',
    message: 'End with "Regards," followed by your full name.',
    severity: 'BLOCKER',
    passed: /regards,?/i.test(text)
  });

  return feedback;
};

export const generateTask2Feedback = (state: Task2State): FeedbackItem[] => {
  const text = state.content;
  const lowerText = text.toLowerCase();
  const feedback: FeedbackItem[] = [];

  // 1. Forbidden Option references
  const optionRefs = ["option a", "option b", "choose option"];
  const foundOptions = optionRefs.filter(o => lowerText.includes(o));
  feedback.push({
    id: 'option-ref-check',
    message: 'Do NOT use "Option A" or "Option B". Refer to the topic directly.',
    severity: 'BLOCKER',
    passed: foundOptions.length === 0
  });

  // 2. Opinion Structure in Intro
  feedback.push({
    id: 'intro-opinion',
    message: 'Your introduction should clearly state your opinion.',
    severity: 'BLOCKER',
    passed: lowerText.includes('opinion') || lowerText.includes('believe') || lowerText.includes('recommend') || lowerText.includes('suggest') || lowerText.includes('would rather')
  });

  // 3. Connectors
  const connectors = ['first', 'second', 'finally', 'reason', 'another'];
  feedback.push({
    id: 'connectors-check',
    message: 'The body should use clear connectors to separate arguments.',
    severity: 'IMPORTANT',
    passed: connectors.filter(c => lowerText.includes(c)).length >= 2
  });

  // 4. Conclusion
  feedback.push({
    id: 'conclusion-check',
    message: 'Include a closing paragraph starting with "In conclusion" or similar.',
    severity: 'IMPORTANT',
    passed: lowerText.includes('conclusion') || lowerText.includes('summarize') || lowerText.includes('all in all')
  });

  // 5. PRE check
  feedback.push({
    id: 'example-check',
    message: 'Use concrete examples (e.g., "For example", "For instance").',
    severity: 'POLISH',
    passed: lowerText.includes('example') || lowerText.includes('instance') || lowerText.includes('such as')
  });

  // 6. Contractions
  const contractions = ["don't", "can't", "i'm", "it's", "won't", "shouldn't"];
  const foundContractions = contractions.filter(c => lowerText.includes(c));
  feedback.push({
    id: 'contractions-check',
    message: 'Avoid contractions in argumentative writing (Task 2).',
    severity: 'POLISH',
    passed: foundContractions.length === 0
  });

  // 7. Rhetorical questions
  feedback.push({
    id: 'rhetorical-check',
    message: 'Avoid starting paragraphs with rhetorical questions (e.g., "Why is this good?").',
    severity: 'POLISH',
    passed: !/\?/.test(text)
  });

  return feedback;
};

// Calculate estimated CELPIP score based on feedback results
export const calculateScore = (feedback: FeedbackItem[], wordCount: number): number => {
  let score = 6;
  
  if (wordCount >= 150 && wordCount <= 200) {
    score += 1.5;
  } else if (wordCount >= 130 && wordCount < 150) {
    score += 0.5;
  } else if (wordCount > 200 && wordCount <= 220) {
    score += 1;
  } else if (wordCount < 130) {
    score -= 1;
  }
  
  const blockers = feedback.filter(f => f.severity === 'BLOCKER');
  const important = feedback.filter(f => f.severity === 'IMPORTANT');
  const polish = feedback.filter(f => f.severity === 'POLISH');
  
  const blockersPassed = blockers.filter(f => f.passed).length;
  const importantPassed = important.filter(f => f.passed).length;
  const polishPassed = polish.filter(f => f.passed).length;
  
  if (blockers.length > 0) {
    const blockerRatio = blockersPassed / blockers.length;
    score += blockerRatio * 2;
    if (blockerRatio < 0.5) score -= 2;
  }
  
  if (important.length > 0) {
    const importantRatio = importantPassed / important.length;
    score += importantRatio * 1.5;
  }
  
  if (polish.length > 0) {
    const polishRatio = polishPassed / polish.length;
    score += polishRatio * 1;
  }
  
  return Math.max(3, Math.min(12, Math.round(score)));
};
