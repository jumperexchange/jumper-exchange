import { usePortfolioTokensFiltering } from 'src/app/ui/portfolio/PortfolioTokensFilteringContext';
import { usePortfolioDeFiPositionsFiltering } from 'src/app/ui/portfolio/PortfolioDeFiPositionsFilteringContext';
import { ChainStack } from '../composite/ChainStack/ChainStack';
import { TokenStack } from '../composite/TokenStack/TokenStack';
import { MultiSelectOption } from '../core/MultiSelect/MultiSelect.types';
import { Avatar } from '@mui/material';
import { getConnectorIcon } from '@lifi/wallet-management';
import type {
  PortfolioTokensFilterUI,
  PortfolioDeFiPositionsFilterUI,
} from 'src/app/ui/portfolio/types';
import { useMemo } from 'react';

export const usePortfolioTokensFilterBar = () => {
  const {
    allWallets,
    allChains,
    allAssets,
    allValueRange,
    filter,
    updateFilter,
  } = usePortfolioTokensFiltering();

  const walletOptions = useMemo(
    () =>
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
    [allWallets],
  );

  const chainOptions = useMemo(
    () =>
      allChains.map((chain) => ({
        value: `${chain.chainId}`,
        label: chain.chainKey,
        icon: <ChainStack chainIds={[chain.chainId.toString()]} />,
      })),
    [allChains],
  );

  const assetOptions = useMemo(
    () =>
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
    [allAssets],
  );

  const valueMin = filter?.tokensMinValue ?? allValueRange.min;
  const valueMax = filter?.tokensMaxValue ?? allValueRange.max;

  const handleWalletChange = (values: string[]) => {
    updateFilter({ ...filter, tokensWallets: values });
  };

  const handleChainChange = (values: string[]) => {
    updateFilter({ ...filter, tokensChains: values.map(Number) });
  };

  const handleAssetChange = (values: string[]) => {
    updateFilter({ ...filter, tokensAssets: values });
  };

  const handleValueChange = (values: number[]) => {
    updateFilter({
      ...filter,
      tokensMinValue: values[0],
      tokensMaxValue: values[1],
    });
  };

  const handleClearAllFilters = () => {
    updateFilter({
      tokensWallets: [],
      tokensChains: [],
      tokensAssets: [],
      tokensMinValue: allValueRange.min,
      tokensMaxValue: allValueRange.max,
    });
  };

  const handleApplyAllFilters = (values: Partial<PortfolioTokensFilterUI>) => {
    updateFilter({ ...values });
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
    handleWalletChange,
    handleChainChange,
    handleAssetChange,
    handleValueChange,
    handleClearAllFilters,
    handleApplyAllFilters,
  };
};

export const usePortfolioDeFiFilterBar = () => {
  const {
    allChains,
    allProtocols,
    allTypes,
    allAssets,
    allAPYRange,
    allValueRange,
    filter,
    updateFilter,
  } = usePortfolioDeFiPositionsFiltering();

  const chainOptions = useMemo(
    () =>
      allChains.map((chain) => ({
        value: `${chain.chainId}`,
        label: chain.chainKey,
        icon: <ChainStack chainIds={[chain.chainId.toString()]} />,
      })),
    [allChains],
  );

  const protocolOptions = useMemo(
    () =>
      allProtocols.map((protocol) => ({
        value: protocol.name,
        label: protocol.name,
        icon: protocol.logo ? (
          <Avatar
            src={protocol.logo}
            alt={protocol.name}
            sx={{ width: 24, height: 24 }}
          />
        ) : undefined,
      })),
    [allProtocols],
  );

  const typeOptions = useMemo(
    () =>
      allTypes.map((type) => ({
        value: type,
        label: type,
      })),
    [allTypes],
  );

  const assetOptions = useMemo(
    () =>
      allAssets.map((asset) => ({
        value: asset.name,
        label: asset.name,
        icon: asset.chain ? (
          <TokenStack
            tokens={[
              {
                address: asset.address || '',
                chain: {
                  chainId: asset.chain.chainId,
                  chainKey: asset.symbol || asset.name,
                },
              },
            ]}
          />
        ) : undefined,
      })),
    [allAssets],
  );

  const apyMin = filter?.defiMinAPY ?? allAPYRange.min;
  const apyMax = filter?.defiMaxAPY ?? allAPYRange.max;
  const valueMin = filter?.defiMinValue ?? allValueRange.min;
  const valueMax = filter?.defiMaxValue ?? allValueRange.max;

  const handleChainChange = (values: string[]) => {
    updateFilter({ ...filter, defiChains: values.map(Number) });
  };

  const handleProtocolChange = (values: string[]) => {
    updateFilter({ ...filter, defiProtocols: values });
  };

  const handleTypeChange = (values: string[]) => {
    updateFilter({ ...filter, defiTypes: values });
  };

  const handleAssetChange = (values: string[]) => {
    updateFilter({ ...filter, defiAssets: values });
  };

  const handleAPYChange = (values: number[]) => {
    updateFilter({
      ...filter,
      defiMinAPY: values[0],
      defiMaxAPY: values[1],
    });
  };

  const handleValueChange = (values: number[]) => {
    updateFilter({
      ...filter,
      defiMinValue: values[0],
      defiMaxValue: values[1],
    });
  };

  const handleClearAllFilters = () => {
    updateFilter({
      defiChains: [],
      defiProtocols: [],
      defiTypes: [],
      defiAssets: [],
      defiMinAPY: allAPYRange.min,
      defiMaxAPY: allAPYRange.max,
      defiMinValue: allValueRange.min,
      defiMaxValue: allValueRange.max,
    });
  };

  const handleApplyAllFilters = (
    values: Partial<PortfolioDeFiPositionsFilterUI>,
  ) => {
    updateFilter({ ...values });
  };

  const optionsCount = [
    chainOptions.length,
    protocolOptions.length,
    typeOptions.length,
    assetOptions.length,
    allAPYRange.min !== allAPYRange.max && !isNaN(apyMin) && !isNaN(apyMax)
      ? 1
      : 0,
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

  const hasAPYFilterApplied =
    apyMin !== allAPYRange.min || apyMax !== allAPYRange.max;
  const hasValueFilterApplied =
    valueMin !== allValueRange.min || valueMax !== allValueRange.max;
  const rangeFiltersCount =
    (hasAPYFilterApplied ? 1 : 0) + (hasValueFilterApplied ? 1 : 0);

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
    apyMin,
    apyMax,
    apyRangeMin: allAPYRange.min,
    apyRangeMax: allAPYRange.max,
    valueMin,
    valueMax,
    valueRangeMin: allValueRange.min,
    valueRangeMax: allValueRange.max,
    handleChainChange,
    handleProtocolChange,
    handleTypeChange,
    handleAssetChange,
    handleAPYChange,
    handleValueChange,
    handleClearAllFilters,
    handleApplyAllFilters,
  };
};
