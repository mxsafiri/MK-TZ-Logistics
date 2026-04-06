'use client';

import Link from 'next/link';
import {
  LayoutDashboardIcon,
  PackageIcon,
  TruckIcon,
  FileTextIcon,
  ZapIcon,
  BarChart3Icon,
  ClipboardListIcon,
  MessageSquareIcon,
  SearchIcon,
  XIcon,
  ArrowUpRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const navSections = [
  {
    items: [
      { label: 'Overview', icon: LayoutDashboardIcon, href: '/dashboard' },
      { label: 'Orders', icon: PackageIcon, href: '/dashboard' },
      { label: 'Carriers', icon: TruckIcon, href: '/dashboard' },
      { label: 'Invoices', icon: FileTextIcon, href: '/dashboard' },
    ],
  },
  {
    title: 'Insights',
    items: [
      {
        label: 'Analytics',
        icon: BarChart3Icon,
        href: '/dashboard',
        active: true,
      },
      { label: 'Automations', icon: ZapIcon, href: '/dashboard' },
      { label: 'Reporting', icon: ClipboardListIcon, href: '/dashboard' },
      { label: 'Messages', icon: MessageSquareIcon, href: '/dashboard' },
    ],
  },
];

interface DashboardSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function DashboardSidebar({ open, onClose }: DashboardSidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r
          border-border bg-background
          transition-transform duration-200 ease-in-out
          lg:relative lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-4 rounded-md p-1.5 text-muted-foreground hover:bg-accent lg:hidden transition-colors duration-200"
        >
          <XIcon className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 text-sm font-bold text-white">
            M
          </div>
          <span className="text-base font-bold">MK-TZ Logistics</span>
        </div>

        <div className="px-4 pb-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/30 transition-colors duration-200"
            />
          </div>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 pt-2">
          {navSections.map((section, i) => (
            <div key={i}>
              {section.title && (
                <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {section.title}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <SidebarItem key={item.label} {...item} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="mx-3 mb-4 rounded-xl border border-border bg-accent/50 p-4">
          <p className="text-sm font-medium">Upgrade to Pro</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Real-time GPS tracking, AI-powered route optimization, and unlimited
            fleet management.
          </p>
          <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary-500 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-primary-400">
            Learn more
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </aside>
    </>
  );
}

function SidebarItem({
  label,
  icon: Icon,
  href,
  active,
}: {
  label: string;
  icon: LucideIcon;
  href: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200
        ${
          active
            ? 'bg-primary-500/10 text-primary-500 dark:bg-primary-500/15'
            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
        }
      `}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{label}</span>
    </Link>
  );
}
