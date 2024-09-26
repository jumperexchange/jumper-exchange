import { ChainType, getChains } from '@lifi/sdk';
import type { Chain, ChainId, ExtendedChain } from '@lifi/types';
import { useQuery } from '@tanstack/react-query';
import { getChainById as getChainByIdHelper } from '@/utils/tokenAndChain';

export const queryKey = ['chainStats'];

export const getChainsQuery = async () => {
  const chains = await getChains({
    chainTypes: [ChainType.EVM, ChainType.SVM],
  });
  return { chains };
};

export const useChains = () => {
  const { data, isSuccess } = useQuery({
    queryKey,
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

/*
sei-sei-to-ethereum-eth
Sei-SEI-to-Ethereum-ETH
 */
