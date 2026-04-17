'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { drivers } from '@/lib/db/schema/fleet';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  phone: z
    .string()
    .max(32)
    .optional()
    .transform((v) => (v && v.trim() !== '' ? v.trim() : undefined)),
  licenseNo: z
    .string()
    .max(64)
    .optional()
    .transform((v) => (v && v.trim() !== '' ? v.trim() : undefined)),
  active: z
    .string()
    .optional()
    .transform((v) => v === 'on'),
});

export type AddDriverState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function addDriverAction(
  _prev: AddDriverState,
  formData: FormData,
): Promise<AddDriverState> {
  const session = await requireRole('owner', 'admin', 'ops');

  const parsed = schema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone') ?? undefined,
    licenseNo: formData.get('licenseNo') ?? undefined,
    active: formData.get('active') ?? undefined,
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const d = parsed.data;

  try {
    await db.insert(drivers).values({
      orgId: session.orgId,
      name: d.name,
      phone: d.phone,
      licenseNo: d.licenseNo,
      active: d.active,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to add driver';
    return { error: message };
  }

  revalidatePath('/dashboard/fleet');
  redirect('/dashboard/fleet');
}
