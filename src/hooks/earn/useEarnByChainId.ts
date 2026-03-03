import { useMemo } from 'react';
import { useChains } from '../useChains';
import { useEarnByChainType } from './useEarnByChainType';

export const useEarnByChainId = (chainId?: number) => {
  const { getChainById } = useChains();
  const { data } = useEarnByChainType();

  const chain = useMemo(() => {
    if (!chainId) {
      return undefined;
    }
    return getChainById(chainId);
  }, [chainId, getChainById]);

  const chainData = chain
    ? data?.[chain.chainType as keyof typeof data]
    : undefined;

  return {
    account: chainData?.account,
    chains: chainData?.chains ?? [],
    chainType: chain?.chainType,
  };
};
