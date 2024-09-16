import { ChainType, getChains } from '@lifi/sdk';
import type { ChainId, ExtendedChain } from '@lifi/types';
import { useQuery } from '@tanstack/react-query';

export interface ChainProps {
  chains: ExtendedChain[];
  isSuccess: boolean;
  getChainById: (id: ChainId) => ExtendedChain | undefined;
}

export const useChains = (): ChainProps => {
  const { data, isSuccess } = useQuery({
    queryKey: ['chainStats'],
    queryFn: async () => {
      const chains = await getChains({
        chainTypes: [ChainType.EVM, ChainType.SVM],
      });
      return { chains };
    },
    enabled: true,
    refetchInterval: 1000 * 60 * 60,
  });

  const getChainById = (id: ChainId) => {
    const filteredChain = data?.chains.find((el) => el.id === id);
    if (filteredChain) {
      return filteredChain;
    } else {
      console.error(`ChainID ${id} is not available`);
    }
  };

  return {
    getChainById,
    chains: data?.chains || ([] as ExtendedChain[]),
    isSuccess,
  };
};
