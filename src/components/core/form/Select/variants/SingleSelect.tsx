import { SingleSelectProps } from '../Select.types';
import { SelectBase } from '../components/SelectBase';
import { useSelect } from '../hooks';
import { SelectorLabel } from '../components/SelectLabel';

export const SingleSelect = <T extends string>({
  value: initialValue,
  label: initialLabel,
  debounceMs,
  onChange,
  ...rest
}: SingleSelectProps<T>) => {
  const { value, handleChange } = useSelect(
    initialValue || (rest.options[0]?.value as T),
    onChange,
    debounceMs,
  );

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
