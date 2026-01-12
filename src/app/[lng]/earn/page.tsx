import {
  pageMetadataFields,
  pageOpenGraph,
  pageTwitter,
} from '@/app/lib/metadata';
import { EarnsPage, EarnsPageSkeleton } from '@/app/ui/earn';
import { AppPaths, getSiteUrl } from '@/const/urls';
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
  console.log('1. Earn page');

  return (
    <Suspense fallback={<EarnsPageSkeleton />}>
      <EarnsPage />
    </Suspense>
  );
}
