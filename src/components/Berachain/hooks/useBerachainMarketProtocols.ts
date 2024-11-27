import { useMemo } from 'react';
import type { BerachainMarketInfo, BerachainQuest } from '../berachain.types';

export const useBerachainMarketProtocols = (
  data: BerachainQuest[] | undefined,
) => {
  const preparedTokens = useMemo(() => {
    if (!data || data.length === 0) {
      return undefined;
    }

    const filteredTokens = data.flatMap(
      (market) =>
        (market.attributes.CustomInformation as BerachainMarketInfo).type,
    );

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
