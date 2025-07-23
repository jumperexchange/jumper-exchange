import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { FIVE_MINUTES_MS, TEN_MINUTES_MS } from 'src/const/time';

type PaginatedResult<T> = {
  data: T[];
  hasMore: boolean;
  nextPage: number;
  currentPage: number;
};

type UsePaginatedDataParams<T> = {
  queryKey: unknown[];
  queryFn: (page: number, pageSize: number) => Promise<T[]>;
  initialData?: T[];
  pageSize?: number;
  staleTime?: number;
  gcTime?: number;
};

export function usePaginatedData<T>({
  queryKey,
  queryFn,
  initialData,
  pageSize = 12,
  staleTime = FIVE_MINUTES_MS,
  gcTime = TEN_MINUTES_MS,
}: UsePaginatedDataParams<T>) {
  return useInfiniteQuery<
    PaginatedResult<T>,
    Error,
    InfiniteData<PaginatedResult<T>>,
    unknown[],
    number
  >({
    queryKey,
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const data = await queryFn(pageParam, pageSize);
      return {
        data,
        hasMore: data.length === pageSize,
        nextPage: pageParam + 1,
        currentPage: pageParam,
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
    initialData: initialData
      ? {
          pages: [
            {
              data: initialData,
              hasMore: initialData.length === pageSize,
              nextPage: 2,
              currentPage: 1,
            },
          ],
          pageParams: [1],
        }
      : undefined,
    staleTime,
    gcTime,
  });
}
