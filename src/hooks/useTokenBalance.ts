'use client';
import { CoinKey, getToken, getTokenBalance, TokenAmount } from '@lifi/sdk';
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
        const walletAddress = '0x62807Dbbe7d5237F810b6abCbCA089B5D5cC0A94';

        try {
          const token = await getToken(chainId, tokenAddress);
          const tokenBalance = await getTokenBalance(walletAddress, token);
          console.log(tokenBalance);
          return tokenBalance;
        } catch (error) {
          console.error(error);
        }

        // const tokenBalance = await getTokenBalance(
        //   '0x62807Dbbe7d5237F810b6abCbCA089B5D5cC0A94',
        //   {
        //     address: '0x0000000000000000000000000000000000000000',
        //     chainId: 10,
        //     symbol: 'ETH',
        //     decimals: 18,
        //     name: 'ETH',
        //     coinKey: CoinKey.ETH,
        //     logoURI:
        //       'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
        //     priceUSD: '2304.35',
        //   },
        // );
        // console.log('tokenBalance from hooks-----');
        // console.log(tokenBalance);
        // return tokenBalance;
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
