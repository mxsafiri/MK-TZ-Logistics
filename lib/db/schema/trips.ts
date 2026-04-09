import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  integer,
  pgEnum,
  index,
  bigint,
  numeric,
  date,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { organizations } from './auth';
import { trucks, drivers, routes, clients } from './fleet';

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending', // not paid yet
  'partial', // some advance recorded
  'paid', // fully settled
  'overdue', // past payment terms
]);

export const tripStatusEnum = pgEnum('trip_status', [
  'planned',
  'in_transit',
  'offloaded',
  'completed',
  'cancelled',
]);

/**
 * Trip batches — groups of trips dispatched together (the "trip 1", "trip 2"
 * sections in MK-TZ's spreadsheet). One batch belongs to one calendar month.
 * Batch totals (sum of trip totals) are computed at query time.
 */
export const tripBatches = pgTable(
  'trip_batches',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    label: varchar('label', { length: 64 }).notNull(), // e.g. "trip 1"
    month: date('month').notNull(), // first day of the month
    notes: text('notes'),
    createdBy: text('created_by').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    orgMonthIdx: index('trip_batches_org_month_idx').on(t.orgId, t.month),
  }),
);

/**
 * Trips — the core entity. Mirrors a row in the MK-TZ spreadsheet plus structure.
 *
 * Money is stored as `bigint` in the smallest unit of the trip's currency.
 * - For TZS, smallest unit is the shilling (TZS has no decimal subunit in practice).
 * - For USD, smallest unit is the cent.
 * Always store the FX rate to the org's base currency at trip creation time so
 * historical reports remain stable when rates change.
 */
export const trips = pgTable(
  'trips',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    batchId: uuid('batch_id').references(() => tripBatches.id, { onDelete: 'set null' }),

    // Core fields (mirroring the spreadsheet)
    tripDate: date('trip_date').notNull(),
    truckId: uuid('truck_id').references(() => trucks.id, { onDelete: 'restrict' }),
    driverId: uuid('driver_id').references(() => drivers.id, { onDelete: 'restrict' }),
    routeId: uuid('route_id').references(() => routes.id, { onDelete: 'set null' }),
    clientId: uuid('client_id').references(() => clients.id, { onDelete: 'set null' }),

    deliveryNoteNo: varchar('delivery_note_no', { length: 64 }),
    cargoDescription: varchar('cargo_description', { length: 255 }),
    origin: varchar('origin', { length: 128 }), // snapshot in case route changes
    destination: varchar('destination', { length: 128 }),
    distanceKm: integer('distance_km'),

    // Money — stored in minor units of `currency`
    currency: varchar('currency', { length: 3 }).notNull().default('TZS'),
    freightAdvanceMinor: bigint('freight_advance_minor', { mode: 'bigint' })
      .notNull()
      .default(sql`0`),
    freightCompleteMinor: bigint('freight_complete_minor', { mode: 'bigint' })
      .notNull()
      .default(sql`0`),
    // Generated total in trip currency
    totalMinor: bigint('total_minor', { mode: 'bigint' })
      .generatedAlwaysAs(
        sql`(freight_advance_minor + freight_complete_minor)`,
      ),

    // FX snapshot — what 1 unit of `currency` is worth in the org's base currency
    // at the time of trip creation. Reports use this for stable aggregation.
    fxRateToBase: numeric('fx_rate_to_base', { precision: 18, scale: 8 })
      .notNull()
      .default(sql`1`),

    status: tripStatusEnum('status').notNull().default('planned'),
    paymentStatus: paymentStatusEnum('payment_status').notNull().default('pending'),

    poNumber: varchar('po_number', { length: 64 }),
    offloadedAt: timestamp('offloaded_at', { withTimezone: true }),
    notes: text('notes'),

    createdBy: text('created_by').notNull(), // Stack Auth user id
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    orgDateIdx: index('trips_org_date_idx').on(t.orgId, t.tripDate),
    orgBatchIdx: index('trips_org_batch_idx').on(t.orgId, t.batchId),
    orgPaymentIdx: index('trips_org_payment_idx').on(t.orgId, t.paymentStatus),
    truckIdx: index('trips_truck_idx').on(t.truckId),
    driverIdx: index('trips_driver_idx').on(t.driverId),
    poIdx: index('trips_po_idx').on(t.orgId, t.poNumber),
  }),
);

/**
 * Payments — every money movement against a trip. A trip's `paymentStatus` is
 * derived from the sum of its payments vs. its `totalMinor`. Payments give us a
 * full audit trail (who recorded what, when, via which method).
 */
export const payments = pgTable(
  'payments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    tripId: uuid('trip_id')
      .notNull()
      .references(() => trips.id, { onDelete: 'cascade' }),
    amountMinor: bigint('amount_minor', { mode: 'bigint' }).notNull(),
    currency: varchar('currency', { length: 3 }).notNull(),
    fxRateToBase: numeric('fx_rate_to_base', { precision: 18, scale: 8 })
      .notNull()
      .default(sql`1`),
    paidAt: timestamp('paid_at', { withTimezone: true }).notNull(),
    method: varchar('method', { length: 32 }), // bank | mobile_money | cash | cheque
    reference: varchar('reference', { length: 128 }),
    notes: text('notes'),
    recordedBy: text('recorded_by').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    orgTripIdx: index('payments_org_trip_idx').on(t.orgId, t.tripId),
    orgPaidAtIdx: index('payments_org_paid_at_idx').on(t.orgId, t.paidAt),
  }),
);

export const tripBatchesRelations = relations(tripBatches, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [tripBatches.orgId],
    references: [organizations.id],
  }),
  trips: many(trips),
}));

export const tripsRelations = relations(trips, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [trips.orgId],
    references: [organizations.id],
  }),
  batch: one(tripBatches, {
    fields: [trips.batchId],
    references: [tripBatches.id],
  }),
  truck: one(trucks, {
    fields: [trips.truckId],
    references: [trucks.id],
  }),
  driver: one(drivers, {
    fields: [trips.driverId],
    references: [drivers.id],
  }),
  route: one(routes, {
    fields: [trips.routeId],
    references: [routes.id],
  }),
  client: one(clients, {
    fields: [trips.clientId],
    references: [clients.id],
  }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  organization: one(organizations, {
    fields: [payments.orgId],
    references: [organizations.id],
  }),
  trip: one(trips, {
    fields: [payments.tripId],
    references: [trips.id],
  }),
}));
