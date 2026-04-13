import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon, CreditCardIcon } from 'lucide-react';
import { and, eq } from 'drizzle-orm';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { trips } from '@/lib/db/schema/trips';
import { listActiveDrivers, listActiveTrucks } from '@/lib/data/fleet';
import { minorToMajor, type CurrencyCode } from '@/lib/money';
import { EditTripForm } from './edit-trip-form';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Edit Trip' };

function initialsFrom(name: string | null, email: string): string {
  const source = (name ?? email).trim();
  if (!source) return '?';
  const parts = source.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default async function EditTripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireRole('owner', 'admin', 'ops');

  const [trip] = await db
    .select()
    .from(trips)
    .where(and(eq(trips.id, id), eq(trips.orgId, session.orgId)))
    .limit(1);

  if (!trip) notFound();

  const [trucks, drivers] = await Promise.all([
    listActiveTrucks(session.orgId),
    listActiveDrivers(session.orgId),
  ]);

  const currency = (trip.currency as CurrencyCode) ?? 'TZS';

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
          href="/dashboard"
          className="flex items-center gap-1.5 rounded-lg border border-border bg-background/40 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
        >
          <ArrowLeftIcon className="h-3 w-3" />
          Back
        </Link>
        <div>
          <h2 className="text-lg font-semibold">Edit Trip</h2>
          <p className="text-xs text-muted-foreground">
            {trip.deliveryNoteNo ?? trip.id.slice(0, 8)}
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Link
          href={`/dashboard/trips/${trip.id}/record-payment`}
          className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700"
        >
          <CreditCardIcon className="h-3.5 w-3.5" />
          Record Payment
        </Link>
      </div>

      <div className="glass-card rounded-xl p-6">
        <EditTripForm
          tripId={trip.id}
          trucks={trucks}
          drivers={drivers}
          defaultValues={{
            tripDate: trip.tripDate,
            truckId: trip.truckId ?? '',
            driverId: trip.driverId ?? '',
            deliveryNoteNo: trip.deliveryNoteNo ?? '',
            cargoDescription: trip.cargoDescription ?? '',
            origin: trip.origin ?? '',
            destination: trip.destination ?? '',
            distanceKm: trip.distanceKm?.toString() ?? '',
            currency,
            freightAdvance: minorToMajor(trip.freightAdvanceMinor, currency).toString(),
            freightComplete: minorToMajor(trip.freightCompleteMinor, currency).toString(),
            poNumber: trip.poNumber ?? '',
            notes: trip.notes ?? '',
            status: trip.status,
            paymentStatus: trip.paymentStatus,
          }}
        />
      </div>
    </DashboardShell>
  );
}
