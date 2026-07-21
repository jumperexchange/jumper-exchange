import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import type { AutocompleteRenderGroupParams } from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import type { SxProps, Theme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from '@/components/Badge/Badge.styles';
import type { EarnSearchSuggestionOption } from '@/hooks/earn/useEarnSearchSuggestions';
import { useEarnSearchSuggestions } from '@/hooks/earn/useEarnSearchSuggestions';
import { filterSearchOptions } from '@/hooks/earn/useEarnSearchSuggestions.helpers';
import {
  StyledAutocomplete,
  StyledGroupHeader,
  StyledGroupList,
  StyledOptionLabel,
  StyledOptionRow,
  StyledTagContent,
} from './EarnSearchAutocomplete.styles';

const INPUT_ID = 'earn-search';

export interface EarnSearchAutocompleteProps {
  sx?: SxProps<Theme>;
}

const isOptionEqualToValue = (
  option: EarnSearchSuggestionOption,
  value: EarnSearchSuggestionOption,
) => option.category === value.category && option.value === value.value;

export const EarnSearchAutocomplete: FC<EarnSearchAutocompleteProps> = ({
  sx,
}) => {
  const { t } = useTranslation();
  const { options, value, categoryLabels, onChange } =
    useEarnSearchSuggestions();

  const renderGroup = (params: AutocompleteRenderGroupParams) => (
    <li key={params.key}>
      <StyledGroupHeader variant="bodyXXSmallStrong">
        {categoryLabels[params.group as keyof typeof categoryLabels] ??
          params.group}
      </StyledGroupHeader>
      <StyledGroupList>{params.children}</StyledGroupList>
    </li>
  );

  return (
    <StyledAutocomplete
      multiple
      disableCloseOnSelect
      options={options}
      value={value}
      onChange={(_event, selected) => onChange(selected)}
      getOptionLabel={(option) => option.label}
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
          return (
            <Chip
              key={key}
              {...itemProps}
              size="small"
              label={
                <StyledTagContent>
                  {option.label}
                  <Badge
                    variant={BadgeVariant.Secondary}
                    size={BadgeSize.XS}
                    label={categoryLabels[option.category]}
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
          placeholder={
            value.length
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
