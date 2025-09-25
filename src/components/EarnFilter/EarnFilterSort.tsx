import { useTranslation } from 'react-i18next';
import { SingleSelect } from '../core/SingleSelect/SingleSelect';

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
    <SingleSelect
      options={[
        { value: SortByOptions.APY, label: t('earn.sorting.apy') },
        { value: SortByOptions.TVL, label: t('earn.sorting.tvl') },
      ]}
      value={sortBy}
      onChange={handleChange}
      placeholder={t('earn.sorting.sortBy')}
      label={t('earn.sorting.sortBy')}
      size="small"
      data-testid="earn-filter-sort-select"
    />
  );
};
