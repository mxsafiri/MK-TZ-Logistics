import Link from 'next/link';
import {
  TruckIcon,
  UsersIcon,
  PlusIcon,
  ArrowLeftIcon,
  CheckCircle2Icon,
  XCircleIcon,
} from 'lucide-react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { requireSession } from '@/lib/auth/session';
import { listAllTrucks, listAllDrivers } from '@/lib/data/fleet';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Fleet Management' };

function initialsFrom(name: string | null, email: string): string {
  const source = (name ?? email).trim();
  if (!source) return '?';
  const parts = source.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function StatusBadge({ active }: { active: boolean }) {
  if (active) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] font-medium text-green-600 dark:text-green-400">
        <CheckCircle2Icon className="h-3 w-3" />
        Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
      <XCircleIcon className="h-3 w-3" />
      Inactive
    </span>
  );
}

export default async function FleetPage() {
  const session = await requireSession();

  const [allTrucks, allDrivers] = await Promise.all([
    listAllTrucks(session.orgId),
    listAllDrivers(session.orgId),
  ]);

  const user = {
    name: session.displayName ?? session.email,
    email: session.email,
    role: session.role,
    orgName: session.orgName,
    initials: initialsFrom(session.displayName, session.email),
  };

  return (
    <DashboardShell user={user}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 rounded-lg border border-border bg-background/40 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
        >
          <ArrowLeftIcon className="h-3 w-3" />
          Back
        </Link>
        <div>
          <h2 className="text-lg font-semibold">Fleet Management</h2>
          <p className="text-xs text-muted-foreground">
            Manage your trucks and drivers.
          </p>
        </div>
      </div>

      {/* Trucks section */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Trucks</h2>
            <p className="text-xs text-muted-foreground">
              {allTrucks.length} vehicle{allTrucks.length !== 1 ? 's' : ''} registered
            </p>
          </div>
          <Link
            href="/dashboard/fleet/trucks/new"
            className="flex items-center gap-1.5 rounded-lg bg-primary-500 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-600"
          >
            <PlusIcon className="h-3 w-3" />
            Add Truck
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem]">
            <thead>
              <tr className="border-y border-border">
                {['Plate', 'Make', 'Model', 'Type', 'Capacity', 'Status'].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70"
                    >
                      {header}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {allTrucks.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="icon-glow-purple rounded-2xl p-4">
                        <TruckIcon className="h-8 w-8 text-primary-500 dark:text-primary-400" />
                      </div>
                      <p className="mt-4 text-sm text-muted-foreground">
                        No trucks registered yet.
                      </p>
                      <Link
                        href="/dashboard/fleet/trucks/new"
                        className="mt-3 text-xs font-medium text-primary-500 hover:text-primary-600"
                      >
                        Add your first truck
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
              {allTrucks.map((truck) => (
                <tr
                  key={truck.id}
                  className="border-b border-border/50 transition-colors hover:bg-foreground/[0.03]"
                >
                  <td className="px-4 py-3 text-xs font-medium text-foreground">
                    {truck.plateNumber}
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground">
                    {truck.make ?? '--'}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {truck.model ?? '--'}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground capitalize">
                    {truck.vehicleType ?? '--'}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">
                    {truck.capacityKg
                      ? `${truck.capacityKg.toLocaleString()} kg`
                      : '--'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge active={truck.active} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drivers section */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Drivers</h2>
            <p className="text-xs text-muted-foreground">
              {allDrivers.length} driver{allDrivers.length !== 1 ? 's' : ''} registered
            </p>
          </div>
          <Link
            href="/dashboard/fleet/drivers/new"
            className="flex items-center gap-1.5 rounded-lg bg-primary-500 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-600"
          >
            <PlusIcon className="h-3 w-3" />
            Add Driver
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem]">
            <thead>
              <tr className="border-y border-border">
                {['Name', 'Phone', 'License', 'Status'].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allDrivers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="icon-glow-purple rounded-2xl p-4">
                        <UsersIcon className="h-8 w-8 text-primary-500 dark:text-primary-400" />
                      </div>
                      <p className="mt-4 text-sm text-muted-foreground">
                        No drivers registered yet.
                      </p>
                      <Link
                        href="/dashboard/fleet/drivers/new"
                        className="mt-3 text-xs font-medium text-primary-500 hover:text-primary-600"
                      >
                        Add your first driver
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
              {allDrivers.map((driver) => (
                <tr
                  key={driver.id}
                  className="border-b border-border/50 transition-colors hover:bg-foreground/[0.03]"
                >
                  <td className="px-4 py-3 text-xs font-medium text-foreground">
                    {driver.name}
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground">
                    {driver.phone ?? '--'}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {driver.licenseNo ?? '--'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge active={driver.active} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
