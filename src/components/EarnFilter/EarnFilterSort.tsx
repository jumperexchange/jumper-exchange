import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

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

  const handleChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as SortByOptions);
  };

  return (
    <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
      <InputLabel id="sort-by-label">{t('earn.sorting.sortBy')}</InputLabel>
      <Select
        labelId="sort-by-label"
        id="sort-by-select"
        value={sortBy}
        onChange={handleChange}
        label={t('earn.sorting.sortBy')}
      >
        <MenuItem value={SortByOptions.APY}>{t('earn.sorting.apy')}</MenuItem>
        <MenuItem value={SortByOptions.TVL}>{t('earn.sorting.tvl')}</MenuItem>
      </Select>
    </FormControl>
  );
};
