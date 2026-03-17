import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Log activity points for the leaderboard.
 * Reading/Listening = 1 pt per exercise
 * Speaking = 2 pts per submission
 * Writing = 3 pts per submission
 * Citizenship = 2 pts per lesson
 */
export async function logActivity(
  userId: string,
  type: 'reading' | 'listening' | 'writing' | 'speaking' | 'citizenship',
  count: number = 1
) {
  const points = type === 'writing' ? 3 : type === 'speaking' ? 2 : type === 'citizenship' ? 2 : 1;

  try {
    // One log per exercise/submission (not per question)
    await prisma.activityLog.create({
      data: { userId, type, points },
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}
