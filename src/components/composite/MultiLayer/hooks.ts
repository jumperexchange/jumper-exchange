import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { isEqual } from 'lodash';
import type { CategoryConfig, LeafCategory } from './MultiLayer.types';
import { hasSubcategories, isLeafCategory } from './MultiLayer.types';

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
  const prevInitialValuesRef = useRef<T>(initialValues);

  useEffect(() => {
    if (isEqual(initialValues, prevInitialValuesRef.current)) {
      return;
    }
    setPendingValues(initialValues);
    prevInitialValuesRef.current = initialValues;
  }, [initialValues]);

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

export const useMultiLayerNavigation = (categories: CategoryConfig[]) => {
  const [navigationPath, setNavigationPath] = useState<number[]>([]);

  const isRootLevel = navigationPath.length === 0;

  const { currentCategories, breadcrumbLabel } = useMemo(() => {
    if (navigationPath.length === 0) {
      return { currentCategories: categories, breadcrumbLabel: '' };
    }

    let current: CategoryConfig[] = categories;
    let label = '';

    for (let i = 0; i < navigationPath.length; i++) {
      const index = navigationPath[i];
      const category = current[index];

      if (!category) {
        return { currentCategories: categories, breadcrumbLabel: '' };
      }

      label = category.label;

      if (hasSubcategories(category)) {
        current = category.subcategories;
      } else if (isLeafCategory(category)) {
        return { currentCategories: [category], breadcrumbLabel: label };
      }
    }

    return { currentCategories: current, breadcrumbLabel: label };
  }, [categories, navigationPath]);

  const currentLeafCategory =
    currentCategories.length === 1 && isLeafCategory(currentCategories[0])
      ? (currentCategories[0] as LeafCategory<unknown>)
      : null;

  const navigateTo = (categoryIndex: number) => {
    const category = currentCategories[categoryIndex];
    if (!category) {
      return;
    }

    if (hasSubcategories(category) || isLeafCategory(category)) {
      setNavigationPath((prev) => [...prev, categoryIndex]);
    }
  };

  const goBack = () => {
    if (!isRootLevel) {
      setNavigationPath((prev) => prev.slice(0, -1));
    }
  };

  const reset = () => setNavigationPath([]);

  return {
    navigationPath,
    isRootLevel,
    currentCategories,
    breadcrumbLabel,
    currentLeafCategory,
    navigateTo,
    goBack,
    reset,
  };
};
