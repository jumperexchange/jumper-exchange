import { FC, useCallback, useMemo } from 'react';
import { MultiSelect } from '../MultiSelect/MultiSelect';
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
  'data-testid': dataTestId,
}) => {
  const arrayValue = useMemo(() => (value ? [value] : []), [value]);

  const handleChange = useCallback(
    (values: string[]) => {
      if (onChange) {
        onChange(values[0] || '');
      }
    },
    [onChange],
  );

  return (
    <MultiSelect
      options={options}
      value={arrayValue}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      fullWidth={fullWidth}
      size={size}
      variant={variant}
      error={error}
      helperText={helperText}
      label={label}
      required={required}
      multiple={false}
      show="label"
      maxChips={1}
      data-testid={dataTestId}
    />
  );
};
