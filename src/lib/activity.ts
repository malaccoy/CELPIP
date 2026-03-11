import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Log activity points for the leaderboard.
 * Reading/Listening question = 1 pt
 * Writing/Speaking submission = 2 pts
 */
export async function logActivity(
  userId: string,
  type: 'reading' | 'listening' | 'writing' | 'speaking',
  count: number = 1
) {
  const points = type === 'writing' ? 3 : type === 'speaking' ? 2 : 1;

  try {
    // Create individual logs for accurate tracking
    const data = Array.from({ length: count }, () => ({
      userId,
      type,
      points,
    }));

    await prisma.activityLog.createMany({ data });
  } catch (error) {
    console.error('Failed to log activity:', error);
    // Don't throw — activity logging should never break the main flow
  }
}
