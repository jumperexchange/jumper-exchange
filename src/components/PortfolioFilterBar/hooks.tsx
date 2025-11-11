import { usePortfolioTokensFiltering } from 'src/app/ui/portfolio/PortfolioTokensFilteringContext';
import { ChainStack } from '../composite/ChainStack/ChainStack';
import { TokenStack } from '../composite/TokenStack/TokenStack';
import { MultiSelectOption } from '../core/MultiSelect/MultiSelect.types';
import { Avatar } from '@mui/material';
import { getConnectorIcon } from '@lifi/wallet-management';
import { PortfolioTokensFilterUI } from 'src/app/ui/portfolio/types';
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
          label: wallet.connectorName,
          icon: connectorIcon ? (
            <Avatar
              src={connectorIcon}
              alt={wallet.connectorName}
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
                  chainKey: asset.symbol,
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
