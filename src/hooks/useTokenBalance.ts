'use client';
import {
  CoinKey,
  getToken,
  getTokenBalance,
  getTokenBalances,
  TokenAmount,
} from '@lifi/sdk';
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
  console.log('entering into the hook');
  console.log(tokenAddress);
  console.log(walletAddress);
  console.log(chainId);
  const {
    data: balance,
    isSuccess: isBalanceSuccess,
    isLoading: isBalanceLoading,
  } = useQuery({
    queryKey: ['tokenBalances', tokenAddress, walletAddress, chainId],
    queryFn: async () => {
      try {
        // const tokenInfo = await getToken(chainId, tokenAddress);
        // console.log('tokenInfo from hooks-----');
        // console.log(tokenInfo);
        // console.log(!tokenInfo);
        // if (!tokenInfo?.address) return null;
        // console.log('heree after');
        // console.log(tokenInfo);
        const chainId = 10;
        const tokenAddress = '0x0000000000000000000000000000000000000000';
        const walletAddress = '0x62807Dbbe7d5237F810b6abCbxCA089B5D5cC0A94';

        try {
          const token = await getToken(chainId, tokenAddress);
          console.log(token);
          const tokenBalance = await getTokenBalances(walletAddress, [token]);
          console.log('shoooow token balance -');
          console.log(tokenBalance);
          return tokenBalance;
        } catch (error) {
          console.error(error);
        }
      } catch (err) {
        console.log(err);
        return null;
      }
    },
    enabled: true,
    refetchInterval: 10000,
  });

  console.log('balance from hooks-----');
  console.log(balance);

  return {
    data: balance,
    isSuccess: isBalanceLoading,
    isLoading: isBalanceSuccess,
  };
};
