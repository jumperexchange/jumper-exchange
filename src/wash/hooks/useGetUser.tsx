import { useUmi } from '../contexts/useUmi';
import { WASH_ENDPOINT_ROOT_URI } from '../utils/constants';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

import type { TAPIQuest, TItems } from '../types/types';
import { useCallback } from 'react';

export type TGetUser = {
  isLoading: boolean;
  items?: TItems;
  quests?: TAPIQuest[];
  error?: Error | null;
  refetch?: VoidFunction;
};

type TGetUserResponse = {
  items?: TItems;
  quests?: TAPIQuest[];
};

export function useGetUser(): TGetUser {
  const wallet = useWallet();
  const { umi } = useUmi();

  const fetchUser = useCallback(async (): Promise<TGetUserResponse> => {
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
    return { items: result.items, quests: result.activeQuests };
  }, [umi?.identity.publicKey, wallet.publicKey]);

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    enabled: Boolean(umi && wallet?.connected && wallet.publicKey),
  });

  return {
    isLoading,
    items: data?.items,
    quests: data?.quests,
    error,
    refetch,
  };
}
