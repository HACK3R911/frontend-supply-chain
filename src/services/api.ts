// API сервисы для работы с данными
// При подключении Go бэкенда замените USE_MOCK_DATA на false

import apiClient, { ApiResponse } from '@/lib/api-client';
import {
  CreateContractorRequest,
  UpdateContractorRequest,
  ContractorsListResponse,
  ContractorResponse,
  CreateWarehouseRequest,
  UpdateWarehouseRequest,
  WarehousesListResponse,
  WarehouseResponse,
  CreateTransportRequest,
  UpdateTransportRequest,
  TransportListResponse,
  TransportResponse,
  CreateOrderRequest,
  UpdateOrderRequest,
  OrdersListResponse,
  OrderResponse,
  CreateCargoRequest,
  UpdateCargoRequest,
  CargosListResponse,
  CargoResponse,
  CreateRouteLegRequest,
  UpdateRouteLegRequest,
  RouteLegsListResponse,
  RouteLegResponse,
  CreateEventRequest,
  EventsListResponse,
  EventResponse,
  DashboardStats,
  OrdersFilter,
  CargosFilter,
  ContractorsFilter,
  WarehousesFilter,
  TransportFilter,
  ReportsFilter,
  OrderStatusReportItem,
  CargoTrackingReportItem,
  CarrierEfficiencyReportItem,
  WarehouseLoadReportItem,
  KPIReportData,
} from '@/types/api';

// Флаг для использования mock-данных
// При подключении реального бэкенда установите в false
const USE_MOCK_DATA = true;

// Импорт mock-данных для режима разработки
import {
  mockContractors,
  mockWarehouses,
  mockTransport,
  mockOrders,
  mockCargos,
  mockRouteLegs,
  mockEvents,
  dashboardStats,
} from '@/data/mock-data';

// ============ Contractors API ============
export const contractorsApi = {
  getAll: async (filter?: ContractorsFilter): Promise<ContractorsListResponse> => {
    if (USE_MOCK_DATA) {
      let result = [...mockContractors];
      if (filter?.type) {
        result = result.filter(c => c.type === filter.type);
      }
      if (filter?.search) {
        const search = filter.search.toLowerCase();
        result = result.filter(c =>
          c.name.toLowerCase().includes(search) ||
          c.contact.toLowerCase().includes(search)
        );
      }
      return result;
    }
    const params: Record<string, string> = {};
    if (filter?.type) params.type = filter.type;
    if (filter?.search) params.search = filter.search;
    return apiClient.get<ContractorsListResponse>('/contractors', params);
  },

  getById: async (id: number): Promise<ContractorResponse> => {
    if (USE_MOCK_DATA) {
      const contractor = mockContractors.find(c => c.id === id);
      if (!contractor) throw new Error('Contractor not found');
      return contractor;
    }
    return apiClient.get<ContractorResponse>(`/contractors/${id}`);
  },

  create: async (data: CreateContractorRequest): Promise<ContractorResponse> => {
    if (USE_MOCK_DATA) {
      const now = new Date().toISOString();
      const newContractor = { 
        ...data, 
        id: Date.now(),
        created_at: now,
        updated_at: now,
      };
      mockContractors.push(newContractor);
      return newContractor;
    }
    return apiClient.post<ContractorResponse>('/contractors', data);
  },

  update: async (data: UpdateContractorRequest): Promise<ContractorResponse> => {
    if (USE_MOCK_DATA) {
      const index = mockContractors.findIndex(c => c.id === data.id);
      if (index === -1) throw new Error('Contractor not found');
      mockContractors[index] = { 
        ...mockContractors[index], 
        ...data,
        updated_at: new Date().toISOString(),
      };
      return mockContractors[index];
    }
    return apiClient.put<ContractorResponse>(`/contractors/${data.id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    if (USE_MOCK_DATA) {
      const index = mockContractors.findIndex(c => c.id === id);
      if (index !== -1) mockContractors.splice(index, 1);
      return;
    }
    return apiClient.delete(`/contractors/${id}`);
  },
};

// ============ Warehouses API ============
export const warehousesApi = {
  getAll: async (filter?: WarehousesFilter): Promise<WarehousesListResponse> => {
    if (USE_MOCK_DATA) {
      let result = [...mockWarehouses];
      if (filter?.type) {
        result = result.filter(w => w.type === filter.type);
      }
      if (filter?.search) {
        const search = filter.search.toLowerCase();
        result = result.filter(w =>
          w.name.toLowerCase().includes(search) ||
          w.address.toLowerCase().includes(search)
        );
      }
      return result;
    }
    const params: Record<string, string> = {};
    if (filter?.type) params.type = filter.type;
    if (filter?.search) params.search = filter.search;
    return apiClient.get<WarehousesListResponse>('/warehouses', params);
  },

  getById: async (id: string): Promise<WarehouseResponse> => {
    if (USE_MOCK_DATA) {
      const warehouse = mockWarehouses.find(w => w.id === id);
      if (!warehouse) throw new Error('Warehouse not found');
      return warehouse;
    }
    return apiClient.get<WarehouseResponse>(`/warehouses/${id}`);
  },

  create: async (data: CreateWarehouseRequest): Promise<WarehouseResponse> => {
    if (USE_MOCK_DATA) {
      const newWarehouse = { ...data, id: `wh${Date.now()}` };
      mockWarehouses.push(newWarehouse);
      return newWarehouse;
    }
    return apiClient.post<WarehouseResponse>('/warehouses', data);
  },

  update: async (data: UpdateWarehouseRequest): Promise<WarehouseResponse> => {
    if (USE_MOCK_DATA) {
      const index = mockWarehouses.findIndex(w => w.id === data.id);
      if (index === -1) throw new Error('Warehouse not found');
      mockWarehouses[index] = { ...mockWarehouses[index], ...data };
      return mockWarehouses[index];
    }
    return apiClient.put<WarehouseResponse>(`/warehouses/${data.id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      const index = mockWarehouses.findIndex(w => w.id === id);
      if (index !== -1) mockWarehouses.splice(index, 1);
      return;
    }
    return apiClient.delete(`/warehouses/${id}`);
  },
};

// ============ Transport API ============
export const transportApi = {
  getAll: async (filter?: TransportFilter): Promise<TransportListResponse> => {
    if (USE_MOCK_DATA) {
      let result = [...mockTransport];
      if (filter?.type) {
        result = result.filter(t => t.type === filter.type);
      }
      if (filter?.contractorId) {
        result = result.filter(t => t.contractorId === filter.contractorId);
      }
      if (filter?.search) {
        const search = filter.search.toLowerCase();
        result = result.filter(t => t.regNumber.toLowerCase().includes(search));
      }
      return result;
    }
    const params: Record<string, string> = {};
    if (filter?.type) params.type = filter.type;
    if (filter?.contractorId) params.contractorId = filter.contractorId;
    if (filter?.search) params.search = filter.search;
    return apiClient.get<TransportListResponse>('/transport', params);
  },

  getByRegNumber: async (regNumber: string): Promise<TransportResponse> => {
    if (USE_MOCK_DATA) {
      const transport = mockTransport.find(t => t.regNumber === regNumber);
      if (!transport) throw new Error('Transport not found');
      return transport;
    }
    return apiClient.get<TransportResponse>(`/transport/${regNumber}`);
  },

  create: async (data: CreateTransportRequest): Promise<TransportResponse> => {
    if (USE_MOCK_DATA) {
      mockTransport.push(data);
      return data;
    }
    return apiClient.post<TransportResponse>('/transport', data);
  },

  update: async (data: UpdateTransportRequest): Promise<TransportResponse> => {
    if (USE_MOCK_DATA) {
      const index = mockTransport.findIndex(t => t.regNumber === data.regNumber);
      if (index === -1) throw new Error('Transport not found');
      mockTransport[index] = { ...mockTransport[index], ...data };
      return mockTransport[index];
    }
    return apiClient.put<TransportResponse>(`/transport/${data.regNumber}`, data);
  },

  delete: async (regNumber: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      const index = mockTransport.findIndex(t => t.regNumber === regNumber);
      if (index !== -1) mockTransport.splice(index, 1);
      return;
    }
    return apiClient.delete(`/transport/${regNumber}`);
  },
};

// ============ Orders API ============
export const ordersApi = {
  getAll: async (filter?: OrdersFilter): Promise<OrdersListResponse> => {
    if (USE_MOCK_DATA) {
      let result = [...mockOrders];
      if (filter?.status) {
        result = result.filter(o => o.status === filter.status);
      }
      if (filter?.senderId) {
        result = result.filter(o => o.senderId === filter.senderId);
      }
      if (filter?.recipientId) {
        result = result.filter(o => o.recipientId === filter.recipientId);
      }
      if (filter?.search) {
        const search = filter.search.toLowerCase();
        result = result.filter(o =>
          o.orderNumber.toLowerCase().includes(search) ||
          o.sender?.name?.toLowerCase().includes(search) ||
          o.recipient?.name?.toLowerCase().includes(search)
        );
      }
      return result;
    }
    const params: Record<string, string> = {};
    if (filter?.status) params.status = filter.status;
    if (filter?.senderId) params.senderId = filter.senderId;
    if (filter?.recipientId) params.recipientId = filter.recipientId;
    if (filter?.dateFrom) params.dateFrom = filter.dateFrom;
    if (filter?.dateTo) params.dateTo = filter.dateTo;
    if (filter?.search) params.search = filter.search;
    return apiClient.get<OrdersListResponse>('/orders', params);
  },

  getById: async (id: string): Promise<OrderResponse> => {
    if (USE_MOCK_DATA) {
      const order = mockOrders.find(o => o.id === id);
      if (!order) throw new Error('Order not found');
      return order;
    }
    return apiClient.get<OrderResponse>(`/orders/${id}`);
  },

  create: async (data: CreateOrderRequest): Promise<OrderResponse> => {
    if (USE_MOCK_DATA) {
      const sender = mockContractors.find(c => String(c.id) === data.senderId);
      const recipient = mockContractors.find(c => String(c.id) === data.recipientId);
      const newOrder = {
        ...data,
        id: `o${Date.now()}`,
        createdAt: new Date().toISOString(),
        sender,
        recipient,
      };
      mockOrders.push(newOrder);
      return newOrder;
    }
    return apiClient.post<OrderResponse>('/orders', data);
  },

  update: async (data: UpdateOrderRequest): Promise<OrderResponse> => {
    if (USE_MOCK_DATA) {
      const index = mockOrders.findIndex(o => o.id === data.id);
      if (index === -1) throw new Error('Order not found');
      mockOrders[index] = { ...mockOrders[index], ...data };
      return mockOrders[index];
    }
    return apiClient.put<OrderResponse>(`/orders/${data.id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      const index = mockOrders.findIndex(o => o.id === id);
      if (index !== -1) mockOrders.splice(index, 1);
      return;
    }
    return apiClient.delete(`/orders/${id}`);
  },
};

// ============ Cargos API ============
export const cargosApi = {
  getAll: async (filter?: CargosFilter): Promise<CargosListResponse> => {
    if (USE_MOCK_DATA) {
      let result = [...mockCargos];
      if (filter?.status) {
        result = result.filter(c => c.currentStatus === filter.status);
      }
      if (filter?.orderId) {
        result = result.filter(c => c.orderId === filter.orderId);
      }
      if (filter?.search) {
        const search = filter.search.toLowerCase();
        result = result.filter(c =>
          c.cargoId.toLowerCase().includes(search) ||
          c.description.toLowerCase().includes(search)
        );
      }
      return result;
    }
    const params: Record<string, string> = {};
    if (filter?.status) params.status = filter.status;
    if (filter?.orderId) params.orderId = filter.orderId;
    if (filter?.search) params.search = filter.search;
    return apiClient.get<CargosListResponse>('/cargos', params);
  },

  getById: async (id: string): Promise<CargoResponse> => {
    if (USE_MOCK_DATA) {
      const cargo = mockCargos.find(c => c.id === id);
      if (!cargo) throw new Error('Cargo not found');
      return cargo;
    }
    return apiClient.get<CargoResponse>(`/cargos/${id}`);
  },

  getByOrderId: async (orderId: string): Promise<CargosListResponse> => {
    if (USE_MOCK_DATA) {
      return mockCargos.filter(c => c.orderId === orderId);
    }
    return apiClient.get<CargosListResponse>(`/orders/${orderId}/cargos`);
  },

  create: async (data: CreateCargoRequest): Promise<CargoResponse> => {
    if (USE_MOCK_DATA) {
      const newCargo = { ...data, id: `c${Date.now()}` };
      mockCargos.push(newCargo);
      return newCargo;
    }
    return apiClient.post<CargoResponse>('/cargos', data);
  },

  update: async (data: UpdateCargoRequest): Promise<CargoResponse> => {
    if (USE_MOCK_DATA) {
      const index = mockCargos.findIndex(c => c.id === data.id);
      if (index === -1) throw new Error('Cargo not found');
      mockCargos[index] = { ...mockCargos[index], ...data };
      return mockCargos[index];
    }
    return apiClient.put<CargoResponse>(`/cargos/${data.id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      const index = mockCargos.findIndex(c => c.id === id);
      if (index !== -1) mockCargos.splice(index, 1);
      return;
    }
    return apiClient.delete(`/cargos/${id}`);
  },
};

// ============ Route Legs API ============
export const routeLegsApi = {
  getAll: async (): Promise<RouteLegsListResponse> => {
    if (USE_MOCK_DATA) {
      return [...mockRouteLegs];
    }
    return apiClient.get<RouteLegsListResponse>('/route-legs');
  },

  getByCargoId: async (cargoId: string): Promise<RouteLegsListResponse> => {
    if (USE_MOCK_DATA) {
      return mockRouteLegs.filter(rl => rl.cargoId === cargoId);
    }
    return apiClient.get<RouteLegsListResponse>(`/cargos/${cargoId}/route-legs`);
  },

  getById: async (id: string): Promise<RouteLegResponse> => {
    if (USE_MOCK_DATA) {
      const routeLeg = mockRouteLegs.find(rl => rl.id === id);
      if (!routeLeg) throw new Error('Route leg not found');
      return routeLeg;
    }
    return apiClient.get<RouteLegResponse>(`/route-legs/${id}`);
  },

  create: async (data: CreateRouteLegRequest): Promise<RouteLegResponse> => {
    if (USE_MOCK_DATA) {
      const startWarehouse = mockWarehouses.find(w => w.id === data.startWarehouseId);
      const endWarehouse = mockWarehouses.find(w => w.id === data.endWarehouseId);
      const newRouteLeg = {
        ...data,
        id: `rl${Date.now()}`,
        startWarehouse,
        endWarehouse,
      };
      mockRouteLegs.push(newRouteLeg);
      return newRouteLeg;
    }
    return apiClient.post<RouteLegResponse>('/route-legs', data);
  },

  update: async (data: UpdateRouteLegRequest): Promise<RouteLegResponse> => {
    if (USE_MOCK_DATA) {
      const index = mockRouteLegs.findIndex(rl => rl.id === data.id);
      if (index === -1) throw new Error('Route leg not found');
      mockRouteLegs[index] = { ...mockRouteLegs[index], ...data };
      return mockRouteLegs[index];
    }
    return apiClient.put<RouteLegResponse>(`/route-legs/${data.id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      const index = mockRouteLegs.findIndex(rl => rl.id === id);
      if (index !== -1) mockRouteLegs.splice(index, 1);
      return;
    }
    return apiClient.delete(`/route-legs/${id}`);
  },
};

// ============ Events API ============
export const eventsApi = {
  getAll: async (): Promise<EventsListResponse> => {
    if (USE_MOCK_DATA) {
      return [...mockEvents];
    }
    return apiClient.get<EventsListResponse>('/events');
  },

  getByRouteLegId: async (routeLegId: string): Promise<EventsListResponse> => {
    if (USE_MOCK_DATA) {
      return mockEvents.filter(e => e.routeLegId === routeLegId);
    }
    return apiClient.get<EventsListResponse>(`/route-legs/${routeLegId}/events`);
  },

  getById: async (id: string): Promise<EventResponse> => {
    if (USE_MOCK_DATA) {
      const event = mockEvents.find(e => e.id === id);
      if (!event) throw new Error('Event not found');
      return event;
    }
    return apiClient.get<EventResponse>(`/events/${id}`);
  },

  create: async (data: CreateEventRequest): Promise<EventResponse> => {
    if (USE_MOCK_DATA) {
      const newEvent = { ...data, id: `e${Date.now()}` };
      mockEvents.push(newEvent);
      return newEvent;
    }
    return apiClient.post<EventResponse>('/events', data);
  },

  delete: async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      const index = mockEvents.findIndex(e => e.id === id);
      if (index !== -1) mockEvents.splice(index, 1);
      return;
    }
    return apiClient.delete(`/events/${id}`);
  },
};

// ============ Dashboard API ============
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    if (USE_MOCK_DATA) {
      return dashboardStats;
    }
    return apiClient.get<DashboardStats>('/dashboard/stats');
  },
};

// ============ Reports API ============
export const reportsApi = {
  getOrderStatusReport: async (filter?: ReportsFilter): Promise<OrderStatusReportItem[]> => {
    if (USE_MOCK_DATA) {
      let result = mockOrders.map(order => {
        const sender = mockContractors.find(c => String(c.id) === order.senderId);
        const recipient = mockContractors.find(c => String(c.id) === order.recipientId);
        const cycleDays = order.deliveryDate && order.shipmentDate 
          ? Math.ceil((new Date(order.deliveryDate).getTime() - new Date(order.shipmentDate).getTime()) / (1000 * 60 * 60 * 24)) 
          : 0;
        return {
          id: order.id,
          orderNumber: order.orderNumber,
          createdAt: order.createdAt,
          senderId: order.senderId,
          senderName: sender?.name || 'Неизвестно',
          recipientId: order.recipientId,
          recipientName: recipient?.name || 'Неизвестно',
          status: order.status,
          shipmentDate: order.shipmentDate,
          deliveryDate: order.deliveryDate,
          cycleDays,
          isDelayed: false,
        };
      });
      
      if (filter?.dateFrom) {
        result = result.filter(o => new Date(o.createdAt) >= new Date(filter.dateFrom!));
      }
      if (filter?.dateTo) {
        result = result.filter(o => new Date(o.createdAt) <= new Date(filter.dateTo!));
      }
      if (filter?.contractorId) {
        result = result.filter(o => 
          o.senderId === String(filter.contractorId) || 
          o.recipientId === String(filter.contractorId)
        );
      }
      return result;
    }
    const params: Record<string, string> = {};
    if (filter?.dateFrom) params.dateFrom = filter.dateFrom;
    if (filter?.dateTo) params.dateTo = filter.dateTo;
    if (filter?.contractorId) params.contractorId = String(filter.contractorId);
    return apiClient.get<OrderStatusReportItem[]>('/reports/orders', params);
  },

  getCargoTrackingReport: async (filter?: ReportsFilter): Promise<CargoTrackingReportItem[]> => {
    if (USE_MOCK_DATA) {
      return mockCargos.map(cargo => {
        const legs = mockRouteLegs.filter(leg => leg.cargoId === cargo.id);
        return {
          cargoId: cargo.cargoId,
          description: cargo.description,
          currentStatus: cargo.currentStatus,
          routeLegs: legs.map(leg => {
            const startWh = mockWarehouses.find(w => w.id === leg.startWarehouseId);
            const endWh = mockWarehouses.find(w => w.id === leg.endWarehouseId);
            const legEvents = mockEvents.filter(e => e.routeLegId === leg.id);
            return {
              id: leg.id,
              sequenceOrder: leg.sequenceOrder,
              startWarehouseId: leg.startWarehouseId,
              startWarehouseName: startWh?.name || 'Неизвестно',
              endWarehouseId: leg.endWarehouseId,
              endWarehouseName: endWh?.name || 'Неизвестно',
              assignedTransportId: leg.assignedTransportId,
              plannedStart: leg.plannedStart,
              status: leg.status,
              events: legEvents.map(e => ({
                id: e.id,
                eventType: e.eventType,
                timestamp: e.timestamp,
                description: e.description,
              })),
            };
          }),
        };
      });
    }
    const params: Record<string, string> = {};
    if (filter?.dateFrom) params.dateFrom = filter.dateFrom;
    if (filter?.dateTo) params.dateTo = filter.dateTo;
    return apiClient.get<CargoTrackingReportItem[]>('/reports/tracking', params);
  },

  getCarrierEfficiencyReport: async (filter?: ReportsFilter): Promise<CarrierEfficiencyReportItem[]> => {
    if (USE_MOCK_DATA) {
      const carriers = mockContractors.filter(c => c.type === 'carrier');
      return carriers.map(carrier => {
        const legs = mockRouteLegs.filter(leg => {
          const t = mockTransport.find(t => t.regNumber === leg.assignedTransportId);
          return t?.contractorId === String(carrier.id);
        });
        return {
          contractorId: carrier.id,
          name: carrier.name,
          type: carrier.type,
          completedLegs: legs.filter(l => l.status === 'completed').length,
          totalLegs: legs.length,
          avgTimeHours: Math.round(Math.random() * 24 + 12),
          delayPercent: Math.round(Math.random() * 15),
        };
      });
    }
    const params: Record<string, string> = {};
    if (filter?.dateFrom) params.dateFrom = filter.dateFrom;
    if (filter?.dateTo) params.dateTo = filter.dateTo;
    if (filter?.contractorId) params.contractorId = String(filter.contractorId);
    return apiClient.get<CarrierEfficiencyReportItem[]>('/reports/carriers', params);
  },

  getWarehouseLoadReport: async (filter?: ReportsFilter): Promise<WarehouseLoadReportItem[]> => {
    if (USE_MOCK_DATA) {
      return mockWarehouses.map(wh => {
        const incomingLegs = mockRouteLegs.filter(l => l.endWarehouseId === wh.id);
        const outgoingLegs = mockRouteLegs.filter(l => l.startWarehouseId === wh.id);
        return {
          warehouseId: wh.id,
          name: wh.name,
          type: wh.type,
          incoming: incomingLegs.length,
          outgoing: outgoingLegs.length,
          avgStayDays: Math.round(Math.random() * 3 + 1),
          loadFactor: Math.round(Math.random() * 40 + 50),
        };
      });
    }
    const params: Record<string, string> = {};
    if (filter?.dateFrom) params.dateFrom = filter.dateFrom;
    if (filter?.dateTo) params.dateTo = filter.dateTo;
    return apiClient.get<WarehouseLoadReportItem[]>('/reports/warehouses', params);
  },

  getKPIReport: async (filter?: ReportsFilter): Promise<KPIReportData> => {
    if (USE_MOCK_DATA) {
      const totalOrders = mockOrders.length;
      const delivered = mockOrders.filter(o => o.status === 'delivered').length;
      const inProgress = mockOrders.filter(o => o.status === 'in_transit').length;
      return {
        onTimePercentage: totalOrders > 0 ? Math.round((delivered / totalOrders) * 100) : 0,
        avgDelayDays: 1.2,
        ordersInProgress: inProgress,
        totalDelivered: delivered,
        totalOrders,
        delayReasons: [
          { reason: 'Задержка на таможне', count: 3, percentage: 30 },
          { reason: 'Погодные условия', count: 2, percentage: 20 },
          { reason: 'Технические неисправности', count: 3, percentage: 30 },
          { reason: 'Проблемы с документами', count: 2, percentage: 20 },
        ],
      };
    }
    const params: Record<string, string> = {};
    if (filter?.dateFrom) params.dateFrom = filter.dateFrom;
    if (filter?.dateTo) params.dateTo = filter.dateTo;
    if (filter?.contractorId) params.contractorId = String(filter.contractorId);
    return apiClient.get<KPIReportData>('/reports/kpi', params);
  },
};
