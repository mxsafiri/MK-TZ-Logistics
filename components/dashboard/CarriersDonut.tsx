import { TruckIcon } from 'lucide-react';

const palette = [
  { dot: 'bg-primary-500', bar: 'from-primary-500 to-primary-400' },
  { dot: 'bg-secondary-500', bar: 'from-secondary-500 to-secondary-400' },
  { dot: 'bg-status-success', bar: 'from-green-500 to-emerald-400' },
  { dot: 'bg-status-warning', bar: 'from-amber-500 to-yellow-400' },
  { dot: 'bg-status-danger', bar: 'from-red-500 to-rose-400' },
  { dot: 'bg-violet-500', bar: 'from-violet-500 to-purple-400' },
];

interface CarriersDonutProps {
  total: number;
  segments: { label: string; count: number; pct: number }[];
}

export function CarriersDonut({ total, segments }: CarriersDonutProps) {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Top Carriers</h2>
        <span className="text-xs text-muted-foreground">Fleet breakdown</span>
      </div>

      <div className="flex h-40 flex-col items-center justify-center text-center">
        <div className="relative">
          <div className="h-28 w-28 rounded-full border-[6px] border-border" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <TruckIcon className="h-5 w-5 text-primary-500/70" />
            <p className="mt-1 text-[10px] text-muted-foreground/70">
              {total} {total === 1 ? 'trip' : 'trips'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {segments.length === 0 && (
          <p className="text-xs text-center text-muted-foreground/70">
            No trips in this period yet.
          </p>
        )}
        {segments.map((seg, i) => {
          const colors = palette[i % palette.length];
          return (
            <div key={`${seg.label}-${i}`}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${colors.dot}`} />
                  <span className="text-xs text-muted-foreground truncate max-w-[10rem]">
                    {seg.label}
                  </span>
                </div>
                <span className="text-xs font-medium text-muted-foreground/80 tabular-nums">
                  {seg.count} · {seg.pct}%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-foreground/5 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${colors.bar}`}
                  style={{ width: `${seg.pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
