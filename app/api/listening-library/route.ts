import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Map part labels to library file names
const PART_MAP: Record<string, string> = {
  'Part 1': 'part1',
  'Part 2': 'part2',
  'Part 3': 'part3',
  'Part 4': 'part4',
  'Part 5': 'part5',
  'Part 6': 'part6',
};

export async function POST(req: NextRequest) {
  try {
    const { partOrTask, difficulty } = await req.json();
    
    // Find which part
    const partKey = Object.keys(PART_MAP).find(k => partOrTask?.includes(k));
    if (!partKey) {
      return NextResponse.json({ error: 'Invalid part' }, { status: 400 });
    }
    
    const partId = PART_MAP[partKey];
    const libPath = join(process.cwd(), 'public', 'data', 'listening-library', `${partId}.json`);
    
    if (!existsSync(libPath)) {
      return NextResponse.json({ error: 'Library not available for this part yet' }, { status: 404 });
    }
    
    const raw = JSON.parse(readFileSync(libPath, 'utf8'));
    
    // Library can be array or object with numeric keys — normalize to array
    let exercises: any[] = Array.isArray(raw) ? raw : Object.values(raw);
    
    // Filter by difficulty if provided
    if (difficulty) {
      const filtered = exercises.filter((e: any) => e.difficulty === difficulty);
      if (filtered.length > 0) exercises = filtered;
    }
    
    if (!exercises.length) {
      return NextResponse.json({ error: 'No exercises available' }, { status: 404 });
    }
    
    // Pick random exercise
    const exercise = exercises[Math.floor(Math.random() * exercises.length)];
    
    // Ensure all questions have unique IDs
    const ensureIds = (qs: any[]) => qs.map((q: any, i: number) => ({ ...q, id: q.id ?? i + 1 }));

    // Part 1 has clips format
    if (exercise.clips) {
      let qIdx = 0;
      const clips = exercise.clips.map((c: any) => ({
        questions: (c.questions || []).map((q: any) => ({ ...q, id: q.id ?? ++qIdx })),
      }));
      return NextResponse.json({
        exercise: {
          title: exercise.title,
          clips,
          questions: clips.flatMap((c: any) => c.questions || []),
        },
        clipAudioUrls: exercise.clips.map((c: any) => `/audio/listening-library/${c.audioFile}`),
        context: exercise.context,
        source: 'library',
      });
    }
    
    return NextResponse.json({
      exercise: {
        title: exercise.title,
        passage: '',
        questions: ensureIds(exercise.questions || []),
      },
      audioUrl: `/audio/listening-library/${exercise.audioFile}`,
      context: exercise.context,
      duration: exercise.duration,
      source: 'library',
    });
  } catch (error) {
    console.error('Listening library error:', error);
    return NextResponse.json({ error: 'Failed to load exercise' }, { status: 500 });
  }
}
