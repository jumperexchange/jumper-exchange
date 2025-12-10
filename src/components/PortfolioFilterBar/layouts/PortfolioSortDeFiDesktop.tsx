import { Select } from '@/components/core/form/Select/Select';
import { SelectVariant } from '@/components/core/form/Select/Select.types';
import { useTranslation } from 'react-i18next';
import { usePortfolioDeFiFilterBar } from '../hooks';

export const PortfolioSortDeFiDesktop = () => {
  const { t } = useTranslation();
  const { sortByOptions, sortBy, handleSortBy } = usePortfolioDeFiFilterBar();
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
