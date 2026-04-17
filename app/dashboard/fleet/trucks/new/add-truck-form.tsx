'use client';

import { useActionState } from 'react';
import { Button } from '@/components/shared/ui/button';
import { Input } from '@/components/shared/ui/input';
import { Label } from '@/components/shared/ui/label';
import { addTruckAction, type AddTruckState } from './actions';

const initialState: AddTruckState = {};

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) return null;
  return <p className="text-xs text-red-600 dark:text-red-400">{errors[0]}</p>;
}

function selectClasses() {
  return 'w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
}

export function AddTruckForm() {
  const [state, formAction, pending] = useActionState(
    addTruckAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="plateNumber">Plate number *</Label>
          <Input
            id="plateNumber"
            name="plateNumber"
            type="text"
            maxLength={32}
            placeholder="T 123 ABC"
            required
          />
          <FieldError errors={state.fieldErrors?.plateNumber} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="make">Make</Label>
          <Input
            id="make"
            name="make"
            type="text"
            maxLength={64}
            placeholder="Scania"
          />
          <FieldError errors={state.fieldErrors?.make} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            name="model"
            type="text"
            maxLength={64}
            placeholder="R500"
          />
          <FieldError errors={state.fieldErrors?.model} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="capacityKg">Capacity (kg)</Label>
          <Input
            id="capacityKg"
            name="capacityKg"
            type="number"
            min={1}
            step={1}
            placeholder="30000"
          />
          <FieldError errors={state.fieldErrors?.capacityKg} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehicleType">Vehicle type</Label>
          <select
            id="vehicleType"
            name="vehicleType"
            defaultValue=""
            className={selectClasses()}
          >
            <option value="">-- Select --</option>
            <option value="truck">Truck</option>
            <option value="trailer">Trailer</option>
            <option value="van">Van</option>
            <option value="other">Other</option>
          </select>
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
          {pending ? 'Saving...' : 'Add truck'}
        </Button>
      </div>
    </form>
  );
}
