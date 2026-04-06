'use client';

import { BarChart3Icon } from 'lucide-react';

export function RevenueChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-colors duration-200">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">Revenue vs Cost</h2>
          <p className="text-xs text-muted-foreground">Monthly breakdown</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary-500" />
            Revenue
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-secondary-500" />
            Cost
          </span>
        </div>
      </div>

      <div className="flex h-64 flex-col items-center justify-center text-center">
        <BarChart3Icon className="h-10 w-10 text-muted-foreground/30" />
        <p className="mt-3 text-sm text-muted-foreground">
          Revenue data will appear here once transactions are recorded.
        </p>
      </div>
    </div>
  );
}
