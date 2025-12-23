// React Query хуки для работы с контрагентами

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contractorsApi } from '@/services/api';
import { CreateContractorRequest, UpdateContractorRequest, ContractorsFilter } from '@/types/api';
import { toast } from 'sonner';

export const CONTRACTORS_QUERY_KEY = 'contractors';

export function useContractors(filter?: ContractorsFilter) {
  return useQuery({
    queryKey: [CONTRACTORS_QUERY_KEY, filter],
    queryFn: () => contractorsApi.getAll(filter),
  });
}

export function useContractor(id: number) {
  return useQuery({
    queryKey: [CONTRACTORS_QUERY_KEY, id],
    queryFn: () => contractorsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateContractor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateContractorRequest) => contractorsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTRACTORS_QUERY_KEY] });
      toast.success('Контрагент успешно создан');
    },
    onError: (error: Error) => {
      toast.error(`Ошибка создания контрагента: ${error.message}`);
    },
  });
}

export function useUpdateContractor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateContractorRequest) => contractorsApi.update(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [CONTRACTORS_QUERY_KEY] });
      queryClient.setQueryData([CONTRACTORS_QUERY_KEY, data.id], data);
      toast.success('Контрагент успешно обновлен');
    },
    onError: (error: Error) => {
      toast.error(`Ошибка обновления контрагента: ${error.message}`);
    },
  });
}

export function useDeleteContractor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => contractorsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTRACTORS_QUERY_KEY] });
      toast.success('Контрагент успешно удален');
    },
    onError: (error: Error) => {
      toast.error(`Ошибка удаления контрагента: ${error.message}`);
    },
  });
}
