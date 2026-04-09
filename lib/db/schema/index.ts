/**
 * Single import surface for the database schema.
 * Drizzle picks up every export from this file when generating migrations.
 */
export * from './auth';
export * from './fleet';
export * from './trips';
export * from './system';
