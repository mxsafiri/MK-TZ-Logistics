'use client';

import { PackageIcon } from 'lucide-react';

interface MonthlyData {
  month: string;
  count: number;
}

interface OrdersChartProps {
  data: MonthlyData[];
}

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function shortMonth(yyyymm: string): string {
  const m = parseInt(yyyymm.split('-')[1], 10);
  return monthLabels[m - 1] ?? yyyymm;
}

export function OrdersChart({ data }: OrdersChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Trip Volume</h2>
          <p className="text-xs text-muted-foreground">Monthly shipment count</p>
        </div>
        <span className="text-xs text-muted-foreground">Last 12 months</span>
      </div>

      {data.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <div className="icon-glow-sky rounded-2xl p-4">
            <PackageIcon className="h-8 w-8 text-secondary-500 dark:text-secondary-400" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Trip history will populate as shipments are created.
          </p>
        </div>
      ) : (
        <div className="h-64 flex items-end gap-2 pt-6">
          {data.map((d) => {
            const height = (d.count / maxCount) * 100;
            return (
              <div
                key={d.month}
                className="flex-1 flex flex-col items-center gap-1 group"
                title={`${shortMonth(d.month)}: ${d.count} trips`}
              >
                <span className="text-[10px] font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                  {d.count}
                </span>
                <div className="w-full flex items-end justify-center h-48">
                  <div
                    className="w-full max-w-[2rem] rounded-t bg-gradient-to-t from-secondary-600 to-secondary-400 transition-all duration-200 group-hover:from-secondary-500 group-hover:to-secondary-300"
                    style={{ height: `${height}%`, minHeight: height > 0 ? '4px' : '0' }}
                  />
                </div>
                <span className="text-[9px] text-muted-foreground/60">
                  {shortMonth(d.month)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
