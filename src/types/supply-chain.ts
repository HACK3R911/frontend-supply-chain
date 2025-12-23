// Статусы
export type OrderStatus = 'pending' | 'in_transit' | 'delivered' | 'cancelled';
export type CargoStatus = 'at_warehouse' | 'in_transit' | 'delivered' | 'delayed';
export type EventType = 'created' | 'departed' | 'arrived' | 'delivered' | 'delayed' | 'customs';
export type ContractorRole = 'supplier' | 'carrier' | 'client';
export type WarehouseType = 'main' | 'transit' | 'distribution';
export type TransportType = 'truck' | 'ship' | 'plane' | 'train';
export type RouteLegStatus = 'completed' | 'active' | 'pending';

// Контрагент (соответствует Go модели)
export interface Contractor {
  id: number;
  name: string;
  type: string; // e.g., supplier, carrier, client
  contact: string;
  created_at: string;
  updated_at: string;
}

// Склад
export interface Warehouse {
  id: string;
  name: string;
  address: string;
  type: WarehouseType;
  contactPersonId?: string;
}

// Транспортное средство
export interface Transport {
  regNumber: string;
  type: TransportType;
  capacity: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  contractorId?: string;
}

// Заказ
export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  shipmentDate?: string;
  deliveryDate?: string;
  totalCost: number;
  status: OrderStatus;
  senderId: string;
  recipientId: string;
  // Связанные данные для отображения
  sender?: Contractor;
  recipient?: Contractor;
  cargos?: Cargo[];
}

// Груз
export interface Cargo {
  id: string;
  cargoId: string;
  orderId: string;
  weight: number;
  volume: number;
  description: string;
  currentStatus: CargoStatus;
  // Связанные данные
  order?: Order;
  routeLegs?: RouteLeg[];
}

// Участок маршрута
export interface RouteLeg {
  id: string;
  cargoId: string;
  startWarehouseId: string;
  endWarehouseId: string;
  sequenceOrder: number;
  plannedStart?: string;
  assignedTransportId?: string;
  status: RouteLegStatus;
  // Связанные данные
  startWarehouse?: Warehouse;
  endWarehouse?: Warehouse;
  assignedTransport?: Transport;
  events?: TrackingEvent[];
}

// Событие
export interface TrackingEvent {
  id: string;
  routeLegId: string;
  eventType: EventType;
  timestamp: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  description: string;
}

// Для совместимости со старым кодом
export interface RouteSegment {
  id: string;
  from: string;
  to: string;
  status: RouteLegStatus;
  startTime?: string;
  endTime?: string;
  transportType: TransportType;
}
