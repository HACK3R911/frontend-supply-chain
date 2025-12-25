import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '@/services/api';
import { ReportsFilter } from '@/types/api';

export function useOrderStatusReport(filter?: ReportsFilter) {
  return useQuery({
    queryKey: ['reports', 'orders', filter],
    queryFn: () => reportsApi.getOrderStatusReport(filter),
  });
}

export function useCargoTrackingReport(filter?: ReportsFilter) {
  return useQuery({
    queryKey: ['reports', 'tracking', filter],
    queryFn: () => reportsApi.getCargoTrackingReport(filter),
  });
}

export function useCarrierEfficiencyReport(filter?: ReportsFilter) {
  return useQuery({
    queryKey: ['reports', 'carriers', filter],
    queryFn: () => reportsApi.getCarrierEfficiencyReport(filter),
  });
}

export function useWarehouseLoadReport(filter?: ReportsFilter) {
  return useQuery({
    queryKey: ['reports', 'warehouses', filter],
    queryFn: () => reportsApi.getWarehouseLoadReport(filter),
  });
}

export function useKPIReport(filter?: ReportsFilter) {
  return useQuery({
    queryKey: ['reports', 'kpi', filter],
    queryFn: () => reportsApi.getKPIReport(filter),
  });
}
