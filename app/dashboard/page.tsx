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
import { kpiData } from '@/data/dashboard-data';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-gray-50 text-gray-900 dark:bg-navy-900 dark:text-gray-200">
      {/* Sidebar */}
      <DashboardSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <DashboardTopbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto px-4 pb-8 lg:px-6">
          <div className="mx-auto max-w-screen-2xl space-y-6">
            {/* Hero banner */}
            <HeroBanner />

            {/* KPI Cards - 4 col on lg, 2 on md, 1 on sm */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {kpiData.map((kpi) => (
                <KpiCard key={kpi.label} {...kpi} />
              ))}
            </div>

            {/* Charts row - side by side on lg, stacked on smaller */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <RevenueChart />
              </div>
              <div className="lg:col-span-5">
                <OrdersChart />
              </div>
            </div>

            {/* Trips table */}
            <TripsTable />

            {/* Bottom row - payment tracker + carriers donut */}
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
