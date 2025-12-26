
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  DRIVER = 'DRIVER'
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export enum VehicleStatus {
  ACTIVE = 'ACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  IDLE = 'IDLE',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE'
}

export interface Vehicle {
  id: string;
  vin: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  status: VehicleStatus;
  lastMaintenance: string;
  nextMaintenance: string;
  mileage: number;
  fuelLevel: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  driverId?: string;
}

export enum TripStatus {
  PLANNED = 'PLANNED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Trip {
  id: string;
  vehicleId: string;
  driverId: string;
  status: TripStatus;
  origin: string;
  destination: string;
  startOdometer: number;
  endOdometer?: number;
  distance?: number;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  notes?: string;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  rating: number;
  status: 'ON_DUTY' | 'OFF_DUTY';
  vehicleId?: string;
  tripsCompleted: number;
  joinedAt: string;
}

export enum NotificationSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL'
}

export enum NotificationCategory {
  MAINTENANCE = 'MAINTENANCE',
  EXPIRY = 'EXPIRY',
  FUEL = 'FUEL',
  TRIP = 'TRIP',
  SYSTEM = 'SYSTEM'
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  severity: NotificationSeverity;
  category: NotificationCategory;
  isRead: boolean;
  metadata?: {
    vehicleId?: string;
    driverId?: string;
    tripId?: string;
    docId?: string;
  };
  createdAt: string;
}

export enum DocumentType {
  LICENSE = 'LICENSE',
  INSURANCE = 'INSURANCE',
  REGISTRATION = 'REGISTRATION',
  INSPECTION = 'INSPECTION',
  CONTRACT = 'CONTRACT',
  OTHER = 'OTHER'
}

export interface FleetDocument {
  id: string;
  name: string;
  type: DocumentType;
  filePath: string;
  fileType: string;
  fileSize: number;
  expiryDate?: string;
  vehicleId?: string;
  driverId?: string;
  uploadedBy: string;
  createdAt: string;
}

export enum MaintenanceStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum MaintenanceType {
  ROUTINE = 'ROUTINE',
  REPAIR = 'REPAIR',
  INSPECTION = 'INSPECTION',
  BREAKDOWN = 'BREAKDOWN'
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  date: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  cost: number;
  description: string;
  odometer: number;
  provider?: string;
  completedAt?: string;
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  driverId: string;
  date: string;
  amount: number;
  cost: number;
  odometer: number;
  location?: string;
  fullTank: boolean;
}
