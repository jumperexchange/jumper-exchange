import type { ChangeEvent } from 'react';
import { useState, useMemo, useRef } from 'react';
import MenuList from '@mui/material/MenuList';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Button } from '@/components/core/buttons/Button/Button';
import { Size, Variant } from '@/components/core/buttons/types';
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

const VIRTUAL_THRESHOLD = 50;
const VIRTUAL_LIST_HEIGHT = 360;

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
  const isSearchable = !!category.searchable;
  const { allOption } = category;

  const clearButtonSize = slotProps?.clearButtonSize ?? 'medium';
  const searchSize = slotProps?.searchSize ?? 'medium';
  const listSpacing = slotProps?.listSpacing ?? 2;
  const onBack = slotProps?.onBack;

  const isAllSelected = !!(allOption && value.includes(allOption.value));

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

  const handleToggleAll = () => {
    if (!category.onChange || !allOption) {
      return;
    }
    category.onChange(isAllSelected ? [] : [allOption.value]);
  };

  const handleToggle = (optionValue: TValue) => {
    if (!category.onChange) {
      return;
    }
    const withoutAll = allOption
      ? value.filter((v) => v !== allOption.value)
      : value;
    const isSelected = withoutAll.includes(optionValue);
    category.onChange(
      isSelected
        ? withoutAll.filter((v) => v !== optionValue)
        : [...withoutAll, optionValue],
    );
  };

  const handleClear = () => {
    if (category.onChange) {
      category.onChange([]);
    }
  };

  const isValueSelected = value.length > 0;

  const shouldVirtualize = filteredOptions.length > VIRTUAL_THRESHOLD;
  const listRef = useRef<HTMLUListElement>(null);

  const virtualizer = useVirtualizer({
    count: shouldVirtualize ? filteredOptions.length : 0,
    getScrollElement: () => listRef.current,
    estimateSize: () => 48,
    measureElement: (el: Element | null) =>
      el?.getBoundingClientRect().height ?? 48,
    overscan: 5,
  });

  return (
    <Stack
      direction="column"
      sx={{
        width: '100%',
        gap: 2,
      }}
    >
      <StyledMultiSelectFiltersContainer sx={{ padding: 0, marginBottom: 0 }}>
        {onBack && (
          <IconButton size="small" onClick={onBack} sx={{ mr: 0.5, p: 0.5 }}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>
        )}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            minWidth: 0,
          }}
        >
          <Typography variant="bodyMediumStrong" noWrap sx={{ minWidth: 0 }}>
            {t('earn.filter.selected', { count: value.length })}
          </Typography>
          {slotProps?.header}
        </Box>
        <StyledMultiSelectFiltersClearButton
          disabled={!isValueSelected}
          size={clearButtonSize}
          data-testid={`${category.testId}-clear-button`}
          onClick={handleClear}
        >
          {t('earn.filter.clear')}
        </StyledMultiSelectFiltersClearButton>
      </StyledMultiSelectFiltersContainer>

      {slotProps?.tabs}

      {allOption && (
        <Box>
          <Button
            size={Size.SM}
            variant={isAllSelected ? Variant.Primary : Variant.AlphaDark}
            startAdornment={allOption.startAdornment}
            endAdornment={isAllSelected ? <CheckIcon /> : undefined}
            onClick={handleToggleAll}
          >
            {allOption.label}
          </Button>
        </Box>
      )}

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
        ref={listRef}
        disablePadding
        sx={mergeSx(
          {
            flex: 1,
            overflowY: 'auto',
            ...(shouldVirtualize
              ? { height: VIRTUAL_LIST_HEIGHT }
              : { display: 'flex', flexDirection: 'column', gap: listSpacing }),
          },
          slotProps?.listSx,
        )}
      >
        {shouldVirtualize ? (
          <Box
            sx={{
              height: virtualizer.getTotalSize(),
              position: 'relative',
              width: '100%',
            }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const option = filteredOptions[virtualRow.index];
              const isSelected = value.includes(option.value);
              return (
                <StyledMenuItem
                  ref={virtualizer.measureElement}
                  data-index={virtualRow.index}
                  size="medium"
                  disableRipple
                  key={option.value.toString()}
                  value={option.value}
                  sx={mergeSx(option.sx, slotProps?.itemSx, {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  })}
                  onClick={() => handleToggle(option.value)}
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
                  {isSelected && <CheckIcon sx={{ marginLeft: 'auto' }} />}
                </StyledMenuItem>
              );
            })}
          </Box>
        ) : (
          filteredOptions.map((option) => {
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
                  {option.startAdornment ?? option.icon}
                  <SelectorLabel
                    label={option.label}
                    labelVariant="bodyMedium"
                    size="medium"
                  />
                  {option.endAdornment}
                </StyledMenuItemContentContainer>
                {isSelected && <CheckIcon sx={{ marginLeft: 'auto' }} />}
              </StyledMenuItem>
            );
          })
        )}
      </MenuList>
    </Stack>
  );
};
