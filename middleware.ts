import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Routes that REQUIRE authentication (exercise submission, profile, progress)
const protectedPrefixes = [
  '/profile',
  '/progress',
  '/weakness-report',
]

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

  // Static assets and API routes — pass through
  if (pathname.startsWith('/_next') || pathname.startsWith('/api/auth') || pathname.includes('.')) {
    return response
  }

  // Protected routes — redirect to login if not authenticated
  if (isProtectedRoute(pathname) && !user) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Everything else is public — let people browse freely
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3|wav)$).*)',
  ],
}
