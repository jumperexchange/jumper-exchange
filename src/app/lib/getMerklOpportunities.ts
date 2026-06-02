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

const formatFetchParams = (params: FetchOpportunitiesParams): string =>
  Object.entries(params)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');

async function fetchOpportunities(
  params: FetchOpportunitiesParams,
): Promise<MerklOpportunity[]> {
  const paramString = formatFetchParams(params);

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
    withScope((scope) => {
      scope.setExtra('params', paramString);
      captureException(error);
    });
    console.error(`Error fetching opportunities for ${paramString}:`, error);
    throw error;
  }
}

const reportPartialFetchFailures = (failures: unknown[]): void => {
  for (const error of failures) {
    withScope((scope) => {
      scope.setExtra('partialFailure', true);
      captureException(error);
    });
    console.error('Partial Merkl opportunities fetch failure:', error);
  }
};

/**
 * Runs parallel fetches; returns merged successes. Throws when every fetch fails
 * so unstable_cache does not persist transient upstream errors as [].
 */
async function fetchOpportunitiesSettled(
  fetches: Promise<MerklOpportunity[]>[],
): Promise<MerklOpportunity[]> {
  if (fetches.length === 0) {
    return [];
  }

  const results = await Promise.allSettled(fetches);
  const successes: MerklOpportunity[] = [];
  const failures: unknown[] = [];

  for (const result of results) {
    if (result.status === 'fulfilled') {
      successes.push(...result.value);
      continue;
    }
    failures.push(result.reason);
  }

  if (failures.length > 0) {
    reportPartialFetchFailures(failures);
  }

  if (successes.length === 0 && failures.length > 0) {
    throw failures[0];
  }

  return successes;
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

  // Handle campaign-specific query first (highest priority)
  if (campaignId) {
    return fetchOpportunities({ campaignId });
  }

  // Handle chain-specific queries
  if (chainIds?.length) {
    if (searchQueries?.length) {
      return fetchOpportunitiesSettled(
        chainIds.flatMap((chainId) =>
          searchQueries.map((search) =>
            fetchOpportunities({ chainId, search }),
          ),
        ),
      );
    }

    return fetchOpportunitiesSettled(
      chainIds.map((chainId) => fetchOpportunities({ chainId })),
    );
  }

  // Handle search-only queries if no chains specified
  if (searchQueries?.length) {
    return fetchOpportunitiesSettled(
      searchQueries.map((search) => fetchOpportunities({ search })),
    );
  }

  return [];
}

export const getMerklOpportunitiesCached = unstable_cache(
  getMerklOpportunities,
  ['merkl-opportunities'],
  { revalidate: MERKL_STALE_TIME / 1000 },
);
