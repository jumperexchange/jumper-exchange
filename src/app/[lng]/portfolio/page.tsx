import { AppPaths, getSiteUrl } from '@/const/urls';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { PortfolioPage } from 'src/app/ui/portfolio/PortfolioPage';
import { PortfolioPageSkeleton } from 'src/app/ui/portfolio/PortfolioPageSkeleton';

export const metadata: Metadata = {
  title: 'Jumper Portfolio',
  description: `Manage your Jumper portfolio and track your assets across all chains.`,
  alternates: {
    canonical: `${getSiteUrl()}${AppPaths.Portfolio}`,
  },
};

export default async function Page() {
  return (
    <Suspense fallback={<PortfolioPageSkeleton />}>
      <PortfolioPage />
    </Suspense>
  );
}
