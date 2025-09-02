import { ChainType, getTokens } from '@lifi/sdk';
import type { TokensResponse } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import {
  getTokenBySymbol as getTokenBySymbolHelper,
  getTokenByName as getTokenByNameHelper,
  getNativeTokenForChain as getNativeTokenForChainHelper,
} from '@/utils/tokenAndChain';

export const queryKey = ['tokenStats'];

export const getTokensQuery = async () => {
  const tokens = await getTokens({
    chainTypes: [ChainType.EVM, ChainType.SVM, ChainType.UTXO, ChainType.MVM],
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
  const getNativeTokenForChain = (chainId: number) => {
    if (!data?.tokens) {
      return;
    }
    return getNativeTokenForChainHelper(data?.tokens, chainId);
  };

  return {
    getTokenBySymbol,
    getTokenByName,
    getNativeTokenForChain,
    tokens: data || ({} as TokensResponse),
    isSuccess,
  };
};
