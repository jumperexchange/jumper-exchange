import { usePortfolioTokensFiltering } from 'src/app/ui/portfolio/PortfolioTokensFilteringContext';
import { ChainStack } from '../composite/ChainStack/ChainStack';
import { TokenStack } from '../composite/TokenStack/TokenStack';
import { MultiSelectOption } from '../core/MultiSelect/MultiSelect.types';
import { Avatar } from '@mui/material';
import { getConnectorIcon } from '@lifi/wallet-management';
import { PortfolioTokensFilterUI } from 'src/app/ui/portfolio/types';
import { useMemo } from 'react';

export const usePortfolioFilterBar = () => {
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

  const valueMin = filter?.minValue ?? allValueRange.min;
  const valueMax = filter?.maxValue ?? allValueRange.max;

  // Handle filter changes
  const handleWalletChange = (values: string[]) => {
    updateFilter({ ...filter, wallets: values });
  };

  const handleChainChange = (values: string[]) => {
    updateFilter({ ...filter, chains: values.map(Number) });
  };

  const handleAssetChange = (values: string[]) => {
    updateFilter({ ...filter, assets: values });
  };

  const handleValueChange = (values: number[]) => {
    updateFilter({
      ...filter,
      minValue: values[0],
      maxValue: values[1],
    });
  };

  const handleClearAllFilters = () => {
    updateFilter({
      wallets: [],
      chains: [],
      assets: [],
      minValue: allValueRange.min,
      maxValue: allValueRange.max,
    });
  };

  const handleApplyAllFilters = (values: Partial<PortfolioTokensFilterUI>) => {
    updateFilter({ ...values });
  };

  const arrayFiltersCount = [
    filter?.wallets,
    filter?.chains,
    filter?.assets,
  ].reduce((count, arr) => count + (arr?.length || 0), 0);

  const hasValueFilterApplied =
    valueMin !== allValueRange.min || valueMax !== allValueRange.max;
  const valueFilterCount = hasValueFilterApplied ? 1 : 0;

  const filtersCount = arrayFiltersCount + valueFilterCount;
  const hasFilterApplied = filtersCount > 0;

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
