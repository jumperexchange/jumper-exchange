import { useMemo } from 'react';
import { useChains } from '../useChains';

export const useChainDetails = (chainId?: number) => {
  const { getChainById, isLoading } = useChains();

  const chain = useMemo(() => {
    if (!chainId) {
      return undefined;
    }
    return getChainById(chainId);
  }, [chainId, getChainById]);

  return { chain, isLoading };
};
