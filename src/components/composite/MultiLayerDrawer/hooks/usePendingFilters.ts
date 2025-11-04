import { useState, useCallback, useMemo } from 'react';

export interface PendingFilterState<T = any> {
  [key: string]: T;
}

export interface UsePendingFiltersResult<T extends PendingFilterState> {
  /** Current pending filter values (not yet applied) */
  pendingValues: T;
  /** Applied filter values (committed to parent) */
  appliedValues: T;
  /** Update a specific filter's pending value */
  setPendingValue: <K extends keyof T>(key: K, value: T[K]) => void;
  /** Reset all pending values to applied values (cancel changes) */
  resetPending: () => void;
  /** Apply all pending values (commit to parent) */
  applyFilters: () => void;
  /** Clear all filters (both pending and applied) */
  clearAll: () => void;
  /** Whether there are unapplied changes */
  hasUnappliedChanges: boolean;
  /** Whether any filters are currently applied */
  hasFiltersApplied: boolean;
}

export interface UsePendingFiltersOptions<T extends PendingFilterState> {
  /** Initial filter values */
  initialValues: T;
  /** Callback when filters are applied */
  onApply: (values: T) => void;
  /** Callback when filters are cleared */
  onClear?: () => void;
  /** Function to determine if filters are considered "applied" */
  isFilterApplied?: (values: T) => boolean;
}

/**
 * usePendingFilters - Hook for managing filter state with deferred application
 *
 * Useful for mobile filter UIs where users should be able to:
 * 1. Make multiple filter changes
 * 2. See the changes reflected in the UI
 * 3. Apply all changes at once (or cancel them)
 *
 * This prevents unnecessary API calls and re-renders during filter selection.
 *
 * @example
 * ```tsx
 * const { pendingValues, setPendingValue, applyFilters, hasUnappliedChanges } =
 *   usePendingFilters({
 *     initialValues: { chains: [], protocols: [], minAPY: 0 },
 *     onApply: (values) => updateFilter(values),
 *     isFilterApplied: (values) => values.chains.length > 0 || values.protocols.length > 0
 *   });
 *
 * // In UI: user selects filters
 * setPendingValue('chains', [1, 42, 137]);
 *
 * // When "Apply" button is pressed
 * applyFilters(); // This calls onApply with the pending values
 * ```
 */
export const usePendingFilters = <T extends PendingFilterState>({
  initialValues,
  onApply,
  onClear,
  isFilterApplied,
}: UsePendingFiltersOptions<T>): UsePendingFiltersResult<T> => {
  // Track applied values (what's currently active in parent)
  const [appliedValues, setAppliedValues] = useState<T>(initialValues);

  // Track pending values (local changes not yet applied)
  const [pendingValues, setPendingValues] = useState<T>(initialValues);

  // Update a specific filter's pending value
  const setPendingValue = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setPendingValues((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  // Reset pending values to applied values (cancel changes)
  const resetPending = useCallback(() => {
    setPendingValues(appliedValues);
  }, [appliedValues]);

  // Apply pending values to parent
  const applyFilters = useCallback(() => {
    setAppliedValues(pendingValues);
    onApply(pendingValues);
  }, [pendingValues, onApply]);

  // Clear all filters
  const clearAll = useCallback(() => {
    setPendingValues(initialValues);
    setAppliedValues(initialValues);
    onClear?.();
  }, [initialValues, onClear]);

  // Check if there are unapplied changes
  const hasUnappliedChanges = useMemo(() => {
    return JSON.stringify(pendingValues) !== JSON.stringify(appliedValues);
  }, [pendingValues, appliedValues]);

  // Check if any filters are applied
  const hasFiltersApplied = useMemo(() => {
    if (isFilterApplied) {
      return isFilterApplied(pendingValues);
    }
    // Default: compare with initial values
    return JSON.stringify(pendingValues) !== JSON.stringify(initialValues);
  }, [pendingValues, initialValues, isFilterApplied]);

  return {
    pendingValues,
    appliedValues,
    setPendingValue,
    resetPending,
    applyFilters,
    clearAll,
    hasUnappliedChanges,
    hasFiltersApplied,
  };
};
