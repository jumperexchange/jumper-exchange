import { useUmi } from '../contexts/useUmi';
import { WASH_ENDPOINT_ROOT_URI } from '../utils/constants';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

import type { TItems } from '../types/types';
import { useCallback } from 'react';

export type TGetItems = {
  isLoading: boolean;
  items?: TItems;
  error?: Error | null;
  refetch?: VoidFunction;
};

export function useGetItems(): TGetItems {
  const wallet = useWallet();
  const { umi } = useUmi();

  const fetchItems = useCallback(async (): Promise<TItems> => {
    const response = await fetch(
      `${WASH_ENDPOINT_ROOT_URI}/user/${umi?.identity.publicKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${wallet.publicKey?.toBase58()}`,
        },
      },
    );
    const result = await response.json();
    return result.items;
  }, [umi?.identity.publicKey, wallet.publicKey]);

  const {
    isLoading,
    error,
    data: items,
    refetch,
  } = useQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
    enabled: Boolean(umi && wallet?.connected && wallet.publicKey),
  });

  return { isLoading, items, error, refetch };
}
