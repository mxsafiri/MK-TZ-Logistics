'use client';

import { useActionState } from 'react';
import { Button } from '@/components/shared/ui/button';
import { Input } from '@/components/shared/ui/input';
import { Label } from '@/components/shared/ui/label';
import { createOrgAction, type OnboardingState } from './actions';

const initialState: OnboardingState = {};

export function OnboardingForm() {
  const [state, formAction, pending] = useActionState(createOrgAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Organization name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="MK-TZ Logistics"
          required
          minLength={2}
          maxLength={120}
          autoComplete="organization"
        />
        {state.fieldErrors?.name && (
          <p className="text-xs text-red-600 dark:text-red-400">
            {state.fieldErrors.name[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="baseCurrency">Base currency</Label>
        <select
          id="baseCurrency"
          name="baseCurrency"
          defaultValue="TZS"
          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="TZS">TZS — Tanzanian Shilling</option>
          <option value="USD">USD — US Dollar</option>
        </select>
        <p className="text-xs text-muted-foreground">
          Reports and totals will display in this currency. Individual trips
          can still be priced in either currency.
        </p>
      </div>

      {state.error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? 'Creating...' : 'Create organization'}
      </Button>
    </form>
  );
}
