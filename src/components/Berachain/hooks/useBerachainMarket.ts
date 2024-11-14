import { useMemo } from 'react';
import { useBerachainMarketsFilterStore } from '../stores/BerachainMarketsFilterStore';

// First, define the BerachainProtocolType if it's not already defined
type BerachainProtocolType =
  | 'Recipe'
  | 'Vault'
  | 'Money Market'
  | 'DEX'
  | 'Staking';

// Define interfaces for the nested structures
interface Protocol {
  name: string;
  image: undefined;
  type: BerachainProtocolType;
}

interface ApyToken {
  tokenAddress: string[];
  value: number;
}

interface Apys {
  total: number | string;
  tokens: ApyToken[];
}

// Define the main interface for each market
export interface BerachainMarket {
  protocol: Protocol;
  chain: number;
  tokens: string[];
  tvl: string;
  apys: Apys;
}

export const berachainMarkets: BerachainMarket[] = [
  {
    protocol: {
      name: 'BT Recipe Market',
      image: undefined,
      type: 'Recipe',
    },
    chain: 1,
    tokens: [
      '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    ],
    tvl: '$41.00',
    apys: {
      total: 4.78,
      tokens: [
        {
          tokenAddress: ['0xaddress'],
          value: 2,
        },
        {
          tokenAddress: ['0xaddress'],
          value: 2.78,
        },
      ],
    },
  },
  {
    protocol: {
      name: 'Gummi Vault Market',
      image: undefined,
      type: 'Vault' as BerachainProtocolType,
    },
    chain: 137,
    tokens: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'],
    tvl: '$31.00',
    apys: {
      total: 4.78,
      tokens: [
        {
          tokenAddress: ['0xaddress'],
          value: 2,
        },
        {
          tokenAddress: ['0xaddress'],
          value: 2.78,
        },
      ],
    },
  },
  {
    protocol: {
      name: 'Infrared Recipe Market',
      image: undefined,
      type: 'Money Market' as BerachainProtocolType,
    },
    chain: 1,
    tokens: ['0x6B175474E89094C44Da98b954EedeAC495271d0F'],
    tvl: '$21.00',
    apys: {
      total: 0.0,
      tokens: [
        {
          tokenAddress: ['0xaddress'],
          value: 2,
        },
        {
          tokenAddress: ['0xaddress'],
          value: 2.78,
        },
      ],
    },
  },
  {
    protocol: {
      name: 'Kodiak Vault Market-New',
      image: undefined,
      type: 'DEX' as BerachainProtocolType,
    },
    chain: 1,
    tokens: ['0xdAC17F958D2ee523a2206206994597C13D831ec7'],
    tvl: '$2.00',
    apys: {
      total: '320.30K%',
      tokens: [
        {
          tokenAddress: ['0xaddress'],
          value: 2,
        },
        {
          tokenAddress: ['0xaddress'],
          value: 2.78,
        },
      ],
    },
  },
  {
    protocol: {
      name: 'Recipe - Shogun',
      image: undefined,
      type: 'Staking' as BerachainProtocolType,
    },
    chain: 1,
    tokens: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'],
    tvl: '$2.00',
    apys: {
      total: '320.30K%',
      tokens: [
        {
          tokenAddress: ['0xaddress'],
          value: 2,
        },
        {
          tokenAddress: ['0xaddress'],
          value: 2.78,
        },
      ],
    },
  },
  {
    protocol: {
      name: 'BeraBucks Vault',
      image: undefined,
      type: 'Vault' as BerachainProtocolType,
    },
    chain: 1,
    tokens: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'],
    tvl: '$11.00',
    apys: {
      total: '147.38%',
      tokens: [
        {
          tokenAddress: ['0xaddress'],
          value: 2,
        },
        {
          tokenAddress: ['0xaddress'],
          value: 2.78,
        },
      ],
    },
  },
];

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
