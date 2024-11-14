import { useMemo } from 'react';
import type { BerachainMarket } from './useBerachainMarket';

export const useBerachainMarketProtocols = (data: BerachainMarket[]) => {
  const preparedTokens = useMemo(() => {
    if (!data || data.length === 0) {
      return undefined;
    }

    const filteredTokens = data.flatMap((market) => market.protocol.type);

    // Remove duplicates based on tokenAddress
    const uniqueMarketTypes = filteredTokens.reduce<string[]>(
      (acc, current) => {
        if (!acc.includes(current)) {
          return [...acc, current];
        } else {
          return acc;
        }
      },
      [],
    );

    return uniqueMarketTypes;
  }, [data]);

  return preparedTokens;
};
