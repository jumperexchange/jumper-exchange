import { FC, PropsWithChildren, useMemo } from 'react';
import { usePortfolioTokensFiltering } from 'src/app/ui/portfolio/PortfolioTokensFilteringContext';
import { MultiSelectOption } from '../../core/MultiSelect/MultiSelect.types';
import { Select } from '../../core/form/Select/Select';
import { SelectVariant } from '../../core/form/Select/Select.types';
import { PortfolioAnimatedLayoutContainer } from './PortfolioAnimatedLayoutContainer';
import {
  PortfolioFilterBarClearFiltersButton,
  PortfolioFilterBarContentContainer,
} from '../PortfolioFilterBar.styles';
import { ChainStack } from 'src/components/composite/ChainStack/ChainStack';
import { TokenStack } from 'src/components/composite/TokenStack/TokenStack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Avatar } from '@mui/material';
import { getConnectorIcon } from '@lifi/wallet-management';

export const PortfolioFilterBarTokens: FC<PropsWithChildren> = ({
  children,
}) => {
  const {
    allWallets,
    allChains,
    allAssets,
    allValueRange,
    filter,
    updateFilter,
  } = usePortfolioTokensFiltering();

  // Convert data to MultiSelect options
  const walletOptions: MultiSelectOption[] = useMemo(
    () => [
      ...allWallets.map((wallet) => {
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
    ],
    [allWallets],
  );

  const chainOptions: MultiSelectOption[] = useMemo(
    () =>
      allChains.map((chain) => ({
        value: `${chain.chainId}`,
        label: chain.chainKey,
        icon: <ChainStack chainIds={[chain.chainId.toString()]} />,
      })),
    [allChains],
  );

  const assetOptions: MultiSelectOption[] = useMemo(
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

  const valueMin = useMemo(
    () => filter?.minValue ?? allValueRange.min,
    [filter?.minValue, allValueRange.min],
  );

  const valueMax = useMemo(
    () => filter?.maxValue ?? allValueRange.max,
    [filter?.maxValue, allValueRange.max],
  );

  const hasArrayFiltersApplied = useMemo(
    () =>
      [filter?.wallets, filter?.chains, filter?.assets].some(
        (arr) => arr && arr.length > 0,
      ),
    [filter?.wallets, filter?.chains, filter?.assets],
  );

  const hasValueFilterApplied = useMemo(
    () => valueMin !== allValueRange.min || valueMax !== allValueRange.max,
    [valueMin, valueMax, allValueRange.min, allValueRange.max],
  );

  const hasFilterApplied = useMemo(
    () => hasArrayFiltersApplied || hasValueFilterApplied,
    [hasArrayFiltersApplied, hasValueFilterApplied],
  );

  return (
    <PortfolioFilterBarContentContainer>
      <PortfolioAnimatedLayoutContainer>
        {walletOptions.length > 0 && (
          <Select
            options={walletOptions}
            value={filter?.wallets || []}
            onChange={handleWalletChange}
            filterBy="wallet"
            label="Wallets"
            variant={SelectVariant.Multi}
            data-testid="portfolio-filter-wallet-select"
          />
        )}

        {chainOptions.length > 0 && (
          <Select
            options={chainOptions}
            value={filter?.chains?.map(String) ?? []}
            onChange={handleChainChange}
            filterBy="chain"
            label="Chains"
            variant={SelectVariant.Multi}
            data-testid="portfolio-filter-chain-select"
          />
        )}

        {assetOptions.length > 0 && (
          <Select
            options={assetOptions}
            value={filter?.assets || []}
            onChange={handleAssetChange}
            filterBy="asset"
            label="Assets"
            variant={SelectVariant.Multi}
            data-testid="portfolio-filter-asset-select"
          />
        )}

        {allValueRange.min !== allValueRange.max && (
          <Select
            options={[]}
            value={[valueMin, valueMax]}
            min={allValueRange.min}
            max={allValueRange.max}
            onChange={handleValueChange}
            label="Value"
            variant={SelectVariant.Slider}
            data-testid="portfolio-filter-value-select"
          />
        )}

        {hasFilterApplied && (
          <PortfolioFilterBarClearFiltersButton
            onClick={handleClearAllFilters}
            data-testid="portfolio-filter-clear-filters-button"
          >
            <DeleteOutlineIcon sx={{ height: 22, width: 22 }} />
          </PortfolioFilterBarClearFiltersButton>
        )}
      </PortfolioAnimatedLayoutContainer>

      {children}
    </PortfolioFilterBarContentContainer>
  );
};
