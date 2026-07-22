import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { JUMPER_STRAPI_URL } from '@/const/urls';
import type { EarnFilteringContextType } from '@/app/ui/earn/EarnFilteringContext';
import { EarnFilteringContext } from '@/app/ui/earn/EarnFilteringContext';
import type { EarnOpportunityFilterWithoutSortByAndOrder } from '@/app/ui/earn/types';
import { EarnFilterTab, SortByOptions } from '@/app/ui/earn/types';
import type { Protocol } from '@/types/jumper-backend';
import { EarnSearchAutocomplete } from './EarnSearchAutocomplete';

const mockContextValue = (
  filter: EarnOpportunityFilterWithoutSortByAndOrder = {},
): EarnFilteringContextType => ({
  sortBy: SortByOptions.APY,
  setSortBy: () => {},
  filter,
  updateFilter: () => {},
  clearFilters: () => {},
  tab: EarnFilterTab.ALL,
  changeTab: () => {},
  usedYourAddress: false,
  data: [],
  updatedAt: undefined,
  isLoading: false,
  error: null,
  isAllDataLoading: false,
  isConnected: true,
  totalMarkets: 150,
  page: 0,
  setPage: () => {},
  pagination: { page: 0, pageSize: 18, pageCount: 9, total: 150 },
  allChains: [
    { chainId: 1, chainKey: 'ethereum' },
    { chainId: 8453, chainKey: 'base' },
    { chainId: 42161, chainKey: 'arbitrum' },
  ],
  allProtocols: [
    {
      name: 'Morpho',
      product: 'metamorpho',
      version: '',
      logo: `${JUMPER_STRAPI_URL}/uploads/morpho.png`,
    },
    {
      name: 'Aave',
      product: 'aave-v3',
      version: 'v3',
      logo: `${JUMPER_STRAPI_URL}/uploads/aave.png`,
    },
    {
      name: 'Spark',
      product: '',
      version: '',
      logo: `${JUMPER_STRAPI_URL}/uploads/spark.png`,
    },
  ] as Protocol[],
  allAssets: [],
  allTags: [],
  allPools: [
    { slug: 'steakhouse-usdc', name: 'Steakhouse USDC' },
    { slug: 'spark-susds', name: 'Spark sUSDS' },
    { slug: 'aave-v3-eth', name: 'Aave v3 ETH' },
  ],
  availablePools: [
    { slug: 'steakhouse-usdc', name: 'Steakhouse USDC' },
    { slug: 'spark-susds', name: 'Spark sUSDS' },
    { slug: 'aave-v3-eth', name: 'Aave v3 ETH' },
  ],
  allAPY: {},
  allTVL: {},
  allRewardsOptions: [],
});

const meta = {
  component: EarnSearchAutocomplete,
  title: 'Earn/SearchAutocomplete',
  decorators: [
    (Story) => (
      <EarnFilteringContext.Provider value={mockContextValue()}>
        <Story />
      </EarnFilteringContext.Provider>
    ),
  ],
} satisfies Meta<typeof EarnSearchAutocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithSelectedChainAndProtocol: Story = {
  decorators: [
    (Story) => (
      <EarnFilteringContext.Provider
        value={mockContextValue({ chains: [8453], protocols: ['Morpho'] })}
      >
        <Story />
      </EarnFilteringContext.Provider>
    ),
  ],
};

export const WithSelectedPool: Story = {
  decorators: [
    (Story) => (
      <EarnFilteringContext.Provider
        value={mockContextValue({ pools: ['steakhouse-usdc'] })}
      >
        <Story />
      </EarnFilteringContext.Provider>
    ),
  ],
};

// The autocomplete never seeds its input box from `searchText`, so a
// pre-existing `search` filter (e.g. loaded from the URL) renders directly
// as a committed, removable "Search" chip.
export const WithSearchChip: Story = {
  decorators: [
    (Story) => (
      <EarnFilteringContext.Provider
        value={mockContextValue({ search: 'steak' })}
      >
        <Story />
      </EarnFilteringContext.Provider>
    ),
  ],
};
