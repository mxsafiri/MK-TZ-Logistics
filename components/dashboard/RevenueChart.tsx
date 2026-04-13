'use client';

import { BarChart3Icon, TrendingUpIcon } from 'lucide-react';

interface DailyData {
  day: string;
  revenue: number;
  advance: number;
}

interface RevenueChartProps {
  data: DailyData[];
  baseCurrency: string;
}

function formatCompact(n: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);
}

function dayLabel(iso: string): string {
  const d = new Date(iso);
  return d.getDate().toString();
}

export function RevenueChart({ data, baseCurrency }: RevenueChartProps) {
  const symbol = baseCurrency === 'USD' ? '$' : 'TZS ';
  const maxValue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Daily Revenue</h2>
          <p className="text-xs text-muted-foreground">Revenue this month</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary-500 shadow-[0_0_6px_rgba(124,58,237,0.4)]" />
            Total
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-secondary-500 shadow-[0_0_6px_rgba(14,165,233,0.4)]" />
            Advance
          </span>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <div className="icon-glow-purple rounded-2xl p-4">
            <BarChart3Icon className="h-8 w-8 text-primary-500 dark:text-primary-400" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Revenue data will appear here once trips are recorded.
          </p>
          <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground/60">
            <TrendingUpIcon className="h-3 w-3" />
            <span>Charts auto-populate from trip data</span>
          </div>
        </div>
      ) : (
        <div className="h-64 flex items-end gap-1 pt-6">
          {data.map((d) => {
            const revHeight = (d.revenue / maxValue) * 100;
            const advHeight = (d.advance / maxValue) * 100;
            return (
              <div
                key={d.day}
                className="flex-1 flex flex-col items-center gap-0.5 group"
                title={`${dayLabel(d.day)}: ${symbol}${formatCompact(d.revenue)} (adv: ${symbol}${formatCompact(d.advance)})`}
              >
                <div className="w-full flex flex-col items-center justify-end h-52 gap-[1px]">
                  <div
                    className="w-full max-w-[1.25rem] rounded-t bg-gradient-to-t from-primary-600 to-primary-400 transition-all duration-200 group-hover:opacity-80"
                    style={{ height: `${revHeight}%`, minHeight: revHeight > 0 ? '2px' : '0' }}
                  />
                  <div
                    className="w-full max-w-[1.25rem] rounded-t bg-gradient-to-t from-secondary-600 to-secondary-400 transition-all duration-200 group-hover:opacity-80"
                    style={{ height: `${advHeight}%`, minHeight: advHeight > 0 ? '2px' : '0' }}
                  />
                </div>
                <span className="text-[9px] text-muted-foreground/60 tabular-nums">
                  {dayLabel(d.day)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
