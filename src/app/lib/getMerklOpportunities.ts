import { withScope, captureException } from '@sentry/nextjs';
import { unstable_cache } from 'next/cache';
import { MERKL_STALE_TIME, merklApi } from 'src/utils/merkl/merklApi';

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
    withScope((scope) => {
      scope.setExtra('params', paramString);
      captureException(error);
    });
    console.error(`Error fetching opportunities for ${paramString}:`, error);
    return [];
  }
}

async function getMerklOpportunitiesUncached({
  campaignId,
  chainIds,
  searchQueries,
}: GetMerklOpportunitiesProps): Promise<MerklOpportunity[]> {
  // Early return if no valid search criteria
  if (!chainIds?.length && !searchQueries?.length && !campaignId) {
    return [];
  }

  // Handle campaign-specific query first (highest priority)
  if (campaignId) {
    return fetchOpportunities({ campaignId });
  }

  // Handle chain-specific queries
  if (chainIds?.length) {
    if (searchQueries?.length) {
      const results = await Promise.all(
        chainIds.flatMap((chainId) =>
          searchQueries.map((search) =>
            fetchOpportunities({ chainId, search }),
          ),
        ),
      );
      return results.flat();
    }

    const results = await Promise.all(
      chainIds.map((chainId) => fetchOpportunities({ chainId })),
    );
    return results.flat();
  }

  // Handle search-only queries if no chains specified
  if (searchQueries?.length) {
    const results = await Promise.all(
      searchQueries.map((search) => fetchOpportunities({ search })),
    );
    return results.flat();
  }

  return [];
}

export const getMerklOpportunities = unstable_cache(
  getMerklOpportunitiesUncached,
  ['merkl-opportunities'],
  { revalidate: MERKL_STALE_TIME / 1000 },
);
