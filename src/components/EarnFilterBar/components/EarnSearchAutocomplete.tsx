import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import type { AutocompleteRenderGroupParams } from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import type { SxProps, Theme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from '@/components/Badge/Badge.styles';
import type { EarnSearchSuggestionOption } from '@/hooks/earn/useEarnSearchSuggestions';
import { useEarnSearchSuggestions } from '@/hooks/earn/useEarnSearchSuggestions';
import {
  filterSearchOptions,
  getHiddenCountByCategory,
} from '@/hooks/earn/useEarnSearchSuggestions.helpers';
import {
  StyledAutocomplete,
  StyledGroupHeader,
  StyledGroupList,
  StyledGroupMoreCount,
  StyledOptionLabel,
  StyledOptionRow,
  StyledTagContent,
} from './EarnSearchAutocomplete.styles';

const INPUT_ID = 'earn-search';

export interface EarnSearchAutocompleteProps {
  sx?: SxProps<Theme>;
}

// `value` may be the committed free-solo search chip (a plain string)
// instead of a structured option, so it never equals a dropdown option.
const isOptionEqualToValue = (
  option: EarnSearchSuggestionOption,
  value: EarnSearchSuggestionOption | string,
) =>
  typeof value !== 'string' &&
  option.category === value.category &&
  option.value === value.value;

const getOptionLabel = (option: EarnSearchSuggestionOption | string) =>
  typeof option === 'string' ? option : option.label;

export const EarnSearchAutocomplete: FC<EarnSearchAutocompleteProps> = ({
  sx,
}) => {
  const { t } = useTranslation();
  const {
    options,
    value,
    categoryLabels,
    searchText,
    setSearchText,
    onChange,
  } = useEarnSearchSuggestions();
  // Starts empty (not seeded from `searchText`) so a URL-loaded term renders
  // as a chip on load rather than as text sitting in the input box.
  const [inputValue, setInputValue] = useState('');
  const [focused, setFocused] = useState(false);

  const hiddenCountByCategory = useMemo(
    () => getHiddenCountByCategory(options, inputValue),
    [options, inputValue],
  );

  const renderGroup = (params: AutocompleteRenderGroupParams) => {
    const hiddenCount =
      hiddenCountByCategory[
        params.group as keyof typeof hiddenCountByCategory
      ] ?? 0;

    return (
      <li key={params.key}>
        <StyledGroupHeader>
          {categoryLabels[params.group as keyof typeof categoryLabels] ??
            params.group}
          {hiddenCount > 0 && (
            <StyledGroupMoreCount>
              {t('earn.filter.searchAutocomplete.moreCount', {
                count: hiddenCount,
              })}
            </StyledGroupMoreCount>
          )}
        </StyledGroupHeader>
        <StyledGroupList>{params.children}</StyledGroupList>
      </li>
    );
  };

  // The committed search term only renders as a chip while the box is
  // empty; otherwise it would show up twice (as a chip and as typed text).
  const showSearchChip =
    searchText.trim().length > 0 && inputValue.trim().length === 0;
  const displayValue = showSearchChip ? [...value, searchText] : value;

  return (
    <StyledAutocomplete
      multiple
      freeSolo
      disableCloseOnSelect
      open={focused && inputValue.trim().length > 0}
      inputValue={inputValue}
      onInputChange={(_event, newInputValue, reason) => {
        setInputValue(newInputValue);
        // Live-filter as the user types; 'reset' fires after a chip is
        // picked/committed/removed, where `onChange` already owns the term.
        if (reason === 'input') {
          setSearchText(newInputValue);
        } else if (reason === 'clear') {
          setSearchText('');
        }
      }}
      options={options}
      value={displayValue}
      onChange={(_event, selected) => onChange(selected)}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      groupBy={(option) => option.category}
      renderGroup={renderGroup}
      filterOptions={(opts, state) =>
        filterSearchOptions(opts, state.inputValue)
      }
      popupIcon={null}
      clearIcon={<ClearIcon sx={{ height: 18, width: 18 }} />}
      noOptionsText={t('earn.filter.searchAutocomplete.noOptions')}
      data-testid="earn-search-autocomplete"
      sx={sx}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            <StyledOptionRow>
              {option.icon}
              <StyledOptionLabel variant="bodySmall">
                {option.label}
              </StyledOptionLabel>
              <Badge
                variant={BadgeVariant.Secondary}
                size={BadgeSize.XS}
                label={categoryLabels[option.category]}
              />
            </StyledOptionRow>
          </li>
        );
      }}
      renderValue={(tagValue, getItemProps) =>
        tagValue.map((option, index) => {
          const { key, ...itemProps } = getItemProps({ index });
          const isSearchChip = typeof option === 'string';
          return (
            <Chip
              key={key}
              {...itemProps}
              size="small"
              label={
                <StyledTagContent>
                  {isSearchChip ? option : option.label}
                  <Badge
                    variant={BadgeVariant.Secondary}
                    size={BadgeSize.XS}
                    label={
                      isSearchChip
                        ? t('earn.filter.searchAutocomplete.category.search')
                        : categoryLabels[option.category]
                    }
                  />
                </StyledTagContent>
              }
            />
          );
        })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          id={INPUT_ID}
          name={INPUT_ID}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            // The term is already live in `searchText`; clearing the box
            // is what reveals it as a chip.
            setInputValue('');
          }}
          placeholder={
            displayValue.length
              ? undefined
              : t('earn.filter.searchAutocomplete.placeholder')
          }
          slotProps={{
            ...params.slotProps,
            input: {
              ...params.slotProps.input,
              startAdornment: (
                <>
                  <SearchIcon sx={{ height: 20, width: 20 }} />
                  {params.slotProps.input.startAdornment}
                </>
              ),
            },
          }}
          data-testid="earn-search-field"
        />
      )}
    />
  );
};
