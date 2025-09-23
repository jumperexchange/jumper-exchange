import { useCallback, useState } from 'react';
import { TData } from './Select.types';
import { SelectChangeEvent } from '@mui/material/Select';

export const useSelect = <T extends TData>(
  initialValue: T,
  onChange?: (value: T) => void,
  multiple?: boolean,
) => {
  const [value, setValue] = useState<T>(initialValue);
  const handleChange = useCallback(
    (event: SelectChangeEvent<unknown>) => {
      const {
        target: { value: newValue },
      } = event;

      if (multiple) {
        const newValueArray =
          typeof newValue === 'string' ? newValue.split(',') : newValue;
        setValue(newValueArray as unknown as T);
        onChange?.(newValueArray as unknown as T);
      } else {
        const singleValue = Array.isArray(newValue)
          ? newValue[0] || ''
          : newValue;
        setValue(singleValue as unknown as T);
        onChange?.(singleValue as unknown as T);
      }
    },
    [onChange, multiple],
  );
  return { value, setValue, handleChange };
};
