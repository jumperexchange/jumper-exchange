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
  blogArticlesLevelOptions,
  blogArticlesTagOptions,
  blogArticlesSortOptions,
  blogArticlesDateRange,
} from '../MultiLayer/fixtures';
import {
  createDateRangeCategory,
  createMultiSelectCategory,
  createSingleSelectCategory,
  createSliderCategory,
} from '../MultiLayer/utils';

import {
  SortByEnum as EarnSortByEnum,
  SortByOptions as EarnSortByOptions,
} from 'src/app/ui/earn/types';
import {
  SortByEnum as LearnSortByEnum,
  SortByOptions as LearnSortByOptions,
} from 'src/providers/LearnProvider/filtering/types';
import { useState } from 'react';
import { formatSliderValue } from '@/components/core/form/Select/utils';
import { CategoryConfig, DateRangeValue } from '../MultiLayer/MultiLayer.types';

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

interface EarnFilterState {
  chains: string[];
  protocols: string[];
  tags: string[];
  apy: number[];
  assets: string[];
  sortBy: EarnSortByEnum;
}

// Story 1: Earn Filters (with pending filters pattern)
const EarnFiltersTemplate = () => {
  const [appliedFilters, setAppliedFilters] = useState<EarnFilterState>({
    chains: [],
    protocols: [],
    tags: [],
    apy: [0, 100],
    assets: [],
    sortBy: EarnSortByOptions.APY,
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
        sortBy: EarnSortByOptions.APY,
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
    createSingleSelectCategory<EarnSortByEnum>({
      id: 'sortBy',
      label: 'Sort By',
      value: pendingValues.sortBy,
      onChange: (value) => setPendingValue('sortBy', value),
      options: sortOptions,
      testId: 'sort-filter',
    }),
  ];

  return (
    <Stack
      sx={{
        gap: 2,
        width: 544,
        padding: 3,
      }}
    >
      <FilterSortModal
        categories={categories}
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

interface BlogArticlesFilterState {
  tags: string[];
  levels: string[];
  dates: DateRangeValue;
  sortBy: LearnSortByEnum;
}

const getDatesBadge = (
  usedMin: Date | null,
  usedMax: Date | null,
  rangeMin: Date,
  rangeMax: Date,
  pendingValue: DateRangeValue,
): string | undefined => {
  if (usedMin === rangeMin && usedMax === rangeMax) return;

  const [start, end] = pendingValue;

  if (!start && !end) return;

  return `1 range`;
};

const BlogArticlesFiltersTemplate = () => {
  const [appliedFilters, setAppliedFilters] = useState<BlogArticlesFilterState>(
    {
      tags: [],
      levels: [],
      dates: [blogArticlesDateRange.min, blogArticlesDateRange.max],
      sortBy: LearnSortByOptions.DATE,
    },
  );

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
        tags: [],
        levels: [],
        dates: [blogArticlesDateRange.min, blogArticlesDateRange.max],
        sortBy: LearnSortByOptions.DATE,
      });
      console.log('Cleared all filters');
    },
    isFilterApplied: (values) => {
      return (
        values.tags.length > 0 ||
        values.levels.length > 0 ||
        values.dates[0] !== blogArticlesDateRange.min ||
        values.dates[1] !== blogArticlesDateRange.max
      );
    },
  });

  const appliedFiltersCount =
    appliedFilters.tags.length +
    appliedFilters.levels.length +
    (appliedFilters.dates[0] !== blogArticlesDateRange.min ||
    appliedFilters.dates[1] !== blogArticlesDateRange.max
      ? 1
      : 0);

  const tagBadge =
    pendingValues.tags.length > 0
      ? pendingValues.tags.length.toString()
      : undefined;
  const levelBadge =
    pendingValues.levels.length > 0
      ? pendingValues.levels.length.toString()
      : undefined;
  const datesBadge = getDatesBadge(
    appliedFilters.dates[0],
    appliedFilters.dates[1],
    blogArticlesDateRange.min,
    blogArticlesDateRange.max,
    pendingValues.dates,
  );

  const categories: CategoryConfig[] = [
    createMultiSelectCategory<string>({
      id: 'tag',
      label: 'Tag',
      badgeLabel: tagBadge,
      value: pendingValues.tags,
      onChange: (value) => setPendingValue('tags', value),
      options: blogArticlesTagOptions,
      searchable: true,
      searchPlaceholder: 'Search tags...',
      testId: 'tags-filter',
    }),
    createMultiSelectCategory<string>({
      id: 'level',
      label: 'Level',
      badgeLabel: levelBadge,
      value: pendingValues.levels,
      onChange: (value) => setPendingValue('levels', value),
      options: blogArticlesLevelOptions,
      searchable: true,
      searchPlaceholder: 'Search level...',
      testId: 'level-filter',
    }),
    createDateRangeCategory({
      id: 'publish-date',
      label: 'Publish date',
      badgeLabel: datesBadge,
      value: pendingValues.dates,
      onChange: (value) => setPendingValue('dates', value),
      min: blogArticlesDateRange.min,
      max: blogArticlesDateRange.max,
      testId: 'publish-date-filter',
    }),
    createSingleSelectCategory<LearnSortByEnum>({
      id: 'sortBy',
      label: 'Sort By',
      value: pendingValues.sortBy,
      onChange: (value) => setPendingValue('sortBy', value),
      options: blogArticlesSortOptions,
      testId: 'sort-filter',
    }),
  ];

  return (
    <Stack
      sx={{
        gap: 2,
        width: 544,
        padding: 3,
      }}
    >
      <FilterSortModal
        categories={categories}
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

export const BlogArticlesFilters: Story = {
  render: () => <BlogArticlesFiltersTemplate />,
};
