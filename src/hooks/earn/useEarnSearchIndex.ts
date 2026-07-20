import { useMemo } from 'react';
import { useChains } from '@/hooks/useChains';
import type { EarnOpportunityWithLatestAnalytics } from '@/types/jumper-backend';
import {
  buildEarnSearchIndex,
  type EarnSearchIndex,
} from 'src/app/ui/earn/searchOpportunities';

// Building a lunr index is expensive relative to a render, so this is kept
// memoized on the dataset identity rather than left to the React Compiler.
export const useEarnSearchIndex = (
  items: EarnOpportunityWithLatestAnalytics[],
): EarnSearchIndex => {
  const { getChainById } = useChains();

  return useMemo(
    () => buildEarnSearchIndex(items, getChainById),
    [items, getChainById],
  );
};
