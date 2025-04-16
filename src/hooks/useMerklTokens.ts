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

export const useMerklTokens = ({
  chainId,
}: UseMerklTokensProps): UseMerklTokensResponse => {
  // Call to get the merkl tokens on a chain
  const MERKL_TOKENS_API = `${MERKL_API}/tokens/reward/${chainId}`;
  const {
    data: merklTokensData,
    isSuccess: positionsIsSuccess,
    isLoading: positionsIsLoading,
  } = useQuery({
    queryKey: ['MerklTokens', chainId],
    enabled: !!chainId,
    queryFn: async () => {
      const response = await fetch(MERKL_TOKENS_API, {});
      const result = await response.json();
      return result;
    },
    refetchInterval: 1000 * 60 * 60,
  });

  return {
    isLoading: positionsIsLoading,
    isSuccess: positionsIsSuccess,
    data: merklTokensData,
  };
};
