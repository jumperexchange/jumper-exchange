import { GenericFilterDrawer } from 'src/components/composite/GenericFilterDrawer/GenericFilterDrawer';
import { FC, PropsWithChildren } from 'react';
import { useEarnFilterBar } from '../hooks';
import { FilterCategoryConfig } from 'src/components/composite/GenericFilterDrawer/GenericFilterDrawer.types';
import { SelectVariant } from 'src/components/core/form/Select/Select.types';

export const EarnFilterBarContentAllMobile: FC<PropsWithChildren> = ({
  children,
}) => {
  const {
    chainOptions,
    protocolOptions,
    tagOptions,
    assetOptions,
    hasFilterApplied,
    filter,
    apyMinValue,
    apyMaxValue,
    apyMin,
    apyMax,
    sortByOptions,
    filtersCount,
    handleChainChange,
    handleProtocolChange,
    handleTagChange,
    handleAssetChange,
    handleAPYChange,
    handleClearAllFilters,
    handleSortBy,
  } = useEarnFilterBar();

  // Define filter categories
  const categories: FilterCategoryConfig[] = [
    {
      id: 'chains',
      label: 'Chains',
      selectType: SelectVariant.Multi,
      testId: 'earn-filter-chain-select-mobile',
    },
    {
      id: 'protocols',
      label: 'Protocols',
      selectType: SelectVariant.Multi,
      testId: 'earn-filter-protocol-select-mobile',
    },
    {
      id: 'tags',
      label: 'Tags',
      selectType: SelectVariant.Multi,
      testId: 'earn-filter-tag-select-mobile',
    },
    {
      id: 'assets',
      label: 'Assets',
      selectType: SelectVariant.Multi,
      testId: 'earn-filter-asset-select-mobile',
    },
    {
      id: 'apy',
      label: 'APY',
      selectType: SelectVariant.Slider,
      testId: 'earn-filter-apy-select-mobile',
    },
    {
      id: 'sortBy',
      label: 'Sort',
      selectType: SelectVariant.Single,
      testId: 'earn-filter-sort-select-mobile',
    },
  ];

  // Aggregate filter values
  const filterValues = {
    chains: filter?.chains?.map(String) ?? [],
    protocols: filter?.protocols || [],
    tags: filter?.tags || [],
    assets: filter?.assets || [],
    apy: [apyMinValue, apyMaxValue],
    sortBy: '',
  };

  // Aggregate filter options
  const filterOptions = {
    chains: chainOptions,
    protocols: protocolOptions,
    tags: tagOptions,
    assets: assetOptions,
    apy: [],
    sortBy: sortByOptions,
  };

  // Aggregate filter handlers
  const handleFilterChange = (key: string, value: any) => {
    switch (key) {
      case 'chains':
        handleChainChange(value);
        break;
      case 'protocols':
        handleProtocolChange(value);
        break;
      case 'tags':
        handleTagChange(value);
        break;
      case 'assets':
        handleAssetChange(value);
        break;
      case 'apy':
        handleAPYChange(value);
        break;
      case 'sortBy':
        handleSortBy(value);
        break;
    }
  };

  const sliderRanges = {
    apy: { min: apyMin, max: apyMax },
  };

  return (
    <GenericFilterDrawer
      categories={categories}
      filterValues={filterValues}
      filterOptions={filterOptions}
      onFilterChange={handleFilterChange}
      onClearAll={handleClearAllFilters}
      sliderRanges={sliderRanges}
      hasFilterApplied={hasFilterApplied}
      filtersCount={filtersCount}
      drawerTitle="Filter and sort"
    >
      {children}
    </GenericFilterDrawer>
  );
};
