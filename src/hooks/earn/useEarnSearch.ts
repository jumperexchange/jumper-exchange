import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useEarnFiltering } from 'src/app/ui/earn/EarnFilteringContext';

const SEARCH_DEBOUNCE_MS = 150;

export interface UseEarnSearchResult {
  query: string;
  setQuery: (query: string) => void;
  clearSearch: () => void;
  isSearchActive: boolean;
}

// Thin, single-purpose view over EarnFilteringContext so search UI never
// needs to depend on the full filtering context shape. Keeps its own
// "display" value so typing feels instant while the (re-)filtering of the
// opportunities list, which is comparatively expensive, is debounced.
export const useEarnSearch = (): UseEarnSearchResult => {
  const {
    search,
    setSearch,
    clearSearch: clearContextSearch,
  } = useEarnFiltering();
  const [displayValue, setDisplayValue] = useState(search);

  // Keep in sync when search is reset externally, e.g. via clearFilters.
  useEffect(() => {
    setDisplayValue(search);
  }, [search]);

  const debouncedSetSearch = useMemo(
    () => debounce(setSearch, SEARCH_DEBOUNCE_MS),
    [setSearch],
  );

  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [debouncedSetSearch]);

  const setQuery = (query: string) => {
    setDisplayValue(query);
    debouncedSetSearch(query);
  };

  const clearSearch = () => {
    debouncedSetSearch.cancel();
    setDisplayValue('');
    clearContextSearch();
  };

  return {
    query: displayValue,
    setQuery,
    clearSearch,
    isSearchActive: displayValue.trim().length > 0,
  };
};
