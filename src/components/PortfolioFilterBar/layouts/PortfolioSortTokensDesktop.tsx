import { useTranslation } from 'react-i18next';
import { usePortfolioTokensFilterBar } from '../hooks';
import { Select } from '@/components/core/form/Select/Select';
import { SelectVariant } from '@/components/core/form/Select/Select.types';
import type { FC } from 'react';

interface PortfolioSortTokensDesktopProps {}

export const PortfolioSortTokensDesktop: FC<
  PortfolioSortTokensDesktopProps
> = () => {
  const { t } = useTranslation();
  const { sortByOptions, sortBy, handleSortBy } = usePortfolioTokensFilterBar();
  return (
    <Select
      options={sortByOptions}
      value={sortBy}
      onChange={handleSortBy}
      label={t('portfolio.sorting.sortBy')}
      variant={SelectVariant.Single}
      data-testid="portfolio-filter-sort-select"
      menuPlacementX="right"
    />
  );
};
