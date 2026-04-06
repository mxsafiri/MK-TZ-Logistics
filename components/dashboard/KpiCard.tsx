'use client';

import {
  TruckIcon,
  DollarSignIcon,
  UsersIcon,
  ClockIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { KpiItem } from '@/data/dashboard-data';

const iconMap: Record<string, LucideIcon> = {
  truck: TruckIcon,
  dollar: DollarSignIcon,
  users: UsersIcon,
  clock: ClockIcon,
};

export function KpiCard({ label, icon }: KpiItem) {
  const Icon = iconMap[icon] || TruckIcon;

  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">--</p>
          <p className="mt-1 text-xs text-muted-foreground">
            No data yet
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500/10 text-primary-500">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
