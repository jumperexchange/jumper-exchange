import { FC, PropsWithChildren } from 'react';
import { Select } from '../../core/form/Select/Select';
import { SelectVariant } from '../../core/form/Select/Select.types';
import { PortfolioAnimatedLayoutContainer } from '../components/PortfolioAnimatedLayoutContainer';
import {
  PortfolioFilterBarClearFiltersButton,
  PortfolioFilterBarContentContainer,
} from '../PortfolioFilterBar.styles';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { usePortfolioFilterBar } from '../hooks';

export const PortfolioFilterBarTokensDesktop: FC<PropsWithChildren> = ({
  children,
}) => {
  const {
    walletOptions,
    chainOptions,
    assetOptions,
    hasFilterApplied,
    filter,
    valueMin,
    valueMax,
    valueRangeMin,
    valueRangeMax,
    handleWalletChange,
    handleChainChange,
    handleAssetChange,
    handleValueChange,
    handleClearAllFilters,
  } = usePortfolioFilterBar();

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

        {!isNaN(valueRangeMin) &&
          !isNaN(valueRangeMax) &&
          valueRangeMin !== valueRangeMax && (
            <Select
              options={[]}
              value={[valueMin, valueMax]}
              min={valueRangeMin}
              max={valueRangeMax}
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
