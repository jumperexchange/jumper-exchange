import { useMemo } from 'react';
import { useEarnFiltering } from 'src/app/ui/earn/EarnFilteringContext';
import { ChainStack } from '../composite/ChainStack/ChainStack';
import { TokenStack } from '../composite/TokenStack/TokenStack';
import { toTokenStackTokens } from '../composite/TokenStack/utils';
import type {
  EarnOpportunityFilterUI,
  RewardsAPYEnum,
  SortByEnum,
} from 'src/app/ui/earn/types';
import { RewardsAPYOptions, SortByOptions } from 'src/app/ui/earn/types';
import { useTranslation } from 'react-i18next';
import { ProtocolStack } from '../composite/ProtocolStack/ProtocolStack';
import { capitalizeString } from '@/utils/capitalizeString';
import { useChains } from '@/hooks/useChains';
import { getChainName } from '@/utils/chains/getChainName';
import { sortSelectOptions } from '@/utils/sortSelectOptions';

export const useEarnFilterBar = () => {
  const { t } = useTranslation();
  const {
    allChains,
    allProtocols,
    allAssets,
    allTags,
    allAPY,
    allTVL,
    allRewardsOptions,
    filter,
    updateFilter,
    clearFilters,
    sortBy,
    setSortBy,
  } = useEarnFiltering();
  const { getChainById } = useChains();

  const chainOptions = useMemo(
    () =>
      sortSelectOptions(
        allChains.map((chain) => ({
          value: `${chain.chainId}`,
          label: getChainName(chain, getChainById),
          icon: <ChainStack chainIds={[chain.chainId.toString()]} />,
        })),
      ),
    [allChains, getChainById],
  );

  const protocolOptions = useMemo(
    () =>
      sortSelectOptions(
        allProtocols.map((protocol) => ({
          value: protocol.name,
          label: capitalizeString(protocol.name),
          icon: <ProtocolStack protocols={[protocol]} />,
        })),
      ),
    [allProtocols],
  );

  const tagOptions = useMemo(
    () =>
      sortSelectOptions(
        allTags.map((tag) => ({
          value: tag,
          label: tag,
        })),
      ),
    [allTags],
  );

  const assetOptions = useMemo(
    () =>
      sortSelectOptions(
        allAssets.map((asset) => ({
          value: asset.name,
          label: asset.name,
          icon: <TokenStack tokens={toTokenStackTokens([asset])} />,
        })),
      ),
    [allAssets],
  );

  const apyOptions = useMemo(
    () =>
      sortSelectOptions(
        Object.entries(allAPY).map(([key, value]) => ({
          value: key,
          label: `${key}: ${value}`,
        })),
      ),
    [allAPY],
  );

  const apyMin = Math.min(...Object.values(allAPY), 0);
  const apyMax = Math.max(...Object.values(allAPY), 0);

  const tvlOptions = useMemo(
    () =>
      sortSelectOptions(
        Object.entries(allTVL).map(([key, value]) => ({
          value: key,
          label: `${key}: ${value}`,
        })),
      ),
    [allTVL],
  );

  const tvlMin = Math.min(...Object.values(allTVL), 0);
  const tvlMax = Math.max(...Object.values(allTVL), 0);

  const rewardsAPYOptions = useMemo(
    () =>
      allRewardsOptions.map((option) => {
        const _option = option as RewardsAPYEnum;
        return {
          value: _option,
          label: t(`earn.filter.rewards.${_option}`),
        };
      }),
    [allRewardsOptions, t],
  );

  const sortByOptions = useMemo(
    () => [
      { value: SortByOptions.APY, label: t('earn.sorting.apy') },
      { value: SortByOptions.TVL, label: t('earn.sorting.tvl') },
    ],
    [t],
  );

  // Handle filter changes
  const handleChainChange = (values: string[]) => {
    updateFilter({
      ...filter,
      chains: values.length > 0 ? values.map(Number) : null,
    });
  };

  const handleProtocolChange = (values: string[]) => {
    updateFilter({ ...filter, protocols: values.length > 0 ? values : null });
  };

  const handleTagChange = (values: string[]) => {
    updateFilter({ ...filter, tags: values.length > 0 ? values : null });
  };

  const handleAssetChange = (values: string[]) => {
    updateFilter({ ...filter, assets: values.length > 0 ? values : null });
  };

  const handleAPYChange = (values: number[]) => {
    const hasValues = values.length > 0;
    updateFilter({
      ...filter,
      minAPY: hasValues ? values[0] / 100 : null,
      maxAPY: hasValues ? values[1] / 100 : null,
    });
  };

  const handleTVLChange = (values: number[]) => {
    const hasValues = values.length > 0;
    updateFilter({
      ...filter,
      minTVL: hasValues ? values[0] : null,
      maxTVL: hasValues ? values[1] : null,
    });
  };

  const handleRewardsAPYChange = (values: string[]) => {
    const hasValues = values.length > 0;
    const minRewardsAPY =
      hasValues && values[0] === RewardsAPYOptions.WITH_REWARDS ? 0.0 : null;
    updateFilter({ ...filter, minRewardsAPY });
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

  const tvlMinValue = filter?.minTVL ? filter.minTVL : tvlMin;
  const tvlMaxValue = filter?.maxTVL ? filter.maxTVL : tvlMax;

  const rewardsAPYValue =
    filter?.minRewardsAPY !== undefined ? RewardsAPYOptions.WITH_REWARDS : null;

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

  const hasTVLFilterApplied =
    !isNaN(tvlMinValue) &&
    !isNaN(tvlMaxValue) &&
    (tvlMinValue !== tvlMin || tvlMaxValue !== tvlMax);

  const tvlFilterCount = hasTVLFilterApplied ? 1 : 0;

  const hasRewardsAPYFilterApplied = filter?.minRewardsAPY !== undefined;
  const rewardsAPYFilterCount = hasRewardsAPYFilterApplied ? 1 : 0;

  const filtersCount =
    arrayFiltersCount + apyFilterCount + tvlFilterCount + rewardsAPYFilterCount;
  const hasFilterApplied = filtersCount > 0;

  return {
    chainOptions,
    protocolOptions,
    tagOptions,
    assetOptions,
    apyOptions,
    tvlOptions,
    rewardsAPYOptions,
    hasFilterApplied,
    filtersCount,
    filter,
    apyMinValue,
    apyMaxValue,
    apyMin,
    apyMax,
    tvlMinValue,
    tvlMaxValue,
    tvlMin,
    tvlMax,
    rewardsAPYValue,
    sortByOptions,
    sortBy,
    handleChainChange,
    handleProtocolChange,
    handleTagChange,
    handleAssetChange,
    handleAPYChange,
    handleTVLChange,
    handleRewardsAPYChange,
    handleClearAllFilters: clearFilters,
    handleSortBy,
    handleApplyAllFilters,
  };
};
