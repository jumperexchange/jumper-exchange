import type { ChainId } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import type { Address } from 'viem';

import { ExtendedToken } from '../utils/Token';
import { getQueryKey } from '@/utils/queries/getQueryKey';
import { getTokensQuery } from '@/app/lib/tokens/tokenQueries';

export const useTokens = () => {
  const { data, isLoading, isSuccess, isError, error, dataUpdatedAt } =
    useQuery({
      queryKey: [getQueryKey('tokens')],
      queryFn: ({ signal }) => getTokensQuery(signal),
      refetchInterval: 1000 * 60 * 60,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });

  const getToken = useCallback(
    (chainId: ChainId, address: Address) => {
      if (!data) {
        return;
      }
      if (!data[chainId]) {
        return;
      }
      const tokenData = data[chainId].find(
        (token) => token.address.toLowerCase() === address.toLowerCase(),
      );
      if (!tokenData) {
        return;
      }
      // NOTE: We are using the StaticToken type here as USD prices from the /tokens
      // endpoint tend to be incorrect. Use useToken() instead
      // TODO: This needs to be StaticToken
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
