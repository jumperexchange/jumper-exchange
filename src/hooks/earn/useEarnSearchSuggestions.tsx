import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useEarnFiltering } from '@/app/ui/earn/EarnFilteringContext';
import { ChainStack } from '@/components/composite/ChainStack/ChainStack';
import { ProtocolStack } from '@/components/composite/ProtocolStack/ProtocolStack';
import { useChains } from '@/hooks/useChains';
import { capitalizeString } from '@/utils/capitalizeString';
import { getChainName } from '@/utils/chains/getChainName';
import { sortSelectOptions } from '@/utils/sortSelectOptions';
import {
  buildSelectedOptions,
  EarnSearchCategory,
  type EarnSearchCategoryEnum,
  type EarnSearchOption,
  partitionSelectedOptions,
} from './useEarnSearchSuggestions.helpers';

export interface EarnSearchSuggestionOption extends EarnSearchOption {
  icon?: ReactNode;
}

export interface UseEarnSearchSuggestionsResult {
  options: EarnSearchSuggestionOption[];
  value: EarnSearchSuggestionOption[];
  categoryLabels: Record<EarnSearchCategoryEnum, string>;
  searchText: string;
  setSearchText: (text: string) => void;
  onChange: (selected: (EarnSearchSuggestionOption | string)[]) => void;
}

// Thin, single-purpose view over EarnFilteringContext, mirroring
// useEarnFilterBar: builds the flat, tagged option list the autocomplete
// renders and translates selections back into the structured filter.
export const useEarnSearchSuggestions = (): UseEarnSearchSuggestionsResult => {
  const { t } = useTranslation();
  const { allChains, allProtocols, availablePools, filter, updateFilter } =
    useEarnFiltering();
  const { getChainById } = useChains();

  const poolOptions = useMemo<EarnSearchSuggestionOption[]>(
    () =>
      sortSelectOptions(
        availablePools.map((pool) => ({
          category: EarnSearchCategory.Pool,
          value: pool.slug,
          label: pool.name,
        })),
      ),
    [availablePools],
  );

  const chainOptions = useMemo<EarnSearchSuggestionOption[]>(
    () =>
      sortSelectOptions(
        allChains.map((chain) => ({
          category: EarnSearchCategory.Chain,
          value: `${chain.chainId}`,
          label: getChainName(chain, getChainById),
          icon: <ChainStack chainIds={[chain.chainId.toString()]} />,
        })),
      ),
    [allChains, getChainById],
  );

  const protocolOptions = useMemo<EarnSearchSuggestionOption[]>(
    () =>
      sortSelectOptions(
        allProtocols.map((protocol) => ({
          category: EarnSearchCategory.Protocol,
          value: protocol.name,
          label: capitalizeString(protocol.name),
          icon: <ProtocolStack protocols={[protocol]} />,
        })),
      ),
    [allProtocols],
  );

  // Order matters: options must stay grouped by category for MUI
  // Autocomplete's `groupBy` to render a single header per group.
  const options = useMemo(
    () => [...poolOptions, ...chainOptions, ...protocolOptions],
    [poolOptions, chainOptions, protocolOptions],
  );

  const value = useMemo(
    () => buildSelectedOptions(options, filter),
    [options, filter],
  );

  const categoryLabels = useMemo<Record<EarnSearchCategoryEnum, string>>(
    () => ({
      [EarnSearchCategory.Pool]: t(
        'earn.filter.searchAutocomplete.category.pool',
      ),
      [EarnSearchCategory.Chain]: t(
        'earn.filter.searchAutocomplete.category.chain',
      ),
      [EarnSearchCategory.Protocol]: t(
        'earn.filter.searchAutocomplete.category.protocol',
      ),
    }),
    [t],
  );

  const searchText = filter.search ?? '';

  const setSearchText = (text: string) => {
    updateFilter({ search: text.trim() ? text : null });
  };

  // `selected` mixes structured suggestions with, at most, one free-solo
  // string (the committed search chip); partitionSelectedOptions splits
  // both back into the filter fields the rest of the context understands.
  const onChange = (selected: (EarnSearchSuggestionOption | string)[]) => {
    updateFilter(partitionSelectedOptions(selected));
  };

  return {
    options,
    value,
    categoryLabels,
    searchText,
    setSearchText,
    onChange,
  };
};
