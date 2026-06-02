import {
  pageMetadataFields,
  pageOpenGraph,
  pageTwitter,
} from '@/app/lib/metadata';
import { EarnsPage } from '@/app/ui/earn/EarnsPage';
import { EarnsPageSkeleton } from '@/app/ui/earn/EarnsPageSkeleton';
import { AppPaths, getSiteUrl } from '@/const/urls';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { earnFilterOpportunitiesQueryKey } from '@/hooks/earn/useEarnFilterOpportunities';
import { getOpportunitiesFilteredCached } from '@/app/lib/getOpportunitiesFiltered';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const revalidate = 300;

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
    queryFn: () => getOpportunitiesFilteredCached({}),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<EarnsPageSkeleton />}>
        <EarnsPage />
      </Suspense>
    </HydrationBoundary>
  );
}
