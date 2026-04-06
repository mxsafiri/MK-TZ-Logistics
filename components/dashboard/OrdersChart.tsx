'use client';

import { PackageIcon } from 'lucide-react';

export function OrdersChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-colors duration-200">
      <div className="mb-4">
        <h2 className="text-sm font-semibold">Monthly Orders</h2>
        <p className="text-xs text-muted-foreground">Order volume over time</p>
      </div>

      <div className="flex h-64 flex-col items-center justify-center text-center">
        <PackageIcon className="h-10 w-10 text-muted-foreground/30" />
        <p className="mt-3 text-sm text-muted-foreground">
          Order history will populate as shipments are created.
        </p>
      </div>
    </div>
  );
}
