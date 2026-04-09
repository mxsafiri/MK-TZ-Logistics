import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

// `generate` only needs the schema; `push`/`migrate`/`studio` need a real URL.
// We pass a placeholder so `generate` works without env vars.
const url =
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.DATABASE_URL ||
  'postgresql://placeholder:placeholder@localhost:5432/placeholder';

export default defineConfig({
  schema: './lib/db/schema/index.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  casing: 'snake_case',
  dbCredentials: { url },
  verbose: true,
  strict: true,
});
