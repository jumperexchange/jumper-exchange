import type { ProtocolInfo } from 'src/types/questDetails';

export const berachainMarkets: ProtocolInfo[] = [
  {
    slug: 'dolomite-vault-market-dai',
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
    slug: 'gummi-vault-market-usdt',
    chain: 137,
    tokens: ['0xc2132D05D31c914a87C6611C10748AEb04B58e8F'],
    tvl: '$31.00',
    apys: {
      total: 4.78,
      tokens: [
        {
          tokenAddress: [
            '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
            '0xA3c322Ad15218fBFAEd26bA7f616249f7705D945',
          ],
          value: 2,
        },
        {
          tokenAddress: [
            '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
            '0xA3c322Ad15218fBFAEd26bA7f616249f7705D945',
          ],
          value: 2.78,
        },
      ],
    },
  },
  {
    slug: 'infrared-vault-market-dai',
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
    slug: 'kodiak-vault-market-usdt-usdc',
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
    slug: 'zerolend-vault-market-usdc',
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
];
