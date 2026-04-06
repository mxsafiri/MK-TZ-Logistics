export interface KpiItem {
  label: string;
  icon: 'truck' | 'dollar' | 'users' | 'clock';
}

export interface Trip {
  tripId: string;
  truck: string;
  driver: string;
  deliveryNote: string;
  cargo: string;
  destination: string;
  status: 'delivered' | 'in-transit' | 'pending';
}

export interface PaymentSummary {
  label: string;
  type: 'expected' | 'paid' | 'overdue';
}

export interface CarrierCategory {
  name: string;
  colorClass: string;
}

export const kpiItems: KpiItem[] = [
  { label: 'Total Orders', icon: 'truck' },
  { label: 'Revenue', icon: 'dollar' },
  { label: 'Active Couriers', icon: 'users' },
  { label: 'Hours on Road', icon: 'clock' },
];

export const tripTableColumns = [
  'Trip ID',
  'Truck',
  'Driver',
  'Delivery Note',
  'Cargo',
  'Destination',
  'Revenue',
  'Status',
] as const;

export const paymentCategories: PaymentSummary[] = [
  { label: 'Expected', type: 'expected' },
  { label: 'Paid', type: 'paid' },
  { label: 'Overdue', type: 'overdue' },
];

export const carrierCategories: CarrierCategory[] = [
  { name: 'Trucks', colorClass: 'bg-primary-500' },
  { name: 'Cargo Vans', colorClass: 'bg-secondary-500' },
  { name: 'Trailers', colorClass: 'bg-status-success' },
  { name: 'Cargo Planes', colorClass: 'bg-status-warning' },
  { name: 'Others', colorClass: 'bg-status-danger' },
];
