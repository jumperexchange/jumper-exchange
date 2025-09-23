import { SingleSelectProps } from '../Select.types';
import { SelectBase } from './SelectBase';
import { useSelect } from '../hooks';

export const SingleSelect = <T extends string>({
  value: initialValue,
  onChange,
  ...rest
}: SingleSelectProps<T>) => {
  const { value, handleChange } = useSelect(initialValue ?? '', onChange);
  return (
    <SelectBase
      {...rest}
      value={value}
      onChange={handleChange}
      multiple={false}
    />
  );
};
