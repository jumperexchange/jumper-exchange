import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { HttpResponse } from '@/types/jumper-backend';

interface UseEarnQueryConfig<TData, TFilter, TSelectedData = TData> {
  queryKey: (string | TFilter | undefined)[];
  fetcher: (filter: TFilter) => Promise<HttpResponse<TData, unknown>>;
  filter: TFilter;
  placeholderData?: UseQueryOptions<TData, unknown>['placeholderData'];
  refetchInterval?: number;
  enabled?: boolean;
  select?: (data: TData) => TSelectedData;
}

export const useEarnQuery = <TData, TFilter, TSelectedData = TData>({
  queryKey,
  fetcher,
  filter,
  placeholderData,
  refetchInterval,
  enabled = true,
  select,
}: UseEarnQueryConfig<TData, TFilter, TSelectedData>): UseQueryResult<
  TSelectedData,
  unknown
> => {
  return useQuery<TData, unknown, TSelectedData>({
    queryKey,
    queryFn: async (): Promise<TData> => {
      const result = await fetcher(filter);
      if (!result.ok) {
        throw result.error;
      }
      return result.data;
    },
    refetchInterval,
    placeholderData,
    enabled,
    select,
  });
};
