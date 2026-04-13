'use client';

import { useActionState, useCallback } from 'react';
import { Button } from '@/components/shared/ui/button';
import { Input } from '@/components/shared/ui/input';
import { Label } from '@/components/shared/ui/label';
import { Textarea } from '@/components/shared/ui/textarea';
import { recordPaymentAction, type RecordPaymentState } from './actions';

const initialState: RecordPaymentState = {};

function selectClasses() {
  return 'w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) return null;
  return <p className="text-xs text-red-600 dark:text-red-400">{errors[0]}</p>;
}

export function RecordPaymentForm({
  tripId,
  defaultCurrency,
}: {
  tripId: string;
  defaultCurrency: 'TZS' | 'USD';
}) {
  const boundAction = useCallback(
    (prev: RecordPaymentState, formData: FormData) =>
      recordPaymentAction(tripId, prev, formData),
    [tripId],
  );
  const [state, formAction, pending] = useActionState(boundAction, initialState);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount *</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          min={0}
          step="any"
          required
          placeholder="500000"
        />
        <FieldError errors={state.fieldErrors?.amount} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <select id="currency" name="currency" defaultValue={defaultCurrency} className={selectClasses()}>
            <option value="TZS">TZS</option>
            <option value="USD">USD</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="method">Method</Label>
          <select id="method" name="method" className={selectClasses()}>
            <option value="">--</option>
            <option value="bank">Bank transfer</option>
            <option value="mobile_money">Mobile money</option>
            <option value="cash">Cash</option>
            <option value="cheque">Cheque</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="paidAt">Payment date *</Label>
        <Input id="paidAt" name="paidAt" type="date" defaultValue={today} required />
        <FieldError errors={state.fieldErrors?.paidAt} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reference">Reference / receipt #</Label>
        <Input id="reference" name="reference" type="text" maxLength={128} placeholder="TXN-12345" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={2} placeholder="Partial advance payment..." />
      </div>

      {state.error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? 'Recording...' : 'Record payment'}
      </Button>
    </form>
  );
}
