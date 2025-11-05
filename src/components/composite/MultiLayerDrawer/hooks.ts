import { useState, useCallback, useMemo, useEffect } from 'react';
import { isEqual } from 'lodash';

export interface PendingFilterState<T = any> {
  [key: string]: T;
}

export interface UsePendingFiltersResult<T extends PendingFilterState> {
  pendingValues: T;
  setPendingValue: <K extends keyof T>(key: K, value: T[K]) => void;
  resetPending: () => void;
  applyFilters: () => void;
  clearAll: () => void;
  hasPendingFiltersApplied: boolean;
}

export interface UsePendingFiltersOptions<T extends PendingFilterState> {
  initialValues: T;
  onApply: (values: T) => void;
  onClear?: () => void;
  isFilterApplied?: (values: T) => boolean;
}

export const usePendingFilters = <T extends PendingFilterState>({
  initialValues,
  onApply,
  onClear,
  isFilterApplied,
}: UsePendingFiltersOptions<T>): UsePendingFiltersResult<T> => {
  const [pendingValues, setPendingValues] = useState<T>(initialValues);

  const setPendingValue = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setPendingValues((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  const resetPending = useCallback(() => {
    setPendingValues(initialValues);
  }, [initialValues]);

  const applyFilters = useCallback(() => {
    const values = { ...pendingValues };
    onApply(values);
  }, [pendingValues, onApply]);

  const clearAll = useCallback(() => {
    onClear?.();
  }, [onClear]);

  const hasPendingFiltersApplied = useMemo(() => {
    if (isFilterApplied) {
      return isFilterApplied(pendingValues);
    }
    return !isEqual(pendingValues, initialValues);
  }, [pendingValues, initialValues, isFilterApplied]);

  return {
    pendingValues,
    setPendingValue,
    resetPending,
    applyFilters,
    clearAll,
    hasPendingFiltersApplied,
  };
};
