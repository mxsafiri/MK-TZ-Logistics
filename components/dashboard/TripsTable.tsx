'use client';

import { recentTrips } from '@/data/dashboard-data';
import type { Trip } from '@/data/dashboard-data';

function TripStatusBadge({ status }: { status: Trip['status'] }) {
  const styles = {
    delivered: {
      bg: 'bg-status-success/10 dark:bg-status-success/20',
      text: 'text-status-success',
      dot: 'bg-status-success',
    },
    'in-transit': {
      bg: 'bg-status-info/10 dark:bg-status-info/20',
      text: 'text-status-info',
      dot: 'bg-status-info',
    },
    pending: {
      bg: 'bg-status-warning/10 dark:bg-status-warning/20',
      text: 'text-status-warning',
      dot: 'bg-status-warning',
    },
  };

  const s = styles[status];
  const label = status
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-medium ${s.bg} ${s.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {label}
    </span>
  );
}

export function TripsTable() {
  return (
    <div className="rounded-card border border-gray-200 bg-white shadow-sm transition-colors duration-200 dark:border-white/[0.06] dark:bg-white/[0.04] dark:backdrop-blur-xl">
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
          Recent Trips
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Latest deliveries and shipments
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[48rem]">
          <thead>
            <tr className="border-y border-gray-100 dark:border-white/[0.06]">
              {[
                'Trip ID',
                'Truck',
                'Driver',
                'Delivery Note',
                'Cargo',
                'Destination',
                'Revenue',
                'Status',
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/[0.04]">
            {recentTrips.map((trip, i) => (
              <tr
                key={trip.tripId}
                className={`transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-white/[0.04] ${
                  i % 2 === 1 ? 'bg-gray-50/50 dark:bg-white/[0.02]' : ''
                }`}
              >
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-primary-500">
                  {trip.tripId}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {trip.truck}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {trip.driver}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {trip.deliveryNote}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {trip.cargo}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {trip.destination}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                  ${trip.revenue.toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <TripStatusBadge status={trip.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
