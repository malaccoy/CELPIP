import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface Achievement {
  id: string;
  unlockedAt: string;
}

// GET - Fetch user's achievements from Supabase
export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('user_achievements')
      .select('achievement_id, unlocked_at')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching achievements:', error);
      return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 });
    }

    // Transform to client format
    const achievements = data.map(entry => ({
      id: entry.achievement_id,
      unlockedAt: entry.unlocked_at,
    }));

    return NextResponse.json({ 
      success: true, 
      data: achievements,
      count: achievements.length 
    });
  } catch (error) {
    console.error('Achievements fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Sync achievements to Supabase
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { achievements } = body as { achievements: Achievement[] };

    if (!Array.isArray(achievements)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    // Transform to Supabase format
    const entries = achievements.map(entry => ({
      user_id: user.id,
      achievement_id: entry.id,
      unlocked_at: entry.unlockedAt || new Date().toISOString(),
    }));

    // Upsert (insert or ignore if exists)
    const { error } = await supabase
      .from('user_achievements')
      .upsert(entries, { 
        onConflict: 'user_id,achievement_id',
        ignoreDuplicates: true 
      });

    if (error) {
      console.error('Error syncing achievements:', error);
      return NextResponse.json({ error: 'Failed to sync achievements' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      synced: entries.length,
      message: 'Achievements synced successfully' 
    });
  } catch (error) {
    console.error('Achievements sync error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Clear user's achievements
export async function DELETE() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { error } = await supabase
      .from('user_achievements')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting achievements:', error);
      return NextResponse.json({ error: 'Failed to delete achievements' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Achievements cleared successfully' 
    });
  } catch (error) {
    console.error('Achievements delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
