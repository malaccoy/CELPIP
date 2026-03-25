import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/callback',
  '/auth/register',
  '/auth/verify',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/terms',
  '/privacy',
  '/pricing',
]

// Route prefixes that don't require authentication (SEO + free content)
const publicPrefixes = [
  '/start',
  '/blog',
  '/listening',
  '/reading',
  '/writing',
  '/speaking',
  '/tools',
  '/api/welcome-email',
  '/api/stripe',
  '/api/notifications',
  '/api/battle-transcribe',
  '/api/battle-stats',
  '/api/unsubscribe',
  '/api/tts',
  '/api/trial-speaking',
  '/unsubscribe',
  '/battle',
]

// Routes that always need auth
const protectedPrefixes = [
  '/dashboard',
  '/profile',
  '/progress',
  '/ai-coach',
  '/mock-exam',
  '/weakness-report',
]

function isPublicRoute(pathname: string): boolean {
  if (publicRoutes.includes(pathname)) return true
  if (publicPrefixes.some(prefix => pathname.startsWith(prefix))) return true
  if (pathname.startsWith('/_next') || pathname.startsWith('/api/auth') || pathname.includes('.')) return true
  return false
}

function isProtectedRoute(pathname: string): boolean {
  return protectedPrefixes.some(prefix => pathname.startsWith(prefix))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Single Supabase client for the entire middleware — avoids cookie conflicts
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Always call getUser() to refresh the session token
  // This is what keeps users logged in across requests
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect /register → /auth/register (convenience alias)
  if (pathname === '/register') {
    return NextResponse.redirect(new URL('/auth/register', request.url))
  }

  // Public routes — just refresh session and pass through
  if (isPublicRoute(pathname)) {
    return response
  }

  // Protected routes — redirect to login if not authenticated
  if (isProtectedRoute(pathname) && !user) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // All other routes — if not authenticated, redirect
  if (!user) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3|wav)$).*)',
  ],
}
