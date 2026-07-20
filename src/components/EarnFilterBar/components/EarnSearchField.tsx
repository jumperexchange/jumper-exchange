import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ChangeEvent, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@/components/core/buttons/IconButton/IconButton';
import { Size } from '@/components/core/buttons/types';
import { FormInputField } from '@/components/Form/FormInput/FormInput.styles';

const INPUT_ID = 'earn-search';

export interface EarnSearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  sx?: SxProps<Theme>;
}

export const EarnSearchField: FC<EarnSearchFieldProps> = ({
  value,
  onChange,
  onClear,
  sx,
}) => {
  const { t } = useTranslation();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <FormInputField
      id={INPUT_ID}
      name={INPUT_ID}
      value={value}
      placeholder={t('earn.filter.searchPlaceholder')}
      type="text"
      autoComplete="off"
      fullWidth
      onChange={handleChange}
      startAdornment={<SearchIcon sx={{ height: 20, width: 20 }} />}
      endAdornment={
        value ? (
          <IconButton
            size={Size.SM}
            onClick={onClear}
            aria-label={t('earn.filter.searchClear')}
            data-testid="earn-search-field-clear"
          >
            <ClearIcon sx={{ height: 16, width: 16 }} />
          </IconButton>
        ) : undefined
      }
      data-testid="earn-search-field"
      sx={sx}
    />
  );
};
