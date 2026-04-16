import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/neon';

/**
 * Auth middleware — powered by Neon Auth (Better Auth under the hood).
 *
 * Validates the session cookie, refreshes it if expired, and redirects
 * unauthenticated users to the login page. Only runs on GET/HEAD so
 * server-action POSTs (which do their own auth checks) aren't intercepted.
 */
const neonMiddleware = auth.middleware({ loginUrl: '/auth/sign-in' });

export default async function middleware(request: NextRequest) {
  // Let server actions (POST/PUT/PATCH/DELETE) through — they validate
  // auth themselves via requireSession() / requireRole().
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return NextResponse.next();
  }
  return neonMiddleware(request);
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding/:path*', '/settings/:path*', '/api/protected/:path*'],
};
