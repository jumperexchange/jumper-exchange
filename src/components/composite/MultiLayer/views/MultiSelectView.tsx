import type { ChangeEvent } from 'react';
import { useState, useMemo } from 'react';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import type {
  RendererSlotProps,
  MultiSelectLeafCategory,
} from '../MultiLayer.types';
import {
  StyledMultiSelectFiltersContainer,
  StyledMultiSelectFiltersClearButton,
  StyledMultiSelectFiltersInput,
  StyledMenuItem,
  StyledMenuItemContentContainer,
} from 'src/components/core/form/Select/Select.styles';
import { SelectorLabel } from 'src/components/core/form/Select/components/SelectLabel';
import { useTranslation } from 'react-i18next';
import { mergeSx } from '@/utils/theme/mergeSx';

export interface MultiSelectViewProps<TValue extends string | number> {
  category: MultiSelectLeafCategory<TValue>;
  slotProps?: RendererSlotProps;
}

export const MultiSelectView = <TValue extends string | number>({
  category,
  slotProps,
}: MultiSelectViewProps<TValue>) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');

  const value = category.value || [];
  const options = category.options || [];
  const isSearchable = !!category.searchable;

  const clearButtonSize = slotProps?.clearButtonSize ?? 'medium';
  const searchSize = slotProps?.searchSize ?? 'medium';
  const listSpacing = slotProps?.listSpacing ?? 2;

  const filteredOptions = useMemo(() => {
    if (!searchValue) {
      return options;
    }
    const lowerSearch = searchValue.toLowerCase();
    return options.filter((option) =>
      option.label.toLowerCase().includes(lowerSearch),
    );
  }, [options, searchValue]);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSearchClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    setSearchValue('');
  };

  const handleToggle = (optionValue: TValue) => {
    if (!category.onChange) {
      return;
    }

    const isSelected = value.includes(optionValue);
    const newValue = isSelected
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];

    category.onChange(newValue);
  };

  const handleClear = () => {
    if (category.onChange) {
      category.onChange([]);
    }
  };

  const isValueSelected = value.length > 0;

  return (
    <Stack
      direction="column"
      sx={{
        width: '100%',
        gap: 2,
      }}
    >
      <StyledMultiSelectFiltersContainer sx={{ padding: 0, marginBottom: 0 }}>
        <Typography variant="bodyMediumStrong">
          {t('earn.filter.selected', { count: value.length })}
        </Typography>
        <StyledMultiSelectFiltersClearButton
          disabled={!isValueSelected}
          size={clearButtonSize}
          data-testid={`${category.testId}-clear-button`}
          onClick={handleClear}
        >
          {t('earn.filter.clear')}
        </StyledMultiSelectFiltersClearButton>
      </StyledMultiSelectFiltersContainer>
      {isSearchable && (
        <StyledMultiSelectFiltersContainer
          size={searchSize}
          sx={mergeSx({ marginBottom: 0 }, slotProps?.searchSx)}
          onKeyDown={(event) => {
            event.stopPropagation();
          }}
        >
          <StyledMultiSelectFiltersInput
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            size={searchSize}
            name="search"
            startAdornment={<SearchIcon />}
            endAdornment={
              searchValue && (
                <CloseIcon
                  sx={{
                    cursor: 'pointer',
                  }}
                  onClick={handleSearchClear}
                />
              )
            }
            placeholder={
              category.searchPlaceholder ||
              t('earn.filter.search', { filterBy: category.label })
            }
            onChange={handleSearch}
            value={searchValue}
          />
        </StyledMultiSelectFiltersContainer>
      )}
      <MenuList
        disablePadding
        sx={mergeSx(
          {
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: listSpacing,
          },
          slotProps?.listSx,
        )}
      >
        {filteredOptions.map((option) => {
          const isSelected = value.includes(option.value);

          return (
            <StyledMenuItem
              size="medium"
              disableRipple
              key={option.value.toString()}
              value={option.value}
              sx={mergeSx(option.sx, slotProps?.itemSx)}
              onClick={() => handleToggle(option.value)}
            >
              <StyledMenuItemContentContainer size="medium">
                {option.icon}
                <SelectorLabel
                  label={option.label}
                  labelVariant="bodyMedium"
                  size="medium"
                />
              </StyledMenuItemContentContainer>
              {isSelected && (
                <CheckIcon
                  sx={{
                    marginLeft: 'auto',
                  }}
                />
              )}
            </StyledMenuItem>
          );
        })}
      </MenuList>
    </Stack>
  );
};
