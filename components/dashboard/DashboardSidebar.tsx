'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboardIcon,
  PackageIcon,
  TruckIcon,
  FileTextIcon,
  BarChart3Icon,
  UsersIcon,
  SettingsIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const navSections = [
  {
    items: [
      { label: 'Overview', icon: LayoutDashboardIcon, href: '/dashboard' },
      { label: 'Trips', icon: PackageIcon, href: '/dashboard/trips' },
      { label: 'Fleet', icon: TruckIcon, href: '/dashboard/fleet' },
    ],
  },
  {
    title: 'Manage',
    items: [
      { label: 'Invoices', icon: FileTextIcon, href: '/dashboard/invoices' },
      { label: 'Reports', icon: BarChart3Icon, href: '/dashboard/reports' },
      { label: 'Team', icon: UsersIcon, href: '/dashboard/team' },
      { label: 'Settings', icon: SettingsIcon, href: '/dashboard/settings' },
    ],
  },
];

interface DashboardSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function DashboardSidebar({ open, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col
          glass-sidebar
          transition-transform duration-200 ease-in-out
          lg:relative lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-4 rounded-md p-1.5 text-muted-foreground hover:text-foreground lg:hidden transition-colors duration-200"
        >
          <XIcon className="h-5 w-5" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="relative h-9 w-9 overflow-hidden rounded-full ring-1 ring-border/60">
            <Image
              src="/static/images/logo.png"
              alt="MK-TZ"
              fill
              sizes="36px"
              className="object-cover"
            />
          </div>
          <span className="text-base font-bold text-foreground">MK-TZ Logistics</span>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
            <input
              type="text"
              placeholder="Search..."
              className="h-9 w-full rounded-lg border border-border bg-background/50 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary-500/40 focus:outline-none focus:ring-1 focus:ring-primary-500/20 transition-colors duration-200"
            />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 pt-2">
          {navSections.map((section, i) => (
            <div key={i}>
              {section.title && (
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">
                  {section.title}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive =
                    item.href === '/dashboard'
                      ? pathname === '/dashboard'
                      : pathname.startsWith(item.href);
                  return (
                    <SidebarItem
                      key={item.label}
                      {...item}
                      active={isActive}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
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
        flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200
        ${
          active
            ? 'nav-glow text-foreground'
            : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
        }
      `}
    >
      <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-primary-500' : ''}`} />
      <span>{label}</span>
    </Link>
  );
}
