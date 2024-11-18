import { useMemo } from 'react';
import { berachainMarkets } from '../const/berachainExampleData';
import { useBerachainMarketsFilterStore } from '../stores/BerachainMarketsFilterStore';

export const useBerachainMarket = () => {
  const { chainFilter, tokenFilter, protocolFilter, sort, search } =
    useBerachainMarketsFilterStore((state) => state);

  const data = useMemo(() => {
    let filteredData = berachainMarkets;
    if (chainFilter.length > 0) {
      filteredData = filteredData.filter((market) => {
        return !chainFilter.includes(market.chain);
      });
    }
    if (tokenFilter.length > 0) {
      filteredData = filteredData.filter((market) => {
        return !market.tokens.some((token) => tokenFilter.includes(token));
      });
    }
    if (protocolFilter.length > 0) {
      filteredData = filteredData.filter((market) => {
        return !protocolFilter.includes(market.protocol.type);
      });
    }
    // Apply sorting
    if (sort) {
      filteredData.sort((a, b) => {
        if (sort === 'TVL') {
          // Convert TVL strings to numbers for comparison
          const tvlA = parseFloat(a.tvl.replace('$', '').replace(',', ''));
          const tvlB = parseFloat(b.tvl.replace('$', '').replace(',', ''));
          return tvlB - tvlA; // Sort in descending order
        } else if (sort === 'APY') {
          // Convert APY to numbers for comparison
          const apyA =
            typeof a.apys.total === 'number'
              ? a.apys.total
              : parseFloat(a.apys.total.replace('K%', '000').replace('%', ''));
          const apyB =
            typeof b.apys.total === 'number'
              ? b.apys.total
              : parseFloat(b.apys.total.replace('K%', '000').replace('%', ''));
          return apyB - apyA; // Sort in descending order
        }
        return 0; // Return 0 if neither condition is met
      });
    }
    // Apply search filter
    if (search) {
      filteredData = filteredData.filter((market) => {
        const protocolName = market.protocol.name.toLowerCase();
        const searchTerm = search.toLowerCase();
        return protocolName.includes(searchTerm);
      });
    }
    return filteredData;
  }, [chainFilter, tokenFilter, protocolFilter, sort, search]);

  return data;
};
