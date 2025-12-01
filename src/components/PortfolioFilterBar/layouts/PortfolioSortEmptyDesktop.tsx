import { useTranslation } from 'react-i18next';
import { Select } from '@/components/core/form/Select/Select';
import { SelectVariant } from '@/components/core/form/Select/Select.types';

export const PortfolioSortEmptyDesktop = ({}) => {
  const { t } = useTranslation();
  return (
    <Select
      options={[]}
      value={''}
      onChange={() => {}}
      label={t('portfolio.sorting.sortBy')}
      variant={SelectVariant.Single}
      data-testid="portfolio-filter-sort-select"
      menuPlacementX="right"
      disabled
    />
  );
};
