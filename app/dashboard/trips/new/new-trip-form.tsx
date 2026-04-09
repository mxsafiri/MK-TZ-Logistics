'use client';

import { useActionState } from 'react';
import { Button } from '@/components/shared/ui/button';
import { Input } from '@/components/shared/ui/input';
import { Label } from '@/components/shared/ui/label';
import { Textarea } from '@/components/shared/ui/textarea';
import { createTripAction, type NewTripState } from './actions';

const initialState: NewTripState = {};

interface Option {
  id: string;
}

interface TruckOption extends Option {
  plateNumber: string;
  make: string | null;
  model: string | null;
}

interface DriverOption extends Option {
  name: string;
  phone: string | null;
}

interface NewTripFormProps {
  trucks: TruckOption[];
  drivers: DriverOption[];
  defaultCurrency: 'TZS' | 'USD';
}

function selectClasses() {
  return 'w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) return null;
  return <p className="text-xs text-red-600 dark:text-red-400">{errors[0]}</p>;
}

export function NewTripForm({
  trucks,
  drivers,
  defaultCurrency,
}: NewTripFormProps) {
  const [state, formAction, pending] = useActionState(
    createTripAction,
    initialState,
  );
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="tripDate">Trip date *</Label>
          <Input
            id="tripDate"
            name="tripDate"
            type="date"
            defaultValue={today}
            required
          />
          <FieldError errors={state.fieldErrors?.tripDate} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select id="status" name="status" defaultValue="planned" className={selectClasses()}>
            <option value="planned">Planned</option>
            <option value="in_transit">In transit</option>
            <option value="offloaded">Offloaded</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="truckId">Truck</Label>
          <select id="truckId" name="truckId" className={selectClasses()}>
            <option value="">— Select a truck —</option>
            {trucks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.plateNumber}
                {t.make || t.model ? ` · ${[t.make, t.model].filter(Boolean).join(' ')}` : ''}
              </option>
            ))}
          </select>
          {trucks.length === 0 && (
            <p className="text-xs text-muted-foreground">
              No trucks yet. Add one from Fleet settings to assign it here.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="driverId">Driver</Label>
          <select id="driverId" name="driverId" className={selectClasses()}>
            <option value="">— Select a driver —</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
                {d.phone ? ` · ${d.phone}` : ''}
              </option>
            ))}
          </select>
          {drivers.length === 0 && (
            <p className="text-xs text-muted-foreground">
              No drivers yet. Add one from Fleet settings.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="deliveryNoteNo">Delivery note #</Label>
          <Input
            id="deliveryNoteNo"
            name="deliveryNoteNo"
            type="text"
            maxLength={64}
            placeholder="DN-2026-0412"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="poNumber">PO number</Label>
          <Input
            id="poNumber"
            name="poNumber"
            type="text"
            maxLength={64}
            placeholder="PO-001"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="cargoDescription">Cargo</Label>
          <Input
            id="cargoDescription"
            name="cargoDescription"
            type="text"
            maxLength={255}
            placeholder="Maize, cement, containers, etc."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="origin">Origin</Label>
          <Input id="origin" name="origin" type="text" maxLength={128} placeholder="Dar es Salaam" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="destination">Destination</Label>
          <Input
            id="destination"
            name="destination"
            type="text"
            maxLength={128}
            placeholder="Nairobi"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="distanceKm">Distance (km)</Label>
          <Input
            id="distanceKm"
            name="distanceKm"
            type="number"
            min={0}
            step={1}
            placeholder="880"
          />
          <FieldError errors={state.fieldErrors?.distanceKm} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <select
            id="currency"
            name="currency"
            defaultValue={defaultCurrency}
            className={selectClasses()}
          >
            <option value="TZS">TZS</option>
            <option value="USD">USD</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="freightAdvance">Freight advance</Label>
          <Input
            id="freightAdvance"
            name="freightAdvance"
            type="number"
            min={0}
            step="any"
            defaultValue="0"
          />
          <FieldError errors={state.fieldErrors?.freightAdvance} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="freightComplete">Freight completion</Label>
          <Input
            id="freightComplete"
            name="freightComplete"
            type="number"
            min={0}
            step="any"
            defaultValue="0"
          />
          <FieldError errors={state.fieldErrors?.freightComplete} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" name="notes" rows={3} placeholder="PO remarks, delays, etc." />
        </div>
      </div>

      {state.error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {state.error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving...' : 'Save trip'}
        </Button>
      </div>
    </form>
  );
}
