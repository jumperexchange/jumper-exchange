import type { ChainId } from '@lifi/sdk';
import { useMemo } from 'react';
import type { UseMultipleTokenProps } from 'src/hooks/useMultipleTokens';
import { useMultipleTokens } from 'src/hooks/useMultipleTokens';
import type { BerachainMarket } from './useBerachainMarket';

export const useBerachainMarketTokens = (data: BerachainMarket[]) => {
  const preparedTokens = useMemo(() => {
    if (!data || data.length === 0) {
      return undefined;
    }

    const filteredTokens = data.flatMap((market) =>
      market.tokens.map((tokenAddress: string) => ({
        chainId: market.chain as ChainId,
        tokenAddress,
      })),
    );

    // Remove duplicates based on tokenAddress
    const uniqueTokens = filteredTokens.reduce((acc, current) => {
      const x = acc.find((item) => item.tokenAddress === current.tokenAddress);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, [] as UseMultipleTokenProps[]);

    return uniqueTokens;
  }, [data]);

  const { tokens, isError, isLoading } = useMultipleTokens(preparedTokens);

  return { tokens, isError, isLoading };
};
