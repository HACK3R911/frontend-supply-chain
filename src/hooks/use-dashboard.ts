// React Query хук для получения статистики дашборда

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/services/api';

export const DASHBOARD_QUERY_KEY = 'dashboard';

export function useDashboardStats() {
  return useQuery({
    queryKey: [DASHBOARD_QUERY_KEY, 'stats'],
    queryFn: () => dashboardApi.getStats(),
  });
}
