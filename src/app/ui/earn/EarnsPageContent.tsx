import {
  fetchEarnFilterOpportunitiesForPage,
  fetchEarnTopOpportunitiesForPage,
} from '@/app/lib/earn/cachedEarnFetch';
import { EarnsPage } from '@/app/ui/earn/EarnsPage';
import { earnFilterOpportunitiesQueryKey } from '@/app/lib/earn/earnQueries';
import { earnTopOpportunitiesQueryKey } from '@/app/lib/earn/earnQueries';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { makeQueryClient } from '@/app/lib/makeQueryClient';

export const EarnsPageContent = async () => {
  const queryClient = makeQueryClient();

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
