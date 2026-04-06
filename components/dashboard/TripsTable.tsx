'use client';

import { TruckIcon } from 'lucide-react';
import { tripTableColumns } from '@/data/dashboard-data';

export function TripsTable() {
  return (
    <div className="rounded-xl border border-border bg-card transition-colors duration-200">
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-sm font-semibold">Recent Trips</h2>
        <p className="text-xs text-muted-foreground">
          Active and completed deliveries
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[48rem]">
          <thead>
            <tr className="border-y border-border">
              {tripTableColumns.map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan={tripTableColumns.length}
                className="px-4 py-16 text-center"
              >
                <div className="flex flex-col items-center">
                  <TruckIcon className="h-10 w-10 text-muted-foreground/30" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    No trips recorded yet. New deliveries will show up here.
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
