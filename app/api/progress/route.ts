import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface PracticeEntry {
  task: 'task1' | 'task2';
  score: number;
  wordCount: number;
  timeMinutes: number;
  timestamp: string;
}

// GET - Fetch user's progress from Supabase
export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .order('practiced_at', { ascending: false });

    if (error) {
      console.error('Error fetching progress:', error);
      return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
    }

    // Transform to localStorage format
    const practiceHistory = data.map(entry => ({
      task: entry.task_type,
      score: entry.score,
      wordCount: entry.word_count,
      timeMinutes: entry.time_minutes,
      timestamp: entry.practiced_at,
    }));

    return NextResponse.json({ 
      success: true, 
      data: practiceHistory,
      count: practiceHistory.length 
    });
  } catch (error) {
    console.error('Progress sync error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Sync local progress to Supabase
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { practiceHistory } = body as { practiceHistory: PracticeEntry[] };

    if (!Array.isArray(practiceHistory)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    // Transform to Supabase format and upsert
    const entries = practiceHistory.map(entry => ({
      user_id: user.id,
      task_type: entry.task,
      score: entry.score,
      word_count: entry.wordCount || 0,
      time_minutes: entry.timeMinutes || 0,
      practiced_at: entry.timestamp,
    }));

    // Insert with conflict handling (skip duplicates)
    const { error } = await supabase
      .from('user_progress')
      .upsert(entries, { 
        onConflict: 'user_id,task_type,practiced_at',
        ignoreDuplicates: true 
      });

    if (error) {
      console.error('Error syncing progress:', error);
      return NextResponse.json({ error: 'Failed to sync progress' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      synced: entries.length,
      message: 'Progress synced successfully' 
    });
  } catch (error) {
    console.error('Progress sync error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Clear user's progress
export async function DELETE() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { error } = await supabase
      .from('user_progress')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting progress:', error);
      return NextResponse.json({ error: 'Failed to delete progress' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Progress cleared successfully' 
    });
  } catch (error) {
    console.error('Progress delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
