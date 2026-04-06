'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { ordersData } from '@/data/dashboard-data';

export function OrdersChart() {
  const maxOrders = Math.max(...ordersData.map((d) => d.orders));

  return (
    <div className="rounded-card border border-gray-200 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-white/[0.06] dark:bg-white/[0.04] dark:backdrop-blur-xl">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
          Monthly Orders
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Order volume trend this year
        </p>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={ordersData}
            margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
          >
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
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17,24,39,0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.75rem',
                color: '#E5E7EB',
                fontSize: '0.75rem',
              }}
            />
            <Bar dataKey="orders" radius={[6, 6, 0, 0]} maxBarSize={32}>
              {ordersData.map((entry) => (
                <Cell
                  key={entry.month}
                  fill={
                    entry.orders === maxOrders
                      ? '#7C3AED'
                      : 'rgba(124,58,237,0.2)'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
