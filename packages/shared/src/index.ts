export type RoleType = 'CITIZEN' | 'STAFF' | 'ADMIN';

export type RequestStatus = 'SUBMITTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

export type CivicCategory =
  | 'ROADS'
  | 'STREET_LIGHTS'
  | 'GARBAGE'
  | 'WATER'
  | 'DRAINAGE'
  | 'PUBLIC_SPACES'
  | 'NOISE'
  | 'STRAY_ANIMALS'
  | 'OTHER';

export type PaymentStatus = 'INITIATED' | 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'REFUNDED';

export type IntegrationMode = 'LIVE' | 'SANDBOX' | 'DEMO' | 'INFORMATIONAL' | 'UNAVAILABLE';

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  role: RoleType;
  departmentId?: string | null;
  createdAt: string;
}

export interface CivicRequestDTO {
  id: string;
  publicRequestId: string;
  citizenId: string;
  citizenName?: string;
  citizenPhone?: string;
  categoryId: string;
  categoryName: string;
  title: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  landmark?: string | null;
  status: RequestStatus;
  departmentId?: string | null;
  departmentName?: string | null;
  assignedStaffId?: string | null;
  assignedStaffName?: string | null;
  photos: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
  statusHistory?: RequestStatusHistoryDTO[];
  comments?: RequestCommentDTO[];
}

export interface RequestStatusHistoryDTO {
  id: string;
  requestId: string;
  previousStatus: RequestStatus | null;
  newStatus: RequestStatus;
  changedById: string;
  changedByName: string;
  note?: string | null;
  createdAt: string;
}

export interface RequestCommentDTO {
  id: string;
  requestId: string;
  authorId: string;
  authorName: string;
  authorRole: RoleType;
  message: string;
  createdAt: string;
}

export interface UtilityBillDTO {
  id: string;
  providerCode: string;
  providerName: string;
  serviceType: 'ELECTRICITY' | 'WATER' | 'PROPERTY_TAX' | 'OTHER';
  accountReference: string;
  customerName: string;
  amountMinor: number;
  amountFormatted: string;
  currency: string;
  billingPeriod: string;
  dueDate: string;
  dueInDays: number;
  billStatus: 'UNPAID' | 'PAID' | 'OVERDUE';
}

export interface PaymentTransactionDTO {
  id: string;
  transactionId: string;
  userId: string;
  billId?: string;
  providerName: string;
  serviceType: string;
  accountReference: string;
  amountMinor: number;
  amountFormatted: string;
  currency: string;
  gateway: string;
  paymentMethod: string;
  status: PaymentStatus;
  createdAt: string;
  receiptNumber: string;
  isSimulated: boolean;
}

export interface NotificationDTO {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'REQUEST_UPDATE' | 'PAYMENT' | 'CIVIC_ALERT' | 'SYSTEM';
  readAt?: string | null;
  relatedEntityId?: string | null;
  createdAt: string;
}

export interface CivicLocationDTO {
  id: string;
  name: string;
  category: 'MUNICIPAL' | 'POLICE' | 'HOSPITAL' | 'TRANSPORT' | 'POST_OFFICE';
  address: string;
  latitude: number;
  longitude: number;
  distanceKm?: number;
  phone?: string;
  openingHours?: string;
  isOpenNow: boolean;
}

export interface CivicServiceDTO {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  iconBgColor?: string;
  badge?: string;
  integrationMode: IntegrationMode;
  isEnabled: boolean;
}
