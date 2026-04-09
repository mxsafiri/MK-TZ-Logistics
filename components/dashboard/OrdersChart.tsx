'use client';

import { PackageIcon, CalendarIcon } from 'lucide-react';

export function OrdersChart() {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Order Volume</h2>
          <p className="text-xs text-muted-foreground">Monthly shipment count</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg border border-border bg-background/40 px-2.5 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground">
          <CalendarIcon className="h-3 w-3" />
          This Year
        </button>
      </div>

      <div className="flex h-64 flex-col items-center justify-center text-center">
        <div className="icon-glow-sky rounded-2xl p-4">
          <PackageIcon className="h-8 w-8 text-secondary-500 dark:text-secondary-400" />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Order history will populate as shipments are created.
        </p>
      </div>
    </div>
  );
}
