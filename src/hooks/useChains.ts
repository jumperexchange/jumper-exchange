import { ChainType, getChains } from '@lifi/sdk';
import type { ChainId, ExtendedChain } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import { getChainById as getChainByIdHelper } from '@/utils/tokenAndChain';

export const queryKey = ['chainStats'];

export interface ChainProps {
  chains: ExtendedChain[];
  isSuccess: boolean;
  getChainById: (id: ChainId) => ExtendedChain | undefined;
}

export async function getChainsQuery() {
    const chains = await getChains({
      chainTypes: [ChainType.EVM, ChainType.SVM, ChainType.UTXO],
    });
    return { chains };
}

export const useChains = (): ChainProps => {
  const { data, isSuccess } = useQuery({
    queryKey: ['chainStats'],
    queryFn: getChainsQuery,
    enabled: true,
    refetchInterval: 1000 * 60 * 60,
  });

  const getChainById = (id: ChainId) => {
    return getChainByIdHelper(data?.chains ?? [], id);
  };

  return {
    getChainById,
    chains: data?.chains || ([] as ExtendedChain[]),
    isSuccess,
  };
};
