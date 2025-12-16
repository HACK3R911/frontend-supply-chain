export type OrderStatus = 'pending' | 'in_transit' | 'delivered' | 'cancelled';
export type CargoStatus = 'at_warehouse' | 'in_transit' | 'delivered' | 'delayed';
export type EventType = 'created' | 'departed' | 'arrived' | 'delivered' | 'delayed' | 'customs';

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  origin: string;
  destination: string;
  customer: string;
  contractor: string;
  createdAt: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  totalWeight: number;
  totalVolume: number;
  cargos: Cargo[];
}

export interface Cargo {
  id: string;
  trackingNumber: string;
  description: string;
  weight: number;
  volume: number;
  status: CargoStatus;
  currentLocation: string;
  events: TrackingEvent[];
}

export interface TrackingEvent {
  id: string;
  type: EventType;
  location: string;
  timestamp: string;
  description: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface RouteSegment {
  id: string;
  from: string;
  to: string;
  status: 'completed' | 'active' | 'pending';
  startTime?: string;
  endTime?: string;
  transportType: 'truck' | 'ship' | 'plane' | 'train';
}
