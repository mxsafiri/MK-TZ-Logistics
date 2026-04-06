'use client';

import {
  TruckIcon,
  DollarSignIcon,
  UsersIcon,
  ClockIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { KpiItem } from '@/data/dashboard-data';

const iconMap: Record<string, LucideIcon> = {
  truck: TruckIcon,
  dollar: DollarSignIcon,
  users: UsersIcon,
  clock: ClockIcon,
};

export function KpiCard({ label, value, icon, trend, delta }: KpiItem) {
  const Icon = iconMap[icon] || TruckIcon;

  return (
    <div className="group relative overflow-hidden rounded-card border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft dark:border-white/[0.06] dark:bg-white/[0.04] dark:backdrop-blur-xl dark:hover:shadow-glow-sm">
      {/* Gradient accent line */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="mt-1.5 text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          <div className="mt-2 flex items-center gap-1">
            {trend === 'up' ? (
              <TrendingUpIcon className="h-3.5 w-3.5 text-status-success" />
            ) : (
              <TrendingDownIcon className="h-3.5 w-3.5 text-status-danger" />
            )}
            <span
              className={`text-xs font-medium ${
                trend === 'up' ? 'text-status-success' : 'text-status-danger'
              }`}
            >
              {delta}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              vs last month
            </span>
          </div>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-button bg-primary-500/10 text-primary-500 dark:bg-primary-500/20">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
