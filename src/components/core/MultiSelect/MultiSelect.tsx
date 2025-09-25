import CheckIcon from '@mui/icons-material/Check';
import ListItemText from '@mui/material/ListItemText';
import { FC } from 'react';
import {
  ChipContainer,
  IconWrapper,
  StyledChip,
  StyledFormControl,
  StyledFormHelperText,
  StyledMenuItem,
  StyledSelect,
} from './MultiSelect.styles';
import { MultiSelectProps } from './MultiSelect.types';

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
  multiple = true,
  renderValue: customRenderValue,
  maxHeight = 300,
  show = 'chips',
  maxChips = 3,
  'data-testid': dataTestId,
}) => {
  const handleChange = (event: any) => {
    if (onChange) {
      if (multiple === false) {
        // For single select, wrap the single value in an array
        const singleValue = event.target.value as string;
        onChange(singleValue ? [singleValue] : []);
      } else {
        // For multi select, pass the array as-is
        const selectedValues = event.target.value as string[];
        onChange(selectedValues);
      }
    }
  };

  const handleDelete = (chipValue: string) => {
    if (onChange) {
      onChange(value.filter((v) => v !== chipValue));
    }
  };

  const defaultRenderValue = (selected: unknown) => {
    const selectedArray = Array.isArray(selected) ? selected : [selected];

    if (!selectedArray || selectedArray.length === 0) {
      return (
        <span style={{ color: 'inherit', opacity: 0.6 }}>
          {placeholder || 'Select options'}
        </span>
      );
    }

    switch (show) {
      case 'chips':
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
                label={`+${selectedArray.length - maxChips}`}
                size="small"
              />
            )}
          </ChipContainer>
        );

      case 'count':
        return (
          <>
            <StyledChip label={`${selectedArray.length}`} size="small" />
            <span style={{ color: 'inherit', opacity: 0.6 }}>
              {placeholder || 'Select options'}
            </span>
          </>
        );

      case 'label':
      default:
        const selectedLabels = selectedArray.map((val) => {
          const option = options.find((opt) => opt.value === val);
          return option?.label || val;
        });
        return selectedLabels.join(', ');
    }
  };

  const renderValueFunction = customRenderValue || defaultRenderValue;

  return (
    <StyledFormControl
      fullWidth={fullWidth}
      size={size}
      error={error}
      disabled={disabled}
      variant={variant}
      required={required}
    >
      <StyledSelect
        labelId={label ? `${label}-multiselect-label` : undefined}
        multiple={multiple !== false}
        value={multiple === false ? value[0] || '' : value}
        onChange={handleChange}
        displayEmpty={true}
        renderValue={renderValueFunction}
        size={size}
        inputProps={{
          'aria-label': label || placeholder,
        }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: maxHeight,
              marginTop: 8,
            },
          },
        }}
        data-testid={dataTestId}
      >
        {options.map((option) => {
          const isSelected = value.indexOf(option.value) > -1;
          return (
            <StyledMenuItem key={option.value} value={option.value}>
              {option.icon && <IconWrapper>{option.icon}</IconWrapper>}
              <ListItemText primary={option.label} />
              {isSelected && (
                <CheckIcon
                  sx={{
                    marginLeft: 'auto',
                    fontSize: '1.2rem',
                    color: 'primary.main',
                  }}
                />
              )}
            </StyledMenuItem>
          );
        })}
      </StyledSelect>
      {helperText && (
        <StyledFormHelperText error={error}>{helperText}</StyledFormHelperText>
      )}
    </StyledFormControl>
  );
};
