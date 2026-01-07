import type { ChainId, Token } from '@lifi/sdk';
import { ChainType, getTokens } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import type { Address } from 'viem';

import { ExtendedToken } from '../utils/Token';

// NOTE: We are using the StaticToken type here as USD prices from the /tokens
// endpoint tend to be incorrect. Use useToken() instead
// TODO: This needs to be StaticToken
export type AllTokens = { tokens: { [chainId: number]: Token[] } };

export const getTokensQuery = async (): Promise<AllTokens> => {
  const data = await getTokens({
    chainTypes: [ChainType.EVM, ChainType.SVM, ChainType.UTXO, ChainType.MVM],
  });

  return data as { tokens: { [chainId: number]: Token[] } };
};

export const useTokens = () => {
  const { data, isLoading, isSuccess, isError, error, dataUpdatedAt } =
    useQuery({
      queryKey: ['tokens'],
      queryFn: getTokensQuery,
      refetchInterval: 1000 * 60 * 60,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });

  const getToken = useCallback(
    (chainId: ChainId, address: Address) => {
      if (!data) {
        return;
      }
      if (!data.tokens[chainId]) {
        return;
      }
      const tokenData = data.tokens[chainId].find(
        (token) => token.address.toLowerCase() === address.toLowerCase(),
      );
      if (!tokenData) {
        return;
      }
      // TODO: This needs to be SimpleToken
      return new ExtendedToken(tokenData);
    },
    [data],
  );

  return {
    getToken,
    error,
    isError,
    isLoading,
    isSuccess,
    tokens: data,
    updatedAt: dataUpdatedAt,
  };
};
