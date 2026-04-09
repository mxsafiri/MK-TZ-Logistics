import Link from 'next/link';
import { Suspense } from 'react';
import { SignInForm } from './sign-in-form';

export const metadata = {
  title: 'Sign in',
};

// useSearchParams in the form forces this route to opt out of static
// prerendering. Marking dynamic + wrapping in Suspense satisfies Next 15.
export const dynamic = 'force-dynamic';

export default function SignInPage() {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back. Enter your credentials to access your dashboard.
          </p>
        </div>
        <Suspense fallback={null}>
          <SignInForm />
        </Suspense>
        <p className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/auth/sign-up" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
