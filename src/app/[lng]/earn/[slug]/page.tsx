import {
  pageMetadataFields,
  pageOpenGraph,
  pageTwitter,
} from '@/app/lib/metadata';
import { EarnPage, EarnPageSkeleton } from '@/app/ui/earn';
import { AppPaths, getSiteUrl } from '@/const/urls';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next/types';
import { Suspense } from 'react';

type Params = Promise<{ slug: string }>;

export const dynamicParams = true;
export const revalidate = 300;

export async function generateStaticParams(): Promise<Params[]> {
  console.log('21. Earn page generateStaticParams');

  // TODO: LF-14853: list available opportunities
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  console.log('20. Earn page metadata');
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
  console.log('22. Earn page');
  const { slug } = await params;

  console.log('24. Earn page slug', slug);

  if (!slug) {
    console.log('23. Earn page not found');
    return notFound();
  }

  try {
    return (
      <Suspense fallback={<EarnPageSkeleton />}>
        <EarnPage slug={slug} />
      </Suspense>
    );
  } catch (error) {
    console.error('26. Failed to fetch earn page', error);
    throw error;
  }
}
