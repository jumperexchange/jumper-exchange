import { useEarnFiltering } from 'src/app/ui/earn/EarnFilteringContext';
import { ChainStack } from '../composite/ChainStack/ChainStack';
import { TokenStack } from '../composite/TokenStack/TokenStack';
import { AvatarStack } from '../core/AvatarStack/AvatarStack';
import { MultiSelectOption } from '../core/MultiSelect/MultiSelect.types';
import { SortByEnum, SortByOptions } from 'src/app/ui/earn/types';
import { useTranslation } from 'react-i18next';

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

  // Convert data to MultiSelect options
  const chainOptions: MultiSelectOption[] = allChains.map((chain) => ({
    value: `${chain.chainId}`,
    label: chain.chainKey,
    icon: <ChainStack chainIds={[chain.chainId.toString()]} />,
  }));

  const protocolOptions: MultiSelectOption[] = allProtocols.map((protocol) => ({
    value: protocol.name,
    label: protocol.name,
    // TODO: replace with ProtocolStack once PR #2349 gets merged
    icon: (
      <AvatarStack
        avatars={[
          { id: protocol.name, src: protocol.logo, alt: protocol.name },
        ]}
      />
    ),
  }));

  const tagOptions: MultiSelectOption[] = allTags.map((tag) => ({
    value: tag,
    label: tag,
  }));

  const assetOptions: MultiSelectOption[] = allAssets.map((asset) => ({
    value: asset.name,
    label: asset.name,
    icon: <TokenStack tokens={[asset]} />,
  }));

  const apyOptions: MultiSelectOption[] = Object.entries(allAPY).map(
    ([key, value]) => ({
      value: key,
      label: `${key}: ${value}`,
    }),
  );

  const apyMin = Math.min(...Object.values(allAPY), 0);
  const apyMax = Math.max(...Object.values(allAPY), 0);

  const sortByOptions: MultiSelectOption[] = [
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

  const apyMinValue = filter?.minAPY ? filter.minAPY * 100 : apyMin;
  const apyMaxValue = filter?.maxAPY ? filter.maxAPY * 100 : apyMax;

  const arrayFiltersCount = [
    filter?.chains,
    filter?.protocols,
    filter?.tags,
    filter?.assets,
  ].reduce((count, arr) => count + (arr?.length || 0), 0);

  const hasAPYFilterApplied = apyMinValue !== apyMin || apyMaxValue !== apyMax;
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
  };
};
