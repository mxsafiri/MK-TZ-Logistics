'use client';

import { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { HeroBanner } from '@/components/dashboard/HeroBanner';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { OrdersChart } from '@/components/dashboard/OrdersChart';
import { TripsTable } from '@/components/dashboard/TripsTable';
import { PaymentTracker } from '@/components/dashboard/PaymentTracker';
import { CarriersDonut } from '@/components/dashboard/CarriersDonut';
import { kpiItems } from '@/data/dashboard-data';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <DashboardSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardTopbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto px-4 pb-8 pt-6 lg:px-6">
          <div className="mx-auto max-w-screen-2xl space-y-6">
            <HeroBanner />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {kpiItems.map((kpi) => (
                <KpiCard key={kpi.label} {...kpi} />
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <RevenueChart />
              </div>
              <div className="lg:col-span-5">
                <OrdersChart />
              </div>
            </div>

            <TripsTable />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <PaymentTracker />
              </div>
              <div className="lg:col-span-5">
                <CarriersDonut />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
