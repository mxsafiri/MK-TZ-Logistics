'use client';

import { TruckIcon } from 'lucide-react';
import { carrierCategories } from '@/data/dashboard-data';

export function CarriersDonut() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-colors duration-200">
      <h2 className="mb-4 text-sm font-semibold">Fleet Breakdown</h2>

      <div className="flex h-44 flex-col items-center justify-center text-center">
        <TruckIcon className="h-10 w-10 text-muted-foreground/30" />
        <p className="mt-3 text-sm text-muted-foreground">
          Fleet data will be shown once carriers are registered.
        </p>
      </div>

      <div className="mt-4 space-y-2">
        {carrierCategories.map((cat) => (
          <div key={cat.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${cat.colorClass}`} />
              <span className="text-sm text-muted-foreground">{cat.name}</span>
            </div>
            <span className="text-sm font-medium">--</span>
          </div>
        ))}
      </div>
    </div>
  );
}
