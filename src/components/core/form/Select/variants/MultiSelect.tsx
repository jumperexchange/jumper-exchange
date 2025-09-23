import { useState, useMemo, useCallback, ChangeEvent } from 'react';
import { MultiSelectProps } from '../Select.types';
import { SelectBase } from './SelectBase';
import Typography from '@mui/material/Typography';
import {
  StyledMultiSelectFiltersClearButton,
  StyledMultiSelectFiltersContainer,
  StyledMultiSelectFiltersInput,
} from '../Select.styles';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useSelect } from '../hooks';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';

export const MultiSelect = <T extends string[]>({
  value: initialValue,
  onChange,
  options,
  filterBy,
  ...rest
}: MultiSelectProps<T>) => {
  const { value, setValue, handleChange } = useSelect(
    initialValue ?? [],
    onChange,
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
    onChange([] as unknown as T);
    setSearchValue('');
  }, [onChange, setValue]);

  const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  }, []);
  const handleSearchClear = useCallback(() => {
    setSearchValue('');
  }, []);

  return (
    <SelectBase
      {...rest}
      options={filteredOptions}
      value={value}
      onChange={handleChange}
      selectorPrepend={
        !!value?.length && (
          <Badge
            label={value.length}
            size={BadgeSize.SM}
            variant={BadgeVariant.Primary}
            sx={{ padding: 0, marginRight: 0.5 }}
          />
        )
      }
      multiple
    >
      <StyledMultiSelectFiltersContainer>
        <Typography variant="bodyXSmallStrong">
          {value?.length ?? 0} selected
        </Typography>
        {value?.length > 0 && (
          <StyledMultiSelectFiltersClearButton
            size="small"
            onClick={handleClear}
          >
            Clear
          </StyledMultiSelectFiltersClearButton>
        )}
      </StyledMultiSelectFiltersContainer>
      {filterBy && (
        <StyledMultiSelectFiltersContainer>
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
            placeholder={`Search ${filterBy}...`}
            onChange={handleSearch}
            value={searchValue}
          />
        </StyledMultiSelectFiltersContainer>
      )}
    </SelectBase>
  );
};
