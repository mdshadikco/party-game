import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Allow access to the login page without checks
  if (pathname === '/login') {
    return NextResponse.next();
  }

  // Default: Let all other requests through
  return NextResponse.next();
}

export const config = {
  matcher: [
    /**
     * Match all request paths except the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
