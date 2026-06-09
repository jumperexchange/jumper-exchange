import {
  pageMetadataFields,
  pageOpenGraph,
  pageTwitter,
} from '@/app/lib/metadata';
import { getOpportunitiesFiltered } from '@/app/lib/getOpportunitiesFiltered';
import { EarnPageContent } from '@/app/ui/earn/EarnPageContent';
import { EarnPageSkeleton } from '@/app/ui/earn/EarnPageSkeleton';
import { AppPaths, getSiteUrl } from '@/const/urls';
import type { Metadata } from 'next/types';
import envConfig from '@/config/env-config';
import { Suspense } from 'react';

type Params = Promise<{ slug: string }>;

export const dynamicParams = true;
export const revalidate = 300;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  if (envConfig.NEXT_PUBLIC_ENVIRONMENT !== 'production') {
    return [];
  }
  const res = await getOpportunitiesFiltered({});
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

  return (
    <Suspense fallback={<EarnPageSkeleton />}>
      <EarnPageContent slug={slug} />
    </Suspense>
  );
}
