import Link from 'next/link';
import { UsersIcon, ArrowLeftIcon } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { requireSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Team' };

function initialsFrom(name: string | null, email: string): string {
  const source = (name ?? email).trim();
  if (!source) return '?';
  const parts = source.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default async function TeamPage() {
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
        <h1 className="text-xl font-semibold">Team</h1>
      </div>
      <div className="glass-card rounded-xl p-16 flex flex-col items-center justify-center text-center gap-4">
        <div className="icon-glow-purple rounded-2xl p-5">
          <UsersIcon className="h-10 w-10 text-primary-500 dark:text-primary-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Team Management — Coming Soon</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
            Invite team members, assign roles (admin, ops, accountant, driver, viewer),
            and manage access to your organization across the platform.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
