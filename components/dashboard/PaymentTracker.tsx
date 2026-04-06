'use client';

import { ArrowUpRightIcon, ArrowDownRightIcon, AlertTriangleIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { paymentCards } from '@/data/dashboard-data';
import type { PaymentCard } from '@/data/dashboard-data';

const typeConfig: Record<
  PaymentCard['type'],
  { color: string; bg: string; icon: LucideIcon }
> = {
  expected: {
    color: 'text-status-info',
    bg: 'bg-status-info/10 dark:bg-status-info/20',
    icon: ArrowUpRightIcon,
  },
  paid: {
    color: 'text-status-success',
    bg: 'bg-status-success/10 dark:bg-status-success/20',
    icon: ArrowDownRightIcon,
  },
  overdue: {
    color: 'text-status-danger',
    bg: 'bg-status-danger/10 dark:bg-status-danger/20',
    icon: AlertTriangleIcon,
  },
};

export function PaymentTracker() {
  return (
    <div className="rounded-card border border-gray-200 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-white/[0.06] dark:bg-white/[0.04] dark:backdrop-blur-xl">
      <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
        Payment Tracker
      </h2>

      <div className="space-y-3">
        {paymentCards.map((card) => {
          const config = typeConfig[card.type];
          const Icon = config.icon;

          return (
            <div
              key={card.type}
              className="flex items-center justify-between rounded-button border border-gray-100 p-3.5 transition-all duration-200 hover:shadow-sm dark:border-white/[0.06] dark:hover:border-white/[0.1]"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-button ${config.bg}`}
                >
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {card.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {card.count} invoices
                  </p>
                </div>
              </div>
              <span className={`text-lg font-bold ${config.color}`}>
                {card.amount}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
