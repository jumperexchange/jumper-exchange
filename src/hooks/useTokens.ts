import type { Token } from '@lifi/sdk';
import { ChainType, getTokens } from '@lifi/sdk';
import type { TokensResponse } from '@lifi/types';
import { useQuery } from '@tanstack/react-query';
import {
  getTokenBySymbol as getTokenBySymbolHelper,
  getTokenByName as getTokenByNameHelper,
} from '@/utils/tokenAndChain';

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

  const getTokenBySymbol = (symbol: string) => {
    if (!data?.tokens) {
      return;
    }
    return getTokenBySymbolHelper(data?.tokens, symbol);
  };

  const getTokenByName = (name: string) => {
    if (!data?.tokens) {
      return;
    }
    return getTokenByNameHelper(data?.tokens, name);
  };

  return {
    getTokenBySymbol,
    getTokenByName,
    tokens: data || ({} as TokensResponse),
    isSuccess,
  };
};
