import { useCallback, useMemo } from 'react';
import { useChains } from './useChains';

const DEFAULT_PREFIX = 'address';

const buildExplorerUrl = (baseUrl: string, address: string, prefix: string) => {
  const normalizedBaseUrl = baseUrl.endsWith('/')
    ? baseUrl.slice(0, -1)
    : baseUrl;
  return `${normalizedBaseUrl}/${prefix}/${address}`;
};

export const useGetAddressExplorerUrl = (prefix: string = DEFAULT_PREFIX) => {
  const { isSuccess, getChainById } = useChains();

  return useCallback(
    (chainId?: number, address?: string) => {
      if (!chainId || !address || !isSuccess) {
        return undefined;
      }

      const chain = getChainById(chainId);
      const explorerUrl = chain?.metamask?.blockExplorerUrls?.[0];
      if (!explorerUrl) {
        return undefined;
      }

      return buildExplorerUrl(explorerUrl, address, prefix);
    },
    [isSuccess, getChainById, prefix],
  );
};

export const useBlockchainExplorerURL = (
  chainId?: number,
  address?: string,
  prefix: string = DEFAULT_PREFIX,
) => {
  const getAddressExplorerUrl = useGetAddressExplorerUrl(prefix);

  return useMemo(
    () => getAddressExplorerUrl(chainId, address),
    [getAddressExplorerUrl, chainId, address],
  );
};
