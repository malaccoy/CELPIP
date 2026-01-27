/**
 * Task 1 specific rules for email writing evaluation
 */

import { Issue, Suggestion, RuleResult } from './common';

// Configuration constants
const MIN_INTRO_LENGTH = 30;

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
