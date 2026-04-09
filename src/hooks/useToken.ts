import { type ChainId, getToken } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import { sdkClient } from '@/utils/instrumentation/lifiSdkConfig';
import type { Address } from 'viem';
import type { SimpleToken } from '../utils/Token';
import { ExtendedToken } from '../utils/Token';
import { useTokens } from './useTokens';

export async function getTokenQuery(chainId?: ChainId, tokenAddress?: string) {
  if (!chainId || !tokenAddress) {
    return;
  }
  return getToken(sdkClient, chainId, tokenAddress);
}

type UseTokenReturn<T> = {
  error: Error | null;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  updatedAt: number;
  token: T | undefined;
};

export function useToken(
  chainId: ChainId,
  address: Address,
  options: { extended: true },
): UseTokenReturn<ExtendedToken>;

export function useToken(
  chainId: ChainId,
  address: Address,
  options?: { extended?: false },
): UseTokenReturn<SimpleToken>;

export function useToken(
  chainId: ChainId,
  address: Address,
  options?: { extended?: boolean },
): UseTokenReturn<ExtendedToken | SimpleToken> {
  const {
    getToken,
    error: bulkError,
    isError: isBulkError,
    isSuccess: isBulkSuccess,
    isLoading: isBulkLoading,
    updatedAt: bulkUpdatedAt,
  } = useTokens();
  const {
    data: individualToken,
    error: individualError,
    isError: isIndividualError,
    isLoading: isIndividualLoading,
    isSuccess: isIndividualSuccess,
    dataUpdatedAt: individualUpdatedAt,
  } = useQuery({
    queryKey: ['token', chainId, address],
    queryFn: () => getTokenQuery(chainId, address),
    enabled: options?.extended,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
  });

  if (options?.extended) {
    return {
      error: individualError,
      isError: isIndividualError,
      isLoading: isIndividualLoading,
      isSuccess: isIndividualSuccess,
      token: individualToken ? new ExtendedToken(individualToken) : undefined,
      updatedAt: individualUpdatedAt,
    };
  }

  return {
    error: bulkError,
    isError: isBulkError,
    isLoading: isBulkLoading,
    isSuccess: isBulkSuccess,
    token: getToken(chainId, address),
    updatedAt: bulkUpdatedAt,
  };
}
