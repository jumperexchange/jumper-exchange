// First, define the BerachainProtocolType if it's not already defined
type BerachainProtocolType =
  | 'Recipe'
  | 'Vault'
  | 'Money Market'
  | 'DEX'
  | 'Staking';

export interface BerachainProtocolSocials {
  twitter: string;
  telegram: string;
  website?: string;
}
// Define interfaces for the nested structures
export interface BerachainProtocol {
  name: string;
  image: undefined;
  type: BerachainProtocolType;
  slug: string;
  description: string;
  socials?: BerachainProtocolSocials;
}

export interface BerachainApyToken {
  tokenAddress: string[];
  value: number;
}

export interface BerachainApys {
  total: number | string;
  tokens: BerachainApyToken[];
}

// Define the main interface for each market
export interface BerachainMarketType {
  protocol: BerachainProtocol;
  chain: number;
  tokens: string[];
  tvl: string;
  apys: BerachainApys;
}

export const berachainMarkets: BerachainMarketType[] = [
  {
    protocol: {
      name: 'BT Recipe Market',
      image: undefined,
      type: 'Recipe',
      slug: 'bt-recipe-market',
      socials: {
        twitter: 'https://twitter.com/berachain',
        telegram: 'https://t.me/berachain',
        website: 'https://berachain.com/',
      },
      description:
        'USDz is a multichain digital dollar backed by a diversified portfolio of private credit assets. A rigorously underwritten RWA portfolio insulates the protocol from crypto volatility and  enables sustainable, consistent ecosystem rewards for the adoption of USDz across the DeFi landscape.',
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
          tokenAddress: [
            '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          ],
          value: 2,
        },
        {
          tokenAddress: [
            '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          ],
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
      slug: 'gummi-vault-market',
      description:
        'USDz is a multichain digital dollar backed by a diversified portfolio of private credit assets. A rigorously underwritten RWA portfolio insulates the protocol from crypto volatility and  enables sustainable, consistent ecosystem rewards for the adoption of USDz across the DeFi landscape.',
      socials: {
        twitter: 'https://twitter.com/berachain',
        telegram: 'https://t.me/berachain',
        website: 'https://berachain.com/',
      },
    },
    chain: 137,
    tokens: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'],
    tvl: '$31.00',
    apys: {
      total: 4.78,
      tokens: [
        {
          tokenAddress: [
            '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          ],
          value: 2,
        },
        {
          tokenAddress: [
            '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          ],
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
      slug: 'infrared-recipe-market',
      description:
        'USDz is a multichain digital dollar backed by a diversified portfolio of private credit assets. A rigorously underwritten RWA portfolio insulates the protocol from crypto volatility and  enables sustainable, consistent ecosystem rewards for the adoption of USDz across the DeFi landscape.',
      socials: {
        twitter: 'https://twitter.com/berachain',
        telegram: 'https://t.me/berachain',
        website: 'https://berachain.com/',
      },
    },
    chain: 1,
    tokens: ['0x6B175474E89094C44Da98b954EedeAC495271d0F'],
    tvl: '$21.00',
    apys: {
      total: 0.0,
      tokens: [
        {
          tokenAddress: [
            '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          ],
          value: 2,
        },
        {
          tokenAddress: [
            '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          ],
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
      slug: 'kodiak-vault-market-new',
      description:
        'USDz is a multichain digital dollar backed by a diversified portfolio of private credit assets. A rigorously underwritten RWA portfolio insulates the protocol from crypto volatility and  enables sustainable, consistent ecosystem rewards for the adoption of USDz across the DeFi landscape.',
      socials: {
        twitter: 'https://twitter.com/berachain',
        telegram: 'https://t.me/berachain',
        website: 'https://berachain.com/',
      },
    },
    chain: 1,
    tokens: ['0xdAC17F958D2ee523a2206206994597C13D831ec7'],
    tvl: '$2.00',
    apys: {
      total: '320.30K%',
      tokens: [
        {
          tokenAddress: [
            '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          ],
          value: 2,
        },
        {
          tokenAddress: [
            '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          ],
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
      slug: 'recipe-shogun',
      description:
        'USDz is a multichain digital dollar backed by a diversified portfolio of private credit assets. A rigorously underwritten RWA portfolio insulates the protocol from crypto volatility and  enables sustainable, consistent ecosystem rewards for the adoption of USDz across the DeFi landscape.',
      socials: {
        twitter: 'https://twitter.com/berachain',
        telegram: 'https://t.me/berachain',
        website: 'https://berachain.com/',
      },
    },
    chain: 1,
    tokens: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'],
    tvl: '$2.00',
    apys: {
      total: '320.30K%',
      tokens: [
        {
          tokenAddress: [
            '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          ],
          value: 2,
        },
        {
          tokenAddress: [
            '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          ],
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
      slug: 'berabucks-vault',
      description:
        'USDz is a multichain digital dollar backed by a diversified portfolio of private credit assets. A rigorously underwritten RWA portfolio insulates the protocol from crypto volatility and  enables sustainable, consistent ecosystem rewards for the adoption of USDz across the DeFi landscape.',
      socials: {
        twitter: 'https://twitter.com/berachain',
        telegram: 'https://t.me/berachain',
        website: 'https://berachain.com/',
      },
    },
    chain: 1,
    tokens: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'],
    tvl: '$11.00',
    apys: {
      total: '147.38%',
      tokens: [
        {
          tokenAddress: [
            '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          ],
          value: 2,
        },
        {
          tokenAddress: [
            '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          ],
          value: 2.78,
        },
      ],
    },
  },
];
