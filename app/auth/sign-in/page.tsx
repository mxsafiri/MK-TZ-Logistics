import Link from 'next/link';
import { SignInForm } from './sign-in-form';

export const metadata = {
  title: 'Sign in',
};

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
        <SignInForm />
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
