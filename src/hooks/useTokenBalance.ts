'use client';
import type { TokenAmount } from '@lifi/sdk';
import { getToken, getTokenBalances } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';

type useTokenBalanceProps = {
  chainId: number;
  tokenAddress: string;
  walletAddress: string;
};

type useTokenBalanceReturn = {
  data: TokenAmount | null | undefined;
  isSuccess: boolean;
  isLoading: boolean;
};

export const useTokenBalance = ({
  chainId,
  tokenAddress,
  walletAddress,
}: useTokenBalanceProps): useTokenBalanceReturn => {
  const {
    data: balance,
    isSuccess: isBalanceSuccess,
    isLoading: isBalanceLoading,
  } = useQuery({
    queryKey: ['tokenBalances', tokenAddress, walletAddress, chainId],
    queryFn: async () => {
      try {
        const token = await getToken(chainId, tokenAddress);
        const tokenBalance = await getTokenBalances(walletAddress, [token]);
        return tokenBalance?.[0];
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        return null;
      }
    },
    enabled: !!walletAddress && !!chainId && !!tokenAddress,
    refetchInterval: 1000 * 60 * 60,
  });

  return {
    data: balance,
    isSuccess: isBalanceLoading,
    isLoading: isBalanceSuccess,
  };
};
