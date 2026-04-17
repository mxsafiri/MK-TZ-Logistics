import Link from 'next/link';
import { PlusIcon } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { TripsTable } from '@/components/dashboard/TripsTable';
import { requireSession } from '@/lib/auth/session';
import { getRecentTrips } from '@/lib/data/dashboard';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'All Trips' };

function initialsFrom(name: string | null, email: string): string {
  const source = (name ?? email).trim();
  if (!source) return '?';
  const parts = source.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default async function TripsPage() {
  const session = await requireSession();
  const trips = await getRecentTrips({ orgId: session.orgId, limit: 100 });

  const user = {
    name: session.displayName ?? session.email,
    email: session.email,
    role: session.role,
    orgName: session.orgName,
    initials: initialsFrom(session.displayName, session.email),
  };

  return (
    <DashboardShell user={user}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">All Trips</h1>
          <p className="text-sm text-muted-foreground">
            {trips.length} trip{trips.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link
          href="/dashboard/trips/new"
          className="flex items-center gap-1.5 rounded-lg bg-primary-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600"
        >
          <PlusIcon className="h-4 w-4" />
          New Trip
        </Link>
      </div>
      <TripsTable trips={trips} />
    </DashboardShell>
  );
}
