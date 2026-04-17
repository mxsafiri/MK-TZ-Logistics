import Link from 'next/link';
import { SettingsIcon, ArrowLeftIcon } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { requireSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Settings' };

function initialsFrom(name: string | null, email: string): string {
  const source = (name ?? email).trim();
  if (!source) return '?';
  const parts = source.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default async function SettingsPage() {
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
        <h1 className="text-xl font-semibold">Settings</h1>
      </div>

      {/* Org info card — read-only for now */}
      <div className="glass-card rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold">Organization</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Name</p>
            <p className="text-sm font-medium">{session.orgName || '—'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Slug</p>
            <p className="text-sm font-medium text-muted-foreground">{session.orgSlug || '—'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Base Currency</p>
            <p className="text-sm font-medium">{session.baseCurrency}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Your Role</p>
            <p className="text-sm font-medium capitalize">{session.role}</p>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold">Account</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Name</p>
            <p className="text-sm font-medium">{session.displayName || '—'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Email</p>
            <p className="text-sm font-medium">{session.email}</p>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-8 flex flex-col items-center justify-center text-center gap-3">
        <SettingsIcon className="h-8 w-8 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          Full settings management — currency, org details, notifications, integrations — coming soon.
        </p>
      </div>
    </DashboardShell>
  );
}
