'use client';
import { createAuthClient } from '@neondatabase/auth/next';

/**
 * Browser-side auth client.
 *
 * Calls through to our own `/api/auth/*` routes (not the Neon Auth server
 * directly), so cookies and CSRF stay first-party. Exposes `signIn`, `signUp`,
 * `signOut`, and the `useSession` React hook.
 */
export const authClient = createAuthClient();
