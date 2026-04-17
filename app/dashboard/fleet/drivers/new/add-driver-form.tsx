'use client';

import { useActionState } from 'react';
import { Button } from '@/components/shared/ui/button';
import { Input } from '@/components/shared/ui/input';
import { Label } from '@/components/shared/ui/label';
import { addDriverAction, type AddDriverState } from './actions';

const initialState: AddDriverState = {};

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) return null;
  return <p className="text-xs text-red-600 dark:text-red-400">{errors[0]}</p>;
}

export function AddDriverForm() {
  const [state, formAction, pending] = useActionState(
    addDriverAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            name="name"
            type="text"
            maxLength={255}
            placeholder="John Mwangi"
            required
          />
          <FieldError errors={state.fieldErrors?.name} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            maxLength={32}
            placeholder="+255 712 345 678"
          />
          <FieldError errors={state.fieldErrors?.phone} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="licenseNo">License number</Label>
          <Input
            id="licenseNo"
            name="licenseNo"
            type="text"
            maxLength={64}
            placeholder="DL-123456"
          />
          <FieldError errors={state.fieldErrors?.licenseNo} />
        </div>

        <div className="flex items-end space-x-2 pb-1">
          <input
            id="active"
            name="active"
            type="checkbox"
            defaultChecked
            className="h-4 w-4 rounded border-border"
          />
          <Label htmlFor="active" className="cursor-pointer">
            Active
          </Label>
        </div>
      </div>

      {state.error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {state.error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving...' : 'Add driver'}
        </Button>
      </div>
    </form>
  );
}
