import {
  pageMetadataFields,
  pageOpenGraph,
  pageTwitter,
} from '@/app/lib/metadata';
import { getOpportunitiesFiltered } from '@/app/lib/getOpportunitiesFiltered';
import { EarnPage } from '@/app/ui/earn/EarnPage';
import { EarnPageSkeleton } from '@/app/ui/earn/EarnPageSkeleton';
import { AppPaths, getSiteUrl } from '@/const/urls';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next/types';
import { Suspense } from 'react';
import envConfig from '@/config/env-config';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import {
  earnOpportunityBySlugQueryKey,
  fetchEarnOpportunityBySlug,
} from 'src/hooks/earn/useEarnOpportunityBySlug';
import {
  earnRelatedMarketsQueryKey,
  fetchEarnRelatedMarkets,
} from 'src/hooks/earn/useEarnRelatedMarkets';

type Params = Promise<{ slug: string }>;

export const dynamicParams = true;
export const revalidate = 300;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  if (envConfig.NEXT_PUBLIC_ENVIRONMENT !== 'production') {
    return [];
  }
  const res = await getOpportunitiesFiltered({});
  const rows = res.data?.data ?? [];
  const slugs = [
    ...new Set(
      rows
        .map(({ slug }) => slug)
        .filter(
          (slug): slug is string => typeof slug === 'string' && slug.length > 0,
        ),
    ),
  ];
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;

  const openGraph: Metadata['openGraph'] = {
    ...pageOpenGraph.earn,
    url: `${getSiteUrl()}${AppPaths.Earn}/${slug}`,
  };

  // TODO: LF-14987: Implement Metadata; use pageMetadataFields.earnOpportunity.title properly
  return {
    title: pageMetadataFields.earn.title,
    description: pageMetadataFields.earn.description,
    alternates: {
      canonical: `${getSiteUrl()}${AppPaths.Earn}/${slug}`,
    },
    openGraph,
    twitter: {
      ...pageTwitter.earn,
    },
  };
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;

  if (!slug) {
    return notFound();
  }

  const queryClient = new QueryClient();

  const [opportunity] = await Promise.all([
    queryClient
      .fetchQuery({
        queryKey: earnOpportunityBySlugQueryKey(slug),
        queryFn: () => fetchEarnOpportunityBySlug(slug),
      })
      .catch(() => null),
    queryClient.prefetchQuery({
      queryKey: earnRelatedMarketsQueryKey(slug),
      queryFn: () => fetchEarnRelatedMarkets(slug),
    }),
  ]);

  if (!opportunity) {
    return notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<EarnPageSkeleton />}>
        <EarnPage slug={slug} />
      </Suspense>
    </HydrationBoundary>
  );
}
