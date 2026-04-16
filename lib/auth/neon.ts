import 'server-only';
import { createNeonAuth } from '@neondatabase/auth/next/server';
import { env } from '@/lib/env';

/**
 * Neon Auth server instance — powered by Better Auth under the hood.
 *
 * Singleton created from env vars provisioned by Neon when you enable Auth in
 * the Neon Console. Exposes all Better Auth server methods (signIn, signUp,
 * getSession, ...) plus `.handler()` for the API route and `.middleware()` for
 * route protection in `middleware.ts`.
 *
 * Usage:
 *   const { data: session } = await auth.getSession();
 */
export const auth = createNeonAuth({
  baseUrl: env.NEON_AUTH_BASE_URL,
  cookies: {
    secret: env.NEON_AUTH_COOKIE_SECRET,
  },
});
