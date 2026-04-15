'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRightIcon,
  ShieldCheckIcon,
  TruckIcon,
  DollarSignIcon,
  UsersIcon,
  ClockIcon,
} from 'lucide-react';
import { Button } from '@/components/shared/ui/button';
import { AnimatedGroup } from '@/components/shared/ui/animated-group';

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring' as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

// Authentic East African corridor stakeholders — more credible than
// generic tech-brand logos for a cross-border logistics product.
const corridorPartners = [
  'TPA · Dar Port',
  'KPA · Mombasa Port',
  'TRA Customs',
  'KRA Customs',
  'TANROADS',
  'TradeMark Africa',
  'EAC Single Window',
  'SGR Cargo',
];

/**
 * A mock of the real dashboard rendered in pure CSS — more credible than a
 * stock photo, and loads instantly with no external image dependency.
 */
function DashboardPreviewCard() {
  const bars = [32, 48, 40, 65, 55, 72, 60, 85, 70, 92, 78, 96, 82, 100, 88];
  const kpis = [
    { label: 'Total Trips', value: '1,284', sub: '312 active', icon: TruckIcon },
    { label: 'Revenue (MTD)', value: 'TZS 1.42B', sub: 'Paid: 1.18B', icon: DollarSignIcon },
    { label: 'Active Drivers', value: '84', sub: '62 trucks in fleet', icon: UsersIcon },
    { label: 'Outstanding', value: 'TZS 240M', sub: 'Overdue: 38M', icon: ClockIcon },
  ];

  return (
    <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-border/60 bg-background p-1.5 shadow-2xl shadow-zinc-950/20 ring-1 ring-black/5 dark:ring-white/10">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-border/50 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
        </div>
        <div className="ml-3 flex-1 truncate rounded-md bg-foreground/5 px-2.5 py-1 text-[10px] text-muted-foreground">
          app.mk-tz.co/dashboard
        </div>
      </div>

      {/* Mock dashboard body */}
      <div className="bg-gradient-to-br from-background via-background to-foreground/[0.02] p-4 sm:p-6">
        {/* KPI strip */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {kpis.map(({ label, value, sub, icon: Icon }) => (
            <div
              key={label}
              className="rounded-xl border border-border/60 bg-background/60 p-3 backdrop-blur"
            >
              <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                <Icon className="h-3 w-3" />
                {label}
              </div>
              <div className="mt-1.5 text-base font-semibold sm:text-lg">
                {value}
              </div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">
                {sub}
              </div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-12">
          {/* Revenue bar chart */}
          <div className="rounded-xl border border-border/60 bg-background/60 p-4 lg:col-span-7">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold">Daily Revenue</div>
                <div className="text-[10px] text-muted-foreground">
                  Revenue this month
                </div>
              </div>
              <div className="flex items-center gap-3 text-[9px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                  Total
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary-500" />
                  Advance
                </span>
              </div>
            </div>
            <div className="mt-4 flex h-32 items-stretch gap-1">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className="flex flex-1 flex-col items-center justify-end gap-[1px]"
                >
                  <div
                    className="w-full max-w-[14px] rounded-t bg-gradient-to-t from-primary-600 to-primary-400"
                    style={{ height: `${h}%` }}
                  />
                  <div
                    className="w-full max-w-[14px] rounded-t bg-gradient-to-t from-secondary-600 to-secondary-400"
                    style={{ height: `${h * 0.4}%` }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Trip volume */}
          <div className="rounded-xl border border-border/60 bg-background/60 p-4 lg:col-span-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold">Trip Volume</div>
                <div className="text-[10px] text-muted-foreground">
                  Monthly shipment count
                </div>
              </div>
              <div className="text-[9px] text-muted-foreground">Last 12 mo.</div>
            </div>
            <div className="mt-4 flex h-32 items-end gap-1.5">
              {[45, 58, 52, 68, 72, 85, 78, 92, 88, 95, 90, 100].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-gradient-to-t from-secondary-600 to-secondary-400"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Trips table preview */}
        <div className="mt-3 hidden rounded-xl border border-border/60 bg-background/60 p-4 sm:block">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-xs font-semibold">Recent Trips</div>
            <div className="text-[9px] text-muted-foreground">15 of 1,284</div>
          </div>
          <div className="space-y-1.5">
            {[
              ['Apr 14', 'T 123 ABC', 'DAR → NBO', 'In transit', 'Pending', 'primary'],
              ['Apr 14', 'KCE 842X', 'MSA → KGL', 'Offloaded', 'Paid', 'emerald'],
              ['Apr 13', 'T 556 DKP', 'DAR → KLA', 'In transit', 'Partial', 'amber'],
              ['Apr 13', 'KDB 091T', 'NBO → DAR', 'Planned', 'Pending', 'primary'],
            ].map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-5 items-center gap-2 rounded-md px-2 py-1.5 text-[10px] hover:bg-foreground/[0.03]"
              >
                <span className="text-muted-foreground">{row[0]}</span>
                <span className="font-medium tabular-nums">{row[1]}</span>
                <span className="text-muted-foreground">{row[2]}</span>
                <span className="rounded-full border border-primary-500/30 bg-primary-500/10 px-2 py-0.5 text-center text-[9px] text-primary-500">
                  {row[3]}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-center text-[9px] ${
                    row[5] === 'emerald'
                      ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-500'
                      : row[5] === 'amber'
                        ? 'border border-amber-500/30 bg-amber-500/10 text-amber-500'
                        : 'border border-zinc-500/30 bg-zinc-500/10 text-zinc-400'
                  }`}
                >
                  {row[4]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <>
      {/* Top nav — simple, product-led */}
      <header className="absolute inset-x-0 top-0 z-20">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative h-9 w-9 overflow-hidden rounded-full ring-1 ring-border/60">
              <Image
                src="/static/images/logo.png"
                alt="MK-TZ Logistics"
                fill
                sizes="36px"
                className="object-cover"
                priority
              />
            </div>
            <span className="text-sm font-semibold tracking-tight">MK-TZ</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="text-sm">
              <Link href="/auth/sign-in">Sign in</Link>
            </Button>
            <Button asChild size="sm" className="rounded-lg text-sm">
              <Link href="/dashboard">
                Open Dashboard
                <ArrowRightIcon className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="overflow-hidden">
        <section>
          <div className="relative pt-28">
            {/* Soft radial wash */}
            <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]" />

            <div className="mx-auto max-w-5xl px-6">
              <div className="sm:mx-auto lg:mr-auto">
                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.4,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                >
                  <h1 className="max-w-3xl text-balance text-5xl font-medium tracking-tight md:text-6xl lg:text-7xl">
                    Cross-border logistics,{' '}
                    <span className="bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-400 bg-clip-text text-transparent">
                      simplified.
                    </span>
                  </h1>

                  <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
                    Get full visibility over your fleet, trips, and payments
                    across the East African corridor —one platform,
                    end-to-end.
                  </p>

                  <div className="mt-10 flex flex-wrap items-center gap-3">
                    <Button
                      asChild
                      size="lg"
                      className="h-11 rounded-xl px-5 text-base"
                    >
                      <Link href="/dashboard">
                        Open Dashboard
                        <ArrowRightIcon className="ml-1.5 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="h-11 rounded-xl px-5 text-base"
                    >
                      <Link href="#contact">Talk to Sales</Link>
                    </Button>
                    <div className="ml-1 hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                      <ShieldCheckIcon className="h-3.5 w-3.5 text-emerald-500" />
                      Multi-tenant · RBAC · FX-aware
                    </div>
                  </div>
                </AnimatedGroup>
              </div>
            </div>

            {/* Hero product preview — real dashboard mock, no stock photos */}
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.6,
                    },
                  },
                },
                ...transitionVariants,
              }}
            >
              <div className="relative mt-12 px-4 sm:mt-16 md:mt-20">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-b from-transparent to-background"
                />
                <DashboardPreviewCard />
              </div>
            </AnimatedGroup>
          </div>
        </section>

        {/* Corridor stakeholders strip — authentic, not fake tech logos */}
        <section className="bg-background pb-16 pt-20 md:pb-24">
          <div className="mx-auto max-w-5xl px-6">
            <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Built for the East African Community corridor
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {corridorPartners.map((name) => (
                <div
                  key={name}
                  className="flex h-11 items-center justify-center rounded-lg border border-border/50 bg-foreground/[0.02] px-3 text-center text-xs font-medium text-muted-foreground transition-colors hover:border-border hover:text-foreground sm:text-sm"
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
