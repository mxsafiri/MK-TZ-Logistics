'use client';

import {
  ArrowUpRightIcon,
  ArrowDownRightIcon,
  AlertTriangleIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { paymentCategories } from '@/data/dashboard-data';
import type { PaymentSummary } from '@/data/dashboard-data';

const typeConfig: Record<
  PaymentSummary['type'],
  { color: string; bg: string; icon: LucideIcon }
> = {
  expected: {
    color: 'text-secondary-500',
    bg: 'bg-secondary-500/10',
    icon: ArrowUpRightIcon,
  },
  paid: {
    color: 'text-status-success',
    bg: 'bg-status-success/10',
    icon: ArrowDownRightIcon,
  },
  overdue: {
    color: 'text-status-danger',
    bg: 'bg-status-danger/10',
    icon: AlertTriangleIcon,
  },
};

export function PaymentTracker() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-colors duration-200">
      <h2 className="mb-4 text-sm font-semibold">Payment Tracker</h2>

      <div className="space-y-3">
        {paymentCategories.map((card) => {
          const config = typeConfig[card.type];
          const Icon = config.icon;

          return (
            <div
              key={card.type}
              className="flex items-center justify-between rounded-lg border border-border p-3.5 transition-colors duration-200 hover:bg-accent/50"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${config.bg}`}
                >
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium">{card.label}</p>
                  <p className="text-xs text-muted-foreground">0 invoices</p>
                </div>
              </div>
              <span className={`text-base font-semibold ${config.color}`}>
                --
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
