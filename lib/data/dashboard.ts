import 'server-only';
import { and, desc, eq, gte, lte, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { trips, payments, tripBatches } from '@/lib/db/schema/trips';
import { trucks, drivers } from '@/lib/db/schema/fleet';
import type { CurrencyCode } from '@/lib/money';

export interface DashboardRange {
  orgId: string;
  from: Date;
  to: Date;
}

/**
 * KPI snapshot for the given org + date range.
 *
 * All money values are returned in minor units of the org's base currency,
 * converted at each trip's snapshotted FX rate for stable historical totals.
 */
export async function getDashboardKpis({ orgId, from, to }: DashboardRange) {
  const rows = await db
    .select({
      totalTrips: sql<number>`count(*)::int`,
      activeTrips: sql<number>`count(*) filter (where ${trips.status} in ('planned','in_transit'))::int`,
      offloadedTrips: sql<number>`count(*) filter (where ${trips.status} in ('offloaded','completed'))::int`,
      // Convert to base currency at the snapshotted FX rate; coerce bigint → numeric → bigint
      revenueBaseMinor: sql<string>`coalesce(sum((${trips.totalMinor})::numeric * ${trips.fxRateToBase}), 0)::bigint::text`,
      paidBaseMinor: sql<string>`coalesce(sum((${trips.totalMinor})::numeric * ${trips.fxRateToBase}) filter (where ${trips.paymentStatus} = 'paid'), 0)::bigint::text`,
      pendingBaseMinor: sql<string>`coalesce(sum((${trips.totalMinor})::numeric * ${trips.fxRateToBase}) filter (where ${trips.paymentStatus} in ('pending','partial')), 0)::bigint::text`,
      overdueBaseMinor: sql<string>`coalesce(sum((${trips.totalMinor})::numeric * ${trips.fxRateToBase}) filter (where ${trips.paymentStatus} = 'overdue'), 0)::bigint::text`,
    })
    .from(trips)
    .where(
      and(
        eq(trips.orgId, orgId),
        gte(trips.tripDate, from.toISOString().slice(0, 10)),
        lte(trips.tripDate, to.toISOString().slice(0, 10)),
      ),
    );

  const r = rows[0];
  return {
    totalTrips: r?.totalTrips ?? 0,
    activeTrips: r?.activeTrips ?? 0,
    offloadedTrips: r?.offloadedTrips ?? 0,
    revenueBaseMinor: BigInt(r?.revenueBaseMinor ?? '0'),
    paidBaseMinor: BigInt(r?.paidBaseMinor ?? '0'),
    pendingBaseMinor: BigInt(r?.pendingBaseMinor ?? '0'),
    overdueBaseMinor: BigInt(r?.overdueBaseMinor ?? '0'),
  };
}

/**
 * Active drivers + trucks — fleet size shown in the KPI strip.
 */
export async function getFleetCounts(orgId: string) {
  const [truckRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(trucks)
    .where(and(eq(trucks.orgId, orgId), eq(trucks.active, true)));

  const [driverRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(drivers)
    .where(and(eq(drivers.orgId, orgId), eq(drivers.active, true)));

  return {
    activeTrucks: truckRow?.count ?? 0,
    activeDrivers: driverRow?.count ?? 0,
  };
}

export interface TripRow {
  id: string;
  tripDate: string;
  truckPlate: string | null;
  driverName: string | null;
  deliveryNoteNo: string | null;
  cargoDescription: string | null;
  origin: string | null;
  destination: string | null;
  totalMinor: bigint;
  currency: CurrencyCode;
  status: string;
  paymentStatus: string;
}

/**
 * Most-recent trips for the trips table. Joined with trucks and drivers to
 * materialize plate + name. Ordered by trip date desc, then creation desc.
 */
export async function getRecentTrips({
  orgId,
  limit = 20,
}: {
  orgId: string;
  limit?: number;
}): Promise<TripRow[]> {
  const rows = await db
    .select({
      id: trips.id,
      tripDate: trips.tripDate,
      truckPlate: trucks.plateNumber,
      driverName: drivers.name,
      deliveryNoteNo: trips.deliveryNoteNo,
      cargoDescription: trips.cargoDescription,
      origin: trips.origin,
      destination: trips.destination,
      totalMinor: trips.totalMinor,
      currency: trips.currency,
      status: trips.status,
      paymentStatus: trips.paymentStatus,
    })
    .from(trips)
    .leftJoin(trucks, eq(trucks.id, trips.truckId))
    .leftJoin(drivers, eq(drivers.id, trips.driverId))
    .where(eq(trips.orgId, orgId))
    .orderBy(desc(trips.tripDate), desc(trips.createdAt))
    .limit(limit);

  return rows.map((r) => ({
    id: r.id,
    tripDate: r.tripDate,
    truckPlate: r.truckPlate,
    driverName: r.driverName,
    deliveryNoteNo: r.deliveryNoteNo,
    cargoDescription: r.cargoDescription,
    origin: r.origin,
    destination: r.destination,
    totalMinor: (r.totalMinor ?? 0n) as bigint,
    currency: (r.currency as CurrencyCode) ?? 'TZS',
    status: r.status,
    paymentStatus: r.paymentStatus,
  }));
}

/**
 * Payment summary by status — drives the PaymentTracker widget.
 * Returns counts and base-currency totals for each status bucket.
 */
export async function getPaymentSummary({ orgId, from, to }: DashboardRange) {
  const rows = await db
    .select({
      status: trips.paymentStatus,
      count: sql<number>`count(*)::int`,
      totalBaseMinor: sql<string>`coalesce(sum((${trips.totalMinor})::numeric * ${trips.fxRateToBase}), 0)::bigint::text`,
    })
    .from(trips)
    .where(
      and(
        eq(trips.orgId, orgId),
        gte(trips.tripDate, from.toISOString().slice(0, 10)),
        lte(trips.tripDate, to.toISOString().slice(0, 10)),
      ),
    )
    .groupBy(trips.paymentStatus);

  const summary: Record<string, { count: number; totalBaseMinor: bigint }> = {
    pending: { count: 0, totalBaseMinor: 0n },
    partial: { count: 0, totalBaseMinor: 0n },
    paid: { count: 0, totalBaseMinor: 0n },
    overdue: { count: 0, totalBaseMinor: 0n },
  };
  for (const r of rows) {
    summary[r.status] = {
      count: r.count,
      totalBaseMinor: BigInt(r.totalBaseMinor ?? '0'),
    };
  }
  return summary;
}

/**
 * Carrier (truck) breakdown — drives the CarriersDonut widget.
 * Returns top N trucks by trip count in the period, plus an "Others" bucket.
 */
export async function getCarrierBreakdown({
  orgId,
  from,
  to,
  topN = 5,
}: DashboardRange & { topN?: number }) {
  const rows = await db
    .select({
      truckId: trips.truckId,
      plateNumber: trucks.plateNumber,
      tripCount: sql<number>`count(*)::int`,
    })
    .from(trips)
    .leftJoin(trucks, eq(trucks.id, trips.truckId))
    .where(
      and(
        eq(trips.orgId, orgId),
        gte(trips.tripDate, from.toISOString().slice(0, 10)),
        lte(trips.tripDate, to.toISOString().slice(0, 10)),
      ),
    )
    .groupBy(trips.truckId, trucks.plateNumber)
    .orderBy(desc(sql`count(*)`));

  const total = rows.reduce((sum, r) => sum + r.tripCount, 0);
  const top = rows.slice(0, topN).map((r) => ({
    label: r.plateNumber ?? 'Unassigned',
    count: r.tripCount,
    pct: total > 0 ? Math.round((r.tripCount / total) * 100) : 0,
  }));
  const othersCount = rows.slice(topN).reduce((sum, r) => sum + r.tripCount, 0);
  if (othersCount > 0) {
    top.push({
      label: 'Others',
      count: othersCount,
      pct: total > 0 ? Math.round((othersCount / total) * 100) : 0,
    });
  }

  return { total, segments: top };
}

/**
 * Current month range — helper for the default dashboard window.
 */
export function currentMonthRange(): { from: Date; to: Date } {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return { from, to };
}
