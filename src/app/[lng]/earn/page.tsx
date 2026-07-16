import {
  pageMetadataFields,
  pageOpenGraph,
  pageTwitter,
} from '@/app/lib/metadata';
import { EarnsPageContent } from '@/app/ui/earn/EarnsPageContent';
import { EarnsPageSkeleton } from '@/app/ui/earn/EarnsPageSkeleton';
import { AppPaths, getSiteUrl } from '@/const/urls';
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

export default function Page() {
  return (
    <Suspense fallback={<EarnsPageSkeleton />}>
      <EarnsPageContent />
    </Suspense>
  );
}
