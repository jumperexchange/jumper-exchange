import { useState, useMemo, useCallback, ChangeEvent } from 'react';
import { MultiSelectProps } from '../Select.types';
import { SelectBase } from '../components/SelectBase';
import Typography from '@mui/material/Typography';
import {
  StyledMultiSelectFiltersClearButton,
  StyledMultiSelectFiltersContainer,
  StyledMultiSelectFiltersInput,
  StyledLabelContainer,
} from '../Select.styles';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useSelect } from '../hooks';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import { SelectorLabel } from '../components/SelectLabel';
import { useTranslation } from 'react-i18next';

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
          {!!value?.length && (
            <Badge
              label={value.length}
              size={BadgeSize.SM}
              variant={BadgeVariant.Primary}
              sx={{ padding: 0, marginRight: 0.5 }}
            />
          )}
        </>
      }
      multiple
    >
      <StyledMultiSelectFiltersContainer>
        <Typography variant="bodyXSmallStrong">
          {t('earn.filter.selected', { count: value?.length ?? 0 })}
        </Typography>
        {value?.length > 0 && (
          <StyledMultiSelectFiltersClearButton
            size="small"
            onClick={handleClear}
          >
            {t('earn.filter.clear')}
          </StyledMultiSelectFiltersClearButton>
        )}
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
