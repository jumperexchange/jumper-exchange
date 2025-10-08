import { useState, useMemo, useCallback, ChangeEvent } from 'react';
import { MultiSelectProps } from '../Select.types';
import { SelectBase } from '../components/SelectBase';
import Typography from '@mui/material/Typography';
import {
  StyledMultiSelectFiltersClearButton,
  StyledMultiSelectFiltersContainer,
  StyledMultiSelectFiltersInput,
} from '../Select.styles';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useSelect } from '../hooks';
import { SelectorLabel } from '../components/SelectLabel';
import { useTranslation } from 'react-i18next';
import { SelectBadge } from '../components/SelectBadge';

export const MultiSelect = <T extends string[]>({
  value: initialValue,
  onChange,
  options,
  filterBy,
  label,
  debounceMs,
  ...rest
}: MultiSelectProps<T>) => {
  const { t } = useTranslation();
  const { value, setValue, handleChange, handleDebounceChange } = useSelect(
    initialValue ?? [],
    onChange,
    debounceMs,
    true,
  );
  const [searchValue, setSearchValue] = useState('');

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [options, searchValue]);

  const isValueSelected = useMemo(() => {
    return value.length > 0;
  }, [value]);

  const handleClear = useCallback(() => {
    setValue([] as unknown as T);
    handleDebounceChange([] as unknown as T);
    setSearchValue('');
  }, [handleDebounceChange, setValue]);

  const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setSearchValue(event.target.value);
  }, []);

  const handleSearchClear = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setSearchValue('');
  }, []);

  return (
    <SelectBase
      {...rest}
      options={filteredOptions}
      value={value}
      onChange={handleChange}
      selectorContent={
        <>
          <SelectorLabel label={label} />
          {isValueSelected && <SelectBadge label={value.length.toString()} />}
        </>
      }
      multiple
    >
      <StyledMultiSelectFiltersContainer>
        <Typography variant="bodyXSmallStrong">
          {t('earn.filter.selected', { count: value?.length ?? 0 })}
        </Typography>
        <StyledMultiSelectFiltersClearButton
          disabled={!isValueSelected}
          size="small"
          onClick={handleClear}
        >
          {t('earn.filter.clear')}
        </StyledMultiSelectFiltersClearButton>
      </StyledMultiSelectFiltersContainer>
      {filterBy && (
        <StyledMultiSelectFiltersContainer
          sx={{ paddingX: 0 }}
          onKeyDown={(event) => {
            event.stopPropagation();
          }}
        >
          <StyledMultiSelectFiltersInput
            startAdornment={
              <SearchIcon
                sx={(theme) => ({
                  height: 20,
                  width: 20,
                })}
              />
            }
            endAdornment={
              searchValue && (
                <CloseIcon
                  sx={(theme) => ({
                    height: 20,
                    width: 20,
                    cursor: 'pointer',
                  })}
                  onClick={handleSearchClear}
                />
              )
            }
            placeholder={t('earn.filter.search', { filterBy })}
            onChange={handleSearch}
            value={searchValue}
          />
        </StyledMultiSelectFiltersContainer>
      )}
    </SelectBase>
  );
};
