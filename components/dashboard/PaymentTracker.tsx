import {
  ArrowUpRightIcon,
  ArrowDownRightIcon,
  AlertTriangleIcon,
  ClockIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { formatMoneyCompact, type CurrencyCode } from '@/lib/money';

type StatusKey = 'pending' | 'partial' | 'paid' | 'overdue';

const typeConfig: Record<
  StatusKey,
  { label: string; color: string; glow: string; icon: LucideIcon }
> = {
  pending: {
    label: 'Pending',
    color: 'text-secondary-500 dark:text-secondary-400',
    glow: 'icon-glow-sky',
    icon: ArrowUpRightIcon,
  },
  partial: {
    label: 'Partially Paid',
    color: 'text-amber-500 dark:text-amber-400',
    glow: 'icon-glow-amber',
    icon: ClockIcon,
  },
  paid: {
    label: 'Paid',
    color: 'text-status-success',
    glow: 'icon-glow-green',
    icon: ArrowDownRightIcon,
  },
  overdue: {
    label: 'Overdue',
    color: 'text-status-danger',
    glow: 'bg-red-500/10 dark:bg-red-500/15 shadow-[0_0_10px_rgba(239,68,68,0.15)]',
    icon: AlertTriangleIcon,
  },
};

interface PaymentTrackerProps {
  summary: Record<string, { count: number; totalBaseMinor: bigint }>;
  baseCurrency: CurrencyCode;
}

export function PaymentTracker({ summary, baseCurrency }: PaymentTrackerProps) {
  const order: StatusKey[] = ['pending', 'partial', 'paid', 'overdue'];

  return (
    <div className="glass-card rounded-xl p-5">
      <h2 className="mb-4 text-sm font-semibold text-foreground">
        Payment Tracker
      </h2>

      <div className="space-y-3">
        {order.map((key) => {
          const config = typeConfig[key];
          const Icon = config.icon;
          const bucket = summary[key] ?? { count: 0, totalBaseMinor: 0n };

          return (
            <div
              key={key}
              className="flex items-center justify-between rounded-lg border border-border bg-background/30 p-3.5 transition-all duration-200 hover:border-primary-500/20 hover:bg-foreground/5"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${config.glow}`}
                >
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {config.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {bucket.count} {bucket.count === 1 ? 'trip' : 'trips'}
                  </p>
                </div>
              </div>
              <span className={`text-lg font-bold tabular-nums ${config.color}`}>
                {formatMoneyCompact(bucket.totalBaseMinor, baseCurrency)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
