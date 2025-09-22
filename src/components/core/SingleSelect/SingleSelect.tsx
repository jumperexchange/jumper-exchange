import { FC } from 'react';
import {
  StyledFormControl,
  StyledSelect,
  StyledMenuItem,
  StyledInputLabel,
  StyledFormHelperText,
  IconWrapper,
} from './SingleSelect.styles';
import { SingleSelectProps } from './SingleSelect.types';

export const SingleSelect: FC<SingleSelectProps> = ({
  options,
  value = '',
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
}) => {
  const handleChange = (event: any) => {
    if (onChange) {
      onChange(event.target.value as string);
    }
  };

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
        <StyledInputLabel id={`${label}-select-label`}>
          {label}
        </StyledInputLabel>
      )}
      <StyledSelect
        labelId={label ? `${label}-select-label` : undefined}
        value={value}
        onChange={handleChange}
        label={label}
        displayEmpty={!!placeholder}
        renderValue={(selected) => {
          if (!selected) {
            return <em>{placeholder}</em>;
          }
          const selectedOption = options.find((opt) => opt.value === selected);
          return (
            <>
              {selectedOption?.icon && (
                <IconWrapper>{selectedOption.icon}</IconWrapper>
              )}
              {selectedOption?.label || selected}
            </>
          );
        }}
      >
        {placeholder && (
          <StyledMenuItem value="" disabled>
            <em>{placeholder}</em>
          </StyledMenuItem>
        )}
        {options.map((option) => (
          <StyledMenuItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.icon && <IconWrapper>{option.icon}</IconWrapper>}
            {option.label}
          </StyledMenuItem>
        ))}
      </StyledSelect>
      {helperText && (
        <StyledFormHelperText error={error}>{helperText}</StyledFormHelperText>
      )}
    </StyledFormControl>
  );
};