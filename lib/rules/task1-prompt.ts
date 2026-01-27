/**
 * Task 1 Prompt Parser
 * 
 * Deterministic (no AI) parsing of CELPIP Task 1 prompts to extract
 * bullet points and audience hints.
 */

// ============================================================
// Types
// ============================================================

export type ParsedTask1Prompt = {
  bullets: string[];
  audienceHint?: string;
};

// ============================================================
// Constants
// ============================================================

/**
 * Stop words to exclude from keyword extraction.
 * Common English words that don't carry significant meaning.
 * 
 * Note: This set is optimized for bullet point keyword extraction.
 * task1-evaluation.ts has its own STOP_WORDS set for legacy question coverage.
 */
export const STOPWORDS = new Set([
  'the', 'a', 'an', 'to', 'of', 'in', 'on', 'for', 'and', 'or',
  'with', 'is', 'are', 'be', 'been', 'being', 'i', 'you', 'we',
  'they', 'it', 'this', 'that', 'your', 'my', 'our', 'their',
  'his', 'her', 'its', 'what', 'which', 'who', 'whom', 'how',
  'when', 'where', 'why', 'have', 'has', 'had', 'do', 'does',
  'did', 'will', 'would', 'could', 'should', 'may', 'might',
  'must', 'can', 'shall', 'about', 'from', 'into', 'through',
  'during', 'before', 'after', 'above', 'below', 'between',
  'under', 'again', 'further', 'then', 'once', 'here', 'there',
  'all', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
  'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too',
  'very', 'just', 'but', 'if', 'because', 'as', 'until', 'while',
  'at', 'by', 'up', 'down', 'out', 'off', 'over', 'any', 'both',
  'also', 'me', 'him', 'them', 'us', 'am', 'was', 'were', 'been'
]);

/**
 * Minimum keyword length (prefer longer tokens as more meaningful).
 * 
 * Note: This is set to 4 for more precise bullet matching.
 * task1-evaluation.ts uses MIN_KEYWORD_LENGTH = 2 for legacy question coverage.
 */
const MIN_KEYWORD_LENGTH = 4;

/**
 * Maximum keywords to extract per bullet.
 */
const MAX_KEYWORDS = 6;

/**
 * Minimum keywords to extract per bullet.
 */
const MIN_KEYWORDS = 2;

/**
 * Synonym map for common task verbs.
 * Maps source verb to array of synonyms that should be considered matches.
 */
export const VERB_SYNONYMS: Record<string, string[]> = {
  'suggest': ['recommend', 'propose', 'advise'],
  'explain': ['clarify', 'describe', 'elaborate', 'illustrate'],
  'request': ['ask', 'would like', 'want', 'require'],
  'describe': ['explain', 'outline', 'detail', 'depict'],
  'complain': ['express dissatisfaction', 'report problem', 'raise concern'],
  'inform': ['notify', 'tell', 'let know', 'advise'],
  'ask': ['request', 'inquire', 'question'],
  'provide': ['give', 'supply', 'offer', 'furnish'],
};

/**
 * Audience keywords to detect in prompt text.
 */
const AUDIENCE_KEYWORDS = [
  'police',
  'manager',
  'organizer',
  'principal',
  'landlord',
  'customer service',
  'supervisor',
  'teacher',
  'professor',
  'director',
  'employer',
  'neighbor',
  'city council',
  'city manager',
  'mayor',
  'editor',
  'friend',
  'colleague',
];

/**
 * Phrases that indicate following content describes what to include.
 * These patterns mark the start of bullet-like requirements.
 */
const INSTRUCTION_PHRASES = [
  'in your email, you should:',
  'in your email you should:',
  'in your email, you should',
  'in your email you should',
  'in your email, do the following:',
  'in your email do the following:',
  'your email should:',
  'your email should',
  'you should:',
  'you should',
  'make sure to:',
  'make sure to',
  'be sure to:',
  'be sure to',
  'include the following:',
  'include:',
  'you need to:',
  'you need to',
  'do the following:',
  'do the following',
];

/**
 * Action verbs that indicate task requirements (for fallback extraction).
 */
const ACTION_VERBS = [
  'describe',
  'explain',
  'suggest',
  'request',
  'ask',
  'provide',
  'inform',
  'tell',
  'mention',
  'include',
  'express',
  'complain',
  'propose',
  'recommend',
  'state',
  'outline',
];

// ============================================================
// Helper Functions
// ============================================================

/**
 * Normalize line endings and clean up text.
 * - Convert Windows (\r\n) and Mac (\r) line endings to Unix (\n)
 * - Trim each line
 * - Remove empty lines
 */
function normalizeLines(text: string): string[] {
  return text
    // Convert Windows and old Mac line endings to Unix
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Split into lines
    .split('\n')
    // Trim each line
    .map(line => line.trim())
    // Remove empty lines
    .filter(line => line.length > 0);
}

/**
 * Clean a bullet string by removing leading markers and whitespace.
 */
function cleanBulletText(text: string): string {
  return text
    // Remove leading bullet markers (-, •, ●, ○, ▪, ▸, ►, *)
    .replace(/^[-•●○▪▸►*]\s*/, '')
    // Remove leading numbered markers like "1)", "2.", "1:", "1-", etc.
    .replace(/^\d+[.):\-]\s*/, '')
    // Trim whitespace
    .trim();
}

/**
 * Check if a line looks like a bullet point.
 */
function isBulletLine(line: string): boolean {
  // Matches: -, •, ●, ○, ▪, ▸, ►, * followed by text
  // Or: 1), 2., 3:, 4- followed by text
  return /^(?:[-•●○▪▸►*]|\d+[.):\-])\s*.+/.test(line);
}

/**
 * Extract bullets from explicit bullet/numbered list format.
 */
function extractExplicitBullets(lines: string[]): string[] {
  const bullets: string[] = [];
  
  for (const line of lines) {
    if (isBulletLine(line)) {
      const cleaned = cleanBulletText(line);
      if (cleaned.length > 0) {
        bullets.push(cleaned);
      }
    }
  }
  
  return bullets;
}

/**
 * Extract bullets from content after instruction phrases.
 */
function extractBulletsAfterInstruction(text: string): string[] {
  const lowerText = text.toLowerCase();
  let instructionIndex = -1;
  let matchedPhrase = '';

  // Find the first matching instruction phrase
  for (const phrase of INSTRUCTION_PHRASES) {
    const idx = lowerText.indexOf(phrase);
    if (idx !== -1) {
      instructionIndex = idx;
      matchedPhrase = phrase;
      break;
    }
  }

  if (instructionIndex === -1) {
    return [];
  }

  // Extract text after the instruction phrase
  const afterInstruction = text.substring(instructionIndex + matchedPhrase.length).trim();
  
  if (afterInstruction.length === 0) {
    return [];
  }

  // First, try to find explicit bullets in the content after the phrase
  const lines = normalizeLines(afterInstruction);
  const explicitBullets = extractExplicitBullets(lines);
  
  if (explicitBullets.length >= 2) {
    return explicitBullets.slice(0, 4);
  }

  // Try to split by common delimiters or sentence patterns
  // Look for patterns like "explain X, describe Y, and suggest Z"
  const itemPatterns = afterInstruction
    .split(/[,;]\s*(?:and\s+)?|\band\s+/i)
    .map(s => s.trim())
    .filter(s => s.length > 5); // Filter out very short fragments

  if (itemPatterns.length >= 2) {
    const bullets: string[] = [];
    for (const item of itemPatterns.slice(0, 4)) {
      // Clean the item: remove trailing punctuation
      const cleaned = item.replace(/[.!]+$/, '').trim();
      if (cleaned.length > 0) {
        bullets.push(cleaned);
      }
    }
    if (bullets.length >= 2) {
      return bullets;
    }
  }

  // Fallback: try to split by period-separated sentences
  const sentences = afterInstruction
    .split(/\.\s+/)
    .map(s => s.trim().replace(/\.$/, ''))
    .filter(s => s.length > 10 && /^[a-z]/i.test(s));

  if (sentences.length >= 2) {
    return sentences.slice(0, 4);
  }

  return [];
}

/**
 * Fallback extraction: find sentences with action verbs.
 * Used when no explicit bullets or instruction patterns are found.
 */
function extractFallbackBullets(text: string): string[] {
  // Split into sentences
  const sentences = text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 15); // Filter very short fragments

  const lowerText = text.toLowerCase();
  const actionSentences: string[] = [];

  for (const sentence of sentences) {
    const lowerSentence = sentence.toLowerCase();
    // Check if sentence contains any action verb
    const hasActionVerb = ACTION_VERBS.some(verb => {
      // Match verb as whole word
      const regex = new RegExp(`\\b${verb}\\b`, 'i');
      return regex.test(lowerSentence);
    });

    if (hasActionVerb) {
      actionSentences.push(sentence);
    }
  }

  // Return the last 3-5 action sentences (usually requirements are at the end)
  if (actionSentences.length >= 2) {
    return actionSentences.slice(-Math.min(4, actionSentences.length));
  }

  return [];
}

/**
 * Detect audience hint from prompt text.
 * Returns the best matching audience keyword.
 */
function detectAudienceHint(text: string): string | undefined {
  const lowerText = text.toLowerCase();

  // Sort keywords by length (descending) to match longer phrases first
  const sortedKeywords = [...AUDIENCE_KEYWORDS].sort((a, b) => b.length - a.length);

  for (const keyword of sortedKeywords) {
    if (lowerText.includes(keyword)) {
      return keyword;
    }
  }

  return undefined;
}

// ============================================================
// Main Export Functions
// ============================================================

/**
 * Parse a CELPIP Task 1 prompt and extract bullet points and audience hint.
 * 
 * Uses multiple strategies in order:
 * 1. Extract explicit bullet/numbered list items
 * 2. Look for instruction phrases and extract content after them
 * 3. Fallback: find sentences with action verbs
 * 
 * @param promptText - Raw CELPIP prompt text
 * @returns Parsed bullets and optional audience hint
 */
export function parseTask1Prompt(promptText: string): ParsedTask1Prompt {
  if (!promptText || promptText.trim().length === 0) {
    return { bullets: [] };
  }

  // Detect audience hint
  const audienceHint = detectAudienceHint(promptText);

  // Normalize lines for processing
  const lines = normalizeLines(promptText);

  // Strategy 1: Look for explicit bullet markers
  const explicitBullets = extractExplicitBullets(lines);
  if (explicitBullets.length >= 2) {
    return { bullets: explicitBullets.slice(0, 4), audienceHint };
  }

  // Strategy 2: Look for instruction phrases
  const instructionBullets = extractBulletsAfterInstruction(promptText);
  if (instructionBullets.length >= 2) {
    return { bullets: instructionBullets, audienceHint };
  }

  // Strategy 3: Fallback - find sentences with action verbs
  const fallbackBullets = extractFallbackBullets(promptText);
  if (fallbackBullets.length >= 2) {
    return { bullets: fallbackBullets, audienceHint };
  }

  // No bullets found
  return { bullets: [], audienceHint };
}

/**
 * Extract 2-6 meaningful keywords from a bullet/sentence.
 * - Lowercase
 * - Remove punctuation
 * - Remove stopwords
 * - Prefer longer tokens (>= 4 chars)
 * - Keep unique
 * 
 * @param text - The bullet text to extract keywords from
 * @returns Array of 2-6 keywords
 */
export function extractKeywords(text: string): string[] {
  // Remove punctuation and convert to lowercase
  const cleanedText = text
    .toLowerCase()
    .replace(/[?.,!;:'"()[\]{}\/\\-]/g, ' ');

  // Split into words
  const words = cleanedText.split(/\s+/).filter(w => w.length > 0);

  // Filter for meaningful keywords
  const candidates: string[] = [];
  
  for (const word of words) {
    // Must not be a stopword
    if (STOPWORDS.has(word)) continue;
    // Must start with a letter
    if (!/^[a-z]/i.test(word)) continue;
    // Prefer longer words (but allow some shorter ones)
    if (word.length < 3) continue;
    
    candidates.push(word);
  }

  // Remove duplicates while preserving order
  const unique = [...new Set(candidates)];

  // Prioritize longer words
  const sorted = unique.sort((a, b) => b.length - a.length);

  // Take top keywords, prioritizing length >= MIN_KEYWORD_LENGTH
  const preferredLength = sorted.filter(w => w.length >= MIN_KEYWORD_LENGTH);
  const shorter = sorted.filter(w => w.length < MIN_KEYWORD_LENGTH);

  // Combine: prefer longer keywords, fill with shorter if needed
  const result = [...preferredLength.slice(0, MAX_KEYWORDS)];
  if (result.length < MIN_KEYWORDS) {
    result.push(...shorter.slice(0, MIN_KEYWORDS - result.length));
  }

  return result.slice(0, MAX_KEYWORDS);
}

/**
 * Check if a keyword matches in text, including synonym matching.
 * 
 * @param keyword - The keyword to search for
 * @param text - The text to search in (should be lowercase)
 * @returns true if keyword or any of its synonyms are found
 */
export function keywordMatchesInText(keyword: string, text: string): boolean {
  const lowerKeyword = keyword.toLowerCase();
  const lowerText = text.toLowerCase();

  // Direct match
  if (lowerText.includes(lowerKeyword)) {
    return true;
  }

  // Check synonyms
  const synonyms = VERB_SYNONYMS[lowerKeyword];
  if (synonyms) {
    for (const synonym of synonyms) {
      if (lowerText.includes(synonym)) {
        return true;
      }
    }
  }

  // Check if this keyword is a synonym for another verb
  for (const [verb, verbSynonyms] of Object.entries(VERB_SYNONYMS)) {
    if (verbSynonyms.includes(lowerKeyword)) {
      if (lowerText.includes(verb)) {
        return true;
      }
      // Also check other synonyms of the same verb
      for (const otherSynonym of verbSynonyms) {
        if (otherSynonym !== lowerKeyword && lowerText.includes(otherSynonym)) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Check if a bullet point is covered in the email text.
 * A bullet is considered "covered" if at least one keyword or its synonym appears.
 * 
 * @param bullet - The bullet text
 * @param emailText - The email body text
 * @returns true if at least one keyword is found
 */
export function isBulletCovered(bullet: string, emailText: string): boolean {
  const keywords = extractKeywords(bullet);
  
  // No keywords = can't evaluate = assume covered
  if (keywords.length === 0) {
    return true;
  }

  // Check if at least one keyword (or synonym) appears in the email
  return keywords.some(keyword => keywordMatchesInText(keyword, emailText));
}

/**
 * Truncate a bullet text for display in error messages.
 * 
 * @param bullet - The bullet text to truncate
 * @param maxLength - Maximum length (default 90)
 * @returns Truncated string with "..." if exceeded
 */
export function truncateBullet(bullet: string, maxLength: number = 90): string {
  if (bullet.length <= maxLength) {
    return bullet;
  }
  return bullet.substring(0, maxLength - 3) + '...';
}
