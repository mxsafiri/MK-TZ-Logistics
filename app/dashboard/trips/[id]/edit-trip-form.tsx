'use client';

import { useActionState, useCallback } from 'react';
import { Button } from '@/components/shared/ui/button';
import { Input } from '@/components/shared/ui/input';
import { Label } from '@/components/shared/ui/label';
import { Textarea } from '@/components/shared/ui/textarea';
import { editTripAction, deleteTripAction, type EditTripState } from './actions';

const initialState: EditTripState = {};

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

interface EditTripFormProps {
  tripId: string;
  trucks: TruckOption[];
  drivers: DriverOption[];
  defaultValues: Record<string, string>;
}

function selectClasses() {
  return 'w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) return null;
  return <p className="text-xs text-red-600 dark:text-red-400">{errors[0]}</p>;
}

export function EditTripForm({
  tripId,
  trucks,
  drivers,
  defaultValues: dv,
}: EditTripFormProps) {
  const boundAction = useCallback(
    (prev: EditTripState, formData: FormData) =>
      editTripAction(tripId, prev, formData),
    [tripId],
  );
  const [state, formAction, pending] = useActionState(boundAction, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="tripDate">Trip date *</Label>
          <Input id="tripDate" name="tripDate" type="date" defaultValue={dv.tripDate} required />
          <FieldError errors={state.fieldErrors?.tripDate} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select id="status" name="status" defaultValue={dv.status} className={selectClasses()}>
            <option value="planned">Planned</option>
            <option value="in_transit">In transit</option>
            <option value="offloaded">Offloaded</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentStatus">Payment status</Label>
          <select id="paymentStatus" name="paymentStatus" defaultValue={dv.paymentStatus} className={selectClasses()}>
            <option value="pending">Pending</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="truckId">Truck</Label>
          <select id="truckId" name="truckId" defaultValue={dv.truckId} className={selectClasses()}>
            <option value="">-- Select a truck --</option>
            {trucks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.plateNumber}
                {t.make || t.model ? ` - ${[t.make, t.model].filter(Boolean).join(' ')}` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="driverId">Driver</Label>
          <select id="driverId" name="driverId" defaultValue={dv.driverId} className={selectClasses()}>
            <option value="">-- Select a driver --</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
                {d.phone ? ` - ${d.phone}` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="deliveryNoteNo">Delivery note #</Label>
          <Input id="deliveryNoteNo" name="deliveryNoteNo" type="text" maxLength={64} defaultValue={dv.deliveryNoteNo} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="poNumber">PO number</Label>
          <Input id="poNumber" name="poNumber" type="text" maxLength={64} defaultValue={dv.poNumber} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="cargoDescription">Cargo</Label>
          <Input id="cargoDescription" name="cargoDescription" type="text" maxLength={255} defaultValue={dv.cargoDescription} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="origin">Origin</Label>
          <Input id="origin" name="origin" type="text" maxLength={128} defaultValue={dv.origin} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="destination">Destination</Label>
          <Input id="destination" name="destination" type="text" maxLength={128} defaultValue={dv.destination} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="distanceKm">Distance (km)</Label>
          <Input id="distanceKm" name="distanceKm" type="number" min={0} step={1} defaultValue={dv.distanceKm} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <select id="currency" name="currency" defaultValue={dv.currency} className={selectClasses()}>
            <option value="TZS">TZS</option>
            <option value="USD">USD</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="freightAdvance">Freight advance</Label>
          <Input id="freightAdvance" name="freightAdvance" type="number" min={0} step="any" defaultValue={dv.freightAdvance} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="freightComplete">Freight completion</Label>
          <Input id="freightComplete" name="freightComplete" type="number" min={0} step="any" defaultValue={dv.freightComplete} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" name="notes" rows={3} defaultValue={dv.notes} />
        </div>
      </div>

      {state.error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {state.error}
        </p>
      )}

      <div className="flex items-center justify-between">
        <DeleteTripButton tripId={tripId} />
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving...' : 'Update trip'}
        </Button>
      </div>
    </form>
  );
}

function DeleteTripButton({ tripId }: { tripId: string }) {
  return (
    <form
      action={async () => {
        if (!confirm('Delete this trip? This action cannot be undone.')) return;
        const result = await deleteTripAction(tripId);
        if (result?.error) alert(result.error);
      }}
    >
      <Button type="submit" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20">
        Delete trip
      </Button>
    </form>
  );
}
