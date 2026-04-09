import { auth } from '@/lib/auth/neon';

/**
 * Neon Auth API handler.
 *
 * Proxies all auth requests (sign-in, sign-up, session, OAuth callbacks, etc.)
 * from the browser to the Neon Auth server, handling cookies and session
 * caching automatically.
 */
export const { GET, POST, PUT, DELETE, PATCH } = auth.handler();
