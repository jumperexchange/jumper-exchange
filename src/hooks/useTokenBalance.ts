'use client';
import { getToken, getTokenBalance, TokenAmount } from '@lifi/sdk';
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
    data: tokenInfo,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: ['tokenInfo' + tokenAddress + walletAddress + chainId],
    queryFn: async () => {
      try {
        const response = await getToken(chainId, tokenAddress);
        return response;
      } catch (err) {
        console.log(err);
        return null;
      }
    },
    enabled: !!tokenAddress && !!walletAddress,
    refetchInterval: 1000 * 60 * 60,
  });

  const {
    data: balance,
    isSuccess: isBalanceSuccess,
    isLoading: isBalanceLoading,
  } = useQuery({
    queryKey: ['tokenBalance' + tokenAddress + walletAddress + chainId],
    queryFn: async () => {
      try {
        if (!tokenInfo) return null;
        const tokenBalance = await getTokenBalance(walletAddress, tokenInfo);
        return tokenBalance;
      } catch (err) {
        console.log(err);
        return null;
      }
    },
    enabled: !!tokenInfo && !!walletAddress,
    refetchInterval: 100,
  });

  return {
    data: balance,
    isSuccess: isBalanceLoading,
    isLoading: isBalanceSuccess,
  };
};
