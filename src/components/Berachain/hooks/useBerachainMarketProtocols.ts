import { useMemo } from 'react';
import type { ExtendedQuest, QuestDetails } from 'src/types/questDetails';

export const useBerachainMarketProtocols = (
  data: ExtendedQuest[] | undefined,
) => {
  const preparedTokens = useMemo(() => {
    if (!data || data.length === 0) {
      return undefined;
    }

    const filteredTokens = data.flatMap(
      (market) => (market?.attributes?.CustomInformation as QuestDetails).type,
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
