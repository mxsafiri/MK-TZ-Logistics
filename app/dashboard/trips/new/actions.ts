'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { and, eq } from 'drizzle-orm';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { trips } from '@/lib/db/schema/trips';
import { trucks, drivers } from '@/lib/db/schema/fleet';
import { majorToMinor, type CurrencyCode } from '@/lib/money';

const schema = z.object({
  tripDate: z.string().min(1, 'Trip date is required'),
  truckId: z.string().uuid().optional().or(z.literal('').transform(() => undefined)),
  driverId: z.string().uuid().optional().or(z.literal('').transform(() => undefined)),
  deliveryNoteNo: z.string().max(64).optional(),
  cargoDescription: z.string().max(255).optional(),
  origin: z.string().max(128).optional(),
  destination: z.string().max(128).optional(),
  distanceKm: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() !== '' ? Number(v) : undefined))
    .refine((v) => v === undefined || (Number.isFinite(v) && v >= 0), 'Invalid distance'),
  currency: z.enum(['TZS', 'USD']).default('TZS'),
  freightAdvance: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() !== '' ? Number(v) : 0))
    .refine((v) => Number.isFinite(v) && v >= 0, 'Invalid advance amount'),
  freightComplete: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() !== '' ? Number(v) : 0))
    .refine((v) => Number.isFinite(v) && v >= 0, 'Invalid completion amount'),
  poNumber: z.string().max(64).optional(),
  notes: z.string().optional(),
  status: z.enum(['planned', 'in_transit', 'offloaded', 'completed', 'cancelled']).default('planned'),
});

export type NewTripState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createTripAction(
  _prev: NewTripState,
  formData: FormData,
): Promise<NewTripState> {
  // RBAC: only owner/admin/ops can create trips.
  const session = await requireRole('owner', 'admin', 'ops');

  const parsed = schema.safeParse({
    tripDate: formData.get('tripDate'),
    truckId: formData.get('truckId') ?? undefined,
    driverId: formData.get('driverId') ?? undefined,
    deliveryNoteNo: formData.get('deliveryNoteNo') ?? undefined,
    cargoDescription: formData.get('cargoDescription') ?? undefined,
    origin: formData.get('origin') ?? undefined,
    destination: formData.get('destination') ?? undefined,
    distanceKm: formData.get('distanceKm') ?? undefined,
    currency: formData.get('currency') ?? 'TZS',
    freightAdvance: formData.get('freightAdvance') ?? '0',
    freightComplete: formData.get('freightComplete') ?? '0',
    poNumber: formData.get('poNumber') ?? undefined,
    notes: formData.get('notes') ?? undefined,
    status: formData.get('status') ?? 'planned',
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const d = parsed.data;

  // Validate that truck/driver belong to this org (defence against tampered IDs).
  if (d.truckId) {
    const [t] = await db
      .select({ id: trucks.id })
      .from(trucks)
      .where(and(eq(trucks.id, d.truckId), eq(trucks.orgId, session.orgId)))
      .limit(1);
    if (!t) return { error: 'Selected truck does not belong to your organization' };
  }
  if (d.driverId) {
    const [dr] = await db
      .select({ id: drivers.id })
      .from(drivers)
      .where(and(eq(drivers.id, d.driverId), eq(drivers.orgId, session.orgId)))
      .limit(1);
    if (!dr) return { error: 'Selected driver does not belong to your organization' };
  }

  const currency = d.currency as CurrencyCode;
  const advanceMinor = majorToMinor(d.freightAdvance, currency);
  const completeMinor = majorToMinor(d.freightComplete, currency);

  // FX snapshot. For now if the trip currency matches the org base currency we
  // store 1; cross-currency trips pick up a rate from the exchange_rates table
  // in a follow-up (daily sync cron).
  const fxRateToBase = currency === session.baseCurrency ? '1' : '1';

  try {
    await db.insert(trips).values({
      orgId: session.orgId,
      tripDate: d.tripDate,
      truckId: d.truckId,
      driverId: d.driverId,
      deliveryNoteNo: d.deliveryNoteNo,
      cargoDescription: d.cargoDescription,
      origin: d.origin,
      destination: d.destination,
      distanceKm: d.distanceKm,
      currency,
      freightAdvanceMinor: advanceMinor,
      freightCompleteMinor: completeMinor,
      fxRateToBase,
      status: d.status,
      paymentStatus:
        advanceMinor > 0n && completeMinor === 0n
          ? 'partial'
          : advanceMinor + completeMinor > 0n && d.status === 'completed'
            ? 'paid'
            : 'pending',
      poNumber: d.poNumber,
      notes: d.notes,
      createdBy: session.userId,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to save trip';
    return { error: message };
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}
