import { createServerQueryClient } from '@/app/lib/createServerQueryClient';
import {
  fetchEarnFilterOpportunitiesForPage,
  fetchEarnTopOpportunitiesForPage,
} from '@/app/lib/earn/cachedEarnFetch';
import { EarnsPage } from '@/app/ui/earn/EarnsPage';
import { earnFilterOpportunitiesQueryKey } from '@/app/lib/earn/earnQueries';
import { earnTopOpportunitiesQueryKey } from '@/app/lib/earn/earnQueries';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export const EarnsPageContent = async () => {
  const queryClient = createServerQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: earnFilterOpportunitiesQueryKey({}),
      queryFn: () => fetchEarnFilterOpportunitiesForPage({}),
    }),
    queryClient.prefetchQuery({
      queryKey: earnTopOpportunitiesQueryKey(undefined),
      queryFn: () => fetchEarnTopOpportunitiesForPage(undefined),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EarnsPage />
    </HydrationBoundary>
  );
};
