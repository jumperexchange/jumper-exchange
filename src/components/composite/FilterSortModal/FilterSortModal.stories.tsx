import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Stack from '@mui/material/Stack';

import { FilterSortModal } from './FilterSortModal';
import { usePendingFilters } from '../MultiLayer/hooks';
import {
  chainOptions,
  protocolOptions,
  tagOptions,
  sortOptions,
  assetOptions,
} from '../MultiLayer/fixtures';
import {
  createMultiSelectCategory,
  createSingleSelectCategory,
  createSliderCategory,
} from '../MultiLayer/utils';

import { SortByEnum, SortByOptions } from 'src/app/ui/earn/types';
import { useState } from 'react';
import { formatSliderValue } from '@/components/core/form/Select/utils';
import { CategoryConfig } from '../MultiLayer/MultiLayer.types';

const meta: Meta<typeof FilterSortModal> = {
  title: 'components/composite/FilterSortModal',
  component: FilterSortModal,
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
type Story = StoryObj<typeof FilterSortModal>;

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
    <Stack gap={2} sx={{ width: 544, padding: 3 }}>
      <FilterSortModal
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
