import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  integer,
  boolean,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { organizations } from './auth';

/**
 * Trucks — the org's fleet vehicles.
 */
export const trucks = pgTable(
  'trucks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    plateNumber: varchar('plate_number', { length: 32 }).notNull(),
    make: varchar('make', { length: 64 }),
    model: varchar('model', { length: 64 }),
    capacityKg: integer('capacity_kg'),
    vehicleType: varchar('vehicle_type', { length: 32 }), // truck | trailer | van | other
    active: boolean('active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    orgPlateIdx: uniqueIndex('trucks_org_plate_idx').on(t.orgId, t.plateNumber),
    orgIdx: index('trucks_org_idx').on(t.orgId),
  }),
);

/**
 * Drivers — staff members who operate trucks.
 * `userId` is nullable: a driver record can exist before the person has a login.
 * When the org owner invites them as a `driver` role, this gets linked to their
 * Stack Auth user id, and they gain access to trips assigned to them.
 */
export const drivers = pgTable(
  'drivers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    userId: text('user_id'), // Stack Auth user id, optional
    name: varchar('name', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 32 }),
    licenseNo: varchar('license_no', { length: 64 }),
    active: boolean('active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    orgIdx: index('drivers_org_idx').on(t.orgId),
    userIdx: index('drivers_user_idx').on(t.userId),
  }),
);

/**
 * Routes — reusable origin → destination definitions with default distance & rates.
 * Snapshots of distance/rate are still stored on the trip itself.
 */
export const routes = pgTable(
  'routes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    origin: varchar('origin', { length: 128 }).notNull(),
    destination: varchar('destination', { length: 128 }).notNull(),
    distanceKm: integer('distance_km').notNull(),
    defaultRateMinor: text('default_rate_minor'), // bigint stored as text for safety
    defaultCurrency: varchar('default_currency', { length: 3 }),
    active: boolean('active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    orgIdx: index('routes_org_idx').on(t.orgId),
  }),
);

/**
 * Clients — the customers we're hauling cargo for. Inferred from PO numbers in the
 * spreadsheet but worth modeling so we can track per-client revenue, terms, etc.
 */
export const clients = pgTable(
  'clients',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    contactName: varchar('contact_name', { length: 255 }),
    contactPhone: varchar('contact_phone', { length: 32 }),
    contactEmail: varchar('contact_email', { length: 320 }),
    paymentTermsDays: integer('payment_terms_days').notNull().default(30),
    notes: text('notes'),
    active: boolean('active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    orgIdx: index('clients_org_idx').on(t.orgId),
  }),
);

export const trucksRelations = relations(trucks, ({ one }) => ({
  organization: one(organizations, {
    fields: [trucks.orgId],
    references: [organizations.id],
  }),
}));

export const driversRelations = relations(drivers, ({ one }) => ({
  organization: one(organizations, {
    fields: [drivers.orgId],
    references: [organizations.id],
  }),
}));

export const routesRelations = relations(routes, ({ one }) => ({
  organization: one(organizations, {
    fields: [routes.orgId],
    references: [organizations.id],
  }),
}));

export const clientsRelations = relations(clients, ({ one }) => ({
  organization: one(organizations, {
    fields: [clients.orgId],
    references: [organizations.id],
  }),
}));
