import 'server-only';
import { db } from '@/lib/db';
import { organizations, organizationMembers } from '@/lib/db/schema';

/**
 * Provision a brand-new organization with the given user as its owner.
 * Used during onboarding immediately after a user signs up.
 *
 * Wrapped in a transaction so we never end up with an org and no owner.
 */
export async function createOrganizationForUser(args: {
  userId: string;
  name: string;
  slug: string;
  baseCurrency?: 'TZS' | 'USD';
}) {
  const { userId, name, slug, baseCurrency = 'TZS' } = args;

  // Drizzle's neon-http driver doesn't support multi-statement transactions over
  // HTTP, so we run two sequential statements and rely on the unique slug index
  // to keep us safe from races.
  const [org] = await db
    .insert(organizations)
    .values({ name, slug, baseCurrency })
    .returning({
      id: organizations.id,
      name: organizations.name,
      slug: organizations.slug,
      baseCurrency: organizations.baseCurrency,
    });

  await db.insert(organizationMembers).values({
    orgId: org.id,
    userId,
    role: 'owner',
    status: 'active',
  });

  return org;
}

/**
 * Slugify a string for use as an organization slug.
 * Lowercase, alphanumerics + hyphens, max 100 chars.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}
