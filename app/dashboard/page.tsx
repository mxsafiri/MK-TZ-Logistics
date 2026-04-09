import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { HeroBanner } from '@/components/dashboard/HeroBanner';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { OrdersChart } from '@/components/dashboard/OrdersChart';
import { TripsTable } from '@/components/dashboard/TripsTable';
import { PaymentTracker } from '@/components/dashboard/PaymentTracker';
import { CarriersDonut } from '@/components/dashboard/CarriersDonut';
import { requireSession } from '@/lib/auth/session';
import {
  currentMonthRange,
  getDashboardKpis,
  getFleetCounts,
  getRecentTrips,
  getPaymentSummary,
  getCarrierBreakdown,
} from '@/lib/data/dashboard';
import { formatMoneyCompact, type CurrencyCode } from '@/lib/money';

// Dashboard reads per-request session + live DB data; never cache statically.
export const dynamic = 'force-dynamic';

function initialsFrom(name: string | null, email: string): string {
  const source = (name ?? email).trim();
  if (!source) return '?';
  const parts = source.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default async function DashboardPage() {
  const session = await requireSession();
  const baseCurrency = session.baseCurrency as CurrencyCode;
  const range = currentMonthRange();

  // Fetch everything in parallel — all queries are scoped by orgId so each one
  // is independent. React will render once all promises resolve.
  const [kpis, fleet, trips, paymentSummary, carriers] = await Promise.all([
    getDashboardKpis({ orgId: session.orgId, ...range }),
    getFleetCounts(session.orgId),
    getRecentTrips({ orgId: session.orgId, limit: 15 }),
    getPaymentSummary({ orgId: session.orgId, ...range }),
    getCarrierBreakdown({ orgId: session.orgId, ...range }),
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
      <HeroBanner />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Trips"
          icon="truck"
          value={kpis.totalTrips.toLocaleString()}
          sublabel={`${kpis.activeTrips} active · ${kpis.offloadedTrips} offloaded`}
        />
        <KpiCard
          label="Revenue (MTD)"
          icon="dollar"
          value={formatMoneyCompact(kpis.revenueBaseMinor, baseCurrency)}
          sublabel={`Paid: ${formatMoneyCompact(kpis.paidBaseMinor, baseCurrency)}`}
        />
        <KpiCard
          label="Active Drivers"
          icon="users"
          value={fleet.activeDrivers.toLocaleString()}
          sublabel={`${fleet.activeTrucks} trucks in fleet`}
        />
        <KpiCard
          label="Outstanding"
          icon="clock"
          value={formatMoneyCompact(
            kpis.pendingBaseMinor + kpis.overdueBaseMinor,
            baseCurrency,
          )}
          sublabel={`Overdue: ${formatMoneyCompact(kpis.overdueBaseMinor, baseCurrency)}`}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <RevenueChart />
        </div>
        <div className="lg:col-span-5">
          <OrdersChart />
        </div>
      </div>

      <TripsTable trips={trips} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <PaymentTracker summary={paymentSummary} baseCurrency={baseCurrency} />
        </div>
        <div className="lg:col-span-5">
          <CarriersDonut total={carriers.total} segments={carriers.segments} />
        </div>
      </div>
    </DashboardShell>
  );
}
