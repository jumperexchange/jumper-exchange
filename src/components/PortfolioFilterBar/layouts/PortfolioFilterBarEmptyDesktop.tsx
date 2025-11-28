import type { FC } from 'react';
import { Select } from '../../core/form/Select/Select';
import { SelectVariant } from '../../core/form/Select/Select.types';
import { PortfolioAnimatedLayoutContainer } from '../components/PortfolioAnimatedLayoutContainer';
import { PortfolioFilterBarContentContainer } from '../PortfolioFilterBar.styles';
import { useTranslation } from 'react-i18next';

export const PortfolioFilterBarEmptyDesktop: FC = () => {
  const { t } = useTranslation();

  return (
    <PortfolioFilterBarContentContainer>
      <PortfolioAnimatedLayoutContainer>
        <Select
          options={[]}
          value={[]}
          onChange={() => {}}
          filterBy={t('portfolio.filter.chain').toLowerCase()}
          label={t('portfolio.filter.chain')}
          variant={SelectVariant.Multi}
          data-testid="portfolio-filter-chain-select-empty"
          disabled
        />

        <Select
          options={[]}
          value={[]}
          onChange={() => {}}
          filterBy={t('portfolio.filter.asset').toLowerCase()}
          label={t('portfolio.filter.asset')}
          variant={SelectVariant.Multi}
          data-testid="portfolio-filter-asset-select-empty"
          disabled
        />

        <Select
          options={[]}
          value={[0, 0]}
          min={0}
          max={0}
          onChange={() => {}}
          label={t('portfolio.filter.value')}
          variant={SelectVariant.Slider}
          data-testid="portfolio-filter-value-select-empty"
          disabled
        />
      </PortfolioAnimatedLayoutContainer>
    </PortfolioFilterBarContentContainer>
  );
};
