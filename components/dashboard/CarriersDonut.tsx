'use client';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { carrierSegments } from '@/data/dashboard-data';

export function CarriersDonut() {
  const total = carrierSegments.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="rounded-card border border-gray-200 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-white/[0.06] dark:bg-white/[0.04] dark:backdrop-blur-xl">
      <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
        Top Carriers
      </h2>

      <div className="relative mx-auto h-52 w-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={carrierSegments}
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {carrierSegments.map((segment) => (
                <Cell key={segment.name} fill={segment.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17,24,39,0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.75rem',
                color: '#E5E7EB',
                fontSize: '0.75rem',
              }}
              formatter={(value: number) => [`${value}%`, undefined]}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {total}%
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Fleet
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-2">
        {carrierSegments.map((segment) => (
          <div key={segment.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {segment.name}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {segment.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
