// API типы для запросов и ответов
// Эти типы соответствуют структуре данных Go бэкенда

import {
  Contractor,
  Warehouse,
  Transport,
  Order,
  Cargo,
  RouteLeg,
  TrackingEvent,
  ContractorRole,
  WarehouseType,
  TransportType,
  OrderStatus,
  CargoStatus,
  RouteLegStatus,
  EventType,
} from './supply-chain';

// ============ Contractor ============
export interface CreateContractorRequest {
  name: string;
  type: string; // e.g., supplier, carrier, client
  contact: string;
}

export interface UpdateContractorRequest extends Partial<CreateContractorRequest> {
  id: number;
}

export type ContractorResponse = Contractor;
export type ContractorsListResponse = Contractor[];

// ============ Warehouse ============
export interface CreateWarehouseRequest {
  name: string;
  address: string;
  type: WarehouseType;
  contactPersonId?: string;
}

export interface UpdateWarehouseRequest extends Partial<CreateWarehouseRequest> {
  id: string;
}

export type WarehouseResponse = Warehouse;
export type WarehousesListResponse = Warehouse[];

// ============ Transport ============
export interface CreateTransportRequest {
  regNumber: string;
  type: TransportType;
  capacity: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  contractorId?: string;
}

export interface UpdateTransportRequest extends Partial<Omit<CreateTransportRequest, 'regNumber'>> {
  regNumber: string;
}

export type TransportResponse = Transport;
export type TransportListResponse = Transport[];

// ============ Order ============
export interface CreateOrderRequest {
  orderNumber: string;
  shipmentDate?: string;
  deliveryDate?: string;
  totalCost: number;
  status: OrderStatus;
  senderId: string;
  recipientId: string;
}

export interface UpdateOrderRequest extends Partial<Omit<CreateOrderRequest, 'orderNumber'>> {
  id: string;
}

export type OrderResponse = Order;
export type OrdersListResponse = Order[];

// ============ Cargo ============
export interface CreateCargoRequest {
  cargoId: string;
  orderId: string;
  weight: number;
  volume: number;
  description: string;
  currentStatus: CargoStatus;
}

export interface UpdateCargoRequest extends Partial<Omit<CreateCargoRequest, 'cargoId'>> {
  id: string;
}

export type CargoResponse = Cargo;
export type CargosListResponse = Cargo[];

// ============ RouteLeg ============
export interface CreateRouteLegRequest {
  cargoId: string;
  startWarehouseId: string;
  endWarehouseId: string;
  sequenceOrder: number;
  plannedStart?: string;
  assignedTransportId?: string;
  status: RouteLegStatus;
}

export interface UpdateRouteLegRequest extends Partial<CreateRouteLegRequest> {
  id: string;
}

export type RouteLegResponse = RouteLeg;
export type RouteLegsListResponse = RouteLeg[];

// ============ TrackingEvent ============
export interface CreateEventRequest {
  routeLegId: string;
  eventType: EventType;
  timestamp: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  description: string;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  id: string;
}

export type EventResponse = TrackingEvent;
export type EventsListResponse = TrackingEvent[];

// ============ Dashboard Stats ============
export interface DashboardStats {
  activeOrders: number;
  inTransit: number;
  delivered: number;
  averageDeliveryTime: number;
  onTimeDeliveryRate: number;
  totalCargos: number;
  totalContractors: number;
  totalWarehouses: number;
  totalTransport: number;
}

// ============ Report Types ============
export interface OrderStatusReport {
  orders: Array<Order & {
    cycleDays: number;
    isDelayed: boolean;
  }>;
}

export interface CarrierEfficiencyReport {
  carriers: Array<{
    contractor: Contractor;
    completedLegs: number;
    totalLegs: number;
    avgTimeHours: number;
    delayPercent: number;
  }>;
}

export interface WarehouseLoadReport {
  warehouses: Array<{
    warehouse: Warehouse;
    incoming: number;
    outgoing: number;
    avgStayDays: number;
    loadFactor: number;
  }>;
}

export interface KPIReport {
  onTimePercentage: number;
  avgDelayDays: number;
  ordersInProgress: number;
  totalDelivered: number;
  delayReasons: Array<{
    reason: string;
    count: number;
    percentage: number;
  }>;
}

// ============ Filter Types ============
export interface OrdersFilter {
  status?: OrderStatus;
  senderId?: string;
  recipientId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface CargosFilter {
  status?: CargoStatus;
  orderId?: string;
  search?: string;
}

export interface ContractorsFilter {
  type?: string;
  search?: string;
}

export interface WarehousesFilter {
  type?: WarehouseType;
  search?: string;
}

export interface TransportFilter {
  type?: TransportType;
  contractorId?: string;
  search?: string;
}

// ============ Reports Filter ============
export interface ReportsFilter {
  dateFrom?: string;
  dateTo?: string;
  contractorId?: number;
}

// ============ Reports Response Types ============
export interface OrderStatusReportItem {
  id: string;
  orderNumber: string;
  createdAt: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  status: OrderStatus;
  shipmentDate?: string;
  deliveryDate?: string;
  cycleDays: number;
  isDelayed: boolean;
}

export interface CargoTrackingReportItem {
  cargoId: string;
  description: string;
  currentStatus: CargoStatus;
  routeLegs: Array<{
    id: string;
    sequenceOrder: number;
    startWarehouseId: string;
    startWarehouseName: string;
    endWarehouseId: string;
    endWarehouseName: string;
    assignedTransportId?: string;
    plannedStart?: string;
    status: RouteLegStatus;
    events: Array<{
      id: string;
      eventType: EventType;
      timestamp: string;
      description: string;
    }>;
  }>;
}

export interface CarrierEfficiencyReportItem {
  contractorId: number;
  name: string;
  type: string;
  completedLegs: number;
  totalLegs: number;
  avgTimeHours: number;
  delayPercent: number;
}

export interface WarehouseLoadReportItem {
  warehouseId: string;
  name: string;
  type: WarehouseType;
  incoming: number;
  outgoing: number;
  avgStayDays: number;
  loadFactor: number;
}

export interface KPIReportData {
  onTimePercentage: number;
  avgDelayDays: number;
  ordersInProgress: number;
  totalDelivered: number;
  totalOrders: number;
  delayReasons: Array<{
    reason: string;
    count: number;
    percentage: number;
  }>;
}
