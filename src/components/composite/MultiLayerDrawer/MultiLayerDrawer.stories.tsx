import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MultiLayerDrawer } from './MultiLayerDrawer';
import { CategoryConfig, CategoryContentType } from './MultiLayerDrawer.types';
import { useState } from 'react';
import Stack from '@mui/material/Stack';
import { formatSliderValue } from 'src/components/core/form/Select/utils';
import { usePendingFilters } from './hooks';
import {
  chainOptions,
  protocolOptions,
  tagOptions,
  sortOptions,
  assetOptions,
} from './fixtures';
import {
  createMultiSelectCategory,
  createSingleSelectCategory,
  createSliderCategory,
} from './utils';
import { SortByEnum, SortByOptions } from 'src/app/ui/earn/types';

const meta: Meta<typeof MultiLayerDrawer> = {
  title: 'Composite/MultiLayerDrawer',
  component: MultiLayerDrawer,
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MultiLayerDrawer>;

interface FilterState {
  chains: string[];
  protocols: string[];
  tags: string[];
  apy: number[];
  assets: string[];
  sortBy: SortByEnum;
}

// Story 1: Earn Filters (with pending filters pattern)
const EarnFiltersTemplate = () => {
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    chains: [],
    protocols: [],
    tags: [],
    apy: [0, 100],
    assets: [],
    sortBy: SortByOptions.APY,
  });

  const {
    pendingValues,
    setPendingValue,
    applyFilters,
    clearAll,
    hasPendingFiltersApplied,
  } = usePendingFilters({
    initialValues: appliedFilters,
    onApply: (values) => {
      setAppliedFilters(values);
      console.log('Applied filters:', values);
    },
    onClear: () => {
      setAppliedFilters({
        chains: [],
        protocols: [],
        tags: [],
        apy: [0, 100],
        assets: [],
        sortBy: SortByOptions.APY,
      });
      console.log('Cleared all filters');
    },
    isFilterApplied: (values) => {
      return (
        values.chains.length > 0 ||
        values.protocols.length > 0 ||
        values.tags.length > 0 ||
        values.assets.length > 0 ||
        values.apy[0] !== 0 ||
        values.apy[1] !== 100
      );
    },
  });

  const appliedFiltersCount =
    appliedFilters.chains.length +
    appliedFilters.protocols.length +
    appliedFilters.tags.length +
    appliedFilters.assets.length +
    (appliedFilters.apy[0] !== 0 || appliedFilters.apy[1] !== 100 ? 1 : 0);

  const chainBadge =
    pendingValues.chains.length > 0
      ? pendingValues.chains.length.toString()
      : undefined;
  const protocolBadge =
    pendingValues.protocols.length > 0
      ? pendingValues.protocols.length.toString()
      : undefined;
  const tagBadge =
    pendingValues.tags.length > 0
      ? pendingValues.tags.length.toString()
      : undefined;
  const assetBadge =
    pendingValues.assets.length > 0
      ? pendingValues.assets.length.toString()
      : undefined;
  const apyBadge =
    pendingValues.apy[0] !== 0 || pendingValues.apy[1] !== 100
      ? formatSliderValue(pendingValues.apy)
      : undefined;

  const categories: CategoryConfig[] = [
    createMultiSelectCategory<string>({
      id: 'chain',
      label: 'Chain',
      badgeLabel: chainBadge,
      value: pendingValues.chains,
      onChange: (value) => setPendingValue('chains', value),
      options: chainOptions,
      searchable: true,
      searchPlaceholder: 'Search chains...',
      testId: 'chain-filter',
    }),
    createMultiSelectCategory<string>({
      id: 'protocol',
      label: 'Protocol',
      badgeLabel: protocolBadge,
      value: pendingValues.protocols,
      onChange: (value) => setPendingValue('protocols', value),
      options: protocolOptions,
      searchable: true,
      searchPlaceholder: 'Search protocols...',
      testId: 'protocol-filter',
    }),
    createMultiSelectCategory<string>({
      id: 'tag',
      label: 'Tag',
      badgeLabel: tagBadge,
      value: pendingValues.tags,
      onChange: (value) => setPendingValue('tags', value),
      options: tagOptions,
      testId: 'tag-filter',
    }),
    createMultiSelectCategory<string>({
      id: 'asset',
      label: 'Asset',
      badgeLabel: assetBadge,
      value: pendingValues.assets,
      onChange: (value) => setPendingValue('assets', value),
      options: assetOptions,
      testId: 'asset-filter',
    }),
    createSliderCategory({
      id: 'apy',
      label: 'APY Range',
      badgeLabel: apyBadge,
      value: pendingValues.apy,
      onChange: (value) => setPendingValue('apy', value),
      min: 0,
      max: 100,
      testId: 'apy-filter',
    }),
    createSingleSelectCategory<SortByEnum>({
      id: 'sortBy',
      label: 'Sort By',
      value: pendingValues.sortBy,
      onChange: (value) => setPendingValue('sortBy', value),
      options: sortOptions,
      testId: 'sort-filter',
    }),
  ];

  return (
    <Stack gap={2} sx={{ width: 400, padding: 3 }}>
      <MultiLayerDrawer
        categories={categories}
        title="Filter & Sort"
        applyButtonLabel="Apply Filters"
        clearButtonLabel="Clear All"
        onApply={applyFilters}
        onClear={clearAll}
        disableApply={!hasPendingFiltersApplied}
        disableClear={!hasPendingFiltersApplied}
        testId="earn-filters-drawer"
        appliedFiltersCount={appliedFiltersCount}
      />
    </Stack>
  );
};

export const EarnFilters: Story = {
  render: () => <EarnFiltersTemplate />,
};

// Story 2: Nested Filters with 2 Layers
const NestedFiltersTemplate = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<string>('ethereum');
  const [selectedChains, setSelectedChains] = useState<string[]>([]);

  const categories: CategoryConfig[] = [
    {
      id: 'networks',
      label: 'Networks',
      badgeLabel:
        selectedChains.length > 0
          ? selectedChains.length.toString()
          : undefined,
      subcategories: [
        createSingleSelectCategory<string>({
          id: 'ethereum',
          label: 'Ethereum Ecosystem',
          value: selectedNetwork,
          onChange: setSelectedNetwork,
          options: [
            { value: 'ethereum', label: 'Ethereum Mainnet' },
            { value: 'goerli', label: 'Goerli Testnet' },
            { value: 'sepolia', label: 'Sepolia Testnet' },
          ],
          testId: 'ethereum-select',
        }),
        createMultiSelectCategory<string>({
          id: 'layer2',
          label: 'Layer 2',
          value: selectedChains,
          onChange: setSelectedChains,
          options: [
            { value: '42161', label: 'Arbitrum' },
            { value: '10', label: 'Optimism' },
            { value: '8453', label: 'Base' },
          ],
          searchable: true,
          testId: 'layer2-multiselect',
        }),
      ],
    },
  ];

  const handleClear = () => {
    setSelectedNetwork('ethereum');
    setSelectedChains([]);
  };

  const handleApply = () => {
    console.log('Applied filters:', {
      network: selectedNetwork,
      chains: selectedChains,
    });
  };

  return (
    <Stack gap={2} sx={{ width: 400, padding: 3 }}>
      <MultiLayerDrawer
        categories={categories}
        title="Network Filters"
        applyButtonLabel="Apply"
        clearButtonLabel="Reset"
        onApply={handleApply}
        onClear={handleClear}
        testId="nested-filters-drawer"
      />
    </Stack>
  );
};

export const NestedFilters: Story = {
  render: () => <NestedFiltersTemplate />,
};

// Story 3: Main Menu Navigation (based on actual Jumper menu)
const MainMenuTemplate = () => {
  const [selectedTheme, setSelectedTheme] = useState<string>('auto');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

  const categories: CategoryConfig[] = [
    {
      id: 'learn',
      label: 'Learn',
      href: '/learn',
      testId: 'learn-menu',
    },
    {
      id: 'scan',
      label: 'Scan',
      href: '/scan',
      testId: 'scan-menu',
    },
    {
      id: 'support',
      label: 'Support',
      onClick: () => console.log('Support clicked'),
      testId: 'support-menu',
    },
    createSingleSelectCategory<string>({
      id: 'theme',
      label: 'Theme',
      value: selectedTheme,
      onChange: setSelectedTheme,
      options: [
        { value: 'light', label: 'Light Mode' },
        { value: 'dark', label: 'Dark Mode' },
        { value: 'auto', label: 'Auto (System)' },
      ],
      testId: 'theme-select',
    }),
    createSingleSelectCategory<string>({
      id: 'language',
      label: 'Language',
      value: selectedLanguage,
      onChange: setSelectedLanguage,
      options: [
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Español' },
        { value: 'fr', label: 'Français' },
        { value: 'de', label: 'Deutsch' },
        { value: 'zh', label: '中文' },
        { value: 'ja', label: '日本語' },
        { value: 'ko', label: '한국어' },
        { value: 'pt', label: 'Português' },
      ],
      searchable: true,
      searchPlaceholder: 'Search languages...',
      testId: 'language-select',
    }),
    {
      id: 'resources',
      label: 'Resources',
      subcategories: [
        {
          id: 'docs',
          label: 'Documentation',
          href: '/docs',
          testId: 'docs-menu',
        },
        {
          id: 'github',
          label: 'GitHub',
          href: 'https://github.com/jumper-exchange',
          testId: 'github-menu',
        },
      ],
    },
  ];

  return (
    <Stack gap={2} sx={{ width: 400, padding: 3 }}>
      <MultiLayerDrawer
        categories={categories}
        title="Main Menu"
        showFooter={false}
        testId="main-menu-drawer"
      />
    </Stack>
  );
};

export const MainMenu: Story = {
  render: () => <MainMenuTemplate />,
};
