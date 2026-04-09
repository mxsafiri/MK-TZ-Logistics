import { z } from 'zod';

/**
 * Typed, validated environment access.
 *
 * We split server-only vars from public ones so that secrets cannot be imported
 * from client components. The schemas validate at app boot — a missing or
 * malformed required variable will fail loudly with a clear error.
 *
 * Set `SKIP_ENV_VALIDATION=1` for tooling that doesn't need real env values
 * (e.g. drizzle-kit generate).
 */

const skip = !!process.env.SKIP_ENV_VALIDATION;

const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  DATABASE_URL_UNPOOLED: z.string().url().optional(),
  NEON_AUTH_BASE_URL: z.string().url(),
  NEON_AUTH_COOKIE_SECRET: z.string().min(32, 'NEON_AUTH_COOKIE_SECRET must be at least 32 characters'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  EXCHANGE_RATE_API_KEY: z.string().optional(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:6006'),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
});

// Public values are inlined by Next at build time, so we read them statically.
const clientValues = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
};

function parse<T extends z.ZodTypeAny>(
  schema: T,
  values: Record<string, unknown>,
  label: string,
): z.infer<T> {
  if (skip) {
    // Permissive cast — used by tooling that needs to import this module
    // without real env values present.
    return values as z.infer<T>;
  }
  const result = schema.safeParse(values);
  if (!result.success) {
    const formatted = JSON.stringify(result.error.flatten().fieldErrors, null, 2);
    throw new Error(`Invalid ${label} environment variables:\n${formatted}`);
  }
  return result.data;
}

const isServer = typeof window === 'undefined';

export const env = {
  ...(isServer ? parse(serverSchema, process.env, 'server') : ({} as z.infer<typeof serverSchema>)),
  ...parse(clientSchema, clientValues, 'client'),
};
