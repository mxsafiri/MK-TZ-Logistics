import { auth } from '@/lib/auth/neon';

/**
 * Auth middleware — powered by Neon Auth (Better Auth under the hood).
 *
 * `auth.middleware()` validates the session cookie at the edge, refreshes it if
 * expired, and redirects unauthenticated users to the configured loginUrl. The
 * matcher below limits it to protected app surfaces so public marketing pages
 * remain unguarded.
 */
export default auth.middleware({ loginUrl: '/auth/sign-in' });

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding/:path*', '/settings/:path*', '/api/protected/:path*'],
};
