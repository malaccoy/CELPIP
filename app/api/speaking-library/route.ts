import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Track recently served prompts per user to avoid repeats
const recentlyServed = new Map<string, Set<string>>();

export async function POST(req: NextRequest) {
  try {
    const { taskId, userId, difficulty } = await req.json();
    
    if (!taskId) {
      return NextResponse.json({ error: 'taskId required' }, { status: 400 });
    }

    // Map taskId to file (e.g., "giving-advice" -> task1, or "task1" -> task1)
    const taskMap: Record<string, string> = {
      'giving-advice': 'task1', 'task1': 'task1',
      'personal-experience': 'task2', 'talking-about-personal-experience': 'task2', 'task2': 'task2',
      'describing-scene': 'task3', 'describing-a-scene': 'task3', 'task3': 'task3',
      'making-predictions': 'task4', 'task4': 'task4',
      'comparing-persuading': 'task5', 'comparing-and-persuading': 'task5', 'task5': 'task5',
      'difficult-situation': 'task6', 'dealing-with-a-difficult-situation': 'task6', 'task6': 'task6',
      'expressing-opinions': 'task7', 'task7': 'task7',
      'unusual-situation': 'task8', 'describing-an-unusual-situation': 'task8', 'task8': 'task8',
    };

    const fileKey = taskMap[taskId.toLowerCase()] || taskMap[taskId.replace(/\s+/g, '-').toLowerCase()];
    if (!fileKey) {
      return NextResponse.json({ error: 'Unknown task' }, { status: 400 });
    }

    const libPath = join(process.cwd(), 'public', 'data', 'speaking-library', `${fileKey}.json`);
    if (!existsSync(libPath)) {
      return NextResponse.json({ error: 'Library not available' }, { status: 404 });
    }

    let prompts = JSON.parse(readFileSync(libPath, 'utf8'));
    
    // Filter by difficulty if provided
    if (difficulty) {
      const filtered = prompts.filter((p: any) => p.difficulty === difficulty);
      if (filtered.length > 0) prompts = filtered;
    }
    
    if (!prompts.length) {
      return NextResponse.json({ error: 'No prompts available' }, { status: 404 });
    }

    // Avoid recently served prompts for this user
    const userKey = userId || 'anonymous';
    if (!recentlyServed.has(userKey)) {
      recentlyServed.set(userKey, new Set());
    }
    const served = recentlyServed.get(userKey)!;
    
    // Filter out recently served
    let available = prompts.filter((p: any) => !served.has(p.id));
    if (available.length === 0) {
      // Reset if all have been served
      served.clear();
      available = prompts;
    }

    // Pick random
    const prompt = available[Math.floor(Math.random() * available.length)];
    served.add(prompt.id);

    // Keep set manageable (max 20 per user)
    if (served.size > 20) {
      const arr = Array.from(served);
      served.clear();
      arr.slice(-10).forEach(id => served.add(id));
    }

    return NextResponse.json({ prompt, source: 'library' }, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } });
  } catch (error) {
    console.error('Speaking library error:', error);
    return NextResponse.json({ error: 'Failed to load prompt' }, { status: 500 });
  }
}
