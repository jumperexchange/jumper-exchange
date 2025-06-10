import { MerklOpportunity } from 'src/app/lib/getMerklOpportunities';

// this filters out duplicate opportunities
export const filterUniqueByIdentifier = (
  array: MerklOpportunity[],
): MerklOpportunity[] => {
  return array.reduce<MerklOpportunity[]>((acc, item) => {
    if (!item.identifier) {
      acc.push(item);
      return acc;
    }
    const exists = acc.some(
      (existing) => existing.identifier === item.identifier,
    );
    if (!exists) acc.push(item);
    return acc;
  }, []);
};

export const calculateMaxApy = (opportunities: MerklOpportunity[]): number => {
  let currentMax = 0;
  for (const opportunity of opportunities) {
    if (!opportunity?.aprRecord) continue;
    for (const breakdown of opportunity.aprRecord.breakdowns) {
      if (breakdown.value > currentMax) {
        currentMax = breakdown.value;
      }
    }
  }
  return currentMax;
};

export const sanitizeSearchQuery = (query: string): string => {
  // If the query contains an underscore, it's likely a chainId_identifier format
  // We only want the identifier part for the search
  return query.includes('_') ? query.split('_')[1] : query;
};
