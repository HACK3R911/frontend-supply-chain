// React Query хуки для работы с транспортом

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transportApi } from '@/services/api';
import { CreateTransportRequest, UpdateTransportRequest, TransportFilter } from '@/types/api';
import { toast } from 'sonner';

export const TRANSPORT_QUERY_KEY = 'transport';

export function useTransport(filter?: TransportFilter) {
  return useQuery({
    queryKey: [TRANSPORT_QUERY_KEY, filter],
    queryFn: () => transportApi.getAll(filter),
  });
}

export function useTransportByRegNumber(regNumber: string) {
  return useQuery({
    queryKey: [TRANSPORT_QUERY_KEY, regNumber],
    queryFn: () => transportApi.getByRegNumber(regNumber),
    enabled: !!regNumber,
  });
}

export function useCreateTransport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransportRequest) => transportApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSPORT_QUERY_KEY] });
      toast.success('Транспорт успешно добавлен');
    },
    onError: (error: Error) => {
      toast.error(`Ошибка добавления транспорта: ${error.message}`);
    },
  });
}

export function useUpdateTransport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTransportRequest) => transportApi.update(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [TRANSPORT_QUERY_KEY] });
      queryClient.setQueryData([TRANSPORT_QUERY_KEY, data.regNumber], data);
      toast.success('Транспорт успешно обновлен');
    },
    onError: (error: Error) => {
      toast.error(`Ошибка обновления транспорта: ${error.message}`);
    },
  });
}

export function useDeleteTransport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (regNumber: string) => transportApi.delete(regNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSPORT_QUERY_KEY] });
      toast.success('Транспорт успешно удален');
    },
    onError: (error: Error) => {
      toast.error(`Ошибка удаления транспорта: ${error.message}`);
    },
  });
}
