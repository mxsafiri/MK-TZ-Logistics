'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/lib/auth/neon';
import { createOrganizationForUser, slugify } from '@/lib/auth/provision';
import { db } from '@/lib/db';
import { organizations } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const schema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters').max(120),
  baseCurrency: z.enum(['TZS', 'USD']).default('TZS'),
});

export type OnboardingState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createOrgAction(
  _prev: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const { data } = await auth.getSession();
  const user = data?.user;
  if (!user) {
    redirect('/auth/sign-in');
  }

  const parsed = schema.safeParse({
    name: formData.get('name'),
    baseCurrency: formData.get('baseCurrency') ?? 'TZS',
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  // Derive a unique slug. If the preferred slug is already taken, append a
  // short random suffix. The `organizations.slug` column has a unique index so
  // races fall back to a retry.
  const preferred = slugify(parsed.data.name);
  let slug = preferred || `org-${Date.now().toString(36)}`;
  const existing = await db
    .select({ id: organizations.id })
    .from(organizations)
    .where(eq(organizations.slug, slug))
    .limit(1);
  if (existing.length > 0) {
    slug = `${preferred}-${Math.random().toString(36).slice(2, 6)}`;
  }

  try {
    await createOrganizationForUser({
      userId: user.id,
      name: parsed.data.name,
      slug,
      baseCurrency: parsed.data.baseCurrency,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to create organization';
    return { error: message };
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}
