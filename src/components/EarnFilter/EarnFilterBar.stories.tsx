import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { EarnFilteringContext } from '../../app/ui/earn/EarnFilteringContext';
import { EarnCardVariant } from '../Cards/EarnCard/EarnCard.types';
import { EarnFilterBar } from './EarnFilterBar';

const meta = {
  component: EarnFilterBar,
  title: 'Earn/FilterBar',
  decorators: [
    (Story) => {
      const [variant, setVariant] = useState<EarnCardVariant>('compact');
      return (
        <EarnFilteringContext.Provider value={mockContextValue()}>
          <Story args={{ variant, setVariant }} />
        </EarnFilteringContext.Provider>
      );
    },
  ],
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['compact', 'list-item', 'top'],
    },
  },
} satisfies Meta<typeof EarnFilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockContextValue = () => {
  const [showForYou, setShowForYou] = useState(false);

  return {
    filter: {},
    updateFilter: () => {},
    showForYou,
    toggleForYou: () => setShowForYou((current) => !current),
    usedYourAddress: false,
    forYou: [],
    forYouLoading: false,
    forYouError: null,
    all: [],
    allLoading: false,
    allError: null,
    totalMarkets: 150,
    allChains: [
      { chainId: 1, chainKey: 'ethereum', name: 'Ethereum' },
      { chainId: 137, chainKey: 'polygon', name: 'Polygon' },
      { chainId: 8453, chainKey: 'base', name: 'Base' },
      { chainId: 42161, chainKey: 'arbitrum', name: 'Arbitrum' },
      { chainId: 10, chainKey: 'optimism', name: 'Optimism' },
    ],
    allProtocols: [
      {
        name: 'Morpho',
        product: 'metamorpho',
        version: '',
        logo: 'https://strapi.jumper.exchange/uploads/morpho.png',
      },
      {
        name: 'Aave',
        product: 'aave-v3',
        version: 'v3',
        logo: 'https://strapi.jumper.exchange/uploads/aave.png',
      },
      {
        name: 'Compound',
        product: 'compound-v3',
        version: 'v3',
        logo: 'https://strapi.jumper.exchange/uploads/compound.png',
      },
      {
        name: 'Uniswap',
        product: 'uniswap-v3',
        version: 'v3',
        logo: 'https://strapi.jumper.exchange/uploads/uniswap.png',
      },
    ],
    allAssets: [
      {
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
        chain: { chainId: 8453, chainKey: 'base' },
      },
      {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
        address: '0x0000000000000000000000000000000000000000',
        logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
        chain: { chainId: 1, chainKey: 'ethereum' },
      },
      {
        name: 'Wrapped Bitcoin',
        symbol: 'WBTC',
        decimals: 8,
        address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
        logo: 'https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png',
        chain: { chainId: 1, chainKey: 'ethereum' },
      },
      {
        name: 'Dai Stablecoin',
        symbol: 'DAI',
        decimals: 18,
        address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        logo: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
        chain: { chainId: 1, chainKey: 'ethereum' },
      },
    ],
    allTags: ['Staking', 'Earn', 'Yield', 'Lending', 'LP', 'Vault', 'DeFi'],
    allAPY: {
      0.01: 5,
      0.02: 12,
      0.03: 18,
      0.05: 25,
      0.08: 15,
      0.1: 10,
      0.15: 8,
      0.2: 5,
      0.3: 2,
    },
  };
};

export const Default: Story = {
  args: {
    variant: 'compact',
    setVariant: () => {},
  },
};

export const ListView: Story = {
  args: {
    variant: 'list-item',
    setVariant: () => {},
  },
};

export const EmptyState: Story = {
  args: {
    variant: 'compact',
    setVariant: () => {},
  },
  decorators: [
    (Story) => {
      const [variant, setVariant] = useState<EarnCardVariant>('compact');
      return (
        <EarnFilteringContext.Provider
          value={{
            ...mockContextValue(),
            allChains: [],
            allProtocols: [],
            allAssets: [],
            allTags: [],
            allAPY: {},
            totalMarkets: 0,
          }}
        >
          <Story args={{ variant, setVariant }} />
        </EarnFilteringContext.Provider>
      );
    },
  ],
};

export const LoadingState: Story = {
  args: {
    variant: 'compact',
    setVariant: () => {},
  },
  decorators: [
    (Story) => {
      const [variant, setVariant] = useState<EarnCardVariant>('compact');
      return (
        <EarnFilteringContext.Provider
          value={{
            ...mockContextValue(),
            allLoading: true,
            forYouLoading: true,
          }}
        >
          <Story args={{ variant, setVariant }} />
        </EarnFilteringContext.Provider>
      );
    },
  ],
};

export const MinimalData: Story = {
  args: {
    variant: 'list-item',
    setVariant: () => {},
  },
  decorators: [
    (Story) => {
      const [variant, setVariant] = useState<EarnCardVariant>('list-item');
      return (
        <EarnFilteringContext.Provider
          value={{
            ...mockContextValue(),
            allChains: [{ chainId: 1, chainKey: 'ethereum' }],
            allProtocols: [
              { name: 'Aave', product: 'aave-v3', version: 'v3', logo: '' },
            ],
            allAssets: [
              {
                name: 'USD Coin',
                symbol: 'USDC',
                decimals: 6,
                address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
                logo: '',
                chain: { chainId: 1, chainKey: 'ethereum' },
              },
            ],
            allTags: ['Staking'],
            allAPY: { 0.05: 10 },
            totalMarkets: 1,
          }}
        >
          <Story args={{ variant, setVariant }} />
        </EarnFilteringContext.Provider>
      );
    },
  ],
};

export const WithActiveFilters: Story = {
  args: {
    variant: 'compact',
    setVariant: () => {},
  },
  decorators: [
    (Story) => {
      const [variant, setVariant] = useState<EarnCardVariant>('compact');
      return (
        <EarnFilteringContext.Provider
          value={{
            ...mockContextValue(),
            filter: {
              chains: [1, 137],
              protocols: ['Aave', 'Compound'],
              assets: ['USDC', 'ETH'],
              tags: ['Staking', 'Earn'],
              minAPY: 0.05,
              maxAPY: 0.15,
            },
            showForYou: true,
          }}
        >
          <Story args={{ variant, setVariant }} />
        </EarnFilteringContext.Provider>
      );
    },
  ],
};

export const LargeDataSet: Story = {
  args: {
    variant: 'compact',
    setVariant: () => {},
  },
  decorators: [
    (Story) => {
      const [variant, setVariant] = useState<EarnCardVariant>('compact');
      const largeChains = Array.from({ length: 20 }, (_, i) => ({
        chainId: i + 1,
        chainKey: `chain-${i + 1}`,
        name: `Chain ${i + 1}`,
      }));

      const largeProtocols = Array.from({ length: 15 }, (_, i) => ({
        name: `Protocol ${i + 1}`,
        product: `protocol-${i + 1}`,
        version: `v${i + 1}`,
        logo: '',
      }));

      const largeTags = Array.from({ length: 30 }, (_, i) => `Tag${i + 1}`);

      return (
        <EarnFilteringContext.Provider
          value={{
            ...mockContextValue(),
            allChains: largeChains,
            allProtocols: largeProtocols,
            allTags: largeTags,
            totalMarkets: 500,
          }}
        >
          <Story args={{ variant, setVariant }} />
        </EarnFilteringContext.Provider>
      );
    },
  ],
};
