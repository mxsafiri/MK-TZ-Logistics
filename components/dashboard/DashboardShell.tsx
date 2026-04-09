'use client';

import { useState } from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardTopbar } from './DashboardTopbar';

interface DashboardShellProps {
  user: {
    name: string;
    email: string;
    role: string;
    orgName: string;
    initials: string;
  };
  children: React.ReactNode;
}

/**
 * Client wrapper that owns the mobile sidebar open/close state. The page body
 * itself remains a Server Component so data fetching stays on the server.
 */
export function DashboardShell({ user, children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full dashboard-surface text-foreground">
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardTopbar onMenuClick={() => setSidebarOpen(true)} user={user} />

        <main className="flex-1 overflow-y-auto px-4 pb-8 pt-6 lg:px-6">
          <div className="mx-auto max-w-screen-2xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
