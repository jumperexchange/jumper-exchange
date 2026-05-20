import {
  pageMetadataFields,
  pageOpenGraph,
  pageTwitter,
} from '@/app/lib/metadata';
import { EarnsPage, EarnsPageSkeleton } from '@/app/ui/earn';
import { AppPaths, getSiteUrl } from '@/const/urls';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import {
  earnFilterOpportunitiesQueryKey,
  fetchEarnFilterOpportunities,
} from '@/hooks/earn/useEarnFilterOpportunities';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: pageMetadataFields.earn.title,
  description: pageMetadataFields.earn.description,
  alternates: {
    canonical: `${getSiteUrl()}${AppPaths.Earn}`,
  },
  openGraph: {
    ...pageOpenGraph.earn,
    url: `${getSiteUrl()}${AppPaths.Earn}`,
  },
  twitter: {
    ...pageTwitter.earn,
  },
};

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: earnFilterOpportunitiesQueryKey({}),
    queryFn: () => fetchEarnFilterOpportunities({}),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<EarnsPageSkeleton />}>
        <EarnsPage />
      </Suspense>
    </HydrationBoundary>
  );
}
