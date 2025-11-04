import { useState, useMemo, ChangeEvent } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { LeafCategory } from '../../MultiLayerDrawer.types';
import {
  StyledMultiSelectFiltersContainer,
  StyledMultiSelectFiltersClearButton,
  StyledMultiSelectFiltersInput,
  StyledMenuItem,
  StyledMenuItemContentContainer,
} from 'src/components/core/form/Select/Select.styles';
import { SelectorLabel } from 'src/components/core/form/Select/components/SelectLabel';
import { useTranslation } from 'react-i18next';

export interface MultiSelectViewProps {
  category: LeafCategory<string[]>;
}

/**
 * MultiSelectView - Renders a multi-select list with checkboxes
 *
 * Features:
 * - Shows selected count
 * - Clear button
 * - Optional search/filter
 * - Checkbox selection with checkmark
 */
export const MultiSelectView: React.FC<MultiSelectViewProps> = ({
  category,
}) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');

  const value = category.value || [];
  const options = category.options || [];
  const isSearchable = category.searchable !== false; // Default to true

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!searchValue) return options;
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

  const handleToggle = (optionValue: string) => {
    if (!category.onChange) return;

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
    <Stack direction="column" width="100%" gap={1}>
      {/* Header with count and clear button */}
      <StyledMultiSelectFiltersContainer>
        <Typography variant="bodyXSmallStrong">
          {t('earn.filter.selected', { count: value.length })}
        </Typography>
        <StyledMultiSelectFiltersClearButton
          disabled={!isValueSelected}
          size="small"
          data-testid={`${category.testId}-clear-button`}
          onClick={handleClear}
        >
          {t('earn.filter.clear')}
        </StyledMultiSelectFiltersClearButton>
      </StyledMultiSelectFiltersContainer>

      {/* Search input */}
      {isSearchable && (
        <StyledMultiSelectFiltersContainer
          sx={{ paddingX: 0 }}
          onKeyDown={(event) => {
            event.stopPropagation();
          }}
        >
          <StyledMultiSelectFiltersInput
            startAdornment={
              <SearchIcon
                sx={{
                  height: 20,
                  width: 20,
                }}
              />
            }
            endAdornment={
              searchValue && (
                <CloseIcon
                  sx={{
                    height: 20,
                    width: 20,
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

      {/* Options list */}
      <Stack direction="column" spacing={1} sx={{ flex: 1, overflowY: 'auto' }}>
        {filteredOptions.map((option) => {
          const isSelected = value.includes(option.value);

          return (
            <StyledMenuItem
              disableRipple
              key={option.value}
              value={option.value}
              sx={option.sx}
              onClick={() => handleToggle(option.value)}
            >
              <StyledMenuItemContentContainer>
                {option.icon}
                <SelectorLabel label={option.label} />
              </StyledMenuItemContentContainer>
              {isSelected && (
                <CheckIcon
                  sx={{
                    marginLeft: 'auto',
                    height: 16,
                    width: 16,
                  }}
                />
              )}
            </StyledMenuItem>
          );
        })}
      </Stack>
    </Stack>
  );
};
