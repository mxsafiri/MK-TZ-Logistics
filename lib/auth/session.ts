import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { and, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { organizationMembers, organizations } from '@/lib/db/schema';
import { auth } from './neon';

export type MemberRole =
  | 'owner'
  | 'admin'
  | 'ops'
  | 'accountant'
  | 'driver'
  | 'viewer';

export interface AuthedSession {
  userId: string;
  email: string;
  displayName: string | null;
  orgId: string;
  orgSlug: string;
  orgName: string;
  baseCurrency: string;
  role: MemberRole;
}

/**
 * Resolve the current Stack Auth user, then look up their active org membership.
 *
 * Cached per-request via React `cache()` so multiple Server Components on the
 * same page hit the DB only once.
 *
 * Returns `null` if the user is not signed in OR has no active membership in any
 * org. Routes that require auth should call `requireSession()` instead.
 */
export const getSession = cache(async (): Promise<AuthedSession | null> => {
  const { data } = await auth.getSession();
  const user = data?.user;
  if (!user) return null;

  // Pick the user's active org membership. For users that belong to multiple
  // orgs we currently take the first; org switching is a follow-up feature.
  const rows = await db
    .select({
      orgId: organizations.id,
      orgSlug: organizations.slug,
      orgName: organizations.name,
      baseCurrency: organizations.baseCurrency,
      role: organizationMembers.role,
    })
    .from(organizationMembers)
    .innerJoin(organizations, eq(organizations.id, organizationMembers.orgId))
    .where(
      and(
        eq(organizationMembers.userId, user.id),
        eq(organizationMembers.status, 'active'),
      ),
    )
    .limit(1);

  const membership = rows[0];
  if (!membership) {
    return {
      userId: user.id,
      email: user.email ?? '',
      displayName: user.name ?? null,
      orgId: '',
      orgSlug: '',
      orgName: '',
      baseCurrency: 'TZS',
      // No org yet — caller must redirect to onboarding.
      role: 'viewer' as MemberRole,
    } satisfies AuthedSession & { orgId: '' };
  }

  return {
    userId: user.id,
    email: user.email ?? '',
    displayName: user.name ?? null,
    ...membership,
  };
});

/**
 * Require a fully-onboarded session (signed in AND member of an org).
 * Redirects to sign-in if not authed, or to /onboarding if no org yet.
 */
export async function requireSession(): Promise<AuthedSession> {
  const session = await getSession();
  if (!session) redirect('/auth/sign-in');
  if (!session.orgId) redirect('/onboarding');
  return session;
}

/**
 * Role-based authorization. Throws (caught by Next error boundary) if the
 * current user does not have at least one of the allowed roles.
 */
export async function requireRole(
  ...allowed: MemberRole[]
): Promise<AuthedSession> {
  const session = await requireSession();
  if (!allowed.includes(session.role)) {
    throw new Error(
      `Forbidden: requires one of [${allowed.join(', ')}], have ${session.role}`,
    );
  }
  return session;
}

/**
 * Capability checks — single source of truth for "what can this role do?"
 * Keep this list in sync with the role table in the README.
 */
export const can = {
  manageBilling: (role: MemberRole) => role === 'owner',
  manageMembers: (role: MemberRole) => role === 'owner' || role === 'admin',
  manageFleet: (role: MemberRole) =>
    role === 'owner' || role === 'admin' || role === 'ops',
  createTrip: (role: MemberRole) =>
    role === 'owner' || role === 'admin' || role === 'ops',
  editTrip: (role: MemberRole) =>
    role === 'owner' || role === 'admin' || role === 'ops',
  deleteTrip: (role: MemberRole) => role === 'owner' || role === 'admin',
  recordPayment: (role: MemberRole) =>
    role === 'owner' || role === 'admin' || role === 'accountant',
  viewFinancials: (role: MemberRole) =>
    role === 'owner' || role === 'admin' || role === 'ops' || role === 'accountant',
  markOffloaded: (role: MemberRole) =>
    role === 'owner' || role === 'admin' || role === 'ops' || role === 'driver',
};
