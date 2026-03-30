import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://celpipaicoach.com'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/map'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Save referral source from localStorage via client-side redirect
      // We redirect to /auth/callback/save-ref which reads localStorage and saves it
      return NextResponse.redirect(`${SITE_URL}/auth/callback/save-ref?next=${encodeURIComponent(next)}`)
    }
  }

  return NextResponse.redirect(`${SITE_URL}/auth/login?error=Could not authenticate`)
}
