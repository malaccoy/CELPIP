/**
 * Free content limits per section.
 * Items beyond these limits show as locked (🔒) for non-Pro users.
 */

export const FREE_LIMITS = {
  writing: {
    task1: 3,   // out of 42 prompts — enough to taste, not enough to master
    task2: 3,   // out of 33 prompts
  },
  speaking: {
    perTask: 1, // 1 prompt per task (8 tasks = 8 free)
  },
  reading: {
    perPart: 1, // 1 passage per part (4 parts = 4 free)
  },
  listening: {
    perPart: 1, // 1 passage per part (6 parts = 6 free)
  },
} as const;

/**
 * Check if a specific item index is free.
 * Index is 0-based within its group.
 */
export function isItemFree(
  section: 'writing-task1' | 'writing-task2' | 'speaking' | 'reading' | 'listening',
  indexInGroup: number
): boolean {
  switch (section) {
    case 'writing-task1':
      return indexInGroup < FREE_LIMITS.writing.task1;
    case 'writing-task2':
      return indexInGroup < FREE_LIMITS.writing.task2;
    case 'speaking':
      return indexInGroup < FREE_LIMITS.speaking.perTask;
    case 'reading':
      return indexInGroup < FREE_LIMITS.reading.perPart;
    case 'listening':
      return indexInGroup < FREE_LIMITS.listening.perPart;
    default:
      return false;
  }
}
