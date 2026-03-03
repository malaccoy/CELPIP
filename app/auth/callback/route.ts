import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://celpipaicoach.com'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Check if this is a password recovery flow
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.recovery_sent_at) {
        return NextResponse.redirect(`${SITE_URL}/auth/reset-password`)
      }
      return NextResponse.redirect(`${SITE_URL}${next}`)
    }
  }

  return NextResponse.redirect(`${SITE_URL}/auth/login?error=Could not authenticate`)
}
