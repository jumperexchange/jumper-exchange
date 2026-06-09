import { createServerQueryClient } from '@/app/lib/createServerQueryClient';
import {
  fetchEarnOpportunityBySlugForPage,
  fetchEarnRelatedMarketsForPage,
} from '@/app/lib/earn/cachedEarnFetch';
import { EarnPage } from '@/app/ui/earn/EarnPage';
import { earnOpportunityBySlugQueryKey } from '@/app/lib/earn/earnQueries';
import { earnRelatedMarketsQueryKey } from '@/app/lib/earn/earnQueries';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

interface EarnPageContentProps {
  slug: string;
}

export const EarnPageContent = async ({ slug }: EarnPageContentProps) => {
  const queryClient = createServerQueryClient();

  const [opportunity] = await Promise.all([
    queryClient
      .fetchQuery({
        queryKey: earnOpportunityBySlugQueryKey(slug),
        queryFn: () => fetchEarnOpportunityBySlugForPage(slug),
      })
      .catch(() => null),
    queryClient.prefetchQuery({
      queryKey: earnRelatedMarketsQueryKey(slug),
      queryFn: () => fetchEarnRelatedMarketsForPage(slug),
    }),
  ]);

  if (!opportunity) {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EarnPage slug={slug} />
    </HydrationBoundary>
  );
};
