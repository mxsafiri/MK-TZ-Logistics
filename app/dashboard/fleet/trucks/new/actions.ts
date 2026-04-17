'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { trucks } from '@/lib/db/schema/fleet';

const schema = z.object({
  plateNumber: z.string().min(1, 'Plate number is required').max(32),
  make: z
    .string()
    .max(64)
    .optional()
    .transform((v) => (v && v.trim() !== '' ? v.trim() : undefined)),
  model: z
    .string()
    .max(64)
    .optional()
    .transform((v) => (v && v.trim() !== '' ? v.trim() : undefined)),
  capacityKg: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() !== '' ? Number(v) : undefined))
    .refine((v) => v === undefined || (Number.isFinite(v) && v > 0), 'Invalid capacity'),
  vehicleType: z
    .string()
    .max(32)
    .optional()
    .transform((v) => (v && v.trim() !== '' ? v.trim() : undefined)),
  active: z
    .string()
    .optional()
    .transform((v) => v === 'on'),
});

export type AddTruckState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function addTruckAction(
  _prev: AddTruckState,
  formData: FormData,
): Promise<AddTruckState> {
  const session = await requireRole('owner', 'admin', 'ops');

  const parsed = schema.safeParse({
    plateNumber: formData.get('plateNumber'),
    make: formData.get('make') ?? undefined,
    model: formData.get('model') ?? undefined,
    capacityKg: formData.get('capacityKg') ?? undefined,
    vehicleType: formData.get('vehicleType') ?? undefined,
    active: formData.get('active') ?? undefined,
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const d = parsed.data;

  try {
    await db.insert(trucks).values({
      orgId: session.orgId,
      plateNumber: d.plateNumber,
      make: d.make,
      model: d.model,
      capacityKg: d.capacityKg,
      vehicleType: d.vehicleType,
      active: d.active,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to add truck';
    if (message.includes('trucks_org_plate_idx')) {
      return { error: 'A truck with this plate number already exists' };
    }
    return { error: message };
  }

  revalidatePath('/dashboard/fleet');
  redirect('/dashboard/fleet');
}
