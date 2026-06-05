import {
  pageMetadataFields,
  pageOpenGraph,
  pageTwitter,
} from '@/app/lib/metadata';
import { getOpportunitiesFilteredCached } from '@/app/lib/getOpportunitiesFiltered';
import { EarnPage } from '@/app/ui/earn/EarnPage';
import { AppPaths, getSiteUrl } from '@/const/urls';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next/types';
import envConfig from '@/config/env-config';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { earnOpportunityBySlugQueryKey } from 'src/hooks/earn/useEarnOpportunityBySlug';
import { earnRelatedMarketsQueryKey } from 'src/hooks/earn/useEarnRelatedMarkets';
import { getOpportunityBySlugCached } from 'src/app/lib/getOpportunityBySlug';
import { getOpportunityRelatedMarketCached } from 'src/app/lib/getOpportunityRelatedMarket';

type Params = Promise<{ slug: string }>;

export const dynamicParams = true;
export const revalidate = 300;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  if (envConfig.NEXT_PUBLIC_ENVIRONMENT !== 'production') {
    return [];
  }
  const res = await getOpportunitiesFilteredCached({});
  const rows = res.data ?? [];
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
        queryFn: async () => {
          const result = await getOpportunityBySlugCached(slug);
          return result.data;
        },
      })
      .catch(() => null),
    queryClient
      .prefetchQuery({
        queryKey: earnRelatedMarketsQueryKey(slug),
        queryFn: async () => {
          const result = await getOpportunityRelatedMarketCached(slug);
          return result.data;
        },
      })
      .catch(() => []),
  ]);

  if (!opportunity) {
    return notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EarnPage slug={slug} />
    </HydrationBoundary>
  );
}
