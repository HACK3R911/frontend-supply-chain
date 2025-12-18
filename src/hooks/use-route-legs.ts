// React Query хуки для работы с участками маршрутов и событиями

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { routeLegsApi, eventsApi } from '@/services/api';
import { CreateRouteLegRequest, UpdateRouteLegRequest, CreateEventRequest } from '@/types/api';
import { toast } from 'sonner';

export const ROUTE_LEGS_QUERY_KEY = 'routeLegs';
export const EVENTS_QUERY_KEY = 'events';

// Route Legs hooks
export function useRouteLegs() {
  return useQuery({
    queryKey: [ROUTE_LEGS_QUERY_KEY],
    queryFn: () => routeLegsApi.getAll(),
  });
}

export function useRouteLegsByCargoId(cargoId: string) {
  return useQuery({
    queryKey: [ROUTE_LEGS_QUERY_KEY, 'cargo', cargoId],
    queryFn: () => routeLegsApi.getByCargoId(cargoId),
    enabled: !!cargoId,
  });
}

export function useRouteLeg(id: string) {
  return useQuery({
    queryKey: [ROUTE_LEGS_QUERY_KEY, id],
    queryFn: () => routeLegsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateRouteLeg() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRouteLegRequest) => routeLegsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROUTE_LEGS_QUERY_KEY] });
      toast.success('Участок маршрута успешно создан');
    },
    onError: (error: Error) => {
      toast.error(`Ошибка создания участка маршрута: ${error.message}`);
    },
  });
}

export function useUpdateRouteLeg() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateRouteLegRequest) => routeLegsApi.update(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [ROUTE_LEGS_QUERY_KEY] });
      queryClient.setQueryData([ROUTE_LEGS_QUERY_KEY, data.id], data);
      toast.success('Участок маршрута успешно обновлен');
    },
    onError: (error: Error) => {
      toast.error(`Ошибка обновления участка маршрута: ${error.message}`);
    },
  });
}

export function useDeleteRouteLeg() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => routeLegsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROUTE_LEGS_QUERY_KEY] });
      toast.success('Участок маршрута успешно удален');
    },
    onError: (error: Error) => {
      toast.error(`Ошибка удаления участка маршрута: ${error.message}`);
    },
  });
}

// Events hooks
export function useEvents() {
  return useQuery({
    queryKey: [EVENTS_QUERY_KEY],
    queryFn: () => eventsApi.getAll(),
  });
}

export function useEventsByRouteLegId(routeLegId: string) {
  return useQuery({
    queryKey: [EVENTS_QUERY_KEY, 'routeLeg', routeLegId],
    queryFn: () => eventsApi.getByRouteLegId(routeLegId),
    enabled: !!routeLegId,
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: [EVENTS_QUERY_KEY, id],
    queryFn: () => eventsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventRequest) => eventsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ROUTE_LEGS_QUERY_KEY] });
      toast.success('Событие успешно создано');
    },
    onError: (error: Error) => {
      toast.error(`Ошибка создания события: ${error.message}`);
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ROUTE_LEGS_QUERY_KEY] });
      toast.success('Событие успешно удалено');
    },
    onError: (error: Error) => {
      toast.error(`Ошибка удаления события: ${error.message}`);
    },
  });
}
