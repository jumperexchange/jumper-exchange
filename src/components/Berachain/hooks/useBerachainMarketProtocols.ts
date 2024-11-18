import { useMemo } from 'react';
import type { BerachainMarketType } from '../const/berachainExampleData';

export const useBerachainMarketProtocols = (data: BerachainMarketType[]) => {
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
