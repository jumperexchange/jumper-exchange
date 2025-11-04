import { GenericFilterDrawer } from 'src/components/composite/GenericFilterDrawer/GenericFilterDrawer';
import { FC, PropsWithChildren } from 'react';
import { useEarnFilterBar } from '../hooks';
import { FilterCategoryConfig } from 'src/components/composite/GenericFilterDrawer/GenericFilterDrawer.types';
import { SelectVariant } from 'src/components/core/form/Select/Select.types';
import { useTranslation } from 'react-i18next';

export const EarnFilterBarContentAllMobile: FC<PropsWithChildren> = ({
  children,
}) => {
  const { t } = useTranslation();
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
      id: 'chain',
      label: t('earn.filter.chain'),
      selectType: SelectVariant.Multi,
      testId: 'earn-filter-chain-select-mobile',
    },
    {
      id: 'protocol',
      label: t('earn.filter.protocol'),
      selectType: SelectVariant.Multi,
      testId: 'earn-filter-protocol-select-mobile',
    },
    {
      id: 'tag',
      label: t('earn.filter.tag'),
      selectType: SelectVariant.Multi,
      testId: 'earn-filter-tag-select-mobile',
    },
    {
      id: 'asset',
      label: t('earn.filter.asset'),
      selectType: SelectVariant.Multi,
      testId: 'earn-filter-asset-select-mobile',
    },
    {
      id: 'apy',
      label: t('earn.filter.apy'),
      selectType: SelectVariant.Slider,
      testId: 'earn-filter-apy-select-mobile',
    },
    {
      id: 'sortBy',
      label: t('earn.sorting.sort'),
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
      drawerTitle={t('earn.filter.filterAndSort')}
      applyButtonLabel={t('earn.filter.filterAndSort')}
      clearButtonLabel={t('earn.filter.clearAll')}
    >
      {children}
    </GenericFilterDrawer>
  );
};
