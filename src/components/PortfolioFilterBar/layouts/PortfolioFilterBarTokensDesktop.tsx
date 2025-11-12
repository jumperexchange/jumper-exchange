import { FC, PropsWithChildren } from 'react';
import { Select } from '../../core/form/Select/Select';
import { SelectVariant } from '../../core/form/Select/Select.types';
import { PortfolioAnimatedLayoutContainer } from '../components/PortfolioAnimatedLayoutContainer';
import {
  PortfolioFilterBarClearFiltersButton,
  PortfolioFilterBarContentContainer,
} from '../PortfolioFilterBar.styles';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { usePortfolioTokensFilterBar } from '../hooks';
import { useTranslation } from 'react-i18next';

export const PortfolioFilterBarTokensDesktop: FC<PropsWithChildren> = ({
  children,
}) => {
  const { t } = useTranslation();
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
  } = usePortfolioTokensFilterBar();

  return (
    <PortfolioFilterBarContentContainer>
      <PortfolioAnimatedLayoutContainer>
        {walletOptions.length > 0 && (
          <Select
            options={walletOptions}
            value={filter?.tokensWallets || []}
            onChange={handleWalletChange}
            filterBy={t('portfolio.filter.wallet').toLowerCase()}
            label={t('portfolio.filter.wallet')}
            variant={SelectVariant.Multi}
            data-testid="portfolio-filter-wallet-select"
          />
        )}

        {chainOptions.length > 0 && (
          <Select
            options={chainOptions}
            value={filter?.tokensChains?.map(String) ?? []}
            onChange={handleChainChange}
            filterBy={t('portfolio.filter.chain').toLowerCase()}
            label={t('portfolio.filter.chain')}
            variant={SelectVariant.Multi}
            data-testid="portfolio-filter-chain-select"
          />
        )}

        {assetOptions.length > 0 && (
          <Select
            options={assetOptions}
            value={filter?.tokensAssets || []}
            onChange={handleAssetChange}
            filterBy={t('portfolio.filter.asset').toLowerCase()}
            label={t('portfolio.filter.asset')}
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
              label={t('portfolio.filter.value')}
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
