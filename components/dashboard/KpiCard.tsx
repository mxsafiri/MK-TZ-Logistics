import {
  TruckIcon,
  DollarSignIcon,
  UsersIcon,
  ClockIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type KpiIcon = 'truck' | 'dollar' | 'users' | 'clock';

const iconConfig: Record<
  KpiIcon,
  { icon: LucideIcon; glow: string; text: string }
> = {
  truck: {
    icon: TruckIcon,
    glow: 'icon-glow-purple',
    text: 'text-primary-500 dark:text-primary-400',
  },
  dollar: {
    icon: DollarSignIcon,
    glow: 'icon-glow-green',
    text: 'text-status-success',
  },
  users: {
    icon: UsersIcon,
    glow: 'icon-glow-sky',
    text: 'text-secondary-500 dark:text-secondary-400',
  },
  clock: {
    icon: ClockIcon,
    glow: 'icon-glow-amber',
    text: 'text-amber-500 dark:text-amber-400',
  },
};

interface KpiCardProps {
  label: string;
  icon: KpiIcon;
  value: string;
  sublabel?: string;
}

export function KpiCard({ label, icon, value, sublabel }: KpiCardProps) {
  const config = iconConfig[icon];
  const Icon = config.icon;

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold text-foreground truncate">
            {value}
          </p>
          {sublabel && (
            <p className="mt-1.5 text-xs text-muted-foreground/70">{sublabel}</p>
          )}
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${config.glow}`}
        >
          <Icon className={`h-5 w-5 ${config.text}`} />
        </div>
      </div>
    </div>
  );
}
