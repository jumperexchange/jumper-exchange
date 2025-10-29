import { useTranslation } from 'react-i18next';
import { Select } from '../../core/form/Select/Select';
import { SelectVariant } from '../../core/form/Select/Select.types';
import { useEarnFiltering } from 'src/app/ui/earn/EarnFilteringContext';
import { SortByEnum, SortByOptions } from 'src/app/ui/earn/types';

export const EarnFilterSort: React.FC = () => {
  const { t } = useTranslation();
  const { sortBy, setSortBy } = useEarnFiltering();

  const handleChange = (value: string) => {
    setSortBy(value as SortByEnum);
  };

  return (
    <Select
      options={[
        { value: SortByOptions.APY, label: t('earn.sorting.apy') },
        { value: SortByOptions.TVL, label: t('earn.sorting.tvl') },
      ]}
      value={sortBy}
      onChange={handleChange}
      label={t('earn.sorting.sortBy')}
      variant={SelectVariant.Single}
      data-testid="earn-filter-sort-select"
      menuPlacementX="right"
    />
  );
};
