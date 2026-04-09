import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

if (!url) {
  console.error('DATABASE_URL must be set in .env.local');
  process.exit(1);
}

async function main() {
  const sql = neon(url!);
  const db = drizzle(sql);

  console.log('▶ Running migrations...');
  await migrate(db, { migrationsFolder: './lib/db/migrations' });
  console.log('✔ Migrations complete');
}

main().catch((err) => {
  console.error('✖ Migration failed:', err);
  process.exit(1);
});
