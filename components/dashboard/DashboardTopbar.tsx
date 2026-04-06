'use client';

import { MenuIcon, BellIcon } from 'lucide-react';
import { ThemeSwitch } from '@/components/shared/ThemeSwitch';

interface DashboardTopbarProps {
  onMenuClick: () => void;
}

export function DashboardTopbar({ onMenuClick }: DashboardTopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-border px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-md p-2 text-muted-foreground hover:bg-accent lg:hidden transition-colors duration-200"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-semibold lg:text-xl">
            Analytics
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeSwitch />

        <button className="relative rounded-md p-2 text-muted-foreground hover:bg-accent transition-colors duration-200">
          <BellIcon className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-xs font-bold text-white">
            VM
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-none">Victor M.</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
