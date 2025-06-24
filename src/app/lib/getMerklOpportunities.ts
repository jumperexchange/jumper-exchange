import * as Sentry from '@sentry/nextjs';
import { merklApi } from 'src/utils/merkl/merklApi';

// Infer types from the API
type MerklOpportunitesApiResponse = Awaited<
  ReturnType<typeof merklApi.opportunities.get>
>;

type MerklOpportunitiesResponse = NonNullable<
  MerklOpportunitesApiResponse['data']
>;
export type MerklOpportunity = NonNullable<MerklOpportunitiesResponse[0]>;

interface GetMerklOpportunitiesProps {
  campaignId?: string;
  chainIds?: string[];
  searchQueries?: string[];
}

interface FetchOpportunitiesParams {
  chainId?: string;
  search?: string;
  campaignId?: string;
}

async function fetchOpportunities(
  params: FetchOpportunitiesParams,
): Promise<MerklOpportunity[]> {
  try {
    const response = await merklApi.opportunities.get({
      query: {
        ...params,
      },
    });

    if (response.data && Array.isArray(response.data)) {
      return response.data.filter(Boolean) as MerklOpportunity[];
    }
    return [];
  } catch (error) {
    const paramString = Object.entries(params)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
    Sentry.withScope((scope) => {
      scope.setExtra('params', paramString);
      Sentry.captureException(error);
    });
    console.error(`Error fetching opportunities for ${paramString}:`, error);
    return [];
  }
}

export async function getMerklOpportunities({
  campaignId,
  chainIds,
  searchQueries,
}: GetMerklOpportunitiesProps): Promise<MerklOpportunity[]> {
  // Early return if no valid search criteria
  if (!chainIds?.length && !searchQueries?.length && !campaignId) {
    return [];
  }

  const allOpportunities: MerklOpportunity[] = [];

  // Handle campaign-specific query first (highest priority)
  if (campaignId) {
    const opportunities = await fetchOpportunities({ campaignId });
    return opportunities;
  }

  // Handle chain-specific queries
  if (chainIds?.length) {
    for (const chainId of chainIds) {
      // If search queries exist, combine them with chain queries
      if (searchQueries?.length) {
        for (const search of searchQueries) {
          const opportunities = await fetchOpportunities({ chainId, search });
          allOpportunities.push(...opportunities);
        }
      } else {
        // Just fetch chain opportunities
        const opportunities = await fetchOpportunities({ chainId });
        allOpportunities.push(...opportunities);
      }
    }
  }
  // Handle search-only queries if no chains specified
  else if (searchQueries?.length) {
    for (const search of searchQueries) {
      const opportunities = await fetchOpportunities({ search });
      allOpportunities.push(...opportunities);
    }
  }

  return allOpportunities;
}
