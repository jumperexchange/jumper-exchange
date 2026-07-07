import type { ChangeEvent } from 'react';
import { useMemo, useState } from 'react';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import CheckIcon from '@mui/icons-material/Check';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import type {
  RendererSlotProps,
  SingleSelectLeafCategory,
} from '../MultiLayer.types';
import {
  StyledMenuItem,
  StyledMenuItemContentContainer,
  StyledMultiSelectFiltersContainer,
  StyledMultiSelectFiltersInput,
} from 'src/components/core/form/Select/Select.styles';
import { SelectorLabel } from 'src/components/core/form/Select/components/SelectLabel';
import { mergeSx } from '@/utils/theme/mergeSx';

export interface SingleSelectViewProps<TValue extends string | number> {
  category: SingleSelectLeafCategory<TValue>;
  slotProps?: RendererSlotProps;
}

export const SingleSelectView = <TValue extends string | number>({
  category,
  slotProps,
}: SingleSelectViewProps<TValue>) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');

  const value = category.value || '';
  const isSearchable = !!category.searchable;

  const listSpacing = slotProps?.listSpacing ?? 2;
  const searchSize = slotProps?.searchSize ?? 'medium';

  const filteredOptions = useMemo(() => {
    const options = category.options ?? [];
    if (!searchValue) {
      return options;
    }
    const lowerSearch = searchValue.toLowerCase();
    return options.filter((option) =>
      option.label.toLowerCase().includes(lowerSearch),
    );
  }, [category.options, searchValue]);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSearchClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    setSearchValue('');
  };

  const handleSelect = (optionValue: TValue) => {
    if (!category.onChange) {
      return;
    }

    const newValue = value === optionValue ? '' : optionValue;
    category.onChange(newValue as TValue);
  };

  const list = (
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
        const isSelected = value === option.value;

        return (
          <StyledMenuItem
            size="medium"
            disableRipple
            key={option.value}
            value={option.value}
            sx={mergeSx(option.sx, slotProps?.itemSx)}
            onClick={() => handleSelect(option.value)}
            disabled={option.disabled}
          >
            <StyledMenuItemContentContainer size="medium">
              {option.startAdornment ?? option.icon}
              <SelectorLabel
                label={option.label}
                labelVariant="bodyMedium"
                size="medium"
              />
              {option.endAdornment}
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
  );

  if (!isSearchable && !slotProps?.header && !slotProps?.tabs) {
    return list;
  }

  return (
    <Stack
      direction="column"
      sx={{
        width: '100%',
        gap: 2,
      }}
    >
      {slotProps?.header}
      {slotProps?.tabs}
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
      {list}
    </Stack>
  );
};
