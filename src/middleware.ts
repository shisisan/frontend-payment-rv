import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the token from the cookies
  const token = request.cookies.get('auth_token')?.value || ''
  const isAuthenticated = !!token
  
  // Debug log - visible in server console
  console.log(`[Middleware] Path: ${request.nextUrl.pathname}`)
  console.log(`[Middleware] Auth token in cookies: ${token ? 'Yes' : 'No'}`)
  console.log(`[Middleware] isAuthenticated: ${isAuthenticated}`)
  
  // Define protected routes
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard')
  const isAuthCallback = request.nextUrl.pathname.startsWith('/auth/callback')
  
  // Don't redirect auth callback routes
  if (isAuthCallback) {
    return NextResponse.next()
  }
  
  // If the route is protected and the user is not authenticated, redirect to the login page
  if (isProtectedRoute && !isAuthenticated) {
    console.log(`[Middleware] Redirecting to / from ${request.nextUrl.pathname}`)
    return NextResponse.redirect(new URL('/', request.url))
  }

  /* Auto redirect to dashboard disabled
  // If the user is authenticated and trying to access the login page, redirect to the dashboard
  if (isAuthenticated && request.nextUrl.pathname === '/') {
    console.log(`[Middleware] Redirecting to /dashboard from ${request.nextUrl.pathname}`)
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  */

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/auth/callback/:path*'],
} 