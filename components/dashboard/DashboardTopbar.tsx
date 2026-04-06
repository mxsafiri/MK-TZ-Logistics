'use client';

import { MenuIcon, BellIcon } from 'lucide-react';
import { ThemeSwitch } from '@/components/shared/ThemeSwitch';

interface DashboardTopbarProps {
  onMenuClick: () => void;
}

export function DashboardTopbar({ onMenuClick }: DashboardTopbarProps) {
  return (
    <header className="flex h-[4.5rem] items-center justify-between gap-4 px-4 lg:px-6">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-button p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/[0.06] lg:hidden transition-colors duration-200"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white lg:text-2xl">
            Analytics Dashboard
          </h1>
          <p className="hidden text-sm text-gray-500 dark:text-gray-400 sm:block">
            Track your logistics performance in real-time
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <ThemeSwitch />

        {/* Notifications */}
        <button className="relative rounded-button p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/[0.06] transition-colors duration-200">
          <BellIcon className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-status-danger" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-sm font-bold text-white">
            VM
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              Victor M.
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Admin
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
