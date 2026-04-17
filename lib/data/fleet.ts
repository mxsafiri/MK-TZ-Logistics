import 'server-only';
import { and, asc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { trucks, drivers, routes, clients } from '@/lib/db/schema/fleet';

/**
 * Active trucks for the given org, ordered by plate. Used to populate the
 * truck dropdown on the New Trip form.
 */
export async function listActiveTrucks(orgId: string) {
  return db
    .select({
      id: trucks.id,
      plateNumber: trucks.plateNumber,
      make: trucks.make,
      model: trucks.model,
    })
    .from(trucks)
    .where(and(eq(trucks.orgId, orgId), eq(trucks.active, true)))
    .orderBy(asc(trucks.plateNumber));
}

/**
 * Active drivers for the given org, ordered by name.
 */
export async function listActiveDrivers(orgId: string) {
  return db
    .select({
      id: drivers.id,
      name: drivers.name,
      phone: drivers.phone,
    })
    .from(drivers)
    .where(and(eq(drivers.orgId, orgId), eq(drivers.active, true)))
    .orderBy(asc(drivers.name));
}

export async function listActiveRoutes(orgId: string) {
  return db
    .select({
      id: routes.id,
      origin: routes.origin,
      destination: routes.destination,
      distanceKm: routes.distanceKm,
    })
    .from(routes)
    .where(and(eq(routes.orgId, orgId), eq(routes.active, true)))
    .orderBy(asc(routes.origin));
}

/**
 * All trucks for the given org (active and inactive), ordered by plate number.
 * Used on the fleet management page.
 */
export async function listAllTrucks(orgId: string) {
  return db
    .select({
      id: trucks.id,
      plateNumber: trucks.plateNumber,
      make: trucks.make,
      model: trucks.model,
      capacityKg: trucks.capacityKg,
      vehicleType: trucks.vehicleType,
      active: trucks.active,
      createdAt: trucks.createdAt,
    })
    .from(trucks)
    .where(eq(trucks.orgId, orgId))
    .orderBy(asc(trucks.plateNumber));
}

/**
 * All drivers for the given org (active and inactive), ordered by name.
 * Used on the fleet management page.
 */
export async function listAllDrivers(orgId: string) {
  return db
    .select({
      id: drivers.id,
      name: drivers.name,
      phone: drivers.phone,
      licenseNo: drivers.licenseNo,
      active: drivers.active,
      createdAt: drivers.createdAt,
    })
    .from(drivers)
    .where(eq(drivers.orgId, orgId))
    .orderBy(asc(drivers.name));
}

export async function listActiveClients(orgId: string) {
  return db
    .select({
      id: clients.id,
      name: clients.name,
    })
    .from(clients)
    .where(and(eq(clients.orgId, orgId), eq(clients.active, true)))
    .orderBy(asc(clients.name));
}
