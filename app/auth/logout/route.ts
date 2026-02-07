import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://celpip.achady.com.br'

export async function POST() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  return NextResponse.redirect(`${SITE_URL}/auth/login`, {
    status: 302,
  })
}

export async function GET() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  return NextResponse.redirect(`${SITE_URL}/auth/login`, {
    status: 302,
  })
}
