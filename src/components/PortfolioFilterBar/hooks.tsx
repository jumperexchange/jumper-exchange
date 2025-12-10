import { usePortfolioTokensFiltering } from 'src/app/ui/portfolio/PortfolioTokensFilteringContext';
import { usePortfolioDeFiPositionsFiltering } from 'src/app/ui/portfolio/PortfolioDeFiPositionsFilteringContext';
import { ChainStack } from '../composite/ChainStack/ChainStack';
import { TokenStack } from '../composite/TokenStack/TokenStack';
import { Avatar } from '@mui/material';
import { getConnectorIcon } from '@lifi/wallet-management';
import type { SortByEnum } from 'src/app/ui/portfolio/types';
import {
  type PortfolioTokensFilterUI,
  type PortfolioDeFiPositionsFilterUI,
  SortByOptions,
} from 'src/app/ui/portfolio/types';
import { useMemo } from 'react';
import { ProtocolStack } from '../composite/ProtocolStack/ProtocolStack';
import { useTranslation } from 'react-i18next';
import { capitalizeString } from '@/utils/capitalizeString';
import { useChains } from '@/hooks/useChains';
import { getChainName } from '@/utils/chains/getChainName';
import { sortSelectOptions } from '@/utils/sortSelectOptions';

export const usePortfolioTokensFilterBar = () => {
  const { t } = useTranslation();
  const {
    allWallets,
    allChains,
    allAssets,
    allValueRange,
    filter,
    updateFilter,
    clearFilters,
    sortBy,
    setSortBy,
  } = usePortfolioTokensFiltering();
  const { getChainById } = useChains();

  const walletOptions = useMemo(
    () =>
      sortSelectOptions(
        allWallets.map((wallet) => {
          const connectorIcon = getConnectorIcon(wallet.connector);
          return {
            value: wallet.address,
            label: wallet.connector?.name || '',
            icon: connectorIcon ? (
              <Avatar
                src={connectorIcon}
                alt={wallet.connector?.name || ''}
                sx={{ width: 24, height: 24 }}
              />
            ) : undefined,
          };
        }),
      ),
    [allWallets],
  );

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

  const assetOptions = useMemo(
    () =>
      sortSelectOptions(
        allAssets.map((asset) => ({
          value: asset.address,
          label: asset.name,
          icon: (
            <TokenStack
              tokens={[
                {
                  address: asset.address,
                  chain: {
                    chainId: asset.chainId,
                    chainKey: asset.chainName || '',
                  },
                },
              ]}
            />
          ),
        })),
      ),
    [allAssets],
  );

  const valueMin = filter?.tokensMinValue ?? allValueRange.min;
  const valueMax = filter?.tokensMaxValue ?? allValueRange.max;

  const sortByOptions = useMemo(
    () => [
      { value: SortByOptions.VALUE, label: t('portfolio.sorting.totalValue') },
      { value: SortByOptions.CHAIN, label: t('portfolio.sorting.chain') },
      { value: SortByOptions.ASSET, label: t('portfolio.sorting.asset') },
    ],
    [t],
  );

  const handleWalletChange = (values: string[]) => {
    updateFilter({
      ...filter,
      tokensWallets: values.length > 0 ? values : null,
    });
  };

  const handleChainChange = (values: string[]) => {
    updateFilter({
      ...filter,
      tokensChains: values.length > 0 ? values.map(Number) : null,
    });
  };

  const handleAssetChange = (values: string[]) => {
    updateFilter({
      ...filter,
      tokensAssets: values.length > 0 ? values : null,
    });
  };

  const handleValueChange = (values: number[]) => {
    const hasValues = values.length > 0;
    updateFilter({
      ...filter,
      tokensMinValue: hasValues ? values[0] : null,
      tokensMaxValue: hasValues ? values[1] : null,
    });
  };

  const handleApplyAllFilters = (values: Partial<PortfolioTokensFilterUI>) => {
    updateFilter({ ...values });
  };

  const handleSortBy = (value: string) => {
    setSortBy(value as SortByEnum);
  };

  const optionsCount = [
    walletOptions.length,
    chainOptions.length,
    assetOptions.length,
    allValueRange.min !== allValueRange.max &&
    !isNaN(valueMin) &&
    !isNaN(valueMax)
      ? 1
      : 0,
  ].reduce((count, length) => count + (length || 0), 0);

  const arrayFiltersCount = [
    filter?.tokensWallets,
    filter?.tokensChains,
    filter?.tokensAssets,
  ].reduce((count, arr) => count + (arr?.length || 0), 0);

  const hasValueFilterApplied =
    valueMin !== allValueRange.min || valueMax !== allValueRange.max;
  const valueFilterCount = hasValueFilterApplied ? 1 : 0;

  const filtersCount = arrayFiltersCount + valueFilterCount;
  const hasFilterApplied = filtersCount > 0 && optionsCount > 0;

  return {
    walletOptions,
    chainOptions,
    assetOptions,
    hasFilterApplied,
    filtersCount,
    filter,
    valueMin,
    valueMax,
    valueRangeMin: allValueRange.min,
    valueRangeMax: allValueRange.max,
    sortByOptions,
    sortBy,
    handleWalletChange,
    handleChainChange,
    handleAssetChange,
    handleValueChange,
    handleClearAllFilters: clearFilters,
    handleApplyAllFilters,
    handleSortBy,
  };
};

export const usePortfolioDeFiFilterBar = () => {
  const { t } = useTranslation();
  const {
    allChains,
    allProtocols,
    allTypes,
    allAssets,
    allValueRange,
    filter,
    updateFilter,
    clearFilters,
    sortBy,
    setSortBy,
  } = usePortfolioDeFiPositionsFiltering();
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

  const typeOptions = useMemo(
    () =>
      sortSelectOptions(
        allTypes.map((type) => ({
          value: type,
          label: type,
        })),
      ),
    [allTypes],
  );

  const assetOptions = useMemo(
    () =>
      sortSelectOptions(
        allAssets.map((asset) => ({
          value: asset.name,
          label: asset.name,
          icon: <TokenStack tokens={[asset]} />,
        })),
      ),
    [allAssets],
  );

  const valueMin = filter?.defiMinValue ?? allValueRange.min;
  const valueMax = filter?.defiMaxValue ?? allValueRange.max;

  const sortByOptions = useMemo(
    () => [
      { value: SortByOptions.VALUE, label: t('portfolio.sorting.totalValue') },
      { value: SortByOptions.CHAIN, label: t('portfolio.sorting.chain') },
      { value: SortByOptions.ASSET, label: t('portfolio.sorting.asset') },
    ],
    [t],
  );

  const handleChainChange = (values: string[]) => {
    updateFilter({
      ...filter,
      defiChains: values.length > 0 ? values.map(Number) : null,
    });
  };

  const handleProtocolChange = (values: string[]) => {
    updateFilter({
      ...filter,
      defiProtocols: values.length > 0 ? values : null,
    });
  };

  const handleTypeChange = (values: string[]) => {
    updateFilter({ ...filter, defiTypes: values.length > 0 ? values : null });
  };

  const handleAssetChange = (values: string[]) => {
    updateFilter({ ...filter, defiAssets: values.length > 0 ? values : null });
  };

  const handleValueChange = (values: number[]) => {
    updateFilter({
      ...filter,
      defiMinValue: values[0],
      defiMaxValue: values[1],
    });
  };

  const handleApplyAllFilters = (
    values: Partial<PortfolioDeFiPositionsFilterUI>,
  ) => {
    updateFilter({ ...values });
  };

  const handleSortBy = (value: string) => {
    setSortBy(value as SortByEnum);
  };

  const optionsCount = [
    chainOptions.length,
    protocolOptions.length,
    typeOptions.length,
    assetOptions.length,
    allValueRange.min !== allValueRange.max &&
    !isNaN(valueMin) &&
    !isNaN(valueMax)
      ? 1
      : 0,
  ].reduce((count, length) => count + (length || 0), 0);

  const arrayFiltersCount = [
    filter?.defiChains,
    filter?.defiProtocols,
    filter?.defiTypes,
    filter?.defiAssets,
  ].reduce((count, arr) => count + (arr?.length || 0), 0);

  const hasValueFilterApplied =
    valueMin !== allValueRange.min || valueMax !== allValueRange.max;
  const rangeFiltersCount = hasValueFilterApplied ? 1 : 0;

  const filtersCount = arrayFiltersCount + rangeFiltersCount;
  const hasFilterApplied = filtersCount > 0 && optionsCount > 0;

  return {
    chainOptions,
    protocolOptions,
    typeOptions,
    assetOptions,
    hasFilterApplied,
    filtersCount,
    filter,
    valueMin,
    valueMax,
    valueRangeMin: allValueRange.min,
    valueRangeMax: allValueRange.max,
    sortByOptions,
    sortBy,
    handleChainChange,
    handleProtocolChange,
    handleTypeChange,
    handleAssetChange,
    handleValueChange,
    handleClearAllFilters: clearFilters,
    handleApplyAllFilters,
    handleSortBy,
  };
};
