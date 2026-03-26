import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const recentlyServed = new Map<string, Set<string>>();

export async function POST(req: NextRequest) {
  try {
    const { taskId, userId, difficulty } = await req.json();
    
    if (!taskId) {
      return NextResponse.json({ error: 'taskId required' }, { status: 400 });
    }

    const taskMap: Record<string, string> = {
      'task1': 'task1', 'email': 'task1', 'writing-an-email': 'task1',
      'task2': 'task2', 'survey': 'task2', 'responding-to-survey': 'task2',
    };

    const fileKey = taskMap[taskId.toLowerCase().replace(/\s+/g, '-')];
    if (!fileKey) {
      return NextResponse.json({ error: 'Unknown task' }, { status: 400 });
    }

    const libPath = join(process.cwd(), 'public', 'data', 'writing-library', `${fileKey}.json`);
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

    const userKey = userId || 'anonymous';
    if (!recentlyServed.has(userKey)) recentlyServed.set(userKey, new Set());
    const served = recentlyServed.get(userKey)!;
    
    let available = prompts.filter((p: any) => !served.has(p.id));
    if (available.length === 0) { served.clear(); available = prompts; }

    const prompt = available[Math.floor(Math.random() * available.length)];
    served.add(prompt.id);

    if (served.size > 20) {
      const arr = Array.from(served);
      served.clear();
      arr.slice(-10).forEach(id => served.add(id));
    }

    return NextResponse.json({ prompt, source: 'library' }, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } });
  } catch (error) {
    console.error('Writing library error:', error);
    return NextResponse.json({ error: 'Failed to load prompt' }, { status: 500 });
  }
}
