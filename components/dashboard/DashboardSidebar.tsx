'use client';

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
  SparklesIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { sidebarNavItems } from '@/data/dashboard-data';

const iconMap: Record<string, LucideIcon> = {
  'layout-dashboard': LayoutDashboardIcon,
  package: PackageIcon,
  truck: TruckIcon,
  'file-text': FileTextIcon,
  zap: ZapIcon,
  'bar-chart-3': BarChart3Icon,
  'clipboard-list': ClipboardListIcon,
  'message-square': MessageSquareIcon,
};

interface DashboardSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function DashboardSidebar({ open, onClose }: DashboardSidebarProps) {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col
          bg-white/80 backdrop-blur-xl dark:bg-navy-800/90
          border-r border-gray-200 dark:border-white/[0.06]
          transition-transform duration-200 ease-in-out
          lg:relative lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Close button (mobile) */}
        <button
          onClick={onClose}
          className="absolute right-3 top-4 rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/[0.06] lg:hidden transition-colors duration-200"
        >
          <XIcon className="h-5 w-5" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-button bg-gradient-to-br from-primary-500 to-secondary-500 font-bold text-white">
            M
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            MK-TZ Logistics
          </span>
        </div>

        {/* Search */}
        <div className="px-4 pb-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="h-9 w-full rounded-pill border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/30 dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-gray-200 dark:placeholder:text-gray-500 transition-colors duration-200"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {sidebarNavItems.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboardIcon;
            return (
              <button
                key={item.label}
                className={`
                  group flex w-full items-center gap-3 rounded-button px-3 py-2.5 text-sm font-medium
                  transition-all duration-200
                  ${
                    item.active
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-glow-sm'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/[0.06]'
                  }
                `}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Upgrade card */}
        <div className="mx-3 mb-4 rounded-card bg-gradient-to-br from-primary-500/10 via-primary-500/5 to-secondary-500/10 p-4 dark:from-primary-500/20 dark:via-primary-800/10 dark:to-secondary-500/10">
          <div className="mb-2 flex items-center gap-2">
            <SparklesIcon className="h-4 w-4 text-primary-500" />
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              Pro Plan
            </span>
          </div>
          <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
            Unlock real-time tracking, AI insights & unlimited fleet management.
          </p>
          <button className="w-full rounded-button bg-primary-500 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-400 hover:shadow-glow-sm">
            Upgrade Now
          </button>
        </div>
      </aside>
    </>
  );
}
