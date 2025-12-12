import type { FC, PropsWithChildren } from 'react';
import { Select } from '../../core/form/Select/Select';
import { SelectVariant } from '../../core/form/Select/Select.types';
import { PortfolioAnimatedLayoutContainer } from '../components/PortfolioAnimatedLayoutContainer';
import {
  PortfolioFilterBarClearFiltersButton,
  PortfolioFilterBarContentContainer,
} from '../PortfolioFilterBar.styles';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { usePortfolioDeFiFilterBar } from '../hooks';
import { useTranslation } from 'react-i18next';

export const PortfolioFilterBarDeFiDesktop: FC<PropsWithChildren> = ({
  children,
}) => {
  const { t } = useTranslation();
  const {
    chainOptions,
    protocolOptions,
    typeOptions,
    assetOptions,
    hasFilterApplied,
    filter,
    valueMin,
    valueMax,
    valueRangeMin,
    valueRangeMax,
    handleChainChange,
    handleProtocolChange,
    handleTypeChange,
    handleAssetChange,
    handleValueChange,
    handleClearAllFilters,
  } = usePortfolioDeFiFilterBar();

  return (
    <PortfolioFilterBarContentContainer>
      <PortfolioAnimatedLayoutContainer>
        {chainOptions.length > 1 && (
          <Select
            options={chainOptions}
            value={filter?.defiChains?.map(String) ?? []}
            onChange={handleChainChange}
            filterBy={t('portfolio.filter.chain').toLowerCase()}
            label={t('portfolio.filter.chain')}
            variant={SelectVariant.Multi}
            data-testid="portfolio-defi-filter-chain-select"
          />
        )}

        {protocolOptions.length > 1 && (
          <Select
            options={protocolOptions}
            value={filter?.defiProtocols || []}
            onChange={handleProtocolChange}
            filterBy={t('portfolio.filter.protocol').toLowerCase()}
            label={t('portfolio.filter.protocol')}
            variant={SelectVariant.Multi}
            data-testid="portfolio-defi-filter-protocol-select"
          />
        )}

        {typeOptions.length > 1 && (
          <Select
            options={typeOptions}
            value={filter?.defiTypes || []}
            onChange={handleTypeChange}
            filterBy={t('portfolio.filter.type').toLowerCase()}
            label={t('portfolio.filter.type')}
            variant={SelectVariant.Multi}
            data-testid="portfolio-defi-filter-type-select"
          />
        )}

        {assetOptions.length > 1 && (
          <Select
            options={assetOptions}
            value={filter?.defiAssets || []}
            onChange={handleAssetChange}
            filterBy={t('portfolio.filter.asset').toLowerCase()}
            label={t('portfolio.filter.asset')}
            variant={SelectVariant.Multi}
            data-testid="portfolio-defi-filter-asset-select"
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
              data-testid="portfolio-defi-filter-value-select"
            />
          )}

        {hasFilterApplied && (
          <PortfolioFilterBarClearFiltersButton
            onClick={handleClearAllFilters}
            data-testid="portfolio-defi-filter-clear-filters-button"
          >
            <DeleteOutlineIcon sx={{ height: 22, width: 22 }} />
          </PortfolioFilterBarClearFiltersButton>
        )}
      </PortfolioAnimatedLayoutContainer>

      {children}
    </PortfolioFilterBarContentContainer>
  );
};
