import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { OnboardingForm } from './onboarding-form';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Set up your organization' };

export default async function OnboardingPage() {
  const session = await getSession();
  if (!session) redirect('/auth/sign-in');
  if (session.orgId) redirect('/dashboard');

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Set up your organization
          </h1>
          <p className="text-sm text-muted-foreground">
            Create a workspace for your logistics operations. You can invite
            teammates and drivers after this step.
          </p>
        </div>
        <OnboardingForm />
      </div>
    </div>
  );
}
