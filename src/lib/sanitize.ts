/**
 * Input sanitization utilities for the CELPIP AI Coach.
 *
 * Protects against:
 *  - Prompt injection attacks on AI endpoints
 *  - HTML/script injection in user-facing content
 *  - Excessively long inputs that waste API tokens
 */

/**
 * Strip common prompt injection patterns from user text
 * before sending to OpenAI. This is a defense-in-depth measure
 * (the system prompt is the primary defense).
 */
export function sanitizeForAI(text: string): string {
  let clean = text;

  // Remove attempts to override system instructions
  const injectionPatterns = [
    /ignore\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|rules?)/gi,
    /you\s+are\s+now\s+(a|an)\s+/gi,
    /system\s*:\s*/gi,
    /\[INST\]/gi,
    /\[\/INST\]/gi,
    /<<SYS>>/gi,
    /<\|im_start\|>/gi,
    /<\|im_end\|>/gi,
  ];

  for (const pattern of injectionPatterns) {
    clean = clean.replace(pattern, '');
  }

  return clean.trim();
}

/**
 * Escape HTML entities to prevent XSS when rendering user content.
 */
export function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
  };
  return str.replace(/[&<>"']/g, (char) => map[char] || char);
}

/**
 * Truncate text to a maximum length, adding ellipsis if truncated.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Remove null bytes and other control characters that could
 * cause issues in database storage or API calls.
 */
export function stripControlChars(text: string): string {
  // eslint-disable-next-line no-control-regex
  return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

/**
 * Full sanitization pipeline for user text inputs.
 * Applies all sanitization steps in sequence.
 */
export function sanitizeInput(text: string, maxLength = 5000): string {
  let clean = text;
  clean = stripControlChars(clean);
  clean = clean.trim();
  clean = clean.slice(0, maxLength);
  return clean;
}
