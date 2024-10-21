import { useUmi } from '../contexts/useUmi';
import { WASH_ENDPOINT_ROOT_URI } from '../utils/constants';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

import { useCallback } from 'react';

export type TQuest = {
  id: string;
  userId: string;
  questId: string;
  progress: number;
};

export type TGetQuests = {
  isLoading: boolean;
  activeQuests?: TQuest[];
  error?: Error | null;
  refetch?: VoidFunction;
};

export function useGetQuests(): TGetQuests {
  const wallet = useWallet();
  const { umi } = useUmi();

  const fetchQuests = useCallback(async (): Promise<TQuest[]> => {
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
    return result.activeQuests;
  }, [umi?.identity.publicKey, wallet.publicKey]);

  const {
    isLoading,
    error,
    data: activeQuests,
    refetch,
  } = useQuery({
    queryKey: ['quests'],
    queryFn: fetchQuests,
    enabled: Boolean(umi && wallet?.connected && wallet.publicKey),
  });

  return { isLoading, activeQuests, error, refetch };
}
