'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { and, eq } from 'drizzle-orm';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { trips } from '@/lib/db/schema/trips';
import { majorToMinor, type CurrencyCode } from '@/lib/money';

const editSchema = z.object({
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
  paymentStatus: z.enum(['pending', 'partial', 'paid', 'overdue']).default('pending'),
});

export type EditTripState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function editTripAction(
  tripId: string,
  _prev: EditTripState,
  formData: FormData,
): Promise<EditTripState> {
  const session = await requireRole('owner', 'admin', 'ops');

  const parsed = editSchema.safeParse({
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
    paymentStatus: formData.get('paymentStatus') ?? 'pending',
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const d = parsed.data;
  const currency = d.currency as CurrencyCode;

  try {
    const result = await db
      .update(trips)
      .set({
        tripDate: d.tripDate,
        truckId: d.truckId ?? null,
        driverId: d.driverId ?? null,
        deliveryNoteNo: d.deliveryNoteNo,
        cargoDescription: d.cargoDescription,
        origin: d.origin,
        destination: d.destination,
        distanceKm: d.distanceKm,
        currency,
        freightAdvanceMinor: majorToMinor(d.freightAdvance, currency),
        freightCompleteMinor: majorToMinor(d.freightComplete, currency),
        status: d.status,
        paymentStatus: d.paymentStatus,
        poNumber: d.poNumber,
        notes: d.notes,
        updatedAt: new Date(),
      })
      .where(and(eq(trips.id, tripId), eq(trips.orgId, session.orgId)))
      .returning({ id: trips.id });

    if (result.length === 0) {
      return { error: 'Trip not found or you do not have access' };
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to update trip' };
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function deleteTripAction(tripId: string): Promise<{ error?: string }> {
  const session = await requireRole('owner', 'admin');

  const result = await db
    .delete(trips)
    .where(and(eq(trips.id, tripId), eq(trips.orgId, session.orgId)))
    .returning({ id: trips.id });

  if (result.length === 0) {
    return { error: 'Trip not found or you do not have access' };
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}
