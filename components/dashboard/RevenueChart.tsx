'use client';

import { BarChart3Icon, TrendingUpIcon } from 'lucide-react';

export function RevenueChart() {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Monthly Revenue</h2>
          <p className="text-xs text-muted-foreground">Revenue vs operating cost</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary-500 shadow-[0_0_6px_rgba(124,58,237,0.4)]" />
            Revenue
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-secondary-500 shadow-[0_0_6px_rgba(14,165,233,0.4)]" />
            Cost
          </span>
        </div>
      </div>

      <div className="flex h-64 flex-col items-center justify-center text-center">
        <div className="icon-glow-purple rounded-2xl p-4">
          <BarChart3Icon className="h-8 w-8 text-primary-500 dark:text-primary-400" />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Revenue data will appear here once transactions are recorded.
        </p>
        <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground/60">
          <TrendingUpIcon className="h-3 w-3" />
          <span>Charts auto-populate from trip data</span>
        </div>
      </div>
    </div>
  );
}
