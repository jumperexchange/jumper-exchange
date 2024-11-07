import { useUmi } from '../contexts/useUmi';
import { WASH_ENDPOINT_ROOT_URI } from '../utils/constants';
import { useQuery } from '@tanstack/react-query';

import type { TAPIQuest, TItems } from '../types/types';
import { useCallback } from 'react';
import { useAccount } from '@lifi/wallet-management';
import { ChainType } from '@lifi/sdk';

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
  const { account } = useAccount({ chainType: ChainType.SVM });
  const { umi } = useUmi();

  const fetchUser = useCallback(async (): Promise<TGetUserResponse> => {
    const response = await fetch(
      `${WASH_ENDPOINT_ROOT_URI}/user/${umi?.identity.publicKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${account.address ?? ''}`,
        },
      },
    );
    const result = await response.json();
    return { items: result.items, quests: result.userQuests };
  }, [umi?.identity.publicKey, account.address]);

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    enabled: Boolean(umi && account.isConnected && account.address),
  });

  return {
    isLoading,
    items: data?.items,
    quests: data?.quests,
    error,
    refetch,
  };
}
