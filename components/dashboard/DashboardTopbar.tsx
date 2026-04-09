'use client';

import { MenuIcon, BellIcon, ZapIcon } from 'lucide-react';
import { ThemeSwitch } from '@/components/shared/ThemeSwitch';

interface DashboardTopbarProps {
  onMenuClick: () => void;
  user: {
    name: string;
    email: string;
    role: string;
    orgName: string;
    initials: string;
  };
}

export function DashboardTopbar({ onMenuClick, user }: DashboardTopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between gap-4 glass-topbar px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-md p-2 text-muted-foreground hover:text-foreground lg:hidden transition-colors duration-200"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-foreground lg:text-xl">
            Overview
          </h1>
          <p className="text-[11px] text-muted-foreground leading-none">
            {user.orgName}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeSwitch />

        {/* Quick actions */}
        <button className="relative flex items-center gap-1.5 rounded-lg border border-border bg-background/40 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:bg-foreground/5 hover:text-foreground">
          <ZapIcon className="h-3.5 w-3.5 text-amber-500" />
          <span className="hidden sm:inline">Quick Actions</span>
        </button>

        {/* Notifications */}
        <button className="relative rounded-lg border border-border bg-background/40 p-2 text-muted-foreground transition-colors duration-200 hover:bg-foreground/5 hover:text-foreground">
          <BellIcon className="h-4 w-4" />
          <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-primary-500 px-1 text-[10px] font-bold text-white">
            2
          </span>
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2.5 rounded-lg border border-border bg-background/40 px-2.5 py-1.5 ml-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-[10px] font-bold text-white ring-2 ring-primary-500/20">
            {user.initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-foreground leading-none">
              {user.name}
            </p>
            <p className="text-[10px] text-muted-foreground capitalize">
              {user.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
