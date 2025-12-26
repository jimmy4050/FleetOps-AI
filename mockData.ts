
import { 
  Vehicle, 
  Driver, 
  VehicleStatus, 
  MaintenanceRecord, 
  Trip, 
  TripStatus, 
  FuelLog, 
  MaintenanceStatus, 
  MaintenanceType,
  Notification,
  NotificationSeverity,
  NotificationCategory
} from './types';

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'Maintenance Due Immediately',
    message: 'Vehicle TX-112-09 (Kenworth) has exceeded its service interval. Brake inspection required.',
    severity: NotificationSeverity.CRITICAL,
    category: NotificationCategory.MAINTENANCE,
    isRead: false,
    metadata: { vehicleId: 'v2' },
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'n2',
    title: 'Document Expiring Soon',
    message: "Sarah Miller's CDL license will expire in 12 days. Renew immediately to avoid downtime.",
    severity: NotificationSeverity.WARNING,
    category: NotificationCategory.EXPIRY,
    isRead: false,
    metadata: { driverId: 'd2' },
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'n3',
    title: 'Fuel Efficiency Drop',
    message: 'Volvo VNL 860 showing 15% decrease in MPG over last 3 trips. Possible fuel line issue.',
    severity: NotificationSeverity.INFO,
    category: NotificationCategory.FUEL,
    isRead: true,
    metadata: { vehicleId: 'v4' },
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export const mockVehicles: Vehicle[] = [
  {
    id: 'v1',
    vin: '1HGCM82635A0',
    registrationNumber: 'CA-883-92',
    make: 'Freightliner',
    model: 'Cascadia',
    year: 2023,
    status: VehicleStatus.ACTIVE,
    lastMaintenance: '2023-12-01',
    nextMaintenance: '2024-06-01',
    mileage: 45230,
    fuelLevel: 78,
    location: { lat: 34.0522, lng: -118.2437, address: 'Los Angeles, CA' },
    driverId: 'd1'
  },
  {
    id: 'v2',
    vin: '2T3W1RFV0MC0',
    registrationNumber: 'TX-112-09',
    make: 'Kenworth',
    model: 'T680',
    year: 2022,
    status: VehicleStatus.MAINTENANCE,
    lastMaintenance: '2023-11-15',
    nextMaintenance: '2024-03-20',
    mileage: 82100,
    fuelLevel: 45,
    location: { lat: 37.7749, lng: -122.4194, address: 'San Francisco, CA' },
    driverId: 'd2'
  },
  {
    id: 'v3',
    vin: '3GKALREK8GL1',
    registrationNumber: 'NY-445-31',
    make: 'Peterbilt',
    model: '579',
    year: 2024,
    status: VehicleStatus.ACTIVE,
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-07-10',
    mileage: 12400,
    fuelLevel: 92,
    location: { lat: 40.7128, lng: -74.0060, address: 'New York, NY' },
    driverId: 'd3'
  },
  {
    id: 'v4',
    vin: '4S4BUAEC6GR0',
    registrationNumber: 'IL-772-88',
    make: 'Volvo',
    model: 'VNL 860',
    year: 2021,
    status: VehicleStatus.IDLE,
    lastMaintenance: '2023-09-01',
    nextMaintenance: '2024-03-01',
    mileage: 125000,
    fuelLevel: 22,
    location: { lat: 41.8781, lng: -87.6298, address: 'Chicago, IL' },
    driverId: 'd4'
  }
];

export const mockDrivers: Driver[] = [
  { 
    id: 'd1', 
    name: 'James Wilson', 
    email: 'j.wilson@fleetops.ai',
    phone: '+1 (555) 123-4567',
    licenseNumber: 'TX-452134', 
    licenseExpiry: '2025-08-14',
    rating: 4.8, 
    status: 'ON_DUTY', 
    vehicleId: 'v1', 
    tripsCompleted: 142,
    joinedAt: '2023-01-15'
  },
  { 
    id: 'd2', 
    name: 'Sarah Miller', 
    email: 's.miller@fleetops.ai',
    phone: '+1 (555) 987-6543',
    licenseNumber: 'CA-992102', 
    licenseExpiry: '2024-04-10',
    rating: 4.9, 
    status: 'OFF_DUTY', 
    vehicleId: 'v2', 
    tripsCompleted: 215,
    joinedAt: '2022-06-20'
  }
];

export const mockMaintenance: MaintenanceRecord[] = [
  { 
    id: 'm1', 
    vehicleId: 'v2', 
    date: '2024-03-20', 
    type: MaintenanceType.REPAIR, 
    status: MaintenanceStatus.IN_PROGRESS,
    cost: 1200, 
    odometer: 82000,
    provider: 'Penske Truck Service',
    description: 'Transmission slipping issues. Full diagnostics and gear sync check.' 
  }
];

export const mockTrips: Trip[] = [];
export const mockFuelLogs: FuelLog[] = [];
