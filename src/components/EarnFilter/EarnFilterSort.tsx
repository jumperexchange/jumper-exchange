import { useTranslation } from 'react-i18next';
import { SingleSelect } from '../core/SingleSelect/SingleSelect';
import { Select } from '../core/form/Select/Select';
import { SelectVariant } from '../core/form/Select/Select.types';

// TODO: migrate to backend's typing
export enum SortByOptions {
  APY = 'apy',
  TVL = 'tvl',
}

type Props = {
  sortBy: SortByOptions;
  setSortBy: (sortBy: SortByOptions) => void;
};

export const EarnFilterSort: React.FC<Props> = ({ sortBy, setSortBy }) => {
  const { t } = useTranslation();

  const handleChange = (value: string) => {
    setSortBy(value as SortByOptions);
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
    />
  );
};
