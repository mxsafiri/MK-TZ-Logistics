'use client';

import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';

export function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary-500 via-primary-700 to-secondary-500 p-6 text-white lg:p-8">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="absolute -bottom-8 -right-4 h-28 w-28 rounded-full bg-white/5" />

      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold lg:text-xl">
            Welcome to MK-TZ Logistics OS
          </h2>
          <p className="mt-1 text-sm text-white/70">
            Start by adding your fleet, routes, and team members to get the most
            out of the platform.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="group flex shrink-0 items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-primary-700 transition-all duration-200 hover:shadow-lg"
        >
          Get Started
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
