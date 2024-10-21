import { useUmi } from '../contexts/useUmi';
import { WASH_ENDPOINT_ROOT_URI } from '../utils/constants';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

import type { TItems } from '../types/types';

export type TGetItems = {
  isLoading: boolean;
  items?: TItems;
  error?: Error | null;
  refetch?: VoidFunction;
};

export function useGetItems(): TGetItems {
  const wallet = useWallet();
  const { umi } = useUmi();

  const fetchItems = async (): Promise<TItems> =>
    axios
      .get(`${WASH_ENDPOINT_ROOT_URI}/user/${umi?.identity.publicKey}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${wallet.publicKey?.toBase58()}`,
        },
      })
      .then((res) => res.data.items);

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
