import type { ChainType } from '@lifi/sdk';
import { useChains } from '../useChains';
import { useMemo } from 'react';

export const useChainsForChainType = (chainType?: ChainType) => {
  const { chains } = useChains();

  return useMemo(() => {
    if (!chainType || !chains.length) {
      return [];
    }

    return chains.filter((chain) => chain.chainType === chainType);
  }, [chainType, chains]);
};
