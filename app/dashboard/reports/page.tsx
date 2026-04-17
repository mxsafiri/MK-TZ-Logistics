import Link from 'next/link';
import { BarChart3Icon, ArrowLeftIcon } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { requireSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Reports' };

function initialsFrom(name: string | null, email: string): string {
  const source = (name ?? email).trim();
  if (!source) return '?';
  const parts = source.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default async function ReportsPage() {
  const session = await requireSession();
  const user = {
    name: session.displayName ?? session.email,
    email: session.email,
    role: session.role,
    orgName: session.orgName,
    initials: initialsFrom(session.displayName, session.email),
  };

  return (
    <DashboardShell user={user}>
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-1.5 rounded-lg border border-border bg-background/40 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground">
          <ArrowLeftIcon className="h-3 w-3" />
          Back
        </Link>
        <h1 className="text-xl font-semibold">Reports & Analytics</h1>
      </div>
      <div className="glass-card rounded-xl p-16 flex flex-col items-center justify-center text-center gap-4">
        <div className="icon-glow-sky rounded-2xl p-5">
          <BarChart3Icon className="h-10 w-10 text-secondary-500 dark:text-secondary-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Advanced Reports — Coming Soon</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
            Deep-dive analytics for your logistics operations. Track revenue trends, fleet
            utilization, driver performance, and payment aging across the corridor.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
