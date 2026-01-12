import {
  pageMetadataFields,
  pageOpenGraph,
  pageTwitter,
} from '@/app/lib/metadata';
import { AppPaths, getSiteUrl } from '@/const/urls';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PortfolioPage } from 'src/app/ui/portfolio/PortfolioPage';
import { PortfolioPageSkeleton } from 'src/app/ui/portfolio/PortfolioPageSkeleton';

export const metadata: Metadata = {
  title: pageMetadataFields.portfolio.title,
  description: pageMetadataFields.portfolio.description,
  alternates: {
    canonical: `${getSiteUrl()}${AppPaths.Portfolio}`,
  },
  openGraph: {
    ...pageOpenGraph.portfolio,
    url: `${getSiteUrl()}${AppPaths.Portfolio}`,
  },
  twitter: {
    ...pageTwitter.portfolio,
  },
};

export default async function Page() {
  return (
    <Suspense fallback={<PortfolioPageSkeleton />}>
      <PortfolioPage />
    </Suspense>
  );
}
