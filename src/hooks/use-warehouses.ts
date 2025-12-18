// React Query хуки для работы со складами

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { warehousesApi } from '@/services/api';
import { CreateWarehouseRequest, UpdateWarehouseRequest, WarehousesFilter } from '@/types/api';
import { toast } from 'sonner';

export const WAREHOUSES_QUERY_KEY = 'warehouses';

export function useWarehouses(filter?: WarehousesFilter) {
  return useQuery({
    queryKey: [WAREHOUSES_QUERY_KEY, filter],
    queryFn: () => warehousesApi.getAll(filter),
  });
}

export function useWarehouse(id: string) {
  return useQuery({
    queryKey: [WAREHOUSES_QUERY_KEY, id],
    queryFn: () => warehousesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateWarehouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWarehouseRequest) => warehousesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WAREHOUSES_QUERY_KEY] });
      toast.success('Склад успешно создан');
    },
    onError: (error: Error) => {
      toast.error(`Ошибка создания склада: ${error.message}`);
    },
  });
}

export function useUpdateWarehouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateWarehouseRequest) => warehousesApi.update(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [WAREHOUSES_QUERY_KEY] });
      queryClient.setQueryData([WAREHOUSES_QUERY_KEY, data.id], data);
      toast.success('Склад успешно обновлен');
    },
    onError: (error: Error) => {
      toast.error(`Ошибка обновления склада: ${error.message}`);
    },
  });
}

export function useDeleteWarehouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => warehousesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WAREHOUSES_QUERY_KEY] });
      toast.success('Склад успешно удален');
    },
    onError: (error: Error) => {
      toast.error(`Ошибка удаления склада: ${error.message}`);
    },
  });
}
