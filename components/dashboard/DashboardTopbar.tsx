'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MenuIcon, BellIcon, ZapIcon, PlusIcon, TruckIcon, UserIcon, LogOutIcon } from 'lucide-react';
import { ThemeSwitch } from '@/components/shared/ThemeSwitch';
import { authClient } from '@/lib/auth/client';

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
  const router = useRouter();
  const [quickOpen, setQuickOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const quickRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (quickRef.current && !quickRef.current.contains(e.target as Node)) setQuickOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  async function handleSignOut() {
    await authClient.signOut();
    router.push('/auth/sign-in');
    router.refresh();
  }

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
          <h1 className="text-lg font-semibold text-foreground lg:text-xl">Overview</h1>
          <p className="text-[11px] text-muted-foreground leading-none">{user.orgName}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeSwitch />

        {/* Quick Actions */}
        <div className="relative" ref={quickRef}>
          <button
            onClick={() => setQuickOpen((v) => !v)}
            className="relative flex items-center gap-1.5 rounded-lg border border-border bg-background/40 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:bg-foreground/5 hover:text-foreground"
          >
            <ZapIcon className="h-3.5 w-3.5 text-amber-500" />
            <span className="hidden sm:inline">Quick Actions</span>
          </button>
          {quickOpen && (
            <div className="absolute right-0 top-full mt-2 z-50 w-52 rounded-xl border border-border bg-background/95 shadow-lg backdrop-blur-xl p-1.5">
              <Link
                href="/dashboard/trips/new"
                onClick={() => setQuickOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-foreground/5 hover:text-foreground transition-colors"
              >
                <PlusIcon className="h-4 w-4 text-primary-500" />
                New Trip
              </Link>
              <Link
                href="/dashboard/fleet/trucks/new"
                onClick={() => setQuickOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-foreground/5 hover:text-foreground transition-colors"
              >
                <TruckIcon className="h-4 w-4 text-secondary-500" />
                Add Truck
              </Link>
              <Link
                href="/dashboard/fleet/drivers/new"
                onClick={() => setQuickOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-foreground/5 hover:text-foreground transition-colors"
              >
                <UserIcon className="h-4 w-4 text-emerald-500" />
                Add Driver
              </Link>
            </div>
          )}
        </div>

        {/* Notifications — bell with no badge until we have real notifications */}
        <button className="relative rounded-lg border border-border bg-background/40 p-2 text-muted-foreground transition-colors duration-200 hover:bg-foreground/5 hover:text-foreground">
          <BellIcon className="h-4 w-4" />
        </button>

        {/* User avatar + dropdown */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setUserOpen((v) => !v)}
            className="flex items-center gap-2.5 rounded-lg border border-border bg-background/40 px-2.5 py-1.5 ml-1 transition-colors hover:bg-foreground/5"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-[10px] font-bold text-white ring-2 ring-primary-500/20">
              {user.initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-medium text-foreground leading-none">{user.name}</p>
              <p className="text-[10px] text-muted-foreground capitalize">{user.role}</p>
            </div>
          </button>
          {userOpen && (
            <div className="absolute right-0 top-full mt-2 z-50 w-52 rounded-xl border border-border bg-background/95 shadow-lg backdrop-blur-xl p-1.5">
              <div className="px-3 py-2 border-b border-border/60 mb-1">
                <p className="text-xs font-medium truncate">{user.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
              </div>
              <Link
                href="/dashboard/settings"
                onClick={() => setUserOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-foreground/5 hover:text-foreground transition-colors"
              >
                Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <LogOutIcon className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
