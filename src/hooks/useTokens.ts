import type { Token } from '@lifi/sdk';
import { ChainType, getTokens } from '@lifi/sdk';
import type { TokensResponse } from '@lifi/types';
import { useQuery } from '@tanstack/react-query';

export const queryKey = ['tokenStats'];

export const getTokensQuery = async () => {
  const tokens = await getTokens({
    chainTypes: [ChainType.EVM, ChainType.SVM],
  });
  return tokens;
};

export const useTokens = () => {
  const { data, isSuccess } = useQuery({
    queryKey,
    queryFn: getTokensQuery,
    enabled: true,
    refetchInterval: 1000 * 60 * 60,
  });

  const getTokenByNameOnSpecificChain = (chainId: number, name: string) => {
    const chainTokens = data?.tokens[chainId];
    if (!chainTokens) {
      return;
    }

    const filteredToken = chainTokens.find(
      (el: Token) => el.symbol.toLowerCase() === name.toLowerCase(),
    );
    if (filteredToken) {
      return filteredToken;
    } else {
      console.error(`Token name ${name} is not available`);
    }
  };

  const getTokenBySymbol = (symbol: string) => {
    return Object.values(data?.tokens ?? [])
      .flat()
      .filter((el) => {
        return el.symbol.toLowerCase() === symbol.toLowerCase();
      });
  };

  const getTokenByName = (name: string) => {
    return Object.values(data?.tokens ?? [])
      .flat()
      .filter((el) => {
        return el.name.toLowerCase() === name.toLowerCase();
      });
  };

  return {
    getTokenByNameOnSpecificChain,
    getTokenBySymbol,
    getTokenByName,
    tokens: data || ({} as TokensResponse),
    isSuccess,
  };
};
