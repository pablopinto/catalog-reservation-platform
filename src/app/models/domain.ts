export type ProductStatus = 'AVAILABLE' | 'RESERVED' | 'QUEUED' | 'SOLD';
export type EventType = 'RESERVE' | 'QUEUE_JOIN' | 'EXPIRE' | 'SOLD';
export type Period = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
export type MetricType = 'SALES' | 'RESERVATIONS' | 'PICKUP_TIME';
export type Role = 'operator' | 'client';

export interface QueueEntry {
  clientId: string;
  joinedAt: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  status: ProductStatus;
  reservedBy?: string;
  reservedAt?: number;
  reservedUntil?: number;
  queue: QueueEntry[];
  demandScore: number;
  createdAt: number;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
}

export interface DemoEvent {
  id: string;
  type: EventType;
  timestamp: number;
  productId: string;
  clientId?: string;
  amount?: number;
  messageEs: string;
  messageEn: string;
}

export interface DashboardKpi {
  labelKey: string;
  main: string;
  variation: number;
}
