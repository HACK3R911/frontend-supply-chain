import { 
  Contractor, Warehouse, Transport, Order, Cargo, RouteLeg, 
  TrackingEvent, RouteSegment 
} from '@/types/supply-chain';

// Контрагенты (соответствует Go модели)
export const mockContractors: Contractor[] = [
  {
    id: 1,
    name: 'ООО "ТехноТрейд"',
    type: 'client',
    contact: '+7 (495) 123-45-67, info@technotrade.ru',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'ООО "ЛогистикПро"',
    type: 'carrier',
    contact: '+7 (495) 234-56-78, logistics@logistikpro.ru',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    name: 'АО "МегаСтрой"',
    type: 'client',
    contact: '+7 (812) 345-67-89, megastroy@mail.ru',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 4,
    name: 'ООО "ПромСнаб"',
    type: 'supplier',
    contact: '+7 (831) 456-78-90, promsnab@yandex.ru',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 5,
    name: 'ООО "ТрансГрупп"',
    type: 'carrier',
    contact: '+7 (843) 567-89-01, transgroup@mail.ru',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  }
];

// Склады
export const mockWarehouses: Warehouse[] = [
  {
    id: 'wh1',
    name: 'Склад А (Москва)',
    address: 'г. Москва, ул. Складская, д. 1',
    type: 'main',
    contactPersonId: '2'
  },
  {
    id: 'wh2',
    name: 'Транзитный пункт (Нижний Новгород)',
    address: 'г. Нижний Новгород, ул. Логистическая, д. 10',
    type: 'transit',
    contactPersonId: '4'
  },
  {
    id: 'wh3',
    name: 'Склад Б (Казань)',
    address: 'г. Казань, ул. Распределительная, д. 5',
    type: 'distribution',
    contactPersonId: '5'
  },
  {
    id: 'wh4',
    name: 'Склад В (Санкт-Петербург)',
    address: 'г. Санкт-Петербург, ул. Портовая, д. 12',
    type: 'main',
    contactPersonId: '3'
  }
];

// Транспорт
export const mockTransport: Transport[] = [
  {
    regNumber: 'А123АА77',
    type: 'truck',
    capacity: 5000,
    coordinates: { lat: 55.7558, lng: 37.6173 },
    contractorId: '2'
  },
  {
    regNumber: 'В456ВВ78',
    type: 'truck',
    capacity: 10000,
    coordinates: { lat: 56.2965, lng: 43.9361 },
    contractorId: '2'
  },
  {
    regNumber: 'С789СС16',
    type: 'truck',
    capacity: 3000,
    coordinates: { lat: 55.7887, lng: 49.1221 },
    contractorId: '5'
  },
  {
    regNumber: 'TRAIN-001',
    type: 'train',
    capacity: 50000,
    contractorId: '5'
  }
];

// События
export const mockEvents: TrackingEvent[] = [
  {
    id: 'e1',
    routeLegId: 'rl1',
    eventType: 'created',
    timestamp: '2024-01-15T08:00:00Z',
    description: 'Груз принят на складе',
    coordinates: { lat: 55.7558, lng: 37.6173 }
  },
  {
    id: 'e2',
    routeLegId: 'rl1',
    eventType: 'departed',
    timestamp: '2024-01-15T14:30:00Z',
    description: 'Отправлен со склада А',
    coordinates: { lat: 55.7558, lng: 37.6173 }
  },
  {
    id: 'e3',
    routeLegId: 'rl1',
    eventType: 'arrived',
    timestamp: '2024-01-16T06:00:00Z',
    description: 'Прибыл на транзитный пункт',
    coordinates: { lat: 56.2965, lng: 43.9361 }
  },
  {
    id: 'e4',
    routeLegId: 'rl2',
    eventType: 'departed',
    timestamp: '2024-01-16T10:00:00Z',
    description: 'Отправлен к пункту назначения',
    coordinates: { lat: 56.2965, lng: 43.9361 }
  },
  {
    id: 'e5',
    routeLegId: 'rl2',
    eventType: 'arrived',
    timestamp: '2024-01-16T18:00:00Z',
    description: 'Прибыл на склад Б',
    coordinates: { lat: 55.7887, lng: 49.1221 }
  }
];

// Участки маршрутов
export const mockRouteLegs: RouteLeg[] = [
  {
    id: 'rl1',
    cargoId: 'c1',
    startWarehouseId: 'wh1',
    endWarehouseId: 'wh2',
    sequenceOrder: 1,
    plannedStart: '2024-01-15T14:00:00Z',
    assignedTransportId: 'А123АА77',
    status: 'completed',
    startWarehouse: mockWarehouses[0],
    endWarehouse: mockWarehouses[1],
    events: mockEvents.filter(e => e.routeLegId === 'rl1')
  },
  {
    id: 'rl2',
    cargoId: 'c1',
    startWarehouseId: 'wh2',
    endWarehouseId: 'wh3',
    sequenceOrder: 2,
    plannedStart: '2024-01-16T10:00:00Z',
    assignedTransportId: 'В456ВВ78',
    status: 'active',
    startWarehouse: mockWarehouses[1],
    endWarehouse: mockWarehouses[2],
    events: mockEvents.filter(e => e.routeLegId === 'rl2')
  },
  {
    id: 'rl3',
    cargoId: 'c1',
    startWarehouseId: 'wh3',
    endWarehouseId: 'wh3',
    sequenceOrder: 3,
    status: 'pending',
    startWarehouse: mockWarehouses[2],
    endWarehouse: mockWarehouses[2]
  }
];

// Грузы
export const mockCargos: Cargo[] = [
  {
    id: 'c1',
    cargoId: 'TRK-001-2024',
    orderId: 'o1',
    weight: 250,
    volume: 2.5,
    description: 'Электроника - партия смартфонов',
    currentStatus: 'in_transit',
    routeLegs: mockRouteLegs.filter(rl => rl.cargoId === 'c1')
  },
  {
    id: 'c2',
    cargoId: 'TRK-002-2024',
    orderId: 'o1',
    weight: 500,
    volume: 4.0,
    description: 'Запчасти автомобильные',
    currentStatus: 'at_warehouse'
  },
  {
    id: 'c3',
    cargoId: 'TRK-003-2024',
    orderId: 'o2',
    weight: 150,
    volume: 6.0,
    description: 'Текстильные изделия',
    currentStatus: 'delivered'
  }
];

// Заказы
export const mockOrders: Order[] = [
  {
    id: 'o1',
    orderNumber: 'ORD-2024-001',
    createdAt: '2024-01-15T08:00:00Z',
    shipmentDate: '2024-01-15T14:00:00Z',
    deliveryDate: '2024-01-17T18:00:00Z',
    totalCost: 150000,
    status: 'in_transit',
    senderId: '4',
    recipientId: '1',
    sender: mockContractors.find(c => c.id === 4),
    recipient: mockContractors.find(c => c.id === 1),
    cargos: mockCargos.filter(c => c.orderId === 'o1')
  },
  {
    id: 'o2',
    orderNumber: 'ORD-2024-002',
    createdAt: '2024-01-10T10:00:00Z',
    shipmentDate: '2024-01-10T12:00:00Z',
    deliveryDate: '2024-01-14T12:00:00Z',
    totalCost: 250000,
    status: 'delivered',
    senderId: '4',
    recipientId: '3',
    sender: mockContractors.find(c => c.id === 4),
    recipient: mockContractors.find(c => c.id === 3),
    cargos: mockCargos.filter(c => c.orderId === 'o2')
  },
  {
    id: 'o3',
    orderNumber: 'ORD-2024-003',
    createdAt: '2024-01-16T14:00:00Z',
    totalCost: 75000,
    status: 'pending',
    senderId: '4',
    recipientId: '1',
    sender: mockContractors.find(c => c.id === 4),
    recipient: mockContractors.find(c => c.id === 1)
  },
  {
    id: 'o4',
    orderNumber: 'ORD-2024-004',
    createdAt: '2024-01-14T09:00:00Z',
    shipmentDate: '2024-01-14T10:00:00Z',
    deliveryDate: '2024-01-16T20:00:00Z',
    totalCost: 320000,
    status: 'in_transit',
    senderId: '4',
    recipientId: '3',
    sender: mockContractors.find(c => c.id === 4),
    recipient: mockContractors.find(c => c.id === 3)
  },
  {
    id: 'o5',
    orderNumber: 'ORD-2024-005',
    createdAt: '2024-01-12T11:00:00Z',
    totalCost: 45000,
    status: 'cancelled',
    senderId: '4',
    recipientId: '1',
    sender: mockContractors.find(c => c.id === 4),
    recipient: mockContractors.find(c => c.id === 1)
  }
];

// Для совместимости с RouteMap и другими компонентами
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
  activeOrders: mockOrders.filter(o => o.status === 'in_transit' || o.status === 'pending').length,
  inTransit: mockOrders.filter(o => o.status === 'in_transit').length,
  delivered: mockOrders.filter(o => o.status === 'delivered').length,
  averageDeliveryTime: 3.2,
  onTimeDeliveryRate: 94.5,
  totalCargos: mockCargos.length,
  totalContractors: mockContractors.length,
  totalWarehouses: mockWarehouses.length,
  totalTransport: mockTransport.length
};
