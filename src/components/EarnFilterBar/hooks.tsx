import { useEarnFiltering } from 'src/app/ui/earn/EarnFilteringContext';
import { ChainStack } from '../composite/ChainStack/ChainStack';
import { TokenStack } from '../composite/TokenStack/TokenStack';
import {
  EarnOpportunityFilterUI,
  SortByEnum,
  SortByOptions,
} from 'src/app/ui/earn/types';
import { useTranslation } from 'react-i18next';
import { ProtocolStack } from '../composite/ProtocolStack/ProtocolStack';

export const useEarnFilterBar = () => {
  const { t } = useTranslation();
  const {
    allChains,
    allProtocols,
    allAssets,
    allTags,
    allAPY,
    filter,
    updateFilter,
    sortBy,
    setSortBy,
  } = useEarnFiltering();

  const chainOptions = allChains.map((chain) => ({
    value: `${chain.chainId}`,
    label: chain.chainKey,
    icon: <ChainStack chainIds={[chain.chainId.toString()]} />,
  }));

  const protocolOptions = allProtocols.map((protocol) => ({
    value: protocol.name,
    label: protocol.name,
    icon: <ProtocolStack protocols={[protocol]} />,
  }));

  const tagOptions = allTags.map((tag) => ({
    value: tag,
    label: tag,
  }));

  const assetOptions = allAssets.map((asset) => ({
    value: asset.name,
    label: asset.name,
    icon: <TokenStack tokens={[asset]} />,
  }));

  const apyOptions = Object.entries(allAPY).map(([key, value]) => ({
    value: key,
    label: `${key}: ${value}`,
  }));

  const apyMin = Math.min(...Object.values(allAPY), 0);
  const apyMax = Math.max(...Object.values(allAPY), 0);

  const sortByOptions = [
    { value: SortByOptions.APY, label: t('earn.sorting.apy') },
    { value: SortByOptions.TVL, label: t('earn.sorting.tvl') },
  ];

  // Handle filter changes
  const handleChainChange = (values: string[]) => {
    updateFilter({ ...filter, chains: values.map(Number) });
  };

  const handleProtocolChange = (values: string[]) => {
    updateFilter({ ...filter, protocols: values });
  };

  const handleTagChange = (values: string[]) => {
    updateFilter({ ...filter, tags: values });
  };

  const handleAssetChange = (values: string[]) => {
    updateFilter({ ...filter, assets: values });
  };

  const handleAPYChange = (values: number[]) => {
    updateFilter({
      ...filter,
      minAPY: values[0] / 100,
      maxAPY: values[1] / 100,
    });
  };

  const handleClearAllFilters = () => {
    updateFilter({
      chains: [],
      protocols: [],
      tags: [],
      assets: [],
      minAPY: apyMin / 100,
      maxAPY: apyMax / 100,
    });
  };

  const handleSortBy = (value: string) => {
    setSortBy(value as SortByEnum);
  };

  const handleApplyAllFilters = (values: Partial<EarnOpportunityFilterUI>) => {
    updateFilter({ ...values });
  };

  const apyMinValue = filter?.minAPY
    ? Math.trunc(filter.minAPY * 10000) / 100
    : apyMin;
  const apyMaxValue = filter?.maxAPY
    ? Math.trunc(filter.maxAPY * 10000) / 100
    : apyMax;

  const arrayFiltersCount = [
    filter?.chains,
    filter?.protocols,
    filter?.tags,
    filter?.assets,
  ].reduce((count, arr) => count + (arr?.length || 0), 0);

  const hasAPYFilterApplied =
    !isNaN(apyMinValue) &&
    !isNaN(apyMaxValue) &&
    (apyMinValue !== apyMin || apyMaxValue !== apyMax);
  const apyFilterCount = hasAPYFilterApplied ? 1 : 0;

  const filtersCount = arrayFiltersCount + apyFilterCount;
  const hasFilterApplied = filtersCount > 0;

  return {
    chainOptions,
    protocolOptions,
    tagOptions,
    assetOptions,
    apyOptions,
    hasFilterApplied,
    filtersCount,
    filter,
    apyMinValue,
    apyMaxValue,
    apyMin,
    apyMax,
    sortByOptions,
    sortBy,
    handleChainChange,
    handleProtocolChange,
    handleTagChange,
    handleAssetChange,
    handleAPYChange,
    handleClearAllFilters,
    handleSortBy,
    handleApplyAllFilters,
  };
};
