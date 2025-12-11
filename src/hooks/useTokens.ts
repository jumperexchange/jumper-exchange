import {
  getNativeTokenForChain as getNativeTokenForChainHelper,
  getTokenByAddressOnSpecificChain as getTokenByAddressOnSpecificChainHelper,
  getTokenByName as getTokenByNameHelper,
  getTokenBySymbol as getTokenBySymbolHelper,
} from '@/utils/tokenAndChain';
import type { TokensResponse } from '@lifi/sdk';
import { ChainType, getTokens } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

export const queryKey = ['tokenStats'];

export const getTokensQuery = async () => {
  const tokens = await getTokens({
    chainTypes: [ChainType.EVM, ChainType.SVM, ChainType.UTXO, ChainType.MVM],
  });
  console.log(
    'tokens',
    tokens.tokens[1].filter((token) => token.address.startsWith('0x00')),
  );
  return tokens;
};

export const useTokens = () => {
  const { data, isSuccess, isLoading, dataUpdatedAt } = useQuery({
    queryKey,
    queryFn: getTokensQuery,
    enabled: true,
    refetchInterval: 1000 * 60 * 60,
  });

  const tokens = useMemo(
    () => data?.tokens ?? ({} as TokensResponse),
    [data?.tokens],
  );

  const getTokenBySymbol = useCallback(
    (symbol: string) => {
      return getTokenBySymbolHelper(tokens, symbol);
    },
    [tokens],
  );

  const getTokenByName = useCallback(
    (name: string) => {
      return getTokenByNameHelper(tokens, name);
    },
    [tokens],
  );

  const getTokenByAddressAndChain = useCallback(
    (address: string, chainId: number) => {
      return getTokenByAddressOnSpecificChainHelper(tokens, chainId, address);
    },
    [tokens],
  );

  const getNativeTokenForChain = useCallback(
    (chainId: number) => {
      return getNativeTokenForChainHelper(tokens, chainId);
    },
    [tokens],
  );

  return {
    getTokenBySymbol,
    getTokenByName,
    getTokenByAddressAndChain,
    getNativeTokenForChain,
    tokens,
    isSuccess,
    isLoading,
    updatedAt: dataUpdatedAt,
  };
};
