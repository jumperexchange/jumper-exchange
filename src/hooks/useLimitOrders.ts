'use client';
import { useAccount } from '@lifi/wallet-management';
import { useQuery } from '@tanstack/react-query';
import { makeLimitOrderClient } from '@/app/lib/limitOrderClient';
import { getQueryKey } from '@/utils/queries/getQueryKey';

export const useLimitOrders = () => {
  const { account } = useAccount();
  const address = account?.address;

  return useQuery({
    queryKey: [getQueryKey('limit-orders'), address],
    queryFn: async () => {
      if (!address) {
        return [];
      }

      const client = makeLimitOrderClient();
      const res =
        await client.limitOrder.ordersControllerGetOrdersByUser(address);
      return res.data ?? [];
    },
    enabled: !!address,
  });
};
