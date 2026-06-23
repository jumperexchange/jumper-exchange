'use client';
import { useAccount } from '@lifi/wallet-management';
import { useQuery } from '@tanstack/react-query';
import { makeLimitOrderClient } from '@/app/lib/limitOrderClient';
import type { LimitOrder } from '@/components/LimitOrders/types';
import { getQueryKey } from '@/utils/queries/getQueryKey';

export const useLimitOrders = () => {
  const { account } = useAccount();
  const address = account?.address;

  return useQuery({
    queryKey: [getQueryKey('limit-orders'), address],
    queryFn: async (): Promise<LimitOrder[]> => {
      const client = makeLimitOrderClient();
      const res = await client.orders.ordersControllerGetOrdersByUser(address!);
      return (res.data as unknown as LimitOrder[]) ?? [];
    },
    enabled: !!address,
  });
};
