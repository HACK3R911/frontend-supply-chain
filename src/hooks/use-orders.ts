// React Query хуки для работы с заказами

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '@/services/api';
import { CreateOrderRequest, UpdateOrderRequest, OrdersFilter } from '@/types/api';
import { toast } from 'sonner';

export const ORDERS_QUERY_KEY = 'orders';

export function useOrders(filter?: OrdersFilter) {
  return useQuery({
    queryKey: [ORDERS_QUERY_KEY, filter],
    queryFn: () => ordersApi.getAll(filter),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: [ORDERS_QUERY_KEY, id],
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => ordersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
      toast.success('Заказ успешно создан');
    },
    onError: (error: Error) => {
      toast.error(`Ошибка создания заказа: ${error.message}`);
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateOrderRequest) => ordersApi.update(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
      queryClient.setQueryData([ORDERS_QUERY_KEY, data.id], data);
      toast.success('Заказ успешно обновлен');
    },
    onError: (error: Error) => {
      toast.error(`Ошибка обновления заказа: ${error.message}`);
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ordersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
      toast.success('Заказ успешно удален');
    },
    onError: (error: Error) => {
      toast.error(`Ошибка удаления заказа: ${error.message}`);
    },
  });
}
