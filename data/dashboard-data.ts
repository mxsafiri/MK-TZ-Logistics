export interface KpiItem {
  label: string;
  value: string;
  icon: 'truck' | 'dollar' | 'users' | 'clock';
  trend: 'up' | 'down';
  delta: string;
}

export interface RevenueDataPoint {
  month: string;
  currentYear: number;
  previousYear: number;
}

export interface OrderDataPoint {
  month: string;
  orders: number;
}

export interface Trip {
  tripId: string;
  truck: string;
  driver: string;
  deliveryNote: string;
  cargo: string;
  destination: string;
  revenue: number;
  status: 'delivered' | 'in-transit' | 'pending';
}

export interface PaymentCard {
  label: string;
  amount: string;
  count: number;
  type: 'expected' | 'paid' | 'overdue';
}

export interface CarrierSegment {
  name: string;
  value: number;
  color: string;
}

export const kpiData: KpiItem[] = [
  {
    label: 'Total Orders',
    value: '1,174',
    icon: 'truck',
    trend: 'up',
    delta: '+12.5%',
  },
  {
    label: 'Total Paid',
    value: '$8,126,420',
    icon: 'dollar',
    trend: 'up',
    delta: '+8.2%',
  },
  {
    label: 'Available Couriers',
    value: '29',
    icon: 'users',
    trend: 'down',
    delta: '-3.1%',
  },
  {
    label: 'Hours on Road',
    value: '89,011',
    icon: 'clock',
    trend: 'up',
    delta: '+5.7%',
  },
];

export const revenueData: RevenueDataPoint[] = [
  { month: 'Jan', currentYear: 42000, previousYear: 35000 },
  { month: 'Feb', currentYear: 48000, previousYear: 38000 },
  { month: 'Mar', currentYear: 45000, previousYear: 42000 },
  { month: 'Apr', currentYear: 56000, previousYear: 40000 },
  { month: 'May', currentYear: 52000, previousYear: 45000 },
  { month: 'Jun', currentYear: 61000, previousYear: 48000 },
  { month: 'Jul', currentYear: 58000, previousYear: 50000 },
  { month: 'Aug', currentYear: 65000, previousYear: 52000 },
  { month: 'Sep', currentYear: 62000, previousYear: 55000 },
  { month: 'Oct', currentYear: 70000, previousYear: 58000 },
  { month: 'Nov', currentYear: 68000, previousYear: 60000 },
  { month: 'Dec', currentYear: 75000, previousYear: 63000 },
];

export const ordersData: OrderDataPoint[] = [
  { month: 'Jan', orders: 85 },
  { month: 'Feb', orders: 102 },
  { month: 'Mar', orders: 94 },
  { month: 'Apr', orders: 118 },
  { month: 'May', orders: 107 },
  { month: 'Jun', orders: 125 },
  { month: 'Jul', orders: 113 },
  { month: 'Aug', orders: 130 },
  { month: 'Sep', orders: 121 },
  { month: 'Oct', orders: 140 },
  { month: 'Nov', orders: 135 },
  { month: 'Dec', orders: 148 },
];

export const recentTrips: Trip[] = [
  {
    tripId: 'TRP-1041',
    truck: 'Volvo FH16',
    driver: 'James Mwangi',
    deliveryNote: 'DN-20241041',
    cargo: 'Electronics',
    destination: 'Dar es Salaam',
    revenue: 4200,
    status: 'delivered',
  },
  {
    tripId: 'TRP-1042',
    truck: 'Scania R500',
    driver: 'Peter Ochieng',
    deliveryNote: 'DN-20241042',
    cargo: 'Textiles',
    destination: 'Mombasa',
    revenue: 3150,
    status: 'in-transit',
  },
  {
    tripId: 'TRP-1043',
    truck: 'MAN TGX',
    driver: 'Sarah Kimani',
    deliveryNote: 'DN-20241043',
    cargo: 'Agricultural',
    destination: 'Nairobi',
    revenue: 2800,
    status: 'delivered',
  },
  {
    tripId: 'TRP-1044',
    truck: 'Mercedes Actros',
    driver: 'John Otieno',
    deliveryNote: 'DN-20241044',
    cargo: 'Construction',
    destination: 'Arusha',
    revenue: 5600,
    status: 'pending',
  },
  {
    tripId: 'TRP-1045',
    truck: 'DAF XF',
    driver: 'Grace Wanjiku',
    deliveryNote: 'DN-20241045',
    cargo: 'FMCG',
    destination: 'Dodoma',
    revenue: 3800,
    status: 'in-transit',
  },
  {
    tripId: 'TRP-1046',
    truck: 'Iveco Stralis',
    driver: 'David Mutua',
    deliveryNote: 'DN-20241046',
    cargo: 'Machinery',
    destination: 'Kampala',
    revenue: 7200,
    status: 'delivered',
  },
  {
    tripId: 'TRP-1047',
    truck: 'Volvo FH16',
    driver: 'Alice Njeri',
    deliveryNote: 'DN-20241047',
    cargo: 'Pharmaceuticals',
    destination: 'Mwanza',
    revenue: 4500,
    status: 'pending',
  },
];

export const paymentCards: PaymentCard[] = [
  {
    label: 'Expected',
    amount: '$124,500',
    count: 18,
    type: 'expected',
  },
  {
    label: 'Paid',
    amount: '$98,200',
    count: 42,
    type: 'paid',
  },
  {
    label: 'Overdue',
    amount: '$26,300',
    count: 7,
    type: 'overdue',
  },
];

export const carrierSegments: CarrierSegment[] = [
  { name: 'Trucks', value: 42, color: '#7C3AED' },
  { name: 'Cargo Vans', value: 24, color: '#0EA5E9' },
  { name: 'Trailers', value: 18, color: '#22C55E' },
  { name: 'Cargo Planes', value: 10, color: '#F59E0B' },
  { name: 'Others', value: 6, color: '#EF4444' },
];

export const sidebarNavItems = [
  { label: 'Overview', icon: 'layout-dashboard' as const },
  { label: 'Orders', icon: 'package' as const },
  { label: 'Carriers', icon: 'truck' as const },
  { label: 'Invoice', icon: 'file-text' as const },
  { label: 'Automations', icon: 'zap' as const },
  { label: 'Analytics', icon: 'bar-chart-3' as const, active: true },
  { label: 'Reporting', icon: 'clipboard-list' as const },
  { label: 'Messages', icon: 'message-square' as const },
];
