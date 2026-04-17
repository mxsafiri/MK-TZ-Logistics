import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { requireRole } from '@/lib/auth/session';
import { AddTruckForm } from './add-truck-form';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Add Truck' };

function initialsFrom(name: string | null, email: string): string {
  const source = (name ?? email).trim();
  if (!source) return '?';
  const parts = source.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default async function AddTruckPage() {
  const session = await requireRole('owner', 'admin', 'ops');

  const user = {
    name: session.displayName ?? session.email,
    email: session.email,
    role: session.role,
    orgName: session.orgName,
    initials: initialsFrom(session.displayName, session.email),
  };

  return (
    <DashboardShell user={user}>
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/fleet"
          className="flex items-center gap-1.5 rounded-lg border border-border bg-background/40 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
        >
          <ArrowLeftIcon className="h-3 w-3" />
          Back
        </Link>
        <div>
          <h2 className="text-lg font-semibold">Add Truck</h2>
          <p className="text-xs text-muted-foreground">
            Register a new vehicle in your fleet.
          </p>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <AddTruckForm />
      </div>
    </DashboardShell>
  );
}
