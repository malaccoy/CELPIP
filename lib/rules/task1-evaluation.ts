/**
 * Task 1 Email Writing Evaluation Engine
 * 
 * Rule-based (no AI) evaluation for CELPIP Task 1 email writing.
 * Returns structured feedback with explicit, actionable errors, warnings, and suggestions.
 */

// ============================================================
// Types
// ============================================================

export type EvaluationLevel = 'weak' | 'ok' | 'strong';

export interface Task1EvaluationResult {
  score: number;         // 0–12 CELPIP scale
  level: EvaluationLevel;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  wordCount: number;
}

export interface Task1EvaluationOptions {
  questions?: string[];  // Questions from the prompt that must be addressed
  promptText?: string;   // Raw CELPIP prompt text to parse for bullets
}

export interface ParsedPrompt {
  bullets: string[];
  audienceHint?: string;
}

// ============================================================
// Constants
// ============================================================

const MIN_WORD_COUNT = 150;
const MAX_WORD_COUNT = 200;
const MAX_SCORE = 12;
const ERROR_PENALTY = 3;
const WARNING_PENALTY = 1;
const MIN_KEYWORD_LENGTH = 2;
const MIN_CONNECTORS_FOR_POSITIVE = 2;
const MAX_CONNECTORS_TO_DISPLAY = 3;

// Common stop words to exclude from question keyword matching
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'can', 'to', 'of', 'in', 'for',
  'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'between', 'under', 'again',
  'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
  'how', 'all', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
  'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
  'just', 'and', 'but', 'if', 'or', 'because', 'until', 'while', 'what',
  'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'it',
  'its', 'your', 'you', 'they', 'them', 'their', 'we', 'us', 'our', 'i',
  'me', 'my', 'he', 'him', 'his', 'she', 'her', '?'
]);

// Valid opening patterns (case-insensitive)
const OPENING_PATTERNS = [
  /^\s*dear\s+/i,
  /^\s*to\s+whom\s+it\s+may\s+concern/i,
];

// Valid closing patterns (case-insensitive)
const CLOSING_KEYWORDS = [
  'sincerely',
  'regards',
  'kind regards',
  'yours faithfully',
  'yours sincerely',
  'best regards',
  'warm regards',
  'respectfully',
];

// Purpose clarity keywords (first paragraph)
const PURPOSE_KEYWORDS = [
  'i am writing to',
  'i\'m writing to',
  'i would like to',
  'i\'d like to',
  'this email is regarding',
  'this email is to',
  'the purpose of this email',
  'the purpose of this letter',
];

// Connector keywords for structured arguments
const CONNECTOR_KEYWORDS = [
  'firstly',
  'secondly',
  'thirdly',
  'moreover',
  'additionally',
  'finally',
  'furthermore',
  'in addition',
  'first of all',
  'first,',
  'second,',
  'third,',
  'lastly',
];

// CTA / Request keywords
const CTA_KEYWORDS = [
  'i would appreciate',
  'i\'d appreciate',
  'i kindly ask',
  'please let me know',
  'i look forward',
  'i would be grateful',
  'i\'d be grateful',
  'please contact',
  'please respond',
  'please advise',
  'i request',
  'i hope to hear',
  'awaiting your',
];

// ============================================================
// Helper Functions
// ============================================================

/**
 * Count words in text
 */
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

/**
 * Get the first paragraph (non-empty text before second line break or first 2 sentences)
 */
function getFirstParagraph(text: string): string {
  const lines = text.split(/\n\n+/);
  // Skip the opening line if it starts with "Dear"
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length > 0 && !OPENING_PATTERNS.some(p => p.test(trimmed))) {
      return trimmed.toLowerCase();
    }
  }
  return '';
}

/**
 * Map score to level
 */
function getLevel(score: number): EvaluationLevel {
  if (score <= 5) return 'weak';
  if (score <= 8) return 'ok';
  return 'strong';
}

/**
 * Clean a bullet string by removing leading markers, extra whitespace, etc.
 */
function cleanBulletText(text: string): string {
  return text
    // Remove leading bullet markers
    .replace(/^[-•●○▪▸►]\s*/, '')
    // Remove leading numbered markers like "1)", "2.", "1:", etc.
    .replace(/^\d+[.):\-]\s*/, '')
    // Trim whitespace
    .trim();
}

/**
 * Patterns to detect audience hints in prompt text
 */
const AUDIENCE_PATTERNS = [
  /write\s+(?:an?\s+)?(?:email|letter)\s+to\s+(?:your\s+)?([^.]+?)(?:\.|,|to\s+(?:explain|request|complain|inform|ask))/i,
  /(?:address(?:ed)?\s+to|recipient[:\s]+)(?:your\s+)?([^.]+?)(?:\.|$)/i,
  /(?:you are writing to|writing to)\s+(?:your\s+)?([^.]+?)(?:\.|,)/i,
];

/**
 * Phrases that indicate following content describes what to include
 */
const INSTRUCTION_PHRASES = [
  'in your email, you should:',
  'in your email you should:',
  'in your email, you should',
  'in your email you should',
  'your email should:',
  'your email should',
  'make sure to:',
  'make sure to',
  'be sure to:',
  'be sure to',
  'include:',
  'you should:',
  'you should',
  'you need to:',
  'you need to',
];

/**
 * Parse a CELPIP Task 1 prompt and extract bullet points and audience hint.
 * 
 * @param promptText - Raw CELPIP prompt text
 * @returns Parsed bullets and optional audience hint
 */
export function parseTask1Prompt(promptText: string): ParsedPrompt {
  const bullets: string[] = [];
  let audienceHint: string | undefined;

  // Try to extract audience hint
  for (const pattern of AUDIENCE_PATTERNS) {
    const match = promptText.match(pattern);
    if (match && match[1]) {
      audienceHint = match[1].trim();
      break;
    }
  }

  // Split into lines for processing
  const lines = promptText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  // Strategy 1: Look for explicit bullet markers (-, •, or numbered 1), 2), 3))
  const bulletLinePattern = /^(?:[-•●○▪▸►]|\d+[.):\-])\s*.+/;
  const bulletLines = lines.filter(line => bulletLinePattern.test(line));

  if (bulletLines.length >= 2) {
    // Found explicit bullets
    for (const line of bulletLines) {
      const cleaned = cleanBulletText(line);
      if (cleaned.length > 0) {
        bullets.push(cleaned);
      }
    }
    return { bullets, audienceHint };
  }

  // Strategy 2: Look for content after instruction phrases
  const lowerPrompt = promptText.toLowerCase();
  let instructionIndex = -1;
  let matchedPhrase = '';

  for (const phrase of INSTRUCTION_PHRASES) {
    const idx = lowerPrompt.indexOf(phrase);
    if (idx !== -1) {
      instructionIndex = idx;
      matchedPhrase = phrase;
      break;
    }
  }

  if (instructionIndex !== -1) {
    // Extract text after the instruction phrase
    const afterInstruction = promptText.substring(instructionIndex + matchedPhrase.length).trim();
    
    // Try to split by common delimiters or sentence patterns
    // Look for patterns like "explain X, describe Y, and suggest Z"
    const itemPatterns = afterInstruction.split(/[,;]\s*(?:and\s+)?|\band\s+/i)
      .map(s => s.trim())
      .filter(s => s.length > 5); // Filter out very short fragments

    if (itemPatterns.length >= 2) {
      for (const item of itemPatterns.slice(0, 4)) { // Limit to 4 items
        // Clean the item: remove trailing punctuation
        const cleaned = item.replace(/[.!]+$/, '').trim();
        if (cleaned.length > 0) {
          bullets.push(cleaned);
        }
      }
      return { bullets, audienceHint };
    }

    // Fallback: try to split by period-separated sentences
    const sentences = afterInstruction.split(/\.\s+/)
      .map(s => s.trim().replace(/\.$/, ''))
      .filter(s => s.length > 10 && /^[a-z]/i.test(s)); // Must start with letter and have reasonable length

    if (sentences.length >= 2) {
      for (const sentence of sentences.slice(0, 4)) {
        bullets.push(sentence);
      }
      return { bullets, audienceHint };
    }
  }

  // Strategy 3: If all else fails, return empty bullets
  return { bullets, audienceHint };
}

/**
 * Extract 2-5 meaningful keywords from a bullet/sentence using simple regex/token rules.
 * Keywords are nouns and verbs (approximated by word characteristics).
 * 
 * @param text - The bullet text to extract keywords from
 * @returns Array of 2-5 keywords
 */
function extractKeywords(text: string): string[] {
  // Remove punctuation and convert to lowercase
  const cleanedText = text.toLowerCase().replace(/[?.,!;:'"()[\]{}]/g, ' ');
  
  // Split into words
  const words = cleanedText.split(/\s+/).filter(w => w.length > 0);
  
  // Filter for meaningful keywords (not stop words, sufficient length)
  const candidates = words.filter(word => {
    // Must be longer than MIN_KEYWORD_LENGTH characters
    if (word.length <= MIN_KEYWORD_LENGTH) return false;
    // Must not be a stop word
    if (STOP_WORDS.has(word)) return false;
    // Must start with a letter
    if (!/^[a-z]/i.test(word)) return false;
    return true;
  });

  // Remove duplicates while preserving order
  const unique = [...new Set(candidates)];

  // Return 2-5 keywords (prioritize first occurrences as they're often most important)
  return unique.slice(0, 5);
}

/**
 * Check if a bullet point is covered in the email text by keyword matching.
 * A bullet is considered "covered" if at least one of its keywords appears in the email.
 * 
 * @param bullet - The bullet text
 * @param emailText - The email body text
 * @returns true if at least one keyword is found
 */
function isBulletCovered(bullet: string, emailText: string): boolean {
  const keywords = extractKeywords(bullet);
  if (keywords.length === 0) return true; // No keywords = can't evaluate = assume covered
  
  const lowerEmail = emailText.toLowerCase();
  
  // Check if at least one keyword appears in the email
  return keywords.some(keyword => lowerEmail.includes(keyword));
}

// ============================================================
// Rule Implementations
// ============================================================

/**
 * Rule 1: Word Count
 * - If wordCount < 150 → error
 * - If wordCount > 200 → warning
 * - If 150–200 → ok
 */
function checkWordCount(wordCount: number): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (wordCount < MIN_WORD_COUNT) {
    errors.push(
      `Word count is ${wordCount}, which is below the minimum of ${MIN_WORD_COUNT}. ` +
      `Add ${MIN_WORD_COUNT - wordCount} more words to meet the requirement.`
    );
  } else if (wordCount > MAX_WORD_COUNT) {
    warnings.push(
      `Word count is ${wordCount}, which exceeds the recommended maximum of ${MAX_WORD_COUNT}. ` +
      `Consider removing ${wordCount - MAX_WORD_COUNT} words for conciseness.`
    );
  }

  return { errors, warnings };
}

/**
 * Rule 2: Opening Line
 * Must start with a valid opening such as "Dear" or "To whom it may concern"
 */
function checkOpening(text: string): { errors: string[] } {
  const errors: string[] = [];
  const hasValidOpening = OPENING_PATTERNS.some(pattern => pattern.test(text));

  if (!hasValidOpening) {
    errors.push(
      'Email must start with a proper opening. ' +
      'Use "Dear [Name/Title]," or "To whom it may concern," at the beginning.'
    );
  }

  return { errors };
}

/**
 * Rule 3: Closing Line
 * Must contain a valid closing such as "Sincerely", "Regards", etc.
 */
function checkClosing(text: string): { errors: string[] } {
  const errors: string[] = [];
  const lowerText = text.toLowerCase();
  const hasValidClosing = CLOSING_KEYWORDS.some(keyword => lowerText.includes(keyword));

  if (!hasValidClosing) {
    errors.push(
      'Email must end with a proper closing. ' +
      'Add "Sincerely,", "Regards,", "Kind regards,", or "Yours faithfully," before your name.'
    );
  }

  return { errors };
}

/**
 * Rule 4: Purpose Clarity
 * First paragraph must contain intent keywords
 */
function checkPurposeClarity(text: string): { warnings: string[] } {
  const warnings: string[] = [];
  const firstParagraph = getFirstParagraph(text);
  const hasPurpose = PURPOSE_KEYWORDS.some(keyword => firstParagraph.includes(keyword));

  if (!hasPurpose) {
    warnings.push(
      'The purpose of your email is unclear. ' +
      'Add a clear intent statement in your first paragraph, such as "I am writing to...", ' +
      '"I would like to...", or "This email is regarding...".'
    );
  }

  return { warnings };
}

/**
 * Rule 5: Question Coverage
 * Each question from the prompt must be addressed at least once
 */
function checkQuestionCoverage(text: string, questions: string[]): { errors: string[] } {
  const errors: string[] = [];
  const lowerText = text.toLowerCase();

  // Filter out empty questions
  const validQuestions = questions.filter(q => q && q.trim().length > 0);

  for (const question of validQuestions) {
    const lowerQuestion = question.toLowerCase().trim();
    
    // Extract meaningful keywords from the question (excluding stop words)
    const keywords = lowerQuestion
      .replace(/[?.,!;:'"]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > MIN_KEYWORD_LENGTH && !STOP_WORDS.has(word));

    // Check if at least one keyword from the question appears in the text
    const isAddressed = keywords.some(keyword => lowerText.includes(keyword));

    if (!isAddressed && keywords.length > 0) {
      errors.push(
        `Question not addressed: "${question}". ` +
        `Make sure to answer this question in your email.`
      );
    }
  }

  return { errors };
}

/**
 * Rule 5b: Bullet Coverage (for parsed prompts)
 * Each bullet from the parsed prompt must be addressed using keyword matching
 */
function checkBulletCoverage(text: string, bullets: string[]): { errors: string[] } {
  const errors: string[] = [];

  // Filter out empty bullets
  const validBullets = bullets.filter(b => b && b.trim().length > 0);

  for (const bullet of validBullets) {
    if (!isBulletCovered(bullet, text)) {
      errors.push(
        `Bullet point not addressed: "${bullet}". ` +
        `Make sure to cover this point in your email.`
      );
    }
  }

  return { errors };
}

/**
 * Rule 6: Connectors (Quality Boost)
 * Count usage of connectors like "Firstly", "Secondly", etc.
 */
function checkConnectors(text: string): { suggestions: string[] } {
  const suggestions: string[] = [];
  const lowerText = text.toLowerCase();
  
  const foundConnectors = CONNECTOR_KEYWORDS.filter(keyword => lowerText.includes(keyword));
  const connectorCount = foundConnectors.length;

  if (connectorCount === 0) {
    suggestions.push(
      'Use ordering connectors to structure your email better. ' +
      'Consider adding "Firstly,", "Secondly,", "Moreover,", "Additionally,", or "Finally," ' +
      'to organize your points clearly.'
    );
  } else if (connectorCount >= MIN_CONNECTORS_FOR_POSITIVE) {
    suggestions.push(
      `Good use of connectors (${foundConnectors.slice(0, MAX_CONNECTORS_TO_DISPLAY).join(', ')}). ` +
      'This helps structure your email clearly.'
    );
  }

  return { suggestions };
}

/**
 * Rule 7: CTA / Request (Quality)
 * Look for phrases like "I would appreciate", "Please let me know"
 */
function checkCTA(text: string): { suggestions: string[] } {
  const suggestions: string[] = [];
  const lowerText = text.toLowerCase();
  
  const hasCTA = CTA_KEYWORDS.some(keyword => lowerText.includes(keyword));

  if (!hasCTA) {
    suggestions.push(
      'Consider adding a clear call-to-action or request. ' +
      'For example: "I would appreciate your assistance with this matter," ' +
      '"I kindly ask for your consideration," or "Please let me know if you need any further information."'
    );
  }

  return { suggestions };
}

// ============================================================
// Main Evaluation Function
// ============================================================

/**
 * Evaluate Task 1 (Email Writing) text using deterministic rules.
 * 
 * @param text - The email text to evaluate
 * @param options - Optional configuration including questions or promptText
 * @returns Structured evaluation result with score, level, and feedback
 */
export function evaluateTask1Email(
  text: string,
  options: Task1EvaluationOptions = {}
): Task1EvaluationResult {
  const { questions = [], promptText } = options;
  
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Calculate word count
  const wordCount = countWords(text);

  // Rule 1: Word Count
  const wordCountResult = checkWordCount(wordCount);
  errors.push(...wordCountResult.errors);
  warnings.push(...wordCountResult.warnings);

  // Rule 2: Opening Line
  const openingResult = checkOpening(text);
  errors.push(...openingResult.errors);

  // Rule 3: Closing Line
  const closingResult = checkClosing(text);
  errors.push(...closingResult.errors);

  // Rule 4: Purpose Clarity
  const purposeResult = checkPurposeClarity(text);
  warnings.push(...purposeResult.warnings);

  // Rule 5: Question/Bullet Coverage
  // If promptText is provided, parse it and check bullet coverage
  // Otherwise, use the questions array for backward compatibility
  if (promptText) {
    const parsedPrompt = parseTask1Prompt(promptText);
    if (parsedPrompt.bullets.length > 0) {
      const bulletResult = checkBulletCoverage(text, parsedPrompt.bullets);
      errors.push(...bulletResult.errors);
    }
  } else if (questions.length > 0) {
    const questionResult = checkQuestionCoverage(text, questions);
    errors.push(...questionResult.errors);
  }

  // Rule 6: Connectors
  const connectorResult = checkConnectors(text);
  suggestions.push(...connectorResult.suggestions);

  // Rule 7: CTA / Request
  const ctaResult = checkCTA(text);
  suggestions.push(...ctaResult.suggestions);

  // Calculate score
  // Start from 12, subtract 3 for each error, 1 for each warning
  let score = MAX_SCORE;
  score -= errors.length * ERROR_PENALTY;
  score -= warnings.length * WARNING_PENALTY;
  
  // Ensure minimum score of 0
  score = Math.max(0, score);

  // Determine level
  const level = getLevel(score);

  return {
    score,
    level,
    errors,
    warnings,
    suggestions,
    wordCount,
  };
}
