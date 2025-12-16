import { Order, Cargo, TrackingEvent, RouteSegment } from '@/types/supply-chain';

export const mockEvents: TrackingEvent[] = [
  {
    id: 'e1',
    type: 'created',
    location: 'Москва, Склад А',
    timestamp: '2024-01-15T08:00:00Z',
    description: 'Заказ создан и принят в обработку',
    coordinates: { lat: 55.7558, lng: 37.6173 }
  },
  {
    id: 'e2',
    type: 'departed',
    location: 'Москва, Склад А',
    timestamp: '2024-01-15T14:30:00Z',
    description: 'Отправлен со склада',
    coordinates: { lat: 55.7558, lng: 37.6173 }
  },
  {
    id: 'e3',
    type: 'arrived',
    location: 'Нижний Новгород, Транзитный пункт',
    timestamp: '2024-01-16T06:00:00Z',
    description: 'Прибыл на транзитный пункт',
    coordinates: { lat: 56.2965, lng: 43.9361 }
  },
  {
    id: 'e4',
    type: 'departed',
    location: 'Нижний Новгород, Транзитный пункт',
    timestamp: '2024-01-16T10:00:00Z',
    description: 'Отправлен к пункту назначения',
    coordinates: { lat: 56.2965, lng: 43.9361 }
  },
  {
    id: 'e5',
    type: 'arrived',
    location: 'Казань, Склад Б',
    timestamp: '2024-01-16T18:00:00Z',
    description: 'Прибыл на склад назначения',
    coordinates: { lat: 55.7887, lng: 49.1221 }
  }
];

export const mockCargos: Cargo[] = [
  {
    id: 'c1',
    trackingNumber: 'TRK-001-2024',
    description: 'Электроника - партия смартфонов',
    weight: 250,
    volume: 2.5,
    status: 'in_transit',
    currentLocation: 'Нижний Новгород',
    events: mockEvents
  },
  {
    id: 'c2',
    trackingNumber: 'TRK-002-2024',
    description: 'Запчасти автомобильные',
    weight: 500,
    volume: 4.0,
    status: 'at_warehouse',
    currentLocation: 'Москва, Склад А',
    events: mockEvents.slice(0, 2)
  },
  {
    id: 'c3',
    trackingNumber: 'TRK-003-2024',
    description: 'Текстильные изделия',
    weight: 150,
    volume: 6.0,
    status: 'delivered',
    currentLocation: 'Казань, Склад Б',
    events: mockEvents
  }
];

export const mockOrders: Order[] = [
  {
    id: 'o1',
    orderNumber: 'ORD-2024-001',
    status: 'in_transit',
    origin: 'Москва',
    destination: 'Казань',
    customer: 'ООО "ТехноТрейд"',
    contractor: 'ООО "ЛогистикПро"',
    createdAt: '2024-01-15T08:00:00Z',
    estimatedDelivery: '2024-01-17T18:00:00Z',
    totalWeight: 750,
    totalVolume: 12.5,
    cargos: mockCargos
  },
  {
    id: 'o2',
    orderNumber: 'ORD-2024-002',
    status: 'delivered',
    origin: 'Санкт-Петербург',
    destination: 'Екатеринбург',
    customer: 'АО "МегаСтрой"',
    contractor: 'ООО "ТрансГрупп"',
    createdAt: '2024-01-10T10:00:00Z',
    estimatedDelivery: '2024-01-14T12:00:00Z',
    actualDelivery: '2024-01-14T10:30:00Z',
    totalWeight: 2000,
    totalVolume: 25.0,
    cargos: [mockCargos[2]]
  },
  {
    id: 'o3',
    orderNumber: 'ORD-2024-003',
    status: 'pending',
    origin: 'Новосибирск',
    destination: 'Владивосток',
    customer: 'ИП Сидоров А.А.',
    contractor: 'ООО "СибирьТранс"',
    createdAt: '2024-01-16T14:00:00Z',
    estimatedDelivery: '2024-01-25T18:00:00Z',
    totalWeight: 350,
    totalVolume: 5.0,
    cargos: [mockCargos[1]]
  },
  {
    id: 'o4',
    orderNumber: 'ORD-2024-004',
    status: 'in_transit',
    origin: 'Ростов-на-Дону',
    destination: 'Москва',
    customer: 'ООО "АгроЭкспорт"',
    contractor: 'ООО "ЛогистикПро"',
    createdAt: '2024-01-14T09:00:00Z',
    estimatedDelivery: '2024-01-16T20:00:00Z',
    totalWeight: 5000,
    totalVolume: 40.0,
    cargos: mockCargos.slice(0, 2)
  },
  {
    id: 'o5',
    orderNumber: 'ORD-2024-005',
    status: 'cancelled',
    origin: 'Краснодар',
    destination: 'Самара',
    customer: 'ООО "ФудМаркет"',
    contractor: 'ООО "ТрансГрупп"',
    createdAt: '2024-01-12T11:00:00Z',
    estimatedDelivery: '2024-01-15T14:00:00Z',
    totalWeight: 800,
    totalVolume: 10.0,
    cargos: []
  }
];

export const mockRouteSegments: RouteSegment[] = [
  {
    id: 'rs1',
    from: 'Москва, Склад А',
    to: 'Нижний Новгород',
    status: 'completed',
    startTime: '2024-01-15T14:30:00Z',
    endTime: '2024-01-16T06:00:00Z',
    transportType: 'truck'
  },
  {
    id: 'rs2',
    from: 'Нижний Новгород',
    to: 'Казань, Склад Б',
    status: 'active',
    startTime: '2024-01-16T10:00:00Z',
    transportType: 'truck'
  },
  {
    id: 'rs3',
    from: 'Казань, Склад Б',
    to: 'Пункт доставки',
    status: 'pending',
    transportType: 'truck'
  }
];

export const dashboardStats = {
  activeOrders: 24,
  inTransit: 18,
  delivered: 156,
  averageDeliveryTime: 3.2,
  onTimeDeliveryRate: 94.5,
  totalCargos: 89
};
