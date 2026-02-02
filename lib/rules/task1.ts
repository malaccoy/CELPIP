/**
 * Task 1 specific rules for email writing evaluation
 */

import { Issue, Suggestion, RuleResult } from './common';

// Configuration constants
const MIN_INTRO_LENGTH = 30;

// CTA (Call-to-Action) indicators
const CTA_INDICATORS = [
  'may i request', 'may i suggest', 'could you please', 'would you please',
  'i would appreciate if', 'i would appreciate it if', 'i would be grateful if',
  'i kindly request', 'i would kindly request', 'please consider',
  'i would like to request', 'i would like to suggest', 'i hope you can',
  'i hope you will', 'would it be possible', 'i am hoping you could',
  'i request that', 'i suggest that', 'please let me know when',
  'please let me know if', 'i look forward to'
];

// Closing line indicators
const CLOSING_LINE_INDICATORS = [
  'please let me know', 'please do not hesitate', 'i look forward to',
  'thank you for your', 'i appreciate your', 'i await your',
  'looking forward to', 'hoping to hear', 'i hope to hear',
  'thank you in advance', 'your prompt response', 'at your earliest convenience'
];

/**
 * Check if the email starts with "Dear ..."
 */
export function checkDearOpening(text: string): RuleResult {
  const issues: Issue[] = [];
  const suggestions: Suggestion[] = [];
  let penalty = 0;

  const hasDear = /^\s*dear\s+/i.test(text);

  if (!hasDear) {
    issues.push({
      code: 'MISSING_DEAR',
      message: 'Email should start with "Dear [Name/Title],"',
      severity: 'blocker'
    });
    suggestions.push({
      code: 'ADD_DEAR',
      message: 'Start your email with "Dear Mr./Ms. [Name]," or "Dear [Title],"'
    });
    penalty = 2;
  }

  return { issues, suggestions, penalty };
}

/**
 * Check if the email includes who the writer is
 */
export function checkWhoAmI(text: string): RuleResult {
  const lowerText = text.toLowerCase();
  const issues: Issue[] = [];
  const suggestions: Suggestion[] = [];
  let penalty = 0;

  const whoIndicators = [
    'my name is', 'i am a', 'i am an', 'i am the', 'i\'m a', 'i\'m an', 'i\'m the',
    'as a resident', 'as a customer', 'as a tenant', 'as an employee',
    'i have been a', 'i have been an', 'i live in', 'i work at', 'i work for'
  ];

  const hasWhoAmI = whoIndicators.some(indicator => lowerText.includes(indicator));

  if (!hasWhoAmI) {
    issues.push({
      code: 'MISSING_WHO',
      message: 'The email should introduce who you are (e.g., "My name is... and I am a resident of...")',
      severity: 'important'
    });
    suggestions.push({
      code: 'ADD_WHO',
      message: 'Add a brief introduction: "My name is [Name] and I am a [resident/customer/employee]..."'
    });
    penalty = 1;
  }

  return { issues, suggestions, penalty };
}

/**
 * Check if the email explains why the writer is writing (purpose)
 */
export function checkWhyWriting(text: string): RuleResult {
  const lowerText = text.toLowerCase();
  const issues: Issue[] = [];
  const suggestions: Suggestion[] = [];
  let penalty = 0;

  const whyIndicators = [
    'writing to', 'i am writing', 'i\'m writing', 'the purpose of this', 'this email is to',
    'i would like to', 'i want to', 'i wish to', 'i need to', 'to inform you',
    'to request', 'to complain', 'to express', 'to suggest', 'to ask'
  ];

  const hasWhyWriting = whyIndicators.some(indicator => lowerText.includes(indicator));

  if (!hasWhyWriting) {
    issues.push({
      code: 'MISSING_WHY',
      message: 'The email should clearly state the purpose (e.g., "I am writing to...")',
      severity: 'important'
    });
    suggestions.push({
      code: 'ADD_PURPOSE',
      message: 'Add a clear purpose statement: "I am writing to [complain about/request/inform you about]..."'
    });
    penalty = 1;
  }

  return { issues, suggestions, penalty };
}

/**
 * Check for proper sign-off with regards and name
 */
export function checkRegardsAndName(text: string): RuleResult {
  const issues: Issue[] = [];
  const suggestions: Suggestion[] = [];
  let penalty = 0;

  // Check for sign-off phrases
  const signOffPatterns = [
    /regards,?\s*\n?\s*\w+/i,
    /sincerely,?\s*\n?\s*\w+/i,
    /best regards,?\s*\n?\s*\w+/i,
    /kind regards,?\s*\n?\s*\w+/i,
    /yours sincerely,?\s*\n?\s*\w+/i,
    /yours faithfully,?\s*\n?\s*\w+/i
  ];

  const hasProperSignOff = signOffPatterns.some(pattern => pattern.test(text));

  // Also check for just "Regards" without a name following
  const hasRegardsOnly = /regards,?\s*$/i.test(text.trim());

  if (!hasProperSignOff) {
    if (hasRegardsOnly) {
      issues.push({
        code: 'MISSING_NAME_AFTER_REGARDS',
        message: 'Sign-off has "Regards" but is missing your name',
        severity: 'important'
      });
      suggestions.push({
        code: 'ADD_NAME',
        message: 'Add your full name after "Regards,": "Regards,\\n[Your Full Name]"'
      });
      penalty = 1;
    } else {
      issues.push({
        code: 'MISSING_SIGNOFF',
        message: 'Email should end with a proper sign-off (e.g., "Regards,\\n[Your Name]")',
        severity: 'blocker'
      });
      suggestions.push({
        code: 'ADD_SIGNOFF',
        message: 'End your email with "Regards," or "Sincerely," followed by your full name'
      });
      penalty = 2;
    }
  }

  return { issues, suggestions, penalty };
}

/**
 * Check for introduction/opening paragraph
 */
export function checkIntroduction(text: string): RuleResult {
  const lowerText = text.toLowerCase();
  const issues: Issue[] = [];
  const suggestions: Suggestion[] = [];
  let penalty = 0;

  const lines = text.split('\n').filter(l => l.trim().length > 0);
  
  // First meaningful line after "Dear..." should be the intro
  const dearLineIndex = lines.findIndex(l => /^\s*dear/i.test(l));
  const introLineIndex = dearLineIndex >= 0 ? dearLineIndex + 1 : 0;
  const introLine = lines[introLineIndex] || '';
  
  const hasProperIntro = introLine.length > MIN_INTRO_LENGTH && 
    (lowerText.includes('writing to') || lowerText.includes('purpose') || 
     lowerText.includes('i am') || lowerText.includes('my name'));

  if (!hasProperIntro) {
    issues.push({
      code: 'WEAK_INTRODUCTION',
      message: 'The introduction should clearly state who you are and why you are writing',
      severity: 'important'
    });
    suggestions.push({
      code: 'STRENGTHEN_INTRO',
      message: 'Start with: "I am writing to [purpose]. My name is [Name] and I am [role/relationship]."'
    });
    penalty = 1;
  }

  return { issues, suggestions, penalty };
}

/**
 * Check for Call-to-Action (CTA) - request, suggestion, or desired outcome
 */
export function checkCallToAction(text: string): RuleResult {
  const lowerText = text.toLowerCase();
  const issues: Issue[] = [];
  const suggestions: Suggestion[] = [];
  let penalty = 0;

  const hasCTA = CTA_INDICATORS.some(indicator => lowerText.includes(indicator));

  if (!hasCTA) {
    issues.push({
      code: 'MISSING_CTA',
      message: 'The email should include a clear request or suggestion (Call-to-Action)',
      severity: 'important'
    });
    suggestions.push({
      code: 'ADD_CTA',
      message: 'Add a CTA before your closing: "May I request that...", "I would appreciate if you could...", or "Would it be possible to..."'
    });
    penalty = 1.5;
  }

  return { issues, suggestions, penalty };
}

/**
 * Check for proper closing line before sign-off
 */
export function checkClosingLine(text: string): RuleResult {
  const lowerText = text.toLowerCase();
  const issues: Issue[] = [];
  const suggestions: Suggestion[] = [];
  let penalty = 0;

  const hasClosingLine = CLOSING_LINE_INDICATORS.some(indicator => lowerText.includes(indicator));

  if (!hasClosingLine) {
    issues.push({
      code: 'MISSING_CLOSING_LINE',
      message: 'Add a polite closing line before your sign-off',
      severity: 'polish'
    });
    suggestions.push({
      code: 'ADD_CLOSING_LINE',
      message: 'Add: "Please let me know if you require any further information." or "I look forward to hearing from you."'
    });
    penalty = 0.5;
  }

  return { issues, suggestions, penalty };
}

/**
 * Check for proper paragraph structure
 */
export function checkParagraphStructure(text: string): RuleResult {
  const issues: Issue[] = [];
  const suggestions: Suggestion[] = [];
  let penalty = 0;

  // Split by double newlines or significant breaks
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  // Also check single-line breaks for paragraph-like structures
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  
  // Heuristic: Good email has at least 3 "sections" (opening, body, closing)
  const hasParagraphs = paragraphs.length >= 3 || lines.length >= 5;
  
  // Check if text is one giant block (no line breaks at all)
  const isOneBlock = paragraphs.length === 1 && !text.includes('\n');

  if (isOneBlock) {
    issues.push({
      code: 'NO_PARAGRAPHS',
      message: 'Your email is one continuous block of text. Break it into paragraphs.',
      severity: 'important'
    });
    suggestions.push({
      code: 'ADD_PARAGRAPHS',
      message: 'Structure: Opening (Dear + purpose) → Body (your points with First/Second/Third) → Closing (CTA + sign-off)'
    });
    penalty = 1.5;
  } else if (!hasParagraphs) {
    issues.push({
      code: 'WEAK_STRUCTURE',
      message: 'Consider organizing your email into clearer paragraphs',
      severity: 'polish'
    });
    suggestions.push({
      code: 'IMPROVE_STRUCTURE',
      message: 'Use line breaks to separate: introduction, main points, and closing.'
    });
    penalty = 0.5;
  }

  return { issues, suggestions, penalty };
}

/**
 * Check for tone consistency (formal vs informal markers)
 */
export function checkToneConsistency(text: string): RuleResult {
  const lowerText = text.toLowerCase();
  const issues: Issue[] = [];
  const suggestions: Suggestion[] = [];
  let penalty = 0;

  // Informal markers that shouldn't appear in formal emails
  const informalMarkers = [
    'hey', 'hi there', 'what\'s up', 'gonna', 'wanna', 'gotta', 'kinda',
    'yeah', 'yep', 'nope', 'cool', 'awesome', 'guys', 'stuff', 'things like that',
    'btw', 'fyi', 'asap', 'lol', 'haha', '!!', '???', ':)', ':('
  ];

  // Formal markers (good signs)
  const formalMarkers = [
    'dear', 'sincerely', 'regards', 'respectfully', 'i would appreciate',
    'please', 'kindly', 'i am writing to', 'thank you for'
  ];

  const foundInformal = informalMarkers.filter(m => lowerText.includes(m));
  const foundFormal = formalMarkers.filter(m => lowerText.includes(m));

  // If we have formal markers but also informal ones, there's inconsistency
  if (foundInformal.length > 0 && foundFormal.length > 0) {
    issues.push({
      code: 'INCONSISTENT_TONE',
      message: `Tone is inconsistent. Found informal language: ${foundInformal.slice(0, 3).join(', ')}`,
      severity: 'important'
    });
    suggestions.push({
      code: 'FIX_TONE',
      message: 'Keep a consistent formal tone throughout. Replace informal words with formal alternatives.'
    });
    penalty = 1;
  } else if (foundInformal.length > 0) {
    issues.push({
      code: 'INFORMAL_TONE',
      message: `Informal language detected: ${foundInformal.slice(0, 3).join(', ')}`,
      severity: 'important'
    });
    suggestions.push({
      code: 'USE_FORMAL_TONE',
      message: 'Use formal language: "Hey" → "Dear", "gonna" → "going to", avoid slang and emoticons.'
    });
    penalty = 1.5;
  }

  return { issues, suggestions, penalty };
}
