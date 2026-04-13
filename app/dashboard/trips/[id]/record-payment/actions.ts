'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { and, eq, sql } from 'drizzle-orm';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { trips, payments } from '@/lib/db/schema/trips';
import { majorToMinor, type CurrencyCode } from '@/lib/money';

const schema = z.object({
  amount: z
    .string()
    .min(1, 'Amount is required')
    .transform((v) => Number(v))
    .refine((v) => Number.isFinite(v) && v > 0, 'Amount must be greater than 0'),
  currency: z.enum(['TZS', 'USD']),
  method: z.enum(['bank', 'mobile_money', 'cash', 'cheque']).optional(),
  reference: z.string().max(128).optional(),
  paidAt: z.string().min(1, 'Payment date is required'),
  notes: z.string().optional(),
});

export type RecordPaymentState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function recordPaymentAction(
  tripId: string,
  _prev: RecordPaymentState,
  formData: FormData,
): Promise<RecordPaymentState> {
  const session = await requireRole('owner', 'admin', 'accountant');

  const parsed = schema.safeParse({
    amount: formData.get('amount'),
    currency: formData.get('currency') ?? 'TZS',
    method: formData.get('method') || undefined,
    reference: formData.get('reference') || undefined,
    paidAt: formData.get('paidAt'),
    notes: formData.get('notes') || undefined,
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  // Verify trip belongs to this org
  const [trip] = await db
    .select({
      id: trips.id,
      totalMinor: trips.totalMinor,
      currency: trips.currency,
      fxRateToBase: trips.fxRateToBase,
    })
    .from(trips)
    .where(and(eq(trips.id, tripId), eq(trips.orgId, session.orgId)))
    .limit(1);

  if (!trip) {
    return { error: 'Trip not found' };
  }

  const d = parsed.data;
  const currency = d.currency as CurrencyCode;
  const amountMinor = majorToMinor(d.amount, currency);

  try {
    // Insert payment record
    await db.insert(payments).values({
      orgId: session.orgId,
      tripId,
      amountMinor,
      currency,
      fxRateToBase: trip.fxRateToBase,
      paidAt: new Date(d.paidAt),
      method: d.method,
      reference: d.reference,
      notes: d.notes,
      recordedBy: session.userId,
    });

    // Sum all payments for this trip and update payment status
    const [{ totalPaid }] = await db
      .select({
        totalPaid: sql<string>`coalesce(sum(${payments.amountMinor}), 0)::bigint::text`,
      })
      .from(payments)
      .where(eq(payments.tripId, tripId));

    const paidMinor = BigInt(totalPaid);
    const tripTotal = trip.totalMinor ?? 0n;

    let newStatus: 'pending' | 'partial' | 'paid' = 'pending';
    if (paidMinor >= tripTotal && tripTotal > 0n) {
      newStatus = 'paid';
    } else if (paidMinor > 0n) {
      newStatus = 'partial';
    }

    await db
      .update(trips)
      .set({ paymentStatus: newStatus, updatedAt: new Date() })
      .where(eq(trips.id, tripId));
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to record payment' };
  }

  revalidatePath('/dashboard');
  redirect(`/dashboard/trips/${tripId}`);
}
