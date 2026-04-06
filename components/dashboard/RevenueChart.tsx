'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { revenueData } from '@/data/dashboard-data';

export function RevenueChart() {
  return (
    <div className="rounded-card border border-gray-200 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-white/[0.06] dark:bg-white/[0.04] dark:backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
          Revenue vs Cost
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-primary-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Current Year
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-secondary-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Previous Year
            </span>
          </div>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={revenueData}
            margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="primaryGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="secondaryGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0EA5E9" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(148,163,184,0.15)"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#94A3B8' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#94A3B8' }}
              tickFormatter={(v) => `$${v / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17,24,39,0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.75rem',
                color: '#E5E7EB',
                fontSize: '0.75rem',
              }}
              formatter={(value: number) => [
                `$${value.toLocaleString()}`,
                undefined,
              ]}
            />
            <Legend content={() => null} />
            <Line
              type="monotone"
              dataKey="currentYear"
              stroke="#7C3AED"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, fill: '#7C3AED' }}
              name="Current Year"
            />
            <Line
              type="monotone"
              dataKey="previousYear"
              stroke="#0EA5E9"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, fill: '#0EA5E9' }}
              name="Previous Year"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
