import { QueryClient, useQuery } from '@tanstack/react-query';
import config from '@/config/env-config';
import { ONE_HOUR_MS } from 'src/const/time';
import { HttpResponse, PerkClaimEntity } from 'src/types/jumper-backend';

type ClaimedPerksResult = HttpResponse<PerkClaimEntity[], unknown>;

const QUERY_KEY = ['perks', 'claimed'];

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
