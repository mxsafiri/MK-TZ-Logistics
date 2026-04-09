import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  numeric,
  jsonb,
  date,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';
import { organizations } from './auth';

/**
 * Daily exchange rates. We store the snapshot for each (date, from→to) pair so
 * the trip-creation FX rate is reproducible. A daily cron pulls from a public API
 * (default: exchangerate.host) and inserts new rows. Manual overrides allowed.
 */
export const exchangeRates = pgTable(
  'exchange_rates',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    rateDate: date('rate_date').notNull(),
    fromCurrency: varchar('from_currency', { length: 3 }).notNull(),
    toCurrency: varchar('to_currency', { length: 3 }).notNull(),
    rate: numeric('rate', { precision: 18, scale: 8 }).notNull(),
    source: varchar('source', { length: 64 }).notNull().default('exchangerate.host'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    pairDateIdx: uniqueIndex('exchange_rates_pair_date_idx').on(
      t.rateDate,
      t.fromCurrency,
      t.toCurrency,
    ),
  }),
);

/**
 * Audit log — append-only record of every meaningful mutation. Critical for a
 * production financial product. Diff is stored as a JSON {before, after} blob.
 */
export const auditLog = pgTable(
  'audit_log',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull(), // Stack Auth user id
    entity: varchar('entity', { length: 64 }).notNull(), // e.g. "trip", "payment"
    entityId: uuid('entity_id').notNull(),
    action: varchar('action', { length: 32 }).notNull(), // create | update | delete | restore
    diff: jsonb('diff'),
    ipAddress: varchar('ip_address', { length: 64 }),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    orgEntityIdx: index('audit_log_org_entity_idx').on(t.orgId, t.entity, t.entityId),
    orgCreatedIdx: index('audit_log_org_created_idx').on(t.orgId, t.createdAt),
  }),
);
