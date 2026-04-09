import Link from 'next/link';
import { TruckIcon, FilterIcon, PlusIcon } from 'lucide-react';
import { formatMoney } from '@/lib/money';
import type { TripRow } from '@/lib/data/dashboard';

const tripTableColumns = [
  'Date',
  'Truck',
  'Driver',
  'Delivery Note',
  'Cargo',
  'Destination',
  'Total',
  'Status',
  'Payment',
] as const;

const statusBadge: Record<string, string> = {
  planned: 'bg-muted text-muted-foreground',
  in_transit: 'bg-secondary-500/15 text-secondary-600 dark:text-secondary-400',
  offloaded: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  completed: 'bg-green-500/15 text-green-600 dark:text-green-400',
  cancelled: 'bg-red-500/15 text-red-600 dark:text-red-400',
};

const paymentBadge: Record<string, string> = {
  pending: 'bg-muted text-muted-foreground',
  partial: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  paid: 'bg-green-500/15 text-green-600 dark:text-green-400',
  overdue: 'bg-red-500/15 text-red-600 dark:text-red-400',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
  });
}

function humanize(value: string): string {
  return value.replace(/_/g, ' ');
}

interface TripsTableProps {
  trips: TripRow[];
}

export function TripsTable({ trips }: TripsTableProps) {
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Recent Trips</h2>
          <p className="text-xs text-muted-foreground">
            Active and completed deliveries
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-border bg-background/40 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground">
            <FilterIcon className="h-3 w-3" />
            Filter
          </button>
          <Link
            href="/dashboard/trips/new"
            className="flex items-center gap-1.5 rounded-lg bg-primary-500 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-600"
          >
            <PlusIcon className="h-3 w-3" />
            New Trip
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[56rem]">
          <thead>
            <tr className="border-y border-border">
              {tripTableColumns.map((header) => (
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
            {trips.length === 0 && (
              <tr>
                <td
                  colSpan={tripTableColumns.length}
                  className="px-4 py-16 text-center"
                >
                  <div className="flex flex-col items-center">
                    <div className="icon-glow-purple rounded-2xl p-4">
                      <TruckIcon className="h-8 w-8 text-primary-500 dark:text-primary-400" />
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                      No trips recorded yet. New deliveries will show up here.
                    </p>
                    <Link
                      href="/dashboard/trips/new"
                      className="mt-3 text-xs font-medium text-primary-500 hover:text-primary-600"
                    >
                      Add your first trip →
                    </Link>
                  </div>
                </td>
              </tr>
            )}
            {trips.map((trip) => (
              <tr
                key={trip.id}
                className="border-b border-border/50 transition-colors hover:bg-foreground/[0.03]"
              >
                <td className="px-4 py-3 text-xs text-foreground">
                  {formatDate(trip.tripDate)}
                </td>
                <td className="px-4 py-3 text-xs font-medium text-foreground">
                  {trip.truckPlate ?? '—'}
                </td>
                <td className="px-4 py-3 text-xs text-foreground">
                  {trip.driverName ?? '—'}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {trip.deliveryNoteNo ?? '—'}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground max-w-[12rem] truncate">
                  {trip.cargoDescription ?? '—'}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {trip.destination ?? '—'}
                </td>
                <td className="px-4 py-3 text-xs font-semibold text-foreground tabular-nums">
                  {formatMoney(trip.totalMinor, trip.currency)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${
                      statusBadge[trip.status] ?? ''
                    }`}
                  >
                    {humanize(trip.status)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${
                      paymentBadge[trip.paymentStatus] ?? ''
                    }`}
                  >
                    {trip.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
