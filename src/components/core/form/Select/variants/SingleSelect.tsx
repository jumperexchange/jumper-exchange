import type { SingleSelectProps } from '../Select.types';
import { SelectBase } from '../components/SelectBase';
import { useSelect } from '../hooks';
import { SelectorLabel } from '../components/SelectLabel';
import { useEffect, useMemo } from 'react';

export const SingleSelect = <T extends string>({
  value: initialValue,
  label: initialLabel,
  title,
  labelStartAdornment,
  labelEndAdornment,
  labelIcon,
  debounceMs,
  onChange,
  ...rest
}: SingleSelectProps<T>) => {
  const defaultValue = useMemo(
    () => initialValue || (rest.options[0]?.value as T),
    [initialValue, rest.options],
  );

  const { value, setValue, handleChange } = useSelect(
    defaultValue,
    onChange,
    debounceMs,
  );

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const selectedOption = rest.options.find((option) => option.value === value);
  const label = selectedOption?.label || initialLabel || '';
  const startAdornment =
    labelStartAdornment ??
    selectedOption?.startAdornment ??
    labelIcon ??
    selectedOption?.icon;
  const endAdornment = labelEndAdornment ?? selectedOption?.endAdornment;

  return (
    <SelectBase
      {...rest}
      value={value}
      onChange={handleChange}
      multiple={false}
      selectorContent={
        <SelectorLabel
          label={label}
          startAdornment={startAdornment}
          endAdornment={endAdornment}
        />
      }
    />
  );
};
