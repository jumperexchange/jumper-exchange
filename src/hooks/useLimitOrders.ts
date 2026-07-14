'use client';
import { useAccount } from '@jumperexchange/wallet-management';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { makeClient } from '@/app/lib/client';
import { getQueryKey } from '@/utils/queries/getQueryKey';
import { ORDERS_PAGE_SIZE } from '@/components/LimitOrders/OrdersSection/constants';

export const useLimitOrders = (page: number, pageSize = ORDERS_PAGE_SIZE) => {
  const { account } = useAccount();
  const address = account?.address;

  return useQuery({
    queryKey: [getQueryKey('limit-orders'), address, page, pageSize],
    queryFn: async () => {
      if (!address) {
        return { orders: [], total: 0, pageSize, pageCount: 0 };
      }

      const client = makeClient();
      const res = await client.limitOrder.ordersControllerGetOrdersByUser(
        address,
        { limit: pageSize, offset: page * pageSize },
      );
      const total = res.data.meta?.total ?? 0;
      // Echo back the limit the backend actually applied, so callers never
      // have to guess it from the request-time default.
      const appliedPageSize = res.data.meta?.limit ?? pageSize;
      return {
        orders: res.data.data ?? [],
        total,
        pageSize: appliedPageSize,
        pageCount: Math.ceil(total / appliedPageSize),
      };
    },
    placeholderData: keepPreviousData,
    enabled: !!address,
  });
};
