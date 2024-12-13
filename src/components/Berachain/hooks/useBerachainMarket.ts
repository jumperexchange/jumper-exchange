import { useMemo } from 'react';
import type { ExtendedQuest } from 'src/types/questDetails';
import { useBerachainMarketsFilterStore } from '../stores/BerachainMarketsFilterStore';
import { useBerachainMarkets } from './useBerachainMarkets';

interface UseBerachainQuestsProps {
  data: ExtendedQuest[] | undefined;
  url: string;
  isSuccess: boolean;
  isLoading: boolean;
}

export const useBerachainMarket = (): UseBerachainQuestsProps => {
  const {
    data: berachainMarkets,
    url,
    isLoading,
    isSuccess,
  } = useBerachainMarkets();

  const { chainFilter, tokenFilter, protocolFilter, sort, search } =
    useBerachainMarketsFilterStore((state) => state);

  const data = useMemo(() => {
    let filteredData = berachainMarkets;
    if (!filteredData) {
      return [];
    }
    if (chainFilter.length > 0) {
      filteredData = filteredData?.filter((market) => {
        if (!market.protocolInfos?.chain) {
          return undefined;
        }
        return !chainFilter.includes(market.protocolInfos?.chain);
      });
    }
    if (tokenFilter.length > 0) {
      filteredData = filteredData?.filter((market) => {
        return !market.protocolInfos?.tokens.some((token) =>
          tokenFilter.includes(token),
        );
      });
    }
    if (protocolFilter.length > 0) {
      filteredData = filteredData?.filter((market) => {
        if (!market.attributes.CustomInformation?.type) {
          return undefined;
        }
        return !protocolFilter.includes(
          market.attributes.CustomInformation?.type,
        );
      });
    }
    // Apply sorting
    if (sort) {
      filteredData?.sort((a, b) => {
        if (sort === 'TVL' && a.protocolInfos?.tvl && b.protocolInfos?.tvl) {
          // Convert TVL strings to numbers for comparison
          const tvlA = parseFloat(
            a.protocolInfos?.tvl.replace('$', '').replace(',', ''),
          );
          const tvlB = parseFloat(
            b.protocolInfos?.tvl.replace('$', '').replace(',', ''),
          );
          return tvlB - tvlA; // Sort in descending order
        } else if (
          sort === 'APY' &&
          a.protocolInfos?.apys.total &&
          b.protocolInfos?.apys.total
        ) {
          // Convert APY to numbers for comparison
          const apyA =
            typeof a.protocolInfos?.apys.total === 'number'
              ? a.protocolInfos?.apys.total
              : parseFloat(
                  a.protocolInfos?.apys.total
                    .replace('K%', '000')
                    .replace('%', ''),
                );
          const apyB =
            typeof b.protocolInfos?.apys.total === 'number'
              ? b.protocolInfos?.apys.total
              : parseFloat(
                  b.protocolInfos?.apys.total
                    .replace('K%', '000')
                    .replace('%', ''),
                );
          return apyB - apyA; // Sort in descending order
        }
        return 0; // Return 0 if neither condition is met
      });
    }
    // Apply search filter
    if (search) {
      filteredData = filteredData?.filter((market) => {
        const protocolName = market.attributes.Title.toLowerCase();
        const searchTerm = search.toLowerCase();
        return protocolName.includes(searchTerm);
      });
    }

    return filteredData;
  }, [
    berachainMarkets,
    chainFilter,
    protocolFilter,
    search,
    sort,
    tokenFilter,
  ]);

  return { data, url, isLoading, isSuccess };
};
