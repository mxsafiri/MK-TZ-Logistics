import Link from 'next/link';
import { SignUpForm } from './sign-up-form';

export const metadata = {
  title: 'Sign up',
};

export default function SignUpPage() {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
          <p className="text-sm text-muted-foreground">
            Start managing your logistics operations in minutes.
          </p>
        </div>
        <SignUpForm />
        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/sign-in" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
