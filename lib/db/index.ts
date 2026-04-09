import 'server-only';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { env } from '@/lib/env';
import * as schema from './schema';

/**
 * Neon serverless HTTP driver — works in Node, Edge, and serverless runtimes.
 * Use the POOLED connection string here. Migrations should use the unpooled URL.
 */
const sql = neon(env.DATABASE_URL);

export const db = drizzle(sql, { schema, casing: 'snake_case' });

export type Database = typeof db;
export { schema };
