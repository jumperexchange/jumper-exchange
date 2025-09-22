import { FC } from 'react';
import {
  StyledFormControl,
  StyledSelect,
  StyledMenuItem,
  StyledInputLabel,
  StyledFormHelperText,
  StyledChip,
  ChipContainer,
  StyledCheckbox,
  IconWrapper,
  GroupHeader,
} from './MultiSelect.styles';
import { MultiSelectProps, MultiSelectOption } from './MultiSelect.types';
import ListItemText from '@mui/material/ListItemText';

export const MultiSelect: FC<MultiSelectProps> = ({
  options,
  value = [],
  onChange,
  placeholder,
  disabled = false,
  fullWidth = false,
  size = 'medium',
  variant = 'outlined',
  error = false,
  helperText,
  label,
  required = false,
  renderValue: customRenderValue,
  maxHeight = 300,
  showCheckbox = true,
  showChips = true,
  maxChips = 3,
}) => {
  const handleChange = (event: any) => {
    if (onChange) {
      const selectedValues = event.target.value as string[];
      onChange(selectedValues);
    }
  };

  const handleDelete = (chipValue: string) => {
    if (onChange) {
      onChange(value.filter((v) => v !== chipValue));
    }
  };

  const defaultRenderValue = (selected: unknown) => {
    const selectedArray = selected as string[];
    if (!selectedArray || selectedArray.length === 0) {
      return <em>{placeholder}</em>;
    }

    if (showChips) {
      return (
        <ChipContainer>
          {selectedArray.slice(0, maxChips).map((val) => {
            const option = options.find((opt) => opt.value === val);
            return (
              <StyledChip
                key={val}
                label={option?.label || val}
                size="small"
                onDelete={() => handleDelete(val)}
                onMouseDown={(event) => {
                  event.stopPropagation();
                }}
              />
            );
          })}
          {selectedArray.length > maxChips && (
            <StyledChip
              label={`+${selectedArray.length - maxChips} more`}
              size="small"
            />
          )}
        </ChipContainer>
      );
    }

    const selectedLabels = selectedArray.map((val) => {
      const option = options.find((opt) => opt.value === val);
      return option?.label || val;
    });
    return selectedLabels.join(', ');
  };

  const renderValueFunction = customRenderValue || defaultRenderValue;

  const groupedOptions = options.reduce(
    (acc, option) => {
      const group = option.group || '';
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(option);
      return acc;
    },
    {} as Record<string, MultiSelectOption[]>,
  );

  const hasGroups = Object.keys(groupedOptions).some((group) => group !== '');

  return (
    <StyledFormControl
      fullWidth={fullWidth}
      size={size === 'small' ? 'small' : 'medium'}
      error={error}
      disabled={disabled}
      variant={variant}
      required={required}
    >
      {label && (
        <StyledInputLabel id={`${label}-multiselect-label`}>
          {label}
        </StyledInputLabel>
      )}
      <StyledSelect
        labelId={label ? `${label}-multiselect-label` : undefined}
        multiple
        value={value}
        onChange={handleChange}
        label={label}
        displayEmpty={!!placeholder}
        renderValue={renderValueFunction}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: maxHeight,
            },
          },
        }}
      >
        {placeholder && value.length === 0 && (
          <StyledMenuItem value="" disabled>
            <em>{placeholder}</em>
          </StyledMenuItem>
        )}
        {hasGroups
          ? Object.entries(groupedOptions).map(([group, groupOptions]) => [
              group && (
                <GroupHeader key={`group-${group}`}>{group}</GroupHeader>
              ),
              ...groupOptions.map((option) => (
                <StyledMenuItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {showCheckbox && (
                    <StyledCheckbox
                      checked={value.indexOf(option.value) > -1}
                    />
                  )}
                  {option.icon && <IconWrapper>{option.icon}</IconWrapper>}
                  <ListItemText primary={option.label} />
                </StyledMenuItem>
              )),
            ])
          : options.map((option) => (
              <StyledMenuItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {showCheckbox && (
                  <StyledCheckbox checked={value.indexOf(option.value) > -1} />
                )}
                {option.icon && <IconWrapper>{option.icon}</IconWrapper>}
                <ListItemText primary={option.label} />
              </StyledMenuItem>
            ))}
      </StyledSelect>
      {helperText && (
        <StyledFormHelperText error={error}>{helperText}</StyledFormHelperText>
      )}
    </StyledFormControl>
  );
};
