import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon } from 'lucide-react';
import { and, eq } from 'drizzle-orm';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { trips } from '@/lib/db/schema/trips';
import { formatMoney, type CurrencyCode } from '@/lib/money';
import { RecordPaymentForm } from './record-payment-form';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Record Payment' };

function initialsFrom(name: string | null, email: string): string {
  const source = (name ?? email).trim();
  if (!source) return '?';
  const parts = source.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default async function RecordPaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireRole('owner', 'admin', 'accountant');

  const [trip] = await db
    .select({
      id: trips.id,
      deliveryNoteNo: trips.deliveryNoteNo,
      totalMinor: trips.totalMinor,
      currency: trips.currency,
      destination: trips.destination,
    })
    .from(trips)
    .where(and(eq(trips.id, id), eq(trips.orgId, session.orgId)))
    .limit(1);

  if (!trip) notFound();

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
          href={`/dashboard/trips/${trip.id}`}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-background/40 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
        >
          <ArrowLeftIcon className="h-3 w-3" />
          Back to trip
        </Link>
        <div>
          <h2 className="text-lg font-semibold">Record Payment</h2>
          <p className="text-xs text-muted-foreground">
            {trip.deliveryNoteNo ?? trip.destination ?? trip.id.slice(0, 8)}
            {' - '}
            Trip total: {formatMoney((trip.totalMinor ?? 0n) as bigint, currency)}
          </p>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6 max-w-lg">
        <RecordPaymentForm tripId={trip.id} defaultCurrency={currency} />
      </div>
    </DashboardShell>
  );
}
