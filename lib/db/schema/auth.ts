import { pgTable, text, timestamp, uuid, varchar, pgEnum, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

/**
 * NEON AUTH NOTE
 * --------------
 * Neon Auth (Stack Auth) automatically provisions a `neon_auth.users_sync` table
 * in your database that mirrors all authenticated users. We do NOT define that
 * table here — Neon manages it. We reference it by its Stack user ID (a text uuid)
 * in `organization_members.user_id`.
 *
 * To query a user's profile from your app, use the Stack server SDK
 * (`stackServerApp.getUser(...)`) or join against `neon_auth.users_sync`.
 */

export const memberRoleEnum = pgEnum('member_role', [
  'owner',
  'admin',
  'ops',
  'accountant',
  'driver',
  'viewer',
]);

export const memberStatusEnum = pgEnum('member_status', [
  'active',
  'suspended',
]);

export const invitationStatusEnum = pgEnum('invitation_status', [
  'pending',
  'accepted',
  'revoked',
  'expired',
]);

/**
 * Organizations — the tenant boundary. Every business object is scoped to one org.
 * MK-TZ Logistics is one organization. The product is multi-tenant from day one.
 */
export const organizations = pgTable(
  'organizations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 100 }).notNull(),
    baseCurrency: varchar('base_currency', { length: 3 }).notNull().default('TZS'),
    logoUrl: text('logo_url'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugIdx: uniqueIndex('organizations_slug_idx').on(t.slug),
  }),
);

/**
 * Organization members — links Stack Auth users to organizations with a role.
 * `userId` references `neon_auth.users_sync.id` (managed by Neon Auth).
 */
export const organizationMembers = pgTable(
  'organization_members',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull(), // Stack Auth user id (text uuid)
    role: memberRoleEnum('role').notNull().default('viewer'),
    status: memberStatusEnum('status').notNull().default('active'),
    joinedAt: timestamp('joined_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    orgUserIdx: uniqueIndex('organization_members_org_user_idx').on(t.orgId, t.userId),
    userIdx: index('organization_members_user_idx').on(t.userId),
  }),
);

/**
 * Invitations — pending invites for new users to join an organization.
 * The token is hashed; only the hash is stored. The plaintext is sent via email once.
 */
export const invitations = pgTable(
  'invitations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    email: varchar('email', { length: 320 }).notNull(),
    role: memberRoleEnum('role').notNull(),
    tokenHash: text('token_hash').notNull(),
    invitedBy: text('invited_by').notNull(), // Stack Auth user id
    status: invitationStatusEnum('status').notNull().default('pending'),
    expiresAt: timestamp('expires_at', { withTimezone: true })
      .notNull()
      .default(sql`now() + interval '7 days'`),
    acceptedAt: timestamp('accepted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    orgEmailIdx: index('invitations_org_email_idx').on(t.orgId, t.email),
    tokenIdx: uniqueIndex('invitations_token_hash_idx').on(t.tokenHash),
  }),
);

export const organizationsRelations = relations(organizations, ({ many }) => ({
  members: many(organizationMembers),
  invitations: many(invitations),
}));

export const organizationMembersRelations = relations(organizationMembers, ({ one }) => ({
  organization: one(organizations, {
    fields: [organizationMembers.orgId],
    references: [organizations.id],
  }),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  organization: one(organizations, {
    fields: [invitations.orgId],
    references: [organizations.id],
  }),
}));
