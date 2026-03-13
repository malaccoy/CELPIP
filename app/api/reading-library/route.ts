import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const recentlyServed = new Map<string, Set<string>>();

export async function POST(req: NextRequest) {
  try {
    const { partId, partOrTask, userId, difficulty } = await req.json();
    
    const rawPart = partId || partOrTask || '';

    const partMap: Record<string, string> = {
      'correspondence': 'part1', 'part1': 'part1', 'reading-correspondence': 'part1',
      'diagram': 'part2', 'part2': 'part2', 'reading-to-apply-a-diagram': 'part2',
      'information': 'part3', 'part3': 'part3', 'reading-for-information': 'part3',
      'viewpoints': 'part4', 'part4': 'part4', 'reading-for-viewpoints': 'part4',
      'part 1 (reading correspondence)': 'part1',
      'part 2 (reading to apply a diagram)': 'part2',
      'part 3 (reading for information)': 'part3',
      'part 4 (reading for viewpoints)': 'part4',
    };

    const fileKey = partMap[rawPart.toLowerCase().replace(/\s+/g, '-')] || partMap[rawPart.toLowerCase()];
    if (!fileKey) {
      return NextResponse.json({ error: 'Unknown part: ' + rawPart }, { status: 400 });
    }

    const libPath = join(process.cwd(), 'public', 'data', 'reading-library', `${fileKey}.json`);
    if (!existsSync(libPath)) {
      return NextResponse.json({ error: 'Library not available' }, { status: 404 });
    }

    let exercises = JSON.parse(readFileSync(libPath, 'utf8'));
    
    // Filter by difficulty if provided
    if (difficulty) {
      const filtered = exercises.filter((e: any) => e.difficulty === difficulty);
      if (filtered.length > 0) exercises = filtered;
    }
    
    if (!exercises.length) {
      return NextResponse.json({ error: 'No exercises available' }, { status: 404 });
    }

    const userKey = userId || 'anonymous';
    if (!recentlyServed.has(userKey)) recentlyServed.set(userKey, new Set());
    const served = recentlyServed.get(userKey)!;
    
    let available = exercises.filter((e: any) => !served.has(e.id));
    if (available.length === 0) { served.clear(); available = exercises; }

    const exercise = available[Math.floor(Math.random() * available.length)];
    served.add(exercise.id);

    if (served.size > 15) {
      const arr = Array.from(served);
      served.clear();
      arr.slice(-8).forEach(id => served.add(id));
    }

    // Ensure all questions have unique IDs
    if (exercise.questions) {
      exercise.questions = exercise.questions.map((q: any, i: number) => ({
        ...q,
        id: q.id ?? i + 1,
      }));
    }

    return NextResponse.json({ exercise, source: 'library' });
  } catch (error) {
    console.error('Reading library error:', error);
    return NextResponse.json({ error: 'Failed to load exercise' }, { status: 500 });
  }
}
