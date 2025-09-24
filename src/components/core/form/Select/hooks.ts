import { useCallback, useState } from 'react';
import { TData } from './Select.types';
import { SelectChangeEvent } from '@mui/material/Select';
import { debounce } from 'lodash';

export const useSelect = <T extends TData>(
  initialValue: T,
  onChange?: (value: T) => void,
  debounceMs: number = 500,
  multiple?: boolean,
) => {
  const [value, setValue] = useState<T>(initialValue);

  const handleDebounceChange = useCallback(
    debounce((value: T) => {
      onChange?.(value);
    }, debounceMs),
    [onChange, debounceMs],
  );

  const handleChange = useCallback(
    (event: SelectChangeEvent<unknown>) => {
      const {
        target: { value: newValue },
      } = event;

      if (multiple) {
        const newValueArray =
          typeof newValue === 'string' ? newValue.split(',') : newValue;
        setValue(newValueArray as unknown as T);
        handleDebounceChange(newValueArray as unknown as T);
      } else {
        const singleValue = Array.isArray(newValue)
          ? newValue[0] || ''
          : newValue;
        setValue(singleValue as unknown as T);
        handleDebounceChange(singleValue as unknown as T);
      }
    },
    [handleDebounceChange, multiple],
  );
  return {
    value,
    setValue,
    handleChange,
    handleDebounceChange,
  };
};
