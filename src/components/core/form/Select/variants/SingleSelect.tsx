import { SingleSelectProps } from '../Select.types';
import { SelectBase } from '../components/SelectBase';
import { useSelect } from '../hooks';
import { SelectorLabel } from '../components/SelectLabel';
import { useEffect, useMemo } from 'react';

export const SingleSelect = <T extends string>({
  value: initialValue,
  label: initialLabel,
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

  const label =
    rest.options.find((option) => option.value === value)?.label ||
    initialLabel ||
    '';

  return (
    <SelectBase
      {...rest}
      value={value}
      onChange={handleChange}
      multiple={false}
      selectorContent={<SelectorLabel label={label} />}
    />
  );
};
