'use client';

import { ArrowRightIcon, MapPinIcon, GlobeIcon } from 'lucide-react';
import Link from 'next/link';

export function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-primary-500/20 dark:border-white/6">
      {/* Gradient background with mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-background to-secondary-500/10 dark:from-primary-900/80 dark:via-navy-900 dark:to-secondary-900/60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(124,58,237,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(14,165,233,0.1),transparent_50%)]" />

      {/* Decorative elements */}
      <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-primary-500/10 blur-2xl" />
      <div className="absolute -bottom-4 right-20 h-20 w-20 rounded-full bg-secondary-500/10 blur-xl" />

      {/* Route line decoration */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-1 opacity-30 dark:opacity-20">
        <MapPinIcon className="h-4 w-4 text-primary-500 dark:text-primary-400" />
        <div className="w-px h-12 bg-gradient-to-b from-primary-500 to-secondary-500" />
        <div className="w-1.5 h-1.5 rounded-full bg-secondary-500" />
        <div className="w-px h-8 bg-gradient-to-b from-secondary-500 to-transparent" />
        <GlobeIcon className="h-4 w-4 text-secondary-500 dark:text-secondary-400" />
      </div>

      <div className="relative z-10 p-6 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400/70 mb-2">
              Cross-Border Logistics
            </p>
            <h2 className="text-lg font-bold text-foreground lg:text-xl">
              Welcome to MK-TZ Logistics OS
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Start by adding your fleet, routes, and team members to unlock real-time tracking across Kenya and Tanzania.
            </p>
          </div>
          <Link
            href="/dashboard/fleet"
            className="group flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:shadow-glow"
          >
            Get Started
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
