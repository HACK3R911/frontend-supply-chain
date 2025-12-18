// React Query хуки для работы с грузами

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cargosApi } from '@/services/api';
import { CreateCargoRequest, UpdateCargoRequest, CargosFilter } from '@/types/api';
import { toast } from 'sonner';

export const CARGOS_QUERY_KEY = 'cargos';

export function useCargos(filter?: CargosFilter) {
  return useQuery({
    queryKey: [CARGOS_QUERY_KEY, filter],
    queryFn: () => cargosApi.getAll(filter),
  });
}

export function useCargo(id: string) {
  return useQuery({
    queryKey: [CARGOS_QUERY_KEY, id],
    queryFn: () => cargosApi.getById(id),
    enabled: !!id,
  });
}

export function useCargosByOrderId(orderId: string) {
  return useQuery({
    queryKey: [CARGOS_QUERY_KEY, 'order', orderId],
    queryFn: () => cargosApi.getByOrderId(orderId),
    enabled: !!orderId,
  });
}

export function useCreateCargo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCargoRequest) => cargosApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CARGOS_QUERY_KEY] });
      toast.success('Груз успешно создан');
    },
    onError: (error: Error) => {
      toast.error(`Ошибка создания груза: ${error.message}`);
    },
  });
}

export function useUpdateCargo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCargoRequest) => cargosApi.update(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [CARGOS_QUERY_KEY] });
      queryClient.setQueryData([CARGOS_QUERY_KEY, data.id], data);
      toast.success('Груз успешно обновлен');
    },
    onError: (error: Error) => {
      toast.error(`Ошибка обновления груза: ${error.message}`);
    },
  });
}

export function useDeleteCargo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cargosApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CARGOS_QUERY_KEY] });
      toast.success('Груз успешно удален');
    },
    onError: (error: Error) => {
      toast.error(`Ошибка удаления груза: ${error.message}`);
    },
  });
}
