'use client';

import { ArrowRightIcon } from 'lucide-react';

export function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-card bg-gradient-to-r from-primary-500 via-primary-700 to-secondary-500 p-6 text-white shadow-glow-sm lg:p-8">
      {/* Decorative circles */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="absolute -bottom-8 -right-4 h-28 w-28 rounded-full bg-white/5" />

      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="mb-2 inline-block rounded-pill bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
            Enterprise Plan Active
          </span>
          <h2 className="text-xl font-bold lg:text-2xl">
            Welcome back to MK-TZ Logistics OS
          </h2>
          <p className="mt-1 text-sm text-white/70">
            Your fleet performance is up 12% this month. Keep the momentum going.
          </p>
        </div>
        <button className="group flex shrink-0 items-center gap-2 rounded-button bg-white px-5 py-2.5 text-sm font-semibold text-primary-700 transition-all duration-200 hover:scale-105 hover:shadow-lg">
          View Reports
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}
