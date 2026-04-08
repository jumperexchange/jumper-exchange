import type { ChainId, ExtendedChain } from '@lifi/sdk';
import { ChainType, getChains } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import { sdkClient } from '@/utils/instrumentation/lifiSdkConfig';
import { getChainById as getChainByIdHelper } from '@/utils/tokenAndChain';
import { useCallback } from 'react';
import { getQueryKey } from '@/utils/queries/getQueryKey';

export const queryKey = [getQueryKey('chains')];

export interface ChainProps {
  chains: ExtendedChain[];
  isSuccess: boolean;
  isLoading: boolean;
  getChainById: (id: ChainId) => ExtendedChain | undefined;
}

export async function getChainsQuery() {
  const chains = await getChains(sdkClient, {
    chainTypes: [ChainType.EVM, ChainType.SVM, ChainType.UTXO, ChainType.MVM],
  });
  return { chains };
}

export const useChains = (): ChainProps => {
  const { data, isSuccess, isLoading } = useQuery({
    queryKey,
    queryFn: getChainsQuery,
    enabled: true,
    refetchInterval: 1000 * 60 * 60,
  });

  const getChainById = useCallback(
    (id: ChainId) => {
      return getChainByIdHelper(data?.chains ?? [], id);
    },
    [data?.chains],
  );

  return {
    getChainById,
    chains: data?.chains || ([] as ExtendedChain[]),
    isSuccess,
    isLoading,
  };
};
