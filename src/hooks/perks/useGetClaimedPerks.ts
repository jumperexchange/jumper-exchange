import type { QueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import config from '@/config/env-config';
import { ONE_HOUR_MS } from 'src/const/time';
import type {
  HttpResponse,
  PerkClaimResponseDto,
} from 'src/types/jumper-backend';
import type { PerksDataAttributes } from 'src/types/strapi';

type ClaimedPerksResult = HttpResponse<PerkClaimResponseDto[], unknown>;

const QUERY_KEY = ['perks', 'claimed'];

// Matches a perk against the backend's claimed list. Claims reference perks by
// their Strapi `documentId`, with a fallback to the numeric id for safety.
export const isClaimedPerk = (
  perk: PerksDataAttributes,
  claimedIds: Set<string>,
) => claimedIds.has(perk.documentId) || claimedIds.has(String(perk.id));

export async function getClaimedPerksQuery(
  address: string,
  shouldBustCache?: boolean,
) {
  const apiBaseUrl = config.NEXT_PUBLIC_BACKEND_URL;
  const res = await fetch(
    `${apiBaseUrl}/perks/claimed/address/${address}${shouldBustCache ? `?cacheBust=${Date.now()}` : ''}`,
  );

  if (!res.ok) {
    throw new Error('Network error');
  }

  const jsonResponse: ClaimedPerksResult = await res.json();

  if (!jsonResponse) {
    throw new Error('No data found');
  }

  return jsonResponse.data;
}

export const updateClaimedPerksQueryCache = async (
  queryClient: QueryClient,
  address: string,
) => {
  try {
    // Fetch fresh data with cache-busting
    const updatedData = await getClaimedPerksQuery(address, true);

    // Update the React Query cache with fresh data
    queryClient.setQueryData([...QUERY_KEY, address], updatedData);
  } catch (error) {
    console.error('Failed to refetch with cache-busting:', error);
  }
};

export const useGetClaimedPerks = (address?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEY, address!],
    queryFn: () => getClaimedPerksQuery(address!, true),
    enabled: !!address,
    refetchInterval: ONE_HOUR_MS,
  });
};
