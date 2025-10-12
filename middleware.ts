
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// The routes that require authentication
const protectedRoutes = ['/profile', '/pickup-request', '/profile/history'];

export function middleware(request: NextRequest) {
  // Get the refresh token from the cookies
  const refreshToken = request.cookies.get('refresh_token');
  const { pathname } = request.nextUrl;

  // Check if the user is trying to access a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // If the route is protected and there's no refresh token, redirect to the homepage
  if (isProtectedRoute && !refreshToken) {
    // You can optionally add a query param to indicate a redirect,
    // which your login modal could use to show a message.
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(url);
  }

  // If the user is authenticated or the route is not protected, continue
  return NextResponse.next();
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (your static images)
     * - logo-compact.svg (your logo)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|logo-compact.svg).*)',
  ],
};
