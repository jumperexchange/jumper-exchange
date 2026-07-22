'use client';
import { useEffect, useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { makeClient } from '@/app/lib/client';
import { getQueryKey } from '@/utils/queries/getQueryKey';
import { ORDERS_PAGE_SIZE } from '@/components/LimitOrders/OrdersSection/constants';
import type { LimitOrder } from '@/types/jumper-backend';

interface LimitOrdersPage {
  orders: LimitOrder[];
  nextCursor: string | null;
}

export const useLimitOrders = (
  address: string | undefined,
  tool: string | undefined,
  pageSize = ORDERS_PAGE_SIZE,
) => {
  const [pageIndex, setPageIndex] = useState(0);
  const queryClient = useQueryClient();
  const queryKey = [getQueryKey('limit-orders'), tool, address, pageSize];

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage: infiniteHasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<
    LimitOrdersPage,
    Error,
    { pages: LimitOrdersPage[] },
    readonly unknown[],
    string | undefined
  >({
    queryKey,
    initialPageParam: undefined,
    queryFn: async ({ pageParam, signal }) => {
      if (!address || !tool) {
        return { orders: [], nextCursor: null };
      }

      const client = makeClient();
      const res = await client.limitOrder.ordersControllerGetOrdersByUser(
        tool,
        address,
        { limit: pageSize, cursor: pageParam },
        { signal },
      );
      return {
        orders: res.data.data ?? [],
        nextCursor: res.data.meta?.nextCursor ?? null,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!address && !!tool,
  });

  useEffect(() => {
    setPageIndex(0);
  }, [address, tool]);

  const pageCount = data?.pages.length ?? 0;
  const currentPage = data?.pages[pageIndex];

  const hasNextPage = pageIndex < pageCount - 1 || !!infiniteHasNextPage;
  const hasPreviousPage = pageIndex > 0;

  const goToNextPage = async () => {
    if (pageIndex < pageCount - 1) {
      setPageIndex((index) => index + 1);
    } else if (infiniteHasNextPage) {
      try {
        const result = await fetchNextPage();
        if (result.status === 'success') {
          setPageIndex((index) => index + 1);
        }
      } catch {
        // request was cancelled because address/tool changed mid-fetch
      }
    }
  };

  const goToPreviousPage = () => {
    setPageIndex((index) => Math.max(0, index - 1));
  };

  const refresh = async () => {
    setPageIndex(0);
    await queryClient.resetQueries({ queryKey });
  };

  return {
    orders: currentPage?.orders ?? [],
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
    isLoading: isLoading || isFetchingNextPage,
    refresh,
  };
};
