'use client';
import { useQuery } from '@tanstack/react-query';

export interface AvailableRewards {
  chainId: number;
  address: string;
  symbol: string;
  accumulatedAmountForContractBN: string;
  amountToClaim: number;
  amountAccumulated: number;
  proof: string[];
  explorerLink: string;
  chainLogo: string;
  tokenLogo: string;
  claimingAddress: string;
  decimalsToShow: number;
}

export interface MerklToken {
  id: string;
  name: string;
  chainId: number;
  address: string;
  decimals: number;
  symbol: string;
  displaySymbol: string;
  icon: string;
  verified: boolean;
  isTest: boolean;
  isPoint: boolean;
  isPreTGE: boolean;
  isNative: boolean;
  price: number | null;
  minimumAmountPerHour: string;
}

export interface UseMerklTokensResponse {
  isSuccess: boolean;
  isLoading: boolean;
  data: MerklToken[] | undefined;
}

export interface UseMerklTokensProps {
  chainId?: string;
}

const MERKL_API = 'https://api.merkl.xyz/v4';
const CACHE_TIME = 1000 * 60 * 60; // 1 hour
const STALE_TIME = 1000 * 60 * 5; // 5 minutes

export const useMerklTokens = ({
  chainId,
}: UseMerklTokensProps): UseMerklTokensResponse => {
  // Call to get the merkl tokens on a chain
  const MERKL_TOKENS_API = `${MERKL_API}/tokens/reward/${chainId}`;
  const {
    data: merklTokensData,
    isSuccess: positionsIsSuccess,
    isLoading: positionsIsLoading,
  } = useQuery<MerklToken[]>({
    queryKey: ['MerklTokens', chainId],
    enabled: !!chainId,
    queryFn: async () => {
      const response = await fetch(MERKL_TOKENS_API, {
        next: {
          revalidate: 3600, // Revalidate every hour
          tags: ['merkl-tokens', `merkl-tokens-${chainId}`], // Tag for manual revalidation
        },
      });
      const result = await response.json();
      return result;
    },
    refetchInterval: CACHE_TIME, // Refetch every hour
    staleTime: STALE_TIME, // Consider data stale after 5 minutes
    gcTime: CACHE_TIME, // Keep data in cache for 1 hour
  });

  return {
    isLoading: positionsIsLoading,
    isSuccess: positionsIsSuccess,
    data: merklTokensData,
  };
};
