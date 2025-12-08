import { useMemo } from 'react';
import { useChains } from './useChains';

export const useBlockchainExplorerURL = (
  chainId?: number,
  address?: string,
  prefix: string = 'address',
) => {
  const { isSuccess, getChainById } = useChains();

  return useMemo(() => {
    if (!chainId || !address || !isSuccess) {
      return undefined;
    }

    const chain = getChainById(chainId);
    if (!chain) {
      return undefined;
    }

    return `${chain.metamask?.blockExplorerUrls?.[0]}${prefix ? prefix : ''}/${address}`;
  }, [chainId, address, prefix, getChainById, isSuccess]);
};
